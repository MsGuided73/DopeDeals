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

export interface BongProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  brand: string;
  category: string;
  subcategory?: string;
  material: string;
  height: string;
  jointSize: string;
  percolator?: string;
  inStock: boolean;

  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  description: string;
  features: string[];
  tags: string[];
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
    onSale: false,
    isNew: false,
  });

  useEffect(() => {
    // Load mock data - replace with actual API call
    loadMockProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Apply filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }
    if (filters.materials.length > 0) {
      filtered = filtered.filter(p => filters.materials.includes(p.material));
    }
    if (filters.heights.length > 0) {
      filtered = filtered.filter(p => filters.heights.includes(p.height));
    }
    if (filters.jointSizes.length > 0) {
      filtered = filtered.filter(p => filters.jointSizes.includes(p.jointSize));
    }
    if (filters.percolators.length > 0) {
      filtered = filtered.filter(p => p.percolator && filters.percolators.includes(p.percolator));
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
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // featured
        filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, sortBy]);

  const loadMockProducts = () => {
    // Mock data - replace with actual API call
    const mockProducts: BongProduct[] = generateMockBongs();
    setProducts(mockProducts);
    setLoading(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

// Mock data generator
function generateMockBongs(): BongProduct[] {
  const brands = ['GRAV', 'Hemper', 'ROOR', 'Puffco', 'Calibear', 'Empire Glassworks', 'MAV Glass'];
  const materials = ['Borosilicate Glass', 'Scientific Glass', 'Colored Glass', 'Clear Glass'];
  const heights = ['6-8"', '8-12"', '12-16"', '16-20"', '20"+'];
  const jointSizes = ['14mm', '18mm', '19mm'];
  const percolators = ['Tree Perc', 'Honeycomb', 'Showerhead', 'Matrix', 'Inline', 'Turbine'];
  const categories = ['Beaker Bongs', 'Straight Tube', 'Recycler', 'Mini Bongs', 'Scientific Glass'];

  return Array.from({ length: 48 }, (_, i) => ({
    id: `bong-${i + 1}`,
    name: `Premium Glass Bong ${i + 1}`,
    price: Math.floor(Math.random() * 400) + 50,
    originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 500) + 100 : undefined,
    image: `/images/bongs/bong-${(i % 12) + 1}.jpg`,
    images: [`/images/bongs/bong-${(i % 12) + 1}.jpg`, `/images/bongs/bong-${(i % 12) + 1}-2.jpg`],
    brand: brands[i % brands.length],
    category: categories[i % categories.length],
    material: materials[i % materials.length],
    height: heights[i % heights.length],
    jointSize: jointSizes[i % jointSizes.length],
    percolator: Math.random() > 0.3 ? percolators[i % percolators.length] : undefined,
    inStock: Math.random() > 0.1,

    isNew: Math.random() > 0.8,
    isSale: Math.random() > 0.7,
    isBestseller: Math.random() > 0.85,
    description: `High-quality ${materials[i % materials.length].toLowerCase()} bong with premium construction and smooth hits.`,
    features: ['Premium Glass Construction', 'Smooth Airflow', 'Easy to Clean', 'Durable Design'],
    tags: ['glass', 'bong', 'water pipe', 'premium'],
  }));
}
