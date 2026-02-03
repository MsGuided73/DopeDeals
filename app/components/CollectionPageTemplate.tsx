'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import GlobalMasthead from './GlobalMasthead';
import { addToCart } from '../lib/cart-utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  our_price: number;
  sale_price?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  brand_name: string | null;
}

interface CollectionPageTemplateProps {
  title: string;
  subtitle?: string;
  apiEndpoint: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  icon?: string;
  emptyMessage?: string;
  breadcrumbName?: string;
}

export default function CollectionPageTemplate({
  title,
  subtitle,
  apiEndpoint,
  gradientFrom = 'from-green-400',
  gradientVia = 'via-emerald-500',
  gradientTo = 'to-teal-600',
  icon = '🌿',
  emptyMessage = 'Products coming soon!',
  breadcrumbName,
}: CollectionPageTemplateProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [brandsExpanded, setBrandsExpanded] = useState(false);
  
  // Sort state
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchProducts();
  }, [apiEndpoint]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status text
        }
        throw new Error(`Failed to fetch products: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.products) {
        setProducts([]);
        return;
      }

      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique brands from products
  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand_name).filter(Boolean))).sort() as string[];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Price filter
    result = result.filter(p => p.our_price >= priceRange[0] && p.our_price <= priceRange[1]);
    
    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand_name && selectedBrands.includes(p.brand_name));
    }
    
    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock_quantity > 0);
    }
    
    // On sale filter
    if (onSaleOnly) {
      result = result.filter(p => p.sale_price && p.sale_price < p.our_price);
    }
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.our_price - b.our_price);
        break;
      case 'price-high':
        result.sort((a, b) => b.our_price - a.our_price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // featured
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    return result;
  }, [products, priceRange, selectedBrands, inStockOnly, onSaleOnly, sortBy]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  const activeFiltersCount = 
    selectedBrands.length + 
    (inStockOnly ? 1 : 0) + 
    (onSaleOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

  const transformProductForCard = (product: Product) => {
    const primaryImageUrl = product.image_url ||
                           (product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null);

    return {
      id: product.id,
      name: product.name,
      originalPrice: product.our_price,
      salePrice: product.sale_price || product.our_price,
      discountPercent: product.sale_price ? Math.round(((product.our_price - product.sale_price) / product.our_price) * 100) : 0,
      image_url: primaryImageUrl || undefined,
      featured: product.featured,
      stock_quantity: product.stock_quantity,
      brand_name: product.brand_name || 'Unknown Brand',
      compare_at_price: product.sale_price && product.sale_price < product.our_price ? product.our_price : undefined,
    };
  };

  const gradientClass = `bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalMasthead />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16 pt-8">
            <div className="h-16 bg-gray-200 rounded-lg mb-4 animate-pulse mx-auto max-w-2xl"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalMasthead />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center pt-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-display-twilight uppercase tracking-widest">
              {icon} {title}
            </h1>
            <div className="bg-red-50 rounded-xl p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-red-800 mb-4">Oops! Something went wrong</h2>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GlobalMasthead />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center pt-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-display-twilight uppercase tracking-widest">
              {icon} {title}
            </h1>
            <div className="bg-amber-50 rounded-xl p-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-amber-800 mb-4">Coming Soon</h2>
              <p className="text-amber-700 text-lg">{emptyMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <GlobalMasthead />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {breadcrumbName || title}
            </span>
          </nav>
        </div>
      </div>
      
      {/* Hero Section - Gradient Background */}
      <div className={`${gradientClass} py-12 px-4`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 font-display-twilight uppercase tracking-widest drop-shadow-md">
            {icon} {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/95 mb-6 max-w-3xl mx-auto font-medium drop-shadow-sm">
              {subtitle}
            </p>
          )}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2">
            <span className="text-white font-bold tracking-wide">{filteredProducts.length} Products</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear All ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] === 0 ? '' : priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-green-500 focus:outline-none"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] === 500 ? '' : priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 500])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => setBrandsExpanded(!brandsExpanded)}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3"
                  >
                    Brands ({brands.length})
                    {brandsExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <div className={`space-y-2 overflow-hidden transition-all duration-300 ${
                    brandsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Quick Filters</h4>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">On Sale</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const transformedProduct = transformProductForCard(product);
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <Link href={`/product/${product.id}`} className="block w-full h-full">
                        {transformedProduct.image_url ? (
                          <img
                            src={transformedProduct.image_url}
                            alt={transformedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <div className="text-3xl mb-2">{icon}</div>
                              <div className="text-sm">No Image</div>
                            </div>
                          </div>
                        )}
                      </Link>

                      {/* Featured Badge */}
                      {product.featured && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                          FEATURED
                        </span>
                      )}
                      
                      {/* Sale Badge */}
                      {transformedProduct.compare_at_price && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                          SALE
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          <Link href={`/product/${product.id}`} className="hover:text-green-600 transition-colors">
                            {transformedProduct.name}
                          </Link>
                        </h3>
                        {transformedProduct.brand_name !== 'Unknown Brand' && (
                          <p className="text-sm text-gray-500 mt-1">{transformedProduct.brand_name}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${transformedProduct.salePrice.toFixed(2)}
                          </span>
                          {transformedProduct.compare_at_price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${transformedProduct.compare_at_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className={`text-xs ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 px-3 py-2 bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md text-sm font-medium transition-all duration-300 text-center"
                        >
                          Quick View
                        </Link>
                        <button
                          onClick={async () => {
                            if (product.stock_quantity > 0) {
                              await addToCart(product.id);
                            }
                          }}
                          disabled={product.stock_quantity === 0}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white disabled:text-gray-500 rounded-md text-sm font-medium transition-colors"
                        >
                          {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
