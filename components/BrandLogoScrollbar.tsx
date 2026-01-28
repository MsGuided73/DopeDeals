"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

interface BrandLogo {
  name: string;
  logo: string;
  alt: string;
}

const brandLogos: BrandLogo[] = [
  {
    name: "Cookies",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Cookies%20Logo.webp",
    alt: "Cookies Brand Logo",
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

const springEase = [0.16, 1, 0.3, 1];

function BrandLogoTile({
  brand,
  direction,
  scrollYProgress,
  reduceMotion,
}: {
  brand: BrandLogo;
  direction: -1 | 1;
  scrollYProgress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const xOffset = useTransform(scrollYProgress, [0, 1], [direction * 180, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.94, 1]);

  return (
    <motion.div
      className="relative flex h-full items-center justify-center rounded-xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
      style={
        reduceMotion
          ? undefined
          : {
              x: xOffset,
              opacity,
              scale,
            }
      }
      transition={{ duration: 0.6, ease: springEase }}
    >
      <img
        src={brand.logo}
        alt={brand.alt}
        className="max-h-20 w-full object-contain md:max-h-24"
        loading="lazy"
        style={{
          filter: "brightness(1.4) contrast(1.25) saturate(1.1)",
          WebkitFilter: "brightness(1.4) contrast(1.25) saturate(1.1)",
        }}
        onError={(event) => {
          const target = event.target as HTMLImageElement;
          target.style.display = "none";
        }}
      />
    </motion.div>
  );
}

/**
 * Render a scroll-interactive grid of brand logos with animated entrance tied to vertical scroll.
 *
 * The component displays a header, a responsive grid of brand logo tiles that animate (horizontal offset, opacity, and scale)
 * in response to the section's vertical scroll progress, and a "SHOP BY BRAND" call-to-action. Animations are disabled
 * when the user's reduce-motion preference is detected.
 *
 * @returns A section element containing the titled header, the responsive animated brand logo grid, and the CTA link.
 */
export default function BrandLogoScrollbar() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const logoDirections = useMemo(() => {
    const midpoint = Math.ceil(brandLogos.length / 2);
    return brandLogos.map((_, index) => (index < midpoint ? -1 : 1));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white py-12"
    >
      <div className="absolute inset-0 bg-white" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl text-black font-display-twilight">TRUSTED BRANDS</h1>
          <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-[#fafcfa] to-transparent opacity-80" />
          <p className="mt-3 text-sm text-gray-600 md:text-base">
            Scroll down to bring our brand partners together.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {brandLogos.map((brand, index) => (
            <BrandLogoTile
              key={brand.name}
              brand={brand}
              direction={logoDirections[index]}
              scrollYProgress={scrollYProgress}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </div>

        <div className="text-center">
          <a
            href="/brands"
            className="inline-flex items-center justify-center rounded-lg border-2 border-green-600 px-6 py-3 text-base font-bold text-green-600 transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-600/25"
          >
            SHOP BY BRAND →
          </a>
        </div>
      </div>
    </section>
  );
}