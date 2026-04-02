"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, CreditCard, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react';
import GlobalMasthead from '../../components/GlobalMasthead';

// Sanitize error messages from URL params to avoid showing internal details to customers
function sanitizeErrorMessage(raw: string | null): string {
  const fallback = 'The transaction could not be completed at this time.';
  if (!raw) return fallback;
  // Block stack traces, SQL errors, or excessively long messages
  if (raw.length > 200 || raw.includes('Error:') || raw.includes('at ') || raw.includes('SQL') || raw.includes('supabase')) {
    return fallback;
  }
  return raw;
}

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = sanitizeErrorMessage(searchParams.get('message'));
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        {/* Error Icon Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-10 border-2 border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
        >
          <AlertCircle className="w-12 h-12 text-red-500" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-display-twilight font-bold tracking-[0.2em] uppercase italic">
            TRANSACTION <span className="text-red-500">INTERRUPTED</span>
          </h1>
          <p className="text-white/40 font-medium tracking-[0.3em] uppercase text-sm">
            Security Handshake Refused
          </p>
        </motion.div>

        {/* Error Details Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-10 md:p-16 mb-12 relative overflow-hidden"
        >
          <div className="relative z-10 space-y-8">
            <div className="inline-block px-6 py-2 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
              <span className="text-red-500 font-bold text-xs tracking-[0.2em] uppercase italic">Verification Failed</span>
            </div>

            <p className="text-white/70 text-lg max-w-lg mx-auto leading-relaxed font-medium">
              "{error}"
            </p>
            
            <p className="text-white/40 text-sm max-w-md mx-auto">
              This often happens due to a simple card mismatch or network timeout. 
              Your order data is preserved in our secure vault.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                <CreditCard className="w-6 h-6 text-white/40" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-white/30 tracking-widest">Recommendation</p>
                  <p className="text-xs font-bold">Try a different card</p>
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                <MessageSquare className="w-6 h-6 text-white/40" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-white/30 tracking-widest">Support Line</p>
                  <p className="text-xs font-bold">Chat with our team</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
        >
          <Link 
            href="/checkout"
            className="flex-1 px-8 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-500 shadow-2xl flex items-center justify-center gap-3 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Retry Checkout
          </Link>
          <Link 
            href="/products"
            className="flex-1 px-8 py-5 bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Shop more
          </Link>
        </motion.div>

        <p className="mt-16 text-white/10 text-[9px] font-bold uppercase tracking-[0.4em]">
          SECURITY ID: {orderId?.split('-').pop() || 'AUTH-FAIL-420'}
        </p>
      </div>
    </div>
  );
}

export default function OrderErrorPage() {
  return (
    <>
      <GlobalMasthead />
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </>
  );
}
