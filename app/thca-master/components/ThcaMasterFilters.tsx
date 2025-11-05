import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { ThcaMasterProduct } from '../ThcaMasterPageContent';

interface ThcaMasterFiltersProps {
  filters: {
    priceRange: number[];
    brands: string[];
    materials: string[];
    types: string[];
    sizes: string[];
    categories: string[];
    cannabinoidTypes: string[];
    inStock: boolean;
    onSale: boolean;
    isNew: boolean;
    featured: boolean;
  };
  setFilters: (filters: any) => void;
  products: ThcaMasterProduct[];
}

export default function ThcaMasterFilters({ filters, setFilters, products }: ThcaMasterFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    cannabinoid: true,
    type: false,
    availability: true,
    features: false,
  });

  // Extract unique values from products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean) as string[])].sort();
  const uniqueTypes = [...new Set(products.map(p => p.type).filter(Boolean) as string[])].sort();
  const uniqueCannabinoidTypes = [...new Set(products.map(p => p.cannabinoid_type).filter(Boolean) as string[])].sort();

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
      priceRange: [0, 300],
      brands: [],
      materials: [],
      types: [],
      sizes: [],
      categories: [],
      cannabinoidTypes: [],
      inStock: false,
      onSale: false,
      isNew: false,
      featured: false,
    });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.types.length > 0 ||
    filters.cannabinoidTypes.length > 0 ||
    filters.inStock ||
    filters.onSale ||
    filters.isNew ||
    filters.featured ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 300;

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
                  priceRange: [filters.priceRange[0], parseInt(e.target.value) || 300]
                })}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cannabinoid Types */}
      {uniqueCannabinoidTypes.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('cannabinoid')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Cannabinoid Type</span>
            {expandedSections.cannabinoid ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.cannabinoid && (
            <div className="mt-3 space-y-2">
              {uniqueCannabinoidTypes.map((cannabinoid) => (
                <label key={cannabinoid} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.cannabinoidTypes.includes(cannabinoid)}
                    onChange={() => handleArrayFilter('cannabinoidTypes', cannabinoid)}
                    className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{cannabinoid}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Types */}
      {uniqueTypes.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('type')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Product Type</span>
            {expandedSections.type ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.type && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
              {uniqueTypes.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={() => handleArrayFilter('types', type)}
                    className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

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

      {/* Availability */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">Availability</span>
          {expandedSections.availability ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.availability && (
          <div className="mt-3 space-y-3">
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
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => setFilters({
                  ...filters,
                  onSale: e.target.checked
                })}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">On Sale</span>
            </label>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">Features</span>
          {expandedSections.features ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.features && (
          <div className="mt-3 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isNew}
                onChange={(e) => setFilters({
                  ...filters,
                  isNew: e.target.checked
                })}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New Products</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => setFilters({
                  ...filters,
                  featured: e.target.checked
                })}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
