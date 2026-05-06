import { Truck, Undo2, ShieldCheck } from "lucide-react";
import ShipZipChip from "./ShipZipChip";

const ITEMS = [
  { Icon: Truck, label: "Free shipping over $75" },
  { Icon: Undo2, label: "30-day hassle-free returns" },
  { Icon: ShieldCheck, label: "Discreet, plain packaging" },
] as const;

// Thin global strip that sits above the page masthead on every route.
// Reinforces the same trust signals shown in product page hero stats so
// shoppers don't lose them when scrolling past the hero into the grid.
export default function TrustStrip() {
  return (
    <div className="bg-[#1c352d] text-white text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-x-8 gap-y-1 flex-wrap">
        <div className="flex items-center justify-center gap-x-8 gap-y-1 flex-wrap flex-1">
          {ITEMS.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 whitespace-nowrap">
              <Icon className="w-4 h-4 text-[#5EB499]" strokeWidth={2} aria-hidden="true" />
              <span className="font-medium tracking-wide">{label}</span>
            </div>
          ))}
        </div>
        <ShipZipChip />
      </div>
    </div>
  );
}
