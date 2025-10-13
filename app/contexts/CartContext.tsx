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
      if (typeof window !== 'undefined') {
        // Only try to load cart if we have a session
        // This prevents the "User ID or session ID required" error on page load
        const sessionId = getSessionId();
        if (sessionId && sessionId !== '') {
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
          // No session yet, set empty cart
          setCart({
            items: [],
            itemCount: 0,
            subtotal: 0,
            taxAmount: 0,
            shippingAmount: 0,
            total: 0
          });
        }
      }
    } catch (error) {
      console.error('Error in refreshCart:', error);
      // Set empty cart on any error to prevent app breaking
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
    // Ensure session ID exists before trying to load cart
    if (typeof window !== 'undefined') {
      ensureSessionId();
    }

    refreshCart();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      refreshCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
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
