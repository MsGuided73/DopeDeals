'use client';

import { useState } from 'react';
import type { DabsntoolsProduct } from '../DabsntoolsPageContent';

interface DabsntoolsFiltersProps {
  filters: {
    priceRange: [number, number];
    brands: string[];
    materials: string[];
    equipmentTypes: string[]; // Glass Rigs / E-Rigs / Portable / Tools
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
  const [expandedSections, setExpandedSections] = useState({
    price: false,
    brand: false,
    type: false,
    size: false,
    availability: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Extract unique values from products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean) as string[])].sort();
  const uniqueTypes = [...new Set(products.map(p => p.type).filter(Boolean) as string[])].sort();
  const uniqueSizes = [...new Set(products.map(p => p.size).filter(Boolean) as string[])].sort();

  // Actual catalog price bounds — used as the default min/max in the
  // price inputs and as the reset target for "Clear All".
  const catalogPrices = products
    .map(p => p.our_price ?? p.price ?? 0)
    .filter(n => Number.isFinite(n) && n > 0);
  const dataMinPrice = catalogPrices.length > 0 ? Math.floor(Math.min(...catalogPrices)) : 0;
  const dataMaxPrice = catalogPrices.length > 0 ? Math.ceil(Math.max(...catalogPrices)) : 300;

  // Per-option product counts
  const brandCount = (b: string) => products.filter(p => p.brand === b).length;
  const typeCount = (t: string) => products.filter(p => p.type === t).length;
  const sizeCount = (s: string) => products.filter(p => p.size === s).length;

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
      equipmentTypes: [],
      sizes: [],
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

  const CheckboxRow = ({
    label,
    checked,
    onChange,
    count,
  }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    count?: number;
  }) => (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center min-w-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-[#1c352d] focus:ring-[#1c352d] flex-shrink-0"
        />
        <span className="ml-3 text-sm text-gray-700 group-hover:text-[#1a1a1a] truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{count}</span>
      )}
    </label>
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
          <CheckboxRow
            label="In Stock Only"
            checked={filters.inStock}
            onChange={(c) => handleToggleChange('inStock', c)}
          />
          <CheckboxRow
            label="On Sale"
            checked={filters.onSale}
            onChange={(c) => handleToggleChange('onSale', c)}
          />
          <CheckboxRow
            label="New Arrivals"
            checked={filters.isNew}
            onChange={(c) => handleToggleChange('isNew', c)}
          />
        </div>
      </FilterSection>

      {/* Equipment Type — Glass Rigs / E-Rigs / Portable / Tools */}
      <FilterSection title="Type" sectionKey="type">
        <div className="space-y-3">
          {uniqueTypes.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No type data yet</p>
          ) : (
            uniqueTypes.map(type => (
              <CheckboxRow
                key={type}
                label={type}
                checked={filters.equipmentTypes.includes(type)}
                onChange={(c) => handleCheckboxChange('equipmentTypes', type, c)}
                count={typeCount(type)}
              />
            ))
          )}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size" sectionKey="size">
        <div className="space-y-3">
          {uniqueSizes.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No size data yet</p>
          ) : (
            uniqueSizes.map(size => (
              <CheckboxRow
                key={size}
                label={size}
                checked={filters.sizes.includes(size)}
                onChange={(c) => handleCheckboxChange('sizes', size, c)}
                count={sizeCount(size)}
              />
            ))
          )}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" sectionKey="brand">
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {uniqueBrands.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No brand data yet</p>
          ) : (
            uniqueBrands.map(brand => (
              <CheckboxRow
                key={brand}
                label={brand}
                checked={filters.brands.includes(brand)}
                onChange={(c) => handleCheckboxChange('brands', brand, c)}
                count={brandCount(brand)}
              />
            ))
          )}
        </div>
      </FilterSection>
    </div>
  );
}
