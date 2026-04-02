import { Metadata } from "next";
import { Suspense } from "react";
import nextDynamic from "next/dynamic";
import CollectionsGrid from "./components/CollectionsGrid";
import GlobalMasthead from "./components/GlobalMasthead";

export const metadata: Metadata = {
  title: "HIGHWAY 420 — Premium Cannabis Culture & Smoke Shop",
  description: "Life is a Highway, Ride With Us. Premium cannabis products at the lowest prices — glass, bongs, dab rigs, vapes, edibles & more. Free shipping over $75.",
  alternates: { canonical: 'https://highway420.com' },
};

// Lazy-load below-the-fold sections for faster initial page load
const FeaturedProductsSection = nextDynamic(() => import("./components/FeaturedProductsSection"));
const NewProductsSection = nextDynamic(() => import("./components/NewProductsSection"));
const BrandLogoScrollbar = nextDynamic(() => import("../components/BrandLogoScrollbar"));
const TrustBadgeBar = nextDynamic(() => import("./components/TrustBadgeBar"));
const AboutHighway420 = nextDynamic(() => import("./components/AboutHighway420"));
const SpotlightReviews = nextDynamic(() => import("./components/SpotlightReviews"));
const DopeDealsSection = nextDynamic(() => import("./components/DopeDealsSection"));

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

function SectionFallback() {
  return <div className="h-64 animate-pulse bg-gray-100 rounded-lg mx-4 my-8" />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Global Masthead */}
      <GlobalMasthead />

      {/* Main Content */}
      <div>
        {/* Collections Grid — above the fold, loaded eagerly */}
        <main className="w-full px-0 py-0 -mt-8">
          {/* Enhanced Metallic Section Divider */}
          <div className="w-full -mt-0 mb-8">
            <div className="h-4 bg-gradient-to-r from-transparent via-white to-transparent mb-1 shadow-lg"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-1"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-1"></div>
            <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg"></div>
          </div>

          {/* Collections Title */}
          <div className="text-center mb-10 mt-4">
            <h1 className="text-4xl md:text-6xl font-display-twilight font-bold tracking-[0.15em]" style={{
              color: '#000000',
              textShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              SHOP OUR COLLECTIONS
            </h1>
          </div>

          <CollectionsGrid />

          {/* Below-the-fold sections — lazy loaded with Suspense */}
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
    </div>
  );
}
