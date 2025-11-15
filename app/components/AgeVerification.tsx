'use client';

import { useState, useEffect } from 'react';

export default function AgeVerification() {
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if user has already been verified in this session - only on client side
    if (typeof window !== 'undefined') {
      const verified = localStorage.getItem('dope-city-age-verified');
      const lastVerification = localStorage.getItem('dope-city-last-verification');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

      // Check for force show parameter (for testing)
      const urlParams = new URLSearchParams(window.location.search);
      const forceShow = urlParams.get('force-age-verification') === 'true';

      // Show modal if not verified OR if last verification was more than 24 hours ago OR if force show is requested
      if (!verified || (lastVerification && parseInt(lastVerification) < oneDayAgo) || forceShow) {
        setShowModal(true);
      } else {
        setIsVerified(true);
      }
    } else {
      // Fallback for server-side rendering - always show modal
      setShowModal(true);
    }
  }, []);

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      // Immediately verify without zipcode step
      localStorage.setItem('dope-city-age-verified', 'true');
      localStorage.setItem('dope-city-last-verification', Date.now().toString());
      setIsVerified(true);
      setShowModal(false);
    } else {
      // Redirect to a different site or show message
      window.location.href = 'https://www.google.com';
    }
  };

  // Don't show modal if already verified
  if (!showModal || isVerified) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div
        className="absolute inset-0 bg-white/95 backdrop-blur-md"
        style={{ backdropFilter: 'blur(8px)' }}
      />

      {/* Modal Content */}
      <div className="relative z-10 bg-white text-black p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl max-w-lg mx-4 border border-gray-200">
        {/* HIGHWAY 420 Logo */}
        <div className="text-center mb-8">
          <img
            src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
            alt="HIGHWAY 420"
            className="h-16 sm:h-20 mx-auto mb-6 object-contain"
          />
          <div className="w-12 h-0.5 bg-green-600 mx-auto"></div>
        </div>

        {/* Age Verification Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Age Verification Required
          </h2>

          <p className="text-gray-700 mb-6 text-base leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            You must be <span className="font-semibold text-green-600">21 years or older</span> to access this website.
          </p>

          <p className="text-gray-600 mb-8 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Are you 21 years of age or older?
          </p>

          {/* Age Verification Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleVerify(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg text-base"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Yes, I am 21 or older
            </button>

            <button
              onClick={() => handleVerify(false)}
              className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-base"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              No, I am under 21
            </button>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              By entering this website, you certify that you are 21 years of age or older and agree to our terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
