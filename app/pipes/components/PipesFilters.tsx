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

const AccordionSection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-sm font-semibold text-gray-900 dark:text-white hover:text-dope-orange-500 transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="pb-4 animate-in slide-in-from-top-1 fade-in duration-200">{children}</div>}
    </div>
  );
};

const CustomCheckbox = ({ checked, onChange, label, count }: { checked: boolean, onChange: () => void, label: string, count?: number }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <div className="flex items-center min-w-0">
      <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md checked:bg-dope-orange-500 checked:border-dope-orange-500 focus:outline-none focus:ring-2 focus:ring-dope-orange-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-all cursor-pointer"
        />
        <svg
          className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="ml-3 text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white truncate">
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
        {count}
      </span>
    )}
  </label>
);

export default function PipesFilters({ filters, setFilters, products }: PipesFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Extract unique values from products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean) as string[])].sort();
  const uniqueMaterials = [...new Set(products.flatMap(p => p.materials || []).filter(Boolean) as string[])].sort();
  const uniqueStyles = [...new Set(products.map(p => p.style).filter(Boolean) as string[])].sort();
  const uniqueSizes = [...new Set(products.map(p => p.size).filter(Boolean) as string[])].sort();

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
      priceRange: [0, 1000], // Increased default max to handle expensive items
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

  // Count active filters
  const activeFiltersCount = 
    filters.brands.length + 
    filters.materials.length + 
    filters.styles.length + 
    filters.sizes.length + 
    (filters.inStock ? 1 : 0) + 
    (filters.onSale ? 1 : 0) + 
    (filters.isNew ? 1 : 0) + 
    (filters.featured ? 1 : 0) + 
    (filters.vipExclusive ? 1 : 0);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform ${isMobileOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`${isMobileOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Filters</h3>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-dope-orange-500 hover:text-dope-orange-600 uppercase tracking-wider"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="p-5">
          {/* Price Range */}
          <AccordionSection title="Price Range" defaultOpen={true}>
            <div className="pt-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-dope-orange-500 focus:border-dope-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow"
                    placeholder="Min"
                  />
                </div>
                <span className="text-gray-400 font-medium">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000])}
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-dope-orange-500 focus:border-dope-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-shadow"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-6">
                <div 
                  className="absolute h-full bg-dope-orange-500 rounded-full"
                  style={{ 
                    left: `${Math.min(100, Math.max(0, (filters.priceRange[0] / 1000) * 100))}%`, 
                    right: `${100 - Math.min(100, Math.max(0, (filters.priceRange[1] / 1000) * 100))}%` 
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [Math.min(parseInt(e.target.value), filters.priceRange[1]), filters.priceRange[1]])}
                  className="absolute top-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-dope-orange-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Math.max(parseInt(e.target.value), filters.priceRange[0])])}
                  className="absolute top-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-dope-orange-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                />
              </div>
            </div>
          </AccordionSection>

          {/* Availability */}
          <AccordionSection title="Availability" defaultOpen={true}>
            <div className="space-y-3 pt-1">
              <CustomCheckbox
                label="In Stock Only"
                checked={filters.inStock}
                onChange={() => updateFilter('inStock', !filters.inStock)}
              />
              <CustomCheckbox
                label="On Sale"
                checked={filters.onSale}
                onChange={() => updateFilter('onSale', !filters.onSale)}
              />
              <CustomCheckbox
                label="New Arrivals"
                checked={filters.isNew}
                onChange={() => updateFilter('isNew', !filters.isNew)}
              />
              <CustomCheckbox
                label="Featured Products"
                checked={filters.featured}
                onChange={() => updateFilter('featured', !filters.featured)}
              />
              <CustomCheckbox
                label="VIP Exclusive"
                checked={filters.vipExclusive}
                onChange={() => updateFilter('vipExclusive', !filters.vipExclusive)}
              />
            </div>
          </AccordionSection>

          {/* Pipe Style */}
          {uniqueStyles.length > 0 && (
            <AccordionSection title="Style">
              <div className="space-y-3 pt-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueStyles.map(style => (
                  <CustomCheckbox
                    key={style}
                    label={style}
                    checked={filters.styles.includes(style)}
                    onChange={() => toggleArrayFilter('styles', style)}
                    count={products.filter(p => p.style === style).length}
                  />
                ))}
              </div>
            </AccordionSection>
          )}

          {/* Materials */}
          {uniqueMaterials.length > 0 && (
            <AccordionSection title="Material">
              <div className="space-y-3 pt-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueMaterials.map(material => (
                  <CustomCheckbox
                    key={material}
                    label={material}
                    checked={filters.materials.includes(material)}
                    onChange={() => toggleArrayFilter('materials', material)}
                    count={products.filter(p => (p.materials || []).includes(material) || p.material === material).length}
                  />
                ))}
              </div>
            </AccordionSection>
          )}

          {/* Size */}
          {uniqueSizes.length > 0 && (
            <AccordionSection title="Size">
              <div className="space-y-3 pt-1">
                {uniqueSizes.map(size => (
                  <CustomCheckbox
                    key={size}
                    label={size}
                    checked={filters.sizes.includes(size)}
                    onChange={() => toggleArrayFilter('sizes', size)}
                    count={products.filter(p => p.size === size).length}
                  />
                ))}
              </div>
            </AccordionSection>
          )}

          {/* Brands */}
          {uniqueBrands.length > 0 && (
            <AccordionSection title="Brand">
              <div className="space-y-3 pt-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueBrands.map(brand => (
                  <CustomCheckbox
                    key={brand}
                    label={brand}
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleArrayFilter('brands', brand)}
                    count={products.filter(p => p.brand === brand).length}
                  />
                ))}
              </div>
            </AccordionSection>
          )}
        </div>
      </div>
      
      {/* Mobile Sticky Footer */}
      {isMobileOpen && activeFiltersCount > 0 && (
        <div className="lg:hidden sticky bottom-0 left-0 w-full p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <button
            onClick={clearAllFilters}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
