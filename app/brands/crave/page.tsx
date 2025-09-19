import { Metadata } from 'next';
import { supabaseServer } from '../../lib/supabase-server';
import GlobalMasthead from '../../../components/GlobalMasthead';
import DopeCityFooter from '../../../components/DopeCityFooter';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Crave Brand - Premium Vaping Products | DOPE CITY',
  description: 'Discover Crave\'s premium collection of disposable vapes, batteries, accessories, and cannabis products. Quality and innovation in every product.',
  keywords: 'Crave, vaping, disposables, batteries, accessories, cannabis, premium quality',
};

export default async function CravePage() {
  const supabase = supabaseServer;

  // Get Crave products (excluding nicotine products)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .or('name.ilike.%crave%,brand_name.ilike.%crave%,sku.ilike.%crave%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('featured', { ascending: false })
    .order('price', { ascending: false });

  // Categorize products
  const disposables = products?.filter(p => 
    p.name.toLowerCase().includes('puff') || 
    p.name.toLowerCase().includes('disposable') ||
    p.name.toLowerCase().includes('bc7000') ||
    p.name.toLowerCase().includes('turbo') ||
    p.name.toLowerCase().includes('mega')
  ) || [];

  const batteries = products?.filter(p => 
    p.name.toLowerCase().includes('battery') || 
    p.name.toLowerCase().includes('mod') ||
    p.name.toLowerCase().includes('charger')
  ) || [];

  const cannabis = products?.filter(p => 
    p.name.toLowerCase().includes('thca') || 
    p.name.toLowerCase().includes('preroll') ||
    p.name.toLowerCase().includes('cart') ||
    p.name.toLowerCase().includes('cbg')
  ) || [];

  const accessories = products?.filter(p => 
    !disposables.includes(p) && 
    !batteries.includes(p) && 
    !cannabis.includes(p)
  ) || [];

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl mb-6" style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.02em' }}>
            CRAVE
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Premium vaping products designed for quality, performance, and satisfaction. 
            From cutting-edge disposables to reliable accessories, Crave delivers innovation you can trust.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{disposables.length}</div>
              <div className="text-sm text-gray-300">Disposables</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{batteries.length}</div>
              <div className="text-sm text-gray-300">Batteries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{cannabis.length}</div>
              <div className="text-sm text-gray-300">Cannabis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{accessories.length}</div>
              <div className="text-sm text-gray-300">Accessories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Disposables Section */}
        {disposables.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Disposable Vapes</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Experience long-lasting performance with Crave's premium disposable vapes. 
              From 2500 to 20000 puffs, find your perfect vaping companion.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {disposables.slice(0, 6).map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">💨</div>
                          <div className="text-sm">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    {product.short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.short_description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Batteries Section */}
        {batteries.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Batteries & Power</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Reliable power solutions for your vaping needs. From compact 510 batteries to high-capacity mods.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {batteries.slice(0, 8).map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🔋</div>
                          <div className="text-xs">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cannabis Section */}
        {cannabis.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Cannabis Products</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Premium cannabis products including THCA prerolls, cartridges, and CBG disposables.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cannabis.slice(0, 6).map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🌿</div>
                          <div className="text-sm">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    {product.short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.short_description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Products Link */}
        <div className="text-center mt-16">
          <a 
            href="/products?brand=crave" 
            className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold"
          >
            View All Crave Products ({products?.length || 0})
          </a>
        </div>
      </div>

      <DopeCityFooter />
    </div>
  );
}
