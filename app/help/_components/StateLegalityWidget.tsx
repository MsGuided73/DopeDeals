"use client";

import { useMemo, useState } from "react";
import { Check, MapPin, ShieldAlert, ShieldCheck } from "lucide-react";
import type { ComplianceRule } from "../../../lib/compliance-rules-server";

/**
 * Customer-facing live state-legality picker.
 *
 * Reads compliance rules passed in from the server (fetched fresh on every
 * page render) and lets a visitor pick their state to see which cannabinoid
 * categories ship there. Categories the merchandiser flags as restricted in
 * the visitor's state render with a red "Restricted" badge plus the editor
 * note; everything else renders with a green "Allowed" badge.
 *
 * To update what a state sees: edit the `compliance_rules` row in Supabase.
 * No code change required.
 */

const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" }, { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" }, { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" }, { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" }, { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" }, { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" }, { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" }, { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

interface Props {
  rules: ComplianceRule[];
}

export default function StateLegalityWidget({ rules }: Props) {
  const [stateCode, setStateCode] = useState<string>("");

  const { restricted, allowed, totalAge } = useMemo(() => {
    if (!stateCode) return { restricted: [] as ComplianceRule[], allowed: [] as ComplianceRule[], totalAge: 21 };
    const restricted: ComplianceRule[] = [];
    const allowed: ComplianceRule[] = [];
    let maxAge = 21;
    for (const rule of rules) {
      if (rule.restricted_states.includes(stateCode)) restricted.push(rule);
      else allowed.push(rule);
      if (rule.age_requirement > maxAge) maxAge = rule.age_requirement;
    }
    return { restricted, allowed, totalAge: maxAge };
  }, [rules, stateCode]);

  const selectedState = US_STATES.find((s) => s.code === stateCode);

  return (
    <section className="rounded-xl border border-[#e5e1d8] bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-[#1B4332]/10 flex items-center justify-center text-[#1B4332] shrink-0">
          <MapPin className="w-6 h-6" aria-hidden />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900 leading-tight">
            Check What Ships to Your State
          </h3>
          <p className="text-sm md:text-[15px] text-neutral-600 mt-1 leading-relaxed">
            Hemp-cannabinoid laws change quickly. Pick your state to see which categories we can ship there
            today &mdash; pulled live from our compliance database.
          </p>
        </div>
      </div>

      <label className="block">
        <span className="sr-only">Select your state</span>
        <select
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
          className="w-full md:max-w-md rounded-md border border-neutral-300 bg-white px-4 py-3 text-[15px] text-neutral-900 outline-none focus:border-[#1B7A4D] transition-colors"
        >
          <option value="">— Select your state —</option>
          {US_STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
      </label>

      {!stateCode && (
        <p className="mt-4 text-[13px] text-neutral-500">
          Select a state to see your compliance breakdown.
        </p>
      )}

      {stateCode && (
        <div className="mt-6 space-y-5">
          {/* Summary banner */}
          <div className="rounded-md border border-[#e5e1d8] bg-[#f7f4ec] p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1B7A4D] shrink-0 mt-0.5" aria-hidden />
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-neutral-900">
                {restricted.length === 0
                  ? `Good news — every category we ship is currently allowed in ${selectedState?.name}.`
                  : `${restricted.length} of ${rules.length} categories are restricted in ${selectedState?.name}.`}
              </p>
              <p className="text-[12.5px] text-neutral-600 mt-1">
                Minimum age to order: <strong>{totalAge}+</strong>. Verification required at checkout.
              </p>
            </div>
          </div>

          {/* Restricted categories */}
          {restricted.length > 0 && (
            <div>
              <h4 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#B23A48] mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" aria-hidden /> Cannot Ship to {selectedState?.name}
              </h4>
              <ul className="space-y-2">
                {restricted.map((rule) => (
                  <li
                    key={rule.category}
                    className="rounded-md border border-[#f0d3d6] bg-[#fbf3f4] p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold tracking-[0.14em] uppercase rounded bg-[#B23A48] text-white">
                        Restricted
                      </span>
                      <span className="text-[14px] font-bold text-neutral-900">{rule.category}</span>
                    </div>
                    {rule.description && (
                      <p className="text-[13px] text-neutral-700 leading-snug">
                        {rule.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Allowed categories */}
          {allowed.length > 0 && (
            <div>
              <h4 className="text-[13px] font-bold tracking-[0.14em] uppercase text-[#1B7A4D] mb-2 flex items-center gap-2">
                <Check className="w-4 h-4" aria-hidden /> Available in {selectedState?.name}
              </h4>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allowed.map((rule) => (
                  <li
                    key={rule.category}
                    className="rounded-md border border-[#d8e6cf] bg-[#f0f5e8] px-3 py-2 text-[13px] font-semibold text-[#1B4332]"
                  >
                    {rule.category}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[12px] text-neutral-500 leading-relaxed border-t border-neutral-200 pt-3">
            Restrictions are enforced at checkout based on the shipping address. Laws change frequently &mdash;
            this list reflects what our compliance team has loaded as of your visit. Questions?{" "}
            <a href="/contact" className="text-[#1B7A4D] underline hover:text-[#133221]">Contact us</a>.
          </p>
        </div>
      )}
    </section>
  );
}
