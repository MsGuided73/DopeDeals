"use client";

import Link from "next/link";

interface BrandLogo {
  name: string;
  logo: string;
  alt: string;
  featured?: boolean;
}

const brandLogos: BrandLogo[] = [
  {
    name: "Cookies",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Cookies%20Logo.webp",
    alt: "Cookies Brand Logo",
    featured: true,
  },
  {
    name: "RooR",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/RooR%20Logo.avif",
    alt: "RooR Brand Logo",
  },
  {
    name: "Puffco",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/puffco_logo.webp",
    alt: "Puffco Brand Logo",
    featured: true,
  },
  {
    name: "Crave",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/crave-logo-black-150x96.png",
    alt: "Crave Brand Logo",
  },
  {
    name: "Diamond Glass",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/diamond-glass_logo.webp",
    alt: "Diamond Glass Brand Logo",
  },
  {
    name: "Mush Caps",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Mush-Caps-Logo.webp",
    alt: "Mush Caps Brand Logo",
  },
  {
    name: "Hidden Hills",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Hidden-Hills_logo.webp",
    alt: "Hidden Hills Brand Logo",
    featured: true,
  },
  {
    name: "Doodlez",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Doodlez.webp",
    alt: "Doodlez Brand Logo",
  },
  {
    name: "Truemoola",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Truemoola.png",
    alt: "Truemoola Brand Logo",
  },
  {
    name: "Urth Farmacy",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Urth_Farmacy_logo.webp",
    alt: "Urth Farmacy Brand Logo",
  },
  {
    name: "Juicy Fills Studio",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/juicy-fills-logo.webp",
    alt: "Juicy Fills Studio Brand Logo",
  },
];

export default function BrandLogoScrollbar() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-black font-display-twilight mb-2">
            TRUSTED BRANDS
          </h2>
          <p className="text-gray-600 text-lg">
            Premium products from industry-leading manufacturers
          </p>
        </div>

        {/* Staggered Masonry Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {brandLogos.map((brand, index) => (
            <div
              key={brand.name}
              className={`
                group relative flex items-center justify-center p-4 md:p-6 
                rounded-xl transition-all duration-500 cursor-pointer
                bg-transparent border-none
                ${brand.featured ? 'col-span-1 md:col-span-2 row-span-1 md:row-span-2' : ''}
                hover:shadow-2xl hover:shadow-green-500/20
              `}
              style={{
                // Create staggered effect with varying heights
                minHeight: brand.featured ? '180px' : '100px',
              }}
            >
              {/* Logo with grayscale to color on hover */}
              <img
                src={brand.logo}
                alt={brand.alt}
                className={`
                  object-contain transition-all duration-500
                  filter grayscale opacity-70
                  group-hover:grayscale-0 group-hover:opacity-100
                  group-hover:scale-110
                  ${brand.featured ? 'max-h-28 md:max-h-36' : 'max-h-16 md:max-h-20'}
                  w-full
                `}
                loading="lazy"
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />

              {/* Glow effect on hover - positioned behind */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-300/10 to-transparent rounded-xl" />
              </div>

              {/* Brand name tooltip on hover */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <span className="text-xs font-bold text-gray-700 bg-white/90 px-2 py-1 rounded-full shadow-sm whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Shop by Brand CTA */}
        {/* <div className="text-center mt-10">
          <Link
            href="/brands"
            className="inline-block px-8 py-3 bg-black text-white font-bold rounded-full
                       hover:bg-green-600 hover:scale-105 transition-all duration-300
                       hover:shadow-lg hover:shadow-green-500/30"
          >
            SHOP BY BRAND →
          </Link>
        </div> */}
      </div>
    </section>
  );
}
