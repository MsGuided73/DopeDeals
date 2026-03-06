"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Cpu, Globe, CheckCircle2 } from 'lucide-react';

const STATUS_MESSAGES = [
  "Securing transaction tunnel...",
  "Authenticating payment payload...",
  "Finalizing order compliance...",
  "Opening secure payment vault...",
  "Redirecting to KajaPay Gateway..."
];

export default function CheckoutProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl');
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!redirectUrl) {
      // Fallback if accessed directly
      const timer = setTimeout(() => router.push('/checkout'), 3000);
      return () => clearTimeout(timer);
    }

    // Cycle status messages
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);

    // Simulated progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 10;
      });
    }, 300);

    // The actual redirect after a minimum "trust building" time
    const redirectTimer = setTimeout(() => {
        window.location.href = redirectUrl;
    }, 4500); // 4.5 seconds for maximum cinematic effect

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
      clearTimeout(redirectTimer);
    };
  }, [redirectUrl, router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-inter overflow-hidden relative">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl text-center space-y-12"
      >
        {/* 3D-Styled Logo Container */}
        <div className="relative h-48 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              y: [0, -10, 0]
            }}
            transition={{ 
              rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-20 w-40 h-40"
            style={{ perspective: 1000, transformStyle: "preserve-3d" }}
          >
            <img 
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png" 
              alt="Highway 420" 
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,107,0,0.4)]"
            />
          </motion.div>

          {/* Orbiting Rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
              className="absolute border border-white/5 rounded-full"
              style={{
                width: 240 + i * 80,
                height: 240 + i * 80,
                opacity: 0.3 - i * 0.1
              }}
            />
          ))}
        </div>

        {/* Security Alerts / Pulse */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-6"
          >
            <Lock className="w-5 h-5 text-green-500" />
            <h1 className="text-2xl md:text-3xl font-display-twilight tracking-[0.2em] font-bold uppercase italic">
              SECURITY <span className="text-orange-500">HANDSHAKE</span>
            </h1>
            <Shield className="w-5 h-5 text-green-500" />
          </motion.div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Hardware Encrypted</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> PCI-DSS Compliant</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Vault Verified</span>
          </div>
        </div>

        {/* Status Messaging Area */}
        <div className="space-y-6">
          <div className="relative h-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white/80 text-sm font-medium tracking-widest uppercase italic"
              >
                {STATUS_MESSAGES[statusIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Premium Progress Bar */}
          <div className="max-w-xs mx-auto space-y-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
              <motion.div 
                className="h-full bg-gradient-to-r from-orange-600 to-green-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] text-white/30 font-bold tracking-widest uppercase">Encryption Status</span>
              <span className="text-[9px] text-white/50 font-bold tabular-nums tracking-widest">{Math.floor(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Confidence Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-8 border-t border-white/5"
        >
          <p className="text-[9px] text-white/20 font-medium uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
            Please do not refresh this page. You are being securely handed off to KajaPay for final payment authorization.
          </p>
        </motion.div>
      </motion.div>

      {/* Background Decorative Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
            style={{ left: `${(i + 1) * 15}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
