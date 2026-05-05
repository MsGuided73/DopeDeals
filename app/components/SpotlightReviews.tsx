"use client";

import { useState, useEffect, useCallback } from "react";

/* ──────────────────────────────────────────────────────────
   Review data
   ────────────────────────────────────────────────────────── */
const reviews = [
  {
    id: 1,
    name: "Mike J.",
    state: "California",
    quote:
      "The THCA flower is absolutely great. Order arrived within days — completely discreet. COA was right there on the product page. This is how it should be.",
    stars: 5,
  },
  {
    id: 2,
    name: "Sarah C.",
    state: "Texas",
    quote:
      "Love my new bong from ROOR! Taking it on a Joshua Tree trip this weekend and will be sharing some pics. The pricing and service from you guys is the best in the biz! Thanks!!",
    stars: 5,
  },
  {
    id: 3,
    name: "Alex R.",
    state: "Colorado",
    quote:
      "Tried the THCA disposable and was blown away by the quality. Smooth, consistent, and the price beat everywhere else I looked. Already placed my second order.",
    stars: 5,
  },
  {
    id: 4,
    name: "Emma W.",
    state: "Florida",
    quote:
      "Had a question about the THCA prerolls and they responded in under an hour. Packaging was perfectly discreet. The prerolls themselves are killer — 5 stars all day.",
    stars: 5,
  },
  {
    id: 5,
    name: "David K.",
    state: "New York",
    quote:
      "Finally a site that shows real COAs for everything. The THCA edibles are potent and consistent batch after batch. Ordered three times — never been disappointed.",
    stars: 5,
  },
  {
    id: 6,
    name: "Jessica T.",
    state: "Washington",
    quote:
      "Got the concentrate cart and THCA gummies in one order, free shipping kicked in, arrived in 3 days, and the cart hits perfectly. Highway 420 is the real deal.",
    stars: 5,
  },
];

const N = reviews.length;
function mod(n: number, m: number) { return ((n % m) + m) % m; }

/* ──────────────────────────────────────────────────────────
   Verified Rider badge (shield icon + outlined pill)
   ────────────────────────────────────────────────────────── */
function VerifiedBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        border: "1px solid rgba(22,100,50,0.55)",
        borderRadius: "999px",
        padding: "3px 10px 3px 7px",
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(22,100,50,0.9)",
        whiteSpace: "nowrap",
      }}
    >
      {/* Highway shield SVG */}
      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
        <path
          d="M7 0.5L1 2.5V8C1 11.5 3.8 14.6 7 15.5C10.2 14.6 13 11.5 13 8V2.5L7 0.5Z"
          stroke="rgba(22,100,50,0.8)"
          strokeWidth="1.2"
          fill="rgba(22,100,50,0.08)"
        />
        <text
          x="7"
          y="10"
          textAnchor="middle"
          fontSize="5.5"
          fontWeight="bold"
          fill="rgba(22,100,50,0.9)"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0"
        >
          420
        </text>
      </svg>
      Verified Rider
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   Star row
   ────────────────────────────────────────────────────────── */
function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="17" height="17" viewBox="0 0 17 17" fill="none">
          <path
            d="M8.5 1L10.52 6.26H16.18L11.63 9.54L13.45 14.94L8.5 11.86L3.55 14.94L5.37 9.54L0.82 6.26H6.48L8.5 1Z"
            fill="#C4942A"
            stroke="#C4942A"
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Single review column (no card background — transparent over photo)
   ────────────────────────────────────────────────────────── */
function ReviewCol({ review, visible }: { review: typeof reviews[0]; visible: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "0 32px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.45s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <StarRow count={review.stars} />

      <blockquote
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: "17px",
          fontStyle: "italic",
          fontWeight: 700,
          lineHeight: 1.65,
          color: "rgba(10,14,20,0.95)",
          marginBottom: "20px",
          minHeight: "100px",
        }}
      >
        &ldquo;{review.quote}&rdquo;
      </blockquote>

      {/* Horizontal rule */}
      <div
        style={{
          height: "1px",
          background: "rgba(10,14,20,0.18)",
          marginBottom: "14px",
        }}
      />

      {/* Attribution row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(10,14,20,0.9)",
          }}
        >
          {review.name}
        </span>

        <span style={{ width: "1px", height: "12px", background: "rgba(10,14,20,0.25)", display: "inline-block" }} />

        <span
          style={{
            fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(10,14,20,0.55)",
          }}
        >
          {review.state}
        </span>

        <VerifiedBadge />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Main section
   ────────────────────────────────────────────────────────── */
export default function SpotlightReviews() {
  const [startIdx, setStartIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(
    (dir: 1 | -1) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setStartIdx((i) => mod(i + dir * 3, N));
        setFading(false);
      }, 420);
    },
    [fading]
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => advance(1), 6000);
    return () => clearInterval(t);
  }, [paused, advance]);

  const visible = [
    reviews[mod(startIdx, N)],
    reviews[mod(startIdx + 1, N)],
    reviews[mod(startIdx + 2, N)],
  ];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#c9b89a",
        minHeight: "clamp(740px, 85vh, 960px)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background photo (anchored to bottom, top sky cropped) ── */}
      <img
        src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/High%20Praise/Beach-Toast-HighPraise.png"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 100%",
          zIndex: 0,
        }}
      />
      {/* Very subtle light wash over top half for text legibility */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(200,220,240,0.12) 0%, rgba(200,220,240,0.06) 40%, rgba(0,0,0,0) 80%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Content — normal flow; section grows to fit; bg image covers beneath it ── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "56px 48px 520px",
          }}
        >
        {/* Left-aligned header block */}
        <div style={{ marginBottom: "40px" }}>
          <span
            className="eyebrow-label"
            style={{
              fontFamily: "'Fira Sans', 'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#2F6B3A",
              display: "inline-block",
              borderBottom: "2px solid #2F6B3A",
              paddingBottom: "4px",
              marginBottom: "6px",
            }}
          >
            From The Road
          </span>

          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 700,
              color: "rgba(8,16,8,0.92)",
              lineHeight: 1.1,
              margin: "6px 0 8px",
            }}
            className="font-serif-heading"
          >
            High Praise
          </h2>

          <p
            style={{
              fontFamily: "'Fira Sans', 'Inter', sans-serif",
              fontSize: "15px",
              color: "#5B6560",
              lineHeight: 1.55,
              maxWidth: "340px",
              margin: 0,
            }}
          >
            Real experiences from real customers.<br />
            See why riders roll with Highway 420.
          </p>
        </div>

        {/* ── 3-column review grid ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          {/* Prev button */}
          <button
            onClick={() => advance(-1)}
            aria-label="Previous reviews"
            style={{
              flexShrink: 0,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(0,0,0,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginRight: "8px",
              marginTop: "56px",
              transition: "background 0.2s",
            }}
            className="hover:bg-white/80"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="rgba(10,14,20,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Three review columns with vertical pipe dividers */}
          <div
            style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "0" }}
            className="reviews-grid"
          >
            {visible.map((review, i) => (
              <div
                key={`${review.id}-${startIdx}`}
                style={{ display: "flex", flex: "1 1 280px", minWidth: 0 }}
              >
                {/* Vertical pipe divider (before 2nd and 3rd columns) */}
                {i > 0 && (
                  <div
                    style={{
                      width: "1px",
                      alignSelf: "stretch",
                      background: "rgba(10,14,20,0.14)",
                      flexShrink: 0,
                    }}
                  />
                )}
                <ReviewCol review={review} visible={!fading} />
              </div>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => advance(1)}
            aria-label="Next reviews"
            style={{
              flexShrink: 0,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(0,0,0,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginLeft: "8px",
              marginTop: "56px",
              transition: "background 0.2s",
            }}
            className="hover:bg-white/80"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="rgba(10,14,20,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Page dots */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "28px",
            paddingLeft: "52px",
          }}
        >
          {Array.from({ length: Math.ceil(N / 3) }).map((_, i) => {
            const active = Math.floor(startIdx / 3) === i || (startIdx % 3 !== 0 && i === 0);
            return (
              <button
                key={i}
                onClick={() => { if (!fading) { setFading(true); setTimeout(() => { setStartIdx(i * 3); setFading(false); }, 420); } }}
                aria-label={`Review set ${i + 1}`}
                style={{
                  width: active ? "24px" : "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: active ? "rgba(22,100,50,0.75)" : "rgba(0,0,0,0.18)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                  padding: 0,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
