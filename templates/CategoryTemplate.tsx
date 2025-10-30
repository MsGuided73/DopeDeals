/**
 * HIGHWAY 420 Category Page Template
 *
 * Standardized template for all Highway 420 product category pages.
 * Uses uniform product grids and maintains consistent Highway 420 branding.
 *
 * Usage:
 * 1. Copy this template to create new category pages
 * 2. Update metadata and category-specific content
 * 3. Choose appropriate product card layout (1row, 3row, 4row)
 * 4. Customize hero section content
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Filter, Grid3X3, List, SortAsc } from 'lucide-react';

// === UNIFORM PRODUCT CARD COMPONENTS ===
import ProductCard3Row from '../app/components/products/ProductCard3Row';
import ProductCard4Row from '../app/components/products/ProductCard4Row';
import ProductCard1Row from '../app/components/products/ProductCard1Row';

// === CATEGORY COMPONENTS ===
import CategoryHero from '../app/components/categories/CategoryHero';
import CategoryFilters from '../app/components/categories/CategoryFilters';
import CategoryNavigation from '../app/components/categories/CategoryNavigation';

// === UI COMPONENTS ===
import { Button } from '../app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Badge } from '../app/components/ui/badge';

// === TYPES ===
interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  our_price: number;
  fire_price?: number;
  image_url?: string;
  image_urls?: string[];
  brand_name?: string;
  category_id?: string;
  category_name?: string;
  stock_quantity?: number;
  is_active?: boolean;
  featured?: boolean;
  sku?: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoryTemplateProps {
  // Category-specific props
  categoryId?: string;
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundImage?: string;
  showFilters?: boolean;
  defaultLayout?: 'grid' | 'list' | 'featured';
  showCategoryNavigation?: boolean;
  productsPerPage?: number;
  metadata: Metadata;
}

// === METADATA ===
export const generateMetadata = ({ categoryName, categoryDescription }: CategoryTemplateProps): Metadata => ({
  title: `${categoryName} | HIGHWAY 420`,
  description: categoryDescription,
  keywords: `${categoryName}, cannabis, smoking accessories, HIGHWAY 420`,
  openGraph: {
    title: `${categoryName} | HIGHWAY 420`,
    description: categoryDescription,
    type: 'website',
  },
});

// === CATEGORY CONFIGURATIONS ===
const CATEGORY_CONFIGS = {
  pipes: {
    title: "HAND PIPES",
    description: "Premium handcrafted pipes for the discerning smoker",
    apiEndpoint: "/api/products/pipes",
    gradient: "from-orange-500 to-red-600",
  },
  bongs: {
    title: "BONGS",
    description: "Water pipes and bongs for the ultimate smoking experience",
    apiEndpoint: "/api/bongs",
    gradient: "from-blue-500 to-cyan-600",
  },
  bubblers: {
    title: "BUBBLERS",
    description: "Small water pipes perfect for portability and efficiency",
    apiEndpoint: "/api/bubblers",
    gradient: "from-green-500 to-teal-600",
  },
  "dab-rigs": {
    title: "DAB RIGS & NAILS",
    description: "Professional dab rigs and accessories for concentrates",
    apiEndpoint: "/api/dab-rigs",
    gradient: "from-purple-500 to-pink-600",
  },
  vaporizers: {
    title: "VAPORIZERS",
    description: "Dry herb and concentrate vaporizers for discreet, efficient smoking",
    apiEndpoint: "/api/vaporizers",
    gradient: "from-indigo-500 to-purple-600",
  },
  accessories: {
    title: "ACCESSORIES",
    description: "Essential smoking accessories and tools",
    apiEndpoint: "/api/products?category=accessories",
    gradient: "from-gray-500 to-slate-600",
  },
  "pre-rolls": {
    title: "PRE-ROLLS",
    description: "Premium pre-rolled joints and cones",
    apiEndpoint: "/api/pre-rolls",
    gradient: "from-yellow-500 to-amber-600",
  },
  apparel: {
    title: "APPAREL",
    description: "Cannabis culture apparel and lifestyle wear",
    apiEndpoint: "/api/apparel",
    gradient: "from-red-500 to-pink-600",
  },
} as const;

// === SORT OPTIONS ===
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
] as const;

// === MAIN COMPONENT ===
export default function CategoryTemplate({
  categoryId,
  categoryName,
  categorySlug,
  categoryDescription,
  heroTitle,
  heroSubtitle,
  heroBackgroundImage,
  showFilters = true,
  defaultLayout = 'grid',
  showCategoryNavigation = true,
  productsPerPage = 24,
  metadata,
}: CategoryTemplateProps) {

  // === STATE ===
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list' | 'featured'>(defaultLayout);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const router = useRouter();

  // === CONFIG BASED ON CATEGORY ===
  const categoryConfig = useMemo(() => {
    return CATEGORY_CONFIGS[categorySlug as keyof typeof CATEGORY_CONFIGS] || {
      title: categoryName,
      description: categoryDescription,
      apiEndpoint: `/api/products?category=${categorySlug}`,
      gradient: "from-gray-500 to-slate-600",
    };
  }, [categorySlug, categoryName, categoryDescription]);

  // === EFFECTS ===
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, activeFilters]);

  // === FUNCTIONS ===
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
        sort: sortBy,
        ...(categoryId && { category_id: categoryId }),
        ...activeFilters
      });

      const response = await fetch(`${categoryConfig.apiEndpoint}?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // === RENDER PRODUCT GRID ===
  const renderProductGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border animate-pulse">
              <div className="h-64 bg-gray-200 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
          <p className="text-gray-600 mb-8">We're still curating our {categoryName.toLowerCase()} selection. Check back soon!</p>
          <Link href="/products">
            <Button
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3"
            >
              Browse All Products
            </Button>
          </Link>
        </div>
      );
    }

    // Choose appropriate card component based on layout
    const CardComponent = layout === 'grid'
      ? ProductCard4Row
      : layout === 'list'
        ? ProductCard1Row
        : ProductCard3Row;

    return (
      <div className={
        layout === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : layout === 'list'
            ? "space-y-4"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }>
        {products.map((product) => (
          <CardComponent
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              price: product.our_price || product.price,
              image_url: product.image_url,
              image_urls: product.image_urls,
              brand: product.brand_name,
              brand_name: product.brand_name,
              short_description: product.short_description || product.description,
              description: product.description,
              stock_quantity: product.stock_quantity,
              featured: product.featured,
              sku: product.sku,
              compare_at_price: product.sale_price || product.fire_price,
              inStock: product.stock_quantity > 0
            }}
          />
        ))}
      </div>
    );
  };

  // === RENDER ===
  return (
    <div className="min-h-screen bg-white">

      {/* Category Hero Section */}
      <CategoryHero
        title={heroTitle}
        subtitle={heroSubtitle}
        backgroundImage={heroBackgroundImage}
        gradient={categoryConfig.gradient}
        categoryName={categoryName}
      />

      {/* Category Navigation */}
      {showCategoryNavigation && <CategoryNavigation activeCategory={categorySlug} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {categoryConfig.title}
            </h2>
            <p className="text-gray-600 hidden sm:block">
              {categoryConfig.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Layout Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={layout === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayout('grid')}
                className="p-2"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={layout === 'featured' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayout('featured')}
                className="p-2 hidden md:flex"
              >
                🌟
              </Button>
              <Button
                variant={layout === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayout('list')}
                className="p-2 hidden lg:flex"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Filters Toggle */}
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && showMobileFilters && (
          <div className="mb-6 lg:hidden">
            <CategoryFilters
              categoryId={categoryId}
              categoryName={categoryName}
              onFiltersChange={handleFilterChange}
              className="bg-white border border-gray-200 rounded-lg p-4"
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Desktop Filters Sidebar */}
          {showFilters && (
            <div className="hidden lg:block">
              <CategoryFilters
                categoryId={categoryId}
                categoryName={categoryName}
                onFiltersChange={handleFilterChange}
              />
            </div>
          )}

          {/* Products Grid */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {renderProductGrid()}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (totalPages <= 5) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, index, array) => (
                      <div key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 py-2 text-gray-500">...</span>
                        )}
                        <Button
                          variant={page === currentPage ? 'default' : 'outline'}
                          onClick={() => handlePageChange(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      </div>
                    ))}

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of premium smoking accessories and cannabis culture products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Shop All Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3"
              >
                Get Help Finding Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// === EXPORT TYPES ===
export type { CategoryTemplateProps, Product };
