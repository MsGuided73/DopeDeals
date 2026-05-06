import { ReactNode } from "react";

interface InlineHighlightCalloutProps {
  /** Bold prefix label, e.g., "In simple terms:" or "Bottom line:". */
  label: string;
  /** Body copy following the label. */
  children: ReactNode;
  /** Visual tone. "neutral" = soft cream, "info" = soft green, "warn" = soft amber. */
  tone?: "neutral" | "info" | "warn";
  /** Optional leading icon (lucide). Sized w-4 h-4. */
  icon?: ReactNode;
}

const TONE_CLASSES: Record<NonNullable<InlineHighlightCalloutProps["tone"]>, string> = {
  neutral: "bg-[#f7f4ec] border-[#e8e1cf] text-neutral-800",
  info: "bg-[#f0f5e8] border-[#d8e6cf] text-neutral-800",
  warn: "bg-[#fdf6e3] border-[#ecdcb0] text-neutral-800",
};

/**
 * Compact inline callout used inside long-form article body copy to surface
 * a single high-signal sentence (e.g., "In simple terms:", "Bottom line:").
 * Sits in the article column, not in the rail.
 */
export default function InlineHighlightCallout({
  label,
  children,
  tone = "neutral",
  icon,
}: InlineHighlightCalloutProps) {
  return (
    <div
      className={`rounded-md border px-4 py-3 text-[13.5px] leading-relaxed ${TONE_CLASSES[tone]}`}
    >
      <div className="flex items-start gap-2">
        {icon && <span className="mt-0.5 shrink-0 text-[#1B7A4D]">{icon}</span>}
        <p>
          <span className="font-bold text-neutral-900">{label}</span>{" "}
          <span>{children}</span>
        </p>
      </div>
    </div>
  );
}
