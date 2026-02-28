"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { ArrowLeft, CreditCard, Shield, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ReviewPage() {
  const { cart, isLoading } = useCart();
  const router = useRouter();
  const [shippingData, setShippingData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check for age verification
    const isAgeVerified = localStorage.getItem('hw420_age_verified_formal') === 'true';
    if (!isAgeVerified) {
      toast.error('Please complete age verification first');
      router.push('/checkout/shipping');
      return;
    }

    // Load shipping data from session
    const data = sessionStorage.getItem('checkout_shipping');
    if (data) {
      setShippingData(JSON.parse(data));
    } else {
      // If no shipping data, redirect back
      toast.error('Please complete shipping details first');
      router.push('/checkout/shipping');
    }
  }, [router]);

  if (isLoading || !shippingData) {
    return <div className="flex justify-center items-center my-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/products')} className="px-6 py-2 bg-primary text-white font-bold rounded">
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const tax = cart?.taxAmount || 0;
  const shipping = cart?.shippingAmount || 0;
  const total = cart?.total || 0;

  const handleCreateOrderAndPay = async () => {
    setIsProcessing(true);
    try {
      // Step 1: Tell backend to reserve inventory and insert an Order into DB (Status = Pending)
      // Step 2: Grab the KajaPay Hosted/Redirect URL from Backend OR send standard API charge if using local card form
      
      // Right now the user mentioned "redirect to KajaPay", implying we generate a payment link layout, 
      // or we just process it. We'll simulate the backend call for now.
      
      // Map cart items to the shape the backend expects: { productId, quantity }
      const lineItems = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Map session shipping data to the backend address shape
      const shippingAddress = {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        address1: shippingData.shippingAddress1,
        city: shippingData.shippingCity,
        state: shippingData.shippingState,
        postalCode: shippingData.shippingZip,
        country: shippingData.shippingCountry || 'US',
        phone: shippingData.phone || undefined,
      };

      const billingAddress = {
        ...shippingAddress,
        email: shippingData.email || undefined,
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        credentials: 'include', // Forward the Supabase session cookie so auth works
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lineItems,
          shippingAddress,
          billingAddress,
          processPayment: false, // Reserve inventory only; payment happens at KajaPay step
        })
      });

      // Safely parse — handle empty bodies or non-JSON responses without crashing
      const rawText = await response.text();
      let data: any = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        console.error('API returned non-JSON response:', rawText.slice(0, 300));
        throw new Error(`Server error (${response.status}): ${rawText.slice(0, 150) || 'Empty response'}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      // If backend returns a redirect URL to KajaPay hosted UI
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else if (data.success || data.orderId) {
        // If it was processed instantly / order was created
        router.push(`/checkout/confirmation?orderId=${data.orderId || data.order?.id || 'pending'}`);
      } else {
        throw new Error('Invalid response from payment server');
      }


    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Payment initiation failed. Please try again.');
      router.push('/checkout/failed'); // Optional: redirect to failed explicitly
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
       <div className="flex items-center gap-4 mb-8 text-sm text-gray-400">
        <button onClick={() => router.push('/checkout/shipping')} className="text-gray-400 hover:text-white flex items-center gap-2">
          <Truck className="w-4 h-4" /> Shipping
        </button>
        <ArrowLeft className="w-4 h-4 rotate-180" />
        <span className="text-white font-medium flex items-center gap-2"><CreditCard className="w-4 h-4" /> Review & Pay</span>
      </div>

      <h1 className="text-3xl font-bold mb-8 font-heading text-white tracking-widest uppercase">Order Summary</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Shipping Information</h2>
            <div className="text-gray-300">
              <p className="font-medium text-white">{shippingData.firstName} {shippingData.lastName}</p>
              <p>{shippingData.shippingAddress1}</p>
              {shippingData.shippingAddress2 && <p>{shippingData.shippingAddress2}</p>}
              <p>{shippingData.shippingCity}, {shippingData.shippingState} {shippingData.shippingZip}</p>
              <p>{shippingData.email} • {shippingData.phone}</p>
            </div>
            <button onClick={() => router.push('/checkout/shipping')} className="text-primary text-sm mt-4 hover:underline">
              Edit Address
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg">
             <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Items</h2>
             <div className="space-y-4">
               {cart.items.map((item) => (
                 <div key={item.productId} className="flex gap-4 border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-zinc-800 rounded-md overflow-hidden relative flex-shrink-0">
                      <Image 
                        src={item.product?.imageUrl || '/placeholder.png'} 
                        alt={item.product?.name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.product?.name || 'Unknown Product'}</h3>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">${(item.itemTotal || 0).toFixed(2)}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* Right Column - Totals and CTA */}
        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 h-fit sticky top-24">
           <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-4">Payment Summary</h2>
           
           <div className="space-y-3 text-gray-300 mb-6 border-b border-zinc-800 pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white mt-4 pt-4 border-t border-zinc-800">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
           </div>

           <div className="space-y-4">
            <button 
              onClick={handleCreateOrderAndPay}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black hover:bg-zinc-900 font-bold uppercase tracking-widest rounded-lg transition-all border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 text-white"
              style={{ color: 'white' }}
            >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to KajaPay
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs xl:text-sm text-gray-500 mt-4">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure payment processing via <strong>KajaPay</strong></span>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
  );
}
