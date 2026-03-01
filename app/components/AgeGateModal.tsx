"use client";

import React, { useEffect, useState } from 'react';
import { Shield, MapPin, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCompliance } from '../contexts/ComplianceContext';

const STORAGE_KEY = 'hw420_age_verified';
const LOGO_URL = 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png';

export default function AgeGateModal() {
  const [show, setShow] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [zipError, setZipError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { setUserZipCode } = useCompliance();

  useEffect(() => {
    // Check if user has already been verified
    const verified = localStorage.getItem(STORAGE_KEY);
    // Also check for legacy key to avoid double-gating returning users
    const legacyVerified = localStorage.getItem('dope-city-age-verified');
    
    if (!verified && !legacyVerified) {
      setShow(true);
      document.body.style.overflow = 'hidden';
    } else if (legacyVerified && !verified) {
      // Migrate legacy verification
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }, []);

  const handleVerify = () => {
    // Validate ZIP if provided
    if (zipCode && !/^\d{5}$/.test(zipCode)) {
      setZipError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setZipError('');
    setIsVerifying(true);

    // Save compliance state
    if (zipCode) {
      setUserZipCode(zipCode);
    }

    // Informal gate verification
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem('dope-city-age-verified', 'true'); // Keep legacy key for compatibility
    
    // Show success state briefly
    setIsSuccess(true);
    
    // Smooth transition out
    setTimeout(() => {
      document.body.style.overflow = '';
      setShow(false);
      setIsVerifying(false);
    }, 1200);

    // Optionally attempt to trigger formal AgeChecker verify
    try {
      const ac = (window as any).AgeChecker;
      if (ac && typeof ac.verify === 'function') {
        ac.verify();
      }
    } catch (e) {
      // Widget not ready or disabled
    }
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop — Ultra-premium blurred texture */}
      <div
        className="absolute inset-0 z-0 backdrop-blur-3xl bg-black/60 transition-all duration-1000"
        aria-hidden="true"
      >
        {/* Dynamic Light Orbs for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dope-orange-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-xl bg-black/40 backdrop-blur-md rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-700 transform ${isSuccess ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {/* Top Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-dope-orange-500/50 to-transparent rounded-t-[2.5rem]" />

        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          {/* Brand Shield Logo */}
          <div className="relative mb-8 group animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="absolute -inset-8 bg-dope-orange-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 p-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
              <img
                src={LOGO_URL}
                alt="Highway 420"
                className="h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Verification Content */}
          <div className="mb-10 space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dope-orange-500/10 border border-dope-orange-500/20">
              <Shield className="w-3.5 h-3.5 text-dope-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-dope-orange-400">Strictly 21+ Only</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
              Verify Your <span className="text-transparent bg-clip-text bg-gradient-to-br from-dope-orange-400 via-amber-500 to-dope-orange-600">Access Point</span>
            </h2>
            
            <p className="text-zinc-400 text-sm md:text-base max-w-sm mx-auto leading-relaxed font-medium">
              Welcome to the Highway. You must be <span className="text-white">21 or older</span> to enter. Provide your ZIP to unlock local delivery.
            </p>
          </div>

          {/* Form Area */}
          <div className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            {/* ZIP Input */}
            <div className="relative group">
              <div className={`absolute inset-0 bg-dope-orange-500/20 rounded-2xl blur-xl transition-opacity duration-500 ${zipCode.length === 5 ? 'opacity-100' : 'opacity-0'}`} />
              <div className="relative flex items-center bg-zinc-900/80 border border-white/10 rounded-2xl focus-within:border-dope-orange-500/50 transition-all duration-300 backdrop-blur-xl">
                <div className="pl-5 text-zinc-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="Enter Delivery ZIP (Recommended)"
                  value={zipCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setZipCode(val);
                    if (val.length === 5) setZipError('');
                  }}
                  className="w-full bg-transparent border-none text-white px-4 py-5 font-bold tracking-widest focus:outline-none placeholder:text-zinc-700 placeholder:tracking-normal placeholder:font-medium"
                />
                {zipCode.length === 5 && !zipError && (
                  <div className="pr-5 text-green-500 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-6 h-6 " />
                  </div>
                )}
              </div>
              {zipError && (
                <div className="absolute left-2 -bottom-6 flex items-center gap-1.5 text-dope-orange-500 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-1">
                  <AlertCircle className="w-3 h-3" />
                  {zipError}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleVerify}
                disabled={isVerifying || isSuccess}
                className="group relative w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-dope-orange-500 hover:text-white hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] active:scale-95 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSuccess ? (
                    'Welcome to the Highway'
                  ) : isVerifying ? (
                    'Opening Gates...'
                  ) : (
                    <>
                      Enter Site
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={handleDeny}
                className="w-full py-4 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-[0.25em] transition-colors"
              >
                Exit — Under 21
              </button>
            </div>
          </div>

          {/* High-end Footer */}
          <div className="mt-12 pt-8 border-t border-white/5 w-full flex items-center justify-between text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] animate-in fade-in duration-1000 delay-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              Encrypted Session
            </div>
            <div className="flex items-center gap-6">
              <a href="/terms" className="hover:text-dope-orange-500 transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-dope-orange-500 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Success Success Shine Effect */}
      <div className={`fixed inset-0 z-[100] bg-white transition-opacity duration-1000 pointer-events-none ${isSuccess ? 'opacity-10' : 'opacity-0'}`} />
    </div>
  );
}
