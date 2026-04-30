'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingState from '../components/LoadingState';
import DabsntoolsFilters from './components/DabsntoolsFilters';
import ProductGrid from '../components/ProductGrid';
import DabsntoolsBreadcrumb from './components/DabsntoolsBreadcrumb';
import DabsntoolsHero from './components/DabsntoolsHero';
import DabsntoolsSortBar from './components/DabsntoolsSortBar';
import DabsntoolsViewToggle from './components/DabsntoolsViewToggle';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface DabsntoolsProduct {
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
  // Dab-specific fields
  type?: string; // Glass Rigs / E-Rigs / Portable / Tools
  size?: string;
  material?: string;
  materials?: string[];
  specs?: {
    type?: string;
    size?: string;
    material?: string;
  };
}

// Map activeCategory pill IDs → equipment type strings used in the filter.
const CATEGORY_TO_TYPE: Record<string, string | null> = {
  'all-dabsntools': null,
  'glass-rigs': 'Glass Rigs',
  'e-rigs': 'E-Rigs',
  'portable-rigs': 'Portable',
  'concentrate-tools': 'Tools',
};

export default function DabsntoolsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<DabsntoolsProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DabsntoolsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [activeCategory, setActiveCategory] = useState('all-dabsntools');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 300] as [number, number],
    brands: [] as string[],
    materials: [] as string[],
    equipmentTypes: [] as string[],
    sizes: [] as string[],
    categories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
  });

  useEffect(() => {
    loadDabsntoolsProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Hero-pill category filter
    const pillType = CATEGORY_TO_TYPE[activeCategory];
    if (pillType) {
      filtered = filtered.filter((p) => p.type === pillType || p.specs?.type === pillType);
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
          p.size,
          p.material,
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Sidebar filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.equipmentTypes.length > 0) {
      filtered = filtered.filter((p) => {
        const productType = p.type || p.specs?.type;
        return productType !== undefined && productType !== null && filters.equipmentTypes.includes(productType);
      });
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) => p.size !== undefined && p.size !== null && filters.sizes.includes(p.size));
    }
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.stock_quantity > 0);
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
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          if (dateA !== dateB) return dateB - dateA;
          return b.stock_quantity - a.stock_quantity;
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, sortBy, activeCategory, searchQuery]);

  const loadDabsntoolsProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/products/dab-rigs-and-tools');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(`✅ API returned ${data.totalCount ?? data.products?.length ?? 0} dab rig & tool products`);

      const transformedProducts: DabsntoolsProduct[] = (data.products || []).map((product: any) => ({
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
        brand: product.brand ?? product.brand_name,
        category: 'Dab Rigs & Tools',
        type: product.type ?? product.specs?.type ?? 'Glass Rigs',
        size: product.specs?.size ?? product.size ?? 'Standard',
        material: product.material ?? product.specs?.material ?? 'Glass',
        materials: product.materials || [],
        specs: product.specs,
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);

      // Seed the price-range filter to the actual catalog min/max so the
      // sidebar inputs show real bounds instead of 0–300.
      const prices = transformedProducts
        .map((p) => p.our_price ?? p.price ?? 0)
        .filter((n: number) => Number.isFinite(n) && n > 0);
      if (prices.length > 0) {
        const minP = Math.floor(Math.min(...prices));
        const maxP = Math.ceil(Math.max(...prices));
        setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
      }
    } catch (error) {
      console.error('Error loading dab rig & tool products:', error);
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
        onRetry={loadDabsntoolsProducts}
        timeout={15000}
      >
        <div>Dab Rigs & Tools Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <DabsntoolsBreadcrumb />

      {/* Hero Section */}
      <DabsntoolsHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop only; mobile uses the drawer below */}
          <div className="hidden lg:block lg:w-1/4">
            <DabsntoolsFilters
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
                <DabsntoolsSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <DabsntoolsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            >
              <DabsntoolsFilters
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
                  size: product.size,
                  material: product.material,
                },
                attributes: {},
                brand: product.brand,
                category: product.category,
                material: product.material,
                style: product.type,
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
