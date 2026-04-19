"use client";

/**
 * StarRating — interactive (clickable) or read-only star display.
 *
 * Used by ReviewModal (interactive) and ReviewCard / ReviewsList (read-only).
 */

const AMBER = "#e8920a";
const AMBER_LIGHT = "#f4ab2e";
const STAR_GREY = "rgba(255,255,255,0.18)";
const STAR_GREY_LIGHT = "rgba(0,0,0,0.18)";

type Props = {
  value: number;            // 0-5; supports fractional for averages (e.g., 4.3)
  onChange?: (next: number) => void; // if provided, becomes interactive
  size?: number;            // px, default 20
  theme?: "dark" | "light"; // colors of empty stars adjust to background
  ariaLabel?: string;
};

export default function StarRating({
  value,
  onChange,
  size = 20,
  theme = "light",
  ariaLabel,
}: Props) {
  const interactive = !!onChange;
  const emptyColor = theme === "dark" ? STAR_GREY : STAR_GREY_LIGHT;

  return (
    <div
      role={interactive ? "radiogroup" : "img"}
      aria-label={ariaLabel ?? `${value.toFixed(1)} out of 5 stars`}
      style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}
    >
      {[1, 2, 3, 4, 5].map((idx) => {
        const filled = value >= idx;
        const partial = !filled && value > idx - 1 ? value - (idx - 1) : 0; // fractional fill (read-only)
        return (
          <button
            key={idx}
            type="button"
            disabled={!interactive}
            onClick={interactive ? () => onChange!(idx) : undefined}
            aria-checked={interactive ? value === idx : undefined}
            role={interactive ? "radio" : undefined}
            tabIndex={interactive ? 0 : -1}
            aria-label={interactive ? `Rate ${idx} of 5 stars` : undefined}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: interactive ? "pointer" : "default",
              display: "inline-flex",
              transition: "transform 0.12s ease",
            }}
            className={interactive ? "hover:scale-110" : ""}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <defs>
                {partial > 0 && (
                  <linearGradient id={`star-fill-${idx}-${value}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset={`${partial * 100}%`} stopColor={AMBER} />
                    <stop offset={`${partial * 100}%`} stopColor={emptyColor} />
                  </linearGradient>
                )}
              </defs>
              <path
                d="M12 2.5l2.92 6.32 6.83.7-5.13 4.7 1.45 6.78L12 17.6 5.93 21l1.45-6.78L2.25 9.52l6.83-.7L12 2.5z"
                fill={
                  filled
                    ? AMBER
                    : partial > 0
                    ? `url(#star-fill-${idx}-${value})`
                    : emptyColor
                }
                stroke={filled ? AMBER_LIGHT : "transparent"}
                strokeWidth="0.5"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
