"use client";

/**
 * ReviewButton — drops onto a PDP. Calls /api/reviews/eligibility on mount and
 * renders the appropriate state:
 *   - signed in + eligible → "Write a review" (opens ReviewModal)
 *   - already reviewed     → "You reviewed this product"
 *   - missing email verify → "Verify your email to review"
 *   - missing age verify   → "Complete age verification to review"
 *   - no delivered order   → "Only verified buyers can review"
 *   - not signed in        → "Sign in to review"
 */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Pencil, ShieldCheck, Lock } from "lucide-react";
import ReviewModal from "./ReviewModal";

const AMBER = "#e8920a";
const AMBER_DEEP = "#c5751a";

type Eligibility =
  | { canReview: true; orderItemId: string | null; isVerifiedBuyer: boolean; existingReviewId: null }
  | {
      canReview: false;
      reason: "not_signed_in" | "email_not_verified" | "already_reviewed";
      orderItemId: null;
      isVerifiedBuyer: false;
      existingReviewId: string | null;
    };

type Props = {
  productId: string;
  productName: string;
  onReviewSubmitted?: () => void; // called after a successful submission so PDP can refetch list
};

export default function ReviewButton({ productId, productName, onReviewSubmitted }: Props) {
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchEligibility = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/eligibility/${productId}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const j: Eligibility = await res.json();
      setEligibility(j);
    } catch {
      // Network/server error — fall back to "not signed in" CTA so the user
      // still has a path forward instead of seeing nothing.
      setEligibility({ canReview: false, reason: "not_signed_in", orderItemId: null, isVerifiedBuyer: false, existingReviewId: null });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { fetchEligibility(); }, [fetchEligibility]);

  const handleSubmitted = () => {
    setModalOpen(false);
    fetchEligibility();             // re-render the button to "already reviewed" state
    onReviewSubmitted?.();          // let parent refetch the reviews list
  };

  if (loading) return <ButtonShell label="Checking eligibility..." disabled />;

  if (!eligibility) return null;

  if (eligibility.canReview) {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={primaryStyle}
          className="hover:opacity-90"
        >
          <Pencil size={16} />
          Write a Review
        </button>
        <ReviewModal
          productId={productId}
          productName={productName}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmitted={handleSubmitted}
        />
      </>
    );
  }

  // Non-eligible states
  switch (eligibility.reason) {
    case "already_reviewed":
      return (
        <ButtonShell
          icon={<ShieldCheck size={16} />}
          label="You've reviewed this product"
          tone="success"
        />
      );
    case "not_signed_in":
      return (
        <Link
          href={`/signin?redirect=/product/${productId}`}
          style={{ ...secondaryStyle, textDecoration: "none" }}
        >
          <Lock size={16} />
          Sign in to write a review
        </Link>
      );
    case "email_not_verified":
    default:
      return (
        <Link href="/account?tab=verification" style={{ ...secondaryStyle, textDecoration: "none" }}>
          <Lock size={16} />
          Verify your email to review
        </Link>
      );
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ButtonShell({
  label,
  icon,
  tone,
  disabled,
}: {
  label: string;
  icon?: React.ReactNode;
  tone?: "muted" | "success";
  disabled?: boolean;
}) {
  const toneStyles: React.CSSProperties =
    tone === "success"
      ? {
          background: "rgba(22,100,50,0.08)",
          color: "rgba(22,100,50,0.95)",
          border: "1px solid rgba(22,100,50,0.4)",
        }
      : {
          background: "rgba(80,60,30,0.06)",
          color: "rgba(80,60,30,0.7)",
          border: "1px solid rgba(80,60,30,0.25)",
        };
  return (
    <div
      style={{
        ...sharedShape,
        ...toneStyles,
        cursor: disabled ? "wait" : "default",
      }}
    >
      {icon}
      {label}
    </div>
  );
}

const sharedShape: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "11px 22px",
  borderRadius: "5px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const primaryStyle: React.CSSProperties = {
  ...sharedShape,
  background: AMBER,
  color: "#fff",
  border: "none",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
};

const secondaryStyle: React.CSSProperties = {
  ...sharedShape,
  background: "transparent",
  color: AMBER_DEEP,
  border: `1.5px solid ${AMBER_DEEP}`,
  cursor: "pointer",
};
