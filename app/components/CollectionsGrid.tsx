"use client";

import React from 'react';

interface LogoButtonProps {
  href: string;
  label?: string;
}

export default function CollectionsGrid() {
  const categories = [
    { name: 'THCA Flower', route: '/thca-flower', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/THCA_flower.jpeg' },
    { name: 'Shrooms & Stuff', route: '/shrooms', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Shrooms.jpg' },
    { name: 'THCA Prerolls & Vapes', route: '/thca_pnv', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/GiveMeAJ.jpeg' },
    { name: 'Bongs & Bong Attachwents', route: '/bongs', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/RooR_6-bongs.png' },
    { name: 'Hand Pipes', route: '/pipes', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/hand_pipes.jpg' },
    { name: 'Dab-Rigs & Tools', route: '/dab-rigs', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Puffco_Zoom.png' },
    { name: 'Smoking Accessories', route: '/accessories', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Torch_Bowl.jpeg' },
    { name: 'Hookahs', route: '/hookahs', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Hookah.jpeg' },
  ];

  const logoPath = 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/life_is_highway_ride_with_us.jpg';

  const LogoButton: React.FC<LogoButtonProps> = ({ href, label = 'SHOP NOW' }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = href;
        }}
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          px-6 py-2
          bg-green-600 hover:bg-white
          text-white hover:text-green-600
          border-2 border-green-600
          font-bold uppercase tracking-wide
          transition-all duration-300
          hover:scale-105 hover:shadow-lg
          text-sm
          z-30
          rounded-full
          highway-hover-lift
        "
        style={{
          backgroundColor: '#2d8f47',
          borderColor: '#2d8f47',
          fontFamily: "'Chalets-Legweb', 'Inter', system-ui, sans-serif",
          fontWeight: 'normal',
          letterSpacing: '0.05em',
        }}
        aria-label={label}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Mobile: Stack vertically */}
      <div className="block lg:hidden space-y-4">
        {/* Large hero image first on mobile */}
        <a
          href="/ride-with-us"
          className="block w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg relative group hover:scale-105 transition-transform duration-300"
        >
          <img src={logoPath} alt="Highway 420" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-black/50 group-hover:to-transparent transition-all duration-300" />
          <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <LogoButton href="/ride-with-us" label="RIDE WITH US" />
          </div>
        </a>

        {/* Categories in 2-column grid on mobile */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <a
              key={i}
              href={cat.route}
              className="aspect-square rounded-2xl overflow-hidden shadow-md relative group hover:scale-105 transition-all duration-300 block"
              style={{
                boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px 5px rgba(34, 197, 94, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0 rgba(34, 197, 94, 0.7)';
              }}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute inset-0 flex items-end justify-center p-2 z-10 pointer-events-none">
                <h1 className="text-white text-lg sm:text-xl font-bold text-center uppercase leading-tight">{cat.name}</h1>
              </div>
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <LogoButton href={cat.route} label="SHOP NOW" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Desktop: Original grid layout */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-3 lg:aspect-[4/2] lg:items-stretch lg:justify-stretch">
        <a
          href="/ride-with-us"
          className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg relative h-full w-full group hover:scale-105 transition-transform duration-300 block"
        >
          <img src={logoPath} alt="Highway 420" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-black/50 group-hover:to-transparent transition-all duration-300" />
          <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <LogoButton href="/ride-with-us" label="RIDE WITH US" />
          </div>
        </a>

        {categories.map((cat, i) => (
          <a
            key={i}
            href={cat.route}
            className="rounded-2xl overflow-hidden shadow-md relative w-full h-full flex group hover:scale-105 transition-all duration-300 block"
            style={{
              boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px 5px rgba(34, 197, 94, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(34, 197, 94, 0.7)';
            }}
          >
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
            <div className="absolute inset-0 flex items-end justify-center p-3 z-10 pointer-events-none">
              <h1 className="text-white text-4xl md:text-5xl font-bold text-center uppercase">{cat.name}</h1>
            </div>
            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <LogoButton href={cat.route} label="SHOP NOW" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
