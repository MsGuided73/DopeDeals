"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { removeFromCart, CartItem } from '../../lib/cart-utils';
import { ShieldAlert, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RestrictedItemsPage() {
  const { cart, isLoading, refreshCart } = useCart();
  const router = useRouter();

  const [restrictedProductIds, setRestrictedProductIds] = useState<string[]>([]);
  const [warningMessage, setWarningMessage] = useState<string>('Local laws prohibit shipping some of your items to your location.');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load restricted data from sessionStorage
    const storedRestricted = sessionStorage.getItem('restricted_products');
    const storedWarning = sessionStorage.getItem('shipping_warning');

    if (storedRestricted) {
      setRestrictedProductIds(JSON.parse(storedRestricted));
    } else {
      // If we landed here without restricted items, go back to checkout
      router.push('/checkout');
    }

    if (storedWarning) {
      setWarningMessage(storedWarning);
    }
  }, [router]);

  if (isLoading || restrictedProductIds.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const restrictedItems = cart?.items.filter(item => restrictedProductIds.includes(item.productId)) || [];
  const allowedItems = cart?.items.filter(item => !restrictedProductIds.includes(item.productId)) || [];

  const handleRemoveAndContinue = async () => {
    setIsProcessing(true);
    const toastId = toast.loading('Removing restricted items...');

    try {
      // Remove all restricted items concurrently
      await Promise.all(
        restrictedItems.map(item => removeFromCart(item.id))
      );
      
      await refreshCart();
      toast.success('Restricted items removed safely.', { id: toastId });

      // Clean up session storage
      sessionStorage.removeItem('restricted_products');
      sessionStorage.removeItem('shipping_warning');

      if (allowedItems.length === 0) {
        router.push('/products');
      } else {
        router.push('/checkout/review');
      }
    } catch (error) {
      console.error('Failed to remove items:', error);
      toast.error('Could not remove items. Please try again.', { id: toastId });
      setIsProcessing(false);
    }
  };

  const handleReturnToShop = () => {
    router.push('/products');
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-[#111] border border-red-900/50 rounded-lg p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-900/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-950/30 border border-red-900/50 mb-6 group">
            <ShieldAlert className="w-10 h-10 text-red-500 group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-wider text-white">Shipping Restriction Detected</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {warningMessage}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Restricted Items List */}
          <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center border-b border-red-900/30 pb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></span>
              Restricted Items
            </h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {restrictedItems.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/40 p-3 rounded border border-white/5">
                  <div className="flex items-center gap-3">
                    {item.product?.imageUrl && (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded border border-white/10" />
                    )}
                    <div>
                      <p className="font-medium text-white/90">{item.product?.name}</p>
                      <p className="text-sm text-red-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-red-400/70 mt-4">These items must be removed to continue.</p>
          </div>

          {/* Allowed Items List */}
          <div className="bg-green-950/20 border border-green-900/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center border-b border-green-900/30 pb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></span>
              Allowed Items
            </h2>
            {allowedItems.length > 0 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {allowedItems.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/40 p-3 rounded border border-white/5">
                    <div className="flex items-center gap-3">
                      {item.product?.imageUrl && (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded border border-white/10" />
                      )}
                      <div>
                        <p className="font-medium text-white/90">{item.product?.name}</p>
                        <p className="text-sm text-white/50">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[150px] text-white/40">
                <ShoppingBag className="w-10 h-10 mb-2 opacity-50" />
                <p>No allowed items in cart.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 border-t border-white/10 pt-8">
          <button
            onClick={handleReturnToShop}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-white/50"
          >
            Return to Shop
          </button>
          
          <button
            onClick={handleRemoveAndContinue}
            disabled={isProcessing}
            className={`w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold uppercase tracking-widest hover:bg-primary-hover transition-all flex items-center justify-center outline-none focus:ring-2 focus:ring-primary/50 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'Processing...' : (
              <>
                Remove & Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}
