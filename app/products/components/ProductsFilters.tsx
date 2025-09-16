import { useState } from 'react';
import { Product } from '../ProductsPageContent';

interface ProductsFiltersProps {
  filters: {
    priceRange: number[];
    brands: string[];
    categories: string[];
    materials: string[];
    inStock: boolean;
    onSale: boolean;
    newArrivals: boolean;
  };
  onFiltersChange: (filters: any) => void;
  products: Product[];
}

export default function ProductsFilters({ filters, onFiltersChange, products }: ProductsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique values from products
  const uniqueBrands = [...new Set(products.map(p => p.brand))].sort();
  const uniqueCategories = [...new Set(products.map(p => p.category))].sort();
  const uniqueMaterials = [...new Set(products.map(p => p.material).filter(Boolean))].sort();

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleMaterialToggle = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter(m => m !== material)
      : [...filters.materials, material];
    onFiltersChange({ ...filters, materials: newMaterials });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 500],
      brands: [],
      categories: [],
      materials: [],
      inStock: false,
      onSale: false,
      newArrivals: false,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="font-medium text-gray-900">Filters</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-6 space-y-6`}>
        {/* Clear Filters */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            onClick={clearAllFilters}
            className="text-sm text-dope-orange-600 hover:text-dope-orange-700"
          >
            Clear All
          </button>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Quick Filters</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                className="rounded border-gray-300 text-dope-orange-600 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => onFiltersChange({ ...filters, onSale: e.target.checked })}
                className="rounded border-gray-300 text-dope-orange-600 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">On Sale</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.newArrivals}
                onChange={(e) => onFiltersChange({ ...filters, newArrivals: e.target.checked })}
                className="rounded border-gray-300 text-dope-orange-600 focus:ring-dope-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">New Arrivals</span>
            </label>
          </div>
        </div>

        {/* Brands */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueBrands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-gray-300 text-dope-orange-600 focus:ring-dope-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
          <div className="space-y-2">
            {uniqueCategories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="rounded border-gray-300 text-dope-orange-600 focus:ring-dope-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Materials */}
        {uniqueMaterials.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Materials</h4>
            <div className="space-y-2">
              {uniqueMaterials.map((material) => (
                <label key={material} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.materials.includes(material)}
                    onChange={() => handleMaterialToggle(material)}
                    className="rounded border-gray-300 text-dope-orange-600 focus:ring-dope-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{material}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
