"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { getCart, updateCartQuantity, removeFromCart, formatPrice, type Cart, type CartItem } from '../lib/cart-utils';

export default function StickyCartPopup() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const cartData = await getCart();
      if (cartData) {
        setCart(cartData);
        // Show popup if cart has items
        setIsVisible(cartData.items && cartData.items.length > 0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Update cart quantity
  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    setUpdating(cartItemId);
    const success = await updateCartQuantity(cartItemId, newQuantity);
    if (success) {
      await fetchCart(); // Refresh cart
    }
    setUpdating(null);
  };

  // Remove item from cart
  const removeItem = async (cartItemId: string) => {
    const success = await removeFromCart(cartItemId);
    if (success) {
      await fetchCart(); // Refresh cart
    }
  };

  // Listen for cart updates
  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Don't render if no cart or empty cart
  if (!cart || !cart.items || cart.items.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-4 z-50">
      {/* Cart Toggle Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.itemCount}
            </span>
          </div>
        </button>
      )}

      {/* Expanded Cart Popup */}
      {isExpanded && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-2xl w-80 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">Cart ({cart.itemCount})</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="hover:bg-green-700 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-64 overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item.id} className="p-3 border-b border-gray-100 last:border-b-0">
                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.product?.name || 'Product'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      ${item.priceAtTime.toFixed(2)} × {item.quantity}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-8 text-center text-sm font-medium">
                        {updating === item.id ? '...' : item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="w-6 h-6 rounded border border-red-300 flex items-center justify-center hover:bg-red-50 disabled:opacity-50 text-xs ml-2"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${item.itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            {/* Total */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-lg text-green-600">
                ${cart.total.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/cart"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium text-center block transition-colors"
                onClick={() => setIsExpanded(false)}
              >
                View Full Cart
              </Link>
              <Link
                href="/checkout"
                className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded font-medium text-center block transition-colors"
                onClick={() => setIsExpanded(false)}
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
