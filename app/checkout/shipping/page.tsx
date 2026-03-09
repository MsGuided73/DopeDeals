"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShippingPage() {
  const { cart, isLoading } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Dev-only render log — removed from production to prevent log spam
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
  });

  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [restrictedItems, setRestrictedItems] = useState<string[]>([]);
  const [shippingWarning, setShippingWarning] = useState<string | null>(null);
  const [isCheckingZip, setIsCheckingZip] = useState(false);

  useEffect(() => {
    // Check if formally verified in this session or via persistent user profile state
    const localVerified = localStorage.getItem('hw420_age_verified_formal') === 'true';
    const profileVerified = user?.user_metadata?.age_verified === true;
    
    if (localVerified || profileVerified) {
      setIsAgeVerified(true);
      // Sync local storage if profile is verified to help other pages
      if (profileVerified && !localVerified) {
        localStorage.setItem('hw420_age_verified_formal', 'true');
      }
    }
  }, [user]);

  // Stable product ID string via useMemo — avoids new array reference on every render
  const productIdString = useMemo(
    () => cart?.items?.map(i => i.productId).join(',') ?? '',
    [cart?.items]
  );

  // Effect to check ZIP eligibility
  useEffect(() => {
    const checkZip = async () => {
      if (form.shippingZip.length === 5 && productIdString) {
        setIsCheckingZip(true);
        try {
          const res = await fetch(`/api/eligibility?zip=${form.shippingZip}&productIds=${productIdString}`);
          const data = await res.json();

          if (data.restrictedProducts?.length > 0) {
            setRestrictedItems(data.restrictedProducts);
            setShippingWarning(data.warning || null);
            toast.error(data.warning || `Some items in your cart cannot be shipped to ${data.state}.`);
          } else {
            setRestrictedItems([]);
            setShippingWarning(null);
            if (data.city && !form.shippingCity) {
              setForm(prev => ({ ...prev, shippingCity: data.city, shippingState: data.state }));
            }
          }
        } catch (error) {
          console.error('Failed to check zip eligibility:', error);
        } finally {
          setIsCheckingZip(false);
        }
      } else {
        setRestrictedItems([]);
      }
    };

    const timer = setTimeout(checkZip, 500);
    return () => clearTimeout(timer);
  }, [form.shippingZip, productIdString]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.firstName || !form.lastName || !form.email || !form.shippingAddress1 || !form.shippingCity || !form.shippingState || !form.shippingZip) {
      toast.error('Please fill out all required shipping fields');
      return;
    }

    // Manual Final Zip Check to prevent debouncing bypass
    setIsCheckingZip(true);
    const checkToastId = toast.loading('Verifying shipping eligibility...');
    try {
      const productIds = cart!.items.map(i => i.productId).join(',');
      const res = await fetch(`/api/eligibility?zip=${form.shippingZip}&productIds=${productIds}`);
      const data = await res.json();
      
      if (data.restrictedProducts?.length > 0) {
        setRestrictedItems(data.restrictedProducts);
        setShippingWarning(data.warning || null);
        toast.error(data.warning || `State law prohibits shipping certain items to ${data.state}. Diverting to resolution protocol.`, { id: checkToastId });
        setIsCheckingZip(false);
        
        // Save form data and restricted product IDs for the next page to consume
        sessionStorage.setItem('checkout_shipping', JSON.stringify(form));
        sessionStorage.setItem('restricted_products', JSON.stringify(data.restrictedProducts));
        sessionStorage.setItem('shipping_warning', data.warning || '');
        
        setTimeout(() => router.push('/checkout/restricted'), 1500);
        return;
      }
      toast.success('Shipping eligibility verified.', { id: checkToastId });
    } catch (error) {
      console.error('Manual zip check failed:', error);
      toast.error('Could not verify shipping eligibility. Please try again.', { id: checkToastId });
      setIsCheckingZip(false);
      return;
    } finally {
      setIsCheckingZip(false);
    }

    // Enforce Age Verification for checkout
    // TEMPORARILY DISABLED: User wants to rely on the initial site gateway instead of Didit for checkout right now.
    /*
    if (!isAgeVerified) {
      toast.error('Age verification required. Redirecting to secure verification protocol...');
      sessionStorage.setItem('checkout_shipping', JSON.stringify(form));
      setTimeout(() => router.push('/age-verification'), 1500);
      return;
    }
    */

    // Save shipping info to sessionStorage to pass it into the review page
    sessionStorage.setItem('checkout_shipping', JSON.stringify(form));
    
    // Proceed to the review page step
    router.push('/checkout/review');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center my-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/products')} className="px-6 py-2 bg-primary text-white rounded">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
      {restrictedItems.length > 0 && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="p-2 bg-red-500 rounded-full">
            {Truck && <Truck className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h3 className="font-bold text-red-400">Shipping Restriction</h3>
            <p className="text-sm text-gray-300">
              {shippingWarning || 'Your cart contains items that cannot be shipped to your state due to local regulations. Please remove these items from your cart to proceed with checkout.'}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 mb-8 text-sm text-gray-400">
        <span className="text-white font-medium flex items-center gap-2">{Truck && <Truck className="w-4 h-4" />} Shipping</span>
        {ArrowRight && <ArrowRight className="w-4 h-4" />}
        <span>Review & Pay</span>
      </div>

      <h1 className="text-3xl font-bold mb-8 font-heading text-white tracking-widest uppercase">Shipping Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">First Name *</label>
            <input
              type="text"
              required
              className="w-full bg-zinc-800 border-zinc-700 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Last Name *</label>
            <input
              type="text"
              required
              className="w-full bg-zinc-800 border-zinc-700 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
          <input
            type="email"
            required
            className="w-full bg-zinc-800 border-zinc-700 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
           <input
             type="tel"
             className="w-full bg-zinc-800 border-zinc-700 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
             value={form.phone}
             onChange={(e) => setForm({ ...form, phone: e.target.value })}
           />
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Street Address *</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-800 border-zinc-700 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
                value={form.shippingAddress1}
                onChange={(e) => setForm({ ...form, shippingAddress1: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">City *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-800 border-zinc-700 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
                  value={form.shippingCity}
                  onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">State *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-800 border-zinc-700 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
                  value={form.shippingState}
                  onChange={(e) => setForm({ ...form, shippingState: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ZIP *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-800 border-zinc-700 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
                  value={form.shippingZip}
                  onChange={(e) => setForm({ ...form, shippingZip: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-between items-center">
          <button 
            type="button" 
            onClick={() => router.push('/cart')}
            className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
          >
            Return to Cart
          </button>
          
          <button 
            type="submit"
            disabled={isCheckingZip}
            className="px-8 py-3 bg-black hover:bg-zinc-900 text-white font-bold uppercase tracking-widest rounded transition-all border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'white' }}
          >
            {isCheckingZip ? 'Checking...' : 'Continue to Review'}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}
