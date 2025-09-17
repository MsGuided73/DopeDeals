'use client';

interface ActiveFiltersProps {
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
  totalProducts: number;
}

export default function ActiveFilters({ filters, setFilters, totalProducts }: ActiveFiltersProps) {
  const removeFilter = (filterType: string, value?: string) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'priceRange':
        newFilters.priceRange = [0, 100];
        break;
      case 'inStock':
        newFilters.inStock = false;
        break;
      case 'onSale':
        newFilters.onSale = false;
        break;
      case 'isNew':
        newFilters.isNew = false;
        break;
      case 'featured':
        newFilters.featured = false;
        break;
      case 'vipExclusive':
        newFilters.vipExclusive = false;
        break;
      default:
        if (value && Array.isArray(newFilters[filterType as keyof typeof newFilters])) {
          (newFilters[filterType as keyof typeof newFilters] as string[]) = 
            (newFilters[filterType as keyof typeof newFilters] as string[]).filter(item => item !== value);
        }
    }
    
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 100],
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

  const hasActiveFilters = 
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ||
    filters.brands.length > 0 ||
    filters.materials.length > 0 ||
    filters.styles.length > 0 ||
    filters.sizes.length > 0 ||
    filters.categories.length > 0 ||
    filters.inStock ||
    filters.onSale ||
    filters.isNew ||
    filters.featured ||
    filters.vipExclusive;

  if (!hasActiveFilters) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active Filters ({totalProducts} products):
          </span>
          
          {/* Price Range Filter */}
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-dope-orange-100 text-dope-orange-800 dark:bg-dope-orange-900 dark:text-dope-orange-200">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
              <button
                onClick={() => removeFilter('priceRange')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-dope-orange-200 dark:hover:bg-dope-orange-800"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {/* Boolean Filters */}
          {filters.inStock && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              In Stock
              <button
                onClick={() => removeFilter('inStock')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.onSale && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              On Sale
              <button
                onClick={() => removeFilter('onSale')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-red-200 dark:hover:bg-red-800"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.isNew && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              New Arrivals
              <button
                onClick={() => removeFilter('isNew')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.featured && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Featured
              <button
                onClick={() => removeFilter('featured')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.vipExclusive && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              VIP Exclusive
              <button
                onClick={() => removeFilter('vipExclusive')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {/* Array Filters */}
          {[...filters.brands, ...filters.materials, ...filters.styles, ...filters.sizes, ...filters.categories].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {item}
              <button
                onClick={() => {
                  if (filters.brands.includes(item)) removeFilter('brands', item);
                  else if (filters.materials.includes(item)) removeFilter('materials', item);
                  else if (filters.styles.includes(item)) removeFilter('styles', item);
                  else if (filters.sizes.includes(item)) removeFilter('sizes', item);
                  else if (filters.categories.includes(item)) removeFilter('categories', item);
                }}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}

          {/* Clear All Button */}
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            Clear All
            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
