"use client";

import { useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type ProductViewMode = 'auto' | 'manual' | 'grid';

interface AutoScrollContainerProps {
  children: ReactNode;
  className?: string;
  autoScrollInterval?: number; // in milliseconds
  scrollAmount?: number;       // pixels to scroll per interval (auto mode)
  scrollByCard?: number;       // pixels to scroll per arrow click
  pauseOnHover?: boolean;
  // View mode controls how the children are laid out and scrolled.
  //   'auto'   — horizontal scroller with continuous auto-scroll (legacy default).
  //              Children are duplicated to give a seamless loop.
  //   'manual' — same horizontal scroller and arrows, but no auto-advance.
  //              Children are not duplicated; user drives the scroll.
  //   'grid'   — children render in a responsive CSS grid; no scrolling.
  mode?: ProductViewMode;
}

export default function AutoScrollContainer({
  children,
  className = '',
  autoScrollInterval = 50,
  scrollAmount = 2,
  scrollByCard = 384, // matches existing w-96 card width
  pauseOnHover = false,
  mode = 'auto',
}: AutoScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (!containerRef.current || isPaused) return;
      const container = containerRef.current;
      const { scrollLeft, scrollWidth } = container;
      // Reset when half-scrolled (children are duplicated) for seamless loop.
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

  // Auto-scroll only fires in 'auto' mode and only on lg+ viewports.
  useEffect(() => {
    if (mode !== 'auto') {
      stopAutoScroll();
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    if (window.innerWidth >= 1024) startAutoScroll();
    const handleResize = () => {
      if (window.innerWidth >= 1024) startAutoScroll();
      else stopAutoScroll();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      stopAutoScroll();
    };
  }, [mode, startAutoScroll, stopAutoScroll]);

  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };
  const handleMouseLeave = () => setIsPaused(false);
  const handleCardClick = () => setIsPaused(true);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -scrollByCard, behavior: 'smooth' });
  };
  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: scrollByCard, behavior: 'smooth' });
  };

  // Grid mode: no scroller, no arrows — uses auto-fit + minmax so columns
  // size to the actual card width (cards have inline width: 260-290px).
  // justify-items-center keeps the cards visually balanced inside their cells.
  if (mode === 'grid') {
    return (
      <div
        className={`grid gap-4 px-12 justify-items-center ${className}`}
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
      >
        {children}
      </div>
    );
  }

  // Auto / manual: horizontal scroller. Manual mode allows native horizontal
  // scrolling so the user can swipe/drag too; auto hides overflow.
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      <div
        ref={containerRef}
        className={`flex gap-6 pb-4 px-12 ${mode === 'auto' ? 'overflow-x-hidden' : 'overflow-x-auto scroll-smooth snap-x snap-mandatory'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
        {/* Duplicate only in auto mode for the seamless loop trick */}
        {mode === 'auto' && children}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
