"use client";

import { useEffect, useRef, useState, ReactNode, useCallback } from 'react';

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
  pauseOnHover = true,
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
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Scrollable Container with duplicated content for seamless loop */}
      <div
        ref={containerRef}
        className="flex overflow-x-hidden gap-6 pb-4 px-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
