'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface ThcaPnvHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const THCA_PNV_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-thca-pnv', label: 'All' },
  { id: 'prerolls', label: 'Pre-Rolls' },
  { id: 'cartridges', label: 'Cartridges' },
  { id: 'disposables', label: 'Disposables' },
];

// THCA Pre-Rolls & Vapes hero. Uses the shared CategoryHero with NO illustration —
// keeps the right half clean so the brand-green pills + halo-backed text carry
// the hero on their own (matching the THCA Flower page treatment).
export default function ThcaPnvHero({ activeCategory, setActiveCategory }: ThcaPnvHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          THCA PRE-ROLLS <br /> &amp; VAPES
        </>
      }
      subhead="Lab-Tested. Federally Compliant."
      paragraph="Premium hemp-derived THCA pre-rolls, cartridges, and disposables. Every batch lab-tested for purity and potency, federally compliant under the 2018 Farm Bill."
      ctaLabel="Learn About THCA Pre-Rolls & Vapes"
      // No illustration on this page — keep the right half clean and let the
      // brand-green pills + halo-backed text carry the hero on their own.
      pills={THCA_PNV_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🌿 What are THCA Pre-Rolls &amp; Vapes?</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            THCA is the raw, non-psychoactive precursor to THC. When heated — vaporized in a cartridge,
            disposable, or smoked in a pre-roll — THCA decarboxylates into THC. Federally, hemp-derived
            THCA products are compliant when total Δ9-THC is below 0.3% by dry weight. We lab-test
            every batch and publish the COAs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🧪</div>
              <h6 className="font-semibold text-black text-sm mb-1">Lab Tested</h6>
              <p className="text-xs text-gray-600">COA on every batch</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🚀</div>
              <h6 className="font-semibold text-black text-sm mb-1">Ready to Use</h6>
              <p className="text-xs text-gray-600">Pre-rolls, carts &amp; disposables</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🌾</div>
              <h6 className="font-semibold text-black text-sm mb-1">Hemp-Derived</h6>
              <p className="text-xs text-gray-600">Federally compliant</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
