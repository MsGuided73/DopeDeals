import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '../../products/components/ProductCard';
import GlobalMasthead from '../../components/GlobalMasthead';
import AgeVerification from '../../components/AgeVerification';
import { supabaseServer } from '../../lib/supabase-server';

export const metadata = {
  title: 'Puffco - Premium Electronic Dabbing Devices | DOPE CITY',
  description: 'Discover Puffco\'s revolutionary electronic dabbing devices. From the legendary Peak Pro to the portable Proxy, experience precision-engineered concentrate consumption at DOPE CITY.',
  keywords: 'Puffco, Peak Pro, Proxy, electronic dab rig, concentrate vaporizer, dabbing device, premium cannabis accessories',
};

export default async function PuffcoPage() {
  // Get Puffco brand
  const { data: puffcoBrand } = await supabaseServer
    .from('brands')
    .select('*')
    .eq('name', 'Puffco')
    .single();

  // Get Puffco products
  const { data: products } = await supabaseServer
    .from('products')
    .select('*')
    .eq('brand_name', 'Puffco')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('price', { ascending: false });

  // Organize products by category
  const peakProducts = products?.filter(p => p.name.toUpperCase().includes('PEAK')) || [];
  const proxyProducts = products?.filter(p => p.name.toUpperCase().includes('PROXY')) || [];
  const accessories = products?.filter(p => 
    p.name.toUpperCase().includes('CHAMBER') || 
    p.name.toUpperCase().includes('TRAVEL') ||
    p.name.toUpperCase().includes('GLASS')
  ) || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "Puffco",
    "description": "Premium electronic dabbing devices and accessories",
    "url": "https://dopecity.com/brands/puffco",
    "logo": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    "sameAs": [
      "https://www.puffco.com"
    ],
    "makesOffer": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": Math.min(...(products?.map(p => p.price) || [0])),
      "highPrice": Math.max(...(products?.map(p => p.price) || [0])),
      "offerCount": products?.length || 0
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

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 py-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6" 
                  style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.1em' }}>
                PUFFCO
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Revolutionary electronic dabbing technology that changed the game forever. 
                From the legendary Peak Pro to the portable Proxy, Puffco delivers 
                <span className="text-orange-500 font-bold"> precision-engineered perfection</span> 
                for the ultimate concentrate experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{products?.length || 0}</div>
                <div className="text-gray-400">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">2018</div>
                <div className="text-gray-400">Peak Pro Launch</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">#1</div>
                <div className="text-gray-400">E-Rig Brand</div>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Pro Section */}
        {peakProducts.length > 0 && (
          <section className="py-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" 
                    style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.1em' }}>
                  PEAK PRO COLLECTION
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  The gold standard of electronic dab rigs. Precision temperature control, 
                  intelligent heating, and unmatched flavor delivery.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {peakProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Proxy Section */}
        {proxyProducts.length > 0 && (
          <section className="py-16 bg-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" 
                    style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.1em' }}>
                  PROXY COLLECTION
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Portable power that never compromises. Take premium dabbing anywhere 
                  with the revolutionary modular design.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {proxyProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Accessories Section */}
        {accessories.length > 0 && (
          <section className="py-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" 
                    style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.1em' }}>
                  ACCESSORIES & PARTS
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Keep your Puffco performing at peak levels with genuine replacement parts, 
                  chambers, and premium accessories.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {accessories.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Puffco Section */}
        <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" 
                  style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.1em' }}>
                WHY PUFFCO DOMINATES
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-5xl mb-4">🔥</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-500">Precision Heating</h3>
                <p className="text-gray-300">
                  Advanced temperature control technology ensures perfect dabs every time, 
                  preserving terpenes and maximizing flavor.
                </p>
              </div>
              
              <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-500">Smart Technology</h3>
                <p className="text-gray-300">
                  Intelligent heating algorithms and app connectivity put you in complete 
                  control of your dabbing experience.
                </p>
              </div>
              
              <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-500">Premium Materials</h3>
                <p className="text-gray-300">
                  Only the finest materials - from borosilicate glass to medical-grade ceramics - 
                  ensure purity and durability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white" 
                style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.1em' }}>
              EXPERIENCE THE DIFFERENCE
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join the revolution that changed concentrate consumption forever. 
              Discover why Puffco is the choice of connoisseurs worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products?brand=puffco" 
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Shop All Puffco
              </Link>
              <Link 
                href="/brands" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors"
              >
                Explore More Brands
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
