'use client';

import { useState, useEffect } from 'react';

const messages = [
  {
    id: 1,
    text: "🌟 Free VIP Membership — Extra Discounts • Guaranteed Lowest Prices • Exclusive Offers • Free Gifts",
    cta: "Join Now →",
    href: "/rewards"
  },
  {
    id: 2,
    text: "🎉 Thank you to our amazing customers! Your support keeps DOPE CITY growing strong 💪",
    cta: "Shop Now →",
    href: "/products"
  },
  {
    id: 3,
    text: "🍂 October Special — 15% Off All Glass Pipes • Use code OCTOBER15 at checkout",
    cta: "Shop Glass →",
    href: "/pipes"
  }
];

export default function ScrollingBanner() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentMessage = messages[currentMessageIndex];

  return (
    <div className="relative bg-gradient-to-r from-dope-orange-600 via-dope-orange-500 to-dope-orange-600 text-white overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>

      {/* Subtle star-like sparkles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 60}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Main message */}
          <div className="flex-1 text-center">
            <p
              className="text-sm md:text-base font-bold tracking-wide"
              style={{
                textShadow: '0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2)'
              }}
            >
              {currentMessage.text}
            </p>
          </div>

          {/* CTA Button */}
          <div className="ml-4">
            <a
              href={currentMessage.href}
              className="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 hover:shadow-lg border border-white/30"
              style={{
                textShadow: '0 0 5px rgba(255,255,255,0.5)'
              }}
            >
              {currentMessage.cta}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
}
