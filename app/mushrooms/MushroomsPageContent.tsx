'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MushroomsFilters from './components/MushroomsFilters';
import MushroomsProductGrid from './components/MushroomsProductGrid';
import MushroomsBreadcrumb from './components/MushroomsBreadcrumb';
import MushroomsHero from './components/MushroomsHero';
import MushroomsSortBar from './components/MushroomsSortBar';
import MushroomsViewToggle from './components/MushroomsViewToggle';
import MushroomsInfoSection from './components/MushroomsInfoSection';
import ActiveFilters from './components/ActiveFilters';

export interface MushroomProduct {
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

  // Mushroom-specific fields
  type?: string; // psilocybin, lion's mane, reishi, cordyceps, etc.
  desired_effect?: string[]; // euphoria, relaxation, focus, energy, etc.
  strength?: string; // mild, moderate, strong, intense
  origin?: string; // region or cultivation method
  form?: string; // dried, capsules, gummies, tincture, etc.

  // Derived/computed fields for display
  brand?: string;
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  features?: string[];
  tags?: string[];
}

export default function MushroomsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<MushroomProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MushroomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

  // Mushroom-specific filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 200] as [number, number],
    types: [] as string[],
    desiredEffects: [] as string[],
    strengths: [] as string[],
    origins: [] as string[],
    forms: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
    featured: false,
    vipExclusive: false,
  });

  useEffect(() => {
    // Load products from Supabase
    loadMushroomProducts();
  }, []);

  const loadMushroomProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?mushrooms');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } else {
        console.error('Failed to load mushroom products');
        // Fallback to mock data for development
        const mockProducts = generateMockMushrooms();
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      }
    } catch (error) {
      console.error('Error loading mushroom products:', error);
      // Fallback to mock data
      const mockProducts = generateMockMushrooms();
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
          product.type,
          product.origin,
          product.form,
          ...(product.desired_effect || []),
          ...(product.features || []),
          ...(product.tags || [])
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Apply filters
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter(product =>
        product.type && filters.types.includes(product.type)
      );
    }

    if (filters.desiredEffects.length > 0) {
      filtered = filtered.filter(product =>
        product.desired_effect?.some(effect => filters.desiredEffects.includes(effect))
      );
    }

    if (filters.strengths.length > 0) {
      filtered = filtered.filter(product =>
        product.strength && filters.strengths.includes(product.strength)
      );
    }

    if (filters.forms.length > 0) {
      filtered = filtered.filter(product =>
        product.form && filters.forms.includes(product.form)
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
      <MushroomsBreadcrumb />
      <MushroomsHero />
      <MushroomsInfoSection />

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
              Search Results for "{searchQuery}" in Mushrooms
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Found {filteredProducts.length} matching products
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <MushroomsFilters
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
                <MushroomsSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <MushroomsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </div>

            {/* Products Grid */}
            <MushroomsProductGrid products={currentProducts} viewMode={viewMode} />

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

// Mock data generator for development
function generateMockMushrooms(): MushroomProduct[] {
  const types = ['Psilocybin', "Lion's Mane", 'Reishi', 'Cordyceps', 'Turkey Tail', 'Chaga', 'Maitake'];
  const effects = ['Euphoria', 'Relaxation', 'Focus', 'Energy', 'Creativity', 'Meditation', 'Sleep Support'];
  const strengths = ['Mild', 'Moderate', 'Strong', 'Intense'];
  const forms = ['Dried', 'Capsules', 'Gummies', 'Tincture', 'Tea', 'Extract'];
  const origins = ['Oregon', 'California', 'British Columbia', 'Netherlands', 'Jamaica'];

  return Array.from({ length: 36 }, (_, i) => ({
    id: `mushroom-${i + 1}`,
    name: `Premium ${types[i % types.length]} Mushroom ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 25,
    compare_at_price: Math.random() > 0.7 ? Math.floor(Math.random() * 150) + 75 : undefined,
    image_url: `/images/mushrooms/mushroom-${(i % 8) + 1}.jpg`,
    image_urls: [`/images/mushrooms/mushroom-${(i % 8) + 1}.jpg`],
    category: 'Mushrooms',
    type: types[i % types.length],
    desired_effect: [effects[i % effects.length], effects[(i + 1) % effects.length]],
    strength: strengths[i % strengths.length],
    form: forms[i % forms.length],
    origin: origins[i % origins.length],
    stock_quantity: Math.floor(Math.random() * 30) + 1,
    inStock: Math.random() > 0.1,
    channels: ['vip_smoke'],
    is_active: true,
    featured: Math.random() > 0.8,
    vip_exclusive: Math.random() > 0.9,
    isNew: Math.random() > 0.8,
    isSale: Math.random() > 0.7,
    description: `High-quality ${types[i % types.length].toLowerCase()} mushrooms with potent ${effects[i % effects.length].toLowerCase()} effects.`,
    features: ['Lab Tested', 'Premium Quality', 'Discreet Packaging', 'Fast Shipping'],
    tags: ['mushrooms', 'premium', 'lab-tested', types[i % types.length].toLowerCase()],
  }));
}
