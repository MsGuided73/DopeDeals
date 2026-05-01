import Image from "next/image";
import Link from "next/link";
import { Leaf, FlaskConical, Droplet, Briefcase, ArrowRight } from "lucide-react";

export default function CuratedKits() {
  return (
    <section className="bg-[#f2efe8] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
          <p className="text-[#415d39] font-black tracking-[0.25em] text-xl mb-3 uppercase">
            EVERYTHING YOU NEED. READY TO RIDE.
          </p>
          <div style={{ height: '4px', width: '48px', background: 'transparent', borderTop: '1px solid #1B7A4D', borderBottom: '1px solid #1B7A4D', margin: '0 auto 14px' }} />
          <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: '#1c1208', fontSize: 'clamp(32px,5vw,64px)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
            CURATED KITS
          </h2>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: '10px 0 0', maxWidth: '500px', marginInline: 'auto', lineHeight: 1.5 }}>
            Bundles for every kind of session.
          </p>
          <div style={{ borderTop: '1px dashed rgba(20,92,60,0.4)', margin: '20px auto 0', maxWidth: '360px' }} />
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* The Starter Kit */}
          <div className="bg-[#1a1c19] rounded-xl overflow-hidden flex flex-col group border border-[#2a2c29] shadow-lg">
            <div className="relative h-[250px] w-full bg-[#121411]">
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
            <div className="relative h-[250px] w-full bg-[#121411]">
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
            <div className="relative h-[250px] w-full bg-[#121411]">
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
            <div className="relative h-[250px] w-full bg-[#121411]">
              <Image 
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Bundles/Travel%20kit.png" 
                alt="The Travel Kit" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-4 left-4 bg-[#3a5a3a] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider z-10 text-center leading-tight">
                Built For<br/>Adventure
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow relative z-20 bg-[#1a1c19]">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="text-[#dfca97] w-6 h-6" strokeWidth={1.5} />
                <h3 className="text-[#dfca97] font-bold text-xl uppercase tracking-wider">The Travel Kit</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed">
                Compact, discreet, and built for sessions anywhere.
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
          <div className="bg-[#e6e2d6] rounded-xl py-1.5 px-4 inline-flex flex-col md:flex-row items-center justify-center gap-4 shadow-sm border border-[#d8d4c7]">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <Image 
                   src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Bundles/Black%20LogoTB.png"
                  alt="Highway 420 Logo"
                  fill
                  className="object-contain scale-[1.65]"
                />
              </div>
              <p className="text-[#1a1c19] font-medium text-base">Not sure which setup is right for you?</p>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-400 opacity-50"></div>
            <Link 
              href="/collections/bundles" 
              className="text-[#415d39] font-bold hover:text-[#2d4227] transition-colors flex items-center gap-2 text-base group whitespace-nowrap"
            >
              Compare Bundles 
              <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
