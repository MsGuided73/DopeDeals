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
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    style: true,
    material: true,
    size: false,
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
  const uniqueMaterials = [...new Set([
    ...products.map(p => p.material).filter(Boolean) as string[],
    ...products.flatMap(p => p.materials || []).filter(Boolean) as string[],
  ])].sort();
  const uniqueStyles = [...new Set(products.map(p => p.style).filter(Boolean) as string[])].sort();
  const uniqueSizes = [...new Set(products.map(p => p.size).filter(Boolean) as string[])].sort();

  // Per-option product counts so users can see how many pipes match each option.
  const brandCount = (b: string) => products.filter(p => p.brand === b).length;
  const styleCount = (s: string) => products.filter(p => p.style === s).length;
  const sizeCount = (s: string) => products.filter(p => p.size === s).length;
  const materialCount = (m: string) => products.filter(p => p.material === m || (p.materials || []).includes(m)).length;

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

      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-[#1a1a1a] font-medium">
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
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1c352d]"
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
          <CheckboxRow
            label="Featured Products"
            checked={filters.featured}
            onChange={(c) => handleToggleChange('featured', c)}
          />
          <CheckboxRow
            label="VIP Exclusive"
            checked={filters.vipExclusive}
            onChange={(c) => handleToggleChange('vipExclusive', c)}
          />
        </div>
      </FilterSection>

      {/* Type — pipe-specific (spoon, sherlock, hammer, chillum, one-hitter, etc.) */}
      <FilterSection title="Type" sectionKey="style">
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {uniqueStyles.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No type data yet</p>
          ) : (
            uniqueStyles.map(style => (
              <CheckboxRow
                key={style}
                label={style}
                checked={filters.styles.includes(style)}
                onChange={(c) => handleCheckboxChange('styles', style, c)}
                count={styleCount(style)}
              />
            ))
          )}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Material" sectionKey="material">
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {uniqueMaterials.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No material data yet</p>
          ) : (
            uniqueMaterials.map(material => (
              <CheckboxRow
                key={material}
                label={material}
                checked={filters.materials.includes(material)}
                onChange={(c) => handleCheckboxChange('materials', material, c)}
                count={materialCount(material)}
              />
            ))
          )}
        </div>
      </FilterSection>

      {/* Size — pipe-specific (Small / Medium / Large / XL) */}
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
