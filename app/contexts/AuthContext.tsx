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
  updateUserMetadata: (updates: any) => Promise<{ error?: string }>;
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
  // Get user role from multiple sources
  const getUserRole = async (authUser: User): Promise<{ role: UserRole, profile: any }> => {
    console.log('[AuthContext] Fetching role for user:', authUser.id);
    
    // Check profile table with timeout
    try {
      const fetchWithTimeout = async () => {
        const { data: profile, error } = await supabaseBrowser
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();
        return { profile, error };
      };

      // 15 second timeout for profile fetch (resilient to cold starts)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 15000)
      );

      const { profile, error } = await Promise.race([
        fetchWithTimeout(),
        timeoutPromise
      ]) as { profile: any, error: any };

      if (error && error.code !== 'PGRST116') {
         console.warn('[AuthContext] Error fetching profile:', error);
      }

      console.log('[AuthContext] Role/Profile fetched:', profile?.role || 'default');
      return {
         role: (profile?.role as UserRole) || UserRole.USER,
         profile: profile
      };
    } catch (error) {
      console.warn('[AuthContext] Resilient fallback triggered for user profile:', error);
      return { role: UserRole.USER, profile: null };
    }
  };

  // Get VIP status (Simplified now that we fetch full profile)
  const getVipStatus = (profile: any): boolean => {
      // Check both snake_case and camelCase just in case
      return !!(profile?.membership_tier_id || profile?.membershipTierId);
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabaseBrowser.auth.getSession();
        
        if (initialSession?.user) {
          const { role, profile } = await getUserRole(initialSession.user);
          const isVip = getVipStatus(profile);
          
          const authenticatedUser: AuthenticatedUser = {
            ...initialSession.user,
            role,
            isVip,
            // Merge profile data directly onto user object for easier access
            phone: profile?.phone || initialSession.user.phone,
            user_metadata: {
                ...initialSession.user.user_metadata,
                ...profile // Spread profile table data over metadata
            }
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
        console.log('[AuthContext] Auth state change event:', event);
        if (session?.user) {
          const { role, profile } = await getUserRole(session.user);
          const isVip = getVipStatus(profile);
          
          const authenticatedUser: AuthenticatedUser = {
            ...session.user,
            role,
            isVip,
            phone: profile?.phone || session.user.phone,
             user_metadata: {
                ...session.user.user_metadata,
                ...profile
            }
          } as AuthenticatedUser;

          setUser(authenticatedUser);
          setSession(session);
        } else {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
        console.log('[AuthContext] Loading set to false after event:', event);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      console.log('Attempting sign in with email:', email);
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password
      });
      console.log('Supabase sign in response received:', { error });

      if (error) {
        console.error('Supabase auth error:', error.message);
        return { error: error.message };
      }

      console.log('Sign in successful');
      
      // Store remember me preference for client-side persistence logic
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      return {};
    } catch (error) {
      console.error('SignIn fatal error:', error);
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

  // Update profile function (public.users table)
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

  // Update user metadata (auth.users metadata)
  const updateUserMetadata = async (updates: any) => {
    try {
      const { data, error } = await supabaseBrowser.auth.updateUser({
        data: updates
      });

      if (error) {
        return { error: error.message };
      }
      
      // Update local state is handled by onAuthStateChange logic, 
      // but we might want to ensure it reflects immediately if needed.
      // The subscription should catch it.

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
    updateUserMetadata,
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
