"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  formatPrice,
  getSessionId,
  type Cart,
  type CartItem
} from '../lib/cart-utils';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);



  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    const cartData = await getCart();
    if (cartData) {
      setCart(cartData);
    } else {
      setError('Failed to load cart');
    }

    setLoading(false);
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    setUpdating(cartItemId);
    const success = await updateCartQuantity(cartItemId, newQuantity);
    if (success) {
      await fetchCart(); // Refresh cart
    }
    setUpdating(null);
  };

  const removeItem = async (cartItemId: string) => {
    const success = await removeFromCart(cartItemId);
    if (success) {
      await fetchCart(); // Refresh cart
    }
  };

  const clearCart = async () => {
    try {
      const sessionId = getSessionId();

      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await fetchCart();
      } else {
        setError(data.error || 'Failed to clear cart');
      }
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Clear cart error:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-24 h-24 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cart && cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          /* Empty cart state */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart with items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product?.name || 'Product Unavailable'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        SKU: {item.product?.sku || 'N/A'}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          ${item.priceAtTime.toFixed(2)}
                        </span>
                        {item.product && item.product.currentPrice !== item.priceAtTime && (
                          <span className="text-sm text-gray-500">
                            (Current: ${item.product.currentPrice.toFixed(2)})
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="w-12 text-center font-medium">
                            {updating === item.id ? '...' : item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id || !item.product?.inStock}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stock Warning */}
                      {item.product && !item.product.inStock && (
                        <p className="text-sm text-red-600 mt-2">Out of stock</p>
                      )}
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${item.itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
                    <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${cart.taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {cart.shippingAmount === 0 ? 'FREE' : `$${cart.shippingAmount.toFixed(2)}`}
                    </span>
                  </div>

                  {cart.shippingAmount === 0 && cart.subtotal < 75 && (
                    <p className="text-sm text-green-600">
                      Add ${(75 - cart.subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center block"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    href="/products"
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Compliance Notice */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Age verification and zipcode eligibility will be verified at checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}