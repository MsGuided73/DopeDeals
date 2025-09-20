'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PipesFilters from './components/PipesFilters';
import PipesProductGrid from './components/PipesProductGrid';
import PipesBreadcrumb from './components/PipesBreadcrumb';
import PipesHero from './components/PipesHero';
import PipesSortBar from './components/PipesSortBar';
import PipesViewToggle from './components/PipesViewToggle';
import PipesInfoSection from './components/PipesInfoSection';
import ActiveFilters from './components/ActiveFilters';

export interface PipeProduct {
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
  channels: string[];
  is_active?: boolean;
  description?: string;
  short_description?: string;
  specs?: any;
  attributes?: any;
  
  // Derived/computed fields for display
  brand?: string;
  category?: string;
  material?: string;
  style?: string; // spoon, chillum, sherlock, one-hitter, etc.
  size?: string; // small, medium, large
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  features?: string[];
  tags?: string[];
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

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
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
    // Load products from Supabase
    loadPipeProducts();
  }, []);

  const loadPipeProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/pipes');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } else {
        console.error('Failed to load pipe products');
        // Fallback to mock data for development
        const mockProducts = generateMockPipes();
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      }
    } catch (error) {
      console.error('Error loading pipe products:', error);
      // Fallback to mock data
      const mockProducts = generateMockPipes();
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
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
      <PipesBreadcrumb />
      <PipesHero />
      <PipesInfoSection />

      {/* Active Filters Bar */}
      <ActiveFilters
        filters={filters}
        setFilters={setFilters}
        totalProducts={filteredProducts.length}
      />

      {/* Search Results Header */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-dope-orange-50 border border-dope-orange-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results for "{searchQuery}" in Hand Pipes
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Found {filteredProducts.length} matching pipes
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <PipesFilters 
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
                <PipesSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <PipesViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </div>

            {/* Products Grid */}
            <PipesProductGrid products={currentProducts} viewMode={viewMode} />

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

// Mock data generator for development (Note: Real inventory has 196+ pipe products)
function generateMockPipes(): PipeProduct[] {
  const brands = ['GRAV', 'Hemper', 'Empire Glassworks', 'Chameleon Glass', 'Marley Natural', 'Pyptek', 'MAV Glass'];
  const materials = ['Borosilicate Glass', 'Scientific Glass', 'Colored Glass', 'Clear Glass', 'Wood', 'Metal'];
  const styles = ['Spoon Pipe', 'Chillum', 'Sherlock', 'One Hitter', 'Steamroller', 'Gandalf'];
  const sizes = ['Small (3-4")', 'Medium (4-6")', 'Large (6-8")', 'XL (8"+)'];

  // Generate more mock products to better represent actual inventory
  return Array.from({ length: 48 }, (_, i) => ({
    id: `pipe-${i + 1}`,
    name: `Premium Glass Pipe ${i + 1}`,
    price: Math.floor(Math.random() * 150) + 15,
    compare_at_price: Math.random() > 0.7 ? Math.floor(Math.random() * 200) + 50 : undefined,
    image_url: `/images/pipes/pipe-${(i % 12) + 1}.jpg`,
    image_urls: [`/images/pipes/pipe-${(i % 12) + 1}.jpg`, `/images/pipes/pipe-${(i % 12) + 1}-2.jpg`],
    brand: brands[i % brands.length],
    category: 'Glass Pipes',
    materials: [materials[i % materials.length]],
    material: materials[i % materials.length],
    style: styles[i % styles.length],
    size: sizes[i % sizes.length],
    stock_quantity: Math.floor(Math.random() * 50) + 1,
    inStock: Math.random() > 0.1,
    channels: ['vip_smoke'],
    is_active: true,
    featured: Math.random() > 0.8,
    vip_exclusive: Math.random() > 0.9,
    isNew: Math.random() > 0.8,
    isSale: Math.random() > 0.7,
    description: `High-quality ${materials[i % materials.length].toLowerCase()} pipe with premium construction and smooth hits.`,
    features: ['Premium Glass Construction', 'Smooth Airflow', 'Easy to Clean', 'Portable Design'],
    tags: ['glass', 'pipe', 'hand pipe', 'premium'],
  }));
}
