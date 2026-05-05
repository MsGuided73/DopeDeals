'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import GlobalMasthead from '../components/GlobalMasthead';
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS, PRICE_RANGES } from '../lib/product-categorization';
import ProductCard from '../products/components/ProductCard';
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
  
  const initialQuery = searchParams.get('q') || '';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const hasInitialFilter = initialBrand !== 'all' || initialCategory !== 'all';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(initialQuery.length >= 2 || hasInitialFilter);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    category: initialCategory,
    brand: initialBrand,
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    stockStatus: searchParams.get('stockStatus') || 'all',
    featured: searchParams.get('featured') === 'true',
    materials: searchParams.get('materials')?.split(',').filter(Boolean) || [],
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
  });

  // Debounced search function. `page` is passed explicitly because
  // useCallback's [] deps would otherwise capture a stale currentPage
  // and break pagination (every page request would re-fetch page 1).
  const performSearch = useCallback(async (query: string, currentFilters: SearchFilters, sort: string, page: number) => {
    const hasQuery = !!query && query.length >= 2;
    const hasFilter = currentFilters.brand !== 'all' || currentFilters.category !== 'all';
    if (!hasQuery && !hasFilter) {
      setResults([]);
      setTotal(0);
      setTotalPages(0);
      return;
    }

    setLoading(true);
    try {
      // Map sort options to API format
      const sortMapping: Record<string, string> = {
        'price-low': 'price_asc',
        'price-high': 'price_desc',
        'name': 'relevance', // fallback to relevance
        'featured': 'relevance', // fallback to relevance
        'relevance': 'relevance'
      };

      // Map stock status to API format
      const stockStatusMapping: Record<string, string[]> = {
        'all': [],
        'in-stock': ['in_stock', 'low_stock'],
        'out-of-stock': ['out_of_stock'],
        'low-stock': ['low_stock'],
        'high-stock': ['in_stock'] // assuming high stock means in_stock
      };

      const requestBody = {
        q: hasQuery ? query : undefined,
        category: currentFilters.category !== 'all' ? currentFilters.category : undefined,
        filters: {
          brand_slug: currentFilters.brand !== 'all' ? [currentFilters.brand] : [],
          price_min: currentFilters.priceMin ? parseFloat(currentFilters.priceMin) : undefined,
          price_max: currentFilters.priceMax ? parseFloat(currentFilters.priceMax) : undefined,
          in_stock_only: currentFilters.stockStatus === 'in-stock',
          inventory_status: stockStatusMapping[currentFilters.stockStatus] || [],
          materials: currentFilters.materials,
          tags: currentFilters.tags
        },
        sort: sortMapping[sort] || 'relevance',
        page,
        page_size: 24
      };

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        // Transform API response to match expected format
        const transformedResults = data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand_name: item.brand_name,
          price: item.price,
          image_url: item.image_url,
          description: '', // API doesn't provide description
          short_description: '', // API doesn't provide short_description
          sku: '', // API doesn't provide SKU
          featured: false, // API doesn't provide featured flag
          stock_quantity: item.stock_quantity,
          tags: [], // API doesn't provide tags in this format
          materials: [], // API doesn't provide materials in this format
          zoho_category_name: '', // API doesn't provide this
          manufacturer: '', // API doesn't provide this
          relevanceScore: 0, // API doesn't provide relevance score
          resultType: 'product' as const
        }));

        setResults(transformedResults);
        setTotal(data.total);
        setTotalPages(Math.ceil(data.total / 24));
        setMinPrice(data.min_price);
        setMaxPrice(data.max_price);
      } else {
        console.error('Search error:', data.error);
        setResults([]);
        setTotal(0);
        setMinPrice(null);
        setMaxPrice(null);
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
    setCurrentPage(1);
    updateURL(query, filters);
    performSearch(query, filters, sortBy, 1);
  }, [filters, sortBy, updateURL, performSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(searchQuery, newFilters);
    performSearch(searchQuery, newFilters, sortBy, 1);
  }, [filters, searchQuery, sortBy, updateURL, performSearch]);

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
    performSearch(searchQuery, filters, newSort, 1);
  }, [searchQuery, filters, performSearch]);

  // Fetch suggestions when no results are found
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 1) return;

    setLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/search/autosuggest?q=${encodeURIComponent(query)}&limit=6`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Initial search on mount / when the URL query changes.
  // Fires when there's a `q`, OR when a brand/category filter is set in
  // the URL (so brand-bulletin links like /search?brand=Crave run).
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const hasFilter = filters.brand !== 'all' || filters.category !== 'all';
    if (query || hasFilter) {
      setSearchQuery(query);
      setCurrentPage(1);
      performSearch(query, filters, sortBy, 1);
    }
  }, [searchParams, filters, sortBy, performSearch]);

  // Fetch suggestions when search has no results
  useEffect(() => {
    if (!loading && results.length === 0 && searchQuery && searchQuery.length >= 2) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [loading, results.length, searchQuery, fetchSuggestions]);

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
              ) : (() => {
                const brandLabel = filters.brand !== 'all' ? filters.brand : null;
                const scopeLabel = searchQuery
                  ? `"${searchQuery}"`
                  : brandLabel
                  ? `${brandLabel}`
                  : null;

                if (total > 0) {
                  return (
                    <>
                      Showing {results.length} of {total} results
                      {scopeLabel && ` for ${scopeLabel}`}
                    </>
                  );
                }
                if (scopeLabel) {
                  return `No results found for ${scopeLabel}`;
                }
                return 'Enter a search term to find products';
              })()}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                  {minPrice !== null && maxPrice !== null && (
                    <span className="text-xs text-gray-500 ml-2">
                      (${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)})
                    </span>
                  )}
                </label>
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
                      placeholder={minPrice !== null ? `Min: $${minPrice.toFixed(2)}` : "Min"}
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="w-full text-sm"
                      min={minPrice || 0}
                      step="0.01"
                    />
                    <Input
                      type="number"
                      placeholder={maxPrice !== null ? `Max: $${maxPrice.toFixed(2)}` : "Max"}
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="w-full text-sm"
                      max={maxPrice || undefined}
                      step="0.01"
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
            {results.map((result) => {
              // For products, use the enhanced ProductCard
              if (result.resultType === 'product') {
                return (
                  <ProductCard
                    key={`${result.resultType}-${result.id}`}
                    product={result}
                    viewMode={viewMode}
                    showAddToCart={true}
                  />
                );
              }

              // For brands and categories, use the original display
              return (
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
                            className="px-2 py-1 bg-gray-900 text-white text-xs rounded-full"
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
                        {result.resultType === 'brand' ? 'View Brand' : 'View Category'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found for "{searchQuery}"
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters, or check out these suggestions:
            </p>

            {/* Search Suggestions */}
            {loadingSuggestions ? (
              <div className="flex items-center justify-center mb-6">
                <Loader2 className="w-5 h-5 animate-spin mr-2 text-dope-orange-500" />
                <span className="text-sm text-gray-600">Loading suggestions...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Did you mean:</h4>
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.text}-${index}`}
                      onClick={() => {
                        setSearchQuery(suggestion.text);
                        setCurrentPage(1);
                        performSearch(suggestion.text, filters, sortBy, 1);
                        updateURL(suggestion.text, filters);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      {suggestion.type === 'product' && suggestion.image_url ? (
                        <div className="w-4 h-4 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={suggestion.image_url}
                            alt={suggestion.text}
                            width={16}
                            height={16}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dcfce7' }}>
                          {suggestion.type === 'brand' ? (
                            <Tag className="w-3 h-3" style={{ color: '#2d8f47' }} />
                          ) : suggestion.type === 'popular' ? (
                            <Search className="w-3 h-3" style={{ color: '#2d8f47' }} />
                          ) : (
                            <Package className="w-3 h-3" style={{ color: '#2d8f47' }} />
                          )}
                        </div>
                      )}
                      <span>{suggestion.text}</span>
                      {suggestion.count && suggestion.count > 1 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {suggestion.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <button
              onClick={() => {
                const newPage = Math.max(currentPage - 1, 1);
                setCurrentPage(newPage);
                performSearch(searchQuery, filters, sortBy, newPage);
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    performSearch(searchQuery, filters, sortBy, pageNum);
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
              onClick={() => {
                const newPage = Math.min(currentPage + 1, totalPages);
                setCurrentPage(newPage);
                performSearch(searchQuery, filters, sortBy, newPage);
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>


    </div>
  );
}
