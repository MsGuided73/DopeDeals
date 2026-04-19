"use client";

/**
 * ReviewCard — single review display.
 *
 * Includes verified-buyer badge (green shield, matching the existing
 * SpotlightReviews "Verified Rider" pattern), star rating, optional title,
 * body, optional photos (clickable lightbox), and "edited" timestamp.
 *
 * If isOwner is true, shows edit/delete affordances (delete confirms inline).
 */
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import StarRating from "./StarRating";

const SHIELD_GREEN = "rgba(22,100,50,0.9)";
const AMBER_DEEP = "#c5751a";
const INK = "#2a2218";
const INK_SOFT = "#5a4a3a";

export type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  wouldRecommend: boolean | null;
  photoUrls: string[];
  createdAt: string;
  editedAt: string | null;
  reviewerName: string;
  isVerifiedBuyer: boolean;
  isOwner?: boolean;
};

type Props = {
  review: Review;
  isOwner?: boolean;
  onDeleted?: (id: string) => void;
  onEdit?: (review: Review) => void;
};

export default function ReviewCard({ review, isOwner, onDeleted, onEdit }: Props) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const dateLabel = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onDeleted?.(review.id);
    } catch {
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <article
      style={{
        background: "#fffcf4",
        border: "1px solid rgba(80,60,30,0.15)",
        borderRadius: "8px",
        padding: "20px 22px",
        boxShadow: "0 2px 10px rgba(80,60,30,0.06)",
        position: "relative",
      }}
    >
      {/* Header row */}
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {/* Reviewer + verified badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: INK }}>
              {review.reviewerName}
            </span>
            {review.isVerifiedBuyer && <VerifiedBuyerBadge />}
          </div>

          {/* Stars + date */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <StarRating value={review.rating} size={16} theme="light" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: INK_SOFT, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {dateLabel}
              {review.editedAt && <span style={{ marginLeft: "6px", fontStyle: "italic" }}>· edited</span>}
            </span>
          </div>
        </div>

        {/* Owner controls */}
        {isOwner && (
          <div style={{ display: "flex", gap: "6px" }}>
            <IconButton
              label="Edit review"
              onClick={() => onEdit?.(review)}
              icon={<Pencil size={14} />}
            />
            <IconButton
              label="Delete review"
              onClick={() => setConfirmingDelete(true)}
              icon={<Trash2 size={14} />}
              tone="danger"
            />
          </div>
        )}
      </header>

      {/* Title */}
      {review.title && (
        <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px", fontWeight: 700, color: INK, margin: "0 0 8px" }}>
          {review.title}
        </h4>
      )}

      {/* Body */}
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: 1.55, color: INK, margin: 0, whiteSpace: "pre-wrap" }}>
        {review.body}
      </p>

      {/* Photos */}
      {review.photoUrls.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
          {review.photoUrls.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setLightboxUrl(url)}
              aria-label="View photo"
              style={{
                width: "76px",
                height: "76px",
                padding: 0,
                border: "1px solid rgba(80,60,30,0.18)",
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "zoom-in",
                background: "#fff",
              }}
            >
              <img src={url} alt="Review photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}

      {/* Would recommend */}
      {review.wouldRecommend !== null && (
        <p style={{
          marginTop: "12px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: review.wouldRecommend ? SHIELD_GREEN : "#a04a30",
        }}>
          {review.wouldRecommend ? "✓ Recommends this product" : "✗ Does not recommend"}
        </p>
      )}

      {/* Inline delete confirmation */}
      {confirmingDelete && (
        <div style={{
          marginTop: "14px",
          padding: "10px 14px",
          background: "rgba(217,48,37,0.06)",
          border: "1px solid rgba(217,48,37,0.3)",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#7a1810" }}>
            Permanently delete this review?
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              style={miniButtonStyle("muted")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={miniButtonStyle("danger")}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxUrl(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          <img src={lightboxUrl} alt="Review photo enlarged" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        </div>
      )}
    </article>
  );
}

function VerifiedBuyerBadge() {
  return (
    <span
      title="This reviewer purchased and received this product"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        border: `1px solid ${SHIELD_GREEN}`,
        borderRadius: "999px",
        padding: "2px 9px 2px 6px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "9px",
        fontWeight: 800,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: SHIELD_GREEN,
        whiteSpace: "nowrap",
      }}
    >
      <svg width="11" height="13" viewBox="0 0 14 16" fill="none" aria-hidden>
        <path
          d="M7 0.5L1 2.5V8C1 11.5 3.8 14.6 7 15.5C10.2 14.6 13 11.5 13 8V2.5L7 0.5Z"
          stroke={SHIELD_GREEN}
          strokeWidth="1.2"
          fill="rgba(22,100,50,0.08)"
        />
      </svg>
      Verified Buyer
    </span>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  tone,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  tone?: "danger";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        background: "transparent",
        border: "1px solid rgba(80,60,30,0.25)",
        color: tone === "danger" ? "#a02319" : INK_SOFT,
        padding: "5px 8px",
        borderRadius: "4px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {icon}
    </button>
  );
}

function miniButtonStyle(variant: "muted" | "danger"): React.CSSProperties {
  return {
    padding: "6px 12px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    borderRadius: "4px",
    cursor: "pointer",
    border: variant === "danger" ? "1px solid #a02319" : "1px solid rgba(80,60,30,0.4)",
    background: variant === "danger" ? "#a02319" : "transparent",
    color: variant === "danger" ? "#fff" : INK_SOFT,
  };
}
