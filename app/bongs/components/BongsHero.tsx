'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface BongsHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const BONGS_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-bongs', label: 'All Bongs' },
  { id: 'beaker-bongs', label: 'Beaker Bongs' },
  { id: 'straight-tubes', label: 'Straight Tubes' },
  { id: 'percolator-bongs', label: 'Percolator Bongs' },
];

export default function BongsHero({ activeCategory, setActiveCategory }: BongsHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          BONGS &amp; <br /> WATER PIPES
        </>
      }
      subhead="Cleaner Hits. Smoother Pulls."
      paragraph="Premium glass designed for better airflow, cooler smoke, and a smoother experience every time."
      ctaLabel="Learn How Bongs Improve Your Sessions"
      illustrationSrc="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/Bong_Bay_T.png"
      illustrationAlt="Highway 420 — creekside road scene"
      pills={BONGS_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🧊 Why Bongs Hit Different</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            Bongs aren&apos;t just bigger pipes — they&apos;re a whole different smoking experience.
            While pipes give you quick hits and joints burn fast, bongs deliver massive, cool,
            filtered hits that let you savor every flavor molecule.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🌊</div>
              <h6 className="font-semibold text-black text-sm mb-1">Water Filtration</h6>
              <p className="text-xs text-gray-600">Removes tar &amp; cools smoke</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">💨</div>
              <h6 className="font-semibold text-black text-sm mb-1">Bigger Hits</h6>
              <p className="text-xs text-gray-600">More capacity, less effort</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🎨</div>
              <h6 className="font-semibold text-black text-sm mb-1">Art Pieces</h6>
              <p className="text-xs text-gray-600">Functional glass art</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
