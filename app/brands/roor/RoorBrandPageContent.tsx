'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import GlobalMasthead from '../../components/GlobalMasthead';
import DopeCityFooter from '../../../components/DopeCityFooter';
import Image from 'next/image';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { detectCategory } from '../../lib/product-categorization';

interface Product {
  id: string;
  name: string;
  brand_name?: string;
  price: string;
  image_url?: string;
  description?: string;
  short_description?: string;
  sku: string;
  featured: boolean;
  stock_quantity?: number;
  tags?: string[];
  materials?: string[];
  zoho_category_name?: string;
  manufacturer?: string;
}

interface Filters {
  category: string;
  priceRange: string;
  sortBy: string;
  searchQuery: string;
}

const ROOR_CATEGORIES = [
  { value: 'all', label: 'All Products', icon: '🏺' },
  { value: 'beakers', label: 'Beakers', icon: '🏺' },
  { value: 'straight-tubes', label: 'Straight Tubes', icon: '🔬' },
  { value: 'ash-catchers', label: 'Ash Catchers', icon: '🔧' },
  { value: 'accessories', label: 'Accessories', icon: '⚡' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-100', label: 'Under $100' },
  { value: '100-200', label: '$100 - $200' },
  { value: '200-300', label: '$200 - $300' },
  { value: '300-500', label: '$300 - $500' },
  { value: '500+', label: '$500+' },
];

const SORT_OPTIONS = [
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'featured', label: 'Featured First' },
];

export default function RoorBrandPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    priceRange: 'all',
    sortBy: 'price-high',
    searchQuery: '',
  });

  // Category counts
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});

  // Fetch ROOR products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseBrowser
          .from('products')
          .select('*')
          .or('brand_name.ilike.%ROOR%,name.ilike.%ROOR%,sku.ilike.%ROOR%')
          .eq('is_active', true)
          .eq('nicotine_product', false)
          .eq('tobacco_product', false)
          .order('price', { ascending: false });

        if (error) {
          console.error('Error fetching ROOR products:', error);
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Categorize product using enhanced detection
  const categorizeProduct = (product: Product): string => {
    const name = product.name.toLowerCase();
    
    if (name.includes('beaker') || name.includes('bk')) {
      return 'beakers';
    }
    if (name.includes('straight') || name.includes('st') || name.includes('zeaker')) {
      return 'straight-tubes';
    }
    if (name.includes('ash') || name.includes('dc')) {
      return 'ash-catchers';
    }
    return 'accessories';
  };

  // Calculate category counts
  useEffect(() => {
    const counts: { [key: string]: number } = {
      all: products.length,
      beakers: 0,
      'straight-tubes': 0,
      'ash-catchers': 0,
      accessories: 0,
    };

    products.forEach(product => {
      const category = categorizeProduct(product);
      counts[category] = (counts[category] || 0) + 1;
    });

    setCategoryCounts(counts);
  }, [products]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.short_description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => {
        const category = categorizeProduct(product);
        return category === filters.category;
      });
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return price >= min && (max === undefined || price <= max);
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dope-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading ROOR products...</p>
          </div>
        </div>
        <DopeCityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dope-orange-500/10 to-transparent"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h1 className="dope-city-title text-7xl md:text-8xl mb-6 text-white drop-shadow-2xl">
              ROOR
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-200">
            The legendary German glass brand. Since 1995, ROOR has been crafting the world's finest 
            borosilicate glass pieces using premium Schott glass and traditional German craftsmanship.
          </p>
          
          {/* Category Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {ROOR_CATEGORIES.slice(1).map((category) => (
              <div key={category.value} className="text-center bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-3xl font-bold text-dope-orange-400 mb-1">
                  {categoryCounts[category.value] || 0}
                </div>
                <div className="text-sm text-gray-300">{category.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search ROOR products..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {ROOR_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilters(prev => ({ ...prev, category: category.value }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.category === category.value
                      ? 'bg-dope-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                  <span className="ml-2 text-xs opacity-75">
                    ({categoryCounts[category.value] || 0})
                  </span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-dope-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-dope-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
                  >
                    {PRICE_RANGES.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filters.category === 'all' ? 'All ROOR Products' : 
             ROOR_CATEGORIES.find(c => c.value === filters.category)?.label || 'Products'}
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
            </span>
          </h2>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                viewMode === 'list' ? 'flex' : ''
              }`}>
                <div className={`bg-gray-50 relative ${
                  viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'
                }`}>
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🏺</div>
                        <div className="text-sm">No Image</div>
                      </div>
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-dope-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-dope-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {product.short_description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.short_description}
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-dope-orange-600">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      {product.stock_quantity !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.stock_quantity > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                        Add to Cart
                      </button>
                      <a
                        href={`/product/${product.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors text-center"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => setFilters({
                category: 'all',
                priceRange: 'all',
                sortBy: 'price-high',
                searchQuery: '',
              })}
              className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <DopeCityFooter />
    </div>
  );
}
