'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingState from '../components/LoadingState';
import AccessoriesFilters from './components/AccessoriesFilters';
import ProductGrid from '../components/ProductGrid';
import AccessoriesBreadcrumb from './components/AccessoriesBreadcrumb';
import AccessoriesHero from './components/AccessoriesHero';
import AccessoriesSortBar from './components/AccessoriesSortBar';
import AccessoriesViewToggle from './components/AccessoriesViewToggle';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface AccessoryProduct {
  id: string;
  name: string;
  price: number;
  vip_price?: number;
  compare_at_price?: number;
  our_price?: number;
  sale_price?: number;
  image_url?: string;
  image_urls?: string[];
  brand_id?: string;
  category_id?: string;
  category_slug?: string;
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
  // Derived/computed fields
  brand?: string;
  category?: string;
  material?: string;
  type?: string; // Lighter / Torch / Ashtray / Storage / Grinder / Rolling Papers
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  features?: string[];
  tags?: string[];
}

// Accessory-type vocabulary used to derive a `type` from the product name +
// description + category_slug when the structured field is empty. Mirrors the
// hero pills + a few extras the catalog uses.
const TYPE_KEYWORDS: Array<{ label: string; keywords: string[] }> = [
  { label: 'Torch', keywords: ['torch'] },
  { label: 'Lighter', keywords: ['lighter', 'clipper', 'bic', 'zippo'] },
  { label: 'Ashtray', keywords: ['ashtray', 'ash tray'] },
  { label: 'Grinder', keywords: ['grinder'] },
  { label: 'Rolling Papers', keywords: ['rolling paper', 'rolling papers', 'rolling tray', 'papers'] },
  { label: 'Storage', keywords: ['storage', 'stash', 'jar', 'container', 'pouch', 'case', 'bag'] },
  { label: 'Tray', keywords: ['tray'] },
  { label: 'Cleaner', keywords: ['cleaner', 'cleaning'] },
  { label: 'Screen', keywords: ['screen'] },
];
const deriveType = (p: any): string | null => {
  const slug = (p.category_slug ?? '').toLowerCase();
  if (slug === 'lighters') return 'Lighter';
  if (slug === 'torch') return 'Torch';
  if (slug === 'ashtrays') return 'Ashtray';
  if (slug === 'storage') return 'Storage';
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''}`.toLowerCase();
  for (const t of TYPE_KEYWORDS) {
    if (t.keywords.some((kw) => haystack.includes(kw))) return t.label;
  }
  return null;
};

// Material vocabulary for accessories — metal, glass, wood, plastic, silicone,
// ceramic, stone. Falls back to text-mining when no structured material exists.
const MATERIAL_KEYWORDS: Array<{ label: string; keywords: string[] }> = [
  { label: 'Glass', keywords: ['glass', 'borosilicate'] },
  { label: 'Metal', keywords: ['metal', 'aluminum', 'titanium', 'brass', 'steel', 'zinc'] },
  { label: 'Wood', keywords: ['wood', 'wooden', 'bamboo'] },
  { label: 'Silicone', keywords: ['silicone'] },
  { label: 'Plastic', keywords: ['plastic', 'acrylic'] },
  { label: 'Ceramic', keywords: ['ceramic'] },
  { label: 'Stone', keywords: ['stone', 'marble', 'soapstone'] },
];
const deriveMaterials = (p: any): string[] => {
  const explicit: string[] = [];
  if (Array.isArray(p.materials) && p.materials.length > 0) explicit.push(...p.materials);
  if (p.material) explicit.push(p.material);
  if (p.specs?.material) explicit.push(p.specs.material);
  if (explicit.length > 0) return [...new Set(explicit.filter(Boolean))];
  const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''}`.toLowerCase();
  const matched = MATERIAL_KEYWORDS.filter((m) => m.keywords.some((kw) => haystack.includes(kw))).map((m) => m.label);
  return matched;
};

// Pill-id → matcher closure. Maps the hero pill to a predicate used by the
// activeCategory filter. Returns null for "all" which means no filtering.
const CATEGORY_MATCHERS: Record<string, ((p: AccessoryProduct) => boolean) | null> = {
  'all-accessories': null,
  grinders: (p) => p.type === 'Grinder' || p.category_slug === 'grinders',
  torches: (p) => p.type === 'Torch' || p.category_slug === 'torch',
  ashtrays: (p) => p.type === 'Ashtray' || p.category_slug === 'ashtrays',
  storage: (p) => p.type === 'Storage' || p.category_slug === 'storage',
};

export default function AccessoriesPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<AccessoryProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<AccessoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [activeCategory, setActiveCategory] = useState('all-accessories');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    brands: [] as string[],
    materials: [] as string[],
    types: [] as string[],
    categories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
    featured: false,
    vipExclusive: false,
  });

  useEffect(() => {
    loadAccessoryProducts();
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

  const loadAccessoryProducts = async () => {
    try {
      setLoading(true);

      // PRESERVED API endpoint URL — same as before refactor.
      const response = await fetch('/api/products/accessories?limit=20');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.products) {
        console.warn('No accessories data received');
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      // Normalize API response into the AccessoryProduct shape used by the
      // grid + filters. Adds derived type (Lighter/Torch/Ashtray/Storage/etc.)
      // and material when not present in structured columns.
      const transformedProducts: AccessoryProduct[] = (data.products || []).map((product: any) => {
        const derivedMaterials = deriveMaterials(product);
        const derivedType = deriveType(product);
        return {
          id: product.id,
          name: product.name,
          price: product.price ?? product.our_price,
          our_price: product.our_price,
          sale_price: product.sale_price,
          compare_at_price: product.compare_at_price ?? product.sale_price,
          image_url: product.image_url,
          image_urls: product.image_urls,
          brand_id: product.brand_id,
          category_id: product.category_id,
          category_slug: product.category_slug,
          sku: product.sku,
          stock_quantity: product.stock_quantity || 0,
          materials: derivedMaterials,
          vip_exclusive: product.vip_exclusive,
          featured: product.featured || false,
          is_active: product.is_active,
          description: product.description,
          short_description: product.short_description,
          specs: product.specs,
          attributes: product.attributes,
          // Derived
          brand: product.brand ?? product.brand_name,
          category: 'Accessories',
          material: derivedMaterials[0],
          type: derivedType ?? undefined,
          inStock: product.inStock ?? (product.stock_quantity || 0) > 0,
          isNew: product.isNew,
          isSale: product.isSale ?? Boolean(product.sale_price && product.our_price && product.sale_price < product.our_price),
          features: product.features || [],
          tags: product.tags || [],
        };
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
    } catch (err) {
      console.error('Error loading accessory products:', err);
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
        onRetry={loadAccessoryProducts}
        timeout={15000}
      >
        <div>Accessories Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <AccessoriesBreadcrumb />

        {/* Hero Section — no illustration on this page */}
        <AccessoriesHero
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters — desktop only; mobile uses the drawer below */}
            <div className="hidden lg:block lg:w-1/4">
              <AccessoriesFilters
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
                  <AccessoriesSortBar sortBy={sortBy} setSortBy={setSortBy} />
                  <AccessoriesViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                </div>
              </div>

              {/* Mobile filter drawer */}
              <MobileFilterDrawer
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
              >
                <AccessoriesFilters
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
                    type: product.type,
                  },
                  attributes: {},
                  brand: product.brand,
                  category: product.category,
                  material: product.material,
                  style: product.type,
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
