"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import GlobalMasthead from '../../components/GlobalMasthead';

function AgeVerificationSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'approved' | 'declined'>('processing');

  useEffect(() => {
    // Didit appends ?status=Approved&verificationSessionId=...
    const diditStatus = searchParams.get('status');

    if (diditStatus === 'Approved') {
      setStatus('approved');
      // Set the local flag to immediately unblock the frontend checkout flow
      localStorage.setItem('hw420_age_verified_formal', 'true');

      // Give the webhook a second to process and update Supabase securely
      setTimeout(() => {
        router.push('/checkout/shipping');
      }, 3000);
    } else if (diditStatus === 'Declined' || diditStatus === 'In Review') {
      setStatus('declined');
    } else {
      // Fallback if no status, assume processing
      setTimeout(() => {
        router.push('/checkout/shipping');
      }, 4000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-inter p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-dope-orange/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glassmorphic-dark rounded-[2rem] p-10 md:p-16 text-center max-w-lg w-full relative z-10 border border-white/10 shadow-2xl">
        {status === 'processing' && (
          <div className="animate-in fade-in zoom-in duration-500">
            <Loader2 className="w-20 h-20 text-dope-orange animate-spin mx-auto mb-8" />
            <h1 className="text-3xl font-display-twilight text-white uppercase tracking-[0.15em] mb-4 font-bold pr-4">Processing Verification</h1>
            <p className="text-white/60">Please wait while we securely process your results. You will be redirected shortly.</p>
          </div>
        )}

        {status === 'approved' && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-display-twilight text-white uppercase tracking-[0.15em] mb-4 font-bold pr-4">Age Verified</h1>
            <p className="text-white/60 mb-8 max-w-sm mx-auto">Your identity has been confirmed. Redirecting back to checkout...</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-[progress_3s_ease-in-out_forwards]"></div>
            </div>
          </div>
        )}

        {status === 'declined' && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-display-twilight text-white uppercase tracking-[0.15em] mb-4 font-bold pr-4">Verification Failed</h1>
            <p className="text-white/60 mb-8">Unfortunately, we could not verify your age at this time. Please try again or contact support.</p>
            <button
              onClick={() => router.push('/age-verification')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl uppercase tracking-widest font-bold transition-all w-full"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgeVerificationSuccessPage() {
  return (
    <>
      <GlobalMasthead />
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-20 h-20 text-dope-orange animate-spin" />
        </div>
      }>
        <AgeVerificationSuccessContent />
      </Suspense>
    </>
  );
}
