'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingState, { useLoadingState } from '../../components/LoadingState';
import BongsFilters from './components/BongsFilters';
import ProductGrid from '../components/ProductGrid';
import BongsBreadcrumb from './components/BongsBreadcrumb';
import BongsHero from './components/BongsHero';
import BongsSortBar from './components/BongsSortBar';
import BongsViewToggle from './components/BongsViewToggle';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

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
  // Add properties for bong specifications
  height?: string;
  jointSize?: string;
  material?: string;
  percolator?: string;
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
  const [activeCategory, setActiveCategory] = useState('all-bongs');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

    // Apply category filter first
    if (activeCategory !== 'all-bongs') {
      switch (activeCategory) {
        case 'beaker-bongs':
          filtered = filtered.filter((p: BongProduct) =>
            p.name?.toLowerCase().includes('beaker') ||
            p.description?.toLowerCase().includes('beaker') ||
            p.short_description?.toLowerCase().includes('beaker')
          );
          break;
        case 'straight-tubes':
          filtered = filtered.filter((p: BongProduct) =>
            p.name?.toLowerCase().includes('straight') ||
            p.name?.toLowerCase().includes('tube') ||
            p.description?.toLowerCase().includes('straight') ||
            p.description?.toLowerCase().includes('tube') ||
            p.short_description?.toLowerCase().includes('straight') ||
            p.short_description?.toLowerCase().includes('tube')
          );
          break;
        case 'percolator-bongs': {
          // Catch the common percolator vocabulary, not just the literal "percolator".
          const PERC_KEYWORDS = ['percolator', 'perc', 'tree perc', 'arm tree', 'inline', 'showerhead', 'honeycomb', 'diffuser', 'matrix', 'turbine', 'spiral'];
          const hasPercKeyword = (text?: string | null) => {
            if (!text) return false;
            const t = text.toLowerCase();
            return PERC_KEYWORDS.some((kw) => t.includes(kw));
          };
          filtered = filtered.filter((p: BongProduct) =>
            hasPercKeyword(p.name) ||
            hasPercKeyword(p.description) ||
            hasPercKeyword(p.short_description) ||
            (p.percolator !== null && p.percolator !== undefined && p.percolator !== '')
          );
          break;
        }
        case 'mini-bongs':
          filtered = filtered.filter((p: BongProduct) =>
            p.name?.toLowerCase().includes('mini') ||
            p.description?.toLowerCase().includes('mini') ||
            p.short_description?.toLowerCase().includes('mini')
          );
          break;
      }
    }

    // Apply filters - using available fields from API
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p: BongProduct) => p.brand && filters.brands.includes(p.brand));
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
  }, [products, filters, sortBy, activeCategory]);

  const loadBongProducts = async () => {
    try {
      setLoading(true);

      // Use the API endpoint instead of direct database queries
      const response = await fetch('/api/products/bongs');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(`✅ API returned ${data.totalCount} bong products`);

      // The API already returns properly formatted products with valid images
      const transformedProducts = data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        our_price: product.price,
        sale_price: product.compare_at_price,
        image_url: product.image_url,
        imageUrl: product.image_url, // Compatibility alias
        image: product.image_url, // Compatibility alias
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
        price: product.price,
        isNew: product.isNew,
        isSale: product.isSale,
        originalPrice: product.compare_at_price,
        inStock: product.inStock,
        brand: product.brand,
        category: 'Bongs',
        // Add additional fields that the grid expects
        height: product.specs?.height || 'N/A',
        jointSize: product.specs?.jointSize || 'N/A',
        material: product.material || 'Glass',
        percolator: product.specs?.percolator || null
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);

      // Seed the price-range filter to the actual catalog min/max so the
      // sidebar inputs show real bounds (e.g. $60 – $480) instead of 0–1000.
      const prices = transformedProducts
        .map((p: BongProduct) => p.our_price ?? p.price ?? 0)
        .filter((n: number) => Number.isFinite(n) && n > 0);
      if (prices.length > 0) {
        const minP = Math.floor(Math.min(...prices));
        const maxP = Math.ceil(Math.max(...prices));
        setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
      }
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
      <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <BongsBreadcrumb />

      {/* Hero Section */}
      <BongsHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop only; mobile uses the drawer below */}
          <div className="hidden lg:block lg:w-1/4">
            <BongsFilters
              filters={filters}
              setFilters={setFilters}
              products={products}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Bar — Filters button visible only on mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border-2 border-[#2d8f47] text-[#2d8f47] rounded-md text-sm font-bold hover:bg-[#2d8f47] hover:text-white transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <BongsSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <BongsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile filter drawer — same BongsFilters component, just inside a slide-in panel */}
            <MobileFilterDrawer
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            >
              <BongsFilters
                filters={filters}
                setFilters={setFilters}
                products={products}
              />
            </MobileFilterDrawer>

            {/* Product Grid */}
            <ProductGrid
              products={currentProducts.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price || product.our_price,
                vip_price: undefined,
                compare_at_price: product.originalPrice || product.sale_price,
                image_url: product.image_url || undefined,
                image_urls: product.image_url ? [product.image_url] : [],
                brand_id: product.brand_id || undefined,
                category_id: product.category_id || undefined,
                sku: product.sku || undefined,
                stock_quantity: product.stock_quantity,
                materials: product.material ? [product.material] : [],
                vip_exclusive: false,
                featured: product.featured,
                is_active: product.is_active,
                description: product.description || undefined,
                short_description: product.short_description || undefined,
                specs: {
                  height: product.height,
                  jointSize: product.jointSize,
                  percolator: product.percolator
                },
                attributes: {},
                brand: product.brand,
                category: product.category,
                material: product.material,
                style: product.percolator ? 'percolator' : 'standard',
                size: product.height?.includes('Mini') || product.height?.includes('Small') ? 'small' : 'medium',
                inStock: product.inStock || product.stock_quantity > 0,
                isNew: product.isNew,
                isSale: product.isSale,
                features: [],
                tags: []
              }))}
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
