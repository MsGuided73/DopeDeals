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

      {/* Special Featured Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Special Puffco Ryan Fitt Recycler - Featured Product */}
          <div className="group bg-white rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-gray-200 hover:border-dope-orange-300">
            <div className="flex">
              {/* Product Image - Left Side */}
              <div className="relative w-1/2 bg-gray-50 flex items-center justify-center p-8">
                <img
                  src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/puffco-ryan-fitt-recycler.jpg"
                  alt="Puffco Ryan Fitt Recycler Glass Attachment"
                  className="w-full h-full object-contain max-h-80"
                  onError={(e) => {
                    console.error('Ryan Fitt image failed to load:', e);
                    console.log('Image URL:', (e.target as HTMLImageElement).src);
                  }}
                  onLoad={(e) => {
                    console.log('Ryan Fitt image loaded successfully');
                    console.log('Image natural size:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);
                  }}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-dope-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    🔥 Staff Pick
                  </div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    -25% OFF
                  </div>
                </div>
              </div>

              {/* Product Info - Right Side */}
              <div className="flex-1 p-8 flex flex-col justify-between">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-dope-orange-600 transition-colors">
                    Puffco Ryan Fitt Recycler Glass
                  </h3>
                  <p className="text-base text-gray-600 mb-3 font-semibold">Puffco</p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Premium recycler glass attachment designed by Ryan Fitt for the Puffco Peak Pro.
                    Enhanced vapor cooling and superior filtration for the ultimate dabbing experience.
                  </p>
                </div>

                {/* Special Pricing Display */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-base text-gray-600 font-medium">Their Price</span>
                    <span className="text-xl text-gray-500 line-through decoration-red-500 decoration-4">
                      $249.99
                    </span>
                    <span className="text-base text-gray-600 font-medium">-</span>
                    <span className="text-base text-gray-600 font-medium">Our Price</span>
                    <span className="text-3xl font-bold text-dope-orange-500">
                      $199.99
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>You Save $50!</span>
                    <div className="flex-1 h-0.5 bg-dope-orange-500"></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Link
                    href="/product/puffco-ryan-fitt-recycler"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 text-center text-base hover:scale-105"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await addToCart('puffco-ryan-fitt-recycler', 1);
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

          {/* Special Truemoola Delta 8 Gummies - Featured Product */}
          <div className="group bg-white rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-gray-200 hover:border-dope-orange-300">
            <div className="flex">
              {/* Product Image - Left Side */}
              <div className="relative w-1/2 bg-gray-50 flex items-center justify-center p-8">
                <img
                  src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/truemoola-delta8-gummies.jpg"
                  alt="Truemoola Delta 8 Gummies 600mg"
                  className="w-full h-full object-contain max-h-80"
                  onError={(e) => {
                    console.error('Truemoola gummies image failed to load:', e);
                    console.log('Image URL:', (e.target as HTMLImageElement).src);
                  }}
                  onLoad={(e) => {
                    console.log('Truemoola gummies image loaded successfully');
                    console.log('Image natural size:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);
                  }}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    🌿 Premium Delta 8
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    10 Flavors
                  </div>
                </div>
              </div>

              {/* Product Info - Right Side */}
              <div className="flex-1 p-8 flex flex-col justify-between">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-dope-orange-600 transition-colors">
                    Truemoola Delta 8 Gummies
                  </h3>
                  <p className="text-base text-gray-600 mb-3 font-semibold">Truemoola</p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Premium Delta 8 THC gummies in 10 delicious flavors. Each pack contains 10 gummies
                    with 60mg of pure Delta 8 per piece. Vegan-friendly, gluten-free, and made in the USA.
                  </p>
                </div>

                {/* Special Pricing Display */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-base text-gray-600 font-medium">Pack Price</span>
                    <span className="text-3xl font-bold text-dope-orange-500">
                      $39.99
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>600mg Total • 60mg per gummy</span>
                    <div className="flex-1 h-0.5 bg-dope-orange-500"></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Link
                    href="/product/truemoola-delta8-gummies"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 text-center text-base hover:scale-105"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await addToCart('truemoola-delta8-gummies', 1);
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

        {/* Other Featured Products */}
        {productsToShow.length > 0 ? (
          productsToShow.slice(0, 5).map((product) => {
            const transformedProduct = transformProductForCard(product);
            return (
              <div key={product.id} className="group bg-white rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl border border-gray-200">
                {/* Product Image - Top */}
                <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-6">
                  {transformedProduct.image_url ? (
                    <img
                      src={transformedProduct.image_url}
                      alt={transformedProduct.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-sm">No Image</div>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {transformedProduct.featured && (
                      <div className="bg-dope-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    {transformedProduct.discount_percentage && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        -{transformedProduct.discount_percentage}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info - Bottom */}
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-dope-orange-600 transition-colors line-clamp-2">
                      {transformedProduct.name}
                    </h3>

                    {transformedProduct.brand_name && (
                      <p className="text-sm text-gray-600 mb-2 font-medium">{transformedProduct.brand_name}</p>
                    )}

                    {transformedProduct.short_description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {transformedProduct.short_description}
                      </p>
                    )}
                  </div>

                  {/* Special Pricing Display */}
                  <div className="mb-4">
                    {transformedProduct.compare_at_price ? (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Their Price</span>
                        <span className="text-lg text-gray-500 line-through">
                          ${parseFloat(transformedProduct.compare_at_price.toString()).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-600">-</span>
                        <span className="text-sm text-gray-600">Our Price</span>
                        <span className="text-2xl font-bold text-dope-orange-500">
                          ${parseFloat(transformedProduct.price).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-dope-orange-500 mb-2">
                        ${parseFloat(transformedProduct.price).toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors text-center text-sm"
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
                      className="flex-1 bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : null}

      {/* Pagination would go here if needed */}
    </section>
  );
}
