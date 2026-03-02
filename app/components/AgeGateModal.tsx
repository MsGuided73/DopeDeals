"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Shield, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useCompliance } from '../contexts/ComplianceContext';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'hw420_age_verified';
const FORMAL_KEY  = 'hw420_age_verified_formal';
const OFFICIAL_LOGO = '/highway420-logo.png';

export default function AgeGateModal() {
  const [show, setShow]           = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [dobMonth, setDobMonth]   = useState('');
  const [dobDay, setDobDay]       = useState('');
  const [dobYear, setDobYear]     = useState('');
  const [zipCode, setZipCode]     = useState('');
  const [error, setError]         = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [acReady, setAcReady]     = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setUserZipCode } = useCompliance();

  // ── Show modal if not yet verified ──────────────────────────────────
  useEffect(() => {
    const verified       = localStorage.getItem(STORAGE_KEY);
    const formalVerified = localStorage.getItem(FORMAL_KEY);
    const legacyVerified = localStorage.getItem('dope-city-age-verified');

    if (verified || formalVerified || legacyVerified) {
      // Already verified — make sure we have both keys set
      if (legacyVerified) localStorage.setItem(STORAGE_KEY, 'true');
      return;
    }

    setShow(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // ── Poll for AgeChecker global ───────────────────────────────────────
  useEffect(() => {
    if (!show) return;

    let count = 0;
    const poll = () => {
      const ac = (window as any).AgeChecker || (window as any).AgeCheckerPopup;
      if (ac && (typeof ac.verify === 'function' || typeof ac.show === 'function' || typeof ac.open === 'function')) {
        setAcReady(true);
        return;
      }
      if (count < 40) { // 20 seconds max
        count++;
        pollRef.current = setTimeout(poll, 500);
      }
    };
    poll();
    return () => { if (pollRef.current) clearTimeout(pollRef.current); };
  }, [show]);

  // ── Listen for AgeChecker events ────────────────────────────────────
  useEffect(() => {
    if (!show) return;

    const onVerified = (e: any) => {
      // Store verification
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(FORMAL_KEY,  'true');
      localStorage.setItem('dope-city-age-verified', 'true');
      const txId = e?.detail?.uuid || e?.detail?.id || e?.detail?.transactionId;
      if (txId) localStorage.setItem('hw420_age_checker_id', String(txId));

      setIsSuccess(true);
      setIsVerifying(false);

      setTimeout(() => {
        document.body.style.overflow = '';
        setShow(false);
      }, 1400);
    };

    const onFailed = () => {
      setIsVerifying(false);
      setError('Age verification failed. You must be 21+ to enter this site.');
    };

    const onDeclined = () => {
      setIsVerifying(false);
      window.location.href = 'https://google.com'; // bounce underage visitors
    };

    window.addEventListener('agechecker:verified', onVerified);
    window.addEventListener('agechecker:failed',   onFailed);
    window.addEventListener('agechecker:declined', onDeclined);
    return () => {
      window.removeEventListener('agechecker:verified', onVerified);
      window.removeEventListener('agechecker:failed',   onFailed);
      window.removeEventListener('agechecker:declined', onDeclined);
    };
  }, [show]);

  // ── Verify handler ──────────────────────────────────────────────────
  const handleVerify = () => {
    setError('');

    // Basic format validation
    if (!dobMonth || !dobDay || !dobYear) {
      setError('Please enter your full date of birth');
      return;
    }
    const m = parseInt(dobMonth, 10);
    const d = parseInt(dobDay,   10);
    const y = parseInt(dobYear,  10);

    if (isNaN(m) || isNaN(d) || isNaN(y)
      || m < 1 || m > 12
      || d < 1 || d > 31
      || y < 1900 || y > new Date().getFullYear()) {
      setError('Invalid date of birth');
      return;
    }

    // Quick plausibility check — must be at least 21 to even attempt
    const today = new Date();
    const birthDate = new Date(y, m - 1, d);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age < 21) {
      setError('You must be 21 or older to enter this site.');
      return;
    }

    if (zipCode) setUserZipCode(zipCode);

    // If AgeChecker isn't loaded yet (unlikely but safe), fall back to form verified
    const ac = (window as any).AgeChecker || (window as any).AgeCheckerPopup;
    if (!ac) {
      setError('Verification service is loading. Please wait a moment and try again.');
      return;
    }

    // Pre-fill DOB into AgeChecker config so their soft-check uses it
    (window as any).ageCheckerConfig = {
      ...((window as any).ageCheckerConfig || {}),
      dob: { month: m, day: d, year: y },
    };

    setIsVerifying(true);

    // Trigger AgeChecker — their popup handles soft-check → ID escalation
    const method = ac.verify || ac.show || ac.open;
    if (typeof method === 'function') {
      method.call(ac);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-hidden font-inter bg-black"
      >
        {/* PREMIUM BACKDROP IMAGE */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Age%20Verification/Highway420%20backdrop%20-%20Age-Checker.png")`,
            filter: 'brightness(0.6)',
          }}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.2 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* GLASS CARD */}
          <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl px-6 pt-16 pb-8 overflow-visible flex flex-col items-center text-center">

            {/* OVERLAPPING LOGO */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 z-30 drop-shadow-2xl"
            >
              <img src={OFFICIAL_LOGO} alt="Highway 420" className="w-full h-full object-contain" />
            </motion.div>

            <div className="space-y-6 w-full">
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-1">
                <h2 className="text-3xl font-display-twilight text-white uppercase tracking-[0.15em]">AGE VERIFICATION</h2>
                <p className="text-zinc-200 text-sm font-medium">Please confirm your date of birth to enter</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
                <h3 className="text-2xl font-display-twilight text-white uppercase tracking-[0.1em]">MUST BE 21 TO ENTER</h3>
              </motion.div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* DOB Field */}
                  <div className="space-y-2">
                    <div className="relative group">
                      <div className="flex bg-black/60 border-2 border-white/20 rounded-xl h-14 items-center justify-center px-2 group-focus-within:border-orange-500 transition-all">
                        <input
                          type="text" placeholder="MM" maxLength={2}
                          value={dobMonth}
                          onChange={(e) => setDobMonth(e.target.value.replace(/\D/g, ''))}
                          className="w-8 bg-transparent border-none text-white text-center font-bold text-lg focus:outline-none placeholder:text-zinc-600"
                        />
                        <span className="text-white/40 mb-0.5">/</span>
                        <input
                          type="text" placeholder="DD" maxLength={2}
                          value={dobDay}
                          onChange={(e) => setDobDay(e.target.value.replace(/\D/g, ''))}
                          className="w-8 bg-transparent border-none text-white text-center font-bold text-lg focus:outline-none placeholder:text-zinc-600"
                        />
                        <span className="text-white/40 mb-0.5">/</span>
                        <input
                          type="text" placeholder="YYYY" maxLength={4}
                          value={dobYear}
                          onChange={(e) => setDobYear(e.target.value.replace(/\D/g, ''))}
                          className="w-14 bg-transparent border-none text-white text-center font-bold text-lg focus:outline-none placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date of Birth</span>
                  </div>

                  {/* ZIP Field */}
                  <div className="space-y-2">
                    <div className="relative group">
                      <div className="flex bg-black/60 border-2 border-white/20 rounded-xl h-14 items-center justify-center px-4 group-focus-within:border-orange-500 transition-all">
                        <input
                          type="text" placeholder="ZIP CODE" maxLength={5}
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-transparent border-none text-white text-center font-bold text-lg focus:outline-none placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zip Code</span>
                  </div>
                </div>

                {/* Error / Status */}
                <div className="min-h-[20px]">
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-orange-500 text-xs font-bold uppercase tracking-tighter"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* PRIMARY BUTTON */}
                <motion.button
                  onClick={handleVerify}
                  whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isVerifying}
                  className={`relative w-full h-16 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${
                    isSuccess
                      ? 'bg-green-600'
                      : isVerifying
                      ? 'bg-gradient-to-b from-orange-400/70 to-orange-600/70'
                      : 'bg-gradient-to-b from-orange-400 to-orange-600'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center gap-3 text-white font-black text-2xl uppercase tracking-widest drop-shadow-md">
                    {isSuccess ? (
                      <><CheckCircle2 className="w-6 h-6" /> Verified</>
                    ) : isVerifying ? (
                      <><Loader2 className="w-6 h-6 animate-spin" /> Verifying...</>
                    ) : !acReady ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</>
                    ) : (
                      'Enter Site'
                    )}
                  </span>
                </motion.button>

                {/* AgeChecker branding */}
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                  Powered by AgeChecker.net · ID Verification Required
                </p>

                {/* CANCEL */}
                <button
                  onClick={() => window.location.href = 'https://google.com'}
                  className="w-32 h-10 border border-white/10 rounded-full text-zinc-300 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all outline-none"
                >
                  Cancel
                </button>
              </div>

              {/* FOOTER LINKS */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <a href="/terms"   className="text-[9px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors">Terms & Conditions</a>
                <a href="/privacy" className="text-[9px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
