import { Metadata } from "next";
import { Suspense } from "react";
import nextDynamic from "next/dynamic";
import GlobalMasthead from "./components/GlobalMasthead";
import FullscreenCarousel from "./components/FullscreenCarousel";
import CollectionsGrid from "./components/CollectionsGrid";

export const metadata: Metadata = {
  title: "HIGHWAY 420 — Premium Headshop | Bongs, Vapes, Edibles & More",
  description:
    "Your online headshop for premium glass, bongs, dab rigs, vapes, edibles & more. Free shipping over $75. Shop the best brands at the lowest prices.",
  alternates: { canonical: "https://highway420.com" },
};

// Lazy-load below-the-fold sections for faster initial page load
const FeaturedProductsSection = nextDynamic(() => import("./components/FeaturedProductsSection"));
const NewProductsSection      = nextDynamic(() => import("./components/NewProductsSection"));
const TrustedBrandsBulletin   = nextDynamic(() => import("./components/TrustedBrandsBulletin"));
const AboutHighway420         = nextDynamic(() => import("./components/AboutHighway420"));
const SpotlightReviews        = nextDynamic(() => import("./components/SpotlightReviews"));
const DopeDealsSection        = nextDynamic(() => import("./components/DopeDealsSection"));
const RideWithUsBanner        = nextDynamic(() => import("./components/RideWithUsBanner"));
const RoadTripsSection        = nextDynamic(() => import("./components/RoadTripsSection"));
const HomeBlogArticles        = nextDynamic(() => import("./components/HomeBlogArticles"));
const HomeTopicLinksBar       = nextDynamic(() => import("./components/HomeTopicLinksBar"));

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

function SectionFallback() {
  return <div className="h-40 animate-pulse bg-gray-100 mx-0 my-0" />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Global Masthead ── */}
      <GlobalMasthead />

      {/* ── Hero Carousel ── */}
      <div style={{ marginTop: '5px' }}>
        <FullscreenCarousel />
      </div>

      {/* ── Main Content ── */}
      <main className="w-full">

        {/* ── Shop by Category ── */}
        <section className="dg-section-gray">
          <CollectionsGrid />
        </section>

        {/* ── NEW SECTION SLOT ── (replaces the old Popular Setups placeholder)
            Drop the new homepage feature section here, above Hot Products. */}

        {/* ── Hot Products ── */}
        <Suspense fallback={<SectionFallback />}>
          <FeaturedProductsSection />
        </Suspense>

        {/* ── Fresh Drops (New Arrivals) ── */}
        <Suspense fallback={<SectionFallback />}>
          <NewProductsSection />
        </Suspense>

        {/* ── Dope Deals ── */}
        <Suspense fallback={<SectionFallback />}>
          <DopeDealsSection />
        </Suspense>

        {/* ── Road Trips ── */}
        <Suspense fallback={<SectionFallback />}>
          <RoadTripsSection />
        </Suspense>

        {/* ── Trusted Brands ── */}
        <Suspense fallback={<SectionFallback />}>
          <TrustedBrandsBulletin />
        </Suspense>

        {/* ── Reviews ── */}
        <Suspense fallback={<SectionFallback />}>
          <SpotlightReviews />
        </Suspense>
      </main>

      <Suspense fallback={<SectionFallback />}>
        <AboutHighway420 />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <RideWithUsBanner />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <HomeBlogArticles />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <HomeTopicLinksBar />
      </Suspense>
    </div>
  );
}
