import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '../../../../lib/requireAuth';
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

interface UserParams {
  userId: string;
}

/**
 * GET /api/admin/users/[userId] - Get user details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  // Require manage_users permission (admin only)
  const auth = await requirePermission('manage_users');
  if (auth instanceof NextResponse) return auth;

  try {
    const { userId } = await params;

    // Get user profile with related data
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        first_name,
        last_name,
        full_name,
        role,
        age_verification_status,
        membership_tier_id,
        is_active,
        created_at,
        last_login_at,
        login_count,
        last_verification_check,
        memberships(
          id,
          tier_name,
          benefits,
          discount_percentage,
          is_active
        ),
        orders(
          id,
          order_number,
          status,
          total_amount,
          created_at
        )
      `)
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      console.error('[Admin User API] Error fetching user:', error);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }

    // Get auth user data
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError) {
      console.error('[Admin User API] Error fetching auth user:', authError);
    }

    // Combine profile and auth data
    const userData = {
      ...user,
      authData: authUser?.user ? {
        email: authUser.user.email,
        emailConfirmedAt: authUser.user.email_confirmed_at,
        lastSignInAt: authUser.user.last_sign_in_at,
        appMetadata: authUser.user.app_metadata,
        userMetadata: authUser.user.user_metadata
      } : null
    };

    return NextResponse.json({ user: userData });

  } catch (error) {
    console.error('[Admin User API] Error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/users/[userId] - Update user
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  // Require manage_users permission (admin only)
  const auth = await requirePermission('manage_users');
  if (auth instanceof NextResponse) return auth;

  try {
    const { userId } = await params;
    const body = await req.json().catch(() => ({}));
    
    const parse = UpdateUserSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ 
        error: 'Invalid update data', 
        issues: parse.error.issues 
      }, { status: 400 });
    }

    const updates = parse.data;

    // Map updates to snake_case for DB
    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.role) dbUpdates.role = updates.role;
    if (updates.firstName) dbUpdates.first_name = updates.firstName;
    if (updates.lastName) dbUpdates.last_name = updates.lastName;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.ageVerificationStatus) dbUpdates.age_verification_status = updates.ageVerificationStatus;
    if (updates.membershipTierId) dbUpdates.membership_tier_id = updates.membershipTierId;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    // Update user profile
    const { error: profileError } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId);

    if (profileError) {
      console.error('[Admin User API] Error updating profile:', profileError);
      return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
    }

    // Update auth metadata if role or email is being changed
    const authUpdates: any = {};
    
    if (updates.role) {
      authUpdates.app_metadata = { role: updates.role };
    }
    
    if (updates.email) {
      authUpdates.email = updates.email;
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, authUpdates);
      
      if (authError) {
        console.error('[Admin User API] Error updating auth data:', authError);
        return NextResponse.json({ error: 'Failed to update user authentication data' }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      message: 'User updated successfully',
      updates 
    });

  } catch (error) {
    console.error('[Admin User API] Error in PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/[userId] - Delete user (soft delete)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  // Require manage_users permission (admin only)
  const auth = await requirePermission('manage_users');
  if (auth instanceof NextResponse) return auth;

  try {
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const hardDelete = searchParams.get('hard') === 'true';

    if (hardDelete) {
      // Hard delete - remove from auth and database
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('[Admin User API] Error deleting auth user:', authError);
        return NextResponse.json({ error: 'Failed to delete user from authentication' }, { status: 500 });
      }

      // Profile will be deleted via cascade or trigger
      return NextResponse.json({ message: 'User permanently deleted' });

    } else {
      // Soft delete - mark as inactive
      const { error: profileError } = await supabase
        .from('users')
        .update({ 
          is_active: false,
          deleted_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (profileError) {
        console.error('[Admin User API] Error soft deleting user:', profileError);
        return NextResponse.json({ error: 'Failed to deactivate user' }, { status: 500 });
      }

      return NextResponse.json({ message: 'User deactivated successfully' });
    }

  } catch (error) {
    console.error('[Admin User API] Error in DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
