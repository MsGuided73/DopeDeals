"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

interface StateLegalityCheckerProps {
  /** Section heading. */
  heading?: string;
  /** Sub-heading copy. */
  description?: string;
  /** Footer note rendered below the button. */
  footerNote?: string;
  /** Route prefix the form submits to. The state slug is appended as a query param. Default: "/thca-legality". */
  actionPrefix?: string;
  /** Button label. */
  ctaLabel?: string;
}

/**
 * Right-rail widget that lets a visitor look up THCA legality in their state.
 * Posts to a server route (or static page) where the actual registry data is
 * read — this component is the glass front-end only.
 */
export default function StateLegalityChecker({
  heading = "Check THCA Legality in All 50 States",
  description = "Laws change. Our real-time registry helps you stay informed.",
  footerNote = "We update our database daily.",
  actionPrefix = "/thca-legality",
  ctaLabel = "Check Now",
}: StateLegalityCheckerProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/\s+/g, "-");
    router.push(`${actionPrefix}?state=${encodeURIComponent(slug)}`);
  };

  return (
    <section className="rounded-lg border border-[#d8e6cf] bg-[#f0f5e8] p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1">
          <h2 className="text-[15px] font-bold text-neutral-900 leading-snug mb-1.5">
            {heading}
          </h2>
          <p className="text-[13px] text-neutral-700 leading-relaxed">{description}</p>
        </div>
        <MapPin className="w-7 h-7 text-[#1B7A4D] shrink-0" aria-hidden />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block">
          <span className="sr-only">Enter your state</span>
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter Your State"
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 pr-10 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1B7A4D] transition-colors"
            />
            <MapPin
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              aria-hidden
            />
          </div>
        </label>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#1B4332] hover:bg-[#133221] text-white rounded-sm font-bold text-xs tracking-widest uppercase transition-colors"
        >
          {ctaLabel}
        </button>
      </form>

      {footerNote && (
        <p className="text-[12px] text-neutral-500 text-center mt-3">{footerNote}</p>
      )}
    </section>
  );
}
