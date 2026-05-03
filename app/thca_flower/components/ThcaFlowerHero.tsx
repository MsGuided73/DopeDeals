'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface ThcaFlowerHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const FLOWER_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-flower', label: 'All Flower' },
  { id: 'eighth', label: '3.5g' },
  { id: 'quarter', label: '7g' },
  { id: 'half', label: '14g' },
  { id: 'ounce', label: '28g' },
  { id: 'infused-prerolls', label: 'Infused Prerolls' },
];

export default function ThcaFlowerHero({ activeCategory, setActiveCategory }: ThcaFlowerHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          THCA <br /> FLOWER
        </>
      }
      subhead="Lab-Tested. Federally Compliant."
      paragraph="Premium hemp-derived THCA flower in eighths, quarters, halves, and ounces — plus infused prerolls. Cultivated for terpene profile, tested for purity."
      ctaLabel="Learn About THCA Flower"
      illustrationSrc="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/New/Flower%20Category.png"
      illustrationAlt="Highway 420 THCA flower — eighths, quarters, halves, ounces, and infused prerolls"
      pills={FLOWER_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      isLeftAligned={true}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🌿 What is THCA Flower?</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            THCA is the raw, non-psychoactive precursor to THC. When the flower is heated — vaporized,
            smoked, or infused — THCA decarboxylates into THC. Federally, hemp-derived THCA flower
            is compliant when total Δ9-THC is below 0.3% by dry weight. We lab-test every batch
            and publish the COAs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🧪</div>
              <h6 className="font-semibold text-black text-sm mb-1">Lab Tested</h6>
              <p className="text-xs text-gray-600">COA on every batch</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">📦</div>
              <h6 className="font-semibold text-black text-sm mb-1">Discreet Shipping</h6>
              <p className="text-xs text-gray-600">Smell-proof packaging</p>
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
