import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, UserBehavior, UserPreferences } from '@shared/schema';

export interface UseRecommendationsProps {
  userId: string;
  enabled?: boolean;
}

export interface TrackBehaviorData {
  userId: string;
  productId: string;
  action: 'view' | 'add_to_cart' | 'purchase' | 'wishlist' | 'search';
  sessionId?: string;
  metadata?: Record<string, any>;
}

export function useRecommendations(userId: string, type: 'trending' | 'personalized' | 'similar' | 'category_based', limit: number = 8) {
  return useQuery({
    queryKey: ['/api/recommendations', userId, type, limit],
    queryFn: async () => {
      const response = await fetch(`/api/recommendations/${userId}?type=${type}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return response.json() as Promise<Product[]>;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
}

export function useUserBehavior(userId: string, limit: number = 50) {
  return useQuery({
    queryKey: ['/api/user-behavior', userId, limit],
    queryFn: async () => {
      const response = await fetch(`/api/user-behavior/${userId}?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user behavior');
      }
      return response.json() as Promise<UserBehavior[]>;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}

export function useUserPreferences(userId: string) {
  return useQuery({
    queryKey: ['/api/user-preferences', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user-preferences/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user preferences');
      }
      return response.json() as Promise<UserPreferences>;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}

export function useTrackBehavior() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TrackBehaviorData) => {
      const response = await fetch('/api/user-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to track behavior');
      }
      
      return response.json() as Promise<UserBehavior>;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-behavior', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-preferences', variables.userId] });
    },
  });
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, preferences }: { userId: string; preferences: Partial<UserPreferences> }) => {
      const response = await fetch(`/api/user-preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }
      
      return response.json() as Promise<UserPreferences>;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-preferences', variables.userId] });
    },
  });
}

// Helper hook for session management
export function useSessionId() {
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('vip_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('vip_session_id', sessionId);
    }
    return sessionId;
  };

  return { getSessionId };
}

// Helper hook for automatic behavior tracking
export function useAutoTrackBehavior() {
  const trackBehavior = useTrackBehavior();
  const { getSessionId } = useSessionId();

  const trackProductView = (userId: string, productId: string, metadata?: Record<string, any>) => {
    trackBehavior.mutate({
      userId,
      productId,
      action: 'view',
      sessionId: getSessionId(),
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  };

  const trackAddToCart = (userId: string, productId: string, metadata?: Record<string, any>) => {
    trackBehavior.mutate({
      userId,
      productId,
      action: 'add_to_cart',
      sessionId: getSessionId(),
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  };

  const trackPurchase = (userId: string, productId: string, metadata?: Record<string, any>) => {
    trackBehavior.mutate({
      userId,
      productId,
      action: 'purchase',
      sessionId: getSessionId(),
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  };

  const trackWishlist = (userId: string, productId: string, metadata?: Record<string, any>) => {
    trackBehavior.mutate({
      userId,
      productId,
      action: 'wishlist',
      sessionId: getSessionId(),
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  };

  const trackSearch = (userId: string, searchTerm: string, metadata?: Record<string, any>) => {
    trackBehavior.mutate({
      userId,
      productId: '', // No specific product for search
      action: 'search',
      sessionId: getSessionId(),
      metadata: {
        searchTerm,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  };

  return {
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackWishlist,
    trackSearch,
    isTracking: trackBehavior.isPending,
  };
}