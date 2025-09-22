import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '../../products/components/ProductCard';
import GlobalMasthead from '../../components/GlobalMasthead';
import AgeVerification from '../../components/AgeVerification';
import { supabaseServer } from '../../lib/supabase-server';

export const metadata = {
  title: 'Urth Farmacy - Premium THCA & Cannabis Products | DOPE CITY',
  description: 'Discover Urth Farmacy\'s premium THCA products, live resin cartridges, and innovative disposables. Pharmaceutical-grade extraction meets exotic genetics for exceptional cannabis experiences.',
  keywords: 'Urth Farmacy, THCA, live resin, cartridges, disposables, pharmaceutical grade, cannabis extraction, exotic genetics',
};

export default async function UrthFarmacyPage() {
  // Get Urth Farmacy brand
  const { data: urthFarmacyBrand } = await supabaseServer
    .from('brands')
    .select('*')
    .eq('name', 'Urth Farmacy')
    .single();

  // Get Urth Farmacy products
  const { data: products } = await supabaseServer
    .from('products')
    .select('*')
    .eq('brand_name', 'Urth Farmacy')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('price', { ascending: false });

  const featuredProducts = products?.slice(0, 8) || [];
  const productCount = products?.length || 0;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "Urth Farmacy",
    "description": "Premium cannabis brand specializing in THCA products and pharmaceutical-grade extraction",
    "url": "https://dopecity.com/brands/urth-farmacy",
    "logo": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80",
    "makesOffer": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": Math.min(...(products?.map(p => p.price) || [0])),
      "highPrice": Math.max(...(products?.map(p => p.price) || [0])),
      "offerCount": productCount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <AgeVerification />
      <GlobalMasthead />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dope-orange-500/10 to-transparent"></div>

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <div className="mb-8">
              <h1 className="dope-city-title text-6xl md:text-8xl mb-6 text-white drop-shadow-2xl">
                URTH FARMACY
              </h1>
              <div className="w-32 h-1 bg-dope-orange-500 mx-auto mb-8"></div>
            </div>

            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-200">
              Premium cannabis brand specializing in pharmaceutical-grade THCA products,
              live resin cartridges, and innovative disposables. Where science meets nature.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <div className="text-4xl font-bold text-dope-orange-400 mb-2">{productCount}</div>
                <div className="text-gray-300">Premium Products</div>
              </div>
              <div className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <div className="text-4xl font-bold text-dope-orange-400 mb-2">99%+</div>
                <div className="text-gray-300">Purity</div>
              </div>
              <div className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <div className="text-4xl font-bold text-dope-orange-400 mb-2">Lab</div>
                <div className="text-gray-300">Tested</div>
              </div>
            </div>

            <div className="mt-12">
              <Link
                href="#products"
                className="inline-block bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Shop Urth Farmacy Products
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Pharmaceutical-Grade Cannabis
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Urth Farmacy combines cutting-edge extraction technology with premium genetics 
                  to create exceptional cannabis products. Our pharmaceutical-grade approach ensures 
                  consistent potency and purity in every product.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  From our signature live resin cartridges to innovative THCA disposables, 
                  every Urth Farmacy product represents the pinnacle of cannabis science and craftsmanship.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-dope-orange-500 mb-2">99%+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Purity</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-dope-orange-500 mb-2">Lab</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tested</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&q=80"
                  alt="Cannabis extraction laboratory"
                  width={500}
                  height={400}
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="products" className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Featured Urth Farmacy Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore our premium selection of THCA products, live resin cartridges, 
                and pharmaceutical-grade cannabis extracts.
              </p>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Products are being updated. Check back soon!
                </p>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/products?brand=urth-farmacy"
                className="inline-block bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View All Urth Farmacy Products ({productCount})
              </Link>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Product Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🧪</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Live Resin</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Premium extraction</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">💎</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Liquid Diamond</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crystal clear potency</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🚬</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Pre-Rolls</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">THCA flower joints</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Disposables</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ready-to-use vapes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Promise */}
        <section className="py-16 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Quality Promise
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Every Urth Farmacy product undergoes rigorous testing and quality control. 
              We use only the finest genetics and pharmaceutical-grade extraction methods 
              to ensure you receive the purest, most potent cannabis products available.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Lab Tested</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Third-party verified</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Premium Genetics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Exotic strains</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚗️</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Clean Extraction</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">No residual solvents</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
