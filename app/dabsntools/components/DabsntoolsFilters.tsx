'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DabsntoolsProduct } from '../DabsntoolsPageContent';

interface DabsntoolsFiltersProps {
  filters: {
    priceRange: [number, number];
    brands: string[];
    materials: string[];
    types: string[]; // Glass Rigs, E-Rigs, Portable, Tools, Accessories
    sizes: string[];
    categories: string[];
    inStock: boolean;
    onSale: boolean;
    isNew: boolean;
  };
  setFilters: (filters: any) => void;
  products: DabsntoolsProduct[];
}

export default function DabsntoolsFilters({ filters, setFilters, products }: DabsntoolsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique values from products
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort();
  const types = Array.from(new Set(products.map(p => p.type).filter(Boolean))).sort();
  const sizes = Array.from(new Set(products.map(p => p.size).filter(Boolean))).sort();

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters({ ...filters, priceRange: [min, max] as [number, number] });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: newBrands });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters({ ...filters, types: newTypes });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    setFilters({ ...filters, sizes: newSizes });
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 300],
      brands: [],
      materials: [],
      types: [],
      sizes: [],
      categories: [],
      inStock: false,
      onSale: false,
      isNew: false,
    });
  };

  const activeFiltersCount =
    filters.brands.length +
    filters.types.length +
    filters.sizes.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.isNew ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 300 ? 1 : 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-dope-orange-600 hover:text-dope-orange-700 font-medium"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange[0] === 0 ? '' : filters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange(Number(e.target.value) || 0, filters.priceRange[1])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-dope-orange-500 focus:outline-none"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange[1] === 300 ? '' : filters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value) || 300)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-dope-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Equipment Type */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Equipment Type</h4>
        <div className="space-y-2">
          {types.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={() => handleTypeToggle(type)}
                className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}

          {/* Add default equipment types if none are available yet */}
          {types.length === 0 && (
            <>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.types.includes('Glass Rigs')}
                  onChange={() => handleTypeToggle('Glass Rigs')}
                  className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Glass Rigs</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.types.includes('E-Rigs')}
                  onChange={() => handleTypeToggle('E-Rigs')}
                  className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">E-Rigs</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.types.includes('Portable')}
                  onChange={() => handleTypeToggle('Portable')}
                  className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Portable</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.types.includes('Tools')}
                  onChange={() => handleTypeToggle('Tools')}
                  className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Tools</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3"
          >
            Brands
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <div className={`space-y-2 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Size</h4>
        <div className="space-y-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={() => handleSizeToggle(size)}
                className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Quick Filters</h4>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
            className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">In Stock</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => setFilters({ ...filters, onSale: e.target.checked })}
            className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">On Sale</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isNew}
            onChange={(e) => setFilters({ ...filters, isNew: e.target.checked })}
            className="mr-2 h-4 w-4 text-dope-orange-600 focus:ring-dope-orange-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">New Arrivals</span>
        </label>
      </div>
    </div>
  );
}
