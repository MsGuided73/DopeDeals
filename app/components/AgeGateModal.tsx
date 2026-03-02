"use client";

import React, { useEffect, useState } from 'react';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCompliance } from '../contexts/ComplianceContext';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'hw420_age_verified';
// Official Transparent Logo
const OFFICIAL_LOGO = '/highway420-logo.png';
// Mockup-accurate boutique background
const BACKGROUND_URL = '/images/age-gate/mockup-boutique-bg.png';

export default function AgeGateModal() {
  const [show, setShow] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { setUserZipCode } = useCompliance();

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    const legacyVerified = localStorage.getItem('dope-city-age-verified');
    
    if (!verified && !legacyVerified) {
      setShow(true);
      document.body.style.overflow = 'hidden';
    } else if (legacyVerified && !verified) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }, []);

  const calculateAge = (m: number, d: number, y: number) => {
    const today = new Date();
    const birthDate = new Date(y, m - 1, d);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleVerify = () => {
    if (!dobMonth || !dobDay || !dobYear) {
      setError('Please Enter Full DOB');
      return;
    }
    const m = parseInt(dobMonth);
    const d = parseInt(dobDay);
    const y = parseInt(dobYear);
    
    // Strict validation for MM/DD/YYYY
    if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) {
      setError('Invalid Date Formatting');
      return;
    }

    // Check if day is valid for the month
    const daysInMonth = new Date(y, m, 0).getDate();
    if (d > daysInMonth) {
      setError('Invalid Day for Month');
      return;
    }

    const age = calculateAge(m, d, y);
    if (age < 21) {
      setError('Strict 21+ Verification Required.');
      return;
    }
    
    setError('');
    setIsVerifying(true);
    if (zipCode) setUserZipCode(zipCode);
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem('dope-city-age-verified', 'true');
    setIsSuccess(true);
    setTimeout(() => {
      document.body.style.overflow = '';
      setShow(false);
      setIsVerifying(false);
    }, 1500);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-hidden font-inter"
      >
        {/* BOUTIQUE INTERIOR BACKGROUND */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url("${BACKGROUND_URL}")`,
            filter: 'brightness(0.3) contrast(1.1) blur(6px)',
          }}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 60 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 120,
            delay: 0.2
          }}
          className="relative z-10 w-full max-w-lg"
        >
          {/* THE MOCKUP GLASS CARD - ENHANCED DEPTH */}
          <div className="relative bg-[#050505]/95 backdrop-blur-[40px] rounded-[3.5rem] border border-white/10 shadow-[0_100px_200px_-50px_rgba(0,0,0,1),0_0_100px_rgba(255,140,0,0.05)] px-10 pt-36 pb-14 overflow-visible">
            
            {/* THE "PREMIUM SHIELD" LOGO - MASSIVE OVERLAP & GLOW */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -top-28 left-1/2 -translate-x-1/2 w-60 h-60 z-30 pointer-events-none drop-shadow-[0_25px_50px_rgba(0,0,0,1)]"
            >
              {/* Diffuse backglow to simulate a 3D physical badge sitting on the glass */}
              <div className="absolute inset-0 bg-white/10 blur-[80px] rounded-full scale-125 opacity-60" />
              
              <img
                src={OFFICIAL_LOGO}
                alt="Highway 420"
                className="w-full h-full object-contain brightness-[1.1] contrast-[1.05]"
              />
            </motion.div>

            {/* Top Shine/Glow Strip - ENHANCED HIERARCHY */}
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent rounded-t-[3.5rem] pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-12 relative z-10">
              {/* Header Block - REFINED HIERARCHY */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-4xl md:text-5xl font-[1000] text-white tracking-[0.08em] uppercase leading-none drop-shadow-lg">
                  Age Verification
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-8 bg-zinc-800" />
                  <p className="text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
                    Required For Access
                  </p>
                  <div className="h-[1px] w-8 bg-zinc-800" />
                </div>
              </motion.div>

              {/* Main Question - HIGH IMPACT */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="relative w-full py-2"
              >
                <h3 className="text-3xl md:text-4xl font-[950] text-white italic tracking-tighter uppercase">
                  Are you over 21?
                </h3>
              </motion.div>

              {/* Form Grid - UPDATED MM/DD/YYYY Logic & SUNKEN DEPTH */}
              <div className="w-full space-y-14">
                <div className="grid grid-cols-2 gap-8">
                  {/* DOB Column - NOW MM / DD / YYYY */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    <div className="h-18 bg-black/80 border border-white/[0.05] rounded-3xl flex items-center justify-center px-6 focus-within:border-[#ff8c00]/50 shadow-[inset_0_8px_16px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] transition-all">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="MM"
                          maxLength={2}
                          value={dobMonth}
                          onChange={(e) => setDobMonth(e.target.value.replace(/\D/g, ''))}
                          className="w-10 bg-transparent border-none text-white text-center font-black text-2xl focus:outline-none placeholder:text-zinc-900"
                        />
                        <span className="text-zinc-800 font-black text-xl">/</span>
                        <input
                          type="text"
                          placeholder="DD"
                          maxLength={2}
                          value={dobDay}
                          onChange={(e) => setDobDay(e.target.value.replace(/\D/g, ''))}
                          className="w-10 bg-transparent border-none text-white text-center font-black text-2xl focus:outline-none placeholder:text-zinc-900"
                        />
                        <span className="text-zinc-800 font-black text-xl">/</span>
                        <input
                          type="text"
                          placeholder="YYYY"
                          maxLength={4}
                          value={dobYear}
                          onChange={(e) => setDobYear(e.target.value.replace(/\D/g, ''))}
                          className="w-18 bg-transparent border-none text-white text-center font-black text-2xl focus:outline-none placeholder:text-zinc-900"
                        />
                      </div>
                    </div>
                    <span className="block text-[11px] font-[900] text-zinc-600 tracking-[0.3em] uppercase">Birth Date</span>
                  </motion.div>

                  {/* ZIP Column - SUNKEN DEPTH */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    <div className="h-18 bg-black/80 border border-white/[0.05] rounded-3xl flex items-center justify-center px-6 focus-within:border-[#ff8c00]/50 shadow-[inset_0_8px_16px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] transition-all">
                      <input
                        type="text"
                        placeholder="ZIP CODE"
                        maxLength={5}
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-transparent border-none text-white text-center font-black text-2xl focus:outline-none placeholder:text-zinc-900"
                      />
                    </div>
                    <span className="block text-[11px] font-[900] text-zinc-600 tracking-[0.3em] uppercase text-center">Zip Code</span>
                  </motion.div>
                </div>

                {/* Status Feedback */}
                <div className="h-6"> {/* Fixed height to prevent layout shift */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[#ff8c00] text-[11px] font-black uppercase tracking-widest bg-[#ff8c00]/5 py-3 rounded-2xl border border-[#ff8c00]/10 drop-shadow-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Primary Action - ULTRA GLOSSY 3D BUTTON */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-6 pt-4"
                >
                  <motion.button
                    onClick={handleVerify}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isVerifying}
                    className={`group relative w-full h-[88px] rounded-[2.8rem] overflow-hidden transition-all duration-300 shadow-[0_25px_60px_-10px_rgba(255,140,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] ${isSuccess ? 'bg-green-600 shadow-[0_25px_60px_-10px_rgba(34,197,94,0.5)]' : 'bg-gradient-to-b from-[#ff9e22] to-[#e65c00]'}`}
                  >
                    {/* Mirror-Shine Gloss Overlay */}
                    <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-white/60 via-white/20 to-transparent opacity-90 pointer-events-none" />
                    
                    {/* Inner 3D Bevel Lighting */}
                    <div className="absolute inset-0 rounded-[2.8rem] shadow-[inset_0_4px_12px_rgba(255,255,255,0.4),inset_0_-4px_12px_rgba(0,0,0,0.3)] pointer-events-none border-t border-white/40" />
                    
                    <span className="relative z-10 text-white font-[1000] text-3xl md:text-4xl uppercase tracking-[0.25em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] flex items-center justify-center gap-3">
                      {isSuccess ? (
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-4"
                        >
                          <CheckCircle2 className="w-12 h-12" />
                          <span>Verified</span>
                        </motion.div>
                      ) : (
                        'Enter Site'
                      )}
                    </span>

                    {/* Loading/Verifying Glow */}
                    {isVerifying && !isSuccess && (
                      <motion.div 
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                      />
                    )}
                  </motion.button>

                  <button
                    onClick={() => window.location.href = 'https://google.com'}
                    className="w-full h-14 border-2 border-white/[0.03] rounded-full text-zinc-700 font-black text-[11px] uppercase tracking-[0.6em] hover:bg-white/[0.03] hover:text-zinc-400 transition-all"
                  >
                    Cancel
                  </button>
                </motion.div>

                {/* Regulatory Footer - SUBTLE & REFINED HIERARCHY */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="pt-12 space-y-12"
                >
                  <div className="max-w-[340px] mx-auto space-y-4">
                    <p className="text-zinc-700 text-[10px] leading-relaxed font-[900] uppercase tracking-[0.2em] opacity-40 italic">
                      All consumers must be at least 21 to enter Highway420.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-16 text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em]">
                    <a href="/terms" className="hover:text-zinc-400 transition-colors">Terms</a>
                    <a href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
