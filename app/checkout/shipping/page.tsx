"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { ArrowRight, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShippingPage() {
  const { cart, isLoading } = useCart();
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [isServiceLoading, setIsServiceLoading] = useState(true);

  const [restrictedItems, setRestrictedItems] = useState<string[]>([]);
  const [isCheckingZip, setIsCheckingZip] = useState(false);

  useEffect(() => {
    // Check if formally verified in this session
    const verified = localStorage.getItem('hw420_age_verified_formal') === 'true';
    if (verified) setIsAgeVerified(true);

    // Handle AgeChecker verification success
    const handleVerified = (event: any) => {
      console.log('[AgeChecker] Verification successful', event);
      localStorage.setItem('hw420_age_verified_formal', 'true');
      if (event.detail?.uuid || event.detail?.id) {
        localStorage.setItem('hw420_age_checker_id', event.detail.uuid || event.detail.id);
      }
      setIsAgeVerified(true);
      setIsVerifying(false);
      toast.success('Age verified successfully!');
      
      // If we were waiting for verification to submit, try submitting again
      const pendingSubmit = sessionStorage.getItem('checkout_pending_submit') === 'true';
      if (pendingSubmit) {
        sessionStorage.removeItem('checkout_pending_submit');
        // We can't easily call handleSubmit here because it needs the event,
        // but we can trigger a manual click on the submit button or just notify.
        toast.success('Please click "Continue to Review" again to proceed.');
      }
    };

    // Polling for AgeChecker availability if not immediately present
    // AgeChecker.Net popup.js exposes window.AgeCheckerPopup (not window.AgeChecker)
    let pollCount = 0;
    const checkService = () => {
      if ((window as any).AgeCheckerPopup || (window as any).AgeChecker) {
        setIsServiceLoading(false);
      } else if (pollCount < 20) { // 10 seconds max
        pollCount++;
        setTimeout(checkService, 500);
      } else {
        // Widget didn't load — don't block the UI, handle gracefully on submit
        setIsServiceLoading(false);
      }
    };
    checkService();

    window.addEventListener('agechecker:verified', handleVerified);
    return () => window.removeEventListener('agechecker:verified', handleVerified);
  }, []);

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
            toast.error(`Some items in your cart cannot be shipped to ${data.state}.`);
          } else {
            setRestrictedItems([]);
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
        toast.error(`Some items in your cart cannot be shipped to ${data.state}.`, { id: checkToastId });
        setIsCheckingZip(false);
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
    if (!isAgeVerified) {
      const attemptVerification = (retries = 0) => {
        // AgeChecker.Net popup.js registers as window.AgeCheckerPopup
        const ac = (window as any).AgeCheckerPopup ?? (window as any).AgeChecker;
        if (ac) {
          toast.dismiss('age-init');
          setIsVerifying(true);
          sessionStorage.setItem('checkout_pending_submit', 'true');
          // Pre-populate AgeChecker config with customer data
          (window as any).ageCheckerConfig = {
            apiKey: process.env.NEXT_PUBLIC_AGECHECKER_API_KEY || '64Tw24wNqoE1MNcvdwYboVpmdpFsv7tZ',
            customerEmail: form.email,
            customerFirstName: form.firstName,
            customerLastName: form.lastName,
            shippingAddress: {
              address: form.shippingAddress1,
              city: form.shippingCity,
              state: form.shippingState,
              zip: form.shippingZip,
              country: 'US'
            }
          };
          // Trigger the verification popup
          if (typeof ac.show === 'function') ac.show();
          else if (typeof ac.verify === 'function') ac.verify();
          else if (typeof ac.open === 'function') ac.open();
        } else if (retries < 10) { // 5 seconds max
          if (retries === 0) toast.loading('Initializing age verification...', { id: 'age-init' });
          setTimeout(() => attemptVerification(retries + 1), 500);
        } else {
          toast.dismiss('age-init');
          toast.error('Age verification unavailable. Please refresh the page and try again.');
        }
      };

      attemptVerification();
      return;
    }

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
              Your cart contains items that cannot be shipped to your state due to local regulations. 
              Please remove these items from your cart to proceed with checkout.
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
            disabled={isVerifying || isCheckingZip || isServiceLoading}
            className="px-8 py-3 bg-black hover:bg-zinc-900 text-white font-bold uppercase tracking-widest rounded transition-all border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'white' }}
          >
            {isCheckingZip ? 'Checking...' : isServiceLoading ? 'Initializing...' : isVerifying ? 'Verifying...' : 'Continue to Review'}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}
