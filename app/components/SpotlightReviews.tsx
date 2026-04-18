"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const reviews = [
  {
    id: 1,
    name: "Mike J.",
    state: "California",
    emoji: "🌿",
    gradient: "from-green-400 to-green-600",
    glowColor: "rgba(34,197,94,0.3)",
    quote:
      "The THCA flower is absolutely top-shelf. Ordered Wednesday, arrived Friday — completely discreet. COA was right there on the product page. This is now my go-to source.",
    stars: 5,
  },
  {
    id: 2,
    name: "Sarah C.",
    state: "Texas",
    emoji: "✨",
    gradient: "from-purple-400 to-purple-600",
    glowColor: "rgba(168,85,247,0.3)",
    quote:
      "The mushroom chocolate bars are incredible — functional and delicious. Love that they carry adaptogenic options alongside the cannabinoids. Free shipping kicked in at $75 which is super fair!",
    stars: 5,
  },
  {
    id: 3,
    name: "Alex R.",
    state: "Colorado",
    emoji: "💨",
    gradient: "from-blue-400 to-blue-600",
    glowColor: "rgba(59,130,246,0.3)",
    quote:
      "Tried the Delta 8 disposable and was blown away by the quality. Smooth, consistent, and the price beat everywhere else I looked. Already ordered the Delta 10 to compare.",
    stars: 5,
  },
  {
    id: 4,
    name: "Emma W.",
    state: "Florida",
    emoji: "🍃",
    gradient: "from-cyan-400 to-cyan-600",
    glowColor: "rgba(6,182,212,0.3)",
    quote:
      "Had a question about the THCA prerolls and they responded in under an hour. Packaging was perfectly discreet. The prerolls themselves are killer — 5 stars all day.",
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
      "Finally a site that shows real COAs for everything. The THCA edibles are potent and consistent batch after batch. Ordered three times — never been disappointed.",
    stars: 5,
  },
  {
    id: 6,
    name: "Jessica T.",
    state: "Washington",
    emoji: "🏅",
    gradient: "from-yellow-400 to-amber-600",
    glowColor: "rgba(251,191,36,0.3)",
    quote:
      "Got the concentrate cart and THCA gummies in one order, free shipping kicked in, arrived in 3 days, and the cart hits perfectly. Highway 420 is the real deal — super legit.",
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
      {/* ── Background: Beach-Toast photo ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/High%20Praise/Beach-Toast.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Very light warm veil — keeps dark text legible without killing the photo */}
      <div className="absolute inset-0" style={{ background: "rgba(255,248,240,0.22)" }} />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{
              color: "rgba(22,100,50,0.9)",
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
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-green-700/50" />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#15803d" }} />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-green-700/50" />
          </div>
        </div>

        {/* ── Triptych Stage ── */}
        <div className="relative flex items-center justify-center gap-0">

          <button
            onClick={() => shift("left")}
            aria-label="Previous review"
            className="shrink-0 z-20 mr-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
            style={{
              background: "rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.18)",
              color: "rgba(15,23,42,0.85)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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

          <button
            onClick={() => shift("right")}
            aria-label="Next review"
            className="shrink-0 z-20 ml-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
            style={{
              background: "rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.18)",
              color: "rgba(15,23,42,0.85)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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
        background: "transparent",
        transform: animating ? "scale(0.97) translateY(6px)" : "scale(1) translateY(-10px)",
        opacity: animating ? 0 : 1,
        transition: "all 0.38s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 10,
      }}
    >
      <div className="relative p-8 pt-6">
        {/* Quote mark */}
        <div
          className="mb-4 select-none"
          style={{
            fontSize: "64px",
            lineHeight: 0.7,
            fontFamily: "Georgia, serif",
            color: "#15803d",
            opacity: 0.25,
            fontWeight: 900,
          }}
          aria-hidden
        >
          ❤
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
            fontWeight: 600,
            letterSpacing: "0.01em",
            minHeight: "84px",
            color: "#0f172a",
            textShadow: "0 1px 2px rgba(255,255,255,0.5)",
          }}
        >
          &ldquo;{review.quote}&rdquo;
        </blockquote>

        {/* Divider */}
        <div
          className="mb-5 h-px"
          style={{ background: "rgba(15,23,42,0.2)" }}
        />

        {/* Attribution */}
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center shrink-0`}
            style={{ boxShadow: `0 4px 16px ${review.glowColor}` }}
          >
            <span className="text-xl">{review.emoji}</span>
          </div>
          <div>
            <div
              className="font-display-twilight tracking-[0.12em] text-gray-900"
              style={{ fontSize: "0.9rem", fontWeight: 700 }}
            >
              {review.name}
            </div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.75rem",
                color: "#374151",
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
        background: "transparent",
        opacity: 0.85,
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
          color: "rgba(15,23,42,0.80)",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "84px",
          fontWeight: 500,
        }}
      >
        &ldquo;{review.quote}&rdquo;
      </p>

      {/* Divider */}
      <div
        className="mb-4 h-px"
        style={{ background: "rgba(15,23,42,0.2)" }}
      />

      {/* Attribution */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center shrink-0`}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          <span className="text-base">{review.emoji}</span>
        </div>
        <div>
          <div
            className="font-display-twilight tracking-[0.1em]"
            style={{ fontSize: "0.8rem", color: "rgba(15,23,42,0.9)", fontWeight: 700 }}
          >
            {review.name}
          </div>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.7rem",
              color: "rgba(55,65,81,0.9)",
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
