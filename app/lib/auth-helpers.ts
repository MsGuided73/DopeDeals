/**
 * Authentication Helpers
 * 
 * Comprehensive authentication utilities for both client and server-side
 * authentication, role-based access control, and protected route handling.
 */

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/supabase-server-ssr';
import { UserRole, type AuthenticatedUser } from '../types/auth';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Server-side authentication check with redirect
 */
export async function requireAuthWithRedirect(redirectTo?: string): Promise<AuthenticatedUser> {
  const user = await getSessionUser();
  
  if (!user) {
    const authUrl = redirectTo 
      ? `/(public)/auth?redirectTo=${encodeURIComponent(redirectTo)}`
      : '/(public)/auth';
    redirect(authUrl);
  }

  // Get user role
  const role = await getUserRole(user);
  
  return {
    ...user,
    role
  } as AuthenticatedUser;
}

/**
 * Server-side admin check with redirect
 */
export async function requireAdminWithRedirect(): Promise<AuthenticatedUser> {
  const user = await requireAuthWithRedirect();
  
  if (user.role !== UserRole.ADMIN) {
    redirect('/'); // Redirect non-admin users to home
  }
  
  return user;
}

/**
 * Server-side role check with redirect
 */
export async function requireRoleWithRedirect(requiredRole: UserRole): Promise<AuthenticatedUser> {
  const user = await requireAuthWithRedirect();
  
  const roleHierarchy = {
    [UserRole.USER]: 0,
    [UserRole.SUPPORT]: 1,
    [UserRole.MODERATOR]: 2,
    [UserRole.ADMIN]: 3
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  if (userLevel < requiredLevel) {
    redirect('/'); // Redirect insufficient role users to home
  }
  
  return user;
}

/**
 * Get user role from multiple sources
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
    console.warn('[Auth Helpers] Could not fetch user profile for role:', error);
  }

  // Default to user role
  return UserRole.USER;
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  try {
    // Update in auth metadata
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: newRole }
    });

    if (authError) {
      console.error('[Auth Helpers] Error updating auth metadata:', authError);
      return false;
    }

    // Update in profile table
    const { error: profileError } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (profileError) {
      console.error('[Auth Helpers] Error updating profile role:', profileError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Auth Helpers] Error updating user role:', error);
    return false;
  }
}

/**
 * Create user profile on signup
 */
export async function createUserProfile(user: any, additionalData?: any): Promise<boolean> {
  try {
    const profileData = {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.firstName || user.user_metadata?.first_name,
      lastName: user.user_metadata?.lastName || user.user_metadata?.last_name,
      fullName: user.user_metadata?.fullName || user.user_metadata?.full_name,
      role: user.app_metadata?.role || UserRole.USER,
      ageVerificationStatus: 'not_verified',
      createdAt: new Date().toISOString(),
      ...additionalData
    };

    const { error } = await supabase
      .from('users')
      .upsert(profileData, { onConflict: 'id' });

    if (error) {
      console.error('[Auth Helpers] Error creating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Auth Helpers] Error creating user profile:', error);
    return false;
  }
}

/**
 * Check if user has completed age verification
 */
export async function isAgeVerified(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('users')
      .select('ageVerificationStatus')
      .eq('id', userId)
      .single();

    return profile?.ageVerificationStatus === 'verified';
  } catch (error) {
    console.error('[Auth Helpers] Error checking age verification:', error);
    return false;
  }
}

/**
 * Update age verification status
 */
export async function updateAgeVerification(userId: string, status: 'verified' | 'pending' | 'failed'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        ageVerificationStatus: status,
        lastVerificationCheck: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('[Auth Helpers] Error updating age verification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Auth Helpers] Error updating age verification:', error);
    return false;
  }
}

/**
 * Get user's VIP membership status
 */
export async function getVipMembershipStatus(userId: string): Promise<{
  isVip: boolean;
  tier?: string;
  membershipId?: string;
}> {
  try {
    const { data: profile } = await supabase
      .from('users')
      .select('membershipTierId, memberships(*)')
      .eq('id', userId)
      .single();

    if (profile?.membershipTierId && profile.memberships) {
      const membership = Array.isArray(profile.memberships) ? profile.memberships[0] : profile.memberships;
      return {
        isVip: true,
        tier: membership?.tierName || 'basic',
        membershipId: profile.membershipTierId
      };
    }

    return { isVip: false };
  } catch (error) {
    console.error('[Auth Helpers] Error getting VIP status:', error);
    return { isVip: false };
  }
}

/**
 * Check if user can access VIP-exclusive products
 */
export async function canAccessVipProducts(userId: string): Promise<boolean> {
  const vipStatus = await getVipMembershipStatus(userId);
  return vipStatus.isVip;
}

/**
 * Log user activity for analytics
 */
export async function logUserActivity(userId: string, activity: string, metadata?: any): Promise<void> {
  try {
    // Update last login time
    const { data: currentUser } = await supabase
      .from('users')
      .select('loginCount')
      .eq('id', userId)
      .single();

    await supabase
      .from('users')
      .update({
        lastLoginAt: new Date().toISOString(),
        loginCount: (currentUser?.loginCount || 0) + 1
      })
      .eq('id', userId);

    // Log activity (if activity logging table exists)
    // This could be extended to include detailed activity tracking
    console.log(`[Auth Helpers] User activity: ${userId} - ${activity}`, metadata);
  } catch (error) {
    console.error('[Auth Helpers] Error logging user activity:', error);
  }
}

/**
 * Get user permissions based on role
 */
export function getUserPermissions(role: UserRole): string[] {
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

  return rolePermissions[role] || rolePermissions[UserRole.USER];
}

/**
 * Check if user has specific permission
 */
export function userHasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = getUserPermissions(userRole);
  return permissions.includes(permission);
}
