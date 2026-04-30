'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Existing components in your project
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingState from '../../components/LoadingState';
import ThcaMasterFilters from './components/ThcaMasterFilters';
import ThcaMasterProductGrid from './components/ThcaMasterProductGrid';
import ThcaMasterBreadcrumb from './components/ThcaMasterBreadcrumb';
import ThcaMasterHero from './components/ThcaMasterHero';
import ThcaMasterSortBar from './components/ThcaMasterSortBar';
import ThcaMasterViewToggle from './components/ThcaMasterViewToggle';
import ThcaMasterCategoryNav from './components/ThcaMasterCategoryNav';
import { SlidersHorizontal } from 'lucide-react';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface ThcaMasterProduct {
  id: string;
  name: string;
  our_price: number;
  sale_price?: number | null;
  image_url: string | null;
  imageUrl?: string; // alias for compatibility
  image?: string;    // alias for compatibility
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
  // extra/compat fields some cards may read
  price?: number;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
  inStock?: boolean;
  brand?: string | null;
  category?: string | null;
  type?: string | null;
  size?: string | null;
  cannabinoid_type?: string | null;
  search_vec?: number[]; // placeholder only; not used on client
  inventory_status?: string | null;
}

// Map UI category → server "mode" used by the universal API
const tabToMode: Record<
  string,
  'thca_all' | 'thca_prerolls' | 'thca_carts' | 'thca_disposables'
> = {
  all: 'thca_all',
  flower: 'thca_all',        // optional: treat as all THCA until you add a dedicated mode
  prerolls: 'thca_prerolls',
  cartridges: 'thca_carts',
  disposables: 'thca_disposables',
  concentrates: 'thca_all',
  edibles: 'thca_all',
  cbd: 'thca_all',
  delta: 'thca_all',
  mushrooms: 'thca_all',
  nitrous: 'thca_all',
};

// Map local sort keys → API sort keys
function mapSort(sortBy: string): 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'rank' {
  switch (sortBy) {
    case 'price-low':
      return 'price_asc';
    case 'price-high':
      return 'price_desc';
    case 'newest':
      return 'newest';
    case 'name':
      // API doesn't support name sort; 'rank' is the closest user-friendly ordering
      return 'rank';
    default:
      return 'featured';
  }
}

// Helper function to generate pagination page array with ellipses
function generatePaginationPages(totalPages: number, currentPage: number, maxVisible: number = 7): (number | string)[] {
  if (totalPages <= maxVisible) {
    // If total pages is less than or equal to max visible, show all pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const halfVisible = Math.floor((maxVisible - 2) / 2); // -2 for first and last pages

  // Always show first page
  pages.push(1);

  // Calculate start and end of sliding window
  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust window if we're near the beginning or end
  if (currentPage - halfVisible <= 2) {
    end = Math.min(totalPages - 1, end + (2 - (currentPage - halfVisible)));
  }
  if (currentPage + halfVisible >= totalPages - 1) {
    start = Math.max(2, start - ((currentPage + halfVisible) - (totalPages - 1)));
  }

  // Add ellipsis after first page if needed
  if (start > 2) {
    pages.push('...');
  }

  // Add pages in the sliding window
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (end < totalPages - 1) {
    pages.push('...');
  }

  // Always show last page (if different from first)
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default function ThcaMasterPageContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ThcaMasterProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ThcaMasterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'sidebar'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter state (client-side refinements you still want)
  const [filters, setFilters] = useState({
    priceRange: [0, 300] as [number, number],
    brands: [] as string[],
    materials: [] as string[],
    types: [] as string[],
    sizes: [] as string[],
    categories: [] as string[],
    cannabinoidTypes: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
    featured: false,
  });

  // URL params: optional local "q" filter (client-side contains)
  const categoryParam = searchParams.get('category') || 'all';
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

  // Sync active category from URL
  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  // Fetch from the universal API whenever *server-side* filters change
  useEffect(() => {
    loadFromUniversalApi();
  }, [activeCategory, filters.priceRange, filters.inStock, filters.onSale, sortBy]);

  // Apply *client-side* filters/sort after we fetch
  useEffect(() => {
    let next = [...products];

    // Optional client "q" filter (we can move to server later by adding `q` param to the API)
    if (searchQuery) {
      next = next.filter((p) => {
        const text = [
          p.name,
          p.description,
          p.short_description,
          p.brand,
          p.category,
          p.sku ?? '',
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return text.includes(searchQuery);
      });
    }

    // Brand filter
    if (filters.brands.length) {
      next = next.filter((p) => p.brand && filters.brands.includes(p.brand));
    }

    // Type filter (simple contains on name; refine later if you promote to server)
    if (filters.types.length) {
      const typesLower = filters.types.map((t) => t.toLowerCase());
      next = next.filter((p) => typesLower.some((t) => p.name.toLowerCase().includes(t)));
    }

    // Cannabinoid type filter
    if (filters.cannabinoidTypes.length) {
      next = next.filter(
        (p) => p.cannabinoid_type && filters.cannabinoidTypes.includes(p.cannabinoid_type)
      );
    }

    // In stock (server already narrowed if you set filters.inStock, but keep as guard)
    if (filters.inStock) {
      next = next.filter((p) => (p.stock_quantity ?? 0) > 0 || p.inStock);
    }

    // On sale (server already narrowed if you set filters.onSale, but keep as guard)
    if (filters.onSale) {
      next = next.filter((p) => {
        const sp = p.sale_price ?? null;
        const op = p.our_price ?? p.price ?? 0;
        return !!sp && sp < op;
      });
    }

    // "New" and "featured" flags (client-only for now)
    if (filters.isNew) next = next.filter((p) => !!p.isNew);
    if (filters.featured) next = next.filter((p) => !!p.featured);

    // Price range (server pre-filters; this keeps UI consistent even if server changes later)
    next = next.filter((p) => {
      const price = p.our_price ?? p.price ?? 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Sort (name not supported server-side; keep local)
    switch (sortBy) {
      case 'price-low': {
        next.sort((a, b) => {
          const pa = a.our_price ?? a.price ?? 0;
          const pb = b.our_price ?? b.price ?? 0;
          return pa - pb;
        });
        break;
      }
      case 'price-high': {
        next.sort((a, b) => {
          const pa = a.our_price ?? a.price ?? 0;
          const pb = b.our_price ?? b.price ?? 0;
          return pb - pa;
        });
        break;
      }
      case 'name': {
        next.sort((a, b) => a.name.localeCompare(b.name));
        break;
      }
      case 'newest': {
        next.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      }
      default: {
        // 'featured' (fallback: newest)
        next.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    }

    setFilteredProducts(next);
    setCurrentPage(1);
  }, [products, filters, sortBy, searchQuery]);

  // Fetcher: calls your universal API route (which calls the RPC on the server)
  const loadFromUniversalApi = async () => {
    try {
      setLoading(true);

      const mode = tabToMode[activeCategory] ?? 'thca_all';
      const qs = new URLSearchParams({
        mode,
        sort: mapSort(sortBy),
        page: '1',
        pageSize: '200', // pull a big page; you paginate on client
        minPrice: String(filters.priceRange[0]),
        maxPrice: String(filters.priceRange[1]),
      });
      if (filters.inStock) qs.set('inStockOnly', 'true');
      if (filters.onSale) qs.set('sale', 'true');

      const res = await fetch(`/api/search/category?${qs.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { products: apiProducts } = await res.json();

      // Transform rows → your card-compatible shape
      const transformed: ThcaMasterProduct[] = (apiProducts || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        our_price: p.price ?? 0,
        sale_price: p.sale_price ?? null,
        image_url: p.image_url ?? null,
        imageUrl: p.image_url ?? null,
        image: p.image_url ?? null,
        description: null,
        short_description: null,
        sku: null,
        stock_quantity: p.inventory_status === 'out_of_stock' ? 0 : 1,
        is_active: true,
        featured: false,
        brand_id: null,
        category_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        price: p.price ?? 0,
        originalPrice: p.price ?? 0,
        isSale: !!p.sale_price,
        inStock: p.inventory_status !== 'out_of_stock',
        brand: p.brand ?? null,
        category: p.subcategory_slug ?? p.category_slug ?? null,
        type: null,
        size: '1g',
        cannabinoid_type: 'THCA',
        search_vec: undefined as any,
        isNew: !!p.is_new,
        inventory_status: p.inventory_status ?? null,
      }));

      setProducts(transformed);
      setFilteredProducts(transformed);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading THCA master products:', err);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Client pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <LoadingState loading={loading} onRetry={loadFromUniversalApi} timeout={15000}>
        <div>THCA Master Collection Loading...</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <ThcaMasterBreadcrumb />
        <ThcaMasterHero />

        <ThcaMasterCategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters — desktop only; mobile uses the drawer */}
            <div className="hidden lg:block lg:w-1/4">
              <ThcaMasterFilters
                filters={filters}
                setFilters={setFilters}
                products={products}
              />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
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
                    Showing {filteredProducts.length ? indexOfFirstProduct + 1 : 0}–
                    {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                    {activeCategory !== 'all' &&
                      ` in ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <ThcaMasterSortBar sortBy={sortBy} setSortBy={setSortBy} />
                  <ThcaMasterViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                </div>
              </div>

              {/* Mobile filter drawer */}
              <MobileFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
                <ThcaMasterFilters filters={filters} setFilters={setFilters} products={products} />
              </MobileFilterDrawer>

              <ThcaMasterProductGrid products={currentProducts} viewMode={viewMode} />

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {generatePaginationPages(totalPages, currentPage).map((page, index) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNum = page as number;
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
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
