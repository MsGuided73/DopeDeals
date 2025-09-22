import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '../../products/components/ProductCard';
import GlobalMasthead from '../../components/GlobalMasthead';
import AgeVerification from '../../components/AgeVerification';
import { supabaseServer } from '../../lib/supabase-server';

export const metadata = {
  title: 'Cookies - Premium Cannabis Brand | DOPE CITY',
  description: 'Discover Cookies premium cannabis products. Founded by Berner, Cookies offers high-quality flower, pre-rolls, and accessories. Experience top-tier cannabis genetics and lifestyle products at DOPE CITY.',
  keywords: 'Cookies, Berner, premium cannabis, flower, pre-rolls, THCA, cannabis genetics, lifestyle products',
};

export default async function CookiesPage() {
  // Get Cookies brand
  const { data: cookiesBrand } = await supabaseServer
    .from('brands')
    .select('*')
    .eq('name', 'Cookies')
    .single();

  // Get Cookies products
  const { data: products } = await supabaseServer
    .from('products')
    .select('*')
    .eq('brand_name', 'Cookies')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('price', { ascending: false });

  const featuredProducts = products?.slice(0, 8) || [];
  const productCount = products?.length || 0;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "Cookies",
    "description": "Premium cannabis brand founded by Berner, known for high-quality flower, pre-rolls, and accessories",
    "url": "https://dopecity.com/brands/cookies",
    "logo": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    "sameAs": [
      "https://www.cookies.co"
    ],
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
        <section className="relative bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white py-20">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="dope-city-title text-6xl mb-6 tracking-wider">
                  COOKIES
                </h1>
                <p className="text-xl mb-8 leading-relaxed">
                  Premium cannabis brand founded by Berner. Experience the finest genetics, 
                  top-tier flower, and lifestyle products that have made Cookies a global phenomenon.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-medium">{productCount} Products</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-medium">Premium Quality</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-medium">Founded by Berner</span>
                  </div>
                </div>
                <Link 
                  href="#products" 
                  className="inline-block bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Shop Cookies Products
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex items-center justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                    alt="Cookies Brand"
                    width={300}
                    height={300}
                    className="rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  The Cookies Story
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Founded by rapper and entrepreneur Berner, Cookies has become one of the most 
                  recognizable names in cannabis. Starting in San Francisco, the brand has grown 
                  into a global phenomenon known for premium genetics and innovative products.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  From legendary strains like Girl Scout Cookies and Gelato to cutting-edge 
                  accessories and lifestyle products, Cookies represents the pinnacle of 
                  cannabis culture and quality.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-dope-orange-500 mb-2">2010</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Founded</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-dope-orange-500 mb-2">50+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Locations</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80"
                  alt="Cannabis cultivation"
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
                Featured Cookies Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover our premium selection of Cookies products, from top-shelf flower 
                to innovative accessories.
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
                href="/products?brand=cookies"
                className="inline-block bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View All Cookies Products ({productCount})
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
                <div className="text-3xl mb-4">🌿</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Flower</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Premium THCA flower</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🚬</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Pre-Rolls</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ready-to-smoke joints</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🔋</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Batteries</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vape accessories</p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🍬</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Edibles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gummies & chocolates</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
