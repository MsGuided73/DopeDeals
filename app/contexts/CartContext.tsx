"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { getCart, getSessionId, ensureSessionId, initializeCart, type Cart } from '../lib/cart-utils';

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRefreshingRef = useRef(false);

  const refreshCart = async () => {
    // Prevent recursive calls
    if (isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;
    setIsLoading(true);

    try {
      // Wait for window to be available
      if (typeof window === 'undefined') {
        // Server-side, set empty cart
        setCart({
          items: [],
          itemCount: 0,
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          total: 0
        });
        setIsLoading(false);
        return;
      }

      // Client-side: ensure session exists before trying to load cart
      const sessionId = ensureSessionId();

      if (sessionId) {
        try {
          const cartData = await getCart();
          setCart(cartData);
        } catch (cartError) {
          console.error('Cart loading error:', cartError);
          // Set empty cart if cart loading fails
          setCart({
            items: [],
            itemCount: 0,
            subtotal: 0,
            taxAmount: 0,
            shippingAmount: 0,
            total: 0
          });
        }
      } else {
        // No session, set empty cart
        setCart({
          items: [],
          itemCount: 0,
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          total: 0
        });
      }
    } catch (error) {
      console.error('Error in refreshCart:', error);
      // Set empty cart on any error
      setCart({
        items: [],
        itemCount: 0,
        subtotal: 0,
        taxAmount: 0,
        shippingAmount: 0,
        total: 0
      });
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  };

  useEffect(() => {
    // Only run on client side after hydration
    let mounted = true;

    const initCart = async () => {
      if (!mounted) return;

      // Ensure session ID exists before initializing cart
      if (typeof window !== 'undefined') {
        ensureSessionId();
      }

      if (mounted) {
        refreshCart();
      }
    };

    // Initialize cart session handling (storage listeners, etc.)
    if (typeof window !== 'undefined') {
      initializeCart();
    }

    initCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      if (mounted) {
        refreshCart();
      }
    };

    // Also listen for session changes
    const handleSessionChange = () => {
      if (mounted) {
        refreshCart();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('cartSessionChanged', handleSessionChange);

    return () => {
      mounted = false;
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('cartSessionChanged', handleSessionChange);
    };
  }, []);

  const cartCount = cart?.itemCount || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, isLoading, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    // Return safe defaults when used outside provider
    return {
      cart: null,
      cartCount: 0,
      isLoading: false,
      refreshCart: async () => {},
    };
  }
  return context;
}
