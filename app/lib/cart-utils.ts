import toast from 'react-hot-toast';

// Cart utility functions with toast notifications

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtTime: number;
  itemTotal: number;
  product: {
    id: string;
    name: string;
    description?: string;
    sku: string;
    currentPrice: number;
    vipPrice?: number;
    imageUrl?: string;
    stockQuantity: number;
    isActive: boolean;
    inStock: boolean;
  } | null;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
}

// Get session ID for guest users
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

// Add item to cart with toast notification
export const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
  const sessionId = getSessionId();

  const loadingToast = toast.loading('Adding to cart...');

  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        productId,
        quantity,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add item to cart');
    }

    const result = await response.json();

    toast.dismiss(loadingToast);
    toast.success(`Added ${result.product?.name || 'item'} to cart!`, {
      duration: 3000,
      icon: '🛒',
    });

    // Trigger cart refresh event for global state
    window.dispatchEvent(new CustomEvent('cartUpdated'));

    return true;
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(error instanceof Error ? error.message : 'Failed to add item to cart');
    return false;
  }
};

// Update cart item quantity with toast notification
export const updateCartQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
  const sessionId = getSessionId();
  
  const loadingToast = toast.loading('Updating cart...');
  
  try {
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        itemId,
        quantity,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update cart');
    }

    toast.dismiss(loadingToast);
    toast.success('Cart updated!', {
      duration: 2000,
      icon: '✅',
    });
    
    return true;
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(error instanceof Error ? error.message : 'Failed to update cart');
    return false;
  }
};

// Remove item from cart with toast notification
export const removeFromCart = async (itemId: string): Promise<boolean> => {
  const sessionId = getSessionId();
  
  const loadingToast = toast.loading('Removing from cart...');
  
  try {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        itemId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove item from cart');
    }

    toast.dismiss(loadingToast);
    toast.success('Item removed from cart', {
      duration: 2000,
      icon: '🗑️',
    });
    
    return true;
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(error instanceof Error ? error.message : 'Failed to remove item from cart');
    return false;
  }
};

// Get cart with error handling
export const getCart = async (): Promise<Cart | null> => {
  const sessionId = getSessionId();
  
  try {
    const response = await fetch(`/api/cart?sessionId=${sessionId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        // Empty cart is normal
        return {
          items: [],
          itemCount: 0,
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          total: 0,
        };
      }
      throw new Error('Failed to fetch cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    toast.error('Failed to load cart');
    return null;
  }
};

// Clear entire cart
export const clearCart = async (): Promise<boolean> => {
  const sessionId = getSessionId();
  
  const loadingToast = toast.loading('Clearing cart...');
  
  try {
    const response = await fetch('/api/cart/clear', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    toast.dismiss(loadingToast);
    toast.success('Cart cleared!', {
      duration: 2000,
      icon: '🧹',
    });
    
    return true;
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('Failed to clear cart');
    return false;
  }
};

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Calculate cart totals
export const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const taxRate = 0.08; // 8% tax rate - adjust as needed
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + taxAmount + shippingAmount;

  return {
    subtotal,
    taxAmount,
    shippingAmount,
    total,
  };
};
