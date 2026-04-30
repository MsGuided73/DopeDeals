'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BubblersFilters from './components/BubblersFilters';
import BubblersProductGrid from './components/BubblersProductGrid';
import BubblersBreadcrumb from './components/BubblersBreadcrumb';
import BubblersHero from './components/BubblersHero';
import BubblersSortBar from './components/BubblersSortBar';
import BubblersViewToggle from './components/BubblersViewToggle';
import { supabaseBrowser } from '../lib/supabase-browser';
import { SlidersHorizontal } from 'lucide-react';
import MobileFilterDrawer from '../components/MobileFilterDrawer';

export interface BubblerProduct {
  id: string;
  name: string;
  price: number;
  vip_price?: number;
  image_url?: string;
  description?: string;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
  brand?: string;
  category?: string;
  material?: string;
  height?: string;
  joint_size?: string;
  percolator?: string;
  created_at: string;
  updated_at: string;
}

export default function BubblersPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<BubblerProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<BubblerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    brands: [] as string[],
    materials: [] as string[],
    heights: [] as string[],
    jointSizes: [] as string[],
    percolators: [] as string[],
    categories: [] as string[],
    inStock: true, // Default to showing only in-stock bubblers
  });

  useEffect(() => {
    // Load real bubbler products from Supabase
    loadBubblerProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Apply filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.materials.length > 0) {
      filtered = filtered.filter(p => p.material && filters.materials.includes(p.material));
    }
    if (filters.heights.length > 0) {
      filtered = filtered.filter(p => p.height && filters.heights.includes(p.height));
    }
    if (filters.jointSizes.length > 0) {
      filtered = filtered.filter(p => p.joint_size && filters.jointSizes.includes(p.joint_size));
    }
    if (filters.percolators.length > 0) {
      filtered = filtered.filter(p => p.percolator && filters.percolators.includes(p.percolator));
    }
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock_quantity > 0);
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

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
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        // Sort by newest first, then by stock quantity
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          if (dateA !== dateB) return dateB - dateA;
          return b.stock_quantity - a.stock_quantity;
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, sortBy]);

  const loadBubblerProducts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading bubbler products...');

      // Build bubbler keywords - focus specifically on bubblers
      const bubblerKeywords = [
        'BUBBLER',
        'MINI BUBBLER',
        'SHERLOCK BUBBLER',
        'HAMMER BUBBLER',
        'SIDECAR BUBBLER',
        'COMPACT WATER PIPE'
      ];

      // Create OR conditions for bubbler keywords in name and description
      const nameConditions = bubblerKeywords.map(keyword => `name.ilike.%${keyword}%`).join(',');
      const descConditions = bubblerKeywords.map(keyword => `description.ilike.%${keyword}%`).join(',');
      const combinedConditions = `${nameConditions},${descConditions}`;

      const { data, error } = await supabaseBrowser
        .from('products')
        .select('*')
        .or(combinedConditions)
        .eq('is_active', true)
        .eq('nicotine_product', false)
        .eq('tobacco_product', false)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      console.log('📊 Bubbler products response:', {
        dataCount: data?.length || 0,
        error: error ? JSON.stringify(error, null, 2) : null,
        sampleData: data?.slice(0, 3)?.map(p => ({ id: p.id, name: p.name })) || []
      });

      if (error) {
        console.error('❌ Error fetching bubbler products:', error);
        setProducts([]);
      } else {
        console.log(`✅ Successfully loaded ${data?.length || 0} bubbler products`);
        setProducts(data || []);
      }
    } catch (error) {
      console.error('💥 Catch block error:', error);
      setProducts([]);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <BubblersBreadcrumb />

      {/* Hero Section */}
      <BubblersHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — desktop only; mobile uses the drawer */}
          <div className="hidden lg:block lg:w-1/4">
            <BubblersFilters
              filters={filters}
              setFilters={setFilters}
              products={products}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and View Controls — Filters button on mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border-2 border-[#2d8f47] text-[#2d8f47] rounded-md text-sm font-bold hover:bg-[#2d8f47] hover:text-white transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <BubblersSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <BubblersViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </div>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
              <BubblersFilters filters={filters} setFilters={setFilters} products={products} />
            </MobileFilterDrawer>

            {/* Products Grid */}
            <BubblersProductGrid products={currentProducts} viewMode={viewMode} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
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
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
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
