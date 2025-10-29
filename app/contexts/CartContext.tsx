"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCart, getSessionId, ensureSessionId, type Cart } from '../lib/cart-utils';

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

  const refreshCart = async () => {
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
    }
  };

  useEffect(() => {
    // Only run on client side after hydration
    let mounted = true;

    const initCart = async () => {
      if (!mounted) return;

      // Small delay to ensure hydration is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      if (mounted) {
        refreshCart();
      }
    };

    initCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      if (mounted) {
        refreshCart();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('cartUpdated', handleCartUpdate);
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
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
