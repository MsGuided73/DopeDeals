"use client";
import { useEffect, useState } from "react";
import GlobalMasthead from '../../components/GlobalMasthead';
import AgeVerification from '../../components/AgeVerification';

export default function AboutPage() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  // Check age verification status
  useEffect(() => {
    const verified = localStorage.getItem('dope-city-age-verified');
    setIsAgeVerified(!!verified);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Global Masthead */}
      <GlobalMasthead />

      {/* Main Content - Blurred when age verification is showing */}
      <div className={`${!isAgeVerified ? 'blur-lg pointer-events-none' : ''} transition-all duration-300`}>
        
        {/* Hero Section with Background */}
        <div className="relative w-full h-screen bg-cover bg-center" style={{
          backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/city-skyline-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          
          {/* Content Container */}
          <div className="relative z-10 flex items-center justify-center h-full px-6">
            <div className="max-w-6xl mx-auto text-center text-white">
              
              {/* Main Title */}
              <h1 className="font-chalets tracking-wider leading-none mb-12" style={{
                fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.02em',
                fontSize: 'clamp(3rem, 12vw, 8rem)',
                lineHeight: '0.9',
                textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.7)'
              }}>
                THE DOPE CITY DIFFERENCE
              </h1>

              {/* Subtitle */}
              <p className="text-2xl md:text-3xl font-medium mb-8 max-w-4xl mx-auto" style={{
                fontFamily: "'Avenir Next', 'Inter', system-ui, sans-serif",
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                Smoking supplies cost too much....so we started Dope City.
              </p>

              {/* Main Description */}
              <p className="text-xl md:text-2xl font-medium mb-12 max-w-5xl mx-auto leading-relaxed" style={{
                fontFamily: "'Avenir Next', 'Inter', system-ui, sans-serif",
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                We've cut out layers of middleman mark-ups to bring people the dopest products at the best prices.
              </p>

              {/* VIP Club Description */}
              <p className="text-xl md:text-2xl font-medium mb-16 max-w-5xl mx-auto leading-relaxed" style={{
                fontFamily: "'Avenir Next', 'Inter', system-ui, sans-serif",
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
              }}>
                Plus, our Dope City VIP Club Members get special offers, freebies, invites and other perks you can't find anywhere else:
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                
                {/* Column 1 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Discount Prices
                    </span>
                  </div>
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Exclusive Offers
                    </span>
                  </div>
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Free Gifts
                    </span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Early Access to Drops
                    </span>
                  </div>
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Free Product Testers
                    </span>
                  </div>
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Private Sales
                    </span>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Invites to Special Events
                    </span>
                  </div>
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Bonus Rewards Program
                    </span>
                  </div>
                  <div className="flex items-center justify-start text-left">
                    <span className="text-dope-orange text-2xl mr-4 font-bold">•</span>
                    <span className="text-xl font-semibold" style={{
                      fontFamily: "'Avenir Next Demi Bold', 'Inter', system-ui, sans-serif",
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)'
                    }}>
                      Discreet Packing
                    </span>
                  </div>
                </div>

              </div>

              {/* CTA Button */}
              <div className="mt-16">
                <a
                  href="/rewards"
                  className="inline-block bg-dope-orange hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-lg uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-xl"
                  style={{
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  JOIN VIP CLUB
                </a>
              </div>

              {/* Font Attribution */}
              <div className="mt-20 text-sm opacity-60" style={{
                fontFamily: "'Avenir Next', 'Inter', system-ui, sans-serif",
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
              }}>
                Avenir Next for text, Avenir Next Demi Bold for Bullet Points
              </div>

            </div>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="bg-white dark:bg-gray-900 py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="font-chalets tracking-wider text-4xl md:text-6xl mb-8 text-gray-900 dark:text-white" style={{
              fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
              fontWeight: 'normal',
              letterSpacing: '0.02em'
            }}>
              WHY CHOOSE DOPE CITY?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
              
              {/* Quality */}
              <div className="text-center">
                <div className="w-20 h-20 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Premium Quality</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  We source only the highest quality products from trusted manufacturers and artisans.
                </p>
              </div>

              {/* Pricing */}
              <div className="text-center">
                <div className="w-20 h-20 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Best Prices</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Direct-to-consumer pricing eliminates middleman markups for unbeatable value.
                </p>
              </div>

              {/* Service */}
              <div className="text-center">
                <div className="w-20 h-20 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Fast Shipping</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Quick processing and discreet packaging get your order to you fast and secure.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
