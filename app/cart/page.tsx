"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, Shield, Lock, CheckCircle, FileText, Headphones, CreditCard } from 'lucide-react';
import { updateCartQuantity, removeFromCart, clearCart, getShopReferer } from '../lib/cart-utils';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AutosuggestRecommendations from '../components/AutosuggestRecommendations';

export default function CartPage() {
  const { cart, isLoading, refreshCart } = useCart();
  const [updating, setUpdating] = useState<string | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
  const [shopReferer, setShopReferer] = useState<string>('/');
  
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
          
          <div className="mt-16">
             <AutosuggestRecommendations />
          </div>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = 75;
  const progress = Math.min((cart.subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - cart.subtotal, 0);

  return (
    <div className="min-h-screen bg-white pt-8 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
            <div className="text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-black">Home</Link>
                <span className="mx-2">›</span>
                <span className="text-gray-900 font-medium">Shopping Cart</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-500">Review your items and finish checkout in minutes.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Cart Items */}
          <div className="flex-1">
            <div className="flex justify-end mb-4">
                 <button 
                  onClick={() => setShowClearCartModal(true)}
                  className="text-gray-500 hover:text-red-600 text-sm font-medium underline underline-offset-4 decoration-gray-300 hover:decoration-red-600 transition-colors"
                >
                  Clear Cart
                </button>
            </div>

            <div className="space-y-6">
                {cart.items.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm transition-all duration-300 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Image */}
                        <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-100">
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

                        {/* Details */}
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-2">
                                <Link href={`/product/${product.id}`} className="text-lg font-bold text-gray-900 hover:text-green-700 transition-colors line-clamp-2">
                                    {product.name}
                                </Link>
                                <p className="text-lg font-bold text-gray-900">
                                    ${(item.priceAtTime * item.quantity).toFixed(2)}
                                </p>
                            </div>
                            
                            {product.sku && (
                                <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide">
                                    SKU: {product.sku}
                                </p>
                            )}
                            
                            <div className="flex justify-between items-end">
                                <p className="text-lg font-bold text-gray-900">
                                    ${item.priceAtTime.toFixed(2)}
                                </p>

                                <div className="flex items-center gap-6">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-gray-200 rounded-lg bg-white h-10">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            disabled={updating === item.id || item.quantity <= 1}
                                            className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-bold text-gray-900 text-sm">
                                            {updating === item.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                            ) : (
                                                item.quantity
                                            )}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            disabled={updating === item.id}
                                            className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        disabled={updating === item.id}
                                        className="text-red-400 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100 p-2 rounded-lg"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                  );
                })}
            </div>
            
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">You may also like</h2>
                    <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                        Browse more
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                     <Link href="/pre-rolls" className="group bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-300 transition-all">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Trending now</span>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors mt-1">Premium Pre-Rolls</h3>
                     </Link>
                      <Link href="/vapes" className="group bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-300 transition-all">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Trending now</span>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors mt-1">Top Shelf Vapes</h3>
                     </Link>
                      <Link href="/fresh-drops" className="group bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-300 transition-all">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Trending now</span>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors mt-1">New Arrivals</h3>
                     </Link>
                </div>
                
                <div className="mb-0">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Popular add-ons</h3>
                         <Link href="/sale" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                            View all under $15
                        </Link>
                    </div>
                    <AutosuggestRecommendations limit={3} layout="grid" showTitle={false} compact={true} />
                </div>

            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px] flex-shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Free Shipping Progress */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="font-medium text-gray-900">
                            {remainingForFreeShipping > 0 
                                ? <span>Add <span className="font-bold text-green-600">${remainingForFreeShipping.toFixed(2)}</span> for free shipping</span>
                                : <span className="text-green-600 font-bold">Free shipping unlocked!</span>}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">${freeShippingThreshold} goal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-2 rounded-full transition-all duration-500 ${remainingForFreeShipping > 0 ? 'bg-green-500' : 'bg-green-600'}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({cart.itemCount} items)</span>
                        <span className="font-bold text-gray-900">${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                         {/* Assuming tax calculation is available or estimate */}
                        <span className="font-bold text-gray-900">${cart.taxAmount > 0 ? cart.taxAmount.toFixed(2) : 'Calculated at checkout'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="font-bold text-gray-900">
                            {cart.shippingAmount === 0 ? (
                            <span className="text-green-600">Free</span>
                            ) : (
                            cart.shippingAmount > 0 ? `$${cart.shippingAmount.toFixed(2)}` : 'Calculated at checkout'
                            )}
                        </span>
                    </div>
                </div>
                
                <div className="flex justify-between items-end mb-8">
                    <span className="text-xl font-black text-gray-900">Total</span>
                    <span className="text-2xl font-black text-gray-900">${cart.total.toFixed(2)}</span>
                </div>

                <button
                    onClick={() => agreedToTerms ? router.push('/checkout') : toast.error('Please accept the Terms & Conditions')}
                    disabled={!agreedToTerms}
                    className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-100 flex items-center justify-center gap-2 mb-4"
                >
                    <Lock className="w-5 h-5" />
                    Secure Checkout
                </button>

                {/* Trust Badges */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                        Discreet shipping in unmarked packaging
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                        Encrypted checkout & secure payments
                    </div>
                     <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                        Billing Descriptor: <span className="font-bold text-gray-700">THE HIGHWAY</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                        Support team on standby if you need help
                    </div>
                </div>

                <Link 
                    href={shopReferer}
                    className="block w-full py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-center hover:bg-gray-50 transition-colors"
                >
                    Continue Shopping
                </Link>

                <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3">
                     <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                     <div className="text-xs text-gray-500 leading-relaxed">
                        <p className="font-bold text-gray-900 mb-1">Age verification required</p>
                        <p className="mb-2">All customers must be 21+ years old.</p>
                        <p className="mb-2"><span className="font-medium text-gray-900">United States:</span> Age verification and delivery address eligibility will be confirmed at checkout.</p>
                        <p>Ages vary by jurisdiction - federal law requires 21+ for tobacco/nicotine products.</p>
                     </div>
                </div>

                {/* Terms Checkbox */}
                 <div className="mt-4 flex items-start gap-3 p-2">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                        />
                    </div>
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
                        I agree to the <Link href="/terms-and-conditions" className="text-green-600 underline hover:text-green-700">Terms & Conditions</Link>
                    </label>
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
    </div>
  );
}
