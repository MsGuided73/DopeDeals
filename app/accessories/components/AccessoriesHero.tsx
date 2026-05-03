'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface AccessoriesHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const ACCESSORIES_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-accessories', label: 'All Accessories' },
  { id: 'grinders', label: 'Grinders' },
  { id: 'torches', label: 'Torches' },
  { id: 'ashtrays', label: 'Ashtrays' },
  { id: 'storage', label: 'Storage' },
];

// Smoking accessories hero. Uses the shared CategoryHero template with the
// Accessories illustration anchored to the right half.
export default function AccessoriesHero({ activeCategory, setActiveCategory }: AccessoriesHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          SMOKING <br /> ACCESSORIES
        </>
      }
      subhead="Everything Else You Need."
      paragraph="The supporting cast that makes every session better — lighters, torches, ashtrays, and stash storage. Functional, durable, built to last."
      ctaLabel="See Why Accessories Matter"
      illustrationSrc="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/New/accessories%20version%20a.png"
      illustrationAlt="Highway 420 smoking accessories — lighters, torches, ashtrays, and stash storage"
      pills={ACCESSORIES_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      isLeftAligned={true}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🔧 The Right Tools for the Job</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            A great session lives and dies by the small stuff. The right lighter or torch makes
            every bowl burn evenly. A solid ashtray keeps your space clean. Airtight storage
            preserves freshness. We curate accessories that pull their weight.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🔥</div>
              <h6 className="font-semibold text-black text-sm mb-1">Lighters &amp; Torches</h6>
              <p className="text-xs text-gray-600">Reliable flame, every time</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🪨</div>
              <h6 className="font-semibold text-black text-sm mb-1">Ashtrays</h6>
              <p className="text-xs text-gray-600">Glass, stone, ceramic</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🫙</div>
              <h6 className="font-semibold text-black text-sm mb-1">Storage</h6>
              <p className="text-xs text-gray-600">Airtight, smell-proof</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
