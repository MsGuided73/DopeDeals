"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import UniversalProductCard from './UniversalProductCard';
import { supabaseBrowser } from '../lib/supabase-browser';
import { addToCart } from '../lib/cart-utils';

interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  our_price: number;
  sale_price?: number | null;
  fire_price?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  brand_id: string | null;
  brand_name: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);

      // Use API route lil StaffPicksSection.tsx does (WORKING PATTERN)
      const response = await fetch('/api/featured/products?limit=12');

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status text
        }
        console.error('Featured products API error:', errorMessage);
        throw new Error(`Failed to fetch featured products: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.products) {
        console.warn('No featured products data received');
        setProducts([]);
        return;
      }

      setProducts(data.products);

      // Log featured products for debugging
      console.log('🎯 Featured products loaded:', data.products.length);
      console.log('Featured count from API:', data.featuredCount);
      console.log('Fallback count from API:', data.fallbackCount);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const getProductDescription = (product: Product): string => {
    return product.short_description || product.description || 'Premium quality product';
  };

  // Transform product data for UniversalProductCard
  const transformProductForCard = (product: Product) => {
    // Handle both image_url and image_urls fields
    const primaryImageUrl = product.image_url ||
                           (product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null);

    return {
      id: product.id,
      name: product.name,
      price: product.our_price.toString(),
      image_url: primaryImageUrl || undefined,
      imageUrl: primaryImageUrl || undefined,
      image: primaryImageUrl || undefined,
      featured: product.featured,
      stock_quantity: product.stock_quantity,
      brand_name: product.brand_name || 'Unknown Brand',
      short_description: getProductDescription(product),
      description: getProductDescription(product),
      sku: product.sku || '',
      compare_at_price: product.sale_price && product.sale_price < product.our_price ? product.sale_price : undefined,
      discount_percentage: product.sale_price && product.sale_price < product.our_price
        ? Math.round(((product.our_price - product.sale_price) / product.our_price) * 100)
        : undefined,
    };
  };

  if (loading) {
    return (
      <section className="mt-24">
        <div className="flex items-center justify-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-lg transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 rounded-lg transform -rotate-1"></div>
            <div className="relative bg-gradient-to-r from-black via-gray-800 to-black p-6 rounded-lg border-2 border-gray-600 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg animate-shimmer"></div>
              <h2 className="text-5xl font-chalets text-white mb-0 relative z-10" style={{
                letterSpacing: '-0.02em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)'
              }}>
                FEATURED PRODUCTS
              </h2>
            </div>
          </div>

          {/* Special Puffco Proxy - Featured Product */}
          <div className="group bg-white rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-gray-200 hover:border-dope-orange-300">
            <div className="flex">
              {/* Product Image - Left Side */}
              <div className="relative w-1/2 bg-gray-50 flex items-center justify-center p-8">
                <img
                  src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/puffco-proxy.jpg"
                  alt="Puffco Proxy Vaporizer"
                  className="w-full h-full object-contain max-h-80"
                  onError={(e) => {
                    console.error('Puffco Proxy image failed to load:', e);
                    console.log('Image URL:', (e.target as HTMLImageElement).src);
                  }}
                  onLoad={(e) => {
                    console.log('Puffco Proxy image loaded successfully');
                    console.log('Image natural size:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);
                  }}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    🚀 Latest Innovation
                  </div>
                  <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    3D Chamber
                  </div>
                </div>
              </div>

              {/* Product Info - Right Side */}
              <div className="flex-1 p-8 flex flex-col justify-between">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-dope-orange-600 transition-colors">
                    Puffco Proxy Vaporizer
                  </h3>
                  <p className="text-base text-gray-600 mb-3 font-semibold">Puffco</p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    The Puffco Proxy is a portable, modular vaporizer that delivers premium vapor quality.
                    Features the revolutionary 3D Chamber technology for unmatched flavor and efficiency.
                  </p>
                </div>

                {/* Special Pricing Display */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-base text-gray-600 font-medium">Our Price</span>
                    <span className="text-3xl font-bold text-dope-orange-500">
                      $299.99
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Premium modular vaporizer with 3D chamber technology</span>
                    <div className="flex-1 h-0.5 bg-dope-orange-500"></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Link
                    href="/product/puffco-proxy"
                    className="flex-1 px-6 py-3 text-green-600 border-2 border-green-600 font-bold rounded-xl transition-all duration-300 text-center text-base hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await addToCart('puffco-proxy', 1);
                      } catch (error) {
                        console.error('Failed to add to cart:', error);
                      }
                    }}
                    className="flex-1 px-6 py-3 text-green-600 border-2 border-green-600 font-bold rounded-xl transition-all duration-300 text-center text-base hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shop All Link - Centered Below Title */}
        <div className="text-center mb-8">
          <Link
            href="/products"
            className="inline-block px-6 py-3 text-green-600 border-2 border-green-600 font-bold text-base rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
          >
            Shop all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted h-80"></div>
              <div className="p-6">
                <div className="h-6 bg-muted-foreground/30 rounded mb-2"></div>
                <div className="h-4 bg-muted-foreground/20 rounded mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
                  <div className="h-8 bg-muted-foreground/30 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-24">
        <div className="flex items-center justify-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 rounded-lg transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900 rounded-lg transform -rotate-1"></div>
            <div className="relative bg-gradient-to-r from-black via-gray-800 to-black p-6 rounded-lg border-2 border-gray-600 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg animate-shimmer"></div>
              <h2 className="text-5xl font-chalets text-white mb-0 relative z-10" style={{
                letterSpacing: '-0.02em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)'
              }}>
                FEATURED PRODUCTS
              </h2>
            </div>
          </div>
          <p className="text-red-500 mt-6">Error loading featured products: {error}</p>
        </div>
      </section>
    );
  }

  // Simplified image handling - API already filtered for valid images
  // Just use the products directly since API handles image validation
  const productsToShow = products;

  // Debug logging
  console.log('Featured products loaded:', products.length);
  console.log('Sample product:', products[0]);

  return (
    <section className="mt-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-chalets text-gray-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
          FEATURED PRODUCTS
        </h2>
      </div>

      {/* Shop All Link - Centered Below Title */}
      <div className="text-center mb-8">
        <Link
          href="/products"
          className="inline-block px-6 py-3 text-green-600 border-2 border-green-600 font-bold text-base rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
        >
          Shop all →
        </Link>
      </div>

      {/* Professional Product Grid */}
      {productsToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsToShow.slice(0, 4).map((product) => {
            const transformedProduct = transformProductForCard(product);
            return (
              <div key={product.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-dope-orange-300 transition-all duration-300 hover:-translate-y-1">
                {/* Product Image - Better aspect ratio */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {transformedProduct.image_url ? (
                    <img
                      src={transformedProduct.image_url}
                      alt={transformedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-sm font-medium">No Image</div>
                      </div>
                    </div>
                  )}

                  {/* Badges - Better positioned and styled */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {transformedProduct.featured && (
                      <div className="bg-gradient-to-r from-dope-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ⭐ Featured
                      </div>
                    )}
                    {transformedProduct.discount_percentage && (
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        -{transformedProduct.discount_percentage}% OFF
                      </div>
                    )}
                  </div>

                  {/* Quick Actions - Top right */}
                  <div className="absolute top-3 right-3">
                    <button className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Info - Better spacing and typography */}
                <div className="p-4">
                  {/* Brand - More prominent */}
                  {transformedProduct.brand_name && (
                    <p className="text-sm font-semibold text-dope-orange-600 mb-1 uppercase tracking-wide">
                      {transformedProduct.brand_name}
                    </p>
                  )}

                  {/* Product Name - Better typography */}
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors">
                    {transformedProduct.name}
                  </h3>

                  {/* Description - If available */}
                  {transformedProduct.short_description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {transformedProduct.short_description}
                    </p>
                  )}

                  {/* Pricing - Better layout */}
                  <div className="mb-4">
                    {transformedProduct.compare_at_price ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 line-through">
                            ${parseFloat(transformedProduct.compare_at_price.toString()).toFixed(2)}
                          </span>
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            Save {transformedProduct.discount_percentage}%
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          ${parseFloat(transformedProduct.price).toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-900">
                        ${parseFloat(transformedProduct.price).toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Actions - Ghost buttons with green theme */}
                  <div className="flex gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 px-4 py-2.5 text-green-600 border-2 border-green-600 font-bold rounded-lg transition-all duration-300 text-center text-sm hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await addToCart(product.id, 1);
                        } catch (error) {
                          console.error('Failed to add to cart:', error);
                        }
                      }}
                      className="flex-1 px-4 py-2.5 text-green-600 border-2 border-green-600 font-bold rounded-lg transition-all duration-300 text-center text-sm hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No featured products available</div>
          <p className="text-gray-400">Check back soon for new products with images!</p>
        </div>
      )}

      {/* Pagination would go here if needed */}
    </section>
  );
}
