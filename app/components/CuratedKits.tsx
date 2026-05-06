import Image from "next/image";
import Link from "next/link";
import { Leaf, FlaskConical, Droplet, Briefcase, ArrowRight } from "lucide-react";

export default function CuratedKits() {
  return (
    <section className="bg-[#f2efe8] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
          <span style={{ fontFamily: "'Fira Sans','Inter',sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2F6B3A', display: 'inline-block', borderBottom: '2px solid #2F6B3A', paddingBottom: '4px', margin: '0 0 10px' }}>
            Everything You Need. Ready To Ride.
          </span>
          <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: '#1c1208', fontSize: 'clamp(32px,5vw,64px)', fontWeight: 400, lineHeight: 1, letterSpacing: '0.02em', margin: '6px 0 8px' }}>
            CURATED KITS
          </h2>
          <p style={{ fontFamily: "'Fira Sans','Inter',sans-serif", fontSize: '15px', color: '#5B6560', margin: 0, lineHeight: 1.5 }}>
            Bundles for every kind of session.
          </p>
          <div style={{ borderTop: '1px dashed rgba(20,92,60,0.4)', margin: '20px auto 0', maxWidth: '360px' }} />
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* The Starter Kit */}
          <div className="bg-[#1a1c19] rounded-xl overflow-hidden flex flex-col group border border-[#2a2c29] shadow-lg">
            <div className="relative aspect-[5/4] w-full bg-[#121411]">
              <Image 
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Bundles/Starter%20Kit.png" 
                alt="The Starter Kit" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-4 left-4 bg-[#3a5a3a] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider z-10 text-center leading-tight">
                Perfect<br/>Start
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow relative z-20 bg-[#1a1c19]">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="text-[#dfca97] w-6 h-6" strokeWidth={1.5} />
                <h3 className="text-[#dfca97] font-bold text-xl uppercase tracking-wider">The Starter Kit</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed">
                Everything you need to get rolling with ease.
              </p>
              <Link 
                href="/collections/starter-kits" 
                className="bg-[#48663e] hover:bg-[#3b5433] transition-colors text-white text-sm font-bold py-3 px-4 rounded text-center w-full uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Shop This Setup <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* The Bong Setup */}
          <div className="bg-[#1a1c19] rounded-xl overflow-hidden flex flex-col group border border-[#2a2c29] shadow-lg">
            <div className="relative aspect-[5/4] w-full bg-[#121411]">
              <Image 
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Bundles/Bong%20Kit.png" 
                alt="The Bong Setup" 
                fill 
                className="object-cover object-[50%_35%] transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="p-6 flex flex-col flex-grow relative z-20 bg-[#1a1c19]">
              <div className="flex items-center gap-3 mb-3">
                <FlaskConical className="text-[#dfca97] w-6 h-6" strokeWidth={1.5} />
                <h3 className="text-[#dfca97] font-bold text-xl uppercase tracking-wider">The Bong Setup</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed">
                Timeless pieces for smooth, reliable sessions.
              </p>
              <Link 
                href="/collections/bong-bundles" 
                className="bg-[#48663e] hover:bg-[#3b5433] transition-colors text-white text-sm font-bold py-3 px-4 rounded text-center w-full uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Shop This Setup <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* The Dab Setup */}
          <div className="bg-[#1a1c19] rounded-xl overflow-hidden flex flex-col group border border-[#2a2c29] shadow-lg">
            <div className="relative aspect-[5/4] w-full bg-[#121411]">
              <Image 
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Bundles/Dab%20kit.png" 
                alt="The Dab Setup" 
                fill 
                className="object-cover object-[50%_35%] transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="p-6 flex flex-col flex-grow relative z-20 bg-[#1a1c19]">
              <div className="flex items-center gap-3 mb-3">
                <Droplet className="text-[#dfca97] w-6 h-6" strokeWidth={1.5} />
                <h3 className="text-[#dfca97] font-bold text-xl uppercase tracking-wider">The Dab Setup</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed">
                Elevate your experience with cleaner hits and richer flavor.
              </p>
              <Link 
                href="/collections/dab-bundles" 
                className="bg-[#48663e] hover:bg-[#3b5433] transition-colors text-white text-sm font-bold py-3 px-4 rounded text-center w-full uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Shop This Setup <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* The Travel Kit */}
          <div className="bg-[#1a1c19] rounded-xl overflow-hidden flex flex-col group border border-[#2a2c29] shadow-lg">
            <div className="relative aspect-[5/4] w-full bg-[#121411]">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Bundles/Travel%20kit.png"
                alt="The High Roller Kit"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-[#3a5a3a] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider z-10 text-center leading-tight">
                Top<br/>Shelf
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow relative z-20 bg-[#1a1c19]">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="text-[#dfca97] w-6 h-6" strokeWidth={1.5} />
                <h3 className="text-[#dfca97] font-bold text-xl uppercase tracking-wider">The High Roller Kit</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed">
                Premium picks for elevated sessions.
              </p>
              <Link
                href="/collections/travel-kits"
                className="bg-[#48663e] hover:bg-[#3b5433] transition-colors text-white text-sm font-bold py-3 px-4 rounded text-center w-full uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Shop This Setup <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Banner */}
        <div className="mt-8 flex justify-center">
          <div className="bg-[#e6e2d6] rounded-xl py-1.5 px-6 inline-flex items-center justify-center gap-3 shadow-sm border border-[#d8d4c7]">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <Image
                 src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Bundles/Black%20LogoTB.png"
                alt="Highway 420 Logo"
                fill
                className="object-contain scale-[1.65]"
              />
            </div>
            <p className="text-[#1a1c19] font-bold text-base uppercase tracking-[0.14em] whitespace-nowrap">
              Bundled For The Long Haul.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
