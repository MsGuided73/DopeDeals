'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseBrowser } from '../lib/supabase-browser';

interface FavoriteProduct {
  id: string;
  sku: string;
  name: string;
  image_url?: string;
  price: number;
}

// Local storage key for guest favorites
const GUEST_FAVORITES_KEY = 'guest_favorites';

export function useFavorites() {
  const { user, session } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from database for authenticated users
  const loadUserFavorites = useCallback(async () => {
    if (!user || !session) {
      // If not authenticated, clear state
      setFavorites(new Set());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: favoritesData, error: fetchError } = await supabaseBrowser
        .from('user_favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Error loading user favorites:', fetchError);
        setError(fetchError.message);
        return;
      }

      const favoriteSkus = new Set(favoritesData?.map(f => f.product_id) || []);
      setFavorites(favoriteSkus);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  // Load favorites from localStorage for guest users
  const loadGuestFavorites = useCallback(() => {
    try {
      const stored = localStorage.getItem(GUEST_FAVORITES_KEY);
      if (stored) {
        // Validate that stored data is valid JSON and an array
        const favoriteSkus = JSON.parse(stored);
        if (Array.isArray(favoriteSkus)) {
          setFavorites(new Set(favoriteSkus));
        } else {
          console.warn('Invalid favorites data format, resetting to empty');
          setFavorites(new Set());
          // Clear corrupted data
          localStorage.removeItem(GUEST_FAVORITES_KEY);
        }
      } else {
        setFavorites(new Set());
      }
    } catch (err) {
      console.error('Error loading guest favorites:', err);
      setFavorites(new Set());
      // Clear corrupted data
      try {
        localStorage.removeItem(GUEST_FAVORITES_KEY);
      } catch (storageErr) {
        console.error('Error clearing corrupted favorites data:', storageErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Save guest favorites to localStorage
  const saveGuestFavorites = useCallback((favoritesSet: Set<string>) => {
    try {
      localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(Array.from(favoritesSet)));
    } catch (err) {
      console.error('Error saving guest favorites:', err);
    }
  }, []);

  // Load favorites when component mounts or user changes
  useEffect(() => {
    if (user && session) {
      loadUserFavorites();
    } else {
      loadGuestFavorites();
    }
  }, [user, session, loadUserFavorites, loadGuestFavorites]);

  // Add favorite function
  const addFavorite = useCallback(async (productSku: string) => {
    if (!productSku) return false;

    try {
      if (user && session) {
        // Authenticated user - save to database
        const { error: insertError } = await supabaseBrowser
          .from('user_favorites')
          .insert({
            user_id: user.id,
            product_id: productSku,
          });

        if (insertError) {
          // Ignore duplicate key errors (user already favorited this product)
          if (insertError.code !== '23505') {
            console.error('Error adding favorite:', insertError);
            setError(insertError.message);
            return false;
          }
        }

        setFavorites(prev => new Set([...prev, productSku]));
      } else {
        // Guest user - save to localStorage
        setFavorites(prev => {
          const newFavorites = new Set([...prev, productSku]);
          saveGuestFavorites(newFavorites);
          return newFavorites;
        });
      }

      setError(null);
      return true;
    } catch (err) {
      console.error('Error adding favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to add favorite');
      return false;
    }
  }, [user, session, saveGuestFavorites]);

  // Remove favorite function
  const removeFavorite = useCallback(async (productSku: string) => {
    if (!productSku) return false;

    try {
      if (user && session) {
        // Authenticated user - remove from database
        const { error: deleteError } = await supabaseBrowser
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productSku);

        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          setError(deleteError.message);
          return false;
        }

        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productSku);
          return newFavorites;
        });
      } else {
        // Guest user - remove from localStorage
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productSku);
          saveGuestFavorites(newFavorites);
          return newFavorites;
        });
      }

      setError(null);
      return true;
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
      return false;
    }
  }, [user, session, saveGuestFavorites]);

  // Toggle favorite function
  const toggleFavorite = useCallback(async (productSku: string) => {
    if (!productSku) return;

    if (isFavorite(productSku)) {
      return await removeFavorite(productSku);
    } else {
      return await addFavorite(productSku);
    }
  }, [addFavorite, removeFavorite]);

  // Check if product is favorited
  const isFavorite = useCallback((productSku: string) => {
    return favorites.has(productSku);
  }, [favorites]);

  // Get list of favorite SKUs
  const getFavoriteSkus = useCallback(() => {
    return Array.from(favorites);
  }, [favorites]);

  // Get count of favorites
  const getFavoritesCount = useCallback(() => {
    return favorites.size;
  }, [favorites]);

  return {
    favorites: favorites,
    loading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    getFavoriteSkus,
    getFavoritesCount,
    reloadFavorites: user && session ? loadUserFavorites : loadGuestFavorites,
  };
}
