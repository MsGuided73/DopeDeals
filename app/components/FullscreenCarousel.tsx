'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Carousel slides ──────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'slide-1',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/FreeMembership-Carousel1.png',
    alt: 'Highway 420 — Free VIP Membership',
    href: '/rewards',
  },
  {
    id: 'slide-2',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/16x9-FreeMembershipPic2.jpeg',
    alt: 'Highway 420 — Free VIP Membership',
    href: '/rewards',
  },
  {
    id: 'slide-3',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Image%20Only%20Carousel-skinny.png',
    alt: 'Highway 420 — Free VIP Membership',
    href: '/rewards',
  },
  {
    id: 'slide-4',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Premium%20dab%20rig%20experience%20showcased.png',
    alt: 'Highway 420 — Premium Dab Rig Experience',
    href: '/bongs',
  },
  {
    id: 'slide-5',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Image2-ProductAd-skinny.png',
    alt: 'Highway 420 — Featured Products',
    href: '/products',
  },
];

const SLIDE_DURATION = 6000;

export default function FullscreenCarousel() {
  const [current,  setCurrent]  = useState(0);
  const [paused,   setPaused]   = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [progress, setProgress] = useState(0);
  const total = SLIDES.length;

  useEffect(() => { setMounted(true); }, []);

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total);
    setPaused(true);
    setTimeout(() => setPaused(false), 10_000);
  }, [total]);

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % total), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused, total]);

  // Progress bar
  useEffect(() => {
    if (paused || total <= 1) return;
    setProgress(0);
    const step  = 50;
    const ticks = SLIDE_DURATION / step;
    let count   = 0;
    const id = setInterval(() => {
      count++;
      setProgress(Math.min((count / ticks) * 100, 100));
    }, step);
    return () => clearInterval(id);
  }, [current, paused, total]);

  return (
    <>
      <style>{`
        /*
         * 16:9 carousel — matches image aspect ratio exactly so nothing is cropped.
         * max-height clamps to the remaining viewport below the masthead.
         */
        .carousel-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #0D0D0B;
          line-height: 0;
          aspect-ratio: 16 / 9;
          max-height: calc(100vh  - 70px);
          max-height: calc(100svh - 70px);
        }

        @media (min-width: 1024px) {
          .carousel-wrap {
            max-height: calc(100vh  - 140px);
            max-height: calc(100svh - 140px);
          }
        }

        .carousel-slide-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* Slide fade */
        .carousel-slide {
          position: absolute;
          inset: 0;
          transition: opacity 0.9s ease-in-out;
        }

        /* Arrows */
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.14);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.2s;
          cursor: pointer;
          touch-action: manipulation;
        }
        .carousel-arrow:hover { background: rgba(0,0,0,0.55); }
        .carousel-arrow:active { transform: translateY(-50%) scale(0.93); }
        .carousel-arrow-left  { left:  16px; }
        .carousel-arrow-right { right: 16px; }

        @media (min-width: 768px) {
          .carousel-arrow { width: 44px; height: 44px; }
          .carousel-arrow-left  { left: 28px; }
          .carousel-arrow-right { right: 28px; }
        }

        /* Dots */
        .carousel-dots {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .carousel-dot {
          height: 9px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: width 0.3s, background 0.3s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        /* Progress bar */
        .carousel-progress-track {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: rgba(0,0,0,0.22);
          z-index: 20;
        }
        .carousel-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C5A059 0%, #8B6914 100%);
        }
      `}</style>

      {/* ── Carousel wrapper ─────────────────────────────────────────────── */}
      <section className="carousel-wrap" aria-label="Featured carousel">


        {/* ── Slides ── */}
        {SLIDES.map((slide, idx) => (
          <a
            key={slide.id}
            href={slide.href}
            className="carousel-slide"
            style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
            aria-hidden={idx !== current}
            tabIndex={idx !== current ? -1 : 0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="carousel-slide-img"
              src={slide.src}
              alt={slide.alt}
            />
          </a>
        ))}

        {/* ── Arrows (only when 2+ slides) ── */}
        {total > 1 && (
          <>
            <button className="carousel-arrow carousel-arrow-left" onClick={prev} aria-label="Previous slide">
              <ChevronLeft style={{ width: 18, height: 18, strokeWidth: 2.5 }} />
            </button>
            <button className="carousel-arrow carousel-arrow-right" onClick={next} aria-label="Next slide">
              <ChevronRight style={{ width: 18, height: 18, strokeWidth: 2.5 }} />
            </button>
          </>
        )}

        {/* ── Dots (only when 2+ slides) ── */}
        {total > 1 && (
          <div className="carousel-dots">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                className="carousel-dot"
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === current ? '26px' : '9px',
                  background: idx === current
                    ? 'linear-gradient(90deg,#C5A059,#8B6914)'
                    : 'rgba(255,255,255,0.42)',
                }}
              />
            ))}
          </div>
        )}

        {/* ── Gold progress bar ── */}
        {total > 1 && (
          <div className="carousel-progress-track">
            <div className="carousel-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}
      </section>
    </>
  );
}
