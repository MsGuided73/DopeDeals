'use client';

import { useState, useEffect } from 'react';

export default function AgeVerification() {
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [zipcode, setZipcode] = useState('');
  const [showZipcodeStep, setShowZipcodeStep] = useState(false);

  useEffect(() => {
    // Check if user has already been verified in this session
    const verified = localStorage.getItem('dope-city-age-verified');
    if (!verified) {
      setShowModal(true);
    } else {
      setIsVerified(true);
    }
  }, []);

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      // Move to zipcode step instead of immediately verifying
      setShowZipcodeStep(true);
    } else {
      // Redirect to a different site or show message
      window.location.href = 'https://www.google.com';
    }
  };

  const handleZipcodeSubmit = () => {
    if (zipcode.trim().length >= 5) {
      localStorage.setItem('dope-city-age-verified', 'true');
      localStorage.setItem('dope-city-zipcode', zipcode);
      setIsVerified(true);
      setShowModal(false);
    }
  };

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
                HOLD UP, PLAYER
              </h2>
              <p className="text-lg mb-4 leading-relaxed">
                This ain't your average smoke shop. We're dealing with the
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
