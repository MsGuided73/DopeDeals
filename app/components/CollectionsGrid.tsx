"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Collection data ──────────────────────────────────────────────────────────
const COLLECTIONS = [
  {
    name: "Flower",
    label: "THCA Flower",
    route: "/thca_flower",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/FLOWER-prerollnBud.png",
    emoji: "🌿",
  },
  {
    name: "Pipes",
    label: "Hand Pipes",
    route: "/pipes",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/PIPES-Bubblers.jpeg",
    emoji: "🌊",
  },
  {
    name: "Vapes & Carts",
    label: "Vaporizers",
    route: "/vapes",
    image: "",
    emoji: "💨",
  },
  {
    name: "Edibles",
    label: "Edibles",
    route: "/edibles",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/CG-Edibles.png",
    emoji: "🍬",
  },
  {
    name: "Shrooms & More",
    label: "Mushrooms",
    route: "/mushrooms",
    image: "",
    emoji: "🍄",
  },
  {
    name: "Bongs",
    label: "Water Pipes",
    route: "/bongs",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/CG-RooRatSunset.png",
    emoji: "🔵",
  },
  {
    name: "Dab Rigs",
    label: "Dab Rigs",
    route: "/dabsntools",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/DabRig-withPhoneTech-NoWords.png",
    emoji: "🔥",
  },
  {
    name: "Accessories",
    label: "Accessories",
    route: "/accessories",
    image: "",
    emoji: "⚙️",
  },
  {
    name: "Bundles",
    label: "Popular Setups",
    route: "/bundles",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/Popular%20Setups.png",
    emoji: "🎁",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CollectionsGrid() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .cg-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #E8E8E8;
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s;
        }
        .cg-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.10);
          transform: translateY(-2px);
          border-color: #52C41A;
        }
        .cg-image {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: #F5F5F5;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cg-image img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s cubic-bezier(0.25,1,0.5,1);
        }
        .cg-card:hover .cg-image img {
          transform: scale(1.06);
        }
        .cg-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #F0F7EF;
        }
        .cg-placeholder-emoji {
          font-size: 36px;
          line-height: 1;
        }
        .cg-footer {
          padding: 10px 12px;
          border-top: 1px solid #F0F0F0;
          background: #ffffff;
        }
        .cg-label {
          font-family: 'Fira Sans', 'Inter', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6B6B6B;
          margin-bottom: 2px;
          display: block;
        }
        .cg-name {
          font-family: 'Fira Sans', 'Inter', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #2A2B2A;
          line-height: 1.2;
        }
        .cg-card:hover .cg-name {
          color: #52C41A;
        }
        .cg-arrow {
          margin-top: 2px;
          display: inline-block;
          font-size: 12px;
          color: #52C41A;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .cg-card:hover .cg-arrow {
          opacity: 1;
        }
      `}</style>

      <div id="collections-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {COLLECTIONS.map((col, i) => (
          <Link
            key={col.route}
            href={col.route}
            className="cg-card"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`Shop ${col.name}`}
          >
            {/* Image / Placeholder */}
            <div className="cg-image">
              {col.image ? (
                <img src={col.image} alt={col.name} loading="lazy" />
              ) : (
                <div className="cg-placeholder">
                  <span className="cg-placeholder-emoji">{col.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#52C41A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {col.label}
                  </span>
                </div>
              )}
            </div>

            {/* Footer label */}
            <div className="cg-footer">
              <span className="cg-label">{col.label}</span>
              <span className="cg-name">{col.name}</span>
              <span className="cg-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
