'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Check, ArrowRight, Cannabis } from 'lucide-react';

type SlideCopy = {
  /** "header" (default): standard H420 eyebrow + Bebas headline + tagline.
   *  "hero": Road Trip sub-brand variant — two-tone display headline,
   *  leaf-accent divider, body subline. Used on slides 1 and 7. */
  style?: 'header' | 'hero';
  eyebrow?: string;
  headline: ReactNode;
  tagline: ReactNode;
  bullets?: string[];
  cta?: string;
};

// Optional overlay labels rendered on top of the slide image (not the copy
// panel). Used to caption parts of a composite image — e.g. naming each kit
// in the bundles slide. `left` is a CSS percentage of slide width measured
// to the label's center; `bottom` defaults to 7% of slide height.
type SlideImageLabel = { text: string; left: string; bottom?: string };

// ─── Carousel slides ──────────────────────────────────────────────────────────
const SLIDES: { id: string; src: string; alt: string; href: string; objectPosition?: string; objectFit?: 'cover' | 'contain'; bgColor?: string; copy?: SlideCopy; imageLabels?: SlideImageLabel[] }[] = [
  {
    id: 'slide-1',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/RoadTrips/Better%20Vibes%20No%20Text.png',
    alt: 'Highway 420 — Better Vibes',
    href: '/road-trips',
    objectPosition: 'center center',
    copy: {
      style: 'hero',
      headline: (
        <>
          Road To<br />
          <span className="carousel-hero-accent">Better Vibes</span>
        </>
      ),
      tagline: (
        <>
          Premium gear for every journey.<br />
          Elevate the ride.
        </>
      ),
      cta: 'Gear Up',
    },
  },
  {
    id: 'slide-2',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/CRAVE/2.png',
    alt: 'Highway 420 — CRAVE',
    href: '/search?brand=Crave',
    objectPosition: 'center center',
    objectFit: 'contain',
  },
  {
    id: 'slide-3',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/VIPMembership/Membership.png',
    alt: 'Highway 420 — VIP Membership',
    href: '/h420-vip',
    objectPosition: 'center center',
    copy: {
      eyebrow: 'Members Only',
      headline: <>Free VIP<br />Membership</>,
      tagline: <>Unlock exclusive pricing, drops, and perks &mdash; no cost to join.</>,
      bullets: ['Discount Prices', 'Early Access', 'Free Gifts'],
      cta: 'Join the Ride',
    },
  },
  {
    id: 'slide-4',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Bundles/Bundle_love.png',
    alt: 'Highway 420 — Bundles',
    href: '/bundles',
    objectPosition: 'center center',
    copy: {
      eyebrow: 'Curated for Convenience',
      headline: <>Popular<br />Set-Ups</>,
      tagline: <>Everything you need.<br />Nothing you don&rsquo;t.</>,
      cta: 'Shop Bundles',
    },
    imageLabels: [
      { text: 'Starter Kit', left: 'calc(44% + 10px)' },
      { text: 'High Roller Kit', left: '78%' },
    ],
  },
  {
    id: 'slide-5',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/RooR/Roor%20Hero%20New%20B.png',
    alt: 'Highway 420 — RooR Bongs',
    href: '/bongs',
    objectPosition: 'center center',
  },
  {
    id: 'slide-6',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/Dab%20Final%20A.png',
    alt: 'Highway 420 — Dab Rigs',
    href: '/dabsntools',
    objectPosition: 'center center',
    /* This slide's image is meant to sit on a light/white background.
       Without this override the carousel-wrap's default black shows
       through the contain-letterbox and swallows the dark text panel. */
    bgColor: '#ffffff',
    copy: {
      eyebrow: 'Tech. Flavor. Elevated.',
      headline: <>Dab Rigs</>,
      tagline: (
        <>
          Discover high-performance rigs<br />
          designed for precision and<br />
          smooth sessions.
        </>
      ),
      cta: 'Shop Dab Rigs',
    },
  },
  {
    id: 'slide-7',
    src: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/RoadTrips/RoadTrips-Original.png',
    alt: 'Highway 420 — Road Trips',
    href: '/road-trips',
    objectPosition: 'center center',
    copy: {
      style: 'hero',
      headline: (
        <>
          Find Your Next<br />
          <span className="carousel-hero-accent">Road Trip</span>
        </>
      ),
      tagline: (
        <>
          Spots. Scenes. Sessions.<br />
          Across the Highway.
        </>
      ),
      cta: 'Explore Road Trips',
    },
  },
];

const SLIDE_DURATION = 6000;

export default function FullscreenCarousel() {
  const [current,  setCurrent]  = useState(0);
  const [paused,   setPaused]   = useState(false);
  const [mounted,  setMounted]  = useState(false);
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
          /* Mobile: nearly square (4 / 5) so portrait & landscape source
             images have room to breathe. The black background fills any
             letterbox seamlessly, so no crop is ever required. */
          aspect-ratio: 4 / 5;
          max-height: calc(85vh - 35px);
          max-height: calc(85svh - 35px);
          /* Establish a container so child copy can size with cqi units. */
          container-type: inline-size;
          container-name: carousel;
        }

        @media (min-width: 640px) {
          .carousel-wrap {
            aspect-ratio: 3 / 2;
          }
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
          padding: 5% 5% 5% 16px;
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
             query units. Sized to leave room for optional bullets + CTA
             below; pre-bullets layout was clamp(18px, 6cqi, 220px). */
          font-size: clamp(16px, 4.5cqi, 170px);
          line-height: 0.9;
          font-weight: 400;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0 0 clamp(6px, 1.2cqi, 28px) 0;
          transform: scaleX(0.92);
          transform-origin: left center;
        }
        .carousel-copy-tagline {
          font-size: clamp(8px, 1.05cqi, 24px);
          line-height: 1.35;
          font-weight: 500;
          color: #1a3a23;
        }
        .carousel-copy-bullets {
          list-style: none;
          padding: 0;
          margin: clamp(8px, 1.4cqi, 30px) 0 0;
          display: flex;
          flex-direction: column;
          gap: clamp(4px, 0.8cqi, 16px);
          font-size: clamp(9px, 1.15cqi, 26px);
          color: #1a3a23;
          font-weight: 500;
        }
        .carousel-copy-bullets li {
          display: flex;
          align-items: center;
          gap: clamp(5px, 0.7cqi, 14px);
        }
        .carousel-copy-bullets svg {
          flex-shrink: 0;
          color: #1f6b3a;
          width: clamp(12px, 1.5cqi, 32px);
          height: clamp(12px, 1.5cqi, 32px);
        }
        .carousel-copy-cta {
          display: inline-flex;
          align-items: center;
          gap: clamp(4px, 0.6cqi, 12px);
          background: #1f4d2e;
          color: #ffffff;
          padding: clamp(7px, 1.1cqi, 22px) clamp(14px, 2.2cqi, 36px);
          border-radius: 4px;
          font-family: 'BebasNeue', 'Bebas Neue', 'Impact', sans-serif;
          font-size: clamp(11px, 1.3cqi, 28px);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: clamp(10px, 1.6cqi, 36px);
          align-self: flex-start;
        }
        .carousel-copy-cta svg {
          width: clamp(11px, 1.3cqi, 26px);
          height: clamp(11px, 1.3cqi, 26px);
        }

        /* ── Road Trip hero sub-style (slides 1 + 7) ────────────────── */
        .carousel-copy--hero {
          /* Wider panel for the larger display type. */
          width: 60%;
          color: #ffffff;
          justify-content: center;
        }
        .carousel-hero-headline {
          /* BebasNeue (brand font), oversized for the hero treatment.
             !important is required to beat the global h2 rule in
             globals.css that forces Fira Sans 800 on every h2. */
          font-family: "BebasNeue", "Bebas Neue", "Impact", sans-serif !important;
          font-weight: 400 !important;
          letter-spacing: -0.02em !important;
          font-size: clamp(34px, 7cqi, 175px);
          line-height: 0.92;
          text-transform: uppercase;
          margin: 0;
          color: #ffffff;
          text-shadow: 0 2px 18px rgba(0,0,0,0.45);
        }
        .carousel-hero-accent {
          /* Default hero accent — lime green, used on slide 1 ("Better Vibes"). */
          color: #a8d96b;
        }
        .carousel-hero-divider {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.2cqi, 22px);
          margin: clamp(4px, 0.7cqi, 14px) 0 clamp(4px, 0.7cqi, 14px);
          color: #a8d96b;
        }
        .carousel-hero-divider::before,
        .carousel-hero-divider::after {
          content: "";
          height: 2px;
          width: clamp(40px, 6cqi, 140px);
          background: currentColor;
        }
        .carousel-hero-divider svg {
          width: clamp(16px, 2cqi, 42px);
          height: clamp(16px, 2cqi, 42px);
          flex-shrink: 0;
        }
        .carousel-hero-tagline {
          font-family: "Inter", "Fira Sans", system-ui, sans-serif;
          font-size: clamp(13px, 1.6cqi, 36px);
          font-weight: 500;
          color: #ffffff;
          line-height: 1.4;
          text-shadow: 0 1px 8px rgba(0,0,0,0.35);
          margin: 0;
        }
        /* Hero CTA — text label + circular arrow chip, mirroring the
           secondary-card pattern in RoadTripsSection (.rt-card__arrow).
           No filled button — keeps the slide breathing on the photo. */
        .carousel-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: clamp(8px, 1.2cqi, 22px);
          font-family: 'Fira Sans', 'Inter', sans-serif;
          font-size: clamp(11px, 1.25cqi, 24px);
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffffff;
          margin-top: clamp(10px, 1.4cqi, 28px);
          align-self: flex-start;
          text-shadow: 0 1px 8px rgba(0,0,0,0.4);
          pointer-events: auto;
        }
        .carousel-hero-cta__arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: clamp(30px, 3.2cqi, 64px);
          height: clamp(30px, 3.2cqi, 64px);
          border-radius: 50%;
          background: #ffffff;
          color: #1a3a23;
          transition: transform 0.25s ease, background 0.2s ease, color 0.2s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.25);
        }
        .carousel-hero-cta:hover .carousel-hero-cta__arrow {
          transform: translateX(4px);
          background: #a8d96b;
          color: #0f2616;
        }
        .carousel-hero-cta__arrow svg {
          width: clamp(13px, 1.5cqi, 28px);
          height: clamp(13px, 1.5cqi, 28px);
        }

        @media (max-width: 767px) {
          /* On phones, the slide image is the hero — hide the side text
             panel so the image is fully visible without competition. The
             slide is still tappable (the link wraps the whole carousel). */
          .carousel-copy {
            display: none;
          }
        }

        /* Image-overlay labels — captions placed on top of the slide image
           (not the copy panel). Centered horizontally on the supplied left
           value via translateX(-50%); styled to mirror the cannabis-leaf
           ornament used on slides 1 and 7. */
        .carousel-image-label {
          position: absolute;
          z-index: 4;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(4px, 0.6cqi, 12px);
          pointer-events: none;
        }
        .carousel-image-label__text {
          font-family: 'Fira Sans', 'Inter', sans-serif;
          font-size: clamp(10px, 1.3cqi, 26px);
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0 2px 8px rgba(0,0,0,0.55);
          white-space: nowrap;
        }
        .carousel-image-label__divider {
          display: flex;
          align-items: center;
          gap: clamp(4px, 0.7cqi, 12px);
          color: #a8d96b;
        }
        .carousel-image-label__divider::before,
        .carousel-image-label__divider::after {
          content: "";
          height: 1px;
          width: clamp(20px, 3cqi, 60px);
          background: currentColor;
        }
        .carousel-image-label__divider svg {
          width: clamp(11px, 1.4cqi, 24px);
          height: clamp(11px, 1.4cqi, 24px);
          flex-shrink: 0;
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

        /* Dots — sit centered below the carousel, above the progress bar. */
        .carousel-dots {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          margin: 12px auto 0;
        }
        .carousel-dot {
          height: 9px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: width 0.3s, background 0.3s;
        }

        /* Progress bar — sits centered immediately below the carousel. */
        .carousel-progress-track {
          position: relative;
          width: 200px;
          height: 2px;
          background: rgba(0,0,0,0.12);
          margin: 12px auto 0;
          overflow: hidden;
          border-radius: 999px;
        }
        .carousel-progress-fill {
          height: 100%;
          width: 100%;
          background: #2d8f47;
          transform: scaleX(0);
          transform-origin: left center;
          animation: carousel-progress-grow ${SLIDE_DURATION}ms linear forwards;
          will-change: transform;
        }
        @keyframes carousel-progress-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
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
            style={{
              opacity: idx === current ? 1 : 0,
              zIndex: idx === current ? 1 : 0,
              ...(slide.bgColor ? { background: slide.bgColor } : null),
            }}
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
                /* Default to `contain` so the entire slide image is always
                   visible regardless of viewport. The slide carousel-wrap's
                   black background fills any letterboxing. Per-slide override
                   is honored when a slide explicitly wants cover. */
                objectFit: slide.objectFit ?? 'contain',
              }}
            />
            {slide.imageLabels?.map((label, i) => (
              <div
                key={i}
                className="carousel-image-label"
                style={{ left: label.left, bottom: label.bottom ?? '7%' }}
                aria-hidden
              >
                <span className="carousel-image-label__text">{label.text}</span>
                <span className="carousel-image-label__divider">
                  <Cannabis strokeWidth={2} />
                </span>
              </div>
            ))}
            {slide.copy ? (
              slide.copy.style === 'hero' ? (
                <div className="carousel-copy carousel-copy--hero">
                  <h2 className="carousel-hero-headline">{slide.copy.headline}</h2>
                  <div className="carousel-hero-divider" aria-hidden>
                    <Cannabis strokeWidth={2} />
                  </div>
                  <p className="carousel-hero-tagline">{slide.copy.tagline}</p>
                  {slide.copy.cta && (
                    <span className="carousel-hero-cta">
                      {slide.copy.cta}
                      <span className="carousel-hero-cta__arrow" aria-hidden>
                        <ArrowRight strokeWidth={2.5} />
                      </span>
                    </span>
                  )}
                </div>
              ) : (
                <div className="carousel-copy">
                  <div className="carousel-copy-eyebrow">{slide.copy.eyebrow}</div>
                  <h2 className="carousel-copy-headline">{slide.copy.headline}</h2>
                  <div className="carousel-copy-tagline">{slide.copy.tagline}</div>
                  {slide.copy.bullets && slide.copy.bullets.length > 0 && (
                    <ul className="carousel-copy-bullets">
                      {slide.copy.bullets.map((b, i) => (
                        <li key={i}>
                          <Check strokeWidth={3} aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  {slide.copy.cta && (
                    <span className="carousel-copy-cta">
                      {slide.copy.cta}
                      <ArrowRight strokeWidth={2.5} aria-hidden />
                    </span>
                  )}
                </div>
              )
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

      </section>

      {/* ── Dots + slide-timing progress bar (sit below the carousel, centered) ── */}
      {total > 1 && (
        <>
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
                    ? '#2d8f47'
                    : 'rgba(0,0,0,0.18)',
                }}
              />
            ))}
          </div>
          <div className="carousel-progress-track">
            <div
              key={current}
              className="carousel-progress-fill"
              style={{ animationPlayState: paused ? 'paused' : 'running' }}
            />
          </div>
        </>
      )}
    </>
  );
}
