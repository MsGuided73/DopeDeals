"use client";

import { Repeat, MousePointer2, LayoutGrid } from "lucide-react";
import type { ProductViewMode } from "./AutoScrollContainer";

interface ViewModeToggleProps {
  mode: ProductViewMode;
  onChange: (mode: ProductViewMode) => void;
  className?: string;
}

const OPTIONS: Array<{ id: ProductViewMode; label: string; Icon: typeof Repeat }> = [
  { id: "auto", label: "Auto", Icon: Repeat },
  { id: "manual", label: "Scroll", Icon: MousePointer2 },
  { id: "grid", label: "Grid", Icon: LayoutGrid },
];

// Three-state segment control used on the homepage product carousels
// (Hot Products / Fresh Drops / Dope Deals) to let users pick between
// continuous auto-scroll, manual scroll, or grid layout.
export default function ViewModeToggle({ mode, onChange, className = "" }: ViewModeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Product view mode"
      className={`inline-flex items-center rounded-md border border-gray-300 bg-white p-0.5 ${className}`}
    >
      {OPTIONS.map(({ id, label, Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              active
                ? "bg-[#2d8f47] text-white shadow-sm"
                : "text-gray-600 hover:text-[#2d8f47] hover:bg-gray-50"
            }`}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
