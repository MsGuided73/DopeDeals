"use client";

import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'hw420_age_verified';
const FORMAL_KEY  = 'hw420_age_verified_formal';
const OFFICIAL_LOGO = '/highway420-logo.png';

export default function AgeGateModal() {
  const { user } = useAuth();
  const [show, setShow]           = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [dob, setDob]             = useState('');
  const [error, setError]         = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // ── Show modal if not yet verified ──────────────────────────────────
  useEffect(() => {
    // 1. Check if verified in this session (LocalStorage)
    const verified       = localStorage.getItem(STORAGE_KEY);
    const formalVerified = localStorage.getItem(FORMAL_KEY);
    const legacyVerified = localStorage.getItem('dope-city-age-verified');

    // 2. Check if user is logged in and already verified in the DB/Metadata
    const dbVerified = user?.user_metadata?.age_verified || user?.age_verification_status === 'verified';

    if (verified || formalVerified || legacyVerified || dbVerified) {
      if (legacyVerified || dbVerified) localStorage.setItem(STORAGE_KEY, 'true');
      return;
    }

    setShow(true);
    document.body.style.overflow = 'hidden';
  }, [user]);

  const handleVerify = () => {
    setError('');

    if (!dob) {
      setError('Please select your date of birth.');
      return;
    }

    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
      setError('Please enter a valid date.');
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const m = today.getMonth() - dateOfBirth.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    if (age < 21) {
      setError('You must be 21+ to enter this site.');
      setTimeout(() => {
        window.location.href = 'https://google.com';
      }, 2000);
      return;
    }

    setIsVerifying(true);

    const completeVerification = async () => {
      // 1. Set local storage for guest/immediate session use
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(FORMAL_KEY, 'true');   // satisfies checkout/shipping isAgeVerified check
      localStorage.setItem('dope-city-age-verified', 'true');

      // 2. If logged in, sync with the database
      if (user) {
        try {
          await fetch('/api/age-verification/verify-self', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ageVerified: true }),
          });
        } catch (e) {
          console.error('[AgeGate] Failed to sync verification with DB:', e);
          // We continue anyway since localStorage is set and user passed the local check
        }
      }

      setIsSuccess(true);
      setIsVerifying(false);

      setTimeout(() => {
        document.body.style.overflow = '';
        setShow(false);
      }, 1000);
    };

    completeVerification();
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
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Age%20Verification/Highway420%20backdrop%20-%20Age-Checker.png")`,
            filter: 'brightness(0.6)',
          }}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.2 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl px-6 pt-16 pb-8 overflow-visible flex flex-col items-center text-center">

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 z-30 drop-shadow-2xl"
            >
              <img src={OFFICIAL_LOGO} alt="Highway 420" className="w-full h-full object-contain" />
            </motion.div>

            <div className="space-y-6 w-full">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-1">
                <h2 className="text-3xl font-display-twilight text-white uppercase tracking-[0.15em]">AGE VERIFICATION</h2>
                <p className="text-zinc-200 text-sm font-medium">Please confirm your date of birth</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
                <h3 className="text-2xl font-display-twilight text-white uppercase tracking-[0.1em]">MUST BE 21</h3>
              </motion.div>

              <div className="space-y-4 max-w-xs mx-auto">
                <div className="space-y-2">
                  <div className="relative group">
                    <div className="flex bg-black/60 border-2 border-white/20 rounded-xl h-14 items-center justify-between px-4 group-focus-within:border-orange-500 transition-all overflow-hidden relative">
                      <Calendar className="w-5 h-5 text-white/50 absolute left-4 pointer-events-none" />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full h-full bg-transparent border-none text-white font-bold text-lg focus:outline-none pl-8 cursor-pointer select-none appearance-none"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>
                </div>

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

                <motion.button
                  onClick={handleVerify}
                  whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isVerifying || isSuccess}
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
                      <span className="animate-pulse">Verifying...</span>
                    ) : (
                      'Enter Site'
                    )}
                  </span>
                </motion.button>

                <button
                  onClick={() => window.location.href = 'https://google.com'}
                  className="w-32 h-10 border border-white/10 rounded-full text-zinc-300 font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all outline-none mt-2"
                >
                  Cancel
                </button>
              </div>

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
