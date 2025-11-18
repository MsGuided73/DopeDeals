"use client";

import React from "react";

export default function CollectionsGrid() {
  const categories = [
    { name: "LEGAL\nTHCA FLOWER", route: "/thca_flower", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/THCA_flower.jpeg" },
    { name: "SHROOMS & STUFF", route: "/mushrooms", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Shrooms.jpg" },
    { name: "THCA VAPES", route: "/thca_pnv", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/RUNTZ-3.5G-SINGLES.webp" },
    { name: "BONGS", route: "/bongs", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/RooR_6-bongs.png" },
    { name: "HAND PIPES", route: "/pipes", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/hand_pipes.jpg" },
    { name: "DAB-RIGS & TOOLS", route: "/dabsntools", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Puffco_Zoom.png" },
    { name: "ACCESSORIES", route: "/accessories", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Torch_Bowl.jpeg" },
    { name: "HOOKAHS", route: "/hookahs", image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Hookah.jpeg" },
  ];

  const logoPath =
    "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/puffco_ad3.jpg";

  return (
    // Lower z-index so dropdown menus can appear on top
    <div className="relative w-full px-2 pb-4" style={{ marginTop: '15px' }}>
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
                  className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-gray-800 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = cat.route;
                  }}
                >
                  {cat.route === '/thca_pnv' ? 'VAPES' : 'SHOP'}
                </button>
              </div>

              {/* Dimmer overlay — non-interactive */}
              <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
              {/* Title layer — non-interactive */}
              <div className="absolute inset-0 flex items-end justify-start p-2 z-10 pointer-events-none">
                <div className="bg-black/20 rounded-xl px-3 py-2">
                  <h1
                    className="text-white text-base sm:text-lg font-bold text-left leading-tight whitespace-pre-line"
                    style={{
                      fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                      textShadow:
                        "2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5)",
                      fontWeight: "normal",
                    }}
                  >
                    {cat.name}
                  </h1>
                </div>
              </div>

            </a>
          ))}
        </div>
      </div>

      {/* Desktop: Full-width grid layout */}
      <div className="hidden lg:block w-full">
        <div className="max-w-7xl mx-auto px-4">
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
                  className="bg-black text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = cat.route;
                  }}
                >
                  {cat.route === '/thca_pnv' ? 'VAPES' : 'SHOP'}
                </button>
              </div>

              <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute inset-0 flex items-end justify-start p-2 z-10 pointer-events-none">
                <div className="bg-black/30 rounded-lg px-3 py-2">
                  <h1
                    className="text-white text-xl xl:text-2xl 2xl:text-3xl font-bold text-left leading-tight whitespace-pre-line"
                    style={{
                      fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                      textShadow:
                        "2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5)",
                      fontWeight: "normal",
                    }}
                  >
                    {cat.name}
                  </h1>
                </div>
              </div>

            </a>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
