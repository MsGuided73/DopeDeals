'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingState from '../components/LoadingState';
import ThcaPnvFilters from './components/ThcaPnvFilters';
import ProductGrid from '../components/ProductGrid';
import ThcaPnvBreadcrumb from './components/ThcaPnvBreadcrumb';
import ThcaPnvHero from './components/ThcaPnvHero';
import ThcaPnvSortBar from './components/ThcaPnvSortBar';
import ThcaPnvViewToggle from './components/ThcaPnvViewToggle';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface ThcaPnvProduct {
  id: string;
  name: string;
  our_price: number;
  sale_price?: number;
  image_url: string | null;
  imageUrl?: string;
  image?: string;
  image_urls?: string[];
  description?: string | null;
  short_description?: string | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  brand_id: string | null;
  category_id: string | null;
  category_slug?: string | null;
  created_at: string;
  updated_at: string;
  // Compatibility fields
  price?: number;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
  inStock?: boolean;
  brand?: string;
  category?: string;
  // THCA pre-roll & vape specific fields
  type?: string; // Pre-Roll / Cartridge / Disposable
  strain?: string; // Indica / Sativa / Hybrid
  size?: string; // 0.5g / 1g / 2g
  material?: string;
  materials?: string[];
}

// Type derivation: pre-roll / cartridge / disposable. Run once per product at
// load time so the filter has data even when the catalog lacks an explicit
// `type` column.
const PNV_TYPES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Pre-Roll', keywords: ['preroll', 'pre-roll', 'pre roll', 'joint', 'blunt'] },
  { label: 'Disposable', keywords: ['disposable', 'disposible', 'all-in-one', 'all in one'] },
  { label: 'Cartridge', keywords: ['cartridge', 'cart '] },
];
const deriveType = (p: any): string | null => {
  if (p.type) return p.type;
  if (p.specs?.type) return p.specs.type;
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''} ${p.subcategory_slug ?? ''}`.toLowerCase();
  for (const t of PNV_TYPES) {
    if (t.keywords.some((kw) => haystack.includes(kw))) return t.label;
  }
  // category_slug fallback
  const slug = (p.category_slug ?? '').toLowerCase();
  if (slug === 'cartridges' || slug === 'carts') return 'Cartridge';
  if (slug === 'disposables') return 'Disposable';
  if (slug === 'prerolls' || slug === 'pre-rolls') return 'Pre-Roll';
  return null;
};

// Strain-type vocabulary derived from product names. Keeps the filter populated
// even when the catalog lacks a structured strain column.
const STRAIN_KEYWORDS: Array<{ label: string; keywords: string[] }> = [
  { label: 'Indica', keywords: ['indica'] },
  { label: 'Sativa', keywords: ['sativa'] },
  { label: 'Hybrid', keywords: ['hybrid'] },
];
const deriveStrain = (p: any): string | null => {
  if (p.strain) return p.strain;
  if (p.specs?.strain) return p.specs.strain;
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''}`.toLowerCase();
  for (const s of STRAIN_KEYWORDS) {
    if (s.keywords.some((kw) => haystack.includes(kw))) return s.label;
  }
  return null;
};

// Match common gram-weight patterns ("0.5g", ".5g", "1g", "2g", "1 gram") in
// the product name to derive a size when specs.size is empty.
const deriveSize = (p: any): string | null => {
  if (p.size) return p.size;
  if (p.specs?.size) return p.specs.size;
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''}`;
  const match = haystack.match(/(\d+(?:\.\d+)?)\s*(?:g|gram|grams)\b/i);
  return match ? `${match[1]}g` : null;
};

export default function ThcaPnvPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ThcaPnvProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ThcaPnvProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [activeCategory, setActiveCategory] = useState('all-thca-pnv');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 200] as [number, number],
    brands: [] as string[],
    types: [] as string[],
    strains: [] as string[],
    sizes: [] as string[],
    categories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
  });

  useEffect(() => {
    loadThcaPnvProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Hero-pill category filter
    if (activeCategory !== 'all-thca-pnv') {
      switch (activeCategory) {
        case 'prerolls':
          filtered = filtered.filter((p) =>
            (p.category_slug && ['prerolls', 'pre-rolls'].includes(p.category_slug.toLowerCase())) ||
            p.type === 'Pre-Roll'
          );
          break;
        case 'cartridges':
          filtered = filtered.filter((p) =>
            (p.category_slug && ['cartridges', 'carts'].includes(p.category_slug.toLowerCase())) ||
            p.type === 'Cartridge'
          );
          break;
        case 'disposables':
          filtered = filtered.filter((p) =>
            (p.category_slug && p.category_slug.toLowerCase() === 'disposables') ||
            p.type === 'Disposable'
          );
          break;
      }
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const searchableText = [
          p.name,
          p.description,
          p.short_description,
          p.brand,
          p.category,
          p.sku,
          p.type,
          p.strain,
          p.size,
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Apply other filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.types.length > 0) {
      filtered = filtered.filter((p) => p.type !== undefined && p.type !== null && filters.types.includes(p.type));
    }
    if (filters.strains.length > 0) {
      filtered = filtered.filter((p) => p.strain !== undefined && p.strain !== null && filters.strains.includes(p.strain));
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) => p.size !== undefined && p.size !== null && filters.sizes.includes(p.size));
    }
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.stock_quantity > 0 || p.inStock);
    }
    if (filters.onSale) {
      filtered = filtered.filter((p) => p.isSale);
    }
    if (filters.isNew) {
      filtered = filtered.filter((p) => p.isNew);
    }

    // Price range filter
    filtered = filtered.filter((p) => {
      const price = p.our_price || p.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default: // featured
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          if (dateA !== dateB) return dateB - dateA;
          return (b.stock_quantity || 0) - (a.stock_quantity || 0);
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, sortBy, activeCategory, searchQuery]);

  const loadThcaPnvProducts = async () => {
    try {
      setLoading(true);

      // PRESERVE existing API endpoint URL — /api/products/thca-pre-rolls
      const response = await fetch('/api/products/thca-pre-rolls?limit=30');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const totalCount = data.totalCount ?? data.total ?? data.products?.length ?? 0;
      console.log(`✅ API returned ${totalCount} THCA pre-roll/vape products`);

      const transformedProducts: ThcaPnvProduct[] = (data.products || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        our_price: product.our_price ?? product.price,
        sale_price: product.sale_price,
        image_url: product.image_url,
        imageUrl: product.image_url,
        image: product.image_url,
        image_urls: product.image_urls,
        description: product.description,
        short_description: product.short_description,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active,
        featured: product.featured || false,
        brand_id: product.brand_id ?? null,
        category_id: product.category_id ?? null,
        category_slug: product.category_slug ?? null,
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Compatibility fields
        price: product.price ?? product.our_price,
        isNew: product.isNew,
        isSale: product.isSale ?? Boolean(product.sale_price && product.sale_price < product.our_price),
        originalPrice: product.compare_at_price ?? product.our_price,
        inStock: product.inStock ?? (product.stock_quantity || 0) > 0,
        brand: product.brand ?? product.brand_name,
        category: 'THCA Pre-Rolls & Vapes',
        type: deriveType(product),
        strain: deriveStrain(product),
        size: deriveSize(product),
        material: product.material || product.specs?.material,
        materials: product.materials || [],
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);

      // Seed the price-range filter to the actual catalog min/max so the
      // sidebar inputs show real bounds instead of 0–200.
      const prices = transformedProducts
        .map((p) => p.our_price ?? p.price ?? 0)
        .filter((n: number) => Number.isFinite(n) && n > 0);
      if (prices.length > 0) {
        const minP = Math.floor(Math.min(...prices));
        const maxP = Math.ceil(Math.max(...prices));
        setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
      }
    } catch (error) {
      console.error('Error loading THCA pre-roll/vape products:', error);
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
        onRetry={loadThcaPnvProducts}
        timeout={15000}
      >
        <div>THCA Pre-Rolls &amp; Vapes Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <ThcaPnvBreadcrumb />

      {/* Hero Section — no illustration on this page */}
      <ThcaPnvHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop only; mobile uses the drawer below */}
          <div className="hidden lg:block lg:w-1/4">
            <ThcaPnvFilters
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
                  Showing {filteredProducts.length === 0 ? 0 : indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <ThcaPnvSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <ThcaPnvViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            >
              <ThcaPnvFilters
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
                image_urls: product.image_urls && product.image_urls.length > 0
                  ? product.image_urls
                  : product.image_url ? [product.image_url] : [],
                brand_id: product.brand_id || undefined,
                category_id: product.category_id || undefined,
                sku: product.sku || undefined,
                stock_quantity: product.stock_quantity,
                materials: product.materials && product.materials.length > 0
                  ? product.materials
                  : product.material ? [product.material] : [],
                vip_exclusive: false,
                featured: product.featured,
                is_active: product.is_active,
                description: product.description || undefined,
                short_description: product.short_description || undefined,
                specs: {
                  type: product.type,
                  strain: product.strain,
                  size: product.size,
                },
                attributes: {},
                brand: product.brand,
                category: product.category,
                material: product.material,
                style: product.strain,
                size: product.size,
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
