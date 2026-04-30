'use client';

import CategoryHero, { type CategoryHeroPill } from '../../components/CategoryHero';

interface VapesHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const VAPES_PILLS: ReadonlyArray<CategoryHeroPill> = [
  { id: 'all-vapes', label: 'All Vapes' },
  { id: 'cartridges', label: 'Cartridges' },
  { id: 'disposables', label: 'Disposables' },
  { id: 'vaporizers', label: 'Vaporizers' },
];

export default function ThcaPnvHero({ activeCategory, setActiveCategory }: VapesHeroProps) {
  return (
    <CategoryHero
      headline={
        <>
          VAPES &amp; <br /> CARTRIDGES
        </>
      }
      subhead="Pure Hits. On the Go."
      paragraph="Premium cartridges, disposables, and hardware built for clean draws and consistent flavor — anywhere the road takes you."
      ctaLabel="Learn How to Choose Your Vape"
      illustrationSrc="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/Vapes-CreekSide420Series.png"
      illustrationAlt="Highway 420 — CreekSide 420 Series vapes"
      pills={VAPES_PILLS}
      activePillId={activeCategory}
      onPillChange={setActiveCategory}
      heroBgClassName="bg-[#F8F5EE]"
      haloColorRGB="248,245,238"
      expandedContent={
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
          <h4 className="text-xl font-semibold text-black mb-4">💨 Why Vapes Win for On-the-Go</h4>
          <p className="text-gray-700 text-base mb-4 leading-relaxed">
            Vapes deliver clean, controlled hits without the smoke, the smell, or the cleanup.
            Whether you want pre-loaded convenience, refillable hardware, or a draw-activated
            disposable — there's a format that fits your day.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🔋</div>
              <h6 className="font-semibold text-black text-sm mb-1">Cartridges</h6>
              <p className="text-xs text-gray-600">510-thread, swap into any battery</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">⚡</div>
              <h6 className="font-semibold text-black text-sm mb-1">Disposables</h6>
              <p className="text-xs text-gray-600">All-in-one, no charging or refilling</p>
            </div>
            <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
              <div className="text-2xl mb-2">🧪</div>
              <h6 className="font-semibold text-black text-sm mb-1">Vaporizers</h6>
              <p className="text-xs text-gray-600">Premium hardware for connoisseurs</p>
            </div>
          </div>
        </div>
      }
    />
  );
}
