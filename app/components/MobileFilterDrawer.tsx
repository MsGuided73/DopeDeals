"use client";

import { type ReactNode, useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Header title shown at the top of the drawer. Defaults to "Filters". */
  title?: string;
  /** Optional badge — usually the active filter count. */
  badge?: number;
  children: ReactNode;
}

// Slide-in drawer for filter sidebars on mobile listing pages. The desktop
// sidebar stays visible; this is purely a mobile/tablet pattern. Pages should
// hide their sidebar with `hidden lg:block` and render this drawer plus a
// "Filters" button in the sort bar (lg:hidden) to open it.
export default function MobileFilterDrawer({
  open,
  onClose,
  title = "Filters",
  badge,
  children,
}: MobileFilterDrawerProps) {
  // Lock body scroll while drawer is open so the page behind doesn't scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="absolute inset-y-0 left-0 w-[88%] max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_180ms_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#2d8f47]" />
            {title}
            {typeof badge === "number" && badge > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-[#2d8f47] text-white text-xs font-bold">
                {badge}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 -m-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter content (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Sticky footer with the "Show Results" CTA */}
        <div className="px-4 py-3 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 bg-[#2d8f47] hover:bg-[#226b35] text-white rounded-lg font-bold tracking-wide transition-colors"
          >
            Show Results
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
