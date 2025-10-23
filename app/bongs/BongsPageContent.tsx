'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingState, { useLoadingState } from '../../components/LoadingState';
import BongsFilters from './components/BongsFilters';
import BongsProductGrid from './components/BongsProductGrid';
import BongsBreadcrumb from './components/BongsBreadcrumb';
import BongsHero from './components/BongsHero';
import BongsSortBar from './components/BongsSortBar';
import BongsViewToggle from './components/BongsViewToggle';

export interface BongProduct {
  id: string;
  name: string;
  our_price: number;
  sale_price?: number;
  image_url: string | null;
  imageUrl?: string; // Add alias for compatibility
  image?: string; // Add alias for compatibility
  description?: string | null;
  short_description?: string | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  brand_id: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  // Add missing properties that components expect
  price?: number; // For compatibility
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
  inStock?: boolean;
  brand?: string; // For compatibility
  category?: string; // For compatibility
}

export default function BongsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<BongProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<BongProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    brands: [] as string[],
    materials: [] as string[],
    heights: [] as string[],
    jointSizes: [] as string[],
    percolators: [] as string[],
    categories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
  });

  useEffect(() => {
    // Load real bong products from Supabase
    loadBongProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Apply filters - using available fields from main_site_products
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p: BongProduct) => p.brand_id && filters.brands.includes(p.brand_id));
    }
    if (filters.inStock) {
      filtered = filtered.filter((p: BongProduct) => p.stock_quantity > 0);
    }

    // Price range filter - use our_price field
    filtered = filtered.filter((p: BongProduct) => {
      const price = p.our_price || p.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: BongProduct, b: BongProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a: BongProduct, b: BongProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a: BongProduct, b: BongProduct) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a: BongProduct, b: BongProduct) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        // Sort by newest first, then by stock quantity
        filtered.sort((a: BongProduct, b: BongProduct) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          if (dateA !== dateB) return dateB - dateA;
          return b.stock_quantity - a.stock_quantity;
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, sortBy]);

  const loadBongProducts = async () => {
    try {
      setLoading(true);

      // Use direct Supabase query instead of API endpoint to avoid API issues
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not configured');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get ALL products from main_site_products table - NO LIMIT to ensure all 4600+ products
      const { data: products, error } = await supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price, sale_price, fire_price,
          image_url, image_urls, sku, stock_quantity, featured, brand_id, category_id,
          categories, category_slug, created_at, updated_at
        `)
        .not('name', 'ilike', '%test%')
        .not('name', 'ilike', '%sample%')
        .order('created_at', { ascending: false });

      // Additional filtering for products that might not have category_slug set but are bongs
      let filteredProducts: any[] = [];

      if (products && products.length > 0) {
        filteredProducts = products.filter((product: any) => {
          const name = (product.name || '').toLowerCase();
          const categorySlug = product.category_slug || '';
          const categories = product.categories || [];

          // EXCLUDE accessories first
          const excludeKeywords = [
            'ashtray', 'grinder', 'dab rig', 'dab-rig', 'torch', 'lighter',
            'scale', 'tray', 'clipper', 'papers', 'rolling', 'filter',
            'cartridge', 'battery', 'charger', 'case', 'pouch', 'storage',
            'cleaner', 'solution', 'brush', 'tool', 'stand', 'holder',
            'accessory', 'dab'  // Explicitly exclude these terms from product names
          ];

          const hasExcludeKeyword = excludeKeywords.some(keyword => name.includes(keyword));
          if (hasExcludeKeyword) {
            return false;
          }

          // If category_slug matches "bongs" exactly, include it
          if (categorySlug === 'bongs') {
            return true;
          }

          // Check categories JSONB field for bong-specific terms only
          if (categories) {
            try {
              const categoriesArray = Array.isArray(categories) ? categories : [categories];
              const hasBongCategory = categoriesArray.some((cat: any) => {
                if (typeof cat === 'string') {
                  const catLower = cat.toLowerCase();
                  return (catLower.includes('bong') || catLower.includes('water pipe')) &&
                         !catLower.includes('dab') &&
                         !catLower.includes('accessory') &&
                         !catLower.includes('dab-rig') &&
                         !catLower.includes('grinder') &&
                         !catLower.includes('ashtray');
                }
                return false;
              });

              if (hasBongCategory) return true;
            } catch (error) {
              console.warn('JSON parsing failed for product:', product.id);
            }
          }

          // Check product name for BONG-SPECIFIC keywords only
          const bongKeywords = [
            'bong', 'water pipe', 'waterpipe', 'beaker bong', 'beaker',
            'scientific bong', 'straight bong', 'percolator bong', 'percolator',
            'showerhead', 'recycler', 'inline perc', 'honeycomb perc',
            'tree perc', 'matrix perc', 'diffused downstem', 'ice catcher',
            'glass bong', 'water bong', 'hookah', 'shisha'
          ];

          const hasBongKeyword = bongKeywords.some(keyword => name.includes(keyword));

          // Must have bong keyword AND contain glass/water-related terms AND have an image
          if (hasBongKeyword && (name.includes('glass') || name.includes('water') || name.includes('beaker'))) {
            // Only include products that have an image_url
            const hasImage = product.image_url && product.image_url.trim() !== '';
            if (hasImage) {
              return true;
            }
          }

          return false;
        });

        console.log(`✅ Found ${filteredProducts.length} bongs using category_slug from ${products.length} total products`);
      }

      if (error) {
        console.error('Error fetching bong products:', error);
        throw new Error(error.message || 'Failed to fetch bong products from database');
      }

      if (!products) {
        console.warn('No bong products data received');
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      console.log(`✅ Loaded ${products.length} raw products, filtered to ${filteredProducts.length} bongs`);

      // Transform filtered products to match our interface - ensure image_url is properly handled
      const transformedProducts = filteredProducts.map((product: any) => {
        // Handle image URL selection with fallback logic
        let primaryImageUrl = product.image_url;

        // If no primary image_url, try to get first image from image_urls array
        if (!primaryImageUrl && product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
          primaryImageUrl = product.image_urls[0];
        }

        console.log(`Product ${product.id}: image_url=${product.image_url}, using=${primaryImageUrl}`);

        return {
          id: product.id,
          name: product.name,
          our_price: parseFloat(product.our_price),
          sale_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
          image_url: primaryImageUrl, // Use the determined primary image URL
          imageUrl: primaryImageUrl, // Compatibility alias
          image: primaryImageUrl, // Compatibility alias
          description: product.description,
          short_description: product.short_description,
          sku: product.sku,
          stock_quantity: product.stock_quantity || 0,
          is_active: product.is_active,
          featured: product.featured || false,
          brand_id: product.brand_id,
          category_id: product.category_id,
          created_at: product.created_at,
          updated_at: product.updated_at,
          // Add compatibility fields
          price: parseFloat(product.our_price),
          isNew: false,
          isSale: product.sale_price && product.sale_price > product.our_price,
          originalPrice: product.sale_price && product.sale_price > product.our_price ? parseFloat(product.sale_price) : undefined,
          inStock: (product.stock_quantity || 0) > 0,
          brand: extractBrandFromName(product.name) || 'Unknown Brand',
          category: 'Bongs'
        };
      });

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading bong products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <LoadingState
        loading={loading}
        onRetry={loadBongProducts}
        timeout={15000}
      >
        <div>Bongs Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div>
      {/* Breadcrumb */}
      <BongsBreadcrumb />

      {/* Hero Section */}
      <BongsHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <BongsFilters
              filters={filters}
              setFilters={setFilters}
              products={products}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Bar and View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <BongsSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <BongsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Product Grid */}
            <BongsProductGrid
              products={currentProducts}
              viewMode={viewMode}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_: number, i: number) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-dope-orange-500 text-white border-dope-orange-500'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </ErrorBoundary>
  );
}

// Helper function to extract brand names from product names
function extractBrandFromName(productName: string): string | null {
  if (!productName) return null;

  // Pattern 1: "Brand Name Product Description |REF: CODE|"
  const refPattern = /(.+?)\s+(?:bong|pipe|rig|water)\s*\|REF:\s*([^|]+)\|/i;
  const refMatch = productName.match(refPattern);
  if (refMatch) {
    return refMatch[1].trim();
  }

  // Pattern 2: "Brand Product |REF: CODE|"
  const simpleRefPattern = /(.+?)\|REF:\s*([^|]+)\|/i;
  const simpleMatch = productName.match(simpleRefPattern);
  if (simpleMatch) {
    return simpleMatch[1].trim();
  }

  // Pattern 3: Common brand names that appear at the start
  const commonBrands = ['Diamond Glass', 'Crave', 'Puffco', 'Urth Farmacy', 'Twenty One Cannabis', 'Special Blue'];
  for (const brand of commonBrands) {
    if (productName.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }

  // Pattern 4: Extract first word or two as potential brand
  const words = productName.split(' ');
  if (words.length >= 2) {
    const potentialBrand = words.slice(0, 2).join(' ');
    // Don't return generic words as brands
    if (!['The', 'A', 'An', 'Beaker', 'Water', 'Glass', 'Mini', 'Large'].includes(potentialBrand)) {
      return potentialBrand;
    }
  }

  return null;
}

// Mock data generator removed - now using real Supabase data
