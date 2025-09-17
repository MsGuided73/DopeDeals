'use client';

import { useState } from 'react';
import type { PipeProduct } from '../PipesPageContent';

interface PipesFiltersProps {
  filters: {
    priceRange: [number, number];
    brands: string[];
    materials: string[];
    styles: string[];
    sizes: string[];
    categories: string[];
    inStock: boolean;
    onSale: boolean;
    isNew: boolean;
    featured: boolean;
    vipExclusive: boolean;
  };
  setFilters: (filters: any) => void;
  products: PipeProduct[];
}

export default function PipesFilters({ filters, setFilters, products }: PipesFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique values from products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  const uniqueMaterials = [...new Set(products.flatMap(p => p.materials || []).filter(Boolean))].sort();
  const uniqueStyles = [...new Set(products.map(p => p.style).filter(Boolean))].sort();
  const uniqueSizes = [...new Set(products.map(p => p.size).filter(Boolean))].sort();

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 100],
      brands: [],
      materials: [],
      styles: [],
      sizes: [],
      categories: [],
      inStock: false,
      onSale: false,
      isNew: false,
      featured: false,
      vipExclusive: false,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">Filters</span>
          <svg
            className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-dope-orange-500 hover:text-dope-orange-600 font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                  className="px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 100])}
                  className="px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Availability</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked)}
                  className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.onSale}
                  onChange={(e) => updateFilter('onSale', e.target.checked)}
                  className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">On Sale</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.isNew}
                  onChange={(e) => updateFilter('isNew', e.target.checked)}
                  className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New Arrivals</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => updateFilter('featured', e.target.checked)}
                  className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured Products</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.vipExclusive}
                  onChange={(e) => updateFilter('vipExclusive', e.target.checked)}
                  className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">VIP Exclusive</span>
              </label>
            </div>
          </div>

          {/* Pipe Style */}
          {uniqueStyles.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Pipe Style</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uniqueStyles.map(style => (
                  <label key={style} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.styles.includes(style)}
                      onChange={() => toggleArrayFilter('styles', style)}
                      className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{style}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {uniqueMaterials.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Material</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uniqueMaterials.map(material => (
                  <label key={material} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.materials.includes(material)}
                      onChange={() => toggleArrayFilter('materials', material)}
                      className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{material}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {uniqueSizes.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Size</h4>
              <div className="space-y-2">
                {uniqueSizes.map(size => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => toggleArrayFilter('sizes', size)}
                      className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {uniqueBrands.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Brand</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uniqueBrands.map(brand => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleArrayFilter('brands', brand)}
                      className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
