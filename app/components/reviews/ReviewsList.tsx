"use client";

/**
 * ReviewsList — fetches and displays all reviews for a product.
 *
 * Shows:
 *   - Aggregate summary (avg rating, total count, star distribution bar chart)
 *   - Sort dropdown (newest / highest / lowest)
 *   - Paginated list of ReviewCards
 *   - "Load more" button
 *
 * Re-renders when the parent passes a new `refreshKey` (e.g. after a successful
 * submission via ReviewButton).
 */
import { useState, useEffect, useCallback } from "react";
import StarRating from "./StarRating";
import ReviewCard, { type Review } from "./ReviewCard";

const AMBER = "#e8920a";
const AMBER_DEEP = "#c5751a";
const INK = "#2a2218";
const INK_SOFT = "#5a4a3a";

type Summary = {
  product_id: string;
  review_count: number;
  average_rating: number | null;
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  two_star_count: number;
  one_star_count: number;
  recommend_count: number;
  recommend_response_count: number;
};

type Props = {
  productId: string;
  refreshKey?: number;          // bump from parent to force re-fetch
  pageSize?: number;
};

const SORTS = [
  { value: "newest",  label: "Newest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest",  label: "Lowest rated" },
] as const;

export default function ReviewsList({ productId, refreshKey = 0, pageSize = 5 }: Props) {
  const [sort, setSort] = useState<typeof SORTS[number]["value"]>("newest");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (offset: number, append: boolean) => {
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String(offset),
      sort,
    });
    const res = await fetch(`/api/reviews/product/${productId}?${params}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const j = await res.json();
    if (append) {
      setReviews(prev => [...prev, ...(j.reviews ?? [])]);
    } else {
      setReviews(j.reviews ?? []);
    }
    setSummary(j.summary ?? null);
    setHasMore((j.reviews?.length ?? 0) === pageSize);
  }, [productId, pageSize, sort]);

  // Initial + sort/refreshKey changes
  useEffect(() => {
    setLoading(true);
    fetchPage(0, false).catch(() => {}).finally(() => setLoading(false));
  }, [fetchPage, refreshKey]);

  const loadMore = async () => {
    setLoadingMore(true);
    try { await fetchPage(reviews.length, true); }
    catch {/* swallow; UI shows existing list */}
    finally { setLoadingMore(false); }
  };

  const handleDeleted = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    // Refresh summary in the background
    fetchPage(0, false).catch(() => {});
  };

  if (loading) {
    return (
      <div style={{ padding: "32px 0", textAlign: "center", fontFamily: "'DM Sans', sans-serif", color: INK_SOFT }}>
        Loading reviews...
      </div>
    );
  }

  const total = summary?.review_count ?? 0;

  return (
    <section>
      {/* Summary header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(200px, 280px) 1fr",
        gap: "32px",
        padding: "20px 0",
        marginBottom: "24px",
        borderBottom: "1px dashed rgba(80,60,30,0.25)",
      }}>
        {total > 0 ? (
          <>
            {/* Average + count */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif", fontSize: "44px", lineHeight: 1, color: INK }}>
                  {summary?.average_rating?.toFixed(1) ?? "—"}
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: INK_SOFT }}>
                  / 5
                </span>
              </div>
              <StarRating value={summary?.average_rating ?? 0} size={20} theme="light" />
              <p style={{ marginTop: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: INK_SOFT }}>
                Based on <strong style={{ color: INK }}>{total}</strong> verified review{total === 1 ? "" : "s"}
              </p>
              {summary && summary.recommend_response_count > 0 && (
                <p style={{ marginTop: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: INK_SOFT }}>
                  <strong style={{ color: AMBER_DEEP }}>
                    {Math.round((summary.recommend_count / summary.recommend_response_count) * 100)}%
                  </strong>{" "}
                  would recommend
                </p>
              )}
            </div>

            {/* Star distribution */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = summary
                  ? (summary as any)[`${["one","two","three","four","five"][star-1]}_star_count` as keyof Summary] as number
                  : 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: INK_SOFT }}>
                    <span style={{ width: "18px", textAlign: "right" }}>{star}★</span>
                    <div style={{ flex: 1, height: "8px", borderRadius: "999px", background: "rgba(80,60,30,0.10)", overflow: "hidden" }}>
                      <div style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${AMBER}, #f4ab2e)`,
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                    <span style={{ width: "44px", textAlign: "right" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "18px", fontStyle: "italic", color: INK_SOFT, margin: 0 }}>
              No reviews yet — be the first verified buyer to leave one.
            </p>
          </div>
        )}
      </div>

      {/* Sort dropdown */}
      {total > 1 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: INK_SOFT, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                padding: "6px 10px",
                border: `1.5px solid ${AMBER_DEEP}`,
                borderRadius: "4px",
                background: "transparent",
                color: AMBER_DEEP,
                cursor: "pointer",
              }}
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
      )}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isOwner={review.isOwner === true}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              padding: "10px 28px",
              background: "transparent",
              color: AMBER_DEEP,
              border: `1.5px solid ${AMBER_DEEP}`,
              borderRadius: "4px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loadingMore ? "wait" : "pointer",
            }}
          >
            {loadingMore ? "Loading..." : "Load More Reviews"}
          </button>
        </div>
      )}
    </section>
  );
}
