'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductsFilters from './components/ProductsFilters';
import ProductsProductGrid from './components/ProductsProductGrid';
import ProductsBreadcrumb from './components/ProductsBreadcrumb';
import ProductsHero from './components/ProductsHero';
import ProductsSortBar from './components/ProductsSortBar';
import ProductsViewToggle from './components/ProductsViewToggle';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  brand: string;
  category: string;
  subcategory?: string;
  material?: string;
  size?: string;
  inStock: boolean;

  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  description: string;
  features: string[];
  tags: string[];
}

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    brands: [] as string[],
    categories: [] as string[],
    materials: [] as string[],
    inStock: false,
    onSale: false,
    newArrivals: false,
  });

  // Initialize products
  useEffect(() => {
    const mockProducts = generateMockProducts();
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.category));
    }

    // Material filter
    if (filters.materials.length > 0) {
      filtered = filtered.filter(product => 
        product.material && filters.materials.includes(product.material)
      );
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => product.isSale);
    }

    // New arrivals filter
    if (filters.newArrivals) {
      filtered = filtered.filter(product => product.isNew);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ProductsHero />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ProductsBreadcrumb />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <ProductsFilters 
              filters={filters}
              onFiltersChange={setFilters}
              products={products}
            />
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Sort Bar and View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <ProductsSortBar sortBy={sortBy} onSortChange={setSortBy} />
                <ProductsViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              </div>
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </div>

            {/* Products Grid */}
            <ProductsProductGrid 
              products={currentProducts}
              viewMode={viewMode}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-dope-orange-500 text-white border-dope-orange-500'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data generator
function generateMockProducts(): Product[] {
  const brands = ['GRAV', 'Hemper', 'ROOR', 'Puffco', 'RAW', 'Santa Cruz Shredder', 'Storz & Bickel'];
  const categories = ['Water Bongs', 'Pipes', 'Glass Pieces', 'Vaporizers', 'Grinders', 'Papers & Wraps', 'Accessories', 'Storage', 'THCA Flower & More'];
  const materials = ['Borosilicate Glass', 'Aluminum', 'Stainless Steel', 'Ceramic', 'Silicone'];
  const sizes = {
    'Water Bongs': ['6-8"', '8-12"', '12-16"', '16-20"'],
    'Pipes': ['3-4"', '4-6"', '6-8"', 'Pocket Size'],
    'Glass Pieces': ['6-8"', '8-12"', '12-16"', '16-20"'],
    'Vaporizers': ['Portable', 'Desktop', 'Pen Style', 'Hybrid'],
    'Grinders': ['2-Piece', '3-Piece', '4-Piece', '5-Piece'],
    'Papers & Wraps': ['1¼"', '1½"', 'King Size', 'Extra Long'],
    'Accessories': ['Small', 'Medium', 'Large', 'Universal'],
    'Storage': ['Small', 'Medium', 'Large', 'XL'],
    'THCA Flower & More': ['1g', '3.5g', '7g', '14g', 'Variety', 'Standard', 'Premium', 'Deluxe']
  };

  return Array.from({ length: 48 }, (_, i) => {
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];
    const material = Math.random() > 0.3 ? materials[i % materials.length] : undefined;
    const size = Math.random() > 0.2 ? sizes[category as keyof typeof sizes][i % sizes[category as keyof typeof sizes].length] : undefined;

    return {
      id: `product-${i + 1}`,
      name: `${brand} ${category.replace(' & ', ' ')} ${i + 1}`,
      price: Math.floor(Math.random() * 300) + 20,
      originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 400) + 50 : undefined,
      image: `/images/products/product-${(i % 12) + 1}.jpg`,
      images: [`/images/products/product-${(i % 12) + 1}.jpg`, `/images/products/product-${(i % 12) + 1}-2.jpg`],
      brand,
      category,
      material,
      size,
      inStock: Math.random() > 0.1,
      isNew: Math.random() > 0.8,
      isSale: Math.random() > 0.7,
      description: `High-quality ${category.toLowerCase()} with premium construction and excellent performance.`,
      features: ['Premium Construction', 'Durable Design', 'Easy to Use', 'Great Value'],
      tags: ['premium', 'quality', 'accessories'],
    };
  });
}
