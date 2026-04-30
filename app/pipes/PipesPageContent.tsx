'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingState from '../components/LoadingState';
import PipesFilters from './components/PipesFilters';
import ProductGrid from '../components/ProductGrid';
import PipesBreadcrumb from './components/PipesBreadcrumb';
import PipesHero from './components/PipesHero';
import PipesSortBar from './components/PipesSortBar';
import PipesViewToggle from './components/PipesViewToggle';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface PipeProduct {
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
  // Pipe-specific spec fields
  material?: string;
  materials?: string[];
  style?: string;
  size?: string;
}

export default function PipesPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<PipeProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PipeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [activeCategory, setActiveCategory] = useState('all-pipes');
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
    loadPipeProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Apply category filter first
    if (activeCategory !== 'all-pipes') {
      switch (activeCategory) {
        case 'spoon-pipes':
          filtered = filtered.filter((p: PipeProduct) =>
            p.name?.toLowerCase().includes('spoon') ||
            p.description?.toLowerCase().includes('spoon') ||
            p.short_description?.toLowerCase().includes('spoon') ||
            p.style?.toLowerCase().includes('spoon')
          );
          break;
        case 'sherlock-pipes':
          filtered = filtered.filter((p: PipeProduct) =>
            p.name?.toLowerCase().includes('sherlock') ||
            p.description?.toLowerCase().includes('sherlock') ||
            p.short_description?.toLowerCase().includes('sherlock') ||
            p.style?.toLowerCase().includes('sherlock')
          );
          break;
        case 'hammer-pipes':
          filtered = filtered.filter((p: PipeProduct) =>
            p.name?.toLowerCase().includes('hammer') ||
            p.description?.toLowerCase().includes('hammer') ||
            p.short_description?.toLowerCase().includes('hammer') ||
            p.style?.toLowerCase().includes('hammer')
          );
          break;
        case 'chillums':
          filtered = filtered.filter((p: PipeProduct) =>
            p.name?.toLowerCase().includes('chillum') ||
            p.description?.toLowerCase().includes('chillum') ||
            p.short_description?.toLowerCase().includes('chillum') ||
            p.style?.toLowerCase().includes('chillum')
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
          p.style,
          p.material,
          ...(p.materials || []),
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Apply filters - using available fields from API
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p: PipeProduct) => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.materials.length > 0) {
      filtered = filtered.filter((p: PipeProduct) =>
        (p.material && filters.materials.includes(p.material)) ||
        (p.materials || []).some((m) => filters.materials.includes(m))
      );
    }
    if (filters.styles.length > 0) {
      filtered = filtered.filter((p: PipeProduct) => p.style !== undefined && p.style !== null && filters.styles.includes(p.style));
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p: PipeProduct) => p.size !== undefined && p.size !== null && filters.sizes.includes(p.size));
    }
    if (filters.inStock) {
      filtered = filtered.filter((p: PipeProduct) => p.stock_quantity > 0);
    }
    if (filters.onSale) {
      filtered = filtered.filter((p: PipeProduct) => p.isSale);
    }
    if (filters.isNew) {
      filtered = filtered.filter((p: PipeProduct) => p.isNew);
    }
    if (filters.featured) {
      filtered = filtered.filter((p: PipeProduct) => p.featured);
    }
    if (filters.vipExclusive) {
      filtered = filtered.filter((p: any) => p.vip_exclusive);
    }

    // Price range filter
    filtered = filtered.filter((p: PipeProduct) => {
      const price = p.our_price || p.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: PipeProduct, b: PipeProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a: PipeProduct, b: PipeProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a: PipeProduct, b: PipeProduct) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a: PipeProduct, b: PipeProduct) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        filtered.sort((a: PipeProduct, b: PipeProduct) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          if (dateA !== dateB) return dateB - dateA;
          return b.stock_quantity - a.stock_quantity;
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, sortBy, activeCategory, searchQuery]);

  const loadPipeProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/products/pipes');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(`✅ API returned ${data.total ?? data.products?.length ?? 0} pipe products`);

      // Pipe-type vocabulary used to derive a `style` from the product name +
      // description when the structured `style`/`specs.style` column is empty.
      // Mirrors the pills on the hero plus a few extras the catalog uses.
      const PIPE_TYPES: Array<{ label: string; keywords: string[] }> = [
        { label: 'Spoon', keywords: ['spoon'] },
        { label: 'Sherlock', keywords: ['sherlock'] },
        { label: 'Hammer', keywords: ['hammer'] },
        { label: 'Chillum', keywords: ['chillum'] },
        { label: 'One-Hitter', keywords: ['one hitter', 'one-hitter', 'onehitter', 'taster'] },
        { label: 'Steamroller', keywords: ['steamroller', 'steam roller'] },
        { label: 'Gandalf', keywords: ['gandalf'] },
        { label: 'Bubbler', keywords: ['bubbler'] },
      ];
      const deriveStyle = (p: any): string | null => {
        if (p.style) return p.style;
        if (p.specs?.style) return p.specs.style;
        const haystack = `${p.name ?? ''} ${p.short_description ?? ''} ${p.description ?? ''} ${p.subcategory_slug ?? ''}`.toLowerCase();
        for (const t of PIPE_TYPES) {
          if (t.keywords.some((kw) => haystack.includes(kw))) return t.label;
        }
        return null;
      };

      // Material vocabulary derived from the catalog: glass, silicone, wood,
      // metal, ceramic, stone. Falls back to text-mining the name/description
      // when the `materials[]` column is missing.
      const MATERIAL_KEYWORDS: Array<{ label: string; keywords: string[] }> = [
        { label: 'Glass', keywords: ['glass', 'borosilicate'] },
        { label: 'Silicone', keywords: ['silicone', 'silicon '] },
        { label: 'Wood', keywords: ['wood', 'wooden', 'briar'] },
        { label: 'Metal', keywords: ['metal', 'aluminum', 'titanium', 'brass', 'steel'] },
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
        return matched.length > 0 ? matched : ['Glass']; // Default — most pipes are glass
      };

      // Normalize API response into the PipeProduct shape used by the grid + filters.
      const transformedProducts: PipeProduct[] = (data.products || []).map((product: any) => {
        const derivedMaterials = deriveMaterials(product);
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
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Compatibility fields
        price: product.price ?? product.our_price,
        isNew: product.isNew,
        isSale: product.isSale ?? Boolean(product.sale_price && product.sale_price < product.our_price),
        originalPrice: product.compare_at_price ?? product.our_price,
        inStock: product.inStock ?? (product.stock_quantity || 0) > 0,
        // brand_name on this API → brand for filtering/display compatibility
        brand: product.brand ?? product.brand_name,
        category: 'Pipes',
        material: derivedMaterials[0],
        materials: derivedMaterials,
        style: derivedStyle,
        size: product.size || product.specs?.size || null,
      });
      });

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading pipe products:', error);
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
        onRetry={loadPipeProducts}
        timeout={15000}
      >
        <div>Pipes Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <PipesBreadcrumb />

      {/* Hero Section */}
      <PipesHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop only; mobile uses the drawer below */}
          <div className="hidden lg:block lg:w-1/4">
            <PipesFilters
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
                <PipesSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <PipesViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile filter drawer — same PipesFilters component, just inside a slide-in panel */}
            <MobileFilterDrawer
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            >
              <PipesFilters
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
