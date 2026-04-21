"use client";

/**
 * TrustedBrandsBulletin — "Road Tested Brands" section.
 *
 * Replaces the BrandLogoScrollbar component on the landing page. Renders
 * brands as paper cards pinned to a real cork board, each at a slight
 * deterministic tilt (so SSR and client render match). Hovering a card
 * "un-pins" it: it straightens, lifts off the board, and casts a deeper
 * shadow.
 */

import Image from "next/image";

const CORK_TEXTURE_URL =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Textures/CorkBoard1-GroupedNoGap.png";

type Brand = {
  name: string;
  logo: string;
};

const BRANDS: Brand[] = [
  { name: "Cookies",             logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Cookies%20Logo.webp" },
  { name: "Crave",               logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/crave-logo-black-150x96.png" },
  { name: "Hidden Hills",        logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Hidden-Hills_logo.webp" },
  { name: "Truemoola",           logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Truemoola.png" },
  { name: "Urth Farmacy",        logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Urth_Farmacy_logo.webp" },
  { name: "Astro Eight",         logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Logos/Astro%20Eight.png" },
  { name: "Puffco",              logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/puffco_logo.webp" },
  { name: "RooR",                logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/RooR%20Logo.avif" },
  { name: "Diamond Glass",       logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/diamond-glass_logo.webp" },
  { name: "Doodlez",             logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/Doodlez.webp" },
  { name: "Infuzd",              logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/infuzd_logo.webp" },
  { name: "Mellow Fellow",       logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/mellow-fellow_logo2.png" },
  { name: "NEO",                 logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/NEO-Hookah_logo.webp" },
  { name: "RAW",                 logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/raw_logo.png" },
  { name: "Twenty-One Cannabis", logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/Twenty-One-Cannabis-Logo.webp" },
];

// Deterministic per-index tilt angles — keeps SSR/client renders identical
const TILT_CYCLE = [
  -2.4, 1.8, -1.2, 2.2, -2.8,
   1.4, -1.8, 2.6, -0.8, 1.6,
  -2.0, 1.2, -2.6, 2.0, -1.4,
];

export default function TrustedBrandsBulletin() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Special+Elite&display=swap');

        .tbb-band {
          position: relative;
          background:
            repeating-linear-gradient(92deg, rgba(255, 220, 160, 0.02) 0px, rgba(255, 220, 160, 0.02) 2px, transparent 2px, transparent 6px),
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232, 146, 10, 0.05) 0%, transparent 70%),
            linear-gradient(180deg, #16100a 0%, #1c1208 50%, #120c06 100%);
          overflow: hidden;
        }

        .tbb-plank {
          background:
            repeating-linear-gradient(90deg, rgba(255, 210, 150, 0.04) 0px, rgba(255, 210, 150, 0.04) 2px, transparent 2px, transparent 5px),
            linear-gradient(180deg, #3a2614 0%, #2a1c0d 50%, #1f1308 100%);
          border-top: 2px solid rgba(0, 0, 0, 0.65);
          border-bottom: 3px solid rgba(0, 0, 0, 0.80);
          box-shadow:
            inset 0 2px 0 rgba(255, 220, 165, 0.12),
            inset 0 -4px 8px rgba(0, 0, 0, 0.55),
            0 6px 14px rgba(0, 0, 0, 0.55);
          padding: 28px 16px 26px;
          text-align: center;
          position: relative;
        }
        .tbb-plank::before, .tbb-plank::after {
          content: ""; position: absolute; top: 8px;
          width: 9px; height: 9px; border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #b0a088 0%, #6d5c44 50%, #2a1f14 100%);
          box-shadow: 0 1px 2px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,220,180,0.3);
        }
        .tbb-plank::before { left: 24px; }
        .tbb-plank::after  { right: 24px; }

        .tbb-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 6vw, 74px);
          line-height: 0.95;
          letter-spacing: 0.05em;
          color: #e8920a;
          margin: 0 0 6px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.85), 0 0 14px rgba(232,146,10,0.25);
        }
        .tbb-sub {
          font-family: 'Special Elite', monospace;
          font-size: 13px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 220, 165, 0.65);
          margin: 0;
        }

        .tbb-corkboard {
          position: relative;
          padding: 64px 32px 80px;
          background-color: #8a5e2c;
          background-image:
            radial-gradient(ellipse 130% 100% at 50% 50%, transparent 35%, rgba(20, 10, 2, 0.40) 100%),
            url('${CORK_TEXTURE_URL}');
          background-size: auto, auto;
          background-position: center, center;
          background-repeat: no-repeat, repeat;
          border-top: 4px solid #0a0604;
          border-bottom: 4px solid #0a0604;
          box-shadow:
            inset 0 0 80px rgba(20, 10, 2, 0.45),
            inset 0 4px 12px rgba(0, 0, 0, 0.45),
            inset 0 -6px 16px rgba(0, 0, 0, 0.45);
        }

        .tbb-pin-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 22px 28px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .tbb-card {
          position: relative;
          flex-shrink: 0;
          width: 180px;
          height: 130px;
          background: linear-gradient(180deg, #fef6e2 0%, #f5ead8 50%, #e9dcbf 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px 16px 18px;
          border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.35),
            6px 8px 18px rgba(0, 0, 0, 0.55),
            12px 16px 28px rgba(0, 0, 0, 0.35);
          text-decoration: none;
        }
        .tbb-card::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(circle at 100% 100%, rgba(80, 50, 20, 0.14) 0%, transparent 20%),
            radial-gradient(circle at 0% 100%, rgba(80, 50, 20, 0.10) 0%, transparent 18%);
        }

        .tbb-card:hover {
          transform: rotate(0deg) translateY(-6px) scale(1.04) !important;
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.45),
            10px 16px 30px rgba(0, 0, 0, 0.70),
            18px 26px 44px rgba(0, 0, 0, 0.40);
          z-index: 10;
        }

        .tbb-pin {
          position: absolute;
          top: -8px; left: 50%; transform: translateX(-50%);
          width: 18px; height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #ffc662 0%, #e8920a 45%, #c5751a 100%);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.55),
            inset 0 -2px 3px rgba(120, 60, 10, 0.6),
            0 2px 3px rgba(0, 0, 0, 0.55),
            0 0 10px rgba(232, 146, 10, 0.35);
          z-index: 3;
        }
        .tbb-pin::after {
          content: ""; position: absolute;
          top: 14px; left: 50%; transform: translateX(-50%);
          width: 3px; height: 4px;
          background: rgba(0, 0, 0, 0.25);
          border-radius: 1px;
        }

        .tbb-logo-wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 78%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tbb-logo-wrap img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .tbb-card-name {
          position: absolute;
          bottom: 6px;
          left: 0; right: 0;
          font-family: 'Special Elite', monospace;
          font-size: 9px;
          text-align: center;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(80, 50, 20, 0.65);
        }
      `}</style>

      <section className="tbb-band">
        <div className="tbb-plank">
          <h2 className="tbb-title">ROAD TESTED BRANDS</h2>
          <p className="tbb-sub">Pinned · Rated · Ridden With</p>
        </div>

        <div className="tbb-corkboard">
          <div className="tbb-pin-row">
            {BRANDS.map((brand, i) => (
              <div
                key={brand.name}
                className="tbb-card"
                title={brand.name}
                style={{ transform: `rotate(${TILT_CYCLE[i % TILT_CYCLE.length]}deg)` }}
              >
                <span className="tbb-pin" aria-hidden />
                <div className="tbb-logo-wrap">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={140}
                    height={90}
                    style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    unoptimized
                  />
                </div>
                <span className="tbb-card-name">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
