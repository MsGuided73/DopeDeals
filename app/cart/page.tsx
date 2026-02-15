"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, RefreshCcw, Shield } from 'lucide-react';
import { updateCartQuantity, removeFromCart, clearCart, getShopReferer } from '../lib/cart-utils';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, isLoading, refreshCart } = useCart();
  const [updating, setUpdating] = useState<string | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const router = useRouter();

  // Handle quantity updates
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(productId);
    try {
      await updateCartQuantity(productId, newQuantity);
      await refreshCart();
      toast.success('Cart updated');
    } catch (err) {
      console.error('Error updating cart:', err);
      toast.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (productId: string) => {
    setUpdating(productId);
    try {
      await removeFromCart(productId);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    try {
      await clearCart();
      await refreshCart();
      setShowClearCartModal(false);
      toast.success('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    }
  };

  // Get Shop Referer to control back button behavior
  // We use a state to avoid hydration mismatches
  const [shopReferer, setShopReferer] = useState<string>('/products');
  
  useEffect(() => {
    setShopReferer(getShopReferer());
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our products to find something you'll love.
            </p>
            <Link 
              href={shopReferer}
              className="inline-flex items-center px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all hover:scale-105"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = 75;
  const progress = Math.min((cart.subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - cart.subtotal, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart ({cart.itemCount} items)</h1>
          <button 
            onClick={() => setShowClearCartModal(true)}
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">
                    {remainingForFreeShipping > 0 
                        ? <span>Spend <span className="font-bold text-green-600">${remainingForFreeShipping.toFixed(2)}</span> more for free shipping!</span>
                        : "🎉 You've unlocked FREE shipping!"}
                </span>
                <span className="text-sm font-medium text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${remainingForFreeShipping > 0 ? 'bg-black' : 'bg-green-500'}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cart.items.map((item) => {
                  const product = item.product;
                  if (!product) return null; // Skip invalid items

                  return (
                    <li key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center sm:items-start">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ShoppingBag className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 ml-6 flex flex-col sm:flex-row">
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                <Link href={`/products/${product.sku}`} className="hover:text-amber-600 transition-colors">
                                  {product.name}
                                </Link>
                              </h3>
                              <p className="text-lg font-bold text-gray-900 sm:hidden">
                                ${(item.priceAtTime * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            
                            {/* Variant/Option info would go here */}
                             <p className="text-sm text-gray-500 mb-4">{product.description?.substring(0, 50)}...</p>

                            <div className="flex items-center justify-between sm:justify-start sm:gap-8">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  // Update: call with item.id (cart item id) usually, but the handler takes productId?
                                  // let's check updateCartQuantity in cart-utils. 
                                  // It takes (itemId: string, quantity: number). ItemId usually means CartItem ID.
                                  // In my previous code I passed item.productId.
                                  // Let's verify cart-utils 'updateCartQuantity' signature.
                                  // const updateCartQuantity = async (itemId: string, quantity: number)
                                  // It says "cartItemId: itemId" in the body. So it expects CartItem ID.
                                  // The previous code passed item.productId -> WRONG?
                                  // Looking at the cart-utils.ts content:
                                  // export const updateCartQuantity = async (itemId: string, quantity: number)
                                  // body: JSON.stringify({ cartItemId: itemId, quantity })
                                  // So it EXPECTS `item.id` (cart item id), NOT `item.productId`.
                                  // Good thing I checked.
                                  disabled={updating === item.id || item.quantity <= 1}
                                  className="p-2 text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium text-gray-900">
                                  {updating === item.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                  ) : (
                                    item.quantity
                                  )}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={updating === item.id}
                                  className="p-2 text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={updating === item.id}
                                className="text-sm text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>

                          {/* Price (Desktop) */}
                          <div className="hidden sm:block text-right ml-4">
                            <p className="text-xl font-bold text-gray-900">
                              ${(item.priceAtTime * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500 mt-1">
                                ${item.priceAtTime.toFixed(2)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {cart.shippingAmount === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${cart.shippingAmount.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="text-gray-900 font-medium">${cart.taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                  <div>
                    <span className="block text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xs text-gray-500">USD</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
              
              <div className="mt-4 text-xs text-center text-gray-400">
                <p>Shipping & taxes are implementing estimates based on standard rates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Modal */}
      {showClearCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Shopping Cart?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowClearCartModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
