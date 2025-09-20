'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GlobalMasthead from '../components/GlobalMasthead';
import DopeCityFooter from '../../components/DopeCityFooter';
import Image from 'next/image';
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS, PRICE_RANGES } from '../lib/product-categorization';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Star,
  ShoppingCart,
  Loader2,
  AlertCircle,
  Tag,
  Package
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface SearchResult {
  id: string;
  name: string;
  brand_name?: string;
  price: number;
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
  relevanceScore: number;
  resultType: 'product' | 'brand' | 'category';
}

interface SearchFilters {
  category: string;
  brand: string;
  priceMin: string;
  priceMax: string;
  stockStatus: string; // 'all', 'in-stock', 'out-of-stock', 'low-stock'
  featured: boolean;
  materials: string[];
  tags: string[];
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'featured', label: 'Featured First' },
];

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || 'all',
    brand: searchParams.get('brand') || 'all',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    stockStatus: searchParams.get('stockStatus') || 'all',
    featured: searchParams.get('featured') === 'true',
    materials: searchParams.get('materials')?.split(',').filter(Boolean) || [],
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
  });

  // Debounced search function
  const performSearch = useCallback(async (query: string, currentFilters: SearchFilters, sort: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        limit: '20',
        offset: '0',
        includeCategories: 'true',
        includeBrands: 'true',
        ...(currentFilters.category !== 'all' && { category: currentFilters.category }),
        ...(currentFilters.brand !== 'all' && { brand: currentFilters.brand }),
        ...(currentFilters.priceMin && { priceMin: currentFilters.priceMin }),
        ...(currentFilters.priceMax && { priceMax: currentFilters.priceMax }),
        ...(currentFilters.stockStatus !== 'all' && { stockStatus: currentFilters.stockStatus }),
        ...(currentFilters.featured && { featured: 'true' }),
        ...(currentFilters.materials.length > 0 && { materials: currentFilters.materials.join(',') }),
        ...(currentFilters.tags.length > 0 && { tags: currentFilters.tags.join(',') }),
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        let sortedResults = [...data.results];
        
        // Apply client-side sorting
        switch (sort) {
          case 'price-low':
            sortedResults.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            sortedResults.sort((a, b) => b.price - a.price);
            break;
          case 'name':
            sortedResults.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'featured':
            sortedResults.sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return b.relevanceScore - a.relevanceScore;
            });
            break;
          case 'relevance':
          default:
            // Already sorted by relevance from API
            break;
        }

        setResults(sortedResults);
        setTotal(data.total);
      } else {
        console.error('Search error:', data.error);
        setResults([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Search request failed:', error);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update URL with search parameters
  const updateURL = useCallback((query: string, currentFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (currentFilters.category !== 'all') params.set('category', currentFilters.category);
    if (currentFilters.brand !== 'all') params.set('brand', currentFilters.brand);
    if (currentFilters.priceMin) params.set('priceMin', currentFilters.priceMin);
    if (currentFilters.priceMax) params.set('priceMax', currentFilters.priceMax);
    if (currentFilters.stockStatus !== 'all') params.set('stockStatus', currentFilters.stockStatus);
    if (currentFilters.featured) params.set('featured', 'true');
    if (currentFilters.materials.length > 0) params.set('materials', currentFilters.materials.join(','));
    if (currentFilters.tags.length > 0) params.set('tags', currentFilters.tags.join(','));

    const newURL = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newURL, { scroll: false });
  }, [router]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    updateURL(query, filters);
    performSearch(query, filters, sortBy);
  }, [filters, sortBy, updateURL, performSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(searchQuery, newFilters);
    performSearch(searchQuery, newFilters, sortBy);
  }, [filters, searchQuery, sortBy, updateURL, performSearch]);

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort);
    performSearch(searchQuery, filters, newSort);
  }, [searchQuery, filters, performSearch]);

  // Initial search on mount
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      setSearchQuery(query);
      performSearch(query, filters, sortBy);
    }
  }, [searchParams, filters, sortBy, performSearch]);

  // Get result type icon
  const getResultTypeIcon = (type: string) => {
    switch (type) {
      case 'brand':
        return <Tag className="w-4 h-4 text-blue-500" />;
      case 'category':
        return <Package className="w-4 h-4 text-green-500" />;
      default:
        return <ShoppingCart className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      
      {/* Search Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3 items-center">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filters Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                className={showFilters ? "bg-dope-orange-500 hover:bg-dope-orange-600" : ""}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

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

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Searching...
                </div>
              ) : (
                <>
                  {total > 0 ? (
                    <>
                      Showing {results.length} of {total} results
                      {searchQuery && ` for "${searchQuery}"`}
                    </>
                  ) : searchQuery ? (
                    `No results found for "${searchQuery}"`
                  ) : (
                    'Enter a search term to find products'
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
                >
                  {PRODUCT_BRANDS.map((brand) => (
                    <option key={brand.value} value={brand.value}>
                      {brand.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <select
                    value={`${filters.priceMin || ''}-${filters.priceMax || ''}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-');
                      handleFilterChange('priceMin', min || '');
                      handleFilterChange('priceMax', max || '');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
                  >
                    {PRICE_RANGES.map((range) => (
                      <option key={range.value} value={range.value === 'all' ? '' : `${range.min}-${range.max}`}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="w-full text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
                <select
                  value={filters.stockStatus}
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock Only</option>
                  <option value="out-of-stock">Out of Stock Only</option>
                  <option value="low-stock">Low Stock (1-5)</option>
                  <option value="high-stock">High Stock (20+)</option>
                </select>
              </div>

              {/* Featured Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Featured Products Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-dope-orange-500" />
              <p className="text-gray-600">Searching products...</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {results.map((result) => (
              <div
                key={`${result.resultType}-${result.id}`}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`bg-gray-100 relative ${
                  viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'
                }`}>
                  {result.image_url ? (
                    <Image
                      src={result.image_url}
                      alt={result.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {getResultTypeIcon(result.resultType)}
                    </div>
                  )}
                  
                  {/* Result Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      result.resultType === 'brand' ? 'bg-blue-100 text-blue-800' :
                      result.resultType === 'category' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.resultType}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {result.featured && (
                    <div className="absolute top-2 right-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{result.name}</h3>
                    {result.resultType === 'product' && (
                      <span className="text-xl font-bold text-dope-orange-600 ml-2">
                        ${result.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {result.brand_name && (
                    <p className="text-sm text-gray-600 mb-2">{result.brand_name}</p>
                  )}

                  {(result.short_description || result.description) && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {result.short_description || result.description}
                    </p>
                  )}

                  {/* Tags */}
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {result.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    {result.sku && (
                      <span className="text-xs text-gray-500">SKU: {result.sku}</span>
                    )}
                    <Button size="sm" className="bg-dope-orange-500 hover:bg-dope-orange-600">
                      {result.resultType === 'product' ? 'View Product' : 
                       result.resultType === 'brand' ? 'View Brand' : 'View Category'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  category: 'all',
                  brand: 'all',
                  priceMin: '',
                  priceMax: '',
                  stockStatus: 'all',
                  featured: false,
                  materials: [],
                  tags: [],
                });
                router.push('/search');
              }}
              variant="outline"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start your search
            </h3>
            <p className="text-gray-600">
              Enter a search term above to find products, brands, and categories.
            </p>
          </div>
        )}
      </main>

      <DopeCityFooter />
    </div>
  );
}
