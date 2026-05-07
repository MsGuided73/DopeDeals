"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Collection data ──────────────────────────────────────────────────────────
// Top row = 3 large hero cards. Bottom row = 6 smaller cards.
// `image` is the background image URL — leave empty while you upload,
// and a dark placeholder will render until it's populated.

type Collection = {
  name: string;
  // Optional render override — use to force line breaks in the title
  // (e.g., split "Bongs & Water Pipes" across two lines).
  displayName?: ReactNode;
  tagline: string;
  route: string;
  image: string;
  // When true, render the title/tagline/CTA overlay via JSX. Use for cards
  // whose source image has no text baked in. Cards with baked-in text
  // (e.g., Dab Rigs, Vapes) leave this off to avoid double-rendering.
  hasTextOverlay?: boolean;
};

const TOP_ROW: Collection[] = [
  {
    name: "Bongs & Water Pipes",
    displayName: (
      <>
        Bongs &amp;<br />
        Water Pipes
      </>
    ),
    tagline: "Smooth hits. Elevated sessions.",
    route: "/bongs",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/Bongs_for_Grid-No_Font.png",
    hasTextOverlay: true,
  },
  {
    name: "Dab Rigs",
    tagline: "Clean flavor. Next level.",
    route: "/dabsntools",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/NF-Cards/NF-DabRig.png",
    hasTextOverlay: true,
  },
  {
    name: "Vapes & Carts",
    tagline: "Compact. Clean. On the go.",
    route: "/vapes",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/NF-Cards/NF-Vapes&Carts.png",
    hasTextOverlay: true,
  },
];

const BOTTOM_ROW: Collection[] = [
  {
    name: "Hand Pipes",
    tagline: "Simple. Classic. Always a vibe.",
    route: "/pipes",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/NF-Cards/NF-Pipes.png",
    hasTextOverlay: true,
  },
  {
    name: "Flower",
    tagline: "Top shelf. Fresh. Always fire.",
    route: "/thca_flower",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/NF-Cards/NF-Flower.png",
    hasTextOverlay: true,
  },
  {
    name: "Pre-Rolls",
    tagline: "Ready when you are.",
    route: "/pre-rolls",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/NF-Cards/NF-Prerolls.png",
    hasTextOverlay: true,
  },
  {
    name: "Edibles",
    tagline: "Delicious. Discreet. Dialed in.",
    route: "/edibles",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/NF-Cards/NF-Edibles.png",
    hasTextOverlay: true,
  },
  {
    name: "Shrooms",
    tagline: "Elevate your mind. Naturally.",
    route: "/mushrooms",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/NF-Cards/NF-Mushrooms.png",
    hasTextOverlay: true,
  },
  {
    name: "Accessories",
    tagline: "Everything you need. All in one.",
    route: "/accessories",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/NF-Cards/NF-Accessories.png",
    hasTextOverlay: true,
  },
];

const TRUST_BADGES = [
  { icon: "🏆", title: "Premium Quality", copy: "Carefully curated top shelf products." },
  { icon: "🔒", title: "Discreet Shipping", copy: "Fast, secure, and 100% discreet." },
  { icon: "🌿", title: "Earn Rewards", copy: "Get points. Unlock exclusive perks." },
  { icon: "🎧", title: "Real Support", copy: "We're here for you. Every step of the way." },
];

// ─── Card ─────────────────────────────────────────────────────────────────────
function CategoryCard({ col, size }: { col: Collection; size: "lg" | "sm" }) {
  return (
    <Link href={col.route} className={`cg-card cg-card--${size}`} aria-label={`Shop ${col.name}`}>
      <div className="cg-card__media">
        {col.image ? (
          <img src={col.image} alt={col.name} loading="lazy" />
        ) : (
          <div className="cg-card__placeholder" aria-hidden="true" />
        )}
      </div>
      {col.hasTextOverlay && (
        <>
          <div className="cg-card__scrim" aria-hidden="true" />
          <div className="cg-card__body">
            <h3 className="cg-card__title">{col.displayName ?? col.name}</h3>
            <p className="cg-card__tagline">{col.tagline}</p>
            <span className="cg-card__cta">
              Shop Now
              <ArrowRight className="cg-card__cta-arrow" aria-hidden="true" strokeWidth={2.5} />
            </span>
          </div>
        </>
      )}
    </Link>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CollectionsGrid() {
  return (
    <>
      <style>{`
        /* ── Header ── */
        .cg-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .cg-header__title {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(32px, 5vw, 64px);
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1;
          color: #0E2A1A;
          margin: 0;
        }
        .cg-header__divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 10px;
        }
        .cg-header__divider::before,
        .cg-header__divider::after {
          content: "";
          width: 42px;
          height: 2px;
          background: #0E2A1A;
        }
        .cg-header__sub {
          font-family: "Fira Sans", "Inter", system-ui, sans-serif;
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 600;
          color: #0E2A1A;
          margin: 0;
        }
        .cg-header__tagline {
          font-family: "Fira Sans", "Inter", system-ui, sans-serif;
          font-size: 15px;
          color: #5B6560;
          margin: 6px 0 0;
        }

        /* ── Grid rows ── */
        .cg-row {
          display: grid;
          gap: 14px;
        }
        .cg-row--top {
          grid-template-columns: 1fr;
          margin-bottom: 14px;
        }
        .cg-row--bottom {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          .cg-row--top { grid-template-columns: repeat(3, 1fr); }
          .cg-row--bottom { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .cg-row--bottom { grid-template-columns: repeat(6, 1fr); }
        }

        /* ── Card ── */
        .cg-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          border-radius: 12px;
          background: #1A1A1A;
          text-decoration: none;
          color: #ffffff;
          isolation: isolate;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .cg-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }
        .cg-card--sm {
          aspect-ratio: 2 / 3;
        }
        
        /* Mobile/tablet fix: prevent top row from collapsing */
        @media (max-width: 1023px) {
          .cg-card--lg {
            aspect-ratio: 1 / 1;
          }
        }

        .cg-card__media {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          transform: scale(var(--cg-scale, 1.02)) translate(calc(var(--cg-offset-x, 0px) + 2px), calc(var(--cg-offset-y, 0px) - 2px));
        }

        @media (max-width: 1023px) {
          .cg-card__media {
            display: flex;
            flex: 1;
            min-height: 0;
          }
        }

        /* Top-row alignment is now handled by object-fit: cover + object-position: bottom center.
           No per-card transforms needed. */

        /* Pixel-perfect image alignment adjustments for the bottom row */
        .cg-row--bottom .cg-card:nth-child(1) { --cg-offset-y: 5px; --cg-offset-x: 4px; --cg-scale: 1.06; }
        .cg-row--bottom .cg-card:nth-child(2) { --cg-offset-y: 6px; --cg-offset-x: 4px; --cg-scale: 1.06; }
        .cg-row--bottom .cg-card:nth-child(3) { --cg-offset-y: 0px; --cg-offset-x: 10px; --cg-scale: 1.09; }
        .cg-row--bottom .cg-card:nth-child(4) { --cg-offset-y: 4px; --cg-offset-x: 5px; --cg-scale: 1.07; }
        .cg-row--bottom .cg-card:nth-child(5) { --cg-offset-y: 4px; --cg-offset-x: -1px; }
        .cg-row--bottom .cg-card:nth-child(6) { --cg-offset-y: -4px; --cg-offset-x: 3px; --cg-scale: 1.06; }
        
        .cg-card__media img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: bottom center;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .cg-card--lg .cg-card__media img {
          height: 100%;
          object-fit: cover;
        }
        .cg-card:hover .cg-card__media img {
          transform: scale(1.05);
        }
        .cg-card__placeholder {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, #2A2B2A 0%, #1A1B1A 100%);
        }
        .cg-card__placeholder::after {
          content: "Image coming soon";
          position: absolute;
          top: 12px;
          right: 12px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .cg-card__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0) 35%,
            rgba(0,0,0,0.35) 65%,
            rgba(0,0,0,0.75) 100%
          );
          z-index: 1;
        }

        .cg-card__body {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          /* Tight padding so SHOP NOW sits close to the bottom-left
             corner — matches the baked-in cards. Bottom-row (sm) keeps
             its own override. */
          padding: 10px 14px;
        }
        .cg-card--sm .cg-card__body { padding: 10px 12px; }

        .cg-card__title {
          /* Anton — narrow condensed display sans with the skinny "O"
             and tall glyphs the baked-in card text uses. !important is
             required to override the global h3 rule in globals.css that
             forces Inter on every <h3>. */
          /* BebasNeue is the site-wide brand font, preloaded in
             layout.tsx for first-paint render. Anton was removed from
             the chain after testing — it caused a brief FOUT swap on
             slower loads and added a needless Google Fonts request. */
          font-family: "BebasNeue", "Bebas Neue", "Impact", sans-serif !important;
          font-weight: 400 !important;
          letter-spacing: 0 !important;
          /* Tight line-height brings the two title lines (BONGS & /
             WATER PIPES) close together. */
          line-height: 0.88;
          color: #ffffff;
          margin: 0 0 4px;
          /* Top-row (lg) hero size — one notch down from clamp(34px, 3.8vw, 52px). */
          font-size: clamp(28px, 3.2vw, 44px);
          text-transform: uppercase;
        }
        .cg-card--sm .cg-card__title {
          font-size: clamp(22px, 2.4vw, 30px);
          margin-bottom: 3px;
        }
        .cg-card__tagline {
          font-family: "Fira Sans", "Inter", system-ui, sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: rgba(255,255,255,0.85);
          line-height: 1.25;
          margin: 0 0 4px;
        }
        .cg-card--sm .cg-card__tagline {
          font-size: 12px;
          margin-bottom: 4px;
        }
        .cg-card--sm .cg-card__cta {
          font-size: 12px;
          gap: 8px;
        }
        .cg-card--sm .cg-card__cta-arrow {
          width: 15px;
          height: 15px;
        }

        .cg-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          /* Match the tagline's clean sans-serif so the CTA reads as
             body text in caps, not as a condensed display label. */
          font-family: "Fira Sans", "Inter", system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
        }
        .cg-card__cta-arrow {
          width: 18px;
          height: 18px;
          /* Slight downward nudge to optically center the SVG glyph
             with the cap-height baseline of the surrounding text. */
          transform: translateY(1px);
        }
        .cg-card__cta span {
          transition: transform 0.2s ease;
        }
        .cg-card:hover .cg-card__cta span {
          transform: translateX(3px);
        }

        /* ── Trust bar ── */
        .cg-trust {
          margin-top: 20px;
          background: #EFEFEA;
          border-radius: 10px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          padding: 20px 24px;
        }
        @media (min-width: 640px) {
          .cg-trust { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .cg-trust {
            grid-template-columns: repeat(4, 1fr);
            gap: 0;
          }
        }
        .cg-trust__item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 16px;
          border-left: 1px solid transparent;
        }
        @media (min-width: 1024px) {
          .cg-trust__item + .cg-trust__item { border-left-color: #D9D9D3; }
        }
        .cg-trust__icon {
          font-size: 26px;
          line-height: 1;
          flex-shrink: 0;
        }
        .cg-trust__title {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0E2A1A;
          margin: 0 0 2px;
        }
        .cg-trust__copy {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          color: #5B6560;
          line-height: 1.3;
          margin: 0;
        }
      `}</style>

      <div id="collections-grid" style={{ padding: '0 16px' }}>
        {/* ── Header ── */}
        <header className="cg-header">
          <h2 className="cg-header__title">SHOP BY CATEGORY</h2>
          <div className="cg-header__divider">
            <p className="cg-header__sub">Choose Your Route</p>
          </div>
          <p className="cg-header__tagline">Premium products for every kind of ride.</p>
        </header>

        {/* ── Top row: 3 large ── */}
        <div className="cg-row cg-row--top">
          {TOP_ROW.map((col) => (
            <CategoryCard key={col.route} col={col} size="lg" />
          ))}
        </div>

        {/* ── Bottom row: 6 small ── */}
        <div className="cg-row cg-row--bottom">
          {BOTTOM_ROW.map((col) => (
            <CategoryCard key={col.route} col={col} size="sm" />
          ))}
        </div>

        {/* ── Trust bar ── */}
        <div className="cg-trust">
          {TRUST_BADGES.map((b) => (
            <div key={b.title} className="cg-trust__item">
              <span className="cg-trust__icon" aria-hidden="true">{b.icon}</span>
              <div>
                <p className="cg-trust__title">{b.title}</p>
                <p className="cg-trust__copy">{b.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
