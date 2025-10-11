'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingState, { useLoadingState } from '../../components/LoadingState';
import BongsFilters from './components/BongsFilters';
import BongsProductGrid from './components/BongsProductGrid';
import BongsBreadcrumb from './components/BongsBreadcrumb';
import BongsHero from './components/BongsHero';
import BongsSortBar from './components/BongsSortBar';
import BongsViewToggle from './components/BongsViewToggle';

export interface BongProduct {
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
}

export default function BongsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<BongProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<BongProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    brands: [] as string[],
    materials: [] as string[],
    heights: [] as string[],
    jointSizes: [] as string[],
    percolators: [] as string[],
    categories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
  });

  useEffect(() => {
    // Load real bong products from Supabase
    loadBongProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Apply filters - using available fields from main_site_products
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p: BongProduct) => p.brand_id && filters.brands.includes(p.brand_id));
    }
    if (filters.inStock) {
      filtered = filtered.filter((p: BongProduct) => p.stock_quantity > 0);
    }

    // Price range filter - use our_price field
    filtered = filtered.filter((p: BongProduct) => {
      const price = p.our_price || p.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: BongProduct, b: BongProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a: BongProduct, b: BongProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a: BongProduct, b: BongProduct) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a: BongProduct, b: BongProduct) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        // Sort by newest first, then by stock quantity
        filtered.sort((a: BongProduct, b: BongProduct) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          if (dateA !== dateB) return dateB - dateA;
          return b.stock_quantity - a.stock_quantity;
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, sortBy]);

  const loadBongProducts = async () => {
    try {
      setLoading(true);

      // Use the dedicated bongs API endpoint
      const response = await fetch('/api/products/bongs');

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Loaded ${data.products?.length || 0} bong products from API`);

        // Transform to match our interface
        const transformedProducts = (data.products || []).map((product: any) => ({
          id: product.id,
          name: product.name,
          our_price: product.price || product.our_price,
          sale_price: product.compare_at_price,
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
          // Add compatibility fields
          price: product.price || product.our_price,
          isNew: product.isNew || false,
          isSale: product.isSale || false,
          originalPrice: product.compare_at_price,
          inStock: product.inStock || (product.stock_quantity > 0),
          brand: product.brand || product.brand_id || 'Unknown Brand',
          category: 'Bongs'
        }));

        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } else {
        console.error('Failed to load bong products from API');
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error loading bong products:', error);
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
        onRetry={loadBongProducts}
        timeout={15000}
      >
        <div>Bongs Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div>
      {/* Breadcrumb */}
      <BongsBreadcrumb />

      {/* Hero Section */}
      <BongsHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <BongsFilters 
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
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <BongsSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <BongsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Product Grid */}
            <BongsProductGrid 
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

// Mock data generator removed - now using real Supabase data
