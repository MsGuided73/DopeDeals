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
    sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

// Ensure session ID exists (call this on app initialization)
export const ensureSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

// Store/retrieve the page where user came from to return after cart
export const storeShopReferer = (url?: string) => {
  if (typeof window === 'undefined') return;
  const refererUrl = url || window.location.href;
  localStorage.setItem('shop_referer', refererUrl);
};

export const getShopReferer = (): string => {
  if (typeof window === 'undefined') return '/products';
  const stored = localStorage.getItem('shop_referer');
  return stored || '/products';
};

// Add item to cart with toast notification and optional redirect to cart
export const addToCart = async (
  productId: string,
  quantity: number = 1,
  redirectToCart: boolean = false,
  router?: any
): Promise<boolean> => {
  const sessionId = getSessionId();

  // Store current page for Continue Shopping functionality
  storeShopReferer();

  const loadingToast = toast.loading('Adding to cart...');

  try {
    // Use the new cart API structure
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({
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
    toast.success(`🔥 ${result.product?.name || 'item'} added to cart!`, {
      duration: 3000,
    });

    // Trigger cart refresh event for global state
    window.dispatchEvent(new CustomEvent('cartUpdated'));

    // Redirect to cart page after successful addition if requested
    if (redirectToCart && router) {
      router.push('/cart');
    }

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
    // Use the new cart API structure
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({
        cartItemId: itemId,
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

    // Trigger cart refresh event for global state
    window.dispatchEvent(new CustomEvent('cartUpdated'));

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
    // Use PUT with quantity=0 to remove the item
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({
        cartItemId: itemId,
        quantity: 0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove item from cart');
    }

    const data = await response.json();

    toast.dismiss(loadingToast);
    toast.success('Item removed from cart', {
      duration: 2000,
      icon: '🗑️',
    });

    // Trigger cart refresh event for global state
    window.dispatchEvent(new CustomEvent('cartUpdated'));

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
    const response = await fetch('/api/cart', {
      headers: {
        'x-session-id': sessionId, // Add session ID to headers for RLS
      },
    });

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

      // Get more detailed error information
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use the status text
      }

      console.error('Cart API Error:', errorMessage);
      throw new Error(`Failed to fetch cart: ${errorMessage}`);
    }

    const data = await response.json();

    // Check if the response has the expected structure
    if (data.success && data.cart) {
      return data.cart;
    } else if (data.cart) {
      return data.cart;
    } else {
      // Fallback for unexpected response structure
      console.warn('Unexpected cart response structure:', data);
      return data;
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    // Return empty cart instead of null to prevent app crashes
    return {
      items: [],
      itemCount: 0,
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      total: 0,
    };
  }
};

// Initialize cart session on app startup
export const initializeCart = () => {
  if (typeof window === 'undefined') return;

  // Listen for cart updates from other tabs/windows
  // Note: We don't call ensureSessionId here anymore to avoid triggering storage events
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart_session_id') {
      // Session ID changed from external source (another tab/window), refresh cart
      window.dispatchEvent(new CustomEvent('cartSessionChanged'));
    }
  });
};

// Clear entire cart
export const clearCart = async (): Promise<boolean> => {
  const sessionId = getSessionId();

  const loadingToast = toast.loading('Clearing cart...');

  try {
    // Use the new cart API structure
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'x-session-id': sessionId,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to clear cart');
    }

    toast.dismiss(loadingToast);
    toast.success('Cart cleared!', {
      duration: 2000,
      icon: '🧹',
    });

    // Trigger cart refresh event for global state
    window.dispatchEvent(new CustomEvent('cartUpdated'));

    return true;
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(error instanceof Error ? error.message : 'Failed to clear cart');
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
  const shippingAmount = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
  const total = subtotal + taxAmount + shippingAmount;

  return {
    subtotal,
    taxAmount,
    shippingAmount,
    total,
  };
};
