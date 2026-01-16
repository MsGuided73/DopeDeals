'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addToCart } from '../lib/cart-utils';

interface EdibleProduct {
  id: string;
  name: string;
  our_price: number;
  sale_price?: number;
  image_url: string | null;
  description?: string | null;
  short_description?: string | null;
  sku: string | null;
  stock_quantity: number;
  brand_name?: string | null;
}

export default function EdiblesPageContent() {
  const [products, setProducts] = useState<EdibleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEdibleProducts();
  }, []);

  const loadEdibleProducts = async () => {
    try {
      setLoading(true);
      // Fetch products with category_slug filtering for edibles
      const response = await fetch('/api/products/edibles');

      if (!response.ok) throw new Error('Failed to load products');

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading edible products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Group products by type
  const tinctures = products.filter((p) => 
    p.name?.toLowerCase().includes('tincture') || 
    p.description?.toLowerCase().includes('tincture')
  );
  
  const salves = products.filter((p) => 
    p.name?.toLowerCase().includes('salve') || 
    p.description?.toLowerCase().includes('salve') ||
    p.name?.toLowerCase().includes('balm')
  );
  
  const edibles = products.filter((p) => 
    (p.name?.toLowerCase().includes('edible') || 
     p.name?.toLowerCase().includes('gummies') ||
     p.name?.toLowerCase().includes('candy')) &&
    !tinctures.includes(p) && 
    !salves.includes(p)
  );

  const renderProductCard = (product: EdibleProduct) => (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-sm font-medium">No Image</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        {product.brand_name && (
          <p className="text-sm font-black text-dope-orange-600 mb-2 uppercase tracking-wide">
            {product.brand_name}
          </p>
        )}
        
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors">
          {product.name}
        </h3>

        <div className="mt-4">
          <div className="mb-4">
            {product.sale_price && product.sale_price < product.our_price ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    ${product.our_price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    SALE
                  </span>
                </div>
                <div className="text-xl font-bold text-green-600">
                  ${product.sale_price.toFixed(2)}
                </div>
              </div>
            ) : (
              <div className="text-xl font-bold text-gray-900">
                ${product.our_price.toFixed(2)}
              </div>
            )}
          </div>

          <button
            className="w-full px-4 py-3 bg-transparent text-green-800 border-2 border-green-800 font-bold rounded-full transition-all duration-300 text-center text-sm hover:bg-green-800 hover:text-white hover:scale-105 hover:shadow-lg"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await addToCart(product.id, 1);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-black mb-6">
          EDIBLES, SALVES & TINCTURES
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Premium CBD wellness products for every need. From tinctures to salves, discover natural solutions for better living.
        </p>
      </div>

      {/* CBD Tinctures Section */}
      <section id="tinctures" className="mb-16">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">CBD TINCTURES</h2>
          <p className="text-lg text-gray-600">Premium CBD oil tinctures for daily wellness</p>
        </div>
        
        {tinctures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tinctures.map(product => (
              <div key={product.id}>{renderProductCard(product)}</div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No tinctures available at this time</p>
          </div>
        )}
      </section>

      {/* Salves Section */}
      <section id="salves" className="mb-16">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">CBD SALVES</h2>
          <p className="text-lg text-gray-600">Topical CBD balms and salves for targeted relief</p>
        </div>
        
        {salves.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {salves.map(product => (
              <div key={product.id}>{renderProductCard(product)}</div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No salves available at this time</p>
          </div>
        )}
      </section>

      {/* Edibles Section */}
      <section id="edibles" className="mb-16">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">CBD EDIBLES</h2>
          <p className="text-lg text-gray-600">Delicious CBD-infused treats and snacks</p>
        </div>
        
        {edibles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {edibles.map(product => (
              <div key={product.id}>{renderProductCard(product)}</div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No edibles available at this time</p>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="mt-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">Why Choose Our CBD Products?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="font-bold text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-600">Lab-tested, high-quality CBD from trusted sources</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💯</div>
              <h3 className="font-bold text-xl mb-2">Legal & Safe</h3>
              <p className="text-gray-600">All products contain less than 0.3% THC</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-xl mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $75</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
