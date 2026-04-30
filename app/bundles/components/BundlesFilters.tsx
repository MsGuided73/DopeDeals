'use client';

import { useState } from 'react';
import type { BundleProduct } from '../BundlesPageContent';

interface BundlesFiltersProps {
  filters: {
    priceRange: [number, number];
    brands: string[];
    bundleTypes: string[];
    savings: string[];
    inStock: boolean;
    onSale: boolean;
    isNew: boolean;
    featured: boolean;
  };
  setFilters: (filters: any) => void;
  products: BundleProduct[];
}

// Savings buckets — derived per-product from compare_at_price vs current price.
const SAVINGS_BUCKETS: Array<{ label: string; min: number }> = [
  { label: '10%+ off', min: 10 },
  { label: '20%+ off', min: 20 },
  { label: '30%+ off', min: 30 },
];

const computeSavings = (p: BundleProduct): number => {
  const price = p.price ?? 0;
  const compare = p.compare_at_price ?? 0;
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
};

export default function BundlesFilters({ filters, setFilters, products }: BundlesFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: false,
    availability: false,
    bundleType: false,
    savings: false,
    brand: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Extract unique values from products
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean) as string[])].sort();
  const uniqueBundleTypes = [...new Set(products.map(p => p.bundleType).filter(Boolean) as string[])].sort();

  // Actual catalog price bounds — used as the default min/max in the
  // price inputs and as the reset target for "Clear All".
  const catalogPrices = products
    .map(p => p.price ?? 0)
    .filter(n => Number.isFinite(n) && n > 0);
  const dataMinPrice = catalogPrices.length > 0 ? Math.floor(Math.min(...catalogPrices)) : 0;
  const dataMaxPrice = catalogPrices.length > 0 ? Math.ceil(Math.max(...catalogPrices)) : 1000;

  // Per-option product counts
  const brandCount = (b: string) => products.filter(p => p.brand === b).length;
  const bundleTypeCount = (t: string) => products.filter(p => p.bundleType === t).length;
  const savingsCount = (minPct: number) => products.filter(p => computeSavings(p) >= minPct).length;

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
      bundleTypes: [],
      savings: [],
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
          <CheckboxRow
            label="Featured Bundles"
            checked={filters.featured}
            onChange={(c) => handleToggleChange('featured', c)}
          />
        </div>
      </FilterSection>

      {/* Bundle Type — derived from the product name (Glass / Vape / Flower / Starter) */}
      <FilterSection title="Bundle Type" sectionKey="bundleType">
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {uniqueBundleTypes.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No bundle-type data yet</p>
          ) : (
            uniqueBundleTypes.map(type => (
              <CheckboxRow
                key={type}
                label={type}
                checked={filters.bundleTypes.includes(type)}
                onChange={(c) => handleCheckboxChange('bundleTypes', type, c)}
                count={bundleTypeCount(type)}
              />
            ))
          )}
        </div>
      </FilterSection>

      {/* Savings — % off vs. compare_at_price. Only render buckets that match
          at least one product. */}
      <FilterSection title="Savings" sectionKey="savings">
        <div className="space-y-3">
          {SAVINGS_BUCKETS.filter(b => savingsCount(b.min) > 0).length === 0 ? (
            <p className="text-xs text-gray-400 italic">No discount data yet</p>
          ) : (
            SAVINGS_BUCKETS.filter(b => savingsCount(b.min) > 0).map(bucket => (
              <CheckboxRow
                key={bucket.label}
                label={bucket.label}
                checked={filters.savings.includes(bucket.label)}
                onChange={(c) => handleCheckboxChange('savings', bucket.label, c)}
                count={savingsCount(bucket.min)}
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
