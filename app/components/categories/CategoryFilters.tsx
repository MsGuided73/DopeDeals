"use client";
import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryFiltersProps {
  categoryId?: string;
  categoryName: string;
  onFiltersChange: (filters: Record<string, any>) => void;
  className?: string;
}

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  min?: number;
  max?: number;
}

export default function CategoryFilters({
  categoryId,
  categoryName,
  onFiltersChange,
  className = ""
}: CategoryFiltersProps) {

  // Filter state
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [showDiscounts, setShowDiscounts] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['brand']));

  // Mock filter options (would come from API in production)
  const [brands, setBrands] = useState<FilterOption[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    // Mock API call for brands (replace with real API call)
    const fetchBrands = async () => {
      setLoadingBrands(true);
      // Simulate API delay
      setTimeout(() => {
        setBrands([
          { id: 'blazed', label: 'Blazed', count: 24 },
          { id: 'highway420', label: 'HIGHWAY 420', count: 18 },
          { id: 'gravity', label: 'Gravity', count: 12 },
          { id: 'piece-keeper', label: 'Piece Keeper', count: 8 },
          { id: 'other', label: 'Other Brands', count: 15 }
        ]);
        setLoadingBrands(false);
      }, 500);
    };

    fetchBrands();
  }, [categoryId]);

  // Update filters when any filter changes
  useEffect(() => {
    const filters: Record<string, any> = {};

    if (brandFilter !== 'all') {
      filters.brand_id = brandFilter;
    }

    if (priceRange.min) {
      filters.price_min = parseFloat(priceRange.min);
    }

    if (priceRange.max) {
      filters.price_max = parseFloat(priceRange.max);
    }

    if (showInStock) {
      filters.in_stock = true;
    }

    if (showDiscounts) {
      filters.on_sale = true;
    }

    filters.sort = sortBy;

    onFiltersChange(filters);
  }, [brandFilter, priceRange, sortBy, showInStock, showDiscounts, onFiltersChange]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const clearAllFilters = () => {
    setBrandFilter('all');
    setPriceRange({ min: '', max: '' });
    setShowInStock(false);
    setShowDiscounts(false);
    setSortBy('featured');
  };

  const hasActiveFilters = brandFilter !== 'all' || priceRange.min || priceRange.max || showInStock || showDiscounts;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-bold text-gray-900">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-gray-100">

        {/* Brand Filter */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-medium text-gray-900">Brand</span>
            {expandedSections.has('brand') ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {expandedSections.has('brand') && (
            <div className="mt-3 space-y-2">
              {loadingBrands ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-5 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="brand"
                      value="all"
                      checked={brandFilter === 'all'}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="w-4 h-4 text-dope-orange-600 border-gray-300 focus:ring-dope-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Brands</span>
                  </label>

                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand.id}
                        checked={brandFilter === brand.id}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="w-4 h-4 text-dope-orange-600 border-gray-300 focus:ring-dope-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex-1">{brand.label}</span>
                      <span className="text-xs text-gray-500">({brand.count})</span>
                    </label>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-medium text-gray-900">Price Range</span>
            {expandedSections.has('price') ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {expandedSections.has('price') && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Min</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-dope-orange-500 focus:border-dope-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="500"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-dope-orange-500 focus:border-dope-orange-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Availability Filter */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('availability')}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-medium text-gray-900">Availability</span>
            {expandedSections.has('availability') ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {expandedSections.has('availability') && (
            <div className="mt-3 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showInStock}
                  onChange={(e) => setShowInStock(e.target.checked)}
                  className="w-4 h-4 text-dope-orange-600 border-gray-300 rounded focus:ring-dope-orange-500"
                />
                <span className="ml-3 text-sm text-gray-700">In Stock Only</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showDiscounts}
                  onChange={(e) => setShowDiscounts(e.target.checked)}
                  className="w-4 h-4 text-dope-orange-600 border-gray-300 rounded focus:ring-dope-orange-500"
                />
                <span className="ml-3 text-sm text-gray-700">On Sale</span>
              </label>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('sort')}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-medium text-gray-900">Sort By</span>
            {expandedSections.has('sort') ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {expandedSections.has('sort') && (
            <div className="mt-3 space-y-2">
              {[
                { value: 'featured', label: 'Featured First' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'newest', label: 'Newest First' },
                { value: 'name-asc', label: 'Name: A to Z' },
                { value: 'name-desc', label: 'Name: Z to A' },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-4 h-4 text-dope-orange-600 border-gray-300 focus:ring-dope-orange-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {brandFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-dope-orange-100 text-dope-orange-800">
                {brands.find(b => b.id === brandFilter)?.label || brandFilter}
                <button
                  onClick={() => setBrandFilter('all')}
                  className="ml-1 text-dope-orange-600 hover:text-dope-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange.min && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-dope-orange-100 text-dope-orange-800">
                Min: ${priceRange.min}
                <button
                  onClick={() => setPriceRange(prev => ({ ...prev, min: '' }))}
                  className="ml-1 text-dope-orange-600 hover:text-dope-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange.max && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-dope-orange-100 text-dope-orange-800">
                Max: ${priceRange.max}
                <button
                  onClick={() => setPriceRange(prev => ({ ...prev, max: '' }))}
                  className="ml-1 text-dope-orange-600 hover:text-dope-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {showInStock && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-dope-orange-100 text-dope-orange-800">
                In Stock
                <button
                  onClick={() => setShowInStock(false)}
                  className="ml-1 text-dope-orange-600 hover:text-dope-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {showDiscounts && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-dope-orange-100 text-dope-orange-800">
                On Sale
                <button
                  onClick={() => setShowDiscounts(false)}
                  className="ml-1 text-dope-orange-600 hover:text-dope-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
