"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Calendar, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AgeVerificationPage() {
  const { user, updateUserMetadata, loading: authLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if already verified in this session or metadata
    if (user?.user_metadata?.age_verified) {
      setIsSuccess(true);
    }

    const handleVerified = async (event: any) => {
      console.log('[AgeChecker] Verification successful event:', event);
      
      // Persist locally for session consistency
      localStorage.setItem('hw420_age_verified', 'true');
      localStorage.setItem('hw420_age_verified_formal', 'true');
      
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
    const ac = (window as any).AgeChecker;
    if (ac && typeof ac.verify === 'function') {
      setIsVerifying(true);
      
      // Configure for current user if available
      if (user) {
        (window as any).ageCheckerConfig = {
          customerEmail: user.email,
          customerFirstName: user.user_metadata?.firstName || '',
          customerLastName: user.user_metadata?.lastName || '',
        };
      }

      ac.verify();
    } else {
      toast.error('Age verification service is still loading. Please try again in a moment.');
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
        {/* Logo Background Watermark */}
        <div
          className="absolute inset-0 opacity-10 z-0 pointer-events-none"
          style={{
            backgroundImage: `url("https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png")`,
            backgroundSize: '40%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh'
          }}
        ></div>

        <div className="relative z-10">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 text-white py-16 backdrop-blur-sm shadow-2xl">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-4">
                AGE <span className="text-dope-orange-500">VERIFICATION</span>
              </h1>
              <div className="w-32 h-1.5 bg-dope-orange-600 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium tracking-wide">
                Ensuring compliance and responsible access to our products.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-12">
            
            {/* Call to Action Section - HIGHLIGHTED */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 md:p-12 mb-12 shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col items-center text-center">
              {isSuccess ? (
                <div className="animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase italic mb-4">You are Verified</h2>
                  <p className="text-zinc-400 max-w-md mx-auto mb-8 font-medium">
                    Thank you for verifying your age. You now have full access to shop across Highway 420.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/products'}
                    className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-dope-orange-500 hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-dope-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-dope-orange-500/20">
                    <Shield className="w-10 h-10 text-dope-orange-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase italic mb-4">Ready to Verify?</h2>
                  <p className="text-zinc-400 max-w-lg mx-auto mb-10 font-medium">
                    Our quick and secure process ensures you meet the legal age requirements. Most verifications take less than a minute.
                  </p>
                  <button 
                    onClick={handleStartVerification}
                    disabled={isVerifying}
                    className="group relative px-12 py-5 bg-dope-orange-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-dope-orange-600 hover:shadow-[0_0_50px_rgba(255,107,0,0.4)] active:scale-95 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Verify My Age Now'
                      )}
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Age Requirement Notice */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-[1.5rem] p-8 mb-12 flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 bg-red-500/20 rounded-full border border-red-500/30">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic mb-2">Important Notice</h2>
                <p className="text-zinc-400 font-medium leading-relaxed">
                  You must be <span className="text-red-500 font-bold">21 years of age or older</span> to access this website and purchase our products. 
                  This requirement is strictly enforced in compliance with federal and state laws.
                </p>
              </div>
            </div>

            {/* Why Age Verification */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-[1.5rem] p-8 hover:border-dope-orange-500/30 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-dope-orange-500/10 rounded-xl mr-4">
                    <Shield className="w-8 h-8 text-dope-orange-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase italic">Why We Verify</h2>
                </div>
                
                <ul className="space-y-4 text-zinc-400 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="text-dope-orange-500 font-bold">01</span>
                    Comply with federal and state regulations
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dope-orange-500 font-bold">02</span>
                    Prevent underage access to restricted products
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dope-orange-500 font-bold">03</span>
                    Maintain strict compliance for licensing
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dope-orange-500 font-bold">04</span>
                    Ensure responsible retail practices
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-[1.5rem] p-8 hover:border-dope-orange-500/30 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-dope-orange-500/10 rounded-xl mr-4">
                    <Calendar className="w-8 h-8 text-dope-orange-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase italic">The Process</h2>
                </div>
                
                <ul className="space-y-4 text-zinc-400 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="text-dope-orange-500 font-bold">01</span>
                    Click "Verify My Age Now" above
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dope-orange-500 font-bold">02</span>
                    The AgeChecker secure popup will open
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dope-orange-500 font-bold">03</span>
                    Verification is typically instant and automatic
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dope-orange-500 font-bold">04</span>
                    Once confirmed, your account is updated forever
                  </li>
                </ul>
              </div>

            </div>

            {/* Privacy & Legal */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-[1.5rem] p-8 mb-12">
              <h2 className="text-2xl font-black text-white uppercase italic mb-8">Privacy & Legal Compliance</h2>
              
              <div className="grid md:grid-cols-2 gap-12 text-zinc-400 font-medium">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Data Protection</h3>
                  <p className="mb-4 leading-relaxed">
                    Your security is our priority. Age verification data is encrypted, used solely for compliance, and never shared with third parties for marketing.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Legal Standards</h3>
                  <p className="leading-relaxed">
                    Our process adheres to all current industry standards for age-restricted retail, ensuring a safe and compliant environment for our adult community.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-colors text-center">
                Contact Compliance
              </Link>
              <Link href="/privacy" className="px-8 py-3 border border-zinc-800 text-zinc-500 font-bold rounded-lg hover:text-white hover:border-white transition-colors text-center">
                Privacy Policy
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
