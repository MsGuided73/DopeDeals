'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingState, { useLoadingState } from '../../components/LoadingState';
import DabsntoolsFilters from './components/DabsntoolsFilters';
import DabsntoolsProductGrid from './components/DabsntoolsProductGrid';
import DabsntoolsBreadcrumb from './components/DabsntoolsBreadcrumb';
import DabsntoolsHero from './components/DabsntoolsHero';
import DabsntoolsSortBar from './components/DabsntoolsSortBar';
import DabsntoolsViewToggle from './components/DabsntoolsViewToggle';

export interface DabsntoolsProduct {
  id: string;
  name: string;
  our_price: number;
  sale_price?: number;
  image_url: string | null;
  imageUrl?: string; // Add alias for compatibility
  image?: string; // Add alias for compatibility
  description?: string | null;
  short_description?: string | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  brand_id: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  // Add missing properties that components expect
  price?: number; // For compatibility
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
  inStock?: boolean;
  brand?: string; // For compatibility
  category?: string; // For compatibility
  type?: string; // Product type (Rigs, E-Rigs, Tools)
  size?: string; // Product size specifications
  specs?: {
    type?: string;
    size?: string;
    material?: string;
  };
}

export default function DabsntoolsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<DabsntoolsProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DabsntoolsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  // Filter states - adapted for dab products
  const [filters, setFilters] = useState({
    priceRange: [0, 300] as [number, number],
    brands: [] as string[],
    materials: [] as string[],
    types: [] as string[], // Glass Rigs, E-Rigs, Portable, Tools
    sizes: [] as string[],
    categories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
  });

  useEffect(() => {
    // Load real dab rig & tool products from Supabase
    loadDabsntoolsProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Apply filters - using available fields from API
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p: DabsntoolsProduct) => p.brand && filters.brands.includes(p.brand));
    }
    if (filters.inStock) {
      filtered = filtered.filter((p: DabsntoolsProduct) => p.stock_quantity > 0);
    }
    if (filters.types.length > 0) {
      filtered = filtered.filter((p: DabsntoolsProduct) => {
        // Use the product type field that we set in the API
        const productType = p.type || p.specs?.type;
        return productType && filters.types.includes(productType);
      });
    }

    // Price range filter - use our_price field
    filtered = filtered.filter((p: DabsntoolsProduct) => {
      const price = p.our_price || p.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: DabsntoolsProduct, b: DabsntoolsProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a: DabsntoolsProduct, b: DabsntoolsProduct) => {
          const priceA = a.our_price || a.price || 0;
          const priceB = b.our_price || b.price || 0;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a: DabsntoolsProduct, b: DabsntoolsProduct) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a: DabsntoolsProduct, b: DabsntoolsProduct) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        // Sort by newest first, then by stock quantity
        filtered.sort((a: DabsntoolsProduct, b: DabsntoolsProduct) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          if (dateA !== dateB) return dateB - dateA;
          return b.stock_quantity - a.stock_quantity;
        });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, sortBy]);

  const loadDabsntoolsProducts = async () => {
    try {
      setLoading(true);

      // Use the API endpoint for dab products (we'll create this)
      const response = await fetch('/api/products/dab-rigs-and-tools');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(`✅ API returned ${data.totalCount} dab rig & tool products`);

      // The API should return properly formatted products with valid images
      const transformedProducts = data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        our_price: product.price,
        sale_price: product.compare_at_price,
        image_url: product.image_url,
        imageUrl: product.image_url, // Compatibility alias
        image: product.image_url, // Compatibility alias
        description: product.description,
        short_description: product.short_description,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active,
        featured: product.featured || false,
        brand_id: product.brand_id,
        category_id: product.category_id,
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Add compatibility fields
        price: product.price,
        isNew: product.isNew,
        isSale: product.isSale,
        originalPrice: product.compare_at_price,
        inStock: product.inStock,
        brand: product.brand,
        category: 'Dab Rigs & Tools',
        // Add additional fields that the grid expects
        type: extractTypeFromName(product.name) || 'Rigs',
        size: product.specs?.size || 'Standard',
        material: product.material || 'Glass'
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading dab rig & tool products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <LoadingState
        loading={loading}
        onRetry={loadDabsntoolsProducts}
        timeout={15000}
      >
        <div>Dab Rigs & Tools Page Content</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div>
      {/* Breadcrumb */}
      <DabsntoolsBreadcrumb />

      {/* Hero Section */}
      <DabsntoolsHero filters={filters} setFilters={setFilters} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - adapted from ThcaPnvFilters */}
          <div className="lg:w-1/4">
            <DabsntoolsFilters
              filters={filters}
              setFilters={setFilters}
              products={products}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort Bar and View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <DabsntoolsSortBar sortBy={sortBy} setSortBy={setSortBy} />
                <DabsntoolsViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>

            {/* Product Grid - adapted from ThcaPnvProductGrid */}
            <DabsntoolsProductGrid
              products={currentProducts}
              viewMode={viewMode}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_: number, i: number) => {
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
    </ErrorBoundary>
  );
}

// Helper function to extract product type from product name
function extractTypeFromName(productName: string): string | null {
  if (!productName) return null;

  const nameLower = productName.toLowerCase();

  if (nameLower.includes('e-rig') || nameLower.includes('erig') || nameLower.includes('electric') || nameLower.includes('puffco')) return 'E-Rigs';
  if (nameLower.includes('portable')) return 'Portable';
  if (nameLower.includes('tool') || nameLower.includes('dabber') || nameLower.includes('nail') || nameLower.includes('carb cap')) return 'Tools';
  if (nameLower.includes('glass')) return 'Glass Rigs';

  return null;
}
