"use client";

import React from "react";

export default function CollectionsGrid() {
  const categories = [
    { name: "THCA FLOWER", route: "/thca_flower", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/THCA_flower.jpeg" },
    { name: "PRE-ROLLS", route: "/pre-rolls", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/brands/Cookies/cookies-thc-a-slim-pre-rolls-3-5g-5ct.webp" },
    { name: "THCA VAPES", route: "/thca_pnv", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/RUNTZ-3.5G-SINGLES.webp" },
    { name: "SHROOMS\n& STUFF", route: "/mushrooms", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Shrooms.jpg" },
    { name: "KRATOM\n& 7-OH", route: "/7-hydroxymitragynine", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Torch_Bowl.jpeg" },
    { name: "EDIBLES\n& MORE", route: "/edibles", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Torch_Bowl.jpeg" },
    { name: "N2O", route: "/nitrous-oxide", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Torch_Bowl.jpeg" },
    { name: "ACCESSORIES", route: "/accessories", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Torch_Bowl.jpeg" },
  ];

  const logoPath =
    "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/AdobeStock_1060112988.jpeg";

  return (
    // Lower z-index so dropdown menus can appear on top
    <div className="relative w-full px-0 pb-4" style={{ marginTop: '15px' }}>
      {/* Mobile: Stack vertically */}
      <div className="block lg:hidden space-y-2">
        {/* Large hero image first on mobile */}
        <a
          href="/ride-with-us"
          className="block w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg relative group hover:scale-105 transition-transform duration-300 bg-black"
        >
          <img
            src={logoPath}
            alt="Highway 420"
            className="w-full h-full object-contain max-w-[90%] max-h-[90%] mx-auto"
          />
          {/* Decorative overlay — never capture clicks */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-black/50 group-hover:to-transparent transition-all duration-300" />
        </a>

        {/* Categories in 2-column grid on mobile */}
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat, i) => (
            <a
              key={i}
              href={cat.route}
              className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md relative group hover:scale-101 transition-all duration-300 block"
              style={{
                boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 20px 5px rgba(34, 197, 94, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 0 rgba(34, 197, 94, 0.7)";
              }}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />

              {/* SHOP Button - Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <button
                  className="bg-transparent text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-gray-800 transition-colors opacity-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = cat.route;
                  }}
                >
                  {cat.route === '/thca_pnv' ? 'VAPES' : 'SHOP'}
                </button>
              </div>

              {/* Category Name Label - Bottom Center */}
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <div className="bg-black/70 backdrop-blur-sm px-3 py-2 text-center">
                  <div className="text-white text-lg font-display-juicy-fills leading-tight">
                    {cat.name.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dimmer overlay — non-interactive */}
              <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />

            </a>
          ))}
        </div>
      </div>

      {/* Desktop: Full-width grid layout */}
      <div className="hidden lg:block w-full">
        <div className="max-w-screen-2xl mx-auto px-2">
          <div className="grid grid-cols-4 gap-2 h-[90vh] w-full">
          <a
            href="/ride-with-us"
            className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg relative group transition-transform duration-300 block bg-black"
          >
            <img src={logoPath} alt="Highway 420" className="w-full h-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-black/50 group-hover:to-transparent transition-all duration-300" />
          </a>

          {categories.map((cat, i) => (
            <a
              key={i}
              href={cat.route}
              className="rounded-2xl overflow-hidden shadow-md relative group hover:scale-101 transition-all duration-300 block"
              style={{
                boxShadow: "0 0 0 0 rgba(29, 192, 35, 0.7)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px 5px rgba(34, 197, 94, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 0 0 rgba(34, 197, 94, 0.7)";
              }}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />

              {/* SHOP Button - Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <button
                  className="bg-transparent text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 transition-colors opacity-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = cat.route;
                  }}
                >
                  {cat.route === '/thca_pnv' ? 'VAPES' : 'SHOP'}
                </button>
              </div>

              {/* Category Name Label - Bottom Center */}
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <div className="bg-black/70 backdrop-blur-sm px-3 py-2 text-center">
                  <div className="text-white text-lg font-display-juicy-fills leading-tight">
                    {cat.name.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

            </a>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
