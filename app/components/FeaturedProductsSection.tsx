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

      // Use API route like StaffPicksSection.tsx does (WORKING PATTERN)
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

      // Debug: Check for Ryan Fitt product specifically
      const ryanFittProduct = data.products.find((p: Product) => p.name.toLowerCase().includes('ryan') && p.name.toLowerCase().includes('fitt'));
      if (ryanFittProduct) {
        console.log('🎯 Ryan Fitt product found in API response:');
        console.log('Name:', ryanFittProduct.name);
        console.log('Image URL:', ryanFittProduct.image_url);
        console.log('Image URLs array:', ryanFittProduct.image_urls);
      } else {
        console.log('❌ Ryan Fitt product NOT found in API response');
        console.log('Available products with "fitt":', data.products.filter((p: Product) => p.name.toLowerCase().includes('fitt')).map((p: Product) => p.name));
      }
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
      brand_name: product.brand_id || 'Unknown Brand',
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
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 text-center text-base hover:scale-105"
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
                    className="flex-1 bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 text-base hover:scale-105 hover:shadow-lg"
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
            className="text-dope-orange-500 hover:text-dope-orange-600 font-medium text-lg transition-colors"
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
          className="text-dope-orange-500 hover:text-dope-orange-600 font-medium text-lg transition-colors"
        >
          Shop all →
        </Link>
      </div>

      {/* Clean Product Grid - No oversized cards */}

        {/* Compact Featured Products - Smaller, more compact cards */}
        {productsToShow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {productsToShow.slice(0, 8).map((product) => {
              const transformedProduct = transformProductForCard(product);
              return (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                  {/* Product Image - Smaller aspect ratio */}
                  <div className="relative aspect-[4/3] bg-gray-50 rounded-md mb-3 overflow-hidden">
                    {transformedProduct.image_url ? (
                      <img
                        src={transformedProduct.image_url}
                        alt={transformedProduct.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-xl mb-1">📦</div>
                          <div className="text-xs">No Image</div>
                        </div>
                      </div>
                    )}

                    {/* Badges - Smaller and more compact */}
                    <div className="absolute top-1 left-1 flex flex-col gap-1">
                      {transformedProduct.featured && (
                        <div className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                          Featured
                        </div>
                      )}
                      {transformedProduct.discount_percentage && (
                        <div className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                          -{transformedProduct.discount_percentage}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info - More compact */}
                  <div className="space-y-1.5">
                    {/* Product Name - Smaller text */}
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight min-h-[2.5rem]">
                      {transformedProduct.name}
                    </h3>

                    {/* Brand - Smaller */}
                    {transformedProduct.brand_name && (
                      <p className="text-xs text-gray-600 font-medium">{transformedProduct.brand_name}</p>
                    )}

                    {/* Pricing - More compact */}
                    <div className="pt-1">
                      {transformedProduct.compare_at_price ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-600">Was</span>
                            <span className="text-xs text-gray-500 line-through">
                              ${parseFloat(transformedProduct.compare_at_price.toString()).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-600">Now</span>
                            <span className="text-sm font-bold text-orange-500">
                              ${parseFloat(transformedProduct.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-orange-500">
                          ${parseFloat(transformedProduct.price).toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Actions - More compact buttons */}
                    <div className="flex gap-1.5 pt-1">
                      <Link
                        href={`/product/${product.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-2 py-1.5 rounded text-xs font-medium transition-colors text-center"
                      >
                        View
                      </Link>
                      <button
                        onClick={async () => {
                          try {
                            await addToCart(product.id, 1);
                          } catch (error) {
                            console.error('Failed to add to cart:', error);
                          }
                        }}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

      {/* Pagination would go here if needed */}
    </section>
  );
}
