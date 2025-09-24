import { getSessionUser } from '@/lib/supabase-server-ssr';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// User roles enum
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support'
}

// Enhanced user type with role information
export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: UserRole;
  profile?: any;
  app_metadata?: any;
  user_metadata?: any;
  aud: string;
  created_at: string;
  updated_at?: string;
}

// Initialize Supabase client for role checking
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Get user role from multiple sources (app_metadata, user_metadata, profile)
 */
async function getUserRole(user: any): Promise<UserRole> {
  // Check app_metadata first (set by Supabase Auth)
  if (user.app_metadata?.role) {
    return user.app_metadata.role as UserRole;
  }

  // Check user_metadata (set during signup)
  if (user.user_metadata?.role) {
    return user.user_metadata.role as UserRole;
  }

  // Check profile table
  try {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role) {
      return profile.role as UserRole;
    }
  } catch (error) {
    console.warn('[Auth] Could not fetch user profile for role:', error);
  }

  // Default to user role
  return UserRole.USER;
}

/**
 * Basic authentication requirement
 */
export async function requireAuth(): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user role
  const role = await getUserRole(user);

  const authenticatedUser: AuthenticatedUser = {
    ...user,
    role
  };

  return { user: authenticatedUser };
}

/**
 * Require specific role or higher
 */
export async function requireRole(requiredRole: UserRole): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { user } = auth;

  // Define role hierarchy
  const roleHierarchy = {
    [UserRole.USER]: 0,
    [UserRole.SUPPORT]: 1,
    [UserRole.MODERATOR]: 2,
    [UserRole.ADMIN]: 3
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  if (userLevel < requiredLevel) {
    return NextResponse.json({
      error: 'Forbidden',
      message: `Required role: ${requiredRole}, current role: ${user.role}`
    }, { status: 403 });
  }

  return { user };
}

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<{ user: AuthenticatedUser } | NextResponse> {
  return requireRole(UserRole.ADMIN);
}

/**
 * Require moderator role or higher
 */
export async function requireModerator(): Promise<{ user: AuthenticatedUser } | NextResponse> {
  return requireRole(UserRole.MODERATOR);
}

/**
 * Require support role or higher
 */
export async function requireSupport(): Promise<{ user: AuthenticatedUser } | NextResponse> {
  return requireRole(UserRole.SUPPORT);
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return false;

  const { user } = auth;

  // Define role permissions
  const rolePermissions = {
    [UserRole.USER]: [
      'view_products',
      'create_orders',
      'view_own_orders',
      'manage_own_profile',
      'add_to_cart',
      'write_reviews'
    ],
    [UserRole.SUPPORT]: [
      'view_products',
      'create_orders',
      'view_own_orders',
      'manage_own_profile',
      'add_to_cart',
      'write_reviews',
      'view_all_orders',
      'update_order_status',
      'manage_customer_support'
    ],
    [UserRole.MODERATOR]: [
      'view_products',
      'create_orders',
      'view_own_orders',
      'manage_own_profile',
      'add_to_cart',
      'write_reviews',
      'view_all_orders',
      'update_order_status',
      'manage_customer_support',
      'moderate_reviews',
      'manage_products',
      'view_analytics'
    ],
    [UserRole.ADMIN]: [
      'view_products',
      'create_orders',
      'view_own_orders',
      'manage_own_profile',
      'add_to_cart',
      'write_reviews',
      'view_all_orders',
      'update_order_status',
      'manage_customer_support',
      'moderate_reviews',
      'manage_products',
      'view_analytics',
      'manage_users',
      'manage_system_settings',
      'access_admin_panel',
      'manage_integrations',
      'view_financial_data'
    ]
  };

  const userPermissions = rolePermissions[user.role] || rolePermissions[UserRole.USER];
  return userPermissions.includes(permission);
}

/**
 * Require specific permission
 */
export async function requirePermission(permission: string): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { user } = auth;
  const hasRequiredPermission = await hasPermission(permission);

  if (!hasRequiredPermission) {
    return NextResponse.json({
      error: 'Forbidden',
      message: `Required permission: ${permission}`
    }, { status: 403 });
  }

  return { user };
}

