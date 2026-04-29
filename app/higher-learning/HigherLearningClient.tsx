"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight, BookOpen, Settings, Filter } from "lucide-react";
import UniversalProductCard from "../components/UniversalProductCard";

// Mock data for the blog posts
const FEATURED_POST = {
  id: "e-rig-vs-dab-rig",
  title: "E-Rig vs Dab Rig: Which Is Better?",
  description: "We break down the key differences between e-rigs and traditional dab rigs so you can choose the right setup for your style.",
  category: "DAB RIGS",
  isFeatured: true,
  readTime: "6 min read",
  image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Puffco_Peak_Pro.jpg",
  href: "/higher-learning/e-rig-vs-dab-rig",
};

const SECONDARY_POSTS = [
  {
    id: "percolator-vs-regular-bong",
    title: "Percolator vs Regular Bong: What's the Difference?",
    description: "Discover how percolators work, the benefits they offer, and whether they're worth the upgrade.",
    category: "BONGS & GLASS",
    readTime: "5 min read",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/glass_bong_setup.jpg",
    href: "/higher-learning/percolator-vs-regular-bong",
  },
  {
    id: "how-to-grind-weed",
    title: "How to Grind Weed the Right Way",
    description: "The right grind makes a big difference. Here's how to get the perfect consistency for any session.",
    category: "HOW TO",
    readTime: "4 min read",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Accessories/Grinder.jpg",
    href: "/higher-learning/how-to-grind-weed",
  },
];

const TOPICS = [
  {
    id: "dab-rigs",
    title: "Dab Rigs",
    description: "Guides to help you choose and use the right rig.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1B7A4D]">
        <path d="M12 2v20" />
        <path d="M8 22h8" />
        <path d="M10 10l-4-4" />
        <path d="M14 10l4-4" />
        <circle cx="12" cy="10" r="4" />
      </svg>
    ),
    href: "/higher-learning?topic=dab-rigs",
  },
  {
    id: "bongs-glass",
    title: "Bongs & Glass",
    description: "Everything you need to know about glass.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1B7A4D]">
        <path d="M9 2h6" />
        <path d="M12 2v14" />
        <path d="M7 22h10" />
        <path d="M8 12c0 3 2 6 2 6h4s2-3 2-6V6H8v6z" />
      </svg>
    ),
    href: "/higher-learning?topic=bongs-glass",
  },
  {
    id: "how-to",
    title: "How To",
    description: "Step-by-step tips to level up your sessions.",
    icon: <Settings size={40} className="text-[#1B7A4D]" strokeWidth={1.5} />,
    href: "/higher-learning?topic=how-to",
  },
  {
    id: "beginner-guides",
    title: "Beginner Guides",
    description: "New to the game? Start with the basics.",
    icon: <BookOpen size={40} className="text-[#1B7A4D]" strokeWidth={1.5} />,
    href: "/higher-learning?topic=beginner-guides",
  },
];

const POPULAR_SETUPS = [
  {
    id: "setup-1",
    name: "Pulsar Peak Pro 3D Chamber E-Rig",
    price: 249.99,
    imageUrl: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Dab%20Rigs/Puffco_Peak_Pro.jpg",
    slug: "pulsar-peak-pro",
  },
  {
    id: "setup-2",
    name: "Pulsar Guardian Bubbler Dab Rig",
    price: 129.99,
    imageUrl: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Dab%20Rigs/Pulsar_Dab_Rig.jpg",
    slug: "pulsar-guardian-bubbler",
  },
  {
    id: "setup-3",
    name: "7mm Beaker Perc Bong",
    price: 59.99,
    imageUrl: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Bongs/Beaker_Bong.jpg",
    slug: "7mm-beaker-perc-bong",
  },
  {
    id: "setup-4",
    name: "Santa Cruz Shredder® 4-Piece Grinder",
    price: 64.99,
    imageUrl: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Accessories/Santa_Cruz_Grinder.jpg",
    slug: "santa-cruz-shredder-4-piece",
  },
];

const FILTERS = ["ALL ARTICLES", "DAB RIGS", "BONGS & GLASS", "HOW TO", "VAPES", "BEGINNER GUIDES"];

export default function HigherLearningClient() {
  const [activeFilter, setActiveFilter] = useState("ALL ARTICLES");

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-10">
      
      {/* ─── Header Section ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 relative">
        <div className="z-10 max-w-xl">
          <h1 className="font-bebas text-5xl md:text-7xl lg:text-[80px] leading-[0.9] tracking-wider text-[#1c1208] mb-4">
            HIGHER LEARNING
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-[#1B7A4D] mb-3">
            Your Guide to Better Sessions.
          </h2>
          <p className="text-[#4b5563] text-base md:text-lg max-w-md leading-relaxed">
            Tips, guides, and expert advice to help you choose the right gear, 
            improve your sessions, and get the most out of every puff.
          </p>
        </div>
        
        {/* Decorative Mountain Graphic (Right) */}
        <div className="absolute right-0 top-0 opacity-20 pointer-events-none hidden md:block w-1/2 h-full">
          <svg viewBox="0 0 800 300" fill="none" className="w-full h-full object-cover">
            {/* Simple abstract mountain path vector */}
            <path d="M100 250 L250 100 L350 180 L500 50 L650 200 L800 80" stroke="#1B7A4D" strokeWidth="2" fill="none" />
            <path d="M150 280 L300 150 L400 220 L550 100 L700 250" stroke="#1B7A4D" strokeWidth="1" fill="none" />
            <path d="M0 300 Q 200 250 400 300 T 800 300" fill="#f3f4f6" />
          </svg>
        </div>
      </div>

      {/* ─── Filters & Search Bar ───────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 border-b border-neutral-200 pb-4">
        <div className="flex flex-wrap items-center gap-6 md:gap-8 overflow-x-auto w-full lg:w-auto scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap pb-2 text-sm md:text-base font-semibold tracking-wide uppercase transition-colors border-b-2 ${
                activeFilter === filter 
                  ? "border-[#1B7A4D] text-[#1B7A4D]" 
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1B7A4D]/50 focus:border-[#1B7A4D] text-sm transition-all"
          />
        </div>
      </div>

      {/* ─── Featured Articles Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20">
        
        {/* Main Featured Article (Left) */}
        <Link href={FEATURED_POST.href} className="lg:col-span-7 group relative rounded-xl overflow-hidden bg-neutral-900 aspect-square lg:aspect-auto lg:h-[600px] flex flex-col justify-end p-8 border border-neutral-200/20 shadow-sm">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            {/* Fallback dark gradient in case image is missing */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <img 
              src={FEATURED_POST.image} 
              alt={FEATURED_POST.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1596525381831-299f2f8115eb?q=80&w=2070&auto=format&fit=crop"; }}
            />
          </div>
          
          <div className="relative z-20 flex flex-col items-start text-white">
            <div className="flex items-center gap-3 mb-4">
              {FEATURED_POST.isFeatured && (
                <span className="bg-[#1b4332] text-[#4ade80] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-sm">
                  FEATURED
                </span>
              )}
              <span className="bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-sm border border-white/20">
                {FEATURED_POST.category}
              </span>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-4 group-hover:text-[#4ade80] transition-colors">
              {FEATURED_POST.title}
            </h3>
            <p className="text-neutral-300 text-base md:text-lg max-w-lg mb-8 line-clamp-2">
              {FEATURED_POST.description}
            </p>
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2 text-sm font-semibold tracking-wider text-[#4ade80] uppercase">
                READ MORE <ChevronRight size={16} />
              </span>
              <span className="text-neutral-400 text-sm flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {FEATURED_POST.readTime}
              </span>
            </div>
          </div>
        </Link>

        {/* Secondary Articles (Right Stack) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {SECONDARY_POSTS.map((post) => (
            <Link key={post.id} href={post.href} className="group relative rounded-xl overflow-hidden bg-neutral-900 h-full min-h-[280px] flex flex-col justify-end p-6 border border-neutral-200/20 shadow-sm">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20 z-10" />
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1629831410196-857c00e12d45?q=80&w=2070&auto=format&fit=crop"; }}
                />
              </div>
              <div className="relative z-20 flex flex-col items-start text-white">
                <span className="bg-[#1b4332] text-[#4ade80] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-sm mb-3">
                  {post.category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold leading-tight mb-3 group-hover:text-[#4ade80] transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-300 text-sm mb-5 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center justify-between w-full mt-auto">
                  <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#4ade80] uppercase">
                    READ MORE <ChevronRight size={14} />
                  </span>
                  <span className="text-neutral-400 text-xs flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Explore By Topic ───────────────────────────────────────────────── */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h3 className="font-bebas text-3xl md:text-4xl tracking-wider text-[#1c1208] uppercase">
            EXPLORE BY <span className="border-b-4 border-[#1B7A4D] pb-1">TOPIC</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOPICS.map((topic) => (
            <Link key={topic.id} href={topic.href} className="bg-white rounded-xl p-8 flex flex-col items-center text-center border border-neutral-200 shadow-sm hover:shadow-md hover:border-[#1B7A4D]/30 transition-all group">
              <div className="mb-5 bg-[#F7F6F2] p-4 rounded-full group-hover:bg-[#1B7A4D]/10 transition-colors">
                {topic.icon}
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-2">{topic.title}</h4>
              <p className="text-neutral-500 text-sm mb-6 flex-1">
                {topic.description}
              </p>
              <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-neutral-900 uppercase group-hover:text-[#1B7A4D] transition-colors mt-auto">
                VIEW ARTICLES <ChevronRight size={14} strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── CTA Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-[#EFECE6] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-20 border border-[#e5e1d8]">
        <div className="flex items-center gap-6">
          <div className="bg-[#1B4332] text-white p-5 rounded-full shrink-0">
            <BookOpen size={36} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">More Knowledge. Better Sessions.</h3>
            <p className="text-neutral-600 text-base max-w-lg">
              We're always adding new guides, tips, and in-depth reviews to help you elevate your experience.
            </p>
          </div>
        </div>
        <button className="bg-[#1B4332] hover:bg-[#133221] text-white px-8 py-4 rounded-sm font-bold text-sm tracking-widest uppercase transition-colors shrink-0">
          CHECK BACK OFTEN
        </button>
      </div>

      {/* ─── Popular Setups ─────────────────────────────────────────────────── */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h3 className="font-bebas text-3xl md:text-4xl tracking-wider text-[#1c1208] uppercase">
            POPULAR SETUPS <span className="border-b-4 border-[#1B7A4D] pb-1">FOR BETTER SESSIONS</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_SETUPS.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-6 flex flex-col items-center text-center border border-neutral-200 shadow-sm">
              <div className="w-full aspect-square relative mb-4 flex items-center justify-center p-4">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain drop-shadow-md"
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/200?text=Product"; }}
                />
              </div>
              <h4 className="font-bold text-sm text-neutral-900 mb-2 line-clamp-2 h-10">{product.name}</h4>
              <p className="text-lg font-bold text-neutral-900 mb-4">${product.price}</p>
              <button className="w-full bg-[#1B4332] hover:bg-[#133221] text-white py-3 rounded-sm font-bold text-xs tracking-widest uppercase transition-colors mt-auto">
                SHOP NOW
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
