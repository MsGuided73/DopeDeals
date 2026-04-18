"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// ─── 9-card grid data — swap image URLs when assets arrive ───────────────────
const COLLECTIONS = [
  // Row 1
  {
    name: "FLOWER",
    route: "/thca_flower",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/FLOWER-prerollnBud.png",
    accent: "#10b981",
  },
  {
    name: "PIPES",
    route: "/pipes",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/PIPES-Bubblers.jpeg",
    accent: "#f59e0b",
  },
  {
    name: "VAPES & CARTS",
    route: "/vapes",
    image: "", // TODO: replace with new image URL
    accent: "#06b6d4",
  },
  // Row 2
  {
    name: "EDIBLES",
    route: "/edibles",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/CG-Edibles.png",
    accent: "#f97316",
  },
  {
    name: "MUSHROOMS",
    route: "/mushrooms",
    image: "", // TODO: replace with new image URL
    accent: "#a855f7",
  },
  {
    name: "BONGS",
    route: "/bongs",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/CG-RooRatSunset.png",
    accent: "#3b82f6",
  },
  // Row 3
  {
    name: "DAB RIGS",
    route: "/dabsntools",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Products/CG_ProdCard-Dab%20Rig.png",
    accent: "#14b8a6",
  },
  {
    name: "ACCESSORIES",
    route: "/accessories",
    image: "", // TODO: replace with new image URL
    accent: "#ec4899",
  },
  {
    name: "DEALS",
    route: "/#dope-deals",
    image: "", // TODO: replace with new image URL
    accent: "#ef4444",
  },
];

export default function CollectionsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.cg-card');
    if (!cards?.length) return;

    // Start all cards invisible + shifted down + slightly scaled
    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(70px) scale(0.96)';
      card.style.transition = 'none';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        // Stagger each card — 120ms apart so the wave reads clearly
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, i * 120);
        });
      },
      { threshold: 0.08 }
    );

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="collections-grid" ref={gridRef} className="w-full px-3 md:px-6 pb-8">
      {/* Desktop: fixed-height 3×3 grid — all 9 cards visible without scrolling */}
      <div
        className="hidden md:grid grid-cols-3 grid-rows-3 gap-3"
        style={{ height: 'calc(100vh - 85px)', minHeight: '615px', maxHeight: '1035px' }}
      >
        {COLLECTIONS.map((col, i) => (
          <Link
            key={i}
            href={col.route}
            className="cg-card group relative h-full rounded-2xl overflow-hidden shadow-xl block"
            style={{
              background: col.image
                ? undefined
                : `linear-gradient(145deg, #1c1c1c 0%, #111 60%, #0a0a0a 100%)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 20px 40px -8px ${col.accent}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
            }}
          >
            {/* Background image (or placeholder) */}
            {col.image ? (
              <img
                src={col.image}
                alt={col.name}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              /* Placeholder while awaiting images */
              <div
                className="absolute inset-0 flex items-center justify-center opacity-10"
                style={{ border: `2px dashed ${col.accent}` }}
              >
                <span className="text-white text-xs uppercase tracking-widest">
                  Image coming
                </span>
              </div>
            )}

            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/55" />

            {/* Accent border flash on hover */}
            <div
              className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-all duration-300 pointer-events-none"
            />

            {/* Label */}
            <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 z-10 pointer-events-none">
              {/* Accent bar */}
              <div
                className="h-[3px] w-6 rounded-full mb-2 transition-all duration-300 group-hover:w-10"
                style={{ backgroundColor: col.accent }}
              />
              <p
                className="text-white font-bold uppercase tracking-[0.12em] text-base md:text-lg leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                style={{ fontFamily: "'Oswald', system-ui, sans-serif" }}
              >
                {col.name}
              </p>
            </div>

            {/* Hover lift — handled by shadow onMouse above, subtle scale below */}
            <div className="absolute inset-0 transition-transform duration-300 group-hover:-translate-y-0.5 pointer-events-none" />
          </Link>
        ))}
      </div>

      {/* Mobile: simple scrollable 1-col stack */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {COLLECTIONS.map((col, i) => (
          <Link
            key={i}
            href={col.route}
            className="cg-card group relative rounded-2xl overflow-hidden shadow-xl block"
            style={{
              height: 'calc(44vw + 25px)',
              background: col.image
                ? undefined
                : `linear-gradient(145deg, #1c1c1c 0%, #111 60%, #0a0a0a 100%)`,
            }}
          >
            {col.image ? (
              <img
                src={col.image}
                alt={col.name}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-10" style={{ border: `2px dashed ${col.accent}` }}>
                <span className="text-white text-xs uppercase tracking-widest">Image coming</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 p-4 z-10 pointer-events-none">
              <div className="h-[3px] w-6 rounded-full mb-2" style={{ backgroundColor: col.accent }} />
              <p className="text-white font-bold uppercase tracking-[0.12em] text-base leading-tight" style={{ fontFamily: "'Oswald', system-ui, sans-serif" }}>
                {col.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
