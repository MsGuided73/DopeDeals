"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  formatPrice,
  getSessionId,
  getShopReferer,
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

    try {
      const cartData = await getCart();
      if (cartData) {
        setCart(cartData);
      } else {
        setError('Failed to load cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
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

  const handleClearCart = async () => {
    const success = await clearCart();
    if (success) {
      await fetchCart(); // Refresh cart after successful clear
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded"></div>
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

      {/* Cart Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="text-sm">
            <a href="/" className="text-gray-600 hover:text-black">Home</a>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-black font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cart && cart.items && cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
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

        {!cart || !cart.items || cart.items.length === 0 ? (
          /* Empty cart state */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              href={getShopReferer()}
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
              {cart.items && cart.items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex gap-4">
                    {/* Product Image - Much Larger */}
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-12 h-12" />
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
                    <span className="text-gray-600">Subtotal ({cart.itemCount || 0} items)</span>
                    <span className="font-medium">${(cart.subtotal || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(cart.taxAmount || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {(cart.shippingAmount || 0) === 0 ? 'FREE' : `$${(cart.shippingAmount || 0).toFixed(2)}`}
                    </span>
                  </div>

                  {(cart.shippingAmount || 0) === 0 && (cart.subtotal || 0) < 75 && (
                    <p className="text-sm text-green-600">
                      Add ${(75 - (cart.subtotal || 0)).toFixed(2)} more for free shipping!
                    </p>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(cart.total || 0).toFixed(2)}</span>
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
                    href={getShopReferer()}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Age Verification & Compliance Notice */}
                <div className="mt-6 space-y-3">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Age Verification Required</h4>
                        <div className="mt-1 text-sm text-yellow-700">
                          <p className="mb-1">All customers must be 21+ years old.</p>
                          <p className="mb-1"><strong>United States:</strong> Age verification and delivery address eligibility will be confirmed at checkout.</p>
                          <p className="text-xs text-yellow-600 mt-2">Ages vary by jurisdiction - federal law requires 21+ for tobacco/nicotine products.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shopping Cart Savings */}
                  {(cart.subtotal || 0) < 75 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-green-700">
                            Add <span className="font-semibold">${(75 - (cart.subtotal || 0)).toFixed(2)}</span> more for FREE shipping!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
