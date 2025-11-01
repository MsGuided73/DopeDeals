'use client';

import { MushroomProduct } from '../MushroomsPageContent';

interface MushroomFilters {
  priceRange: [number, number];
  types: string[];
  desiredEffects: string[];
  strengths: string[];
  origins: string[];
  forms: string[];
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
  featured: boolean;
  vipExclusive: boolean;
}

interface MushroomsFiltersProps {
  filters: MushroomFilters;
  setFilters: (filters: MushroomFilters) => void;
  products: MushroomProduct[];
}

// Type guard function for filtering strings
function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export default function MushroomsFilters({ filters, setFilters, products }: MushroomsFiltersProps) {
  // Extract unique values for filter options with proper type narrowing
  const types = [...new Set(products.map(p => p.type).filter(isString))];
  const effects = [...new Set(products.flatMap(p => p.desired_effect || []).filter(isString))];
  const strengths = [...new Set(products.map(p => p.strength).filter(isString))];
  const forms = [...new Set(products.map(p => p.form).filter(isString))];

  const updateFilter = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 200],
      types: [],
      desiredEffects: [],
      strengths: [],
      origins: [],
      forms: [],
      inStock: false,
      onSale: false,
      isNew: false,
      featured: false,
      vipExclusive: false,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-dope-orange-500 hover:text-dope-orange-600"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[1]}
            onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ${filters.priceRange[1]}
          </span>
        </div>
      </div>

      {/* Types */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Mushroom Type</h4>
        <div className="space-y-2">
          {types.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter('types', [...filters.types, type]);
                  } else {
                    updateFilter('types', filters.types.filter(t => t !== type));
                  }
                }}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Desired Effects */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Desired Effect</h4>
        <div className="space-y-2">
          {effects.map(effect => (
            <label key={effect} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.desiredEffects.includes(effect)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter('desiredEffects', [...filters.desiredEffects, effect]);
                  } else {
                    updateFilter('desiredEffects', filters.desiredEffects.filter(e => e !== effect));
                  }
                }}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{effect}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Strength */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Strength</h4>
        <div className="space-y-2">
          {strengths.map(strength => (
            <label key={strength} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.strengths.includes(strength)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter('strengths', [...filters.strengths, strength]);
                  } else {
                    updateFilter('strengths', filters.strengths.filter(s => s !== strength));
                  }
                }}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{strength}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Form</h4>
        <div className="space-y-2">
          {forms.map(form => (
            <label key={form} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.forms.includes(form)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter('forms', [...filters.forms, form]);
                  } else {
                    updateFilter('forms', filters.forms.filter(f => f !== form));
                  }
                }}
                className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{form}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => updateFilter('inStock', e.target.checked)}
            className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => updateFilter('onSale', e.target.checked)}
            className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">On Sale</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => updateFilter('featured', e.target.checked)}
            className="rounded border-gray-300 text-dope-orange-500 focus:ring-dope-orange-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured</span>
        </label>
      </div>
    </div>
  );
}
