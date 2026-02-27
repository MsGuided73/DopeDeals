"use client";

import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

const STORAGE_KEY = 'hw420_age_verified';
const API_KEY = '64Tw24wNqoE1MNcvdwYboVpmdpFsv7tZ';

export default function AgeGateModal() {
  const [show, setShow] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    if (!verified) {
      setShow(true);
      document.body.style.overflow = 'hidden';

      // Pre-load the AgeChecker script silently in the background
      // so it's ready when the user clicks confirm
      if (!document.getElementById('agechecker-script')) {
        const script = document.createElement('script');
        script.id = 'agechecker-script';
        script.type = 'text/javascript';
        script.src = 'https://cdn.agechecker.net/static/popup/v1/popup.js';
        script.setAttribute('data-agecheck-api-key', API_KEY);
        // Prevent it from auto-popping so our modal stays in control
        script.setAttribute('data-agecheck-disable-auto', 'true');
        document.head.appendChild(script);
      }

      // Listen for AgeChecker's verified event
      const onVerified = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        document.body.style.overflow = '';
        setShow(false);
        setIsVerifying(false);
      };

      window.addEventListener('agechecker:verified', onVerified);
      return () => window.removeEventListener('agechecker:verified', onVerified);
    }
  }, []);

  const handleVerify = () => {
    // Mark as verified in localStorage (informal gate) and allow entry
    // AgeChecker's formal verification will be enforced again at checkout
    localStorage.setItem(STORAGE_KEY, 'true');
    document.body.style.overflow = '';
    setShow(false);

    // Optionally attempt to trigger formal AgeChecker verify
    setIsVerifying(true);
    try {
      const ac = (window as any).AgeChecker;
      if (ac && typeof ac.verify === 'function') {
        ac.verify(); // Trigger AgeChecker's flow if available
      }
    } catch (e) {
      // Widget not ready or not needed here — localStorage gate is sufficient
    }
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop — blurs the landing page behind the modal */}
      <div
        className="fixed inset-0 z-[9998] backdrop-blur-md bg-black/75"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-700 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-amber-500 to-primary" />

          {/* Logo watermark */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url("https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png")`,
              backgroundSize: '70%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <div className="relative z-10 p-8 text-center">
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
              alt="Highway 420"
              className="h-14 mx-auto object-contain mb-6"
            />

            {/* Shield icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>

            {/* Big age badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/50 mx-auto mb-6 shadow-[0_0_20px_rgba(255,255,255,0.07)]">
              <span className="text-3xl font-black text-white">21+</span>
            </div>

            {/* Heading */}
            <h2
              id="age-gate-title"
              className="text-2xl font-bold uppercase tracking-widest text-white mb-2 font-heading"
            >
              Age Verification
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              You must be <strong className="text-white">21 years or older</strong> to enter this site. By continuing you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
            </p>

            {/* CTAs — both buttons visible */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-primary/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] text-sm disabled:opacity-60"
              >
                {isVerifying ? 'Verifying...' : "I'm 21 or Older — Enter Site"}
              </button>
              <button
                onClick={handleDeny}
                className="w-full py-3 bg-transparent border border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-500 font-medium rounded-xl transition-all text-sm"
              >
                I'm Under 21 — Exit
              </button>
            </div>

            <p className="text-xs text-zinc-600 mt-6">
              Verified by{' '}
              <a
                href="https://agechecker.net"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-400 underline"
              >
                AgeChecker.Net
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
