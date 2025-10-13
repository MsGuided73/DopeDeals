"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import UniversalProductCard from './UniversalProductCard';
import { supabaseBrowser } from '../lib/supabase-browser';

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

      // Query main_site_products table - prioritize featured products, fallback to recent
      const { data, error } = await supabaseBrowser
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price, sale_price, fire_price,
          image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
          created_at, updated_at
        `)
        // Note: Removed .eq('is_active', true) filter for current manual inventory phase
        // Add back when connecting to Zoho Inventory for automated product management
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching featured products:', error);
        throw new Error(error.message || 'Failed to fetch featured products from database');
      }

      if (!data) {
        console.warn('No featured products data received');
        setProducts([]);
        return;
      }

      setProducts(data);
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
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

  // Show all products with stock - prioritize those with images
  const productsWithImages = products.filter(product => {
    // Note: Removed is_active filter for current manual inventory phase
    // Add back when connecting to Zoho Inventory for automated product management
    if (product.stock_quantity <= 0) return false;

    // Check if product has a valid image_url
    const hasValidImageUrl = product.image_url &&
                           product.image_url.trim() !== '' &&
                           !product.image_url.includes('placehold.co') &&
                           !product.image_url.includes('placeholder');

    // Check if product has valid images in image_urls array
    const hasValidImageUrls = product.image_urls &&
                            Array.isArray(product.image_urls) &&
                            product.image_urls.length > 0 &&
                            product.image_urls.some(url =>
                              url && url.trim() !== '' &&
                              !url.includes('placehold.co') &&
                              !url.includes('placeholder')
                            );

    return hasValidImageUrl || hasValidImageUrls;
  });

  const productsWithoutImages = products.filter(product => {
    // Note: Removed is_active filter for current manual inventory phase
    // Add back when connecting to Zoho Inventory for automated product management
    if (product.stock_quantity <= 0) return false;

    // Product doesn't have valid image_url or image_urls
    const hasValidImageUrl = product.image_url &&
                           product.image_url.trim() !== '' &&
                           !product.image_url.includes('placehold.co') &&
                           !product.image_url.includes('placeholder');

    const hasValidImageUrls = product.image_urls &&
                            Array.isArray(product.image_urls) &&
                            product.image_urls.length > 0 &&
                            product.image_urls.some(url =>
                              url && url.trim() !== '' &&
                              !url.includes('placehold.co') &&
                              !url.includes('placeholder')
                            );

    return !hasValidImageUrl && !hasValidImageUrls;
  });

  // Combine: products with images first, then products without images
  const productsToShow = [...productsWithImages, ...productsWithoutImages];

  // Debug logging
  console.log('All products:', products.length);
  console.log('Products with images:', productsWithImages.length);
  console.log('Products without images:', productsWithoutImages.length);
  console.log('Sample product with image:', productsWithImages[0]);
  console.log('Sample product without image:', productsWithoutImages[0]);

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

      {/* Products Grid - Using UniversalProductCard for larger images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
        {productsToShow.length > 0 ? (
          productsToShow.slice(0, 6).map((product) => (
            <UniversalProductCard
              key={product.id}
              product={transformProductForCard(product)}
              viewMode="homepage-featured"
              size="large"
              showAddToCart={true}
              showFavorite={true}
              showQuickView={true}
              showRating={true}
              showBrand={true}
              showDescription={true}
              showStock={true}
              showDiscount={true}
              context="homepage"
              priority="high"
              className="!bg-white !border-gray-200"
            />
          ))
        ) : (
          // Show message if no products available
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">No products available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back soon!</p>
          </div>
        )}

        {/* Show message if no products at all */}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">No products available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
