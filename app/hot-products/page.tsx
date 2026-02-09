"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { addToCart } from "../lib/cart-utils";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number; 
  is_featured: boolean;
  is_active: boolean;
  slug: string;
}

export default function HotProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHotProducts() {
      try {
        const response = await fetch('/api/products/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Handle response format { products: [...] } or direct array [...]
        const rawProducts = Array.isArray(data) ? data : (data.products || []);
        
        const mappedProducts = rawProducts.map((p: any) => ({
          id: String(p.id),
          title: p.name || 'Unknown Product',
          price: Number(p.sale_price || p.our_price || 0),
          image: p.image_url || null,
          category: p.category_id || 'General',
          rating: 5,
          reviews: Math.floor(Math.random() * 50) + 10,
          is_featured: p.featured || false,
          is_active: p.is_active || false,
          slug: p.slug || String(p.id)
        }));
        
        setProducts(mappedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchHotProducts();
  }, []);

  const handleAddToCart = (e: MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    
    // Create floating +1 animation
    const btn = e.currentTarget as HTMLButtonElement;
    const rect = btn.getBoundingClientRect();
    const floatingOne = document.createElement('div');
    floatingOne.textContent = '+1';
    floatingOne.style.position = 'fixed';
    floatingOne.style.left = `${rect.left + rect.width / 2}px`;
    floatingOne.style.top = `${rect.top}px`;
    floatingOne.style.color = '#10b981';
    floatingOne.style.fontWeight = 'bold';
    floatingOne.style.pointerEvents = 'none';
    floatingOne.style.zIndex = '1000';
    floatingOne.className = 'animate-float-up';
    document.body.appendChild(floatingOne);
    setTimeout(() => floatingOne.remove(), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-black">
        {/* Background base */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black opacity-90" />
        
        {/* Subtle Ambient Glow (No flames, just mood lighting) */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[500px] bg-gradient-to-t from-orange-900/20 to-transparent blur-3xl rounded-full opacity-50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display-twilight text-white mb-6 tracking-wider drop-shadow-2xl">
            HOT PRODUCTS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light tracking-wide">
            Our hottest selling products — handpicked favorites that customers can&apos;t get enough of!
          </p>
          
          <div className="mt-8 flex justify-center gap-4 text-sm font-medium text-white/80">
            <span className="flex items-center gap-1">
              <span className="text-orange-500">🔥</span> {products.length > 0 ? products.length : '20+'} Hot Items
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600 self-center" />
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> Fast Shipping
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600 self-center" />
            <span className="flex items-center gap-1">
              <span className="text-yellow-400">★</span> Top Rated
            </span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h3 className="text-xl text-red-500 mb-4">Error loading hot products</h3>
            <p className="text-gray-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.slug}`}
                className="group relative block"
              >
                <div className="aspect-[3/4] relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <span>🔥</span> HOT
                  </div>
                  
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {/* Quick Add Button - Desktop */}
                  <div className="absolute bottom-4 right-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                      title="Add to Cart"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-gray-100 font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span className="text-yellow-400">★</span>
                      <span>{product.rating}</span>
                      <span className="text-gray-400">({product.reviews})</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <div className="text-center pb-20">
         <Link 
           href="/products" 
           className="inline-flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
         >
           <span>← Back to All Products</span>
         </Link>
      </div>
    </div>
  );
}
