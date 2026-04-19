"use client";

/**
 * MOCKUP — Pit Stop / Dab Rigs Collection Page
 *
 * Layout iteration playground. Hardcoded placeholder products so the page
 * renders without API calls. Once layout is locked, swap mock data for the
 * real /api/products?category=dab-rigs feed and merge into ../page.tsx.
 *
 * Visit: /dabsntools/mockup
 */

import { useState } from "react";
import Link from "next/link";
import GlobalMasthead from "../../components/GlobalMasthead";

/* ──────────────────────────────────────────────────────────
   Mock product data
   ────────────────────────────────────────────────────────── */
type MockProduct = {
  id: string;
  brand: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  joint: string;            // shield tool-tag (e.g., "14mm", "18mm", "E-RIG", "MINI")
  type: "GLASS" | "SILICONE" | "E-RIGS" | "MINI" | "COLLECTOR";
  isHot?: boolean;
};

const MOCK_PRODUCTS: MockProduct[] = [
  { id: "1", brand: "ROOR", name: "Beaker Base Dab Rig 8\"", price: 189, comparePrice: 229, image: "https://placehold.co/400x400/eaeaea/666?text=ROOR+8\"", joint: "14mm", type: "GLASS", isHot: true },
  { id: "2", brand: "Puffco", name: "Peak Pro Smart Rig", price: 399, image: "https://placehold.co/400x400/eaeaea/666?text=Puffco+Peak", joint: "E-RIG", type: "E-RIGS", isHot: true },
  { id: "3", brand: "Eyce", name: "Silicone Mini Beaker", price: 49, image: "https://placehold.co/400x400/eaeaea/666?text=Eyce+Mini", joint: "10mm", type: "SILICONE" },
  { id: "4", brand: "MJ Arsenal", name: "Martian Mini Rig", price: 89, image: "https://placehold.co/400x400/eaeaea/666?text=MJ+Martian", joint: "10mm", type: "MINI" },
  { id: "5", brand: "Grav Labs", name: "Helix Recycler", price: 145, image: "https://placehold.co/400x400/eaeaea/666?text=Grav+Helix", joint: "14mm", type: "GLASS" },
  { id: "6", brand: "Dr. Dabber", name: "Boost Evo E-Rig", price: 299, comparePrice: 349, image: "https://placehold.co/400x400/eaeaea/666?text=Boost+Evo", joint: "E-RIG", type: "E-RIGS" },
  { id: "7", brand: "Empire Glassworks", name: "Pineapple Mini Rig", price: 219, image: "https://placehold.co/400x400/eaeaea/666?text=Empire+Pineapple", joint: "14mm", type: "COLLECTOR" },
  { id: "8", brand: "Stundenglass", name: "Kompact Gravity Rig", price: 449, image: "https://placehold.co/400x400/eaeaea/666?text=Stundenglass", joint: "18mm", type: "COLLECTOR", isHot: true },
];

const FILTERS = ["ALL", "GLASS", "SILICONE", "E-RIGS", "MINI", "COLLECTOR"] as const;
const SORTS = ["FEATURED", "PRICE: LOW", "PRICE: HIGH", "NEWEST"] as const;

const AMBER = "#e8920a";
const SHIELD_GREEN = "rgba(22,100,50,0.9)";

/* ──────────────────────────────────────────────────────────
   Shield tool-tag (uses the green highway shield motif)
   ────────────────────────────────────────────────────────── */
function ToolTag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(22,100,50,0.45)",
        borderRadius: "999px",
        padding: "3px 9px 3px 6px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: SHIELD_GREEN,
        whiteSpace: "nowrap",
      }}
    >
      <svg width="11" height="13" viewBox="0 0 14 16" fill="none" aria-hidden>
        <path d="M7 0.5L1 2.5V8C1 11.5 3.8 14.6 7 15.5C10.2 14.6 13 11.5 13 8V2.5L7 0.5Z" stroke={SHIELD_GREEN} strokeWidth="1.2" fill="rgba(22,100,50,0.08)" />
      </svg>
      {label}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   Product card (mirrors FeaturedProductsSection's "Open Road" card)
   ────────────────────────────────────────────────────────── */
function ProductCard({ product }: { product: MockProduct }) {
  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
    transition: "box-shadow 0.3s, transform 0.3s",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div className="group" style={cardStyle}>
      {/* amber speed stripe */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${AMBER}, #f4ab2e)` }} />

      {/* image area */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "1", background: "white", overflow: "hidden" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px", transition: "transform 0.3s" }} className="group-hover:scale-105" />

        {/* HOT badge */}
        {product.isHot && (
          <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 10, background: AMBER, color: "white", fontSize: "10px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", padding: "3px 8px", letterSpacing: "0.1em" }}>
            🔥 HOT
          </div>
        )}

        {/* tool-tag (joint size / type) — bottom-right corner */}
        <div style={{ position: "absolute", bottom: "10px", right: "10px", zIndex: 10 }}>
          <ToolTag label={product.joint} />
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: AMBER, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
          {product.brand}
        </p>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#1e1e1e", fontSize: "14px", lineHeight: 1.35, marginBottom: "10px" }} className="line-clamp-2">
          {product.name}
        </h3>

        {/* price */}
        <div style={{ marginBottom: "12px" }}>
          {product.comparePrice ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#999", textDecoration: "line-through" }}>${product.comparePrice.toFixed(2)}</span>
                <span style={{ background: "#fef2e0", color: AMBER, padding: "2px 6px", fontSize: "10px", fontWeight: 700 }}>
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </span>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "22px", color: AMBER }}>${product.price.toFixed(2)}</div>
            </div>
          ) : (
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "22px", color: AMBER }}>${product.price.toFixed(2)}</div>
          )}
        </div>

        {/* buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          <button style={{ flex: 1, background: AMBER, color: "white", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.06em", padding: "10px 4px", border: "none", cursor: "pointer", textTransform: "uppercase" }} className="hover:opacity-90">
            Add to Cart
          </button>
          <button style={{ flex: 1, border: `1.5px solid ${AMBER}`, color: AMBER, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.06em", padding: "9px 4px", background: "transparent", textTransform: "uppercase", cursor: "pointer" }} className="hover:bg-[#e8920a] hover:text-white">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────── */
export default function PitStopMockupPage() {
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>("ALL");
  const [activeSort, setActiveSort] = useState<typeof SORTS[number]>("FEATURED");

  const visibleProducts = activeFilter === "ALL"
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.type === activeFilter);

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0B" }}>
      <GlobalMasthead />

      {/* ── HERO BAND ───────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #2d2622 0%, #5a4a3a 55%, #a07a4a 100%)",
          padding: "72px 16px 88px",
          overflow: "hidden",
        }}
      >
        {/* dashed amber road stripe down the center (ambient) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "2px",
            background: "repeating-linear-gradient(180deg, #e8920a 0px, #e8920a 16px, transparent 16px, transparent 32px)",
            opacity: 0.18,
            transform: "translateX(-50%)",
          }}
        />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* breadcrumb */}
          <nav style={{ marginBottom: "32px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-white">Home</Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <Link href="/collections" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-white">Collections</Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: AMBER }}>Dab Rigs</span>
          </nav>

          {/* amber rule */}
          <div style={{ height: "3px", width: "48px", background: AMBER, marginBottom: "18px" }} />

          {/* eyebrow */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700, color: AMBER, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "10px" }}>
            Gear Up For The Haul · Mile 420
          </p>

          {/* title */}
          <h1 style={{ fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif", color: "#fff", fontSize: "clamp(56px, 9vw, 120px)", lineHeight: 0.95, letterSpacing: "0.04em", margin: "0 0 18px", textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
            PIT STOP — DABS &amp; TOOLS
          </h1>

          {/* blurb */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.6, color: "rgba(255,255,255,0.78)", maxWidth: "620px" }}>
            Premium glass, e-rigs, and concentrate tools — all road-tested, all stocked with COAs.
            Pull in, fuel up, and get back on the highway.
          </p>

          {/* dashed divider */}
          <div style={{ borderTop: "1px dashed rgba(232,146,10,0.35)", marginTop: "32px", maxWidth: "360px" }} />
        </div>
      </section>

      {/* ── STICKY FILTER RAIL ──────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(13,13,11,0.92)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(232,146,10,0.18)",
          padding: "14px 16px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* fuel-grade label */}
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 800, color: AMBER, letterSpacing: "0.25em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Fuel Grade:
          </span>

          {/* chips */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 }}>
            {FILTERS.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    border: `1.5px solid ${AMBER}`,
                    background: active ? AMBER : "transparent",
                    color: active ? "#0D0D0B" : AMBER,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Sort:
            </span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as typeof SORTS[number])}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 12px",
                background: "transparent",
                color: AMBER,
                border: `1.5px solid ${AMBER}`,
                borderRadius: "999px",
                cursor: "pointer",
              }}
            >
              {SORTS.map((sort) => (
                <option key={sort} value={sort} style={{ background: "#0D0D0B", color: AMBER }}>{sort}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(180deg, #a07a4a 0%, #5a4a3a 30%, #2d2622 100%)",
          padding: "56px 16px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* dashed amber road stripe down center */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "2px",
            background: "repeating-linear-gradient(180deg, #e8920a 0px, #e8920a 16px, transparent 16px, transparent 32px)",
            opacity: 0.18,
            transform: "translateX(-50%)",
          }}
        />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* result count */}
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "24px" }}>
            Showing <span style={{ color: "#fff", fontWeight: 700 }}>{visibleProducts.length}</span> of {MOCK_PRODUCTS.length} {activeFilter !== "ALL" ? `· ${activeFilter}` : ""}
          </div>

          {/* grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* load more */}
          <div style={{ textAlign: "center", marginTop: "56px" }}>
            <button
              style={{
                background: AMBER,
                color: "#0D0D0B",
                fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif",
                fontSize: "20px",
                letterSpacing: "0.12em",
                padding: "14px 56px",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              className="hover:opacity-90"
            >
              LOAD MORE →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
