// ============================================================
// HIGHWAY 420 CORNERSTONE BLOG POST — NEXT.JS 15 IMPLEMENTATION
// ============================================================
// File: app/higher-learning/complete-guide-bong-percolators/page.tsx
//
// Stack: Next.js 15 App Router + React 18 + TypeScript + Tailwind
// Schema: Embedded as Next.js metadata + JSON-LD via Script component
// Images: Uses next/image for automatic optimization
// ============================================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

// ============================================================
// METADATA — handles meta tags, OG, canonical, Twitter cards
// ============================================================
export const metadata: Metadata = {
  title:
    "The Complete Guide to Bong Percolators (2026): Every Type Tested & Compared | Highway 420",
  description:
    "Every type of bong percolator explained — honeycomb, tree, matrix, fritted, and 20+ more. Plus honest buying advice, lung-capacity matching, and the cleaning truth nobody talks about.",
  alternates: {
    canonical:
      "https://highway420store.com/higher-learning/complete-guide-bong-percolators",
  },
  openGraph: {
    title: "The Complete Guide to Bong Percolators (2026)",
    description:
      "Every type of percolator explained, with honest buying advice, lung-capacity matching, and the cleaning truth nobody talks about.",
    type: "article",
    url: "https://highway420store.com/higher-learning/complete-guide-bong-percolators",
    images: [
      {
        url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/percolator-guide-hero.jpg",
        width: 1600,
        height: 900,
        alt: "Highway 420 honeycomb percolator bong with water bubbling through the disc",
      },
    ],
    siteName: "Highway 420",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Complete Guide to Bong Percolators (2026)",
    description:
      "Every type of percolator explained, with honest buying advice and lung-capacity matching.",
    images: [
      "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/percolator-guide-hero.jpg",
    ],
  },
  authors: [{ name: "Highway 420" }],
  category: "Buying Guides",
};

// ============================================================
// SCHEMA — JSON-LD structured data
// Three schema types: Article, FAQPage, BreadcrumbList
// ============================================================
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "The Complete Guide to Bong Percolators (2026): Every Type Tested & Compared",
  description:
    "Every type of percolator explained, with honest buying advice and lung-capacity matching.",
  image: [
    "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/percolator-guide-hero.jpg",
  ],
  author: {
    "@type": "Organization",
    name: "Highway 420",
    url: "https://highway420store.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Highway 420",
    logo: {
      "@type": "ImageObject",
      url: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png",
    },
  },
  datePublished: "2026-04-30T08:00:00-07:00",
  dateModified: "2026-04-30T08:00:00-07:00",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://highway420store.com/higher-learning/complete-guide-bong-percolators",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are percolator bongs worth it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, meaningfully so. A well-percolated bong produces noticeably smoother, cooler hits than a basic bong with only a downstem. The trade-offs are price (perc bongs cost more) and cleaning (more intricate geometry means more maintenance).",
      },
    },
    {
      "@type": "Question",
      name: "What's the most popular percolator type?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The honeycomb percolator. Across the industry, honeycomb is consistently identified as the best-selling and most-recommended perc style because it offers the best balance of high diffusion, low drag, and manageable cleaning.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between a honeycomb and a tree perc?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Honeycomb percs are flat discs with dozens of small holes — they produce a dense, uniform sheet of micro-bubbles with low drag and easy cleaning. Tree percs use multiple vertical arms with slits at the base — they produce more dramatic bubble streams with higher diffusion but more drag and harder cleaning.",
      },
    },
    {
      "@type": "Question",
      name: "How many percolators is too many?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When the drag exceeds your lung capacity to comfortably clear the hit. Three percs is the practical ceiling for most adult buyers; beyond that, you're working harder than the bong is.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use a perc bong for dabs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but the perc style matters. Avoid fritted disc and ultra-fine honeycomb percs because concentrates clog their microscopic holes within days. Showerhead, inline, ratchet, and standard-hole honeycomb percs all work well for concentrates with regular cleaning.",
      },
    },
    {
      "@type": "Question",
      name: "How often should I clean my perc bong?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every 5–8 sessions for honeycomb percs, every 5–7 sessions for tree or matrix percs, every 7–10 sessions for showerhead or inline percs, and every 3–5 sessions for fritted disc percs. Always empty water after every session.",
      },
    },
    {
      "@type": "Question",
      name: "Why won't my bong clear?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Three common causes: water level too high creating excess drag (lower it until just above the perc slits); percolator dirty with clogged holes restricting airflow (clean it); or the perc is genuinely too aggressive for your lung capacity.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my honeycomb perc clogged?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Resin buildup in the honeycomb's small holes. Cleaning fix: 91%+ isopropyl alcohol plus coarse salt, soaked 15–30 minutes, with both ends of the bong sealed during gentle shaking.",
      },
    },
    {
      "@type": "Question",
      name: "Is borosilicate glass worth the upgrade?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Borosilicate glass is significantly more thermally and impact resistant than standard glass. It tolerates temperature changes, resists cracking, and lasts longer.",
      },
    },
    {
      "@type": "Question",
      name: "What's the smoothest perc on the market?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The fritted disc, by a wide margin — its hundreds to thousands of microscopic holes generate more bubbles than any other perc style. The trade-off is extreme drag and frequent cleaning.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://highway420store.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Higher Learning",
      item: "https://highway420store.com/higher-learning",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Complete Guide to Bong Percolators",
    },
  ],
};

// ============================================================
// REUSABLE TYPES & DATA
// ============================================================
type PercSpec = {
  diffusion: string;
  drag: string;
  cleaning: string;
  bestFor: string;
};

type ProductPick = {
  category: string;
  name: string;
  price: string;
  whyWePickIt: string;
  productUrl: string;
  imageUrl: string;
  imageAlt: string;
};

// REPLACE THESE WITH REAL PRODUCT DATA
// (You can also fetch from Supabase via a server query — pattern shown in usage notes)
const TOP_PICKS: ProductPick[] = [
  {
    category: "Best Beginner Perc Bong",
    name: "[Product Name]",
    price: "$0.00",
    whyWePickIt:
      "Single honeycomb percs hit the diffusion-drag-cleaning trifecta better than any other style. Easy to pull through, easy to clean, and forgiving for first-time bong owners.",
    productUrl: "/products/replace-with-product-handle",
    imageUrl: "/images/products/placeholder-1.jpg",
    imageAlt: "Single honeycomb beaker bong",
  },
  {
    category: "Best Honeycomb Bong Under $100",
    name: "[Product Name]",
    price: "$0.00",
    whyWePickIt:
      "Best-value honeycomb in our inventory. Solid borosilicate glass, clean welds, and the disc geometry is properly sized for the chamber.",
    productUrl: "/products/replace-with-product-handle",
    imageUrl: "/images/products/placeholder-2.jpg",
    imageAlt: "Budget honeycomb percolator bong",
  },
  {
    category: "Best Premium Multi-Perc",
    name: "[Product Name]",
    price: "$0.00",
    whyWePickIt:
      "Two-stage filtration that's smoother than any single-perc bong without going overboard on drag. Worth the upgrade for serious smokers.",
    productUrl: "/products/replace-with-product-handle",
    imageUrl: "/images/products/placeholder-3.jpg",
    imageAlt: "Inline plus tree perc multi-stage bong",
  },
  {
    category: "Best Concentrate-Friendly Perc Bong",
    name: "[Product Name]",
    price: "$0.00",
    whyWePickIt:
      "Showerhead slits are large enough to resist concentrate clog, and the rig size keeps vapor concentrated for flavor.",
    productUrl: "/products/replace-with-product-handle",
    imageUrl: "/images/products/placeholder-4.jpg",
    imageAlt: "Showerhead percolator dab rig",
  },
  {
    category: "Best Cooling Piece (Glycerin Coil)",
    name: "[Product Name]",
    price: "$0.00",
    whyWePickIt:
      "For cough-sensitive smokers or anyone chasing maximum cooling, frozen glycerin coils deliver a hit closer to cold air than warm vapor.",
    productUrl: "/products/replace-with-product-handle",
    imageUrl: "/images/products/placeholder-5.jpg",
    imageAlt: "Glycerin coil bong",
  },
  {
    category: "Best Showpiece (Style-First Buyer)",
    name: "[Product Name]",
    price: "$0.00",
    whyWePickIt:
      "When the bong is going on the shelf as a centerpiece, this is the one. Just be honest with yourself about lung capacity before committing.",
    productUrl: "/products/replace-with-product-handle",
    imageUrl: "/images/products/placeholder-6.jpg",
    imageAlt: "Stereo matrix showpiece bong",
  },
];

// ============================================================
// REUSABLE COMPONENTS (extract to /components if you want them
// available in other blog posts)
// ============================================================

function PercSpecBox({ spec }: { spec: PercSpec }) {
  return (
    <div className="my-6 grid grid-cols-1 gap-2 rounded-md border border-stone-200 bg-stone-50 p-4 sm:grid-cols-2 sm:gap-x-6 sm:p-5">
      <div className="flex justify-between border-b border-white py-1 text-sm last:border-b-0">
        <span className="font-medium text-stone-500">Diffusion</span>
        <span className="font-semibold text-[#145C3C]">{spec.diffusion}</span>
      </div>
      <div className="flex justify-between border-b border-white py-1 text-sm last:border-b-0">
        <span className="font-medium text-stone-500">Drag</span>
        <span className="font-semibold text-[#145C3C]">{spec.drag}</span>
      </div>
      <div className="flex justify-between border-b border-white py-1 text-sm sm:border-b-0">
        <span className="font-medium text-stone-500">Cleaning</span>
        <span className="font-semibold text-[#145C3C]">{spec.cleaning}</span>
      </div>
      <div className="flex justify-between py-1 text-sm">
        <span className="font-medium text-stone-500">Best for</span>
        <span className="font-semibold text-[#145C3C] text-right">
          {spec.bestFor}
        </span>
      </div>
    </div>
  );
}

function Callout({
  variant = "default",
  label,
  children,
}: {
  variant?: "default" | "warn" | "tip";
  label: string;
  children: React.ReactNode;
}) {
  const styles = {
    default: "border-[#ff6b35] bg-stone-50 [&_.h420-cl-label]:text-[#ff6b35]",
    warn: "border-rose-700 bg-rose-50 [&_.h420-cl-label]:text-rose-700",
    tip: "border-[#145C3C] bg-[#e8f5ec] [&_.h420-cl-label]:text-[#145C3C]",
  };
  return (
    <div className={`my-7 rounded-md border-l-4 p-5 ${styles[variant]}`}>
      <div className="h420-cl-label mb-1.5 font-chalets text-xs tracking-[0.2em]">
        {label}
      </div>
      <div className="prose-sm [&_p:last-child]:mb-0">{children}</div>
    </div>
  );
}

function PercImagePlaceholder({
  label,
  description,
  size = "800x600",
  alt,
}: {
  label: string;
  description: string;
  size?: string;
  alt: string;
}) {
  // REPLACE with <Image src={...} alt={alt} width={...} height={...} />
  // when you have real images. The placeholder div below is for design preview.
  return (
    <div className="my-8 flex min-h-[280px] flex-col items-center justify-center rounded-md border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center">
      <div className="mb-2 font-chalets text-sm tracking-[0.2em] text-[#ff6b35]">
        {label}
      </div>
      <div className="mb-2 max-w-md font-semibold text-[#145C3C]">
        {description}
      </div>
      <div className="max-w-md text-xs italic text-stone-500">
        Recommended: <code className="rounded bg-stone-200 px-1.5 py-0.5 font-mono text-[#145C3C]">{size}px</code> · Alt: <code className="rounded bg-stone-200 px-1.5 py-0.5 font-mono text-[#145C3C]">{alt}</code>
      </div>
    </div>
  );
}

function PercBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="my-8 border-b border-stone-200 pb-6 last:border-b-0">
      <h3 className="font-heading text-2xl font-bold text-[#145C3C]">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FamilyHeader({
  family,
  description,
}: {
  family: string;
  description: string;
}) {
  return (
    <div className="my-10 mb-6 rounded-md bg-[#145C3C] p-6 text-stone-50">
      <h3 className="m-0 font-heading text-2xl font-bold text-stone-50">
        {family}
      </h3>
      <p className="mt-1 text-sm text-stone-50/80">{description}</p>
    </div>
  );
}

function ProductCard({ pick }: { pick: ProductPick }) {
  return (
    <article className="my-8 grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:grid-cols-[240px_1fr]">
      <div className="relative min-h-[260px] bg-stone-50 sm:border-r-2 sm:border-dashed sm:border-stone-300">
        {/* When real image exists: */}
        <Image
          src={pick.imageUrl}
          alt={pick.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 240px"
        />
      </div>
      <div className="flex flex-col justify-between p-6">
        <div>
          <div className="mb-1.5 font-chalets text-sm tracking-[0.2em] text-[#ff6b35]">
            {pick.category}
          </div>
          <h4 className="mb-2 font-heading text-xl font-bold text-[#145C3C]">
            {pick.name}
          </h4>
          <p className="mb-4 text-sm leading-relaxed text-stone-700">
            <strong className="text-[#145C3C]">Why we pick it:</strong>{" "}
            {pick.whyWePickIt}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-chalets text-2xl tracking-wide text-[#145C3C]">
            {pick.price}
          </span>
          <Link
            href={pick.productUrl}
            className="inline-block rounded bg-[#145C3C] px-6 py-2.5 font-chalets text-sm tracking-[0.15em] text-stone-50 transition-colors hover:bg-[#ff6b35] hover:text-stone-900"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </article>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="border-b border-stone-200 py-4">
      <h4 className="mb-2 text-base font-bold text-[#145C3C]">{question}</h4>
      <p className="m-0 text-sm leading-relaxed text-stone-700">{answer}</p>
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function PercolatorGuidePage() {
  return (
    <>
      {/* JSON-LD Schema — rendered as Script tags for proper crawling */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="mx-auto max-w-3xl px-5 py-8 font-sans text-[17px] leading-relaxed text-stone-900">
        {/* HEADER */}
        <div className="mb-2 font-chalets text-sm tracking-[0.25em] text-[#ff6b35]">
          THE CORNERSTONE GUIDE · 2026 EDITION
        </div>
        <h1 className="mb-3 font-heading text-4xl font-bold leading-tight tracking-tight text-[#145C3C] sm:text-5xl">
          The Complete Guide to Bong Percolators: Every Type Explained, With
          Honest Buying Advice
        </h1>

        <div className="mb-8 flex flex-wrap items-center gap-3 border-y border-stone-200 py-3 text-sm text-stone-500">
          <span>
            <strong>Highway 420</strong>
          </span>
          <span className="text-stone-300">·</span>
          <span>Updated April 30, 2026</span>
          <span className="text-stone-300">·</span>
          <span>~22 min read</span>
        </div>

        {/* HERO IMAGE */}
        <div className="my-8 flex min-h-[420px] flex-col items-center justify-center rounded-md border-2 border-dashed border-[#ff6b35] bg-gradient-to-br from-stone-50 to-[#fff1ea]/40 p-12 text-center">
          <div className="mb-2 font-chalets text-sm tracking-[0.2em] text-[#ff6b35]">
            HERO IMAGE
          </div>
          <div className="mb-2 max-w-md font-semibold text-[#145C3C]">
            A beautifully lit honeycomb perc bong, water mid-bubble
          </div>
          <div className="max-w-md text-xs italic text-stone-500">
            Recommended: <code>1600×900px</code>, JPG, under 200KB. Alt:{" "}
            <code>"Highway 420 honeycomb percolator bong with water bubbling through the disc"</code>
          </div>
        </div>

        <p className="mb-7 border-l-4 border-[#ff6b35] pl-4 font-heading text-xl italic leading-snug text-[#145C3C]">
          There are two kinds of bong shoppers. The first kind walks into a
          smoke shop, points at the prettiest bong on the wall, and walks out
          with a $300 piece they'll cough through for two months before quietly
          retiring it to a closet shelf. The second kind reads a guide like this
          one, learns the difference between a honeycomb and a tree perc, and
          ends up with a bong that fits their lungs, their budget, and their
          cleaning tolerance.
        </p>

        <p className="mb-5">We'd really like you to be the second kind.</p>

        <p className="mb-5">
          This is the most thorough guide to percolators we've put together —
          every common type, plus the obscure ones, plus the buying frameworks
          nobody else online seems willing to teach. We'll cover what each perc
          actually does, where it shines, where it fails, and how to match a
          perc to <em>you</em> — not to a YouTuber's lungs, not to whatever the
          algorithm pushed at you last week.
        </p>

        <p className="mb-7">
          If you're brand new to percolators,{" "}
          <a
            href="#what-is-a-percolator"
            className="text-[#1B7A4D] underline decoration-[#ff6b35] decoration-2 underline-offset-2 hover:text-[#ff6b35]"
          >
            jump to "What is a percolator?"
          </a>
          . If you already know the basics,{" "}
          <a
            href="#iron-triangle"
            className="text-[#1B7A4D] underline decoration-[#ff6b35] decoration-2 underline-offset-2 hover:text-[#ff6b35]"
          >
            the Iron Triangle
          </a>{" "}
          is where the real lessons start.
        </p>

        {/* TABLE OF CONTENTS */}
        <div className="my-8 rounded-md border-l-4 border-[#145C3C] bg-stone-50 p-6">
          <div className="mb-3 font-chalets text-base tracking-[0.2em] text-[#145C3C]">
            WHAT'S INSIDE
          </div>
          <ol className="m-0 list-none space-y-2 p-0 text-sm">
            {[
              ["What a percolator actually does", "what-is-a-percolator"],
              ["The Iron Triangle of Perc Design", "iron-triangle"],
              ["Every type of percolator, by family", "every-type"],
              ["Multi-perc combinations", "multi-perc"],
              ["How to pick the right perc for YOU", "how-to-pick"],
              ["Caring for your perc bong", "cleaning"],
              ["Highway 420's top picks", "top-picks"],
              ["Frequently asked questions", "faq"],
            ].map(([label, anchor], i) => (
              <li key={anchor}>
                <a
                  href={`#${anchor}`}
                  className="text-stone-900 no-underline hover:text-[#ff6b35] hover:underline"
                >
                  {i + 1}. {label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* SECTION 1 */}
        <h2
          id="what-is-a-percolator"
          className="mt-12 mb-3 border-b-2 border-[#ff6b35] pb-2 font-heading text-3xl font-bold text-[#145C3C]"
        >
          What Is a Percolator?
        </h2>

        <p className="mb-5">
          A percolator — usually shortened to "perc" — is a filtration component
          built inside a bong that breaks smoke into smaller bubbles before the
          smoke reaches your lungs. The word comes from Latin{" "}
          <em>percolare</em>, meaning "to filter through." Same root as your
          morning coffee percolator. Same basic idea.
        </p>

        <h3 className="mt-8 mb-3 font-heading text-xl font-bold text-[#145C3C]">
          The Watering Can Analogy
        </h3>

        <p className="mb-5">
          Imagine a watering can. The default kind has one big spout — when you
          tip it, a thick stream of water pours out. Now imagine swapping that
          single spout for a fine-mist shower nozzle. Same volume of water, but
          it's broken into thousands of tiny droplets that touch every leaf
          instead of dumping a puddle in one spot.
        </p>

        <p className="mb-5">That's exactly what a percolator does to smoke.</p>

        <p className="mb-5">
          A bong without a percolator pushes smoke through water as a few large
          bubbles. A bong <em>with</em> a percolator shatters that same volume
          of smoke into hundreds — sometimes thousands — of small bubbles. More
          bubbles means more surface area where smoke meets water, and three
          useful things happen at once:
        </p>

        <ol className="mb-5 list-decimal space-y-2 pl-6">
          <li>
            <strong className="text-[#145C3C]">Heat transfers faster.</strong>{" "}
            Hot smoke dumps its heat into the water more efficiently, so what
            reaches your lungs is significantly cooler.
          </li>
          <li>
            <strong className="text-[#145C3C]">
              Particulates get filtered.
            </strong>{" "}
            Tar, ash, and water-soluble combustion byproducts get trapped in
            the water instead of your throat.
          </li>
          <li>
            <strong className="text-[#145C3C]">Smoothness goes up.</strong>{" "}
            Cooler smoke + fewer particulates = less coughing, less throat
            scrape, more enjoyable sessions.
          </li>
        </ol>

        <p className="mb-5">
          That's it. That's the entire job of a percolator. Every design we'll
          discuss in this guide is just a different way of accomplishing the
          same goal: maximize the smoke-to-water surface area.
        </p>

        <PercImagePlaceholder
          label="DIAGRAM"
          description="Side-by-side cross-section: non-perc bong (one big bubble) vs percolator bong (hundreds of micro-bubbles)"
          size="1200x600"
          alt="Diagram comparing bubble size in non-percolator vs percolator bongs"
        />

        {/* SECTION 2: IRON TRIANGLE */}
        <h2
          id="iron-triangle"
          className="mt-12 mb-3 border-b-2 border-[#ff6b35] pb-2 font-heading text-3xl font-bold text-[#145C3C]"
        >
          The Iron Triangle of Perc Design
        </h2>

        <p className="mb-5">
          If you internalize one concept from this guide, make it this one. It
          will save you hundreds of dollars on the wrong bong.
        </p>

        <p className="mb-5">
          Every percolator design is a deliberate trade-off between three
          competing priorities:
        </p>

        {/* TRIANGLE SVG */}
        <div className="my-8 rounded-lg bg-stone-50 p-6 text-center">
          <svg
            viewBox="0 0 360 320"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="The Iron Triangle of Perc Design: Diffusion, Drag, and Cleaning Ease"
            className="mx-auto h-auto w-full max-w-sm"
          >
            <text
              x="180"
              y="22"
              textAnchor="middle"
              fontFamily="Chalets, Highway Gothic, Impact, sans-serif"
              fontSize="16"
              fill="#145C3C"
              letterSpacing="3"
            >
              DIFFUSION
            </text>
            <text
              x="180"
              y="38"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize="10"
              fill="#6C6C6C"
              fontStyle="italic"
            >
              smoothness
            </text>
            <polygon
              points="180,55 50,250 310,250"
              fill="#FAF7F2"
              stroke="#145C3C"
              strokeWidth="3"
            />
            <polygon
              points="180,110 110,225 250,225"
              fill="none"
              stroke="#ff6b35"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x="180"
              y="180"
              textAnchor="middle"
              fontFamily="Space Grotesk, Inter, sans-serif"
              fontSize="15"
              fill="#145C3C"
              fontStyle="italic"
            >
              pick two.
            </text>
            <text
              x="180"
              y="200"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize="9"
              fill="#6C6C6C"
            >
              the third is the trade-off.
            </text>
            <text
              x="50"
              y="278"
              textAnchor="middle"
              fontFamily="Chalets, Highway Gothic, Impact, sans-serif"
              fontSize="16"
              fill="#145C3C"
              letterSpacing="3"
            >
              DRAG
            </text>
            <text
              x="50"
              y="294"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize="10"
              fill="#6C6C6C"
              fontStyle="italic"
            >
              lung effort
            </text>
            <text
              x="310"
              y="278"
              textAnchor="middle"
              fontFamily="Chalets, Highway Gothic, Impact, sans-serif"
              fontSize="16"
              fill="#145C3C"
              letterSpacing="3"
            >
              CLEANING
            </text>
            <text
              x="310"
              y="294"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize="10"
              fill="#6C6C6C"
              fontStyle="italic"
            >
              maintenance
            </text>
            <circle cx="180" cy="55" r="6" fill="#ff6b35" />
            <circle cx="50" cy="250" r="6" fill="#ff6b35" />
            <circle cx="310" cy="250" r="6" fill="#ff6b35" />
          </svg>
        </div>

        <ul className="mb-5 list-disc space-y-2 pl-6">
          <li>
            <strong className="text-[#145C3C]">More diffusion</strong> =
            smoother, cooler hits — but always more drag and harder cleaning.
          </li>
          <li>
            <strong className="text-[#145C3C]">Less drag</strong> = easier to
            clear the chamber — but typically less aggressive cooling.
          </li>
          <li>
            <strong className="text-[#145C3C]">Easier cleaning</strong> =
            simpler internal geometry — but usually fewer bubbles.
          </li>
        </ul>

        <p className="mb-5">
          You <strong className="text-[#145C3C]">cannot</strong> maximize all
          three. Physics won't let you. Every percolator on the market is a
          deliberate compromise.
        </p>

        <p className="mb-5">
          This is why the "what's the best perc" question has no universal
          answer. The honest answer is "best for what?" A first-time bong owner
          with average lung capacity has very different needs from a
          six-foot-three former swimmer who wants their bong to look like a
          chemistry experiment.
        </p>

        <Callout variant="tip" label="THE RULE">
          <p>
            A clean cheap bong outperforms a dirty expensive one. Match the perc
            to your <strong>actual</strong> lung capacity and cleaning rhythm —
            not your budget ceiling.
          </p>
        </Callout>

        {/* SECTION 3: PERC TYPES */}
        <h2
          id="every-type"
          className="mt-12 mb-3 border-b-2 border-[#ff6b35] pb-2 font-heading text-3xl font-bold text-[#145C3C]"
        >
          Every Type of Percolator
        </h2>

        <p className="mb-5">
          We've grouped the 20+ percolator designs you'll encounter into five
          logical families. Each family shares similar physics, similar
          strengths, and similar weaknesses.
        </p>

        {/* FAMILY 1 */}
        <FamilyHeader
          family="Family 1: Foundation Percs"
          description="The simplest designs — the building blocks. Most other percs evolved from these."
        />

        <PercBlock title="Diffused Downstem">
          <PercImagePlaceholder
            label="PERC IMAGE · DIFFUSED DOWNSTEM"
            description="Close-up of a diffused downstem with slits visible at the submerged end"
            size="800x600"
            alt="Diffused downstem with slits at the submerged end"
          />
          <p className="mb-5">
            The most basic percolator. It's just the downstem itself, with slits
            or holes cut into the submerged end. Without these slits, smoke
            would enter the water as one big bubble; the slits split it into a
            few smaller ones.
          </p>
          <p className="mb-5">
            Almost every entry-level beaker bong has one of these. It's the
            baseline against which every fancier perc should be measured.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Low",
              drag: "Very Low",
              cleaning: "Very Easy",
              bestFor: "Beginners, budget",
            }}
          />
          <p className="mb-5">
            <strong className="text-[#145C3C]">The analogy:</strong> A
            drinking straw with a few holes poked in the end. Better than
            nothing. Not the main event.
          </p>
        </PercBlock>

        <PercBlock title="Inline Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · INLINE"
            description="Inline perc photographed against a light source so the slits are visible"
            size="800x600"
            alt="Inline percolator with horizontal slits"
          />
          <p className="mb-5">
            A horizontal glass tube with slits cut along the bottom, sitting at
            the base of the chamber (commonly seen in beaker bongs). Smoke
            enters from the side, exits through the slits into the water below.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Low – Medium",
              drag: "Low",
              cleaning: "Easy",
              bestFor: "Multi-perc setups",
            }}
          />
          <p className="mb-5">
            Inline percs almost always function as a <em>first stage</em>. They
            handle gross filtration with low drag, and a second perc above them
            handles the smoothness work. Heads up: if an inline has only 4–6
            slits, it's barely better than a fancy diffused downstem.
          </p>
        </PercBlock>

        {/* FAMILY 2 */}
        <FamilyHeader
          family="Family 2: Disc-Style Percs"
          description="Flat glass discs with holes or slits, oriented horizontally. Where most modern percolation innovation has happened."
        />

        <PercBlock title="Honeycomb Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · HONEYCOMB"
            description="Top-down macro shot of a clean honeycomb disc, every hole visible, water just below"
            size="1000x700"
            alt="Honeycomb percolator disc with dozens of small holes for diffusion"
          />
          <p className="mb-5">
            The MVP of modern bong design, and almost universally the perc
            people end up keeping after they've owned a few bongs. A flat disc
            densely packed with dozens of small holes, smoke pushes up through
            every hole simultaneously, producing a dense column of micro-bubbles.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "High",
              drag: "Surprisingly Low",
              cleaning: "Manageable",
              bestFor: "Most people",
            }}
          />
          <p className="mb-5">
            <strong className="text-[#145C3C]">Why it wins:</strong> Honeycomb
            is the only perc style that hits all three corners of the Iron
            Triangle reasonably well.
          </p>
          <p className="mb-5">
            <strong className="text-[#145C3C]">Stackability:</strong> Because
            they're flat discs, you can stack 2 or 3 honeycombs in a single
            bong. Each layer compounds smoothness — but also adds drag.
          </p>
          <p className="mb-5">
            <strong className="text-[#145C3C]">Fun history nugget:</strong>{" "}
            Honeycomb percs weren't invented for bongs. They were borrowed from
            chemistry lab equipment, where they're called "denuders" and have
            been used for decades to filter gases through liquids.
          </p>
        </PercBlock>

        <PercBlock title="Ratchet Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · RATCHET"
            description="Ratchet perc disc with holes around the perimeter only"
            size="800x600"
            alt="Ratchet percolator disc with perimeter holes"
          />
          <p className="mb-5">
            A simplified honeycomb. Holes are arranged only around the perimeter
            of the disc instead of across the whole thing, leaving the center
            clear so a downstem can pass through.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Solid",
              drag: "Low",
              cleaning: "Easy",
              bestFor: "Bubblers, dab rigs",
            }}
          />
        </PercBlock>

        <PercBlock title="Fritted Disc Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · FRITTED DISC"
            description="Close-up of a fritted disc showing its sintered, porous texture"
            size="800x600"
            alt="Fritted disc percolator with thousands of microscopic holes"
          />
          <p className="mb-5">
            The most aggressive percolator on the market. Made from sintered
            (loosely fused) glass crumbs, a fritted disc has hundreds —
            sometimes thousands — of microscopic holes.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Maximum",
              drag: "Extremely High",
              cleaning: "Frequent & Difficult",
              bestFor: "Experienced flower",
            }}
          />
          <Callout variant="warn" label="IMPORTANT WARNING">
            <p>
              Fritted percs clog within days if you use them with concentrates.
              The microscopic holes get choked with concentrate residue almost
              immediately. <strong>Flower only.</strong>
            </p>
          </Callout>
          <p className="mb-5">
            <strong className="text-[#145C3C]">The analogy:</strong> Smoke
            trying to escape through a kitchen sponge. The diffusion is
            unmatched. The pull is brutal.
          </p>
        </PercBlock>

        <PercBlock title="Turbine Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · TURBINE"
            description="Turbine perc photographed mid-pull with the water in spiral motion"
            size="1000x700"
            alt="Turbine percolator creating spiral water vortex"
          />
          <p className="mb-5">
            A flat disc with angled slits arranged in a spiral pattern. As you
            inhale, water spins around the disc creating a visible whirlpool —
            equal parts function and showpiece.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Medium",
              drag: "Low",
              cleaning: "Moderate",
              bestFor: "Style-conscious",
            }}
          />
          <p className="mb-5">
            <strong className="text-[#145C3C]">Bonus feature:</strong> The
            angled slits naturally redirect water away from the mouthpiece, so
            turbines double as a splash guard.
          </p>
        </PercBlock>

        {/* FAMILY 3 */}
        <FamilyHeader
          family="Family 3: Arm and Tube Percs"
          description="Vertical tubes that extend from a central trunk down into the water. Visually dramatic, aggressive in diffusion, somewhat fragile."
        />

        <PercBlock title="Tree Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · TREE"
            description="Tree perc with multiple arms branching down from central trunk"
            size="800x900"
            alt="Tree percolator with multiple branched arms"
          />
          <p className="mb-5">
            The classic. A central trunk with multiple vertical "arms" branching
            down into the water, each arm slit at the base. Smoke travels up
            the trunk, down each arm, and out through the slits as bubbles.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "High – Very High",
              drag: "Medium – High",
              cleaning: "Difficult",
              bestFor: "Smoothness chasers",
            }}
          />
          <p className="mb-5">
            <strong className="text-[#145C3C]">Arm count matters.</strong>{" "}
            Entry-level tree percs have 4–6 arms; premium pieces hit 8–12, and
            specialty pieces go 16 or more.
          </p>
          <p className="mb-5">
            <strong className="text-[#145C3C]">The fragility tax.</strong> The
            welds where each arm meets the trunk are the weak point. Always
            check the welds before you buy — quality pieces have thick, uniform
            welds with no air bubbles.
          </p>
        </PercBlock>

        <PercBlock title="Sprinkler Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · SPRINKLER"
            description="Sprinkler perc with arms radiating outward and upward"
            size="800x600"
            alt="Sprinkler percolator with radiating arms"
          />
          <p className="mb-5">
            Picture an upside-down tree perc. Multiple arms radiate outward and
            upward from a base, each arm open-ended. Generates large vigorous
            bubbles in 360° dispersion.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Heavy",
              drag: "Medium",
              cleaning: "Moderate",
              bestFor: "Active session aesthetic",
            }}
          />
          <p className="mb-5">
            The bubbling is loud. Some people love it; some find it harsh.
          </p>
        </PercBlock>

        <PercBlock title="Jellyfish Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · JELLYFISH"
            description="Jellyfish perc positioned in upper neck of bong with open-ended arms"
            size="800x800"
            alt="Jellyfish percolator with angled arms in bong neck"
          />
          <p className="mb-5">
            Looks like a tree perc but functions differently. Positioned as a{" "}
            <em>secondary</em> perc inside the bong's neck, the jellyfish has
            open-ended arms angled toward the chamber wall. Bubbles burst
            against the glass and create heavy diffusion as smoke exits.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Surprisingly High",
              drag: "Medium",
              cleaning: "Difficult",
              bestFor: "Tree aesthetic + finisher",
            }}
          />
        </PercBlock>

        {/* FAMILY 4 */}
        <FamilyHeader
          family="Family 4: Chamber-Style Percs"
          description="Enclosed chambers (domes, cylinders, cages) with slits or holes around their walls. Look impressive, diffuse aggressively, double as splash guards."
        />

        <PercBlock title="Showerhead Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · SHOWERHEAD"
            description="Showerhead perc photographed mid-pull, bubbles visible exiting from every hole"
            size="1000x700"
            alt="Showerhead percolator with 360-degree bubble diffusion"
          />
          <p className="mb-5">
            A vertical tube anchored to the floor of the chamber, flaring out at
            the top or bottom into a flange with slits or holes around its
            perimeter — looks like an upside-down showerhead.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Solid (360°)",
              drag: "Low – Medium",
              cleaning: "Moderately Easy",
              bestFor: "All-around performance",
            }}
          />
          <p className="mb-5">
            Showerheads are the safest "I don't know what I want yet" choice for
            an upgrade buyer.
          </p>
        </PercBlock>

        <PercBlock title="UFO Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · UFO"
            description="UFO/saucer-shaped perc positioned in upper chamber"
            size="800x600"
            alt="UFO percolator with saucer-shaped chamber"
          />
          <p className="mb-5">
            A flying-saucer-shaped chamber typically positioned in the upper
            neck of the bong, often in its own isolated water reservoir.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "High",
              drag: "Medium",
              cleaning: "Manageable",
              bestFor: "Two-stage filtration",
            }}
          />
          <p className="mb-5">
            <strong className="text-[#145C3C]">Naming note:</strong> Some
            shops use "UFO," "showerhead," and "dome" interchangeably. The
            cleanest distinction: <strong>showerhead = anchored to floor</strong>,{" "}
            <strong>UFO = saucer-shaped, sits higher up</strong>.
          </p>
        </PercBlock>

        <PercBlock title="Matrix Percolator (Birdcage)">
          <PercImagePlaceholder
            label="PERC IMAGE · MATRIX / BIRDCAGE"
            description="Matrix perc with vertical and horizontal slits in cylindrical chamber"
            size="800x900"
            alt="Matrix or birdcage percolator with grid of slits"
          />
          <p className="mb-5">
            A cylindrical chamber with both vertical AND horizontal slits cut
            through its walls in a dense grid. Provides 360° diffusion in every
            direction at once.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Maximum",
              drag: "High",
              cleaning: "Hard",
              bestFor: "Experienced + big lungs",
            }}
          />
          <p className="mb-5">
            <strong className="text-[#145C3C]">Stereo Matrix:</strong> Two
            matrix percs paired side-by-side or stacked. The peak of diffusion,
            cooling, and complexity. This is flagship territory — and flagship
            drag.
          </p>
        </PercBlock>

        <PercBlock title="Donut Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · DONUT"
            description="Donut-shaped perc mounted in middle of chamber"
            size="800x600"
            alt="Donut percolator with central hole"
          />
          <p className="mb-5">
            A vertical glass donut shape mounted in the middle of the chamber.
            Water and smoke flow <em>around</em> the donut's central hole,
            creating diffusion plus a built-in splash guard.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Medium",
              drag: "Low",
              cleaning: "Easy",
              bestFor: "Finishing stage",
            }}
          />
        </PercBlock>

        {/* FAMILY 5 */}
        <FamilyHeader
          family="Family 5: Specialty Percs"
          description="The less common designs. Some are decorative, some have specific use cases."
        />

        <PercBlock title="Swiss Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · SWISS"
            description="Swiss perc with sealed glass holes through flattened chamber"
            size="800x600"
            alt="Swiss percolator with cheese-like sealed holes"
          />
          <p className="mb-5">
            Holes are cut directly through the glass walls of a flattened
            chamber section — looks like a slice of Swiss cheese. Smoke and
            water flow <em>around</em> the holes (sealed glass channels), not
            through them.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Medium",
              drag: "Low",
              cleaning: "Moderate",
              bestFor: "Aesthetic-driven",
            }}
          />
        </PercBlock>

        <PercBlock title="Coil and Glycerin Coil Percolator">
          <PercImagePlaceholder
            label="PERC IMAGE · GLYCERIN COIL"
            description="Coiled glass tube, glycerin-filled, freezable design"
            size="1000x700"
            alt="Glycerin coil percolator for ice-cold hits"
          />
          <p className="mb-5">
            A coiled glass tube with two openings, sometimes filled with{" "}
            <strong className="text-[#145C3C]">glycerin</strong> that you can
            freeze. Smoke travels through the coil's long winding path,
            dramatically extending contact time with the cold surface.
          </p>
          <PercSpecBox
            spec={{
              diffusion: "Medium",
              drag: "Medium – High",
              cleaning: "Frequent",
              bestFor: "Cough-sensitive",
            }}
          />
          <p className="mb-5">
            <strong className="text-[#145C3C]">
              Why glycerin coils are special:
            </strong>{" "}
            Glycerin holds cold longer than water and won't freeze solid in a
            typical home freezer. Pop the coil in the freezer for an hour,
            attach to the bong, and the smoke that comes through feels closer
            to cold air than warm vapor.
          </p>
        </PercBlock>

        <PercBlock title="Other Specialty Percs Worth Knowing">
          <h4 className="mt-6 mb-2 font-semibold text-[#145C3C]">
            Barrel Percolator (Gridded Inline)
          </h4>
          <p className="mb-4">
            A cylindrical perc with gridded slots — looks like a wooden barrel
            laid sideways. Functions like a high-output inline. Best as a
            primary perc in stemless bongs or first stage in multi-perc builds.
          </p>

          <h4 className="mt-6 mb-2 font-semibold text-[#145C3C]">
            Dome Percolator
          </h4>
          <p className="mb-4">
            A vertical pillar covered by an inverted glass dome. Solid splash
            protection plus mid-tier diffusion.
          </p>

          <h4 className="mt-6 mb-2 font-semibold text-[#145C3C]">
            Ball Percolator
          </h4>
          <p className="mb-4">
            A hybrid of turbine and UFO designs — a glass ball or dome with
            slits patterned around the outside.
          </p>

          <h4 className="mt-6 mb-2 font-semibold text-[#145C3C]">
            Faberge Egg, Waffle, Spore, Gear
          </h4>
          <p className="mb-4">
            Rare specialty designs you'll occasionally encounter on artisan or
            high-end pieces. Mostly aesthetic, mid-tier function.
          </p>
        </PercBlock>

        {/* SECTION 4: MULTI-PERC */}
        <h2
          id="multi-perc"
          className="mt-12 mb-3 border-b-2 border-[#ff6b35] pb-2 font-heading text-3xl font-bold text-[#145C3C]"
        >
          Multi-Perc Combinations
        </h2>

        <p className="mb-5">
          This is where the premium-tier market lives. Two-stage and three-stage
          filtration combines different perc types to compound their strengths.
        </p>

        <p className="mb-5">
          The key principle: the <strong>first</strong> perc handles gross
          filtration with low drag, and the <strong>second</strong> perc
          finishes with smoothness. Order matters.
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Combo
                </th>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  What It Does
                </th>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Best For
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Inline + Tree",
                  "First stage cools and pre-filters; tree perc finishes with maximum diffusion",
                  "Flagship smoothness",
                ],
                [
                  "Inline + Honeycomb",
                  "Horizontal first-stage cooling, then disc-stack micro-bubbles",
                  "Best-balance multi-perc",
                ],
                [
                  "Showerhead + Honeycomb",
                  "360° base diffusion + dense micro-bubble cap",
                  "Common premium combo",
                ],
                [
                  "Double Honeycomb",
                  "Two honeycomb discs stacked",
                  "Smoothest no-drama option",
                ],
                [
                  "Stereo Matrix",
                  "Two matrix percs paired",
                  "Maximum cooling and visual flagship",
                ],
                [
                  "Double Tree",
                  "Two isolated water chambers, tree perc in each",
                  "Buttery smooth, classic premium",
                ],
                [
                  "Showerhead + Frozen Glycerin Coil",
                  "Water diffusion → ice-cold air feel",
                  "Cough-sensitive, premium tier",
                ],
              ].map(([combo, what, best], i) => (
                <tr key={i} className={i % 2 ? "bg-stone-50" : ""}>
                  <td className="border-b border-stone-200 px-3 py-2 align-top">
                    <strong className="text-[#145C3C]">{combo}</strong>
                  </td>
                  <td className="border-b border-stone-200 px-3 py-2 align-top">
                    {what}
                  </td>
                  <td className="border-b border-stone-200 px-3 py-2 align-top">
                    {best}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="warn" label="DRAG WARNING">
          <p>
            Each added perc adds drag. If you can't comfortably clear the
            chamber on a hit, the bong is over-perced for your lung capacity.
            We see this constantly with first-time premium buyers — they buy a
            stereo matrix because it looked amazing on Instagram, then can't
            pull through it. The single honeycomb will hit smoother{" "}
            <em>for you</em> than a piece you can't actually clear.
          </p>
        </Callout>

        {/* SECTION 5: HOW TO PICK */}
        <h2
          id="how-to-pick"
          className="mt-12 mb-3 border-b-2 border-[#ff6b35] pb-2 font-heading text-3xl font-bold text-[#145C3C]"
        >
          How to Pick the Right Perc for YOU
        </h2>

        <p className="mb-5">
          Most percolator guides give you generic recommendations like
          "honeycomb is great for everyone." We're going to do something
          different and give you <strong>four buying frameworks</strong>.
        </p>

        <h3 className="mt-8 mb-3 font-heading text-xl font-bold text-[#145C3C]">
          Framework 1: Match the Perc to YOUR Lungs
        </h3>

        <p className="mb-5">
          This is the framework nobody else online seems willing to teach, even
          though it's the single biggest reason people end up unhappy with their
          bong purchase.
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Your lung capacity
                </th>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Recommended perc tier
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  <strong>Limited</strong> (asthma, smaller frame, cough easily)
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Single honeycomb, ratchet, single inline, single showerhead
                </td>
              </tr>
              <tr className="bg-stone-50">
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  <strong>Average</strong> (most adult buyers)
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Double honeycomb, single tree, showerhead + inline combo
                </td>
              </tr>
              <tr>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  <strong>High</strong> (athletes, big lungs)
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Stereo matrix, triple honeycomb, fritted disc, multi-perc
                  combos
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-3 font-heading text-xl font-bold text-[#145C3C]">
          Framework 2: Match the Perc to What You're Smoking
        </h3>

        <p className="mb-5">
          <strong className="text-[#145C3C]">For flower:</strong> Almost any
          perc works. Inline first-stage helps with ash management.
        </p>
        <p className="mb-5">
          <strong className="text-[#145C3C]">For concentrates:</strong> Avoid
          fritted disc and ultra-fine honeycomb percs because concentrates clog
          micro-holes within days. Stick to showerhead, inline, ratchet, or
          standard-hole honeycomb percs.
        </p>
        <p className="mb-5">
          <strong className="text-[#145C3C]">For both:</strong> A bong with a
          single showerhead or single honeycomb perc plus a removable ash
          catcher is the most flexible setup.
        </p>

        <h3 className="mt-8 mb-3 font-heading text-xl font-bold text-[#145C3C]">
          Framework 3: Match the Perc to Your Cleaning Tolerance
        </h3>

        <p className="mb-5">
          Be honest with yourself. How often will you{" "}
          <em>actually</em> clean it?
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Cleaning frequency
                </th>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Recommended perc
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Weekly or more
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Anything goes — including fritted, tree, matrix
                </td>
              </tr>
              <tr className="bg-stone-50">
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Every 2–3 weeks
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Honeycomb, showerhead, inline, donut, barrel
                </td>
              </tr>
              <tr>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Monthly or less
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Showerhead, inline, donut
                </td>
              </tr>
              <tr className="bg-stone-50">
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  "Honestly? Almost never"
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Inline + diffused downstem combo. Buy a new bong every 6
                  months.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-3 font-heading text-xl font-bold text-[#145C3C]">
          Framework 4: Match the Perc to Your Budget
        </h3>

        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Budget
                </th>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  What you can realistically get
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  <strong>$30–60</strong>
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Diffused downstem bong with inline. Solid entry tier.
                </td>
              </tr>
              <tr className="bg-stone-50">
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  <strong>$60–120</strong>
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Single honeycomb or single showerhead. Best ROI category.
                </td>
              </tr>
              <tr>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  <strong>$120–200</strong>
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Double honeycomb, showerhead + inline, single tree perc
                </td>
              </tr>
              <tr className="bg-stone-50">
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  <strong>$200–350</strong>
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Multi-perc combos, stereo matrix, premium glass thickness
                </td>
              </tr>
              <tr>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  <strong>$350+</strong>
                </td>
                <td className="border-b border-stone-200 px-3 py-2 align-top">
                  Artisan glass, signed pieces, complex multi-stage builds
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-5">
          <strong className="text-[#145C3C]">Honest take:</strong> most people
          overspend. A $90 single honeycomb is going to outperform a $250 stereo
          matrix for someone who didn't need that much diffusion in the first
          place.
        </p>

        {/* EMAIL CAPTURE */}
        <div className="my-10 rounded-lg bg-gradient-to-br from-[#145C3C] to-[#1B7A4D] p-8 text-center text-stone-50">
          <h3 className="mb-2 font-heading text-2xl font-bold text-stone-50">
            Want a 60-second{" "}
            <em className="text-[#ffb88a] not-italic">perc match</em>?
          </h3>
          <p className="mb-5 text-sm text-stone-50/85">
            Get our Bong Buyer's Cheat Sheet — 10 pages, an interactive quiz,
            lung-capacity test, and $15 off your first order.
          </p>
          <Link
            href="/cheat-sheet"
            className="inline-block rounded bg-[#ff6b35] px-7 py-3 font-chalets text-base tracking-[0.15em] text-stone-900 transition-colors hover:bg-[#ff8556]"
          >
            DOWNLOAD THE CHEAT SHEET
          </Link>
        </div>

        {/* SECTION 6: CLEANING */}
        <h2
          id="cleaning"
          className="mt-12 mb-3 border-b-2 border-[#ff6b35] pb-2 font-heading text-3xl font-bold text-[#145C3C]"
        >
          Caring for Your Perc Bong
        </h2>

        <p className="mb-5">
          A dirty perc isn't just unsightly — it actively ruins the smoking
          experience. Resin clogs holes, increases drag, kills diffusion, and
          ruins flavor. A clean cheap bong outperforms a dirty expensive one
          every time.
        </p>

        <h3 className="mt-8 mb-3 font-heading text-xl font-bold text-[#145C3C]">
          The Cleaning Truth Nobody Tells Beginners
        </h3>

        <p className="mb-5">
          <strong className="text-[#145C3C]">
            You will need to clean it more often than you think.
          </strong>{" "}
          Honeycomb and fritted percs can clog noticeably in as few as 5
          sessions. Tree and matrix percs hide buildup that affects diffusion
          long before you can see it. The cleaning rhythm you'll maintain{" "}
          <em>is</em> the perc you should buy — not the perc you wish you had.
        </p>

        <h3 className="mt-8 mb-3 font-heading text-xl font-bold text-[#145C3C]">
          General Cleaning Protocol
        </h3>

        <ol className="mb-5 list-decimal space-y-2 pl-6">
          <li>
            <strong className="text-[#145C3C]">
              Empty water after every session.
            </strong>{" "}
            Never let water sit overnight.
          </li>
          <li>
            <strong className="text-[#145C3C]">
              Rinse with warm (not hot) water.
            </strong>{" "}
            Cool water doesn't dissolve resin; boiling water can crack glass.
          </li>
          <li>
            <strong className="text-[#145C3C]">Weekly deep clean:</strong>{" "}
            91%+ isopropyl alcohol + coarse salt. Cap both ends, shake gently,
            soak 15–30 minutes for stubborn perc resin.
          </li>
          <li>
            <strong className="text-[#145C3C]">
              Rinse thoroughly with warm water
            </strong>{" "}
            until the alcohol smell is gone.
          </li>
        </ol>

        <Callout variant="warn" label="CRITICAL THERMAL-SHOCK WARNING">
          <p>
            <strong>Never use boiling water on a percolator bong.</strong>{" "}
            Borosilicate glass is durable, but the welds inside percolators are
            the most thermally fragile part of the entire piece. Boiling water
            can crack internal welds invisibly — the bong will look fine, but
            the next time you use it, the perc fails. Warm water only. Always.
          </p>
        </Callout>

        <h3 className="mt-8 mb-3 font-heading text-xl font-bold text-[#145C3C]">
          Cleaning Frequency by Perc Type
        </h3>

        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Perc type
                </th>
                <th className="bg-[#145C3C] px-3 py-2 text-left font-chalets font-normal tracking-wider text-stone-50">
                  Recommended frequency
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Fritted disc", "Every 3–5 sessions"],
                ["Honeycomb", "Every 5–8 sessions"],
                ["Tree / matrix / jellyfish", "Every 5–7 sessions"],
                ["Inline / showerhead / donut", "Every 7–10 sessions"],
                [
                  "Glycerin coil",
                  "Every 2–3 sessions; re-freeze coil after each cleaning",
                ],
              ].map(([type, freq], i) => (
                <tr key={i} className={i % 2 ? "bg-stone-50" : ""}>
                  <td className="border-b border-stone-200 px-3 py-2 align-top">
                    {type}
                  </td>
                  <td className="border-b border-stone-200 px-3 py-2 align-top">
                    {freq}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 7: TOP PICKS */}
        <h2
          id="top-picks"
          className="mt-12 mb-3 border-b-2 border-[#ff6b35] pb-2 font-heading text-3xl font-bold text-[#145C3C]"
        >
          Highway 420's Top Picks
        </h2>

        <p className="mb-5">
          Based on years of selling glass and listening to what customers
          actually come back for, here are our category-by-category
          recommendations.
        </p>

        {TOP_PICKS.map((pick) => (
          <ProductCard key={pick.category} pick={pick} />
        ))}

        {/* SECTION 8: FAQ */}
        <h2
          id="faq"
          className="mt-12 mb-3 border-b-2 border-[#ff6b35] pb-2 font-heading text-3xl font-bold text-[#145C3C]"
        >
          Frequently Asked Questions
        </h2>

        <div className="my-6">
          <FAQItem
            question="Are percolator bongs worth it?"
            answer="Yes — meaningfully so. A well-percolated bong produces noticeably smoother, cooler hits than a basic bong with only a downstem. The trade-offs are price (perc bongs cost more) and cleaning (more intricate geometry means more maintenance)."
          />
          <FAQItem
            question="What's the most popular percolator type?"
            answer="The honeycomb percolator. Across the industry, honeycomb is consistently identified as the best-selling and most-recommended perc style because it offers the best balance of high diffusion, low drag, and manageable cleaning."
          />
          <FAQItem
            question="What's the difference between a honeycomb and a tree perc?"
            answer="Honeycomb percs are flat discs with dozens of small holes — they produce a dense, uniform sheet of micro-bubbles with low drag and easy cleaning. Tree percs use multiple vertical arms with slits at the base — they produce more dramatic bubble streams with higher diffusion but more drag and harder cleaning."
          />
          <FAQItem
            question="How many percolators is too many?"
            answer="When the drag exceeds your lung capacity to comfortably clear the hit. Three percs is the practical ceiling for most adult buyers; beyond that, you're working harder than the bong is."
          />
          <FAQItem
            question="Can I use a perc bong for dabs?"
            answer="Yes — but the perc style matters. Avoid fritted disc and ultra-fine honeycomb percs because concentrates clog their microscopic holes within days. Showerhead, inline, ratchet, and standard-hole honeycomb percs all work well for concentrates with regular cleaning."
          />
          <FAQItem
            question="Why is my honeycomb perc clogged?"
            answer="Resin buildup in the honeycomb's small holes. Cleaning fix: 91%+ isopropyl alcohol plus coarse salt, soaked 15–30 minutes, with both ends sealed during gentle shaking. Prevention: clean every 5–8 sessions and add a removable ash catcher."
          />
          <FAQItem
            question="How often should I clean my perc bong?"
            answer="Every 5–8 sessions for honeycomb percs, every 5–7 sessions for tree or matrix percs, every 7–10 sessions for showerhead or inline percs, every 3–5 sessions for fritted disc percs. Always empty water after every session."
          />
          <FAQItem
            question="Why won't my bong clear?"
            answer="Three common causes: water level too high (lower it); percolator dirty (clean it); or the perc is genuinely too aggressive for your lung capacity, which is a perc-mismatch problem you can't fix without a different bong."
          />
          <FAQItem
            question="Is borosilicate glass worth the upgrade?"
            answer="Yes. Borosilicate glass is significantly more thermally and impact resistant than standard glass. It tolerates temperature changes, resists cracking, and lasts longer."
          />
          <FAQItem
            question="What's the smoothest perc on the market?"
            answer="The fritted disc, by a wide margin. The trade-off is extreme drag and frequent cleaning."
          />
        </div>

        {/* CLOSING */}
        <div className="my-12 rounded-lg bg-stone-50 p-8 text-center">
          <h3 className="mt-0 mb-3 font-heading text-2xl font-bold text-[#145C3C]">
            The Honest Buying Truth
          </h3>
          <p className="mb-3">
            The "best" perc isn't the most expensive, the flashiest, or the one
            with the highest diffusion specs. It's the one that matches{" "}
            <em>your</em> lungs, <em>your</em> cleaning rhythm, <em>your</em>{" "}
            preferred material, and <em>your</em> budget.
          </p>
          <p className="mb-5">
            When in doubt: start with a single honeycomb. It's our
            most-recommended starting point because it gets the most people to
            "happy with my bong" the fastest.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/collections/percolator-bongs"
              className="inline-block rounded bg-[#145C3C] px-6 py-2.5 font-chalets text-sm tracking-[0.15em] text-stone-50 transition-colors hover:bg-[#ff6b35] hover:text-stone-900"
            >
              SHOP PERCOLATOR BONGS
            </Link>
            <Link
              href="/cheat-sheet"
              className="inline-block rounded bg-[#ff6b35] px-6 py-2.5 font-chalets text-sm tracking-[0.15em] text-stone-900 transition-colors hover:bg-[#0F4A30] hover:text-stone-50"
            >
              GET THE CHEAT SHEET
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}