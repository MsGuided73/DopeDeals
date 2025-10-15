"use client";
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  background_image_url: string;
  cta_text?: string;
  cta_link?: string;
}

// Move banner messages outside component to prevent recreation
const BANNER_MESSAGES = [
  {
    id: "1",
    title: "Free VIP Membership - Join today, and get 15% off your first purchase.",
    cta_text: "JOIN NOW",
    cta_link: "/rewards"
  },
  {
    id: "2",
    title: "October 2025 Contest - DOPE CITY Roll Call - Submit a photo and short description of why you believe you live in a DOPE CITY. Prizes will be announced shortly.",
    cta_text: "ENTER NOW",
    cta_link: "/contact"
  }
];

export default function ScrollingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [animationPhase, setAnimationPhase] = useState<'typing' | 'paused' | 'deleting'>('typing');

  // Handle animation phase transitions
  useEffect(() => {
    if (animationPhase === 'paused') {
      // Wait 1 second then start deleting
      const timeout = setTimeout(() => {
        setAnimationPhase('deleting');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [animationPhase]);

  // Typing animation effect - Simplified and robust
  useEffect(() => {
    const currentMessage = BANNER_MESSAGES[currentIndex];
    const fullText = currentMessage.title;

    if (animationPhase === 'typing') {
      // Typing in effect
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Animation will transition via the other useEffect
        }
      }, 80);

      return () => clearInterval(typeInterval);
    } else if (animationPhase === 'deleting') {
      // Deleting effect
      let charIndex = fullText.length;
      const deleteInterval = setInterval(() => {
        if (charIndex >= 0) {
          setDisplayText(fullText.slice(0, charIndex));
          charIndex--;
        } else {
          clearInterval(deleteInterval);
          // Move to next message after a brief pause
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % BANNER_MESSAGES.length);
            setAnimationPhase('typing');
          }, 500);
        }
      }, 40);

      return () => clearInterval(deleteInterval);
    }
  }, [currentIndex, animationPhase]);

  const currentItem = BANNER_MESSAGES[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Orange gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-dope-orange-600 via-dope-orange-500 to-dope-orange-600"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Content */}
      <div className="relative flex items-center justify-between px-8 py-4">
        {/* Left side - Animated typing text */}
        <div className="flex-1">
          <div className="text-white font-bold text-base md:text-lg leading-relaxed min-h-[3rem] flex items-center">
            {displayText}
            <span className="w-0.5 h-6 bg-white ml-1 animate-pulse"></span>
          </div>
        </div>

        {/* Right side - CTA Button */}
        {currentItem.cta_text && currentItem.cta_link && (
          <div className="ml-6">
            <Link
              href={currentItem.cta_link}
              className="inline-block bg-dope-orange hover:bg-dope-orange-600 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-orange-300/30"
            >
              {currentItem.cta_text}
            </Link>
          </div>
        )}
      </div>

      {/* Shadow below the banner */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
}
