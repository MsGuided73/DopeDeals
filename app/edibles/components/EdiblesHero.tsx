'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface EdiblesHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const EDIBLES_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-edibles', label: 'All Edibles' },
  { id: 'gummies', label: 'Gummies' },
  { id: 'chocolates', label: 'Chocolates' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'tinctures', label: 'Tinctures' },
];

export default function EdiblesHero({ activeCategory, setActiveCategory }: EdiblesHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          EDIBLES &amp; <br /> WELLNESS
        </>
      }
      subhead="Tasty. Precise. Lab-Tested."
      paragraph="Premium hemp-derived edibles — gummies, chocolates, beverages, and tinctures — dosed for consistency and crafted for everyday wellness."
      ctaLabel="Learn About Edibles"
      illustrationSrc="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/New/THCA%20EDIBLES%20category%20final.png"
      illustrationAlt="Highway 420 THCA edibles — gummies, chocolates, beverages, and tinctures"
      pills={EDIBLES_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      isLeftAligned={true}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🍬 Why Edibles?</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            Edibles deliver a smoke-free experience with longer-lasting effects. Each batch is lab-tested
            for cannabinoid potency and purity, with clearly labeled doses so you always know what you&apos;re
            getting. From low-dose CBD gummies to functional beverages, there&apos;s an edible for every routine.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🧪</div>
              <h6 className="font-semibold text-black text-sm mb-1">Lab Tested</h6>
              <p className="text-xs text-gray-600">COA on every batch</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🎯</div>
              <h6 className="font-semibold text-black text-sm mb-1">Precise Dosing</h6>
              <p className="text-xs text-gray-600">Consistent per-piece potency</p>
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
