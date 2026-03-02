"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const reviews = [
  {
    id: 1,
    name: "Mike J.",
    state: "California",
    emoji: "🥦",
    gradient: "from-green-400 to-green-600",
    glowColor: "rgba(34,197,94,0.3)",
    quote:
      "Amazing quality! The glass is thick and the design is perfect. Fast shipping too. Will definitely order again!",
    stars: 5,
  },
  {
    id: 2,
    name: "Sarah C.",
    state: "Texas",
    emoji: "🌿",
    gradient: "from-purple-400 to-purple-600",
    glowColor: "rgba(168,85,247,0.3)",
    quote:
      "Best smoke shop online! Great prices and the customer service is top notch. Highly recommend Highway 420!",
    stars: 5,
  },
  {
    id: 3,
    name: "Alex R.",
    state: "Colorado",
    emoji: "🫧",
    gradient: "from-blue-400 to-blue-600",
    glowColor: "rgba(59,130,246,0.3)",
    quote:
      "The vaporizer I bought works perfectly. Great build quality and arrived exactly as described. 5 stars!",
    stars: 5,
  },
  {
    id: 4,
    name: "Emma W.",
    state: "Florida",
    emoji: "💨",
    gradient: "from-cyan-400 to-cyan-600",
    glowColor: "rgba(6,182,212,0.3)",
    quote:
      "Love the selection and quality. The packaging was discreet and professional. Will be a repeat customer!",
    stars: 5,
  },
  {
    id: 5,
    name: "David K.",
    state: "New York",
    emoji: "🌱",
    gradient: "from-lime-400 to-emerald-600",
    glowColor: "rgba(132,204,22,0.3)",
    quote:
      "Excellent products and fast delivery. The grinder I ordered is solid and works great. Highly recommended!",
    stars: 5,
  },
  {
    id: 6,
    name: "Jessica T.",
    state: "Washington",
    emoji: "🍀",
    gradient: "from-yellow-400 to-amber-600",
    glowColor: "rgba(251,191,36,0.3)",
    quote:
      "Perfect experience from start to finish. Quality products, fair prices, and excellent customer support!",
    stars: 5,
  },
];

const N = reviews.length;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function SpotlightReviews() {
  const [center, setCenter] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const dirRef = useRef<"left" | "right">("right");

  const shift = useCallback(
    (dir: "left" | "right") => {
      if (animating) return;
      dirRef.current = dir;
      setAnimating(true);
      setTimeout(() => {
        setCenter((c) => mod(c + (dir === "right" ? 1 : -1), N));
        setAnimating(false);
      }, 380);
    },
    [animating]
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => shift("right"), 5500);
    return () => clearInterval(t);
  }, [paused, shift]);

  const left = mod(center - 1, N);
  const right = mod(center + 1, N);

  return (
    <section
      className="relative py-24 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background: light warm neutral with subtle depth ── */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #f8f6f1 0%, #f0ede6 50%, #f4f1ec 100%)" }} />

      {/* Subtle dot grid for texture */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(22,163,74,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft green top-center glow for brand warmth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(22,163,74,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{
              color: "rgba(22,163,74,0.8)",
              fontFamily: "system-ui, sans-serif",
              fontWeight: 600,
            }}
          >
            Verified Customer Reviews
          </p>
          <h2
            className="font-display-twilight tracking-[0.15em] text-gray-900"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
          >
            HIGH PRAISE
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-green-500/50" />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#16a34a" }}
            />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-green-500/50" />
          </div>
        </div>

        {/* ── Triptych Stage ── */}
        <div className="relative flex items-center justify-center gap-0">

          {/* Left Arrow */}
          <button
            onClick={() => shift("left")}
            aria-label="Previous review"
            className="shrink-0 z-20 mr-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              color: "rgba(255,255,255,0.7)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Three cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center max-w-5xl mx-auto">

            {/* LEFT CARD — frosted, dimmed */}
            <SideCard review={reviews[left]} side="left" />

            {/* CENTER CARD — fully opaque, elevated */}
            <CenterCard review={reviews[center]} animating={animating} />

            {/* RIGHT CARD — frosted, dimmed */}
            <SideCard review={reviews[right]} side="right" />

          </div>

          {/* Right Arrow */}
          <button
            onClick={() => shift("right")}
            aria-label="Next review"
            className="shrink-0 z-20 ml-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              color: "rgba(255,255,255,0.7)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Progress pills */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {reviews.map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: i === center ? "28px" : "6px",
                height: "6px",
                background: i === center ? "#16a34a" : "rgba(0,0,0,0.18)",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </div>

        {/* Review count label */}
        <div className="text-center mt-4">
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(0,0,0,0.4)",
              letterSpacing: "0.08em",
            }}
          >
            {center + 1} of {N} reviews
          </span>
        </div>

      </div>
    </section>
  );
}

/* ─── Sub-components ─── */

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-amber-400 text-lg">★</span>
      ))}
    </div>
  );
}

function CenterCard({
  review,
  animating,
}: {
  review: (typeof reviews)[0];
  animating: boolean;
}) {
  return (
    <div
      className="relative rounded-2xl transition-all duration-380"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.85)",
        boxShadow:
          `0 32px 80px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 40px -8px ${review.glowColor}`,
        transform: animating ? "scale(0.97) translateY(6px)" : "scale(1) translateY(-10px)",
        opacity: animating ? 0 : 1,
        transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 10,
      }}
    >
      {/* Frosted glass inner highlight */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%)",
        }}
      />

      {/* Top green accent bar */}
      <div
        className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full"
        style={{ background: "linear-gradient(90deg, #16a34a, #4ade80)" }}
      />

      <div className="relative p-8 pt-10">
        {/* Quote mark */}
        <div
          className="mb-4 select-none"
          style={{
            fontSize: "64px",
            lineHeight: 0.7,
            fontFamily: "Georgia, serif",
            color: "#16a34a",
            opacity: 0.18,
            fontWeight: 900,
          }}
          aria-hidden
        >
          ❝
        </div>

        {/* Stars */}
        <StarRow count={review.stars} />

        {/* Quote */}
        <blockquote
          className="mt-4 mb-6 leading-relaxed"
          style={{
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: "1.0625rem",
            fontStyle: "italic",
            fontWeight: 500,
            letterSpacing: "0.01em",
            minHeight: "84px",
            color: "#1f2937",
          }}
        >
          &ldquo;{review.quote}&rdquo;
        </blockquote>

        {/* Divider */}
        <div
          className="mb-5 h-px"
          style={{ background: "linear-gradient(90deg, rgba(22,163,74,0.15), rgba(22,163,74,0.5), rgba(22,163,74,0.15))" }}
        />

        {/* Attribution */}
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center shrink-0`}
            style={{ boxShadow: `0 4px 16px ${review.glowColor}, 0 0 0 3px rgba(255,255,255,0.6)` }}
          >
            <span className="text-xl">{review.emoji}</span>
          </div>
          <div>
            <div
              className="font-display-twilight tracking-[0.12em] text-gray-900"
              style={{ fontSize: "0.9rem" }}
            >
              {review.name}
            </div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.75rem",
                color: "#6b7280",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: "2px",
              }}
            >
              {review.state} · ★ Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideCard({
  review,
  side,
}: {
  review: (typeof reviews)[0];
  side: "left" | "right";
}) {
  return (
    <div
      className="hidden md:block relative rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.35)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        opacity: 0.75,
        transform: side === "left" ? "translateX(12px) scale(0.95)" : "translateX(-12px) scale(0.95)",
        transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 5,
      }}
    >
      {/* Stars */}
      <StarRow count={review.stars} />

      {/* Quote */}
      <p
        className="mt-3 mb-5 leading-relaxed"
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.9rem",
          fontStyle: "italic",
          color: "rgba(31,41,55,0.75)",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "84px",
        }}
      >
        &ldquo;{review.quote}&rdquo;
      </p>

      {/* Divider */}
      <div
        className="mb-4 h-px"
        style={{ background: "rgba(22,163,74,0.25)" }}
      />

      {/* Attribution */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center shrink-0`}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1), 0 0 0 2px rgba(255,255,255,0.5)" }}
        >
          <span className="text-base">{review.emoji}</span>
        </div>
        <div>
          <div
            className="font-display-twilight tracking-[0.1em]"
            style={{ fontSize: "0.8rem", color: "rgba(17,24,39,0.85)" }}
          >
            {review.name}
          </div>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.7rem",
              color: "rgba(107,114,128,0.9)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginTop: "1px",
            }}
          >
            {review.state}
          </div>
        </div>
      </div>
    </div>
  );
}
