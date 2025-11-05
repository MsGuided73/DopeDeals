'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingState from '../../components/LoadingState';
import ThcaMasterFilters from './components/ThcaMasterFilters';
import ThcaMasterProductGrid from './components/ThcaMasterProductGrid';
import ThcaMasterBreadcrumb from './components/ThcaMasterBreadcrumb';
import ThcaMasterHero from './components/ThcaMasterHero';
import ThcaMasterSortBar from './components/ThcaMasterSortBar';
import ThcaMasterViewToggle from './components/ThcaMasterViewToggle';
import ThcaMasterCategoryNav from './components/ThcaMasterCategoryNav';

export interface ThcaMasterProduct {
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
  type?: string; // Product type (Flower, Preroll, Cartridge, Concentrate, Edible, etc.)
  size?: string; // Product size specifications
  cannabinoid_type?: string; // THCA, CBD, Delta, etc.
  search_vec?: number[]; // Vector for semantic search
}

export default function ThcaMasterPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ThcaMasterProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ThcaMasterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter states - expanded for master collection
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

  // Get URL parameters for category/section navigation
  const categoryParam = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    // Load all THCA and cannabinoid products
    loadThcaMasterProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Apply category filter first
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => {
        const categoryMap: Record<string, string[]> = {
          'flower': ['THCA Flower', 'Flower', 'THCA'],
          'prerolls': ['THCA Prerolls', 'Prerolls', 'Pre-Rolls'],
          'cartridges': ['THCA Cartridges', 'Cartridges', 'Vape Cartridges'],
          'concentrates': ['THCA Concentrates', 'Concentrates', 'Rosin', 'THCA Rosin'],
          'edibles': ['Edibles', 'THCA Edibles', 'Cannabis Edibles'],
          'cbd': ['CBD', 'CBD Products', 'Wellness'],
          'delta': ['Delta', 'Delta Products', 'Delta-8', 'Delta-9'],
          'mushrooms': ['Mushrooms', 'Psychedelic Mushrooms'],
          'nitrous': ['Nitrous Oxide', 'Whippits'],
          'kratom': ['7-Hydroxymitragynine', 'Kratom']
        };

        const categoryKeywords = categoryMap[activeCategory] || [];
        return categoryKeywords.some(keyword =>
          product.name.toLowerCase().includes(keyword.toLowerCase()) ||
          (product.category && product.category.toLowerCase().includes(keyword.toLowerCase())) ||
          (product.type && product.type.toLowerCase().includes(keyword.toLowerCase()))
        );
      });
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        const searchableText = [
          product.name,
          product.description,
          product.short_description,
          product.brand,
          product.category,
          product.sku,
          product.type,
          product.cannabinoid_type
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Apply filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p: ThcaMasterProduct) => p.brand && filters.brands.includes(p.brand));
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter((p: ThcaMasterProduct) => {
        return filters.types.some(type => p.name.toLowerCase().includes(type.toLowerCase()));
      });
    }

    if (filters.cannabinoidTypes.length > 0) {
      filtered = filtered.filter((p: ThcaMasterProduct) =>
        p.cannabinoid_type && filters.cannabinoidTypes.includes(p.cannabinoid_type)
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter((p: ThcaMasterProduct) => p.stock_quantity > 0);
    }

    if (filters.onSale) {
      filtered = filtered.filter((p: ThcaMasterProduct) => p.sale_price && p.sale_price < (p.our_price || p.price || 0));
    }

    if (filters.isNew) {
      filtered = filtered.filter((p: ThcaMasterProduct) => p.isNew);
    }

    if (filters.featured) {
      filtered = filtered.filter((p: ThcaMasterProduct) => p.featured);
    }

    // Price range filter
    filtered = filtered.filter((p: ThcaMasterProduct) => {
      const price = p.our_price || p.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: ThcaMasterProduct, b: ThcaMasterProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a: ThcaMasterProduct, b: ThcaMasterProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a: ThcaMasterProduct, b: ThcaMasterProduct) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a: ThcaMasterProduct, b: ThcaMasterProduct) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        filtered.sort((a: ThcaMasterProduct, b: ThcaMasterProduct) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, sortBy, activeCategory, searchQuery]);

  const loadThcaMasterProducts = async () => {
    try {
      setLoading(true);

      // TODO: Replace with comprehensive API that uses search_vec system
      // For now, we'll aggregate from multiple product endpoints
      const endpoints = [
        '/api/products/thca-pre-rolls',
        '/api/products/thca-flower',
        '/api/products/thca-concentrates',
        '/api/products/cbd-products',
        '/api/products/edibles',
        '/api/products/mushrooms',
        '/api/products/nitrous-oxide',
        '/api/products/7-hydroxymitragynine'
      ];

      const allProducts: ThcaMasterProduct[] = [];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            if (data.products && Array.isArray(data.products)) {
              // Transform products to match our interface
              const transformedProducts = data.products.map((product: any) => ({
                id: product.id,
                name: product.name,
                our_price: product.price || product.our_price,
                sale_price: product.compare_at_price || product.sale_price,
                image_url: product.image_url,
                imageUrl: product.image_url,
                image: product.image_url,
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
                price: product.price,
                isNew: product.isNew,
                isSale: product.isSale,
                originalPrice: product.compare_at_price,
                inStock: product.inStock,
                brand: product.brand,
                category: product.category,
                type: extractTypeFromName(product.name),
                size: product.specs?.size || '1g',
                cannabinoid_type: extractCannabinoidType(product.name, product.description),
                search_vec: product.search_vec // Will be populated by search_vec system
              }));
              allProducts.push(...transformedProducts);
            }
          }
        } catch (error) {
          console.warn(`Failed to load products from ${endpoint}:`, error);
        }
      }

      // Remove duplicates based on ID
      const uniqueProducts = allProducts.filter((product, index, self) =>
        index === self.findIndex(p => p.id === product.id)
      );

      console.log(`✅ Loaded ${uniqueProducts.length} total THCA & cannabinoid products`);
      setProducts(uniqueProducts);
      setFilteredProducts(uniqueProducts);
    } catch (error) {
      console.error('Error loading THCA master products:', error);
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
        onRetry={loadThcaMasterProducts}
        timeout={15000}
      >
        <div>THCA Master Collection Loading...</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        {/* Breadcrumb */}
        <ThcaMasterBreadcrumb />

        {/* Hero Section */}
        <ThcaMasterHero />

        {/* Category Navigation */}
        <ThcaMasterCategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Using foundation from BongsFilters */}
            <div className="lg:w-1/4">
              <ThcaMasterFilters
                filters={filters}
                setFilters={setFilters}
                products={products}
              />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Sort Bar and View Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                    {activeCategory !== 'all' && ` in ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <ThcaMasterSortBar sortBy={sortBy} setSortBy={setSortBy} />
                  <ThcaMasterViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                </div>
              </div>

              {/* Product Grid - Using UniversalProductCard from Pipes */}
              <ThcaMasterProductGrid
                products={currentProducts}
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

// Helper functions
function extractTypeFromName(productName: string): string | null {
  if (!productName) return null;

  const nameLower = productName.toLowerCase();

  if (nameLower.includes('preroll')) return 'Preroll';
  if (nameLower.includes('cartridge') || nameLower.includes('cart')) return 'Cartridge';
  if (nameLower.includes('disposable') || nameLower.includes('vape pen')) return 'Disposable';
  if (nameLower.includes('concentrate') || nameLower.includes('rosin')) return 'Concentrate';
  if (nameLower.includes('edible') || nameLower.includes('gummies')) return 'Edible';
  if (nameLower.includes('flower') || nameLower.includes('bud')) return 'Flower';
  if (nameLower.includes('mushroom')) return 'Mushroom';
  if (nameLower.includes('nitrous') || nameLower.includes('whippits')) return 'Nitrous';
  if (nameLower.includes('kratom') || nameLower.includes('mitragynine')) return 'Kratom';

  return null;
}

function extractCannabinoidType(productName: string, description?: string): string | null {
  const text = `${productName} ${description || ''}`.toLowerCase();

  if (text.includes('thca') || text.includes('thc-a')) return 'THCA';
  if (text.includes('cbd')) return 'CBD';
  if (text.includes('delta-8')) return 'Delta-8';
  if (text.includes('delta-9')) return 'Delta-9';
  if (text.includes('cbg')) return 'CBG';
  if (text.includes('cbc')) return 'CBC';

  return null;
}
