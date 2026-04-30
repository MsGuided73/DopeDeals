'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface DabsntoolsHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const DABS_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-dabsntools', label: 'All Rigs' },
  { id: 'glass-rigs', label: 'Glass Rigs' },
  { id: 'e-rigs', label: 'E-Rigs' },
  { id: 'portable-rigs', label: 'Portable' },
  { id: 'concentrate-tools', label: 'Tools' },
];

export default function DabsntoolsHero({ activeCategory, setActiveCategory }: DabsntoolsHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          DAB RIGS &amp; <br /> CONCENTRATE TOOLS
        </>
      }
      subhead="Pure Flavor. Precise Hits."
      paragraph="Glass rigs, e-rigs, portable devices, and the tools to run them — built to preserve terpenes and dial in every dab."
      ctaLabel="Learn How to Choose Your Rig"
      illustrationSrc="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/Pipes_Page-Coastal_Road.png"
      illustrationAlt="Highway 420 — coastal road scene"
      pills={DABS_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">🧪 Why Quality Concentrate Gear Matters</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            Premium dab gear preserves terpenes, holds temperature, and turns concentrates into a
            consistent ritual. Whether you're chasing low-temp flavor on a quartz banger or letting
            an e-rig do the work, the right setup is the difference between a dab and a *dab*.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🪟</div>
              <h6 className="font-semibold text-black text-sm mb-1">Glass Rigs</h6>
              <p className="text-xs text-gray-600">Traditional, water-cooled, pure flavor</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">⚡</div>
              <h6 className="font-semibold text-black text-sm mb-1">E-Rigs</h6>
              <p className="text-xs text-gray-600">Set-and-forget temperature precision</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🎒</div>
              <h6 className="font-semibold text-black text-sm mb-1">Portable</h6>
              <p className="text-xs text-gray-600">Take your dabs anywhere</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🛠️</div>
              <h6 className="font-semibold text-black text-sm mb-1">Tools</h6>
              <p className="text-xs text-gray-600">Bangers, dabbers, carb caps</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
