import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, UserRole } from '../../../lib/requireAuth';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema for user updates
const UpdateUserSchema = z.object({
  role: z.enum(['user', 'support', 'moderator', 'admin']).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  ageVerificationStatus: z.enum(['not_verified', 'pending', 'verified', 'failed']).optional(),
  membershipTierId: z.string().uuid().optional(),
  isActive: z.boolean().optional()
});

// Schema for creating users
const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['user', 'support', 'moderator', 'admin']).default('user')
});

/**
 * GET /api/admin/users - List all users with pagination and filtering
 */
export async function GET(req: NextRequest) {
  // Require manage_users permission (admin only)
  const auth = await requirePermission('manage_users');
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        firstName,
        lastName,
        role,
        ageVerificationStatus,
        membershipTierId,
        isActive,
        createdAt,
        lastLoginAt,
        loginCount,
        memberships(tierName, benefits)
      `, { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`email.ilike.%${search}%,firstName.ilike.%${search}%,lastName.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq('role', role);
    }

    if (status === 'active') {
      query = query.eq('isActive', true);
    } else if (status === 'inactive') {
      query = query.eq('isActive', false);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Order by creation date (newest first)
    query = query.order('createdAt', { ascending: false });

    const { data: users, error, count } = await query;

    if (error) {
      console.error('[Admin Users API] Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({
      users: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('[Admin Users API] Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users - Create a new user
 */
export async function POST(req: NextRequest) {
  // Require manage_users permission (admin only)
  const auth = await requirePermission('manage_users');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json().catch(() => ({}));
    const parse = CreateUserSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid user data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const { email, password, firstName, lastName, role } = parse.data;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role },
      user_metadata: { firstName, lastName }
    });

    if (authError) {
      console.error('[Admin Users API] Error creating auth user:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        firstName,
        lastName,
        fullName: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        role,
        ageVerificationStatus: 'not_verified',
        isActive: true,
        createdAt: new Date().toISOString()
      });

    if (profileError) {
      console.error('[Admin Users API] Error creating user profile:', profileError);
      // Try to clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email,
        firstName,
        lastName,
        role
      }
    });

  } catch (error) {
    console.error('[Admin Users API] Error in POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/users - Bulk update users
 */
export async function PATCH(req: NextRequest) {
  // Require manage_users permission (admin only)
  const auth = await requirePermission('manage_users');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json().catch(() => ({}));
    const { userIds, updates } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'User IDs array is required' }, { status: 400 });
    }

    const parse = UpdateUserSchema.safeParse(updates);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid update data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const validUpdates = parse.data;
    const results = [];

    for (const userId of userIds) {
      try {
        // Update profile
        const { error: profileError } = await supabase
          .from('users')
          .update(validUpdates)
          .eq('id', userId);

        if (profileError) {
          results.push({ userId, success: false, error: profileError.message });
          continue;
        }

        // Update auth metadata if role is being changed
        if (validUpdates.role) {
          const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
            app_metadata: { role: validUpdates.role }
          });

          if (authError) {
            results.push({ userId, success: false, error: authError.message });
            continue;
          }
        }

        results.push({ userId, success: true });

      } catch (error) {
        results.push({ userId, success: false, error: 'Unexpected error' });
      }
    }

    return NextResponse.json({
      message: 'Bulk update completed',
      results,
      summary: {
        total: userIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('[Admin Users API] Error in PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
