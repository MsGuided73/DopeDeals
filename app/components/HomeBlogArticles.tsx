"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const MOCK_ARTICLES = [
  {
    id: "e-rig-vs-dab-rig",
    title: "E-Rig vs Dab Rig: Which Is Better?",
    description: "We break down the key differences between e-rigs and traditional dab rigs so you can choose the right setup.",
    category: "DAB RIGS",
    readTime: "6 min read",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/dab%20and%20e-rg%20-%20Copy.png",
    href: "/higher-learning/e-rig-vs-dab-rig",
  },
  {
    id: "percolator-vs-regular-bong",
    title: "Percolator vs Regular Bong",
    description: "Discover how percolators work, the benefits they offer, and whether they're worth the upgrade.",
    category: "BONGS & GLASS",
    readTime: "5 min read",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/Percolator%20Bong%20Comp%20for%20Higher%20Learning%20Blog.png",
    href: "/higher-learning/percolator-vs-regular-bong",
  },
  {
    id: "how-to-grind-weed",
    title: "How to Grind Weed the Right Way",
    description: "The right grind makes a big difference. Here's how to get the perfect consistency for any session.",
    category: "HOW TO",
    readTime: "4 min read",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/Grinder%20Image%20for%20Blog%20and%20Grid.png",
    href: "/higher-learning/how-to-grind-weed",
  },
];

export default function HomeBlogArticles() {
  return (
    <section className="bg-[#F7F6F2] py-20 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 style={{
              fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: '0.02em',
              color: '#1c1208',
              margin: '0 0 10px',
            }}>
              HIGHER LEARNING
            </h2>
            <p style={{ fontFamily: "'Fira Sans','Inter',sans-serif", fontSize: '15px', color: '#5B6560', margin: 0, maxWidth: '28rem' }}>
              Tips, guides, and expert advice to get the most out of every puff.
            </p>
          </div>
          <Link 
            href="/higher-learning" 
            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-widest text-[#1B7A4D] uppercase hover:text-[#133221] transition-colors"
          >
            VIEW ALL ARTICLES <ChevronRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_ARTICLES.map((post) => (
            <Link key={post.id} href={post.href} className="group relative rounded-xl overflow-hidden bg-neutral-900 h-[380px] flex flex-col justify-end p-6 border border-neutral-200/20 shadow-sm">
              <div className="absolute inset-0 z-0">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-100"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1629831410196-857c00e12d45?q=80&w=2070&auto=format&fit=crop"; }}
                />
              </div>
              <div className="relative z-20 flex flex-col items-start text-white">
                <span className="bg-[#1b4332] text-[#4ade80] text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-sm mb-3">
                  {post.category}
                </span>
                <h3 className="text-2xl font-bold leading-tight mb-3 group-hover:text-[#4ade80] transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-300 text-sm mb-5 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center justify-between w-full mt-auto">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-[#4ade80] uppercase">
                    READ MORE <ChevronRight size={14} />
                  </span>
                  <span className="text-neutral-400 text-[10px] flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <Link 
          href="/higher-learning" 
          className="md:hidden mt-8 flex items-center justify-center gap-2 text-sm font-bold tracking-widest text-[#1B7A4D] uppercase hover:text-[#133221] transition-colors"
        >
          VIEW ALL ARTICLES <ChevronRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
