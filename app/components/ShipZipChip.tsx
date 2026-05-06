"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { readShipZipFromDocument } from "../../lib/ship-zip";
import ShipZipModal from "./ShipZipModal";

export default function ShipZipChip() {
  const [zip, setZip] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setZip(readShipZipFromDocument());
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-xs md:text-sm font-medium tracking-wide transition-colors"
        aria-label={zip ? `Shipping to ${zip} — change` : "Set shipping ZIP"}
      >
        <MapPin className="w-4 h-4 text-[#5EB499]" strokeWidth={2} />
        {zip ? (
          <>
            <span className="hidden sm:inline">Shipping to</span>
            <span className="font-semibold">{zip}</span>
            <span className="hidden md:inline text-white/60">— change</span>
          </>
        ) : (
          <span>Set ship ZIP</span>
        )}
      </button>
      <ShipZipModal
        open={open}
        initialZip={zip}
        onClose={() => setOpen(false)}
        onSaved={(z) => setZip(z)}
      />
    </>
  );
}
