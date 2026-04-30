"use client";

import { Repeat, MousePointer2, LayoutGrid } from "lucide-react";
import type { ProductViewMode } from "./AutoScrollContainer";

interface ViewModeToggleProps {
  mode: ProductViewMode;
  onChange: (mode: ProductViewMode) => void;
  className?: string;
}

const OPTIONS: Array<{ id: ProductViewMode; label: string; Icon: typeof Repeat }> = [
  { id: "auto", label: "Auto Scroll", Icon: Repeat },
  { id: "manual", label: "Manual", Icon: MousePointer2 },
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
      className={`inline-flex items-center rounded-md border border-gray-300 bg-gray-100 p-1 gap-1 ${className}`}
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
            // Selected button gets a raised, 3D look: white surface, brand-green
            // border, layered shadow that lifts it off the gray track. Inactive
            // buttons sit flush in the track with no border or shadow.
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-150 ${
              active
                ? "bg-white text-[#2d8f47] border-2 border-[#2d8f47] shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_8px_rgba(45,143,71,0.18)] -translate-y-px"
                : "border-2 border-transparent text-gray-600 hover:text-[#2d8f47] hover:bg-white/60"
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
