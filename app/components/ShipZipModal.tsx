"use client";

import { useEffect, useState } from "react";
import { X, MapPin, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { isValidZip, readShipZipFromDocument, writeShipZipToDocument } from "../../lib/ship-zip";

type CategoryRow = {
  category: string;
  status: "restricted";
  ageRequirement: number | null;
  shippingRestrictions: Record<string, unknown> | null;
};

type EligibilityResponse = {
  zip: string;
  state: string;
  city?: string;
  county?: string;
  restrictedCategories: string[];
  categoryGrid: CategoryRow[];
  warning?: string;
};

interface Props {
  open: boolean;
  initialZip?: string | null;
  onClose: () => void;
  onSaved?: (zip: string) => void;
}

export default function ShipZipModal({ open, initialZip, onClose, onSaved }: Props) {
  const [zip, setZip] = useState(initialZip ?? "");
  const [data, setData] = useState<EligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setZip(initialZip ?? readShipZipFromDocument() ?? "");
    setError(null);
  }, [open, initialZip]);

  useEffect(() => {
    if (!open || !isValidZip(zip)) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/eligibility?zip=${encodeURIComponent(zip)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j: EligibilityResponse) => {
        if (cancelled) return;
        setData(j);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ?? "Lookup failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [zip, open]);

  function handleSave() {
    if (!isValidZip(zip)) {
      setError("Enter a valid 5-digit ZIP");
      return;
    }
    writeShipZipToDocument(zip);
    onSaved?.(zip);
    onClose();
  }

  if (!open) return null;

  const restricted = new Set(data?.restrictedCategories ?? []);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ship-zip-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="bg-[#1c352d] text-white px-6 py-5">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#ff6b35]" />
            <div>
              <h2 id="ship-zip-title" className="text-xl font-semibold tracking-wide">
                Check shipping eligibility
              </h2>
              <p className="text-xs text-white/70 mt-0.5">
                Enter your ZIP to see which categories ship to your address.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-2">
            <input
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="ZIP code"
              className="flex-1 h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#ff6b35] outline-none text-lg tracking-widest"
            />
            <button
              onClick={handleSave}
              disabled={!isValidZip(zip) || loading}
              className="h-12 px-5 rounded-lg bg-[#ff6b35] text-white font-semibold uppercase tracking-wide disabled:opacity-50"
            >
              Save
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {error}
            </p>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-gray-600 text-sm py-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Checking {zip}...
            </div>
          )}

          {data && (
            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{data.city ?? ""}{data.city ? ", " : ""}{data.state}</span>
                {data.county ? <span className="text-gray-500"> · {data.county} County</span> : null}
              </div>

              {data.categoryGrid.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-900">No category restrictions for {data.state}</p>
                    <p className="text-green-700 mt-1">
                      Standard categories ship to your area. Some products may still have age or quantity limits at checkout.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Restricted in {data.state}
                  </p>
                  <ul className="space-y-1.5">
                    {data.categoryGrid.map((row) => (
                      <li key={row.category} className="flex items-center gap-3 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900">{row.category}</span>
                        {row.ageRequirement && (
                          <span className="text-xs text-gray-500">(age {row.ageRequirement}+)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {data.warning && (
                    <p className="text-xs text-gray-600 italic mt-2">{data.warning}</p>
                  )}
                </>
              )}
            </div>
          )}

          <p className="text-[11px] text-gray-400 leading-relaxed">
            We use this ZIP only to determine which products can legally ship to you. We don't share it.
          </p>
        </div>
      </div>
    </div>
  );
}
