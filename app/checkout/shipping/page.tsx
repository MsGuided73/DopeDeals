"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { ArrowRight, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShippingPage() {
  const { cart, isLoading } = useCart();
  const router = useRouter();

  // Basic form state
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

  useEffect(() => {
    // Check if formally verified in this session
    const verified = localStorage.getItem('hw420_age_verified_formal') === 'true';
    if (verified) setIsAgeVerified(true);

    // Load AgeChecker script if not present
    if (!document.getElementById('agechecker-script')) {
      const script = document.createElement('script');
      script.id = 'agechecker-script';
      script.src = 'https://cdn.agechecker.net/static/popup/v1/popup.js';
      script.setAttribute('data-agecheck-api-key', '64Tw24wNqoE1MNcvdwYboVpmdpFsv7tZ');
      script.setAttribute('data-agecheck-disable-auto', 'true');
      document.head.appendChild(script);
    }

    // Handle AgeChecker verification success
    const handleVerified = () => {
      console.log('[AgeChecker] Verification successful');
      localStorage.setItem('hw420_age_verified_formal', 'true');
      setIsAgeVerified(true);
      setIsVerifying(false);
      toast.success('Age verified successfully!');
    };

    window.addEventListener('agechecker:verified', handleVerified);
    return () => window.removeEventListener('agechecker:verified', handleVerified);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.firstName || !form.lastName || !form.email || !form.shippingAddress1 || !form.shippingCity || !form.shippingZip) {
      toast.error('Please fill out all required shipping fields');
      return;
    }

    // Enforce Age Verification for checkout
    if (!isAgeVerified) {
      const ac = (window as any).AgeChecker;
      if (ac) {
        setIsVerifying(true);
        // Pass data to AgeChecker
        (window as any).ageCheckerConfig = {
          apiKey: '64Tw24wNqoE1MNcvdwYboVpmdpFsv7tZ',
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
        ac.verify();
      } else {
        toast.error('Age verification service is loading. Please try again.');
      }
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
      <div className="flex items-center gap-4 mb-8 text-sm text-gray-400">
        <span className="text-white font-medium flex items-center gap-2"><Truck className="w-4 h-4" /> Shipping</span>
        <ArrowRight className="w-4 h-4" />
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
            className="px-8 py-3 bg-black hover:bg-zinc-900 text-white font-bold uppercase tracking-widest rounded transition-all border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
            style={{ color: 'white' }}
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}
