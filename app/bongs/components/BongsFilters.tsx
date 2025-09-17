'use client';

import { useState } from 'react';
import type { BongProduct } from '../BongsPageContent';

interface BongsFiltersProps {
  filters: {
    priceRange: [number, number];
    brands: string[];
    materials: string[];
    heights: string[];
    jointSizes: string[];
    percolators: string[];
    categories: string[];
    inStock: boolean;
  };
  setFilters: (filters: any) => void;
  products: BongProduct[];
}

export default function BongsFilters({ filters, setFilters, products }: BongsFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    material: true,
    height: false,
    joint: false,
    percolator: false,
    category: false,
    availability: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Extract unique values from products (updated for Supabase data structure)
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  const uniqueMaterials = [...new Set(products.map(p => p.material).filter(Boolean))].sort();
  const uniqueHeights = [...new Set(products.map(p => p.height).filter(Boolean))].sort();
  const uniqueJointSizes = [...new Set(products.map(p => p.joint_size).filter(Boolean))].sort();
  const uniquePercolators = [...new Set(products.map(p => p.percolator).filter(Boolean))].sort();
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();

  const handleCheckboxChange = (filterType: string, value: string, checked: boolean) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter((item: string) => item !== value)
    }));
  };

  const handleToggleChange = (filterType: string, checked: boolean) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterType]: checked
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      brands: [],
      materials: [],
      heights: [],
      jointSizes: [],
      percolators: [],
      categories: [],
      inStock: false,
      onSale: false,
      isNew: false,
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
            max="1000"
            step="10"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters((prev: any) => ({
              ...prev,
              priceRange: [prev.priceRange[0], parseInt(e.target.value)]
            }))}
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
              className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => handleToggleChange('onSale', e.target.checked)}
              className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">On Sale</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isNew}
              onChange={(e) => handleToggleChange('isNew', e.target.checked)}
              className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
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
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material" sectionKey="material">
        <div className="space-y-2">
          {uniqueMaterials.map(material => (
            <label key={material} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={(e) => handleCheckboxChange('materials', material, e.target.checked)}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{material}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Height */}
      <FilterSection title="Height" sectionKey="height">
        <div className="space-y-2">
          {uniqueHeights.map(height => (
            <label key={height} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.heights.includes(height)}
                onChange={(e) => handleCheckboxChange('heights', height, e.target.checked)}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{height}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Joint Size */}
      <FilterSection title="Joint Size" sectionKey="joint">
        <div className="space-y-2">
          {uniqueJointSizes.map(size => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.jointSizes.includes(size)}
                onChange={(e) => handleCheckboxChange('jointSizes', size, e.target.checked)}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{size}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Percolator */}
      <FilterSection title="Percolator Type" sectionKey="percolator">
        <div className="space-y-2">
          {uniquePercolators.map(perc => (
            <label key={perc} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.percolators.includes(perc)}
                onChange={(e) => handleCheckboxChange('percolators', perc, e.target.checked)}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{perc}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" sectionKey="category">
        <div className="space-y-2">
          {uniqueCategories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => handleCheckboxChange('categories', category, e.target.checked)}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
