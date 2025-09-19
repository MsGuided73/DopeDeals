import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import GlobalMasthead from '../../../components/GlobalMasthead';
import DopeCityFooter from '../../../components/DopeCityFooter';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'ROOR - Premium German Glass | DOPE CITY',
  description: 'Discover ROOR\'s legendary German glass collection. Premium beakers, straight tubes, ash catchers, and accessories crafted from the finest Schott glass.',
  keywords: 'ROOR, German glass, beaker, straight tube, ash catcher, premium glass, Schott glass',
};

export default async function RoorPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get ROOR products (including both "ROOR" and "R" brand names)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .or('brand_name.eq.ROOR,brand_name.eq.R,name.ilike.%ROOR%,sku.ilike.%ROOR%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('price', { ascending: false });

  // Categorize products
  const beakers = products?.filter(p => 
    p.name.toLowerCase().includes('beaker') || 
    p.name.toLowerCase().includes('bk')
  ) || [];

  const straightTubes = products?.filter(p => 
    p.name.toLowerCase().includes('straight') || 
    p.name.toLowerCase().includes('st') ||
    p.name.toLowerCase().includes('zeaker')
  ) || [];

  const ashCatchers = products?.filter(p => 
    p.name.toLowerCase().includes('ash') || 
    p.name.toLowerCase().includes('dc')
  ) || [];

  const accessories = products?.filter(p => 
    !beakers.includes(p) && 
    !straightTubes.includes(p) && 
    !ashCatchers.includes(p)
  ) || [];

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-6xl mb-6" style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.02em' }}>
            ROOR
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            The legendary German glass brand. Since 1995, ROOR has been crafting the world's finest 
            borosilicate glass pieces using premium Schott glass and traditional German craftsmanship.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{beakers.length}</div>
              <div className="text-sm text-gray-300">Beakers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{straightTubes.length}</div>
              <div className="text-sm text-gray-300">Straight Tubes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{ashCatchers.length}</div>
              <div className="text-sm text-gray-300">Ash Catchers</div>
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
        
        {/* Beakers Section */}
        {beakers.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">ROOR Beakers</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Classic beaker-style water pipes featuring ROOR's signature wide base design 
              for maximum stability and smooth filtration.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beakers.map((product) => (
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
                          <div className="text-4xl mb-2">🏺</div>
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

        {/* Straight Tubes Section */}
        {straightTubes.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Straight Tubes & Zeakers</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Iconic straight tube designs and the legendary Zeaker series. 
              Engineered for optimal airflow and maximum smoke diffusion.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {straightTubes.map((product) => (
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
                          <div className="text-4xl mb-2">🔬</div>
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

        {/* Ash Catchers Section */}
        {ashCatchers.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Ash Catchers</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Premium ash catchers to keep your ROOR pieces clean and enhance filtration. 
              Available in various joint sizes and angles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ashCatchers.map((product) => (
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
                          <div className="text-3xl mb-2">🔧</div>
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

        {/* Accessories Section */}
        {accessories.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Accessories & Custom Pieces</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Unique ROOR accessories and custom pieces for the discerning collector.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accessories.map((product) => (
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
                          <div className="text-4xl mb-2">⚡</div>
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
            href="/products?brand=roor" 
            className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold"
          >
            View All ROOR Products ({products?.length || 0})
          </a>
        </div>
      </div>

      <DopeCityFooter />
    </div>
  );
}
