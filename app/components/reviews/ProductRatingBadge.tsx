"use client";

/**
 * ProductRatingBadge — compact "★★★★☆ 4.8 (24 reviews)" display.
 *
 * Fetches the aggregate summary for a product. Designed to slot into the
 * product info area of the PDP and other listing surfaces.
 *
 * On click, scrolls smoothly to the reviews tab anchor (#product-reviews) so
 * users can jump from the badge straight to the full list.
 */
import { useState, useEffect } from "react";
import StarRating from "./StarRating";

type Summary = {
  review_count: number;
  average_rating: number | null;
};

type Props = {
  productId: string;
  /** Optional callback invoked when the badge is activated — typically used to
   *  switch the parent's tab state to 'reviews'. */
  onJumpToReviews?: () => void;
  /** Compact = no parenthetical count line; full = standard PDP variant. */
  variant?: "full" | "compact";
};

export default function ProductRatingBadge({
  productId,
  onJumpToReviews,
  variant = "full",
}: Props) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // limit=1 keeps the payload small — we only care about the summary
        const res = await fetch(`/api/reviews/product/${productId}?limit=1`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        const j = await res.json();
        if (!cancelled) setSummary(j.summary ?? null);
      } catch {
        if (!cancelled) setSummary(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  const count = summary?.review_count ?? 0;
  const avg = summary?.average_rating ?? 0;

  // No reviews yet → encouraging empty state
  if (count === 0) {
    return (
      <button
        type="button"
        onClick={onJumpToReviews}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        style={{ background: "transparent", border: "none", padding: 0, cursor: onJumpToReviews ? "pointer" : "default" }}
      >
        <StarRating value={0} size={20} theme="light" />
        <span className="text-slate-600 text-sm">
          {onJumpToReviews ? "Be the first to review →" : "No reviews yet"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onJumpToReviews}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      style={{ background: "transparent", border: "none", padding: 0, cursor: onJumpToReviews ? "pointer" : "default" }}
      aria-label={`${avg.toFixed(1)} out of 5 stars based on ${count} reviews. Click to read reviews.`}
    >
      <StarRating value={avg} size={20} theme="light" />
      <span className="text-slate-900 font-semibold">{avg.toFixed(1)}</span>
      {variant === "full" && (
        <span className="text-slate-600 text-sm">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </button>
  );
}
