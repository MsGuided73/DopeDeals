"use client";

import { useState, useEffect, useCallback } from "react";

const reviews = [
  {
    id: 1,
    name: "Mike J.",
    state: "California",
    emoji: "🥦",
    gradient: "from-green-400 to-green-600",
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
    quote:
      "Perfect experience from start to finish. Quality products, fair prices, and excellent customer support!",
    stars: 5,
  },
];

export default function SpotlightReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToReview = useCallback(
    (index: number) => {
      if (isTransitioning || index === activeIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 350);
    },
    [isTransitioning, activeIndex]
  );

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
        setIsTransitioning(false);
      }, 350);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = reviews[activeIndex];

  return (
    <section
      className="relative py-24 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Deep Stage Background ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-[#080f0a] to-gray-950" />

      {/* Ambient grid lines for depth */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Radial spotlight glow — shifts subtly per reviewer */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 25%, rgba(22,163,74,0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── Content Shell ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-sans uppercase tracking-[0.3em] text-green-500/70 mb-3 font-medium">
            Customer Stories
          </p>
          <h2
            className="font-display-twilight tracking-[0.15em] text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            HIGH PRAISE
          </h2>
          {/* Underline accent */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-green-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-green-500/50" />
          </div>
        </div>

        {/* ── Stage: The Featured Review ── */}
        <div className="relative">

          {/* Decorative border frame */}
          <div
            className="absolute -inset-px rounded-3xl pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(22,163,74,0.3) 0%, rgba(255,255,255,0.05) 40%, rgba(79,89,150,0.2) 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              padding: "1.5px",
            }}
          />

          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 50%, rgba(22,163,74,0.04) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow:
                "0 32px 80px -20px rgba(0,0,0,0.8), 0 0 60px -20px rgba(22,163,74,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Inner shine strip */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="px-10 py-12 md:px-16 md:py-16">

              {/* Opening quote mark — large decorative layer */}
              <div
                className="absolute top-8 left-10 select-none pointer-events-none"
                style={{
                  fontSize: "120px",
                  lineHeight: 1,
                  fontFamily: "Georgia, serif",
                  color: "rgba(22,163,74,0.12)",
                  fontWeight: 900,
                }}
                aria-hidden
              >
                ❝
              </div>

              {/* Review Content — crossfade */}
              <div
                className="relative transition-all duration-350"
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning
                    ? "translateY(10px)"
                    : "translateY(0px)",
                  transition:
                    "opacity 0.35s ease, transform 0.35s ease",
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6 justify-center">
                  {Array.from({ length: current.stars }).map((_, i) => (
                    <span key={i} className="text-2xl text-amber-400">
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote body */}
                <blockquote
                  className="text-center text-white/90 font-medium leading-[1.75] mb-10"
                  style={{
                    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    fontStyle: "italic",
                    letterSpacing: "0.01em",
                  }}
                >
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div className="flex flex-col items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${current.gradient} flex items-center justify-center shadow-lg ring-2 ring-white/10`}
                    style={{
                      boxShadow: "0 0 24px 6px rgba(22,163,74,0.25)",
                    }}
                  >
                    <span className="text-2xl">{current.emoji}</span>
                  </div>

                  {/* Name + divider */}
                  <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-green-500/40" />
                    <span
                      className="font-display-twilight tracking-[0.15em] text-green-400 text-base uppercase"
                    >
                      {current.name}
                    </span>
                    <span className="text-white/30 text-sm">·</span>
                    <span
                      className="text-white/50 text-sm uppercase tracking-widest"
                      style={{
                        fontFamily:
                          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {current.state}
                    </span>
                    <div className="h-px w-10 bg-green-500/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom glow bar */}
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
          </div>
        </div>

        {/* ── Audience: Avatar Selector Row ── */}
        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              onClick={() => goToReview(index)}
              aria-label={`View review by ${review.name}`}
              className="group relative focus:outline-none"
            >
              {/* Active ring */}
              <div
                className="absolute -inset-1.5 rounded-full transition-all duration-400"
                style={{
                  background:
                    index === activeIndex
                      ? "linear-gradient(135deg, #16a34a, #4f9966)"
                      : "transparent",
                  boxShadow:
                    index === activeIndex
                      ? "0 0 18px 4px rgba(22,163,74,0.4)"
                      : "none",
                  opacity: index === activeIndex ? 1 : 0,
                  transition: "all 0.4s ease",
                }}
              />

              {/* Avatar chip */}
              <div
                className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                style={{
                  opacity: index === activeIndex ? 1 : 0.4,
                  transform:
                    index === activeIndex ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.3s ease",
                  boxShadow:
                    index === activeIndex
                      ? "0 8px 24px rgba(0,0,0,0.4)"
                      : "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                <span className="text-lg">{review.emoji}</span>
              </div>

              {/* Tooltip */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: "rgba(0,0,0,0.85)",
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: "system-ui, sans-serif",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {review.name}
              </div>
            </button>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {reviews.map((_, index) => (
            <div
              key={index}
              className="rounded-full transition-all duration-400"
              style={{
                width: index === activeIndex ? "28px" : "6px",
                height: "6px",
                background:
                  index === activeIndex
                    ? "#16a34a"
                    : "rgba(255,255,255,0.2)",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
