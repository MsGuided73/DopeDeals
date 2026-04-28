"use client";

/**
 * TrustedBrandsBulletin — "Shop by Brand" section.
 *
 * Option 1 – Clean, frameless logo row.
 * Full-colour logos float directly on a white background.
 * No cards, no borders, no boxes. Each brand links to a
 * filtered search results page: /search?q=BrandName
 */

import Image from "next/image";
import Link from "next/link";

type Brand = {
  name: string;
  logo: string;
  href: string;
  hasProducts: boolean; // only show as clickable if products exist in DB
};

const BRANDS: Brand[] = [
  { name: "Cookies",             logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Cookies%20Logo.webp",            href: "/search?q=Cookies",             hasProducts: true  },
  { name: "Crave",               logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/crave-logo-black-150x96.png",    href: "/search?q=Crave",               hasProducts: true  },
  { name: "Hidden Hills",        logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Hidden-Hills_logo.webp",         href: "/search?q=Hidden+Hills",        hasProducts: false },
  { name: "Truemoola",           logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Truemoola.png",                  href: "/search?q=Truemoola",           hasProducts: false },
  { name: "Urth Farmacy",        logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Urth_Farmacy_logo.webp",         href: "/search?q=Urth+Farmacy",        hasProducts: true  },
  { name: "Astro Eight",         logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Logos/Astro%20Eight.png",            href: "/search?q=Astro+Eight",         hasProducts: false },
  { name: "Puffco",              logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/puffco_logo.webp",                     href: "/search?q=Puffco",              hasProducts: true  },
  { name: "RooR",                logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/RooR%20Logo.avif",                    href: "/search?q=ROOR",                hasProducts: true  },
  { name: "Diamond Glass",       logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/diamond-glass_logo.webp",             href: "/search?q=Diamond+Glass",       hasProducts: false },
  { name: "Mellow Fellow",       logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/mellow-fellow_logo2.png",             href: "/search?q=Mellow+Fellow",       hasProducts: false },
  { name: "NEO",                 logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/NEO-Hookah_logo.webp",                href: "/search?q=NEO",                 hasProducts: false },
  { name: "RAW",                 logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/raw_logo.png",                        href: "/search?q=RAW",                 hasProducts: false },
  { name: "Twenty-One Cannabis", logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Logos/Twenty-One-Cannabis-Logo.webp",       href: "/search?q=Twenty-One+Cannabis", hasProducts: false },
];

export default function TrustedBrandsBulletin() {
  return (
    <section style={{
      position: 'relative',
      background: '#ffffff',
      padding: '56px 24px 60px',
      /* border rules removed in favor of absolute striped dividers below */
    }}>
      {/* Top light navbar green rule with white stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D' }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p className="dg-lime-text-gradient" style={{
          fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
          fontSize: '13px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          margin: '0 0 10px',
        }}>
          Road Tested Brands
        </p>
        <div style={{ width: '40px', height: '4px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D', margin: '0 auto 14px' }} />
        <h2 style={{
          fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
          fontSize: 'clamp(42px, 6vw, 72px)',
          lineHeight: 1,
          letterSpacing: '0.02em',
          color: '#1c1208',
          margin: '0 0 10px',
        }}>
          SHOP BY BRAND
        </h2>
        <p style={{
          fontSize: '13px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#9ca3af',
          margin: 0,
        }}>
          Road Tested. Rider Approved.
        </p>
      </div>

      {/* Brand logo grid — no frames, just logos */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '32px 24px',
      }}
        className="brand-grid"
      >
        {BRANDS.map((brand) => {
          const inner = (
            <>
              <div style={{ width: '100%', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={160}
                  height={72}
                  style={{
                    width: 'auto',
                    height: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'none',
                  }}
                  unoptimized
                />
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#9ca3af',
                textAlign: 'center',
              }}>
                {brand.name}
              </span>
            </>
          );

          return brand.hasProducts ? (
            <Link
              key={brand.name}
              href={brand.href}
              className="brand-item"
              title={`Shop all ${brand.name} products`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                padding: '12px 8px',
                transition: 'transform 0.18s ease, opacity 0.18s ease',
              }}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={brand.name}
              title="Coming soon"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 8px',
                cursor: 'default',
              }}
            >
              {inner}
            </div>
          );
        })}
      </div>



      {/* Bottom light navbar green rule with white stripe */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D' }} />

      <style>{`
        @media (max-width: 1024px) {
          .brand-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .brand-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 24px 16px !important; }
        }
        @media (max-width: 480px) {
          .brand-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .brand-item:hover {
          transform: translateY(-4px) scale(1.04);
          opacity: 1 !important;
        }
        .brand-item:hover span {
          color: #2d8f47 !important;
        }
        .brand-grid:hover .brand-item:not(:hover) {
          opacity: 0.5;
        }
      `}</style>
    </section>
  );
}
