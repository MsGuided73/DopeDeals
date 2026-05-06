"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen, Settings, Droplet, FlaskConical, Battery, User } from "lucide-react";

// ── Top of page: 3 equal article cards in the new "image-top + light body" style.
const FEATURED_ARTICLES = [
  {
    id: "e-rig-vs-dab-rig",
    title: "E-Rig vs Dab Rig: Which Is Better?",
    description:
      "Compare convenience, flavor, and performance to find your perfect match.",
    category: "DAB RIGS",
    image:
      "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/dab%20and%20e-rg%20-%20Copy.png",
    href: "/higher-learning/e-rig-vs-dab-rig",
  },
  {
    id: "percolator-vs-regular-bong",
    title: "Percolator vs Regular Bong: What's the Difference?",
    description:
      "Break down the key differences in filtration, smoothness, and overall experience.",
    category: "BONGS & GLASS",
    image:
      "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/Percolator%20Bong%20Comp%20for%20Higher%20Learning%20Blog.png",
    href: "/higher-learning/percolator-vs-regular-bong",
  },
  {
    id: "thca-legal-alternative",
    title: "THCA: The Legal Alternative",
    description:
      "How hemp-derived THCA fits inside the 2018 Farm Bill and why it's accessible in states without medical or recreational THC.",
    category: "COMPLIANCE",
    image:
      "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/Home%20Page/map%20and%20flower%20and%20scale%20only.png",
    href: "/higher-learning/thca-legal-alternative",
  },
];

// ── Horizontal category nav (matches the icon row in the mockup).
const CATEGORY_NAV = [
  { id: "dab-rigs",        label: "DAB RIGS",        icon: Droplet,      href: "/higher-learning?topic=dab-rigs" },
  { id: "bongs-glass",     label: "BONGS & GLASS",   icon: FlaskConical, href: "/higher-learning?topic=bongs-glass" },
  { id: "how-to",          label: "HOW TO",          icon: BookOpen,     href: "/higher-learning?topic=how-to" },
  { id: "vapes-carts",     label: "VAPES & CARTS",   icon: Battery,      href: "/higher-learning?topic=vapes-carts" },
  { id: "beginner-guides", label: "BEGINNER GUIDES", icon: User,         href: "/higher-learning?topic=beginner-guides" },
];

// ── Below the hero we keep the existing "Explore by Topic" / CTA / Popular Setups.
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

// Real catalog SKUs (sourced from main_site_products with image_url populated).
// Clicking SHOP NOW runs a sitewide search for the product, matching the rest
// of the blog's category-link policy.
const POPULAR_SETUPS = [
  {
    id: "setup-1",
    name: "Puffco Peak Pro V2",
    price: 377.99,
    imageUrl:
      "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/PRODUCTS/DabRigs/Puffco/puffco-new-peak-pro-v2-884.jpg",
    searchQuery: "Puffco Peak Pro V2",
  },
  {
    id: "setup-2",
    name: 'RooR Tech 18" Inline Dab Rig',
    price: 359.99,
    imageUrl:
      "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/PRODUCTS/Bongs/RooR/roor-tech-18-inline-smokey-331.jpg",
    searchQuery: "RooR Inline Dab Rig",
  },
  {
    id: "setup-3",
    name: 'RooR PD Classic 18" Beaker',
    price: 269.99,
    imageUrl:
      "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/PRODUCTS/Bongs/RooR/roor-pd-classic-18-beaker-45x5mm-white-no-ice-pinches-389.jpg",
    searchQuery: "RooR Beaker Bong",
  },
  {
    id: "setup-4",
    name: "4-Piece Grinder",
    price: 64.99,
    imageUrl:
      "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/Accessories/Santa_Cruz_Grinder.jpg",
    searchQuery: "Grinder",
  },
];

export default function HigherLearningClient() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-12">

      {/* ─── Hero header ──────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1
            className="font-bebas text-[#0E2A1F] uppercase"
            style={{
              fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
              fontSize: "clamp(48px, 7vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: "0.01em",
              fontWeight: 400,
              margin: 0,
            }}
          >
            HIGHER LEARNING
          </h1>
          <p className="mt-3 text-[#5B6560] text-lg md:text-xl">
            Your Guide to Better Sessions
          </p>
        </div>

        <Link
          href="#all-articles"
          className="inline-flex items-center gap-2 text-[#0E2A1F] hover:text-[#1B7A4D] transition-colors text-sm font-bold tracking-[0.18em] uppercase"
        >
          VIEW ALL ARTICLES
          <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </header>

      {/* ─── Featured article cards (3 equal, image-top + light body) ─────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {FEATURED_ARTICLES.map((post) => (
          <Link
            key={post.id}
            href={post.href}
            className="group bg-white rounded-xl overflow-hidden border border-[#E5E1D8] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full aspect-[16/11] bg-[#F1EEE6] overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1629831410196-857c00e12d45?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              {/* Category badge — bottom-left of image */}
              <span className="absolute left-4 bottom-4 inline-flex items-center bg-[#0E2A1F] text-white text-[10px] font-extrabold tracking-[0.18em] uppercase py-1.5 px-3 rounded-md">
                {post.category}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-[#1c1208] text-xl md:text-[22px] font-extrabold leading-[1.25] mb-3">
                {post.title}
              </h3>
              <p className="text-[#5B6560] text-[14px] leading-[1.55] mb-6 flex-1">
                {post.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[#0E2A1F] text-[12px] font-extrabold tracking-[0.18em] uppercase group-hover:text-[#1B7A4D] transition-colors">
                READ MORE
                <ArrowRight size={14} strokeWidth={2.5} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── Horizontal category nav row ──────────────────────────────────── */}
      <nav
        aria-label="Higher Learning categories"
        className="bg-white border border-[#E5E1D8] rounded-xl px-4 md:px-8 py-5 flex flex-wrap items-center justify-around gap-y-4 mb-20"
      >
        {CATEGORY_NAV.map(({ id, label, icon: Icon, href }) => (
          <Link
            key={id}
            href={href}
            className="flex items-center gap-3 text-[#0E2A1F] hover:text-[#1B7A4D] transition-colors"
          >
            <Icon size={22} strokeWidth={1.5} />
            <span className="text-[12px] md:text-[13px] font-extrabold tracking-[0.18em] uppercase">
              {label}
            </span>
          </Link>
        ))}
      </nav>

      {/* ─── Explore By Topic ───────────────────────────────────────────────── */}
      <div id="all-articles" className="mb-20">
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
              <Link
                href={`/search?q=${encodeURIComponent(product.searchQuery)}`}
                className="w-full bg-[#1B4332] hover:bg-[#133221] text-white py-3 rounded-sm font-bold text-xs tracking-widest uppercase transition-colors mt-auto inline-flex items-center justify-center"
              >
                SHOP NOW
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
