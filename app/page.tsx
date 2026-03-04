import Link from "next/link";
import CollectionsGrid from "./components/CollectionsGrid";
import FeaturedProductsSection from "./components/FeaturedProductsSection";
import NewProductsSection from "./components/NewProductsSection";
import BrandLogoScrollbar from "../components/BrandLogoScrollbar";
import DopeDealsSection from "./components/DopeDealsSection";
import BlogArticlesGrid from "./components/BlogArticlesGrid";
import GlobalMasthead from "./components/GlobalMasthead";
import TrustBadgeBar from "./components/TrustBadgeBar";
import AboutHighway420 from "./components/AboutHighway420";
import SpotlightReviews from "./components/SpotlightReviews";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Global Masthead */}
      <GlobalMasthead />

      {/* Main Content */}
      <div>

        {/* Collections Grid */}
        <main className="w-full px-0 py-0 -mt-8">
          {/* Enhanced Metallic Section Divider */}
          <div className="w-full -mt-0 mb-8">
            {/* Top metallic line */}
            <div className="h-4 bg-gradient-to-r from-transparent via-white to-transparent mb-1 shadow-lg"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-1"></div>

            {/* Bottom metallic lines */}
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

          {/* Featured Products Section - Moved below Collections Grid */}
          <FeaturedProductsSection />

          {/* New Products Section */}
          <NewProductsSection />


          {/* Brand Logo Scrollbar */}
          <BrandLogoScrollbar />

          {/* Trust Badge Bar - Between Brands and About Section */}
          <TrustBadgeBar />

          {/* About Highway 420 - Trust & Compliance Section */}
          <AboutHighway420 />

          {/* Customer Reviews Section */}
          <SpotlightReviews />
        </main>

        {/* Dope Deals Section - Moved to bottom */}
        <DopeDealsSection />

        {/* Blog Articles Section - Just above footer 
        <section className="mt-24 mb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-display-twilight font-bold mb-4 tracking-[0.15em]" style={{
                color: '#000000'
              }}>
                HIGHER LEARNING
              </h2>
              {/* IMPORTANT: This text MUST use INTER font - do not change back to other fonts * /}
              <p className="text-xl text-gray-600 max-w-2xl mx-auto blog-subtitle-inter">
                Stay informed with the latest news, guides, and insights from the Highway 420 community
              </p>
            </div>

            <BlogArticlesGrid />
          </div>
        </section>
        */}
      </div>
    </div>
  );
}