'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type SlideCopy = {
  eyebrow: string;
  headline: ReactNode;
  tagline: ReactNode;
};

// ─── Carousel slides ──────────────────────────────────────────────────────────
const SLIDES: { id: string; src: string; alt: string; href: string; objectPosition?: string; objectFit?: 'cover' | 'contain'; copy?: SlideCopy }[] = [
  {
    id: 'slide-1',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/RoadTrips/BetterVibes_Carousel_Test2.png',
    alt: 'Highway 420 — Better Vibes',
    href: '/road-trips',
    objectPosition: 'center center',
  },
  {
    id: 'slide-2',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/VIPMembership/Membership2.png',
    alt: 'Highway 420 — VIP Membership',
    href: '/rewards',
    objectPosition: 'center center',
  },
  {
    id: 'slide-3',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Bundles/1.png',
    alt: 'Highway 420 — Bundles',
    href: '/bundles',
    objectPosition: 'center center',
    objectFit: 'cover',
    copy: {
      eyebrow: 'Curated for Convenience',
      headline: <>Popular<br />Set-Ups</>,
      tagline: <>Everything you need.<br />Nothing you don&rsquo;t.</>,
    },
  },
  {
    id: 'slide-4',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Bundles/RooR%20Carousel.jpeg',
    alt: 'Highway 420 — RooR Bongs',
    href: '/bongs',
    objectPosition: 'center center',
  },
  {
    id: 'slide-5',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Products/Dab-Rig/2.png',
    alt: 'Highway 420 — Dab Rigs',
    href: '/dabsntools',
    objectPosition: 'center center',
  },
  {
    id: 'slide-6',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/RoadTrips/RoadTrips.png',
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
          background: #000000;
          line-height: 0;
          aspect-ratio: 2 / 1;
          /* mobile masthead ≈ 70px */
          max-height: calc(70vh - 35px);
          max-height: calc(70svh - 35px);
          /* Establish a container so child copy can size with cqi units. */
          container-type: inline-size;
          container-name: carousel;
        }

        @media (min-width: 768px) {
          .carousel-wrap {
            height: auto;
            aspect-ratio: 16 / 5;
          }
        }

        @media (min-width: 1024px) {
          .carousel-wrap {
            /* desktop masthead (2 rows + icons) ≈ 160px */
            max-height: calc(70vh - 5px);
            max-height: calc(70svh - 5px);
          }
        }

        .carousel-slide-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @media (min-width: 1024px) {
          .carousel-slide-img {
            object-fit: contain;
          }
        }

        /* Slide copy panel — left-side text block, no background wash. */
        .carousel-copy {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 42%;
          /* Left padding matches the masthead shield logo's pl-4 (16px) so
             the headline's left edge aligns vertically with the shield. */
          padding: 6% 5% 6% 16px;
          color: #1f4d2e;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 5;
          pointer-events: none;
        }
        @media (min-width: 1024px) {
          .carousel-copy {
            /* Matches masthead lg:pl-6 (24px). */
            padding-left: 24px;
          }
        }
        .carousel-copy-eyebrow {
          font-size: clamp(7px, 1.0cqi, 28px);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: clamp(4px, 1.3cqi, 32px);
          align-self: flex-start;
          border-bottom: 2px solid currentColor;
          padding-bottom: clamp(8px, 1.0cqi, 24px);
        }
        .carousel-copy-headline {
          font-family: 'BebasNeue', 'Bebas Neue', 'Impact', sans-serif;
          /* Scales with the carousel's inline (width) size via container
             query units. Wide range — shrinks below 22px at narrow
             widths and grows past 200px on 4K hero displays. */
          font-size: clamp(18px, 6cqi, 220px);
          line-height: 0.9;
          font-weight: 400;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          margin: 0 0 clamp(8px, 1.8cqi, 40px) 0;
          transform: scaleX(0.92);
          transform-origin: left center;
        }
        .carousel-copy-tagline {
          font-size: clamp(9px, 1.3cqi, 36px);
          line-height: 1.35;
          font-weight: 500;
          color: #1a3a23;
        }

        @media (max-width: 767px) {
          .carousel-copy {
            width: 55%;
            /* Keep left padding aligned with shield (16px) on mobile too. */
            padding: 5% 4% 5% 16px;
          }
        }

        /* Slide fade */
        .carousel-slide {
          position: absolute;
          inset: 0;
          transition: opacity 0.9s ease-in-out;
        }

        /* Arrows — clustered as a [<] [>] pair at bottom-right so they
           don't overlap left-side copy panels. */
        .carousel-arrow {
          position: absolute;
          bottom: 24px;
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
        .carousel-arrow:active { transform: scale(0.93); }
        /* Right edge: 16px gap. Left arrow sits to the immediate left of
           the right arrow with an 8px gap between them. */
        .carousel-arrow-right { right: 16px; }
        .carousel-arrow-left  { right: calc(16px + 40px + 8px); }

        @media (min-width: 768px) {
          .carousel-arrow { width: 44px; height: 44px; }
          .carousel-arrow-right { right: 28px; }
          .carousel-arrow-left  { right: calc(28px + 44px + 10px); }
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
            <Image
              className="carousel-slide-img"
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={idx === 0}
              style={{
                objectPosition: slide.objectPosition ?? 'center center',
                objectFit: slide.objectFit ?? 'contain',
              }}
            />
            {slide.copy ? (
              <div className="carousel-copy">
                <div className="carousel-copy-eyebrow">{slide.copy.eyebrow}</div>
                <h2 className="carousel-copy-headline">{slide.copy.headline}</h2>
                <div className="carousel-copy-tagline">{slide.copy.tagline}</div>
              </div>
            ) : null}
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
