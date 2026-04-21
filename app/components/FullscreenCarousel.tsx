'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// ─── Carousel slides ──────────────────────────────────────────────────────────
const SLIDES: { id: string; src: string; alt: string; href: string; objectPosition?: string }[] = [
  {
    id: 'slide-1',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/VIPMembership/VIP%20Membership%20-%20V3.png',
    alt: 'Highway 420 — Free VIP Membership',
    href: '/rewards',
    objectPosition: 'left top',
  },
  {
    id: 'slide-2',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Products/CG_ProdCard-Dab%20Rig.png',
    alt: 'Highway 420 — Premium Dab Rig Experience',
    href: '/dabsntools',
    objectPosition: 'left top',
  },
  {
    id: 'slide-3',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Bundles/Bundles-V1.png',
    alt: 'Highway 420 — Bundles',
    href: '/bundles',
    objectPosition: 'center center',
  },
  {
    id: 'slide-4',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/RoadTrips/Road-Trips-V2.png',
    alt: 'Highway 420 — Road Trips',
    href: '/road-trips',
    objectPosition: 'center center',
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
         * Mobile: 4:3 so tall/portrait images show more content.
         * Desktop (md+): 16:9 widescreen.
         * max-height clamps to remaining viewport below the masthead.
         */
        .carousel-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #0D0D0B;
          line-height: 0;
          aspect-ratio: 4 / 3;
          /* mobile masthead ≈ 70px */
          max-height: calc(100vh  - 70px);
          max-height: calc(100svh - 70px);
        }

        @media (min-width: 768px) {
          .carousel-wrap {
            aspect-ratio: 16 / 9;
          }
        }

        @media (min-width: 1024px) {
          .carousel-wrap {
            /* desktop masthead (2 rows + icons) ≈ 160px */
            max-height: calc(100vh  - 160px);
            max-height: calc(100svh - 160px);
          }
        }

        .carousel-slide-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
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

        /* Scroll CTA arrow */
        .carousel-scroll-cta {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 8px 12px;
          animation: hw420-bounce 2.2s ease-in-out infinite;
        }
        .carousel-scroll-cta:hover .cta-ring {
          border-color: #C5A059;
          background: rgba(197,160,89,0.15);
        }
        .cta-ring {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.45);
          background: rgba(0,0,0,0.28);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.25s, background 0.25s;
        }
        .cta-label {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          font-family: system-ui, sans-serif;
          white-space: nowrap;
        }
        @keyframes hw420-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0);   opacity: 0.9; }
          50%       { transform: translateX(-50%) translateY(7px); opacity: 1;   }
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
            {/* eslint-disable-next-line */}
            <img
              className="carousel-slide-img"
              src={slide.src}
              alt={slide.alt}
              style={{ objectPosition: slide.objectPosition ?? 'center center' }}
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

        {/* ── Scroll CTA arrow ── */}
        <button
          className="carousel-scroll-cta"
          aria-label="Scroll to collections"
          onClick={() => {
            document.getElementById('collections-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <div className="cta-ring">
            <ChevronDown style={{ width: 18, height: 18, strokeWidth: 2, color: '#C5A059' }} />
          </div>
          <span className="cta-label">Shop now</span>
        </button>

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
