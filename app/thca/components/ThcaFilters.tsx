'use client';

import { useState } from 'react';
import type { ThcaProduct } from '../ThcaPageContent';

interface ThcaFiltersProps {
  filters: {
    priceRange: [number, number];
    brands: string[];
    subcategories: string[];
    inStock: boolean;
    onSale: boolean;
    isNew: boolean;
    featured: boolean;
  };
  onFiltersChange: (filters: any) => void;
  products: ThcaProduct[];
}

export default function ThcaFilters({ filters, onFiltersChange, products }: ThcaFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    subcategory: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Extract unique values from products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean) as string[])].sort();
  const uniqueSubcategories = [...new Set(products.map(p => p.subcategory).filter(Boolean) as string[])].sort();

  const handleCheckboxChange = (filterType: string, value: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      [filterType]: checked
        ? [...filters[filterType as keyof typeof filters] as string[], value]
        : (filters[filterType as keyof typeof filters] as string[]).filter((item: string) => item !== value)
    });
  };

  const handleToggleChange = (filterType: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      [filterType]: checked
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 300],
      brands: [],
      subcategories: [],
      inStock: false,
      onSale: false,
      isNew: false,
      featured: false,
    });
  };

  const FilterSection = ({
    title,
    sectionKey,
    children
  }: {
    title: string;
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white hover:text-dope-orange-500 transition-colors"
      >
        {title}
        {expandedSections[sectionKey] ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-dope-orange-500 hover:text-dope-orange-600 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            step="10"
            value={filters.priceRange[1]}
            onChange={(e) => onFiltersChange({
              ...filters,
              priceRange: [filters.priceRange[0], parseInt(e.target.value)]
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" sectionKey="availability">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleToggleChange('inStock', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => handleToggleChange('onSale', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">On Sale</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => handleToggleChange('featured', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isNew}
              onChange={(e) => handleToggleChange('isNew', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New Arrivals</span>
          </label>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" sectionKey="brand">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {uniqueBrands.map(brand => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={(e) => handleCheckboxChange('brands', brand, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Subcategory */}
      <FilterSection title="Product Type" sectionKey="subcategory">
        <div className="space-y-2">
          {uniqueSubcategories.map(subcategory => (
            <label key={subcategory} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.subcategories.includes(subcategory)}
                onChange={(e) => handleCheckboxChange('subcategories', subcategory, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{subcategory}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
