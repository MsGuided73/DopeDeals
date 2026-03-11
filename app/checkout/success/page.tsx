"use client";

import React, { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import GlobalMasthead from '../../components/GlobalMasthead';
import toast from 'react-hot-toast';
import OrderTracking from '../../components/OrderTracking';
import NotificationSignup from '../../components/NotificationSignup';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmState, setConfirmState] = useState<'confirming' | 'success' | 'failed'>('confirming');
  const [errorReason, setErrorReason] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const ran = useRef(false);

  const orderId = searchParams.get('orderId') || searchParams.get('order_id') || (typeof window !== 'undefined' ? sessionStorage.getItem('pendingOrderId') : null);
  const transactionId = searchParams.get('transactionId') || searchParams.get('transaction_id');
  const referenceNumber = searchParams.get('referenceNumber') || searchParams.get('reference_number');
  const responseCode = searchParams.get('responseCode') || searchParams.get('response_code');

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!orderId) {
      setConfirmState('failed');
      setErrorReason('Order reference lost. Please contact support.');
      return;
    }

    async function confirm() {
      try {
        const res = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orderId, 
            transactionId, 
            referenceNumber, 
            responseCode, 
            status: 'approved' 
          }),
        });

        if (res.ok) {
          const data = await res.json();
          
          // Payment is fully complete and verified, now safe to clear cart
          try {
            const { clearCart } = await import('../../lib/cart-utils');
            await clearCart();
          } catch (e) {
            console.error('Failed to clear cart after success:', e);
          }

          setConfirmState('success');
          setCustomerEmail(data.customerEmail || '');
          setCustomerPhone(data.customerPhone || '');
          sessionStorage.removeItem('pendingOrderId');
          toast.success('Payment Verified Successfully');
        } else {
          const data = await res.json().catch(() => ({}));
          setConfirmState('failed');
          setErrorReason(data.error || 'Verification Interrupted');
        }
      } catch (err) {
        setConfirmState('failed');
        setErrorReason('Network Error during final handshake');
      }
    }

    confirm();
  }, [orderId, transactionId, referenceNumber, responseCode]);

  if (confirmState === 'confirming') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-display-twilight uppercase tracking-widest italic animate-pulse">
            Verifying Transaction...
        </h2>
      </div>
    );
  }

  if (confirmState === 'failed') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
          <Package className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-display-twilight uppercase tracking-widest italic mb-4">
            Handshake <span className="text-red-500">Unverified</span>
        </h1>
        <p className="text-white/50 max-w-md mb-8">{errorReason}</p>
        <Link href="/checkout" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors">
            Return to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-green-900/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        {/* Success Icon Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-10 border-2 border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        {/* Title & Welcome */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-display-twilight font-bold tracking-[0.2em] uppercase italic">
            WELCOME TO THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">COLLECTION</span>
          </h1>
          <p className="text-white/60 font-medium tracking-[0.3em] uppercase text-sm">
            Order Confirmed & Secured
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-10 md:p-16 mb-12 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Package className="w-32 h-32" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="inline-block px-6 py-2 bg-green-500/10 rounded-full border border-green-500/20 mb-4">
              <span className="text-green-500 font-bold text-xs tracking-[0.2em] uppercase">Status: Processing</span>
            </div>

            <h2 className="text-3xl font-display-twilight text-white uppercase tracking-widest">
              ORDER #{orderId?.split('-').pop() || 'HW420-TRANS'}
            </h2>

            <div className="py-8 border-y border-white/5 my-8">
              <OrderTracking orderId={orderId || 'pending'} />
            </div>

            <div className="mb-12">
              <NotificationSignup 
                orderId={orderId || 'pending'} 
                initialEmail={customerEmail}
                initialPhone={customerPhone}
              />
            </div>
            
            <p className="text-white/50 text-lg max-w-lg mx-auto leading-relaxed">
              Your transaction was successfully processed through KajaPay's secure vault. 
              Our fulfillment experts are now preparing your collection for shipment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <div className="flex flex-col items-center gap-3">
                <Truck className="w-6 h-6 text-white/40" />
                <span className="text-[10px] uppercase tracking-widest font-black text-white/30">Tracking Updates</span>
                <span className="text-xs font-bold">SMS & Email Alerts</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-white/40" />
                <span className="text-[10px] uppercase tracking-widest font-black text-white/30">Packaging</span>
                <span className="text-xs font-bold">Discrete & Secure</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="w-6 h-6 text-white/40" />
                <span className="text-[10px] uppercase tracking-widest font-black text-white/30">Verified Auth</span>
                <span className="text-xs font-bold">Age Confirmed</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
        >
          <Link 
            href="/account"
            className="flex-1 px-8 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-green-500 hover:text-white transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 group"
          >
            Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/products"
            className="flex-1 px-8 py-5 bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-3"
          >
            Shop More
          </Link>
        </motion.div>

        <p className="mt-16 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
          Thank you for choosing Highway 420. Quality is our invariant.
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <GlobalMasthead />
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </>
  );
}
