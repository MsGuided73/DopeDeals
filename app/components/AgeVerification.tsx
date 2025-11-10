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
        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
        style={{ backdropFilter: 'blur(12px)' }}
      />

      {/* Modal Content */}
      <div className="relative z-10 bg-black text-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl max-w-2xl mx-4 border border-green-400/30 max-h-[90vh] overflow-y-auto">
        {/* HIGHWAY 420 Logo - PREMIUM STYLING */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.1' }}>
            HIGHWAY 420
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-green-400 mx-auto"></div>
        </div>

        {/* Highway 420 Welcome Message */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-green-400" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            WELCOME TO THE HIGHWAY
          </h2>
          <p className="text-base sm:text-lg mb-3 sm:mb-4 leading-relaxed px-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            This ain't your corner store. We're the
            <span className="text-green-400 font-bold"> PREMIUM </span>
            destination for cannabis culture and craft.
          </p>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            You gotta be <span className="text-white font-bold">21+</span> to ride this highway of excellence.
          </p>
          <p className="text-xs sm:text-sm text-gray-400 italic" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            "Life's a journey. Make sure you're old enough to enjoy the ride."
          </p>
        </div>

        {/* Age Verification Buttons */}
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => handleVerify(true)}
            className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-base sm:text-lg uppercase tracking-wide"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            LET'S RIDE, I'M 21+
          </button>

          <button
            onClick={() => handleVerify(false)}
            className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 text-base sm:text-lg uppercase tracking-wide"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            NOT YET, TOO YOUNG
          </button>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center leading-relaxed px-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            By entering, you confirm you're 21+ and agree to our terms.
            We're all about that <span className="text-green-400">LEGAL</span> highway.
            <br />
            <span className="text-gray-600">Keep it 💯, keep it legal.</span>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
