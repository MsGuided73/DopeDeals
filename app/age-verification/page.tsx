"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Calendar, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import GlobalBreadcrumbs from '../components/GlobalBreadcrumbs';

export default function AgeVerificationPage() {
  const { user, updateUserMetadata, loading: authLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServiceLoading, setIsServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState(false);

  useEffect(() => {
    // Polling for AgeChecker availability if not immediately present
    let pollCount = 0;
    const checkService = () => {
      const ac = (window as any).AgeChecker || (window as any).AgeCheckerPopup;
      if (ac && (typeof ac.verify === 'function' || typeof ac.show === 'function' || typeof ac.open === 'function')) {
        setIsServiceLoading(false);
      } else if (pollCount < 30) { // Poll for 15 seconds max (sync with checkout)
        pollCount++;
        setTimeout(checkService, 500);
      } else {
        setIsServiceLoading(false); 
        setServiceError(true);
        console.error('[AgeChecker] Service failed to load after polling');
      }
    };
    checkService();
    // Check if already verified in this session or metadata
    if (user?.user_metadata?.age_verified) {
      setIsSuccess(true);
    }

    const handleVerified = async (event: any) => {
      console.log('[AgeChecker] Verification successful event:', event);
      
      // Persist locally for session consistency
      localStorage.setItem('hw420_age_verified', 'true');
      localStorage.setItem('hw420_age_verified_formal', 'true');
      if (event.detail?.uuid || event.detail?.id) {
        localStorage.setItem('hw420_age_checker_id', event.detail.uuid || event.detail.id);
      }
      
      setIsSuccess(true);
      setIsVerifying(false);
      toast.success('Age verified successfully!');

      // Persist to user metadata if logged in
      if (user) {
        try {
          await updateUserMetadata({
            age_verified: true,
            age_verified_at: new Date().toISOString(),
            age_checker_status: 'verified'
          });
          console.log('[AgeChecker] User metadata updated successfully');
        } catch (error) {
          console.error('[AgeChecker] Failed to update user metadata:', error);
        }
      }
    };

    window.addEventListener('agechecker:verified', handleVerified);
    return () => window.removeEventListener('agechecker:verified', handleVerified);
  }, [user, updateUserMetadata]);

  const handleStartVerification = () => {
    const ac = (window as any).AgeChecker || (window as any).AgeCheckerPopup;
    if (ac && (typeof ac.verify === 'function' || typeof ac.show === 'function' || typeof ac.open === 'function')) {
      setIsVerifying(true);
      
      // Map user metadata fields correctly to AgeChecker config
      const config = {
        apiKey: process.env.NEXT_PUBLIC_AGECHECKER_API_KEY || '64Tw24wNqoE1MNcvdwYboVpmdpFsv7tZ',
        customerEmail: user?.email,
        customerFirstName: user?.user_metadata?.firstName || user?.user_metadata?.full_name?.split(' ')[0] || '',
        customerLastName: user?.user_metadata?.lastName || user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
      };
      
      console.log('[AgeChecker] Triggering verification with config:', { ...config, apiKey: '***' });
      (window as any).ageCheckerConfig = config;

      if (typeof ac.verify === 'function') ac.verify();
      else if (typeof ac.show === 'function') ac.show();
      else if (typeof ac.open === 'function') ac.open();
    } else {
      toast.error('Age verification service failed to initialize. Please refresh the page.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-12 h-12 text-dope-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <GlobalMasthead />

      <div className="min-h-screen relative overflow-hidden flex flex-col font-inter">
        {/* Cinematic Backdrop */}
        <div 
          className="fixed inset-0 z-0 bg-black"
          style={{
            backgroundImage: `url("https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Age%20Verification/Highway420%20backdrop%20-%20Age-Checker.png")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 flex-grow pt-12 pb-24">
          <div className="max-w-5xl mx-auto px-6">
            
            {/* Header Section */}
            <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
              
              <div className="flex justify-center mb-8">
                 <GlobalBreadcrumbs paths={[{ name: "Age Verification" }]} />
              </div>

              <div className="inline-block mb-4 overflow-visible relative group pr-4">
                <h1 className="text-6xl md:text-8xl font-display-twilight font-bold tracking-[0.2em] text-white uppercase italic leading-none relative z-10 pr-6">
                  AGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50">VERIFICATION</span>
                </h1>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30"></div>
                <p className="text-white/60 font-medium tracking-[0.3em] uppercase text-sm">
                  Official Compliance Protocol
                </p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
              </div>
            </div>

            {/* Main Action Card */}
            <div className="glassmorphic-dark rounded-[2.5rem] p-1 md:p-1.5 mb-12 shadow-2xl relative group overflow-hidden border border-white/10">
              {/* Inner container with stronger blur */}
              <div className="bg-black/40 backdrop-blur-3xl rounded-[2.4rem] p-10 md:p-16 flex flex-col items-center text-center relative z-10">
                {isSuccess ? (
                  <div className="animate-in zoom-in duration-700">
                    <div className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                      <CheckCircle className="w-14 h-14 text-green-500" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display-twilight font-bold text-white uppercase tracking-[0.15em] mb-6">VERIFICATION COMPLETE</h2>
                    <p className="text-white/70 max-w-md mx-auto mb-10 text-lg leading-relaxed">
                      Your identity has been confirmed. You now have unrestricted access to the Highway 420 collection.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/products'}
                      className="px-16 py-5 bg-white text-black font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-green-500 hover:text-white transition-all duration-500 shadow-2xl active:scale-95 group"
                    >
                      <span className="flex items-center gap-3">
                        Enter Showroom
                        <Loader2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-white/5 rounded-3xl rotate-45 flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-xl group-hover:bg-dope-orange/10 transition-colors duration-500">
                      <Shield className="w-12 h-12 text-white -rotate-45" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display-twilight font-bold text-white uppercase tracking-[0.15em] mb-6 pr-4">IDENTITY VERIFICATION REQUIRED</h2>
                    {serviceError ? (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 max-w-lg animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center gap-3 text-red-500 mb-2 font-bold">
                          <AlertTriangle className="w-5 h-5" />
                          <span>Service Initialization Error</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed text-left">
                          The age verification service is currently unreachable. This may be due to an ad-blocker or high network traffic. Please disable any content blockers and refresh the page to try again.
                        </p>
                      </div>
                    ) : (
                      <p className="text-white/60 max-w-xl mx-auto mb-12 text-lg font-medium leading-relaxed">
                        To ensure responsible access, please verify your age using our secure protocol. 
                        Verifications are encrypted and typically take less than 60 seconds.
                      </p>
                    )}
                    <button 
                      onClick={handleStartVerification}
                      disabled={isVerifying || isServiceLoading}
                      className="group relative px-16 py-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black uppercase tracking-[0.35em] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,107,0,0.5)] active:scale-95 disabled:opacity-40 disabled:scale-100"
                    >
                      {/* Animated Glow Overlay */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                      
                      <span className="relative z-10 flex items-center gap-4 text-lg">
                        {isVerifying || isServiceLoading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            {isServiceLoading ? 'Initializing...' : 'Processing...'}
                          </>
                        ) : (
                          'Verify Age'
                        )}
                      </span>
                    </button>
                    <p className="mt-8 text-white/30 text-sm uppercase tracking-widest font-bold">
                      Powered by AgeChecker.net Security
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Grid for Info Sections */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Important Notice */}
              <div className="md:col-span-2 glassmorphic-strong rounded-[2rem] p-8 border border-red-500/20 bg-red-500/5 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="p-5 bg-red-500/20 rounded-2xl border border-red-500/30 shadow-lg">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-display-chalets text-white uppercase tracking-[0.15em] mb-2 font-bold">AGE REQUIREMENT ENFORCEMENT</h3>
                    <p className="text-white/70 text-lg leading-relaxed font-medium">
                      Per federal and state regulations, you must be <span className="text-red-500 font-black underline decoration-red-500/30 underline-offset-4">21+ years of age</span> to access this platform. 
                      Strict compliance is required for all transactions.
                    </p>
                  </div>
                </div>
                {/* Background red glow */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/10 blur-[100px] pointer-events-none"></div>
              </div>

              {/* Feature Cards */}
              <div className="glassmorphic-dark rounded-[2rem] p-10 border border-white/10 hover:border-orange-500/30 transition-all duration-500 group">
                <div className="flex items-center mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl mr-6 border border-white/10 group-hover:bg-orange-500/10 transition-colors">
                    <Shield className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-display-chalets text-white uppercase tracking-[0.15em] font-bold text-left">DATA SOVEREIGNTY</h3>
                </div>
                <p className="text-white/50 text-lg font-medium leading-relaxed mb-6">
                  Your privacy is paramount. Verification data is strictly encrypted and used purely for legal compliance. We never store copies of your identity documents.
                </p>
                <div className="h-1 w-12 bg-orange-500/30 rounded-full group-hover:w-full transition-all duration-700"></div>
              </div>

              <div className="glassmorphic-dark rounded-[2rem] p-10 border border-white/10 hover:border-green-500/30 transition-all duration-500 group">
                <div className="flex items-center mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl mr-6 border border-white/10 group-hover:bg-green-500/10 transition-colors">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-display-chalets text-white uppercase tracking-[0.15em] font-bold text-left">SECURE PROCESS</h3>
                </div>
                <p className="text-white/50 text-lg font-medium leading-relaxed mb-6">
                  Our system utilizes industry standard matching algorithms to verify your age instantly. For most users, no document upload is required.
                </p>
                <div className="h-1 w-12 bg-green-500/30 rounded-full group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>

            {/* Privacy Legal Glass Link */}
            <div className="glassmorphic-strong rounded-[2rem] p-8 border border-white/5 text-center">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link 
                  href="/contact" 
                  className="px-10 py-4 glassmorphic-dark border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all duration-500 w-full sm:w-auto"
                >
                  Contact Compliance
                </Link>
                <Link 
                  href="/privacy" 
                  className="px-10 py-4 text-white/40 font-bold uppercase tracking-widest hover:text-white transition-colors w-full sm:w-auto"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
