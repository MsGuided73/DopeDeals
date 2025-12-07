import Link from "next/link";
import CollectionsGrid from "./components/CollectionsGrid";
import FeaturedProductsSection from "./components/FeaturedProductsSection";
import NewProductsSection from "./components/NewProductsSection";
import BrandLogoScrollbar from "../components/BrandLogoScrollbar";
import DopeDealsSection from "./components/DopeDealsSection";
import BlogArticlesGrid from "./components/BlogArticlesGrid";
import GlobalMasthead from "./components/GlobalMasthead";

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
          {/* Enhanced Metallic Section Divider - Reduced spacing to move grid up */}
          <div className="w-full -mt-0 mb-1">
            {/* Top metallic line - Reduced by 50% */}
            <div className="h-4 bg-gradient-to-r from-transparent via-white to-transparent mb-1 shadow-lg"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-1"></div>

            {/* Bottom metallic lines */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-1"></div>
            <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg"></div>
          </div>

          <CollectionsGrid />

          {/* Featured Products Section - Moved below Collections Grid */}
          <FeaturedProductsSection />

          {/* New Products Section */}
          <NewProductsSection />

          {/* Brand Logo Scrollbar */}
          <BrandLogoScrollbar />

          {/* Customer Reviews Section - Moved above footer */}
          <section className="mt-24 mb-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display-juicy-fills font-bold mb-4" style={{
                letterSpacing: '-0.02em',
                color: '#000000'
              }}>
                HIGH PRAISE
              </h1>
            </div>

            {/* Reviews Carousel - Enhanced Cards */}
            <div className="relative overflow-hidden px-4">
              <div className="flex animate-scroll-reviews">
                {/* Review 1 - Larger Cards */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-2xl">🥦</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>Mike J., CA</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-700 leading-relaxed">
                    "Amazing quality! The glass is thick and the design is perfect. Fast shipping too. Will definitely order again!"
                  </p>
                </div>

                {/* Review 2 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl">🌿</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>Sarah C., TX</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-700 leading-relaxed">
                    "Best smoke shop online! Great prices and the customer service is top notch. Highly recommend Highway 420!"
                  </p>
                </div>

                {/* Review 3 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-2xl">🫧</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>Alex R., CO</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-normal text-gray-700 leading-relaxed" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                    "The vaporizer I bought works perfectly. Great build quality and arrived exactly as described. 5 stars!"
                  </p>
                </div>

                {/* Review 4 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                      <span className="text-2xl">💨</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>Emma W., FL</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-normal text-gray-700 leading-relaxed" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                    "Love the selection and quality. The packaging was discreet and professional. Will be a repeat customer!"
                  </p>
                </div>

                {/* Review 5 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>David K., NY</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-normal text-gray-700 leading-relaxed" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                    "Excellent products and fast delivery. The grinder I ordered is solid and works great. Highly recommended!"
                  </p>
                </div>

                {/* Review 6 */}
                <div className="flex-shrink-0 w-96 mx-6 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full mr-6 bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                      <span className="text-2xl">🍀</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>Jessica T., WA</h4>
                      <div className="flex text-yellow-400 text-lg">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-normal text-gray-700 leading-relaxed" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                    "Perfect experience from start to finish. Quality products, fair prices, and excellent customer support!"
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Dope Deals Section - Moved to bottom */}
        <DopeDealsSection />

        {/* Blog Articles Section - Just above footer */}
        <section className="mt-24 mb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display-juicy-fills font-bold mb-4" style={{
                letterSpacing: '-0.02em',
                color: '#000000'
              }}>
                HIGHER LEARNING
              </h2>
              {/* IMPORTANT: This text MUST use INTER font - do not change back to other fonts */}
              <p className="text-xl text-gray-600 max-w-2xl mx-auto blog-subtitle-inter">
                Stay informed with the latest news, guides, and insights from the Highway 420 community
              </p>
            </div>

            <BlogArticlesGrid />
          </div>
        </section>
      </div>
    </div>
  );
}
