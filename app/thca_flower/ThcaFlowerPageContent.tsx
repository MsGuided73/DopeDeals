'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ThcaFlowerFilters from './components/ThcaFlowerFilters';
import ThcaFlowerProductGrid from './components/ThcaFlowerProductGrid';
import ThcaFlowerBreadcrumb from './components/ThcaFlowerBreadcrumb';
import ThcaFlowerHero from './components/ThcaFlowerHero';
import ThcaFlowerSortBar from './components/ThcaFlowerSortBar';
import ThcaFlowerViewToggle from './components/ThcaFlowerViewToggle';
import ThcaFlowerInfoSection from './components/ThcaFlowerInfoSection';

export interface ThcaFlowerProduct {
  id: string;
  name: string;
  price: number;
  vip_price?: number;
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
  style?: string; // flower, preroll, etc.
  size?: string; // 3.5g, 7g, 14g, 28g, etc.
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  features?: string[];
  tags?: string[];
}

export default function ThcaFlowerPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ThcaFlowerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ThcaFlowerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 100] as [number, number],
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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    // Load products from optimized API route
    const loadProducts = async () => {
      try {
        await loadThcaFlowerProducts();
      } catch (error) {
        console.error('Error loading THCA flower products:', error);
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    loadProducts();
  }, []);

  const loadThcaFlowerProducts = async () => {
    try {
      setLoading(true);

      // Use the optimized API route for THCA flower products
      const response = await fetch('/api/products/thca-flower');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.products) {
        console.warn('No THCA flower products data received');
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (err) {
      console.error('Error loading THCA flower products:', err);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply search query filter first
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
          product.style,
          product.material,
          product.size,
          ...(product.materials || []),
          ...(product.features || []),
          ...(product.tags || [])
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Apply filters
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        product.brand && filters.brands.includes(product.brand)
      );
    }

    if (filters.materials.length > 0) {
      filtered = filtered.filter(product =>
        product.materials?.some(material => filters.materials.includes(material)) ||
        (product.material && filters.materials.includes(product.material))
      );
    }

    if (filters.styles.length > 0) {
      filtered = filtered.filter(product =>
        product.style && filters.styles.includes(product.style)
      );
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.size && filters.sizes.includes(product.size)
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    if (filters.onSale) {
      filtered = filtered.filter(product => product.isSale);
    }

    if (filters.isNew) {
      filtered = filtered.filter(product => product.isNew);
    }

    if (filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    if (filters.vipExclusive) {
      filtered = filtered.filter(product => product.vip_exclusive);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
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
  }, [products, filters, sortBy, searchQuery]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ThcaFlowerBreadcrumb />
      <ThcaFlowerHero />
      <ThcaFlowerInfoSection />

      {/* Search Results Header */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-dope-orange-50 border border-dope-orange-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results for "{searchQuery}" in THCA Flower
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Found {filteredProducts.length} matching THCA flower products
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ThcaFlowerFilters
              filters={filters}
              setFilters={setFilters}
              products={products}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <ThcaFlowerSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <ThcaFlowerViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </div>

            {/* Products Grid */}
            <ThcaFlowerProductGrid products={currentProducts} viewMode={viewMode} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-dope-orange-500 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
