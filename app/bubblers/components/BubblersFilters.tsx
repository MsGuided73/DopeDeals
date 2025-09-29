import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { BubblerProduct } from '../BubblersPageContent';

interface BubblersFiltersProps {
  filters: {
    priceRange: number[];
    brands: string[];
    materials: string[];
    heights: string[];
    jointSizes: string[];
    percolators: string[];
    categories: string[];
    inStock: boolean;
  };
  setFilters: (filters: any) => void;
  products: BubblerProduct[];
}

export default function BubblersFilters({ filters, setFilters, products }: BubblersFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    material: false,
    height: false,
    joint: false,
    percolator: false,
    stock: true,
  });

  // Extract unique values from products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean) as string[])].sort();
  const uniqueMaterials = [...new Set(products.map(p => p.material).filter(Boolean) as string[])].sort();
  const uniqueHeights = [...new Set(products.map(p => p.height).filter(Boolean) as string[])].sort();
  const uniqueJointSizes = [...new Set(products.map(p => p.joint_size).filter(Boolean))].sort();
  const uniquePercolators = [...new Set(products.map(p => p.percolator).filter(Boolean))].sort();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFilters({
      ...filters,
      [key]: newArray
    });
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 500],
      brands: [],
      materials: [],
      heights: [],
      jointSizes: [],
      percolators: [],
      categories: [],
      inStock: false,
    });
  };

  const hasActiveFilters = 
    filters.brands.length > 0 ||
    filters.materials.length > 0 ||
    filters.heights.length > 0 ||
    filters.jointSizes.length > 0 ||
    filters.percolators.length > 0 ||
    filters.inStock ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-dope-orange-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-dope-orange-500 hover:text-dope-orange-600 font-medium flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-3">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                })}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-gray-100"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value) || 500]
                })}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('stock')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">Availability</span>
          {expandedSections.stock ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.stock && (
          <div className="mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({
                  ...filters,
                  inStock: e.target.checked
                })}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Brands */}
      {uniqueBrands.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Brand</span>
            {expandedSections.brand ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.brand && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
              {uniqueBrands.map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleArrayFilter('brands', brand)}
                    className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materials */}
      {uniqueMaterials.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('material')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Material</span>
            {expandedSections.material ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.material && (
            <div className="mt-3 space-y-2">
              {uniqueMaterials.map((material) => (
                <label key={material} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.materials.includes(material)}
                    onChange={() => handleArrayFilter('materials', material)}
                    className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{material}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Heights */}
      {uniqueHeights.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('height')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Height</span>
            {expandedSections.height ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.height && (
            <div className="mt-3 space-y-2">
              {uniqueHeights.map((height) => (
                <label key={height} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.heights.includes(height)}
                    onChange={() => handleArrayFilter('heights', height)}
                    className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{height}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
