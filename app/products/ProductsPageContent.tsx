'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp } from 'lucide-react';
import { supabaseBrowser } from '../lib/supabase-browser';
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

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';
  const [detectedBrand, setDetectedBrand] = useState<any>(null);

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

  // Initialize products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabaseBrowser
          .from('products')
          .select(`
            id, name, description, price, vip_price, image_url, sku,
            stock_quantity, is_active, brand_id, brand_name, category_id, materials,
            featured, vip_exclusive, tags, created_at, updated_at, channels
          `)
          .eq('is_active', true)
          .eq('nicotine_product', false)
          .eq('tobacco_product', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
          setFilteredProducts([]);
        } else {
          // Transform Supabase data to match our Product interface
          const transformedProducts = (data || []).map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            vipPrice: product.vip_price,
            imageUrl: product.image_url || null,
            sku: product.sku,
            brand: product.brand_name || 'Unknown',
            category: product.category_id || 'Accessories',
            material: Array.isArray(product.materials) ? product.materials[0] : 'Glass',
            size: 'Standard',
            inStock: (product.stock_quantity || 0) > 0,
            featured: product.featured || false,
            vipExclusive: product.vip_exclusive || false,
            onSale: product.vip_price && product.vip_price < product.price,
            newArrival: new Date(product.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
            tags: Array.isArray(product.tags) ? product.tags : []
          }));

          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Detect if search query is a brand name
  useEffect(() => {
    async function detectBrand() {
      if (searchQuery.length >= 3) {
        try {
          const { data: brand } = await supabaseBrowser
            .from('brands')
            .select('id, name, slug, description')
            .ilike('name', `%${searchQuery}%`)
            .single();

          if (brand) {
            setDetectedBrand(brand);
          }
        } catch (error) {
          // Brand not found, that's okay
          setDetectedBrand(null);
        }
      } else {
        setDetectedBrand(null);
      }
    }

    detectBrand();
  }, [searchQuery]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

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
  }, [products, filters, sortBy, searchQuery]);

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
    <div>
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
            {/* Brand Detection Banner */}
            {detectedBrand && (
              <div className="mb-4 p-4 bg-gradient-to-r from-dope-orange-50 to-yellow-50 border border-dope-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-dope-orange-600" />
                      {detectedBrand.name} Brand
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {detectedBrand.description || `Explore all ${detectedBrand.name} products`}
                    </p>
                  </div>
                  <Link
                    href={`/brands/${detectedBrand.slug || detectedBrand.id}`}
                    className="px-4 py-2 bg-dope-orange-500 hover:bg-dope-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    View Brand Page
                  </Link>
                </div>
              </div>
            )}

            {/* Search Results Header */}
            {searchQuery && (
              <div className="mb-4 p-4 bg-dope-orange-50 border border-dope-orange-200 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Found {filteredProducts.length} products
                  {detectedBrand && ` from ${detectedBrand.name} and other brands`}
                </p>
              </div>
            )}

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


