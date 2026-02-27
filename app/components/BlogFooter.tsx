"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function BlogFooter() {
  return (
    <footer className="relative bg-[#000] text-white overflow-hidden border-t-2 border-[#ff6b35]/20">
      
      {/* MASSIVE BACKGROUND TEXT (Cinematic Callout) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-10">
        <h2 
          className="text-[15vw] font-black uppercase tracking-tighter text-transparent stroke-white"
          style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.4)' }}
        >
          HIGHWAY 420
        </h2>
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 pt-24 pb-12 flex flex-col min-h-[50vh] justify-between">
        
        {/* TOP SECTION: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          
          {/* LEFT: Newsletter Callout */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Join the <span className="text-[#ff6b35]">Inner Circle</span>
            </h3>
            <p className="text-gray-400 text-lg md:text-xl font-light max-w-xl mb-10 border-l-2 border-[#ff6b35] pl-4">
              Unlock exclusive drops, behind-the-scenes culture bites, and member-only pricing. No spam, just the good stuff.
            </p>
            
            <form className="flex w-full max-w-md group focus-within:border-[#ff6b35] border-b border-white/20 pb-3 transition-colors duration-300">
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                className="bg-transparent w-full outline-none text-white placeholder-gray-600 uppercase text-sm font-bold tracking-widest"
                required
              />
              <button 
                type="submit" 
                className="text-[#ff6b35] hover:text-white transition-colors duration-300 flex items-center gap-2 uppercase text-xs font-black tracking-widest"
              >
                Subscribe <ArrowUpRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* RIGHT: Quick Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 lg:justify-items-end">
            <div className="flex flex-col gap-4">
              <h4 className="text-[#ff6b35] text-xs font-black uppercase tracking-[0.2em] mb-4">Explore</h4>
              {['Latest Updates', 'Culture & Lifestyle', 'Product Reviews', 'Industry News'].map((link) => (
                <Link key={link} href="#" className="text-gray-400 hover:text-white uppercase font-bold text-sm tracking-wider flex items-center group transition-colors">
                  <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#ff6b35] group-hover:mr-2">/</span>
                  {link}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-[#ff6b35] text-xs font-black uppercase tracking-[0.2em] mb-4">Highway 420</h4>
              {['Shop All', 'Bongs & Rigs', 'Apparel', 'About Us'].map((link) => (
                <Link key={link} href="#" className="text-gray-400 hover:text-white uppercase font-bold text-sm tracking-wider flex items-center group transition-colors">
                  <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 text-[#ff6b35] group-hover:mr-2">/</span>
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs font-bold uppercase tracking-widest text-gray-600">
          <p>© {new Date().getFullYear()} Highway 420. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#ff6b35] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#ff6b35] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
