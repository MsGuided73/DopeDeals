'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingState from '../components/LoadingState';
import PreRollsFilters from './components/PreRollsFilters';
import ProductGrid from '../components/ProductGrid';
import PreRollsBreadcrumb from './components/PreRollsBreadcrumb';
import PreRollsHero from './components/PreRollsHero';
import PreRollsSortBar from './components/PreRollsSortBar';
import PreRollsViewToggle from './components/PreRollsViewToggle';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface PreRollProduct {
  id: string;
  name: string;
  price: number;
  our_price?: number;
  vip_price?: number;
  sale_price?: number;
  compare_at_price?: number;
  image_url?: string;
  image_urls?: string[];
  brand_id?: string;
  category_id?: string;
  sku?: string;
  stock_quantity?: number;
  materials?: string[];
  vip_exclusive?: boolean;
  featured?: boolean;
  is_active?: boolean;
  description?: string;
  short_description?: string;
  specs?: any;
  attributes?: any;
  // Derived/computed fields for display
  brand?: string;
  category?: string;
  material?: string;
  type?: string; // API-provided: Classic / Infused / Hybrid / Indica / Sativa / Blunt / Backwood
  style?: string; // strain: Indica / Sativa / Hybrid (derived)
  size?: string; // 0.5g / 1g / 2g / Mini / etc.
  thc?: string;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  features?: string[];
  tags?: string[];
}

// Strain-type vocabulary derived from product names + the API-provided `type`
// field. Keeps the strain filter populated even when the catalog lacks a
// structured strain column.
const STRAIN_KEYWORDS: Array<{ label: string; keywords: string[] }> = [
  { label: 'Indica', keywords: ['indica'] },
  { label: 'Sativa', keywords: ['sativa'] },
  { label: 'Hybrid', keywords: ['hybrid'] },
];
const deriveStrain = (p: any): string | null => {
  if (p.specs?.strain) return p.specs.strain;
  // The API already labels Indica/Sativa/Hybrid pre-rolls in the `type` field.
  if (typeof p.type === 'string') {
    const t = p.type.toLowerCase();
    if (t.includes('indica')) return 'Indica';
    if (t.includes('sativa')) return 'Sativa';
    if (t.includes('hybrid')) return 'Hybrid';
  }
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''}`.toLowerCase();
  for (const s of STRAIN_KEYWORDS) {
    if (s.keywords.some((kw) => haystack.includes(kw))) return s.label;
  }
  return null;
};

// Pill-id → matcher closure. Maps the hero pill to a predicate used by the
// activeCategory filter. Returns null for "all" which means no filtering.
const CATEGORY_MATCHERS: Record<string, ((p: PreRollProduct) => boolean) | null> = {
  'all-pre-rolls': null,
  singles: (p) => {
    const text = `${p.name ?? ''} ${p.short_description ?? ''}`.toLowerCase();
    // Treat as a single if not explicitly a pack
    return !/(pack|\d+\s*[-]?\s*pack|multi)/.test(text);
  },
  'multi-packs': (p) => {
    const text = `${p.name ?? ''} ${p.short_description ?? ''}`.toLowerCase();
    return /(pack|\d+\s*[-]?\s*pack|multi)/.test(text);
  },
  infused: (p) => {
    const text = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''} ${p.type ?? ''}`.toLowerCase();
    return text.includes('infused');
  },
  indica: (p) => p.style === 'Indica',
  sativa: (p) => p.style === 'Sativa',
  hybrid: (p) => p.style === 'Hybrid',
};

export default function PreRollsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<PreRollProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PreRollProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [activeCategory, setActiveCategory] = useState('all-pre-rolls');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 100] as [number, number],
    brands: [] as string[],
    materials: [] as string[],
    styles: [] as string[],
    sizes: [] as string[],
    types: [] as string[],
    categories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
    featured: false,
    vipExclusive: false,
  });

  useEffect(() => {
    loadPreRollProducts();
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
          p.style,
          p.size,
          p.type,
          p.material,
          ...(p.materials || []),
          ...(p.tags || []),
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(query);
      });
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.styles.length > 0) {
      filtered = filtered.filter(p => p.style !== undefined && p.style !== null && filters.styles.includes(p.style));
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p => p.size !== undefined && p.size !== null && filters.sizes.includes(p.size));
    }
    if (filters.types.length > 0) {
      filtered = filtered.filter(p => p.type !== undefined && p.type !== null && filters.types.includes(p.type));
    }
    if (filters.materials.length > 0) {
      filtered = filtered.filter(p =>
        (p.material && filters.materials.includes(p.material)) ||
        (p.materials || []).some((m) => filters.materials.includes(m))
      );
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
    if (filters.vipExclusive) {
      filtered = filtered.filter(p => p.vip_exclusive);
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

  const loadPreRollProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/products/pre-rolls?limit=50');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.products) {
        console.warn('No pre-roll products data received');
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      // Normalize API response into the PreRollProduct shape used by the
      // grid + filters. The API already provides `price`, `type`, `size`,
      // `brand`, etc. We only need to derive `style` (strain).
      const transformedProducts: PreRollProduct[] = (data.products || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price ?? product.our_price,
        our_price: product.our_price,
        vip_price: product.vip_price,
        sale_price: product.sale_price,
        compare_at_price: product.compare_at_price,
        image_url: product.image_url,
        image_urls: product.image_urls,
        brand_id: product.brand_id,
        category_id: product.category_id,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        materials: product.materials || [],
        vip_exclusive: product.vip_exclusive,
        featured: product.featured || false,
        is_active: product.is_active,
        description: product.description,
        short_description: product.short_description,
        specs: product.specs,
        attributes: product.attributes,
        // Derived
        brand: product.brand ?? product.brand_name,
        category: 'Pre-Rolls',
        material: product.material || product.materials?.[0],
        type: product.type,
        style: deriveStrain(product),
        size: product.size,
        thc: product.thc,
        inStock: product.inStock ?? (product.stock_quantity || 0) > 0,
        isNew: product.isNew,
        isSale: product.isSale,
        features: product.features || [],
        tags: product.tags || [],
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);

      // Seed the price-range filter to the actual catalog min/max so the
      // sidebar inputs show real bounds instead of 0–100.
      const prices = transformedProducts
        .map((p) => p.price ?? 0)
        .filter((n: number) => Number.isFinite(n) && n > 0);
      if (prices.length > 0) {
        const minP = Math.floor(Math.min(...prices));
        const maxP = Math.ceil(Math.max(...prices));
        setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
      }
    } catch (err) {
      console.error('Error loading pre-roll products:', err);
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
        onRetry={loadPreRollProducts}
        timeout={15000}
      >
        <div>Pre-Rolls Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <PreRollsBreadcrumb />

      {/* Hero Section — no illustration on this page */}
      <PreRollsHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop only; mobile uses the drawer below */}
          <div className="hidden lg:block lg:w-1/4">
            <PreRollsFilters
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
                <PreRollsSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <PreRollsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            >
              <PreRollsFilters
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
                materials: product.materials && product.materials.length > 0
                  ? product.materials
                  : product.material ? [product.material] : [],
                vip_exclusive: product.vip_exclusive || false,
                featured: product.featured,
                is_active: product.is_active,
                description: product.description || undefined,
                short_description: product.short_description || undefined,
                specs: {
                  strain: product.style,
                  size: product.size,
                  type: product.type,
                  thc: product.thc,
                },
                attributes: {},
                brand: product.brand,
                category: product.category,
                material: product.material,
                style: product.style,
                size: product.size,
                inStock: product.inStock || (product.stock_quantity ?? 0) > 0,
                isNew: product.isNew,
                isSale: product.isSale,
                features: product.features || [],
                tags: product.tags || [],
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
