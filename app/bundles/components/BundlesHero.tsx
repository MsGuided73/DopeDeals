'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface BundlesHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const BUNDLES_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-bundles', label: 'All Bundles' },
  { id: 'glass-bundles', label: 'Glass' },
  { id: 'vape-bundles', label: 'Vape' },
  { id: 'flower-bundles', label: 'Flower' },
  { id: 'starter-bundles', label: 'Starter Kits' },
];

// Bundles hero — uses the shared CategoryHero template with NO illustration,
// matching the THCA Flower text-only treatment. Pills map to bundle types
// derived from the product name (glass / vape / flower / starter).
export default function BundlesHero({ activeCategory, setActiveCategory }: BundlesHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          BUNDLE <br /> DEALS
        </>
      }
      subhead="Save More. Smoke Better."
      paragraph="Hand-picked combinations of our best gear at a better price. Stack glass, flower, vapes, and accessories for every kind of session."
      ctaLabel="Why Bundle?"
      // No illustration on this page — keep the right half clean and let the
      // brand-green pills + halo-backed text carry the hero on their own.
      pills={BUNDLES_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🎁 Why Bundle?</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            Bundles are the smartest way to gear up. Buy the pieces you'd grab anyway, together,
            for less than buying them solo. Curated by our team to make sure every combo actually
            works in real-world sessions — no filler, just the good stuff.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">💸</div>
              <h6 className="font-semibold text-black text-sm mb-1">Better Pricing</h6>
              <p className="text-xs text-gray-600">Real savings vs. buying solo</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🧰</div>
              <h6 className="font-semibold text-black text-sm mb-1">Curated Combos</h6>
              <p className="text-xs text-gray-600">Pieces that actually pair well</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">📦</div>
              <h6 className="font-semibold text-black text-sm mb-1">One Box</h6>
              <p className="text-xs text-gray-600">Free shipping over $75</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
