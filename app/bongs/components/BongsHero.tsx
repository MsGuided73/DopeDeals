'use client';
import Image from 'next/image';
import { useState } from 'react';

interface BongsHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function BongsHero({ activeCategory, setActiveCategory }: BongsHeroProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#ffffff] w-full border-b border-gray-200 relative overflow-hidden">
      {/* Hero photo — full viewport width so the illustration reads larger,
          anchored to the right at its natural aspect ratio. The text column
          below sits on its own white panel so the illustration that bleeds
          behind the text doesn't compete with it. */}
      <div className="absolute inset-0 hidden md:block pointer-events-none overflow-hidden z-0">
        <Image
          src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Product_Pages/CreeksideRoad3T.png"
          alt="Highway 420 — creekside road scene"
          fill
          sizes="(min-width: 768px) 100vw, 0px"
          className="object-contain object-right"
          priority
        />
      </div>

      {/* Hero Content Section — full viewport width so the headline reaches the page edge.
          z-30 lifts the section above the category pills strip so the stats card,
          which floats below the hero, doesn't get clipped behind the pills bar. */}
      <div className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center min-h-[600px] z-30">

          {/* Left Column - Text — content centered horizontally within the left half.
              Inner div uses a radial-gradient white panel that's solid in the middle
              and feathers to transparent at the edges, so the headline sits on a
              readable surface but there's no hard rectangle where it meets the
              illustration. */}
          <div className="w-full md:w-1/2 z-10 relative">
            <div
              className="max-w-xl mx-auto p-6 lg:p-8"
              style={{
                background:
                  'radial-gradient(ellipse 90% 100% at center, #ffffff 55%, rgba(255,255,255,0.85) 75%, rgba(255,255,255,0.4) 90%, transparent 100%)',
              }}
            >
            <h1 className="font-chalets text-[3.5rem] leading-[0.9] md:text-[5rem] lg:text-[6rem] text-[#1a1a1a] font-bold uppercase tracking-tight mb-4">
              BONGS & <br /> WATER PIPES
            </h1>
            
            <h2 className="text-[#2d8f47] text-2xl md:text-3xl font-bold mb-3">
              Cleaner Hits. Smoother Pulls.
            </h2>
            
            <p className="text-gray-700 text-lg max-w-lg mb-8 leading-relaxed font-medium">
              Premium glass designed for better airflow, cooler smoke, and a smoother experience every time.
            </p>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center px-5 py-3 border-2 border-[#2d8f47] text-[#2d8f47] bg-white rounded font-semibold hover:bg-green-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Learn How Bongs Improve Your Sessions
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out absolute top-full left-0 w-full z-20 ${isExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xl">
                <h4 className="text-xl font-semibold text-black mb-4">🧊 Why Bongs Hit Different</h4>
                <p className="text-gray-700 text-base mb-4 leading-relaxed">
                  Bongs aren't just bigger pipes — they're a whole different smoking experience. While pipes give you quick hits and joints burn fast,
                  bongs deliver massive, cool, filtered hits that let you savor every flavor molecule.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#2d8f47]/10 rounded-lg p-4 text-center border border-[#2d8f47]/20">
                    <div className="text-2xl mb-2">🌊</div>
                    <h6 className="font-semibold text-black text-sm mb-1">Water Filtration</h6>
                    <p className="text-xs text-gray-600">Removes tar & cools smoke</p>
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
            </div>
            </div>
          </div>

          {/* Category Pills wrapper — anchored to the bottom of the left half.
              The inner row uses a calc'd padding-left that matches the centering
              offset of the headline's max-w-xl wrapper, so the first pill's left
              edge lines up exactly with the headline's left edge. The row itself
              has no max-width, so it can extend the full width of the left half
              without being clipped. */}
          <div className="w-full md:w-1/2 absolute left-0 top-0 h-full hidden md:flex flex-col justify-end pointer-events-none z-10">
            <div
              className="absolute bottom-6 left-0 right-4 flex flex-nowrap gap-3 pointer-events-auto z-20"
              style={{ paddingLeft: 'max(1rem, calc((100% - 36rem) / 2))' }}
            >
              <button
                onClick={() => setActiveCategory('all-bongs')}
                className={`whitespace-nowrap px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                  activeCategory === 'all-bongs'
                    ? 'bg-[#2d8f47] text-white shadow-md border-2 border-[#2d8f47]'
                    : 'bg-white text-[#2d8f47] border-2 border-[#2d8f47] hover:bg-[#2d8f47] hover:text-white'
                }`}
              >
                All Bongs
              </button>
              <button
                onClick={() => setActiveCategory('beaker-bongs')}
                className={`whitespace-nowrap px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                  activeCategory === 'beaker-bongs'
                    ? 'bg-[#2d8f47] text-white shadow-md border-2 border-[#2d8f47]'
                    : 'bg-white text-[#2d8f47] border-2 border-[#2d8f47] hover:bg-[#2d8f47] hover:text-white'
                }`}
              >
                Beaker Bongs
              </button>
              <button
                onClick={() => setActiveCategory('straight-tubes')}
                className={`whitespace-nowrap px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                  activeCategory === 'straight-tubes'
                    ? 'bg-[#2d8f47] text-white shadow-md border-2 border-[#2d8f47]'
                    : 'bg-white text-[#2d8f47] border-2 border-[#2d8f47] hover:bg-[#2d8f47] hover:text-white'
                }`}
              >
                Straight Tubes
              </button>
              <button
                onClick={() => setActiveCategory('percolator-bongs')}
                className={`whitespace-nowrap px-5 py-2.5 text-sm md:text-base rounded-lg font-bold transition-all duration-200 ${
                  activeCategory === 'percolator-bongs'
                    ? 'bg-[#2d8f47] text-white shadow-md border-2 border-[#2d8f47]'
                    : 'bg-white text-[#2d8f47] border-2 border-[#2d8f47] hover:bg-[#2d8f47] hover:text-white'
                }`}
              >
                Percolator Bongs
              </button>
            </div>
          </div>

        </div>

    </div>
  );
}
