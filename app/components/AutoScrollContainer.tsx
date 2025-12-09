"use client";

import { useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AutoScrollContainerProps {
  children: ReactNode;
  className?: string;
  autoScrollInterval?: number; // in milliseconds
  scrollAmount?: number; // pixels to scroll per interval
  pauseOnHover?: boolean;
  showControls?: boolean;
}

export default function AutoScrollContainer({
  children,
  className = '',
  autoScrollInterval = 50, // Faster for smooth continuous scroll
  scrollAmount = 2, // Smaller increments for smooth scrolling
  pauseOnHover = false, // Changed default to false - don't pause on hover
  showControls = false, // Hide controls for continuous loop
}: AutoScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (!containerRef.current || isPaused) return;

      const container = containerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      // If we've scrolled past the first set of items, reset to beginning for seamless loop
      if (scrollLeft >= scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }, autoScrollInterval);
  }, [isPaused, autoScrollInterval, scrollAmount]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start continuous scroll only on desktop
    if (window.innerWidth >= 1024) {
      startAutoScroll();
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      stopAutoScroll();
    };
  }, [startAutoScroll, stopAutoScroll]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    // Always restart scrolling when mouse leaves, regardless of pauseOnHover setting
    setIsPaused(false);
  };

  const handleCardClick = () => {
    // Pause scrolling when a card is clicked
    setIsPaused(true);
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -384, // Scroll by one card width + gap (w-96 = 384px)
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 384, // Scroll by one card width + gap (w-96 = 384px)
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Scrollable Container with duplicated content for seamless loop */}
      <div
        ref={containerRef}
        className="flex overflow-x-hidden gap-6 pb-4 px-12"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        {/* Original content */}
        {children}
        {/* Duplicated content for seamless loop */}
        {children}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
