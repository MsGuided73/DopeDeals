'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface PreRollsHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const PRE_ROLLS_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-pre-rolls', label: 'All Pre-Rolls' },
  { id: 'singles', label: 'Singles' },
  { id: 'multi-packs', label: 'Multi-Packs' },
  { id: 'infused', label: 'Infused' },
  { id: 'indica', label: 'Indica' },
  { id: 'sativa', label: 'Sativa' },
  { id: 'hybrid', label: 'Hybrid' },
];

export default function PreRollsHero({ activeCategory, setActiveCategory }: PreRollsHeroProps) {
  return (
    <CategoryHero
      headline={<>PRE-ROLLS</>}
      subhead="Roll Up. Light Up."
      paragraph="Expertly rolled, ready-to-smoke joints in singles and multi-packs. From classic strain-specific pre-rolls to potent infused options — premium flower in every paper."
      ctaLabel="Learn About Our Pre-Rolls"
      // No illustration on this page — keep the right half clean and let the
      // brand-green pills + halo-backed text carry the hero on their own.
      pills={PRE_ROLLS_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🚬 Why Buy Pre-Rolls?</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            Pre-rolls are the easiest way to enjoy your favorite strain — no grinder, no rolling
            paper, no fuss. We pack ours with premium ground flower, evenly tamped for a slow
            burn and full flavor from first puff to last.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🌿</div>
              <h6 className="font-semibold text-black text-sm mb-1">Premium Flower</h6>
              <p className="text-xs text-gray-600">Top-shelf bud, never trim</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🔥</div>
              <h6 className="font-semibold text-black text-sm mb-1">Slow Burning</h6>
              <p className="text-xs text-gray-600">Even pack, smooth draw</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🧪</div>
              <h6 className="font-semibold text-black text-sm mb-1">Lab Tested</h6>
              <p className="text-xs text-gray-600">COA on every batch</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
