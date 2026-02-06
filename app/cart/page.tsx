"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Lock } from 'lucide-react';

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
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const freeShippingThreshold = 75;
  const cartSubtotal = cart?.subtotal ?? 0;
  const shippingRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const hasFreeShipping = cartSubtotal >= freeShippingThreshold;



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

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1">Review your items and finish checkout in minutes.</p>
          </div>
          {cart && cart.items && cart.items.length > 0 && (
            <button
              onClick={() => setShowClearCartModal(true)}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition"
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
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
            {/* Cart Items */}
            <div className="space-y-6">
              {cart.items && cart.items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Product Image - Much Larger */}
                    <div className="w-full sm:w-40 sm:h-40 h-48 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.product?.name || 'Product Unavailable'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        SKU: {item.product?.sku || 'N/A'}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-lg font-semibold text-gray-900 tabular-nums">
                          ${item.priceAtTime.toFixed(2)}
                        </span>
                        {item.product && item.product.currentPrice !== item.priceAtTime && (
                          <span className="text-sm text-gray-400 tabular-nums">
                            (Current: ${item.product.currentPrice.toFixed(2)})
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                            className="w-11 h-11 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="min-w-[48px] text-center text-base font-semibold tabular-nums">
                            {updating === item.id ? '...' : item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id || !item.product?.inStock}
                            className="w-11 h-11 rounded-xl border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
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
                    <div className="text-right sm:text-right">
                      <p className="text-lg font-semibold text-gray-900 tabular-nums">
                        ${item.itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">You may also like</h2>
                  <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-black">Browse more</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Premium Pre-Rolls', href: '/pre-rolls' },
                    { name: 'Top Shelf Vapes', href: '/vapes' },
                    { name: 'New Arrivals', href: '/new' },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                      <p className="text-sm text-gray-500">Trending now</p>
                      <p className="mt-2 font-semibold text-gray-900">{item.name}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Popular add-ons under $15</h3>
                  <Link href="/accessories" className="text-xs font-medium text-gray-500 hover:text-gray-900">View all</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Rolling Papers', price: '$4.99', href: '/accessories' },
                    { name: 'Hemp Wick', price: '$6.00', href: '/accessories' },
                    { name: 'Mini Grinder', price: '$12.00', href: '/accessories' },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm hover:shadow-md transition"
                    >
                      <p className="text-xs text-gray-500">{item.price}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{item.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      {hasFreeShipping
                        ? 'Free shipping unlocked'
                        : `Add $${shippingRemaining.toFixed(2)} for free shipping`}
                    </p>
                    <span className="text-xs text-gray-500">${freeShippingThreshold} goal</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.itemCount || 0} items)</span>
                    <span className="font-medium tabular-nums">${(cart.subtotal || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium tabular-nums">${(cart.taxAmount || 0).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium tabular-nums">
                      {hasFreeShipping
                        ? 'FREE'
                        : (cart.shippingAmount || 0) > 0
                          ? `$${(cart.shippingAmount || 0).toFixed(2)}`
                          : 'Calculated at checkout'}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="tabular-nums">${(cart.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 text-white py-4 px-4 rounded-xl font-semibold hover:from-green-700 hover:via-green-600 hover:to-emerald-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Secure Checkout
                  </Link>

                  <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      Discreet shipping in unmarked packaging
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      Encrypted checkout & secure payments
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      Billing Descriptor: H420
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      Support team on standby if you need help
                    </div>
                  </div>

                  <Link
                    href={getShopReferer()}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Age Verification & Compliance Notice */}
                <div className="mt-6 space-y-3">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">Age verification required</h4>
                        <div className="mt-1 text-sm text-gray-600">
                          <p className="mb-1">All customers must be 21+ years old.</p>
                          <p className="mb-1"><strong>United States:</strong> Age verification and delivery address eligibility will be confirmed at checkout.</p>
                          <p className="text-xs text-gray-500 mt-2">Ages vary by jurisdiction - federal law requires 21+ for tobacco/nicotine products.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {showClearCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">Clear cart?</h3>
            <p className="mt-2 text-sm text-gray-600">This will remove all items from your cart. You can add them back anytime.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowClearCartModal(false)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep items
              </button>
              <button
                onClick={async () => {
                  await handleClearCart();
                  setShowClearCartModal(false);
                }}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
