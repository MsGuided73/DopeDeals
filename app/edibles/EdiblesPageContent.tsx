'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingState from '../components/LoadingState';
import EdiblesFilters from './components/EdiblesFilters';
import ProductGrid from '../components/ProductGrid';
import EdiblesBreadcrumb from './components/EdiblesBreadcrumb';
import EdiblesHero from './components/EdiblesHero';
import EdiblesSortBar from './components/EdiblesSortBar';
import EdiblesViewToggle from './components/EdiblesViewToggle';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface EdibleProduct {
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
  // Edible-specific derived fields
  material?: string;        // Primary cannabinoid
  materials?: string[];     // All cannabinoids derived for this product
  style?: string;           // Edible type (Gummies, Chocolates, Beverages, Tinctures, etc.)
  size?: string;
}

// Edible-type vocabulary used to derive a `style` from product name + category_slug
// when the structured `style` column is empty. Mirrors the hero pills plus extras.
const EDIBLE_TYPES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Gummies', keywords: ['gummy', 'gummies', 'gummi'] },
  { label: 'Chocolates', keywords: ['chocolate', 'cocoa', 'truffle'] },
  { label: 'Beverages', keywords: ['beverage', 'drink', 'soda', 'seltzer', 'tea', 'coffee', 'water', 'juice', 'lemonade', 'shot'] },
  { label: 'Tinctures', keywords: ['tincture', 'oil drops', 'sublingual'] },
  { label: 'Capsules', keywords: ['capsule', 'softgel', 'soft-gel', 'pill'] },
  { label: 'Cereal Bars', keywords: ['cereal bar', 'cereal-bar', 'snack bar', 'protein bar'] },
  { label: 'Cookies', keywords: ['cookie', 'brownie', 'baked'] },
  { label: 'Hard Candy', keywords: ['hard candy', 'lozenge', 'lollipop', 'mint', 'mints'] },
];
const deriveStyle = (p: any): string | null => {
  if (p.style) return p.style;
  if (p.specs?.style) return p.specs.style;
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''} ${p.category_slug ?? ''}`.toLowerCase();
  for (const t of EDIBLE_TYPES) {
    if (t.keywords.some((kw) => haystack.includes(kw))) return t.label;
  }
  return null;
};

// Cannabinoid vocabulary derived from the catalog: CBD, THC, Delta-8, THCA, CBG, CBN, etc.
// Falls back to text-mining the name/description when structured columns are missing.
const CANNABINOID_KEYWORDS: Array<{ label: string; keywords: string[] }> = [
  { label: 'Delta-8', keywords: ['delta-8', 'delta 8', 'd8', 'δ8', 'δ-8'] },
  { label: 'Delta-9', keywords: ['delta-9', 'delta 9', 'd9', 'δ9', 'δ-9'] },
  { label: 'Delta-10', keywords: ['delta-10', 'delta 10', 'd10'] },
  { label: 'THCA', keywords: ['thca', 'thc-a'] },
  { label: 'THCV', keywords: ['thcv', 'thc-v'] },
  { label: 'THCP', keywords: ['thcp', 'thc-p'] },
  { label: 'HHC', keywords: ['hhc'] },
  { label: 'CBD', keywords: ['cbd'] },
  { label: 'CBG', keywords: ['cbg'] },
  { label: 'CBN', keywords: ['cbn'] },
  { label: 'CBC', keywords: ['cbc'] },
  // Generic THC last so specific deltas/forms above match first
  { label: 'THC', keywords: ['thc'] },
];
const deriveCannabinoids = (p: any): string[] => {
  const explicit: string[] = [];
  if (Array.isArray(p.materials) && p.materials.length > 0) explicit.push(...p.materials);
  if (p.material) explicit.push(p.material);
  if (p.specs?.cannabinoid) explicit.push(p.specs.cannabinoid);
  if (explicit.length > 0) return [...new Set(explicit.filter(Boolean))];
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''}`.toLowerCase();
  const matched: string[] = [];
  for (const c of CANNABINOID_KEYWORDS) {
    if (c.keywords.some((kw) => haystack.includes(kw))) {
      // Avoid double-counting generic 'THC' if a specific delta/form already matched.
      if (c.label === 'THC' && matched.some((m) => m.startsWith('Delta-') || m === 'THCA' || m === 'THCV' || m === 'THCP')) {
        continue;
      }
      matched.push(c.label);
    }
  }
  return matched;
};

// Pill-id → matcher closure. Maps the hero pill to a predicate used by the
// activeCategory filter. Returns null for "all" which means no filtering.
const CATEGORY_MATCHERS: Record<string, ((p: EdibleProduct) => boolean) | null> = {
  'all-edibles': null,
  gummies: (p) => p.style === 'Gummies',
  chocolates: (p) => p.style === 'Chocolates',
  beverages: (p) => p.style === 'Beverages',
  tinctures: (p) => p.style === 'Tinctures',
};

export default function EdiblesPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<EdibleProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<EdibleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [activeCategory, setActiveCategory] = useState('all-edibles');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    brands: [] as string[],
    materials: [] as string[],
    styles: [] as string[],
    sizes: [] as string[],
    categories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
    featured: false,
    vipExclusive: false,
  });

  useEffect(() => {
    loadEdibleProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Hero-pill category filter
    const matcher = CATEGORY_MATCHERS[activeCategory];
    if (matcher) {
      filtered = filtered.filter(matcher);
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
          p.style,
          p.material,
          ...(p.materials || []),
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Apply filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p: EdibleProduct) => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.materials.length > 0) {
      filtered = filtered.filter((p: EdibleProduct) =>
        (p.material && filters.materials.includes(p.material)) ||
        (p.materials || []).some((m) => filters.materials.includes(m))
      );
    }
    if (filters.styles.length > 0) {
      filtered = filtered.filter((p: EdibleProduct) => p.style !== undefined && p.style !== null && filters.styles.includes(p.style));
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p: EdibleProduct) => p.size !== undefined && p.size !== null && filters.sizes.includes(p.size));
    }
    if (filters.inStock) {
      filtered = filtered.filter((p: EdibleProduct) => p.stock_quantity > 0);
    }
    if (filters.onSale) {
      filtered = filtered.filter((p: EdibleProduct) => p.isSale);
    }
    if (filters.isNew) {
      filtered = filtered.filter((p: EdibleProduct) => p.isNew);
    }
    if (filters.featured) {
      filtered = filtered.filter((p: EdibleProduct) => p.featured);
    }
    if (filters.vipExclusive) {
      filtered = filtered.filter((p: any) => p.vip_exclusive);
    }

    // Price range filter
    filtered = filtered.filter((p: EdibleProduct) => {
      const price = p.our_price || p.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: EdibleProduct, b: EdibleProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a: EdibleProduct, b: EdibleProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a: EdibleProduct, b: EdibleProduct) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a: EdibleProduct, b: EdibleProduct) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        filtered.sort((a: EdibleProduct, b: EdibleProduct) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          if (dateA !== dateB) return dateB - dateA;
          return b.stock_quantity - a.stock_quantity;
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, sortBy, activeCategory, searchQuery]);

  const loadEdibleProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/products/edibles');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(`✅ API returned ${data.total ?? data.products?.length ?? 0} edible products`);

      // Normalize API response into the EdibleProduct shape used by the grid + filters.
      const transformedProducts: EdibleProduct[] = (data.products || []).map((product: any) => {
        const derivedCannabinoids = deriveCannabinoids(product);
        const derivedStyle = deriveStyle(product);
        return ({
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
          category: 'Edibles',
          material: derivedCannabinoids[0],
          materials: derivedCannabinoids,
          style: derivedStyle,
          size: product.size || product.specs?.size || null,
        });
      });

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);

      // Seed the price-range filter to the actual catalog min/max so the
      // sidebar inputs show real bounds instead of 0–1000.
      const prices = transformedProducts
        .map((p) => p.our_price ?? p.price ?? 0)
        .filter((n: number) => Number.isFinite(n) && n > 0);
      if (prices.length > 0) {
        const minP = Math.floor(Math.min(...prices));
        const maxP = Math.ceil(Math.max(...prices));
        setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
      }
    } catch (error) {
      console.error('Error loading edible products:', error);
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
        onRetry={loadEdibleProducts}
        timeout={15000}
      >
        <div>Edibles Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <EdiblesBreadcrumb />

      {/* Hero Section — no illustration on this page */}
      <EdiblesHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop only; mobile uses the drawer below */}
          <div className="hidden lg:block lg:w-1/4">
            <EdiblesFilters
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
                <EdiblesSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <EdiblesViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile filter drawer — same EdiblesFilters component, just inside a slide-in panel */}
            <MobileFilterDrawer
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            >
              <EdiblesFilters
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
                  style: product.style,
                  size: product.size,
                },
                attributes: {},
                brand: product.brand,
                category: product.category,
                material: product.material,
                style: product.style,
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
