'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface PipesHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const PIPES_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-pipes', label: 'All Pipes' },
  { id: 'spoon-pipes', label: 'Spoon' },
  { id: 'sherlock-pipes', label: 'Sherlock' },
  { id: 'chillums', label: 'Chillums' },
  { id: 'one-hitters', label: 'One-Hitters' },
];

// Hand pipes / glass pipes hero. Uses the shared CategoryHero template so
// it inherits the same illustration anchoring, halo behind text, and
// brand-green pill styling validated on the bongs page.
//
// TODO: swap illustrationSrc for a hand-pipes-specific illustration when
// the asset is ready. Using the bongs creekside scene as a placeholder so
// the visual rhythm is consistent during the rollout.
export default function PipesHero({ activeCategory, setActiveCategory }: PipesHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          GLASS &amp; <br /> HAND PIPES
        </>
      }
      subhead="Pocket Power. Pure Glass."
      paragraph="Hand-blown pipes crafted for everyday sessions. Smooth draws, premium materials, and styles for every preference."
      ctaLabel="Learn How to Choose Your Pipe"
      illustrationSrc="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/CreeksideRoad2-5T.png"
      illustrationAlt="Highway 420 — creekside road scene"
      pills={PIPES_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🔥 Why Hand Pipes Still Win</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            Hand pipes are the most versatile piece in any collection — quick to load, easy to clean,
            and packed with character. From the everyday spoon to the iconic Sherlock, each style
            offers a different draw and personality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🥄</div>
              <h6 className="font-semibold text-black text-sm mb-1">Spoon Pipes</h6>
              <p className="text-xs text-gray-600">Classic, compact, all-purpose</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🕵️</div>
              <h6 className="font-semibold text-black text-sm mb-1">Sherlocks</h6>
              <p className="text-xs text-gray-600">Curved stem, smoother draw</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🚀</div>
              <h6 className="font-semibold text-black text-sm mb-1">One-Hitters</h6>
              <p className="text-xs text-gray-600">Discreet, single-hit sessions</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
