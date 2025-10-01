'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import GlobalMasthead from '../../components/GlobalMasthead';
import DopeCityFooter from '../../../components/DopeCityFooter';

import Image from 'next/image';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { detectCategory, PRODUCT_CATEGORIES } from '../../lib/product-categorization';

interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  image_url?: string;
  sku: string;
  featured: boolean;
  stock_quantity?: number;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
  inStock: boolean;
  featured: boolean;
}

const CRAVE_CATEGORIES = [
  { value: 'all', label: 'All Products', icon: '🛍️' },
  { value: 'disposables', label: 'Disposables', icon: '💨' },
  { value: 'batteries', label: 'Batteries', icon: '🔋' },
  { value: 'cannabis', label: 'Cannabis', icon: '🌿' },
  { value: 'accessories', label: 'Accessories', icon: '🔧' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'newest', label: 'Newest First' },
];

export default function CraveBrandPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 500],
    sortBy: 'featured',
    searchQuery: '',
    inStock: false,
    featured: false,
  });

  // Fetch Crave products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabaseBrowser
          .from('products')
          .select('*')
          .or('name.ilike.%crave%,brand_name.ilike.%crave%,sku.ilike.%crave%')
          .eq('is_active', true)
          .eq('nicotine_product', false)
          .eq('tobacco_product', false)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Categorize product using enhanced detection
  const categorizeProduct = (product: Product): string => {
    return detectCategory(product.name);
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => 
        categorizeProduct(product) === filters.category
      );
    }

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.short_description?.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => 
        (product.stock_quantity || 0) > 0
      );
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    // Sorting
    switch (filters.sortBy) {
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
        // Already sorted by created_at in fetch
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.price - a.price; // Secondary sort by price
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  // Get category counts
  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = {
      all: products.length,
      disposables: 0,
      batteries: 0,
      cannabis: 0,
      accessories: 0,
    };

    products.forEach(product => {
      const category = categorizeProduct(product);
      counts[category]++;
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dope-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Crave products...</p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      
      {/* Compact Brand Header */}
      <div className="relative bg-black text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="font-chalets text-4xl md:text-5xl tracking-wider text-white">
                CRAVE
              </h1>
              <div className="hidden md:block w-16 h-0.5 bg-dope-orange-500"></div>
              <div className="hidden md:block text-sm text-gray-300">
                Premium Vaping Excellence
              </div>
            </div>

            {/* Category Stats - Compact */}
            <div className="hidden lg:flex items-center space-x-4">
              {CRAVE_CATEGORIES.slice(0, 3).map((category) => (
                <div key={category.value} className="text-center">
                  <div className="text-lg font-bold text-dope-orange-500">
                    {categoryCounts[category.value]}
                  </div>
                  <div className="text-xs text-gray-400">{category.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Description */}
          <p className="text-sm text-gray-300 mt-2 max-w-3xl">
            Premium vaping products designed for quality, performance, and satisfaction. From cutting-edge disposables to reliable accessories that define modern vaping culture.
          </p>
        </div>

        {/* Subtle Orange Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-dope-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {CRAVE_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilters(prev => ({ ...prev, category: category.value }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.category === category.value
                      ? 'bg-dope-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                  <span className="ml-2 text-xs opacity-75">
                    ({categoryCounts[category.value]})
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Controls */}
            <div className="flex flex-1 gap-3 items-center min-w-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Crave products..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-dope-orange-500"
                />
              </div>

              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-dope-orange-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? 'bg-dope-orange-500 text-white border-dope-orange-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-dope-orange-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-dope-orange-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DopeCityFooter />
    </div>
  );
}
