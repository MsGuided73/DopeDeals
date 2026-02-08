"use client";

import React from "react";
import Link from "next/link";

export default function CollectionsGrid() {
  const categories = [
    { 
      name: "FLOWER", 
      route: "/thca_flower", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/thca_flower_no_text.png",
      color: "#10b981", // Emerald
      bgGradient: "from-emerald-900/40 via-black to-black"
    },
    { 
      name: "PREROLLS", 
      route: "/pre-rolls", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/prerolls_no_text.png",
      color: "#f59e0b", // Amber
      bgGradient: "from-amber-900/40 via-black to-black"
    },
    { 
      name: "VAPES\n& CARTS", 
      route: "/vapes", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/vapesncarts_no_text.png",
      color: "#06b6d4", // Cyan
      bgGradient: "from-cyan-900/40 via-black to-black"
    },
    { 
      name: "SHROOMS", 
      route: "/mushrooms", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/edibles_no_text.png",
      color: "#a855f7", // Purple
      bgGradient: "from-purple-900/40 via-black to-black"
    },
    { 
      name: "N2O", 
      route: "/nitrous-oxide", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/nitrous_no_text_revised.png",
      color: "#3b82f6", // Blue
      bgGradient: "from-blue-900/40 via-black to-black"
    },
    { 
      name: "EDIBLES", 
      route: "/edibles", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/Edibles_non-mush.png",
      color: "#f97316", // Orange
      bgGradient: "from-orange-900/40 via-black to-black"
    },
    { 
      name: "DOPE DEALS\nCLICK HERE", 
      route: "/#dope-deals", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/Close%20up%20and%20Right.png", // Keeping the image for now, or we can change it
      color: "#ef4444", // Red for Deals
      bgGradient: "from-red-900/40 via-black to-black"
    },
    { 
      name: "ACCESSORIES", 
      route: "/accessories", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Torch_Bowl.jpeg",
      color: "#9ca3af", // Gray
      bgGradient: "from-gray-800 via-gray-950 to-black"
    },
  ];

  const logoPath =
    "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/AdobeStock_1060112988.jpeg";

  return (
    // Lower z-index so dropdown menus can appear on top. Added margins properly.
    <div className="relative w-full px-0 pb-4 mt-4">
      
      {/* Mobile: Stack vertically with Grid */}
      <div className="block lg:hidden space-y-2">
        {/* Large hero image first on mobile */}
        <Link
          href="/ride-with-us"
          className="block w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg relative group active:scale-95 transition-all duration-300"
        >
          {/* Hero background - Rich Dark */}
          <div className="absolute inset-0 bg-neutral-900" />
          
          <img
            src={logoPath}
            alt="Highway 420"
            className="w-full h-full object-cover max-w-full mx-auto relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
          />
          {/* Decorative overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/30 transition-all duration-300 z-20" />
        </Link>

        {/* Categories in 3-column grid on mobile (Compact) */}
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={cat.route}
              className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md relative group active:scale-95 transition-all duration-300 block"
              style={{
                // Premium Radial Gradient Background to Replace "Solid Black"
                background: `radial-gradient(circle at center, ${cat.color}33 0%, #000000 100%)`, 
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              {/* Dynamic Border Glow (Border is actually inset shadow or border property) */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors z-20 pointer-events-none" />

              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-contain p-2 relative z-10 group-hover:scale-110 transition-transform duration-500 ease-out" 
              />
              
              {/* Text Visibility Gradient (Subtle at bottom) */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent z-10" />

              {/* Category Name Label - Scaled for Mobile */}
              <div className="absolute top-2 left-2 z-20 pointer-events-none">
                <div className="text-white text-[16px] xs:text-[20px] font-display-twilight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-widest">
                  {cat.name.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: Full-width grid layout */}
      <div className="hidden lg:block w-full">
        <div className="max-w-screen-2xl mx-auto px-2">
          {/* Main Grid: 4 Columns, Mosaic Layout */}
          {/* Using aspect-[5/3] approximates the desktop 85vh layout on a 16:9 screen while scaling down responsively */}
          <div className="grid grid-cols-4 gap-3 w-full aspect-[5/3]">
            
            {/* Hero Tile - Spans 2x2 */}
            <Link
              href="/ride-with-us"
              className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-2xl relative group hover:scale-[1.01] transition-transform duration-500 block"
            >
              <div className="absolute inset-0 bg-neutral-900" />
              <img 
                src={logoPath} 
                alt="Highway 420" 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" 
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500" />
              
              {/* Hero Text Overlay */}
              <div className="absolute bottom-8 left-8 z-30">
                 <h2 className="text-white font-display-twilight text-4xl tracking-widest drop-shadow-2xl">RIDE WITH US</h2>
                 <p className="text-gray-200 font-sans mt-2 tracking-wide text-sm uppercase">Be part of the movement</p>
              </div>
            </Link>

            {/* Category Tiles */}
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={cat.route}
                className="rounded-2xl overflow-hidden shadow-xl relative group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 block"
                style={{
                  // Dynamic Premium Background
                  background: `radial-gradient(circle at center, ${cat.color}40 0%, #050505 100%)`, 
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  // Dynamic Colored Glow on Hover - "AMAZING" Effect
                  e.currentTarget.style.boxShadow = `0 15px 30px -5px ${cat.color}66`; // 66 = 40% opacity
                }}
                onMouseLeave={(e) => {
                   e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Glassy Border */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors z-20 pointer-events-none" />

                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  // Object Contain enables the gradient to be seen nicely behind the cutout
                  className="w-full h-full object-contain p-6 relative z-10 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500 ease-out" 
                />
                
                {/* Text Visibility Gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-transparent z-10" />

                {/* Category Name Label - Top Left, Big Typography */}
                <div className="absolute top-6 left-6 z-20 pointer-events-none transition-all duration-300">
                  <div className={`text-white text-[32px] xl:text-[40px] font-display-twilight leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-[0.1em] shadow-black group-hover:text-[${cat.color}]`}>
                    {cat.name.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
                
                {/* Hover Flash Effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200 pointer-events-none z-10" />

              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
