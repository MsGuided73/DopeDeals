'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getSessionId } from '../lib/cart-utils';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AgeVerification() {
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [zipcode, setZipcode] = useState('');
  const [showZipcodeStep, setShowZipcodeStep] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminBypass, setShowAdminBypass] = useState(false);

  useEffect(() => {
    checkAdminStatus();

    // Check if user has already been verified in this session - only on client side
    if (typeof window !== 'undefined') {
      const verified = localStorage.getItem('dope-city-age-verified');
      const lastVerification = localStorage.getItem('dope-city-last-verification');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

      // Check for force show parameter (for testing)
      const urlParams = new URLSearchParams(window.location.search);
      const forceShow = urlParams.get('force-age-verification') === 'true';

      console.log('[AgeVerification] Debug info:', {
        verified,
        lastVerification,
        oneDayAgo,
        currentTime: Date.now(),
        forceShow,
        shouldShow: !verified || (lastVerification && parseInt(lastVerification) < oneDayAgo) || forceShow
      });

      // Show modal if not verified OR if last verification was more than 24 hours ago OR if force show is requested
      if (!verified || (lastVerification && parseInt(lastVerification) < oneDayAgo) || forceShow) {
        console.log('[AgeVerification] Showing modal - not verified, expired, or force show requested');
        setShowModal(true);
      } else {
        console.log('[AgeVerification] User already verified');
        setIsVerified(true);
      }
    } else {
      // Fallback for server-side rendering - always show modal
      console.log('[AgeVerification] Server-side rendering - showing modal');
      setShowModal(true);
    }
  }, []);

  const checkAdminStatus = async () => {
    try {
      // Check if user is authenticated and is an admin
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
          setShowAdminBypass(true);
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const handleAdminBypass = () => {
    localStorage.setItem('dope-city-age-verified', 'true');
    localStorage.setItem('dope-city-zipcode', 'ADMIN_BYPASS');
    localStorage.setItem('dope-city-last-verification', Date.now().toString());
    setIsVerified(true);
    setShowModal(false);
  };

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      // Move to zipcode step instead of immediately verifying
      setShowZipcodeStep(true);
    } else {
      // Redirect to a different site or show message
      window.location.href = 'https://www.google.com';
    }
  };

  const handleZipcodeSubmit = async () => {
    if (zipcode.trim().length >= 5) {
      localStorage.setItem('dope-city-age-verified', 'true');
      localStorage.setItem('dope-city-zipcode', zipcode);
      localStorage.setItem('dope-city-last-verification', Date.now().toString());

      // Record age verification in audit table
      try {
        const sessionId = getSessionId();
        await supabase
          .from('age_verification_audit')
          .insert({
            session_id: sessionId,
            verification_status: 'approved',
            verification_method: 'zipcode',
            zipcode: zipcode,
            user_agent: navigator.userAgent,
            ip_address: null,
            // cart_id will be linked when cart is created
          });

        // Try to link age verification to existing cart
        try {
          const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
              'x-session-id': sessionId,
            },
          });

          if (response.ok) {
            const cartData = await response.json();
            if (cartData.success && cartData.cart) {
              // Link age verification to cart
              await supabase.rpc('link_age_verification_to_cart', {
                p_session_id: sessionId,
                p_user_id: null,
                p_age_verified: true,
                p_verification_level: 'strict',
                p_minimum_age: 21
              });
            }
          }
        } catch (cartError) {
          console.error('Error linking age verification to cart:', cartError);
          // Don't fail verification if cart linking fails
        }
      } catch (error) {
        console.error('Error recording age verification:', error);
        // Don't fail the verification process if audit logging fails
      }

      setIsVerified(true);
      setShowModal(false);
    }
  };

  // Force show modal if verification is required but not completed
  const shouldShowModal = showModal && !isVerified;

  if (!shouldShowModal) {
    return null;
  }

  console.log('[AgeVerification] Rendering modal - blocking content until verification complete');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
        style={{ backdropFilter: 'blur(12px)' }}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 bg-black text-white p-12 rounded-2xl shadow-2xl max-w-2xl mx-4 border border-dope-orange/30">
        {/* DOPE CITY Logo - PERFECT STYLING */}
        <div className="text-center mb-8">
          <h1 className="dope-city-title text-7xl mb-4" style={{ lineHeight: '1.1' }}>
            DOPE CITY
          </h1>
          <div className="w-20 h-1 bg-dope-orange mx-auto"></div>
        </div>

        {!showZipcodeStep ? (
          <>
            {/* Age Verification Step */}

            {/* Edgy Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-dope-orange">
                WELCOME TO DOPE CITY
              </h2>
              <p className="text-lg mb-4 leading-relaxed">
                This is not your average smoke shop. We're dealing with the
                <span className="text-dope-orange font-bold"> DOPEST </span>
                products in the game.
              </p>
              <p className="text-gray-300 mb-6">
                You gotta be <span className="text-white font-bold">21+</span> to enter this realm of premium vibes.
              </p>
              <p className="text-sm text-gray-400 italic">
                "Age ain't nothing but a number... but the law is the law." 🔥
              </p>
            </div>

            {/* Age Verification Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => handleVerify(true)}
                className="w-full bg-dope-orange hover:bg-orange-600 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg uppercase tracking-wide"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                HELL YEAH, I'M 21+
              </button>

              <button
                onClick={() => handleVerify(false)}
                className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg uppercase tracking-wide"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                NAH, I'M TOO YOUNG
              </button>

              {/* Admin Bypass Button */}
              {showAdminBypass && (
                <button
                  onClick={handleAdminBypass}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm uppercase tracking-wide border-2 border-purple-500"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  🔑 ADMIN BYPASS
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Zipcode Step */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-dope-orange">
                ONE MORE THING...
              </h2>
              <p className="text-lg mb-4 leading-relaxed">
                We need your <span className="text-dope-orange font-bold">ZIP CODE</span> to check
                product availability in your area.
              </p>
              <p className="text-gray-300 mb-6">
                Some products have <span className="text-white font-bold">location restrictions</span> -
                we'll make sure you only see what's available to you.
              </p>
            </div>

            {/* Zipcode Input */}
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Enter your ZIP code"
                  className="w-full bg-gray-800 border-2 border-gray-600 focus:border-dope-orange text-white py-4 px-6 rounded-xl text-lg text-center tracking-wider"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  maxLength={5}
                />
              </div>

              <button
                onClick={handleZipcodeSubmit}
                disabled={zipcode.length < 5}
                className="w-full bg-dope-orange hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg uppercase tracking-wide"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {zipcode.length < 5 ? 'ENTER ZIP CODE' : 'ENTER THE DOPE ZONE'}
              </button>

              {/* Admin Bypass Button in ZIP Code Step */}
              {showAdminBypass && (
                <button
                  onClick={handleAdminBypass}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm uppercase tracking-wide border-2 border-purple-500"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  🔑 ADMIN BYPASS - SKIP ZIP CODE
                </button>
              )}

              <button
                onClick={() => setShowZipcodeStep(false)}
                className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 text-sm uppercase tracking-wide"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                ← BACK
              </button>
            </div>
          </>
        )}

        {/* Legal Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By entering, you confirm you're 21+ and agree to our terms. 
            We're all about that <span className="text-dope-orange">LEGAL</span> life.
            <br />
            <span className="text-gray-600">Keep it 💯, keep it legal.</span>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-dope-orange rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-dope-orange rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
