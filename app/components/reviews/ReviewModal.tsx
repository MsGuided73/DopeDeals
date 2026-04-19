"use client";

/**
 * ReviewModal — submission form. Handles:
 *   - Star rating (required)
 *   - Title (optional)
 *   - Body (required, 20-1500 chars, with live counter)
 *   - Photo upload (optional, max 4 files, 5MB each)
 *   - Would-recommend toggle (optional)
 *
 * Calls /api/reviews/upload for each photo, then /api/reviews to submit.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { X, Upload, Check } from "lucide-react";
import StarRating from "./StarRating";

const AMBER = "#e8920a";
const AMBER_DEEP = "#c5751a";
const PAPER = "#f0eadc";
const INK = "#2a2218";
const INK_SOFT = "#5a4a3a";

const BODY_MIN = 20;
const BODY_MAX = 1500;
const TITLE_MAX = 100;
const PHOTO_MAX_COUNT = 4;
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

type Props = {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (reviewId: string) => void;
};

export default function ReviewModal({
  productId,
  productName,
  isOpen,
  onClose,
  onSubmitted,
}: Props) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setTitle("");
      setBody("");
      setWouldRecommend(null);
      setPhotoUrls([]);
      setError(null);
      setSubmitting(false);
      setUploading(false);
    }
  }, [isOpen]);

  // Close on Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const remaining = PHOTO_MAX_COUNT - photoUrls.length;
    if (remaining <= 0) {
      setError(`Up to ${PHOTO_MAX_COUNT} photos allowed.`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const newUrls: string[] = [];
      for (const file of toUpload) {
        if (file.size > PHOTO_MAX_BYTES) {
          setError(`${file.name} exceeds 5MB.`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/reviews/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error || `Upload failed for ${file.name}`);
          continue;
        }
        const j = await res.json();
        newUrls.push(j.url);
      }
      setPhotoUrls(prev => [...prev, ...newUrls]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [photoUrls.length]);

  const removePhoto = (url: string) => {
    setPhotoUrls(prev => prev.filter(u => u !== url));
  };

  const trimmedBody = body.trim();
  const bodyValid = trimmedBody.length >= BODY_MIN && trimmedBody.length <= BODY_MAX;
  const formValid = rating >= 1 && rating <= 5 && bodyValid && !uploading && !submitting;

  const handleSubmit = async () => {
    setError(null);
    if (!formValid) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || undefined,
          body: trimmedBody,
          wouldRecommend: wouldRecommend ?? undefined,
          photoUrls,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error || "Failed to submit review.");
        setSubmitting(false);
        return;
      }
      onSubmitted(j.id);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: PAPER,
          color: INK,
          borderRadius: "10px",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,146,10,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 22px",
            borderBottom: `1px dashed rgba(80,60,30,0.35)`,
            background: "linear-gradient(180deg, #f5efe2 0%, #f0eadc 100%)",
          }}
        >
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: AMBER_DEEP, margin: 0 }}>
              Write a Review
            </p>
            <h2 id="review-modal-title" style={{ fontFamily: "'BebasNeue', 'Bebas Neue', sans-serif", fontSize: "26px", letterSpacing: "0.04em", color: INK, margin: "2px 0 0", lineHeight: 1.1 }}>
              {productName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: "6px", color: INK_SOFT }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px" }}>
          {/* Rating */}
          <div style={{ marginBottom: "24px" }}>
            <Label>Your rating *</Label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <StarRating value={rating} onChange={setRating} size={32} theme="light" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: INK_SOFT }}>
                {rating === 0 ? "Tap a star" : `${rating} of 5`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <Label optional>Title</Label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
              placeholder="Sum it up in a sentence (optional)"
              style={inputStyle}
              maxLength={TITLE_MAX}
            />
          </div>

          {/* Body */}
          <div style={{ marginBottom: "20px" }}>
            <Label>Your review *</Label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`Share what you liked, what could be better, who it's for. Min ${BODY_MIN} characters.`}
              rows={6}
              style={{ ...inputStyle, resize: "vertical", minHeight: "120px", fontFamily: "'DM Sans', sans-serif" }}
              maxLength={BODY_MAX}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "11px", color: INK_SOFT }}>
              <span>
                {trimmedBody.length < BODY_MIN
                  ? `${BODY_MIN - trimmedBody.length} more chars needed`
                  : "Looks good"}
              </span>
              <span>{trimmedBody.length} / {BODY_MAX}</span>
            </div>
          </div>

          {/* Photos */}
          <div style={{ marginBottom: "22px" }}>
            <Label optional>Photos (up to {PHOTO_MAX_COUNT}, 5MB each)</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "flex-start" }}>
              {photoUrls.map((url) => (
                <div
                  key={url}
                  style={{
                    position: "relative",
                    width: "82px",
                    height: "82px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: "1px solid rgba(80,60,30,0.25)",
                    background: "#fff",
                  }}
                >
                  <img src={url} alt="Review attachment" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    aria-label="Remove photo"
                    style={{
                      position: "absolute",
                      top: "3px",
                      right: "3px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.78)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {photoUrls.length < PHOTO_MAX_COUNT && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    width: "82px",
                    height: "82px",
                    borderRadius: "6px",
                    border: `1.5px dashed ${AMBER_DEEP}`,
                    background: "rgba(232,146,10,0.06)",
                    color: AMBER_DEEP,
                    cursor: uploading ? "wait" : "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {uploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Add photo</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Would recommend */}
          <div style={{ marginBottom: "26px" }}>
            <Label optional>Would you recommend this product?</Label>
            <div style={{ display: "flex", gap: "10px" }}>
              {([
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ] as const).map(opt => {
                const selected = wouldRecommend === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setWouldRecommend(selected ? null : opt.value)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "999px",
                      border: `1.5px solid ${selected ? AMBER_DEEP : "rgba(80,60,30,0.35)"}`,
                      background: selected ? AMBER_DEEP : "transparent",
                      color: selected ? "#fff" : INK_SOFT,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.18s ease",
                    }}
                  >
                    {selected && <Check size={14} />}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "10px 14px",
              marginBottom: "16px",
              background: "rgba(217,48,37,0.08)",
              border: "1px solid rgba(217,48,37,0.35)",
              borderRadius: "6px",
              color: "#a02319",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: "11px 22px",
                background: "transparent",
                border: `1.5px solid ${INK_SOFT}`,
                color: INK_SOFT,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "5px",
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formValid}
              style={{
                padding: "11px 28px",
                background: formValid ? AMBER : "rgba(232,146,10,0.35)",
                border: "none",
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "5px",
                cursor: formValid ? "pointer" : "not-allowed",
                transition: "opacity 0.2s ease",
              }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label style={{
      display: "block",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: INK,
      marginBottom: "8px",
    }}>
      {children}
      {optional && (
        <span style={{ marginLeft: "8px", fontWeight: 500, color: INK_SOFT, letterSpacing: "0.1em" }}>
          (optional)
        </span>
      )}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  background: "#fffcf4",
  border: "1px solid rgba(80,60,30,0.25)",
  borderRadius: "5px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  color: INK,
  outline: "none",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
};
