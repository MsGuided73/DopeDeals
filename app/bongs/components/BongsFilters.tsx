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
    onSale: boolean;
    isNew: boolean;
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
    percolator: true,
    category: false,
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
  const uniqueMaterials = [...new Set(products.map(p => p.material).filter(Boolean) as string[])].sort();
  const uniqueHeights = [...new Set(products.map(p => p.height).filter(Boolean) as string[])].sort();
  const uniqueJointSizes = [...new Set(products.map(p => p.jointSize).filter(Boolean) as string[])].sort();
  const uniquePercolators = [...new Set(products.map(p => p.percolator).filter(Boolean) as string[])].sort();

  // Actual catalog price bounds — used as the default min/max in the
  // price inputs and as the reset target for "Clear All".
  const catalogPrices = products
    .map(p => p.our_price ?? p.price ?? 0)
    .filter(n => Number.isFinite(n) && n > 0);
  const dataMinPrice = catalogPrices.length > 0 ? Math.floor(Math.min(...catalogPrices)) : 0;
  const dataMaxPrice = catalogPrices.length > 0 ? Math.ceil(Math.max(...catalogPrices)) : 1000;

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
      priceRange: [dataMinPrice, dataMaxPrice],
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
    <div className="border-b border-gray-100 pb-5 mb-5">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-bold text-[#1a1a1a] hover:text-[#2d8f47] transition-colors"
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
        <div className="mt-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 sticky top-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black tracking-widest text-[#1a1a1a] uppercase">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-[#1a1a1a] font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Price Range — defaults to the actual lowest/highest price in the catalog. */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder={`${dataMinPrice}`}
            value={filters.priceRange[0]}
            onChange={(e) => {
              const raw = e.target.value;
              const v = raw === '' ? dataMinPrice : parseInt(raw, 10);
              setFilters((prev: any) => ({
                ...prev,
                priceRange: [Number.isNaN(v) ? dataMinPrice : v, prev.priceRange[1]],
              }));
            }}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#2d8f47] focus:ring-1 focus:ring-[#2d8f47]"
          />
          <span className="text-gray-400" aria-hidden="true">–</span>
          <input
            type="number"
            min={0}
            placeholder={`${dataMaxPrice}`}
            value={filters.priceRange[1]}
            onChange={(e) => {
              const raw = e.target.value;
              const v = raw === '' ? dataMaxPrice : parseInt(raw, 10);
              setFilters((prev: any) => ({
                ...prev,
                priceRange: [prev.priceRange[0], Number.isNaN(v) ? dataMaxPrice : v],
              }));
            }}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#2d8f47] focus:ring-1 focus:ring-[#2d8f47]"
          />
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" sectionKey="availability">
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleToggleChange('inStock', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d]"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a]">In Stock Only</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => handleToggleChange('onSale', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d]"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a]">On Sale</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.isNew}
              onChange={(e) => handleToggleChange('isNew', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d]"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a]">New Arrivals</span>
          </label>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" sectionKey="brand">
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {uniqueBrands.map(brand => (
            <label key={brand} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={(e) => handleCheckboxChange('brands', brand, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d]"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a]">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Percolator */}
      <FilterSection title="Perc Type" sectionKey="percolator">
        <div className="space-y-3">
          {uniquePercolators.map(perc => (
            <label key={perc} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.percolators.includes(perc)}
                onChange={(e) => handleCheckboxChange('percolators', perc, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d]"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a]">{perc}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material" sectionKey="material">
        <div className="space-y-3">
          {uniqueMaterials.map(material => (
            <label key={material} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={(e) => handleCheckboxChange('materials', material, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d]"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a]">{material}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Height */}
      <FilterSection title="Height" sectionKey="height">
        <div className="space-y-3">
          {uniqueHeights.map(height => (
            <label key={height} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.heights.includes(height)}
                onChange={(e) => handleCheckboxChange('heights', height, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d]"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a]">{height}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Joint Size */}
      <FilterSection title="Joint Size" sectionKey="joint">
        <div className="space-y-3">
          {uniqueJointSizes.map(size => (
            <label key={size} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.jointSizes.includes(size)}
                onChange={(e) => handleCheckboxChange('jointSizes', size, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d]"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a]">{size}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
