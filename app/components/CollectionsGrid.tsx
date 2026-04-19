"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Collection data ──────────────────────────────────────────────────────────
const COLLECTIONS = [
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
    image: "",
    accent: "#06b6d4",
  },
  {
    name: "EDIBLES",
    route: "/edibles",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/CG-Edibles.png",
    accent: "#f97316",
  },
  {
    name: "MUSHROOMS",
    route: "/mushrooms",
    image: "",
    accent: "#a855f7",
  },
  {
    name: "BONGS",
    route: "/bongs",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/CG-RooRatSunset.png",
    accent: "#3b82f6",
  },
  {
    name: "DAB RIGS",
    route: "/dabsntools",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Carousel-LP/Products/CG_ProdCard-Dab%20Rig.png",
    accent: "#14b8a6",
  },
  {
    name: "ACCESSORIES",
    route: "/accessories",
    image: "",
    accent: "#ec4899",
  },
  {
    name: "BUNDLES",
    route: "/bundles",
    image: "",
    accent: "#C5A059",
  },
];

// ─── Shared style blocks ──────────────────────────────────────────────────────
const WOOD_TEXTURE_1 =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Textures/WoodGrain1.png";
const WOOD_TEXTURE_2 =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Textures/WoodGrain2.png";

const RACK_FRAME: React.CSSProperties = {
  // Wood-grain panel with ambient lighting:
  // 1) warm overhead "spotlight" radial that warms up the top-center of the wood
  // 2) very light directional shade (top-bright → bottom-darker) for depth
  // 3) WoodGrain1 texture as the actual material
  backgroundImage: [
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 200, 120, 0.28) 0%, rgba(255, 170, 80, 0.12) 35%, transparent 70%)",
    "linear-gradient(180deg, rgba(255, 220, 170, 0.06) 0%, rgba(0, 0, 0, 0.12) 55%, rgba(0, 0, 0, 0.40) 100%)",
    `url('${WOOD_TEXTURE_1}')`,
  ].join(", "),
  backgroundSize: "cover, cover, cover",
  backgroundPosition: "center, center, center",
  backgroundRepeat: "no-repeat, no-repeat, no-repeat",
  border: "6px solid #2a1d10",
  borderBottom: "14px solid #1a1108",
  borderRadius: "10px",
  padding: "14px 14px 6px",
  boxShadow: [
    // Outer drop shadows (depth)
    "0 28px 64px rgba(0,0,0,0.92)",
    "0 10px 24px rgba(0,0,0,0.65)",
    // Warm rim lighting on the inside edges
    "inset 0 2px 0 rgba(255, 220, 165, 0.22)",      // top edge highlight (warm)
    "inset 1px 0 0 rgba(255, 210, 155, 0.10)",      // left rim light
    "inset -1px 0 0 rgba(255, 210, 155, 0.10)",     // right rim light
    "inset 0 -10px 22px rgba(60, 30, 8, 0.45)",     // soft warm-brown bottom shade
  ].join(", "),
};

const RACK_FLOOR: React.CSSProperties = {
  marginTop: "8px",
  height: "5px",
  backgroundImage: [
    "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
    `url('${WOOD_TEXTURE_2}')`,
  ].join(", "),
  backgroundSize: "cover, cover",
  backgroundPosition: "center, center",
  backgroundRepeat: "no-repeat, no-repeat",
  borderRadius: "3px",
  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.9)",
};

function monitorStyle(isHovered: boolean, accent: string): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: isHovered
      ? "linear-gradient(145deg, #2a2a30 0%, #1e1e24 100%)"
      : "linear-gradient(145deg, #22222a 0%, #181820 100%)",
    borderRadius: "7px",
    padding: "7px 7px 0 7px",
    boxShadow: isHovered
      ? [
          "inset 0 1px 0 rgba(255,255,255,0.10)",
          "inset 0 -1px 0 rgba(0,0,0,0.6)",
          "0 14px 36px rgba(0,0,0,0.85)",
          `0 0 26px -6px ${accent}50`,
          "0 0 0 1px rgba(255,255,255,0.07)",
        ].join(", ")
      : [
          "inset 0 1px 0 rgba(255,255,255,0.06)",
          "inset 0 -1px 0 rgba(0,0,0,0.55)",
          "0 6px 20px rgba(0,0,0,0.75)",
          "0 0 0 1px rgba(255,255,255,0.03)",
        ].join(", "),
    transition:
      "box-shadow 0.35s ease, background 0.35s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)",
    transform: isHovered ? "translateY(-3px) scale(1.015)" : "translateY(0) scale(1)",
  };
}

function screenFaceStyle(isHovered: boolean, accent: string): React.CSSProperties {
  return {
    flex: 1,
    position: "relative",
    borderRadius: "4px",
    overflow: "hidden",
    background: "#000",
    boxShadow: isHovered
      ? `inset 0 0 50px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 12px -3px ${accent}30`
      : "inset 0 0 60px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(0,0,0,0.9)",
    transition: "box-shadow 0.35s ease",
  };
}

const CHIN_STYLE: React.CSSProperties = {
  height: "18px",
  flexShrink: 0,
  background: "linear-gradient(180deg, #141418 0%, #0f0f13 100%)",
  borderRadius: "0 0 5px 5px",
  borderTop: "1px solid rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  paddingLeft: "9px",
  gap: "6px",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CollectionsGrid() {
  const rackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // Staggered entrance animation
  useEffect(() => {
    const units = rackRef.current?.querySelectorAll<HTMLElement>(".monitor-unit");
    if (!units?.length) return;

    units.forEach((u) => {
      u.style.opacity = "0";
      u.style.transform = "translateY(60px) scale(0.93)";
      u.style.transition = "none";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        units.forEach((u, i) =>
          setTimeout(() => {
            u.style.transition =
              "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)";
            u.style.opacity = "1";
            u.style.transform = "translateY(0) scale(1)";
          }, i * 110)
        );
      },
      { threshold: 0.05 }
    );

    if (rackRef.current) observer.observe(rackRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="collections-grid" style={{ scrollMarginTop: "90px", width: "100%" }}>

      {/* ── DESKTOP: Monitor bank ─────────────────────────────────────────── */}
      <div
        ref={rackRef}
        className="hidden md:block mx-auto px-6 pb-10"
        style={{ maxWidth: "min(75vw, 1600px)", width: "100%" }}
      >
        {/* Outer rack / equipment enclosure */}
        <div style={RACK_FRAME}>

          {/* 3 × 3 monitor grid */}
          <div
            className="grid grid-cols-3 grid-rows-3 gap-[10px]"
            style={{ height: "80vh", minHeight: "600px", maxHeight: "1000px" }}
          >
            {COLLECTIONS.map((col, i) => {
              const on = hovered === i;
              return (
                <Link
                  key={i}
                  href={col.route}
                  className="monitor-unit block"
                  style={{ textDecoration: "none" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Monitor housing */}
                  <div style={monitorStyle(on, col.accent)}>

                    {/* Screen face */}
                    <div style={screenFaceStyle(on, col.accent)}>

                      {/* Product image */}
                      {col.image ? (
                        <img
                          src={col.image}
                          alt={col.name}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition:
                              "transform 0.55s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease",
                            transform: on ? "scale(1.06)" : "scale(1)",
                            filter: on
                              ? "brightness(1.10) saturate(1.08)"
                              : "none",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `1px dashed ${col.accent}35`,
                          }}
                        >
                          <span
                            style={{
                              color: col.accent,
                              opacity: 0.28,
                              fontSize: "10px",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              fontFamily: "Oswald, sans-serif",
                            }}
                          >
                            Coming Soon
                          </span>
                        </div>
                      )}

                      {/* CRT scanlines (very subtle) */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage:
                            "repeating-linear-gradient(0deg, rgba(0,0,0,0.045) 0px, rgba(0,0,0,0.045) 1px, transparent 1px, transparent 3px)",
                          pointerEvents: "none",
                          zIndex: 10,
                          transition: "opacity 0.35s ease",
                          opacity: on ? 0.45 : 1,
                        }}
                      />

                      {/* Screen glass glare */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(130deg, rgba(255,255,255,0.055) 0%, transparent 40%)",
                          pointerEvents: "none",
                          zIndex: 11,
                        }}
                      />

                      {/* Top vignette for label legibility */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 35%, transparent 65%)",
                          pointerEvents: "none",
                          zIndex: 12,
                        }}
                      />

                      {/* Category label — upper-left, BebasNeue Extra Bold */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          padding: "12px 14px",
                          zIndex: 13,
                          pointerEvents: "none",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif",
                            fontWeight: 900,
                            fontSize: "clamp(18px, 1.8vw, 28px)",
                            lineHeight: 1,
                            letterSpacing: "0.06em",
                            color: "#fff",
                            textTransform: "uppercase",
                            margin: 0,
                            textShadow:
                              "0 2px 6px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.55)",
                          }}
                        >
                          {col.name}
                        </p>
                        <div
                          style={{
                            height: "2px",
                            width: on ? "36px" : "22px",
                            borderRadius: "2px",
                            backgroundColor: col.accent,
                            marginTop: "5px",
                            transition: "width 0.3s ease",
                            boxShadow: on ? `0 0 10px ${col.accent}` : "none",
                          }}
                        />
                      </div>

                      {/* Accent inner glow when hovered (screen emission) */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          boxShadow: on
                            ? `inset 0 0 50px ${col.accent}22`
                            : "none",
                          pointerEvents: "none",
                          zIndex: 14,
                          transition: "box-shadow 0.4s ease",
                        }}
                      />
                    </div>{/* /screen face */}

                    {/* Monitor chin / chassis strip */}
                    <div style={CHIN_STYLE}>
                      {/* Power LED */}
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          backgroundColor: col.accent,
                          boxShadow: on
                            ? `0 0 10px 2px ${col.accent}`
                            : `0 0 4px 0px ${col.accent}`,
                          transition: "box-shadow 0.3s ease",
                        }}
                      />
                    </div>

                  </div>{/* /monitor housing */}
                </Link>
              );
            })}
          </div>

          {/* Rack base rail */}
          <div style={RACK_FLOOR} />
        </div>
      </div>

      {/* ── MOBILE: 2-col screen stack ────────────────────────────────────── */}
      <div
        className="md:hidden grid grid-cols-2 gap-3 px-4 pb-8"
        style={{ maxWidth: "540px", margin: "0 auto" }}
      >
        {COLLECTIONS.map((col, i) => (
          <Link
            key={i}
            href={col.route}
            className="cg-card block"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "linear-gradient(145deg, #22222a 0%, #181820 100%)",
                borderRadius: "8px",
                padding: "6px 6px 0 6px",
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.07)",
                  "0 4px 16px rgba(0,0,0,0.7)",
                ].join(", "),
              }}
            >
              {/* Mobile screen */}
              <div
                style={{
                  borderRadius: "3px",
                  overflow: "hidden",
                  position: "relative",
                  height: "42vw",
                  maxHeight: "200px",
                  background: "#000",
                  flexShrink: 0,
                }}
              >
                {col.image ? (
                  <img
                    src={col.image}
                    alt={col.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.9)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px dashed ${col.accent}30`,
                    }}
                  >
                    <span
                      style={{
                        color: col.accent,
                        opacity: 0.25,
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontFamily: "Oswald, sans-serif",
                      }}
                    >
                      Coming
                    </span>
                  </div>
                )}
                {/* Scanlines */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                {/* Bottom vignette */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 55%)",
                    pointerEvents: "none",
                    zIndex: 3,
                  }}
                />
                {/* Label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "5px 8px",
                    zIndex: 4,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      height: "2px",
                      width: "12px",
                      borderRadius: "2px",
                      backgroundColor: col.accent,
                      marginBottom: "3px",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Oswald', system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                      letterSpacing: "0.10em",
                      color: "#fff",
                      textTransform: "uppercase",
                      textShadow: "0 1px 4px rgba(0,0,0,0.95)",
                    }}
                  >
                    {col.name}
                  </p>
                </div>
              </div>

              {/* Mobile chin */}
              <div
                style={{
                  height: "16px",
                  background: "linear-gradient(180deg, #141418 0%, #0f0f13 100%)",
                  borderRadius: "0 0 4px 4px",
                  borderTop: "1px solid rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "8px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: col.accent,
                    boxShadow: `0 0 4px ${col.accent}`,
                  }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
