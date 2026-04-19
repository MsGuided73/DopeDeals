import { Metadata } from "next";
import { Suspense } from "react";
import nextDynamic from "next/dynamic";
import GlobalMasthead from "./components/GlobalMasthead";
import FullscreenCarousel from "./components/FullscreenCarousel";
import CollectionsGrid from "./components/CollectionsGrid";

export const metadata: Metadata = {
  title: "HIGHWAY 420 — Premium Cannabis Culture & Smoke Shop",
  description:
    "Life is a Highway, Ride With Us. Premium cannabis products at the lowest prices — glass, bongs, dab rigs, vapes, edibles & more. Free shipping over $75.",
  alternates: { canonical: "https://highway420.com" },
};

// Lazy-load below-the-fold sections for faster initial page load
const FeaturedProductsSection = nextDynamic(() => import("./components/FeaturedProductsSection"));
const NewProductsSection      = nextDynamic(() => import("./components/NewProductsSection"));
const BrandLogoScrollbar      = nextDynamic(() => import("../components/BrandLogoScrollbar"));
const TrustBadgeBar           = nextDynamic(() => import("./components/TrustBadgeBar"));
const AboutHighway420         = nextDynamic(() => import("./components/AboutHighway420"));
const SpotlightReviews        = nextDynamic(() => import("./components/SpotlightReviews"));
const DopeDealsSection        = nextDynamic(() => import("./components/DopeDealsSection"));

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

function SectionFallback() {
  return <div className="h-64 animate-pulse bg-gray-100 rounded-lg mx-4 my-8" />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0D0D0B' }}>
      {/* ── Global Masthead (sticky nav) ── */}
      <GlobalMasthead />

      {/* ── Hero Carousel — full width natural height, flush below masthead ── */}
      <FullscreenCarousel />

      {/* ── Main Content ── */}
      <main className="w-full px-0 py-0">
        {/* Section divider */}
        <div className="w-full">
          <div className="h-4 bg-gradient-to-r from-transparent via-white to-transparent mb-1 shadow-lg" />
          <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-1" />
          <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg" />
        </div>

        {/* ── Collections Section — vintage map background ── */}
        <section
          className="flex justify-center"
          style={{
            backgroundImage: `url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/CollectionGridv2/Background.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderTop: '3px solid #C5A059',
            borderBottom: '3px solid #C5A059',
            paddingTop: '40px',
            paddingBottom: '8px',
            width: '100%',
          }}
        >
          <CollectionsGrid />
        </section>

        <Suspense fallback={<SectionFallback />}>
          <FeaturedProductsSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <NewProductsSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <BrandLogoScrollbar />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <TrustBadgeBar />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <AboutHighway420 />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <SpotlightReviews />
        </Suspense>
      </main>

      <Suspense fallback={<SectionFallback />}>
        <DopeDealsSection />
      </Suspense>
    </div>
  );
}
