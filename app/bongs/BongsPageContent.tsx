'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BongsFilters from './components/BongsFilters';
import BongsProductGrid from './components/BongsProductGrid';
import BongsBreadcrumb from './components/BongsBreadcrumb';
import BongsHero from './components/BongsHero';
import BongsSortBar from './components/BongsSortBar';
import BongsViewToggle from './components/BongsViewToggle';
import EnhancedSearchBar from '../components/EnhancedSearchBar';
import { supabaseBrowser } from '../lib/supabase-browser';
import AgeVerification from '../components/AgeVerification';

export interface BongProduct {
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
    priceRange: [0, 1000],
    brands: [] as string[],
    materials: [] as string[],
    heights: [] as string[],
    jointSizes: [] as string[],
    percolators: [] as string[],
    categories: [] as string[],
    inStock: false,
  });

  useEffect(() => {
    // Load real bong products from Supabase
    loadBongProducts();
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
    // Note: onSale and isNew filters removed since we're using real data without these fields

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

  const loadBongProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseBrowser
        .from('products')
        .select('*')
        .or('name.ilike.%bong%, name.ilike.%water pipe%, description.ilike.%bong%, description.ilike.%water pipe%, category.ilike.%bong%')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bong products:', error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error loading bong products:', error);
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
    <div className="min-h-screen bg-white">
      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Masthead */}
      <div className="bg-black text-white">
        <div className="px-6 flex items-center justify-between gap-8" style={{ minHeight: '140px', height: '140px' }}>
          {/* HUGE DOPE CITY Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-black" style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '0.01em', fontSize: 'clamp(4rem, 12vw, 7rem)', lineHeight: '1.1' }}>
              DOPE CITY
            </Link>
          </div>

          {/* Enhanced Search Bar */}
          <div className="flex-1 max-w-3xl mx-8">
            <EnhancedSearchBar />
          </div>

          {/* Cart and Account Icons */}
          <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/sitemap-page" className="p-2 hover:bg-gray-800 rounded-md" title="Site Map">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </Link>
              <Link href="/auth" className="p-2 hover:bg-gray-800 rounded-md" title="Account">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/cart" className="p-2 hover:bg-gray-800 rounded-md relative" title="Shopping Cart">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-dope-orange text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>
          </div>
        </div>

        {/* DOPE Orange divider line */}
        <div className="h-1 bg-dope-orange"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 h-14">
            <Link href="/brands" className="flex items-center px-3 py-2 text-lg font-bold text-gray-700 hover:text-dope-orange transition-colors leading-tight">
              Shop by Brand
            </Link>
            <Link href="/products?category=thca" className="flex items-center px-3 py-2 text-lg font-bold text-gray-700 hover:text-dope-orange transition-colors leading-tight">
              THCA & More
            </Link>
            <Link href="/bongs" className="flex items-center px-3 py-2 text-lg font-bold text-dope-orange border-b-2 border-dope-orange leading-tight">
              Bongs
            </Link>
            <Link href="/pipes" className="flex items-center px-3 py-2 text-lg font-bold text-gray-700 hover:text-dope-orange transition-colors leading-tight">
              Pipes
            </Link>
            <Link href="/products?category=dab-rigs" className="flex items-center px-3 py-2 text-lg font-bold text-gray-700 hover:text-dope-orange transition-colors leading-tight">
              Dab Rigs
            </Link>
            <Link href="/products?category=vaporizers" className="flex items-center px-3 py-2 text-lg font-bold text-gray-700 hover:text-dope-orange transition-colors leading-tight">
              Vaporizers
            </Link>
            <Link href="/products?category=accessories" className="flex items-center px-3 py-2 text-lg font-bold text-gray-700 hover:text-dope-orange transition-colors leading-tight">
              Accessories
            </Link>
            <Link href="/products?category=edibles" className="flex items-center px-3 py-2 text-lg font-bold text-gray-700 hover:text-dope-orange transition-colors leading-tight">
              Munchies
            </Link>
          </div>
        </div>
      </nav>

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
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
  );
}

// Mock data generator removed - now using real Supabase data
