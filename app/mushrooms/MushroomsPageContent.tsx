'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingState from '../../components/LoadingState';
import PrismaticBurst from '../../components/PrismaticBurst';
import { addToCart } from '../lib/cart-utils';

export interface ShroomsStuffProduct {
  id: string;
  name: string;
  our_price: number;
  sale_price?: number;
  image_url: string | null;
  description?: string | null;
  short_description?: string | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  brand?: string;
  type?: string;
  specs?: {
    type?: string;
    size?: string;
    material?: string;
  };
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
}

export default function MushroomsPageContent() {
  const [products, setProducts] = useState<ShroomsStuffProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShroomsStuffProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  // Filter states for shrooms & stuff products
  const [filters, setFilters] = useState({
    priceRange: [0, 200] as [number, number],
    types: [] as string[], // Vapes, Prerolls, THC-A Flower, Edibles, Concentrates
    inStock: false,
    onSale: false,
  });

  useEffect(() => {
    loadShroomsStuffProducts();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...products];

    // Price range filter
    filtered = filtered.filter((p: ShroomsStuffProduct) => {
      const price = p.our_price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Type filter
    if (filters.types.length > 0) {
      filtered = filtered.filter((p: ShroomsStuffProduct) => {
        const productType = p.type || p.specs?.type;
        return productType && filters.types.includes(productType);
      });
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((p: ShroomsStuffProduct) => p.stock_quantity > 0);
    }

    // Sale filter
    if (filters.onSale) {
      filtered = filtered.filter((p: ShroomsStuffProduct) => !!p.sale_price);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, filters]);

  const loadShroomsStuffProducts = async () => {
    try {
      setLoading(true);
      console.log('Loading shrooms & stuff products...');

      const response = await fetch('/api/products/mushrooms');
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API returned ${data.totalCount} shrooms & stuff products`);

      const transformedProducts = data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        our_price: product.price,
        sale_price: product.compare_at_price,
        image_url: product.image_url,
        description: product.description,
        short_description: product.short_description,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active,
        featured: product.featured || false,
        brand: product.brand,
        type: product.specs?.type,
        specs: product.specs,
        isNew: product.isNew,
        isSale: !!product.compare_at_price,
        inStock: (product.stock_quantity || 0) > 0
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading shrooms & stuff products:', error);
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
        onRetry={loadShroomsStuffProducts}
        timeout={15000}
      >
        <div>Loading Shrooms & Stuff...</div>
      </LoadingState>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        {/* Prismatic Burst Background */}
        <PrismaticBurst
          animationType="hover"
          intensity={4}
          speed={0.3}
          distort={1.2}
          rayCount={32}
          mixBlendMode="screen"
          colors={['#ff007a', '#4d3dff', '#00ffff', '#ff1493', '#8a2be2', '#00ced1']}
        />

        {/* Content Overlay */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
                🌿 Shrooms & Stuff
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-lg max-w-3xl mx-auto">
                Premium vapes, prerolls, THC-A flower, edibles, gummies & concentrates.
                <br />Elevate your experience with our curated collection.
              </p>

              {/* Quick Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['Vapes', 'Prerolls', 'THC-A Flower', 'Edibles', 'Concentrates'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      types: prev.types.includes(type)
                        ? prev.types.filter(t => t !== type)
                        : [...prev.types, type]
                    }))}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      filters.types.includes(type)
                        ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                        : 'bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="text-white drop-shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Premium Selection</h2>
                <p className="text-lg opacity-90">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              {/* Price Range Filter */}
              <div className="mt-4 sm:mt-0">
                <label className="block text-white text-sm font-medium mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
                    }))}
                    className="w-20 px-3 py-2 bg-white/20 border border-white/50 rounded-md text-white placeholder-white/70 backdrop-blur-sm"
                  />
                  <span className="text-white">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value) || 200]
                    }))}
                    className="w-20 px-3 py-2 bg-white/20 border border-white/50 rounded-md text-white placeholder-white/70 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-white/80 text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-4">No products found</h3>
                <p className="text-white/70 text-lg mb-8">Try adjusting your filters to see more products.</p>
                <button
                  onClick={() => setFilters({
                    priceRange: [0, 200],
                    types: [],
                    inStock: false,
                    onSale: false,
                  })}
                  className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-white/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div key={product.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                          🌿
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            NEW
                          </span>
                        )}
                        {product.isSale && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            SALE
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="absolute top-3 right-3">
                        <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                          <Link href={`/product/${product.id}`} className="hover:underline">
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-white/70 text-sm">{product.brand || 'Premium Brand'}</p>
                      </div>

                      {/* Product Type Badge */}
                      {product.type && (
                        <div className="mb-3">
                          <span className="inline-block bg-purple-500/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {product.type}
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">${product.our_price}</span>
                          {product.sale_price && product.sale_price > product.our_price && (
                            <span className="text-lg text-white/60 line-through">${product.sale_price}</span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={async () => {
                          if (product.inStock) {
                            try {
                              await addToCart(product.id, 1);
                              // You could add a toast notification here
                            } catch (error) {
                              console.error('Failed to add to cart:', error);
                            }
                          }
                        }}
                        disabled={!product.inStock}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/50 rounded-lg text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-white text-purple-600 shadow-lg'
                          : 'bg-white/20 backdrop-blur-md border border-white/50 text-white hover:bg-white/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/50 rounded-lg text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
