'use client';

interface ActiveFiltersProps {
  filters: {
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
  };
  setFilters: (filters: any) => void;
  totalProducts: number;
}

export default function ActiveFilters({ filters, setFilters, totalProducts }: ActiveFiltersProps) {
  const activeFiltersCount =
    filters.types.length +
    filters.desiredEffects.length +
    filters.strengths.length +
    filters.forms.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.isNew ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.vipExclusive ? 1 : 0);

  if (activeFiltersCount === 0) {
    return null;
  }

  const removeFilter = (filterType: string, value: string) => {
    if (filterType === 'types') {
      setFilters({
        ...filters,
        types: filters.types.filter(t => t !== value)
      });
    } else if (filterType === 'desiredEffects') {
      setFilters({
        ...filters,
        desiredEffects: filters.desiredEffects.filter(e => e !== value)
      });
    } else if (filterType === 'strengths') {
      setFilters({
        ...filters,
        strengths: filters.strengths.filter(s => s !== value)
      });
    } else if (filterType === 'forms') {
      setFilters({
        ...filters,
        forms: filters.forms.filter(f => f !== value)
      });
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Active Filters:
        </span>

        {filters.types.map(type => (
          <span
            key={type}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full"
          >
            {type}
            <button
              onClick={() => removeFilter('types', type)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        ))}

        {filters.desiredEffects.map(effect => (
          <span
            key={effect}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full"
          >
            {effect}
            <button
              onClick={() => removeFilter('desiredEffects', effect)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        ))}

        {filters.strengths.map(strength => (
          <span
            key={strength}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full"
          >
            {strength}
            <button
              onClick={() => removeFilter('strengths', strength)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        ))}

        {filters.forms.map(form => (
          <span
            key={form}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full"
          >
            {form}
            <button
              onClick={() => removeFilter('forms', form)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        ))}

        {filters.inStock && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">
            In Stock
            <button
              onClick={() => setFilters({ ...filters, inStock: false })}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        )}

        {filters.onSale && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">
            On Sale
            <button
              onClick={() => setFilters({ ...filters, onSale: false })}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        )}

        <span className="text-sm text-blue-700 dark:text-blue-300">
          ({totalProducts} products)
        </span>
      </div>
    </div>
  );
}
