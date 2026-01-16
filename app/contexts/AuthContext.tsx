'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseBrowser } from '../lib/supabase-browser';
import { UserRole, type AuthenticatedUser } from '../types/auth';

interface AuthContextType {
  user: AuthenticatedUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: string }>;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isVip: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user role from multiple sources
  const getUserRole = async (authUser: User): Promise<UserRole> => {
    // Check app_metadata first
    if (authUser.app_metadata?.role) {
      return authUser.app_metadata.role as UserRole;
    }

    // Check user_metadata
    if (authUser.user_metadata?.role) {
      return authUser.user_metadata.role as UserRole;
    }

    // Check profile table
    try {
      // Use a more resilient approach in case columns are missing
      const { data: profile } = await supabaseBrowser
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile && 'role' in profile && profile.role) {
        return profile.role as UserRole;
      }
    } catch (error) {
      console.warn('[AuthContext] Could not fetch user profile for role:', error);
    }

    return UserRole.USER;
  };

  // Get VIP status
  const getVipStatus = async (userId: string): Promise<boolean> => {
    try {
      // Use a more resilient approach in case columns or relationships are missing
      const { data: profile } = await supabaseBrowser
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile) return false;

      // Check both snake_case and camelCase for compatibility
      const tierId = profile.membership_tier_id || profile.membershipTierId;
      
      return !!tierId;
    } catch (error) {
      console.warn('[AuthContext] Could not fetch VIP status:', error);
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabaseBrowser.auth.getSession();
        
        if (initialSession?.user) {
          const role = await getUserRole(initialSession.user);
          const isVip = await getVipStatus(initialSession.user.id);
          
          const authenticatedUser: AuthenticatedUser = {
            ...initialSession.user,
            role,
            isVip
          } as AuthenticatedUser;

          setUser(authenticatedUser);
          setSession(initialSession);
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const role = await getUserRole(session.user);
          const isVip = await getVipStatus(session.user.id);
          
          const authenticatedUser: AuthenticatedUser = {
            ...session.user,
            role,
            isVip
          } as AuthenticatedUser;

          setUser(authenticatedUser);
          setSession(session);
        } else {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      // Store remember me preference for client-side persistence logic
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const { error } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
            fullName: firstName && lastName ? `${firstName} ${lastName}` : undefined
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabaseBrowser.auth.signOut();
  };

  // Update profile function
  const updateProfile = async (updates: any) => {
    try {
      if (!user) {
        return { error: 'No user logged in' };
      }

      const { error } = await supabaseBrowser
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

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
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasPermission,
    isAdmin: user?.role === UserRole.ADMIN,
    isVip: user?.isVip || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
