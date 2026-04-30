'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingState from '../components/LoadingState';
import BundlesFilters from './components/BundlesFilters';
import ProductGrid from '../components/ProductGrid';
import BundlesBreadcrumb from './components/BundlesBreadcrumb';
import BundlesHero from './components/BundlesHero';
import BundlesSortBar from './components/BundlesSortBar';
import BundlesViewToggle from './components/BundlesViewToggle';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface BundleProduct {
  id: string;
  name: string;
  // Pricing — bundles have special logic: `price` is the effective sale price
  // (sale_price if present and < our_price, else our_price). `compare_at_price`
  // is the strike-through original (only set when there's an actual discount).
  price: number;
  our_price?: number;
  sale_price?: number;
  compare_at_price?: number;
  vip_price?: number;
  image_url?: string | null;
  image_urls?: string[];
  description?: string | null;
  short_description?: string | null;
  sku?: string | null;
  stock_quantity?: number;
  is_active?: boolean;
  featured?: boolean;
  brand_id?: string | null;
  category_id?: string | null;
  category_slug?: string | null;
  subcategory_slug?: string | null;
  brand_name?: string | null;
  // Derived/computed fields
  brand?: string;
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  bundleType?: string | null; // 'Glass' / 'Vape' / 'Flower' / 'Starter Kit' / etc
}

// Bundle-type vocabulary — derived from product name + description when there's
// no structured column. Keeps the hero pills + sidebar filter populated.
const BUNDLE_TYPES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Glass', keywords: ['glass', 'bong', 'rig', 'pipe', 'bubbler'] },
  { label: 'Vape', keywords: ['vape', 'cart', 'cartridge', 'disposable', 'pen', 'pod'] },
  { label: 'Flower', keywords: ['flower', 'preroll', 'pre-roll', 'eighth', 'quarter', 'ounce'] },
  { label: 'Starter Kit', keywords: ['starter', 'beginner', 'kit', 'bundle starter'] },
  { label: 'Edibles', keywords: ['edible', 'gummy', 'gummies', 'chocolate'] },
];
const deriveBundleType = (p: any): string | null => {
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''} ${p.subcategory_slug ?? ''}`.toLowerCase();
  for (const t of BUNDLE_TYPES) {
    if (t.keywords.some((kw) => haystack.includes(kw))) return t.label;
  }
  return null;
};

// Pill-id → matcher closure. Maps the hero pill to a predicate used by the
// activeCategory filter. Returns null for "all" (no filtering).
const CATEGORY_MATCHERS: Record<string, ((p: BundleProduct) => boolean) | null> = {
  'all-bundles': null,
  'glass-bundles': (p) => p.bundleType === 'Glass',
  'vape-bundles': (p) => p.bundleType === 'Vape',
  'flower-bundles': (p) => p.bundleType === 'Flower',
  'starter-bundles': (p) => p.bundleType === 'Starter Kit',
};

// Savings-bucket parser — convert the sidebar filter labels back into the
// minimum percentage they represent.
const SAVINGS_LABEL_TO_MIN: Record<string, number> = {
  '10%+ off': 10,
  '20%+ off': 20,
  '30%+ off': 30,
};
const computeSavingsPct = (p: BundleProduct): number => {
  const price = p.price ?? 0;
  const compare = p.compare_at_price ?? 0;
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
};

export default function BundlesPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<BundleProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<BundleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [activeCategory, setActiveCategory] = useState('all-bundles');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    brands: [] as string[],
    bundleTypes: [] as string[],
    savings: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
    featured: false,
  });

  useEffect(() => {
    loadBundleProducts();
  }, []);

  useEffect(() => {
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
          p.bundleType,
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(query);
      });
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.bundleTypes.length > 0) {
      filtered = filtered.filter(p => p.bundleType && filters.bundleTypes.includes(p.bundleType));
    }
    if (filters.savings.length > 0) {
      // Use the highest selected threshold (e.g. 20%+ implies >=20%).
      const minPct = Math.max(
        ...filters.savings.map((label) => SAVINGS_LABEL_TO_MIN[label] ?? 0)
      );
      filtered = filtered.filter(p => computeSavingsPct(p) >= minPct);
    }
    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock);
    }
    if (filters.onSale) {
      filtered = filtered.filter(p => p.isSale);
    }
    if (filters.isNew) {
      filtered = filtered.filter(p => p.isNew);
    }
    if (filters.featured) {
      filtered = filtered.filter(p => p.featured);
    }

    // Price range filter
    filtered = filtered.filter(p => {
      const price = p.price ?? 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, sortBy, activeCategory, searchQuery]);

  const loadBundleProducts = async () => {
    try {
      setLoading(true);

      // PRESERVED API endpoint — this route applies bundle-specific pricing
      // logic (sale vs. our_price → effective price + compare_at_price).
      const response = await fetch('/api/products/bundles');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Normalize API response into the BundleProduct shape used by the grid +
      // filters. PRESERVE the bundle-specific pricing from the API:
      //  - data.products[].price is the effective price (sale or regular)
      //  - data.products[].compare_at_price is the strike-through original
      // We do NOT recompute those — only derive bundle type and display fields.
      const transformedProducts: BundleProduct[] = (data.products || []).map((product: any) => {
        const derivedBundleType = deriveBundleType(product);
        const price = product.price ?? 0;
        const compare = product.compare_at_price;
        return ({
          id: product.id,
          name: product.name,
          price,
          our_price: product.our_price,
          sale_price: product.sale_price,
          compare_at_price: compare,
          image_url: product.image_url,
          image_urls: product.image_urls,
          description: product.description,
          short_description: product.short_description,
          sku: product.sku,
          stock_quantity: product.stock_quantity || 0,
          is_active: product.is_active,
          featured: product.featured || false,
          brand_id: product.brand_id ?? null,
          category_id: product.category_id ?? null,
          category_slug: product.category_slug,
          subcategory_slug: product.subcategory_slug,
          brand_name: product.brand_name,
          // brand_name on this API → brand for filtering/display compatibility
          brand: product.brand ?? product.brand_name,
          category: 'Bundles',
          inStock: product.inStock ?? (product.stock_quantity || 0) > 0,
          isNew: product.isNew,
          // A bundle "is on sale" when compare_at_price exists AND > price.
          isSale: product.isSale ?? Boolean(compare && compare > price),
          bundleType: derivedBundleType,
        });
      });

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);

      // Seed the price-range filter to the actual catalog min/max so the
      // sidebar inputs show real bounds instead of 0–1000.
      const prices = transformedProducts
        .map((p) => p.price ?? 0)
        .filter((n: number) => Number.isFinite(n) && n > 0);
      if (prices.length > 0) {
        const minP = Math.floor(Math.min(...prices));
        const maxP = Math.ceil(Math.max(...prices));
        setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
      }
    } catch (error) {
      console.error('Error loading bundle products:', error);
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
        onRetry={loadBundleProducts}
        timeout={15000}
      >
        <div>Bundles Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <BundlesBreadcrumb />

      {/* Hero Section — no illustration on this page */}
      <BundlesHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop only; mobile uses the drawer below */}
          <div className="hidden lg:block lg:w-1/4">
            <BundlesFilters
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
                <BundlesSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <BundlesViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            >
              <BundlesFilters
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
                price: product.price,
                vip_price: product.vip_price,
                compare_at_price: product.compare_at_price,
                image_url: product.image_url || undefined,
                image_urls: product.image_urls && product.image_urls.length > 0
                  ? product.image_urls
                  : product.image_url ? [product.image_url] : [],
                brand_id: product.brand_id || undefined,
                category_id: product.category_id || undefined,
                sku: product.sku || undefined,
                stock_quantity: product.stock_quantity,
                materials: [],
                vip_exclusive: false,
                featured: product.featured,
                is_active: product.is_active,
                description: product.description || undefined,
                short_description: product.short_description || undefined,
                specs: {
                  bundleType: product.bundleType,
                },
                attributes: {},
                brand: product.brand,
                category: product.category,
                inStock: product.inStock || (product.stock_quantity ?? 0) > 0,
                isNew: product.isNew,
                isSale: product.isSale,
                features: [],
                tags: [],
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
