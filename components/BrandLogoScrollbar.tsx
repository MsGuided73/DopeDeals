"use client";

import { motion, useAnimation, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface BrandLogo {
  name: string;
  logo: string;
  alt: string;
  featured?: boolean;
  scaleClass?: string;
}

const brandLogos: BrandLogo[] = [
  {
    name: "Cookies",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Cookies%20Logo.webp",
    alt: "Cookies Brand Logo",
    scaleClass: "scale-[1.5] group-hover:scale-[1.65]",
  },
  {
    name: "Crave",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/crave-logo-black-150x96.png",
    alt: "Crave Brand Logo",
  },
  {
    name: "Mush Caps",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Mush-Caps-Logo.webp",
    alt: "Mush Caps Brand Logo",
    scaleClass: "scale-[1.4] group-hover:scale-[1.55]",
  },
  {
    name: "Hidden Hills",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Hidden-Hills_logo.webp",
    alt: "Hidden Hills Brand Logo",
    scaleClass: "scale-[1.4] group-hover:scale-[1.55]",
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
    name: "Zoomers",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Logos/Zoomers.png",
    alt: "Zoomers Brand Logo",
  },
  {
    name: "Astro Eight",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Logos/Astro%20Eight.png",
    alt: "Astro Eight Brand Logo",
  },
  {
    name: "mmelt",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Logos/mmelt%20logo.png",
    alt: "mmelt Brand Logo",
  },
];

export default function BrandLogoScrollbar() {
  const [isHovered, setIsHovered] = useState(false);
  const rotationRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(450); // Default radius for desktop

  // Adjust cylinder radius based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(250); // smaller radius for mobile
      } else if (window.innerWidth < 1024) {
        setRadius(350); // medium radius for tablet
      } else {
        setRadius(450); // large radius for desktop
      }
    };
    
    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Custom animation loop for continuous rotation that pauses on hover
  useAnimationFrame((time, delta) => {
    if (!isHovered) {
      // Rotate 10 degrees per second (slowed down from 15)
      rotationRef.current -= (delta / 1000) * 10; 
      if (containerRef.current) {
        containerRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }
    }
  });

  return (
    <section className="py-20 bg-white overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black font-display-twilight mb-2 tracking-wide">
            TRUSTED BRANDS
          </h2>
          <p className="text-gray-500 uppercase tracking-widest font-sans text-sm font-semibold">
            Premium products from industry leaders
          </p>
        </div>

        {/* 3D Carousel Stage */}
        <div 
          className="relative w-full h-[300px] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ perspective: "1200px" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Fader edges to hide cards clipping out of view */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

          {/* Rotating Container */}
          <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center transform-style-[preserve-3d]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {brandLogos.map((brand, i) => {
              // Calculate angles to evenly distribute cards in 360 degrees
              const angle = (360 / brandLogos.length) * i;
              
              return (
                <div
                  key={brand.name}
                  className="absolute left-1/2 top-1/2 -ml-[130px] -mt-[75px] w-[260px] h-[150px]"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden", // Hide cards facing backwards
                  }}
                >
                  {/* Floating Brand Card */}
                  <div className="w-full h-full p-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 flex items-center justify-center group hover:shadow-[0_15px_40px_rgba(34,197,94,0.15)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden backdrop-blur-xl bg-white/80">
                    
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Brand Logo */}
                    <img
                      src={brand.logo}
                      alt={brand.alt}
                      className={`w-full h-full object-contain transition-all duration-500 relative z-10 ${brand.scaleClass || 'group-hover:scale-110'}`}
                      draggable="false"
                    />

                    {/* Tooltip Name */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs font-bold py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 group-hover:bottom-3 transition-all duration-300 z-20 whitespace-nowrap shadow-xl">
                      {brand.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
