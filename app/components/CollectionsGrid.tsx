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
const RACK_FRAME: React.CSSProperties = {
  background: "linear-gradient(160deg, #1a1510 0%, #0e0b07 60%, #080602 100%)",
  border: "6px solid #1f1a13",
  borderBottom: "14px solid #0d0a06",
  borderRadius: "10px",
  padding: "14px 14px 6px",
  boxShadow: [
    "0 28px 64px rgba(0,0,0,0.95)",
    "0 10px 24px rgba(0,0,0,0.7)",
    "inset 0 1px 0 rgba(255,235,180,0.05)",
    "inset 0 -6px 12px rgba(0,0,0,0.6)",
  ].join(", "),
};

const RACK_FLOOR: React.CSSProperties = {
  marginTop: "8px",
  height: "5px",
  background: "linear-gradient(180deg, #12100c 0%, #08060200 100%)",
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
        className="hidden md:block mx-auto px-4 pb-10"
        style={{ maxWidth: "975px" }}
      >
        {/* Outer rack / equipment enclosure */}
        <div style={RACK_FRAME}>

          {/* 3 × 3 monitor grid */}
          <div
            className="grid grid-cols-3 grid-rows-3 gap-[10px]"
            style={{ height: "68vh", minHeight: "460px", maxHeight: "760px" }}
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
                              ? "brightness(1.18) saturate(1.12)"
                              : "brightness(0.88) saturate(0.85)",
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

                      {/* Bottom vignette for label legibility */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 35%, transparent 65%)",
                          pointerEvents: "none",
                          zIndex: 12,
                        }}
                      />

                      {/* Category label */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "8px 10px",
                          zIndex: 13,
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          style={{
                            height: "2px",
                            width: on ? "28px" : "14px",
                            borderRadius: "2px",
                            backgroundColor: col.accent,
                            marginBottom: "4px",
                            transition: "width 0.3s ease",
                          }}
                        />
                        <p
                          style={{
                            fontFamily: "'Oswald', system-ui, sans-serif",
                            fontWeight: 700,
                            fontSize: "clamp(10px, 1.05vw, 14px)",
                            letterSpacing: "0.11em",
                            color: "#fff",
                            textTransform: "uppercase",
                            textShadow: "0 1px 5px rgba(0,0,0,0.95)",
                          }}
                        >
                          {col.name}
                        </p>
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
