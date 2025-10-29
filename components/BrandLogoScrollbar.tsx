"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

interface BrandLogo {
  name: string;
  logo: string;
  alt: string;
}

const brandLogos: BrandLogo[] = [
  {
    name: "Cookies",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Cookies%20Logo.webp",
    alt: "Cookies Brand Logo"
  },
  {
    name: "RooR",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/RooR%20Logo.avif",
    alt: "RooR Brand Logo"
  },
  {
    name: "Puffco",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/puffco_logo.webp",
    alt: "Puffco Brand Logo"
  },
  {
    name: "Crave",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/crave-logo-black-150x96.png",
    alt: "Crave Brand Logo"
  },
  {
    name: "Diamond Glass",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/diamond-glass_logo.webp",
    alt: "Diamond Glass Brand Logo"
  },
  {
    name: "Mush Caps",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Mush-Caps-Logo.webp",
    alt: "Mush Caps Brand Logo"
  },
  {
    name: "Hidden Hills",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Hidden-Hills_logo.webp",
    alt: "Hidden Hills Brand Logo"
  },
  {
    name: "Doodlez",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Doodlez.webp",
    alt: "Doodlez Brand Logo"
  },
  {
    name: "Truemoola",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Truemoola.png",
    alt: "Truemoola Brand Logo"
  },
  {
    name: "Urth Farmacy",
    logo: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Brand%20Logos/Urth_Farmacy_logo.webp",
    alt: "Urth Farmacy Brand Logo"
  }
];

export default function BrandLogoScrollbar() {
  return (
    <section className="w-full relative overflow-hidden mb-16 mt-8" style={{ height: '300px' }}>
      {/* Marquee Frame Background */}
      <div className="absolute inset-0 bg-white z-0">
        {/* Neon lighting effects */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#2d8f4700] to-transparent opacity-100"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#2d8f4704] to-transparent opacity-100"></div>

        {/* Side neon strips */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#2d8f4700] to-transparent opacity-100"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#2d8f4704] to-transparent opacity-100"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4">
        {/* Section Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl text-black mb-4">
            TRUSTED BRANDS
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#fafcfa] to-transparent mx-auto opacity-80"></div>
        </div>

        {/* Logo Carousel - Full Height Utilization */}
        <div className="flex-1 relative overflow-visible">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={false}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 60,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 80,
              },
              1024: {
                slidesPerView: 4.2,
                spaceBetween: 100,
              },
              1280: {
                slidesPerView: 5.2,
                spaceBetween: 120,
              },
            }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              reverseDirection: false,
            }}
            speed={2500}
            loop={true}
            freeMode={{
              enabled: true,
              momentum: true,
            }}
            className="brand-logo-swiper h-full"
          >
            {/* First set of logos for smooth infinite loop */}
            {brandLogos.map((brand, index) => (
              <SwiperSlide key={`first-${brand.name}-${index}`} className="flex items-center justify-center h-full">
                <div className="flex items-center justify-center hover:scale-110 transition-transform duration-500 h-full py-4 relative">
                  {/* Subtle background for logo visibility */}
                  <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm"></div>
                  <img
                    src={brand.logo}
                    alt={brand.alt}
                    className="relative z-10 max-w-full max-h-full object-contain"
                    loading="lazy"
                    style={{
                      filter: 'brightness(1.4) contrast(1.3) saturate(1.1) drop-shadow(0 0 20px rgba(45, 143, 71, 0.3)) drop-shadow(0 0 40px rgba(45, 143, 71, 0.1))',
                      maxHeight: '180px',
                      WebkitFilter: 'brightness(1.4) contrast(1.3) saturate(1.1) drop-shadow(0 0 20px rgba(45, 143, 71, 0.3)) drop-shadow(0 0 40px rgba(45, 143, 71, 0.1))'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}

            {/* Duplicate set for seamless loop */}
            {brandLogos.map((brand, index) => (
              <SwiperSlide key={`second-${brand.name}-${index}`} className="flex items-center justify-center h-full">
                <div className="flex items-center justify-center hover:scale-110 transition-transform duration-500 h-full py-4 relative">
                  {/* Subtle background for logo visibility */}
                  <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm"></div>
                  <img
                    src={brand.logo}
                    alt={brand.alt}
                    className="relative z-10 max-w-full max-h-full object-contain"
                    loading="lazy"
                    style={{
                      filter: 'brightness(1.4) contrast(1.3) saturate(1.1) drop-shadow(0 0 20px rgba(45, 143, 71, 0.3)) drop-shadow(0 0 40px rgba(45, 143, 71, 0.1))',
                      maxHeight: '180px',
                      WebkitFilter: 'brightness(1.4) contrast(1.3) saturate(1.1) drop-shadow(0 0 20px rgba(45, 143, 71, 0.3)) drop-shadow(0 0 40px rgba(45, 143, 71, 0.1))'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-2">
          <a
            href="/brands"
            className="inline-block px-6 py-2 bg-transparent text-[#2d8f4700] border-2 border-[#2d8f4700] font-highway text-sm uppercase tracking-wide rounded-none transition-all duration-300 hover:bg-[#2d8f47] hover:text-white hover:scale-105"
            style={{
              fontFamily: "'Highway Gothic', 'Arial', sans-serif",
              fontWeight: 'normal',
              letterSpacing: '0.05em',
              textShadow: '0 0 8px rgba(45, 143, 71, 0.5)'
            }}
          >
            EXPLORE ALL BRANDS
          </a>
        </div>
      </div>
    </section>
  );
}
