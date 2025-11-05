'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Components
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingState from '../components/LoadingState';
import ThcaFilters from './components/ThcaFilters';
import ThcaJumpBar from './components/ThcaJumpBar';
import ThcaSection from './components/ThcaSection';

// Types
export interface ThcaProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image_url?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  stock_quantity?: number;
  inventory_status?: string;
  is_active?: boolean;
  featured?: boolean;
  cannabinoid_type?: string;
  search_rank?: number;
}

// THCA subcategories for sections
const THCA_SUBCATEGORIES = [
  { id: 'flower', name: 'THCA Flower', icon: '🌿', description: 'Premium THCA flower' },
  { id: 'prerolls', name: 'Prerolls & Vapes', icon: '🚬', description: 'Ready to smoke & vape' },
  { id: 'cartridges', name: 'Cartridges', icon: '💨', description: 'THCA vape cartridges' },
  { id: 'concentrates', name: 'Concentrates', icon: '🧪', description: 'THCA concentrates & rosin' },
  { id: 'edibles', name: 'Edibles', icon: '🍪', description: 'THCA edibles' },
  { id: 'cbd', name: 'CBD & Wellness', icon: '🌱', description: 'CBD products & wellness' },
  { id: 'delta', name: 'Delta Products', icon: '⚡', description: 'Delta-8 & Delta-9' },
  { id: 'mushrooms', name: 'Mushrooms', icon: '🍄', description: 'Psychedelic mushrooms' },
  { id: 'kratom', name: 'Kratom', icon: '🌿', description: '7-Hydroxymitragynine' },
];

export default function ThcaPageContent() {
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<{[key: string]: ThcaProduct[]}>({});
  const [loading, setLoading] = useState(true);
  const [embeddingLoading, setEmbeddingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 300] as [number, number],
    brands: [] as string[],
    subcategories: [] as string[],
    inStock: false,
    onSale: false,
    isNew: false,
    featured: false,
  });

  // URL params
  const searchQuery = searchParams.get('q') || '';
  const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';

  // Load products on mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [activeFilters, searchQuery]);

  // Scroll to section if hash is present
  useEffect(() => {
    if (hash && !loading) {
      const element = document.getElementById(`section-${hash}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [hash, loading]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare filters for API
      const filters = {
        minPrice: activeFilters.priceRange[0],
        maxPrice: activeFilters.priceRange[1],
        brands: activeFilters.brands,
        subcategories: activeFilters.subcategories,
        inStock: activeFilters.inStock,
        onSale: activeFilters.onSale,
        isNew: activeFilters.isNew,
        featured: activeFilters.featured,
      };

      let requestBody: any = {
        filters,
        page_size: 100, // Load more for sections
        page: 1
      };

      // If we have a search query, generate real embeddings
      if (searchQuery) {
        setEmbeddingLoading(true);
        try {
          const embeddingResponse = await fetch('/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: searchQuery }),
          });

          if (!embeddingResponse.ok) {
            const errorData = await embeddingResponse.json();
            throw new Error(errorData.error || `Embedding API error: ${embeddingResponse.status}`);
          }

          const embeddingData = await embeddingResponse.json();

          if (!embeddingData.embedding || !Array.isArray(embeddingData.embedding) || embeddingData.embedding.length !== 1536) {
            throw new Error('Invalid embedding received from API');
          }

          requestBody.query_embedding = embeddingData.embedding;
        } catch (embeddingError: any) {
          console.error('Error generating embedding:', embeddingError);
          // Fallback to no search if embedding fails
          setError(`Search unavailable: ${embeddingError.message}`);
          return;
        } finally {
          setEmbeddingLoading(false);
        }
      }

      const response = await fetch('/api/search/thca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Group products by subcategory
      const groupedProducts: {[key: string]: ThcaProduct[]} = {};

      // Initialize empty arrays for all subcategories
      THCA_SUBCATEGORIES.forEach(sub => {
        groupedProducts[sub.id] = [];
      });

      // Group products by their subcategory
      (data.products || []).forEach((product: ThcaProduct) => {
        const subcategory = product.subcategory?.toLowerCase() || 'flower'; // Default to flower
        if (groupedProducts[subcategory]) {
          groupedProducts[subcategory].push(product);
        } else {
          // If subcategory doesn't match our defined ones, add to flower
          groupedProducts.flower.push(product);
        }
      });

      setProducts(groupedProducts);
    } catch (err: any) {
      console.error('Error loading THCA products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
      setEmbeddingLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: typeof activeFilters) => {
    setActiveFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({
      priceRange: [0, 300],
      brands: [],
      subcategories: [],
      inStock: false,
      onSale: false,
      isNew: false,
      featured: false,
    });
  };

  if (loading) {
    return (
      <LoadingState loading={loading} onRetry={loadProducts} timeout={15000}>
        <div className="space-y-8">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-6 py-2 bg-dope-orange-500 text-white rounded-lg hover:bg-dope-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                THCA Collection
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                Discover our complete collection of premium THCA products with advanced vector search
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">🌿 Premium Flower</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">🚬 Prerolls & Vapes</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">💨 Cartridges</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">🧪 Concentrates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Jump Bar */}
        <ThcaJumpBar
          subcategories={THCA_SUBCATEGORIES}
          activeSection={hash}
          productCounts={Object.keys(products).reduce((acc, key) => {
            acc[key] = products[key]?.length || 0;
            return acc;
          }, {} as {[key: string]: number})}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <ThcaFilters
                filters={activeFilters}
                onFiltersChange={handleFiltersChange}
                products={Object.values(products).flat()}
              />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="space-y-12">
                {THCA_SUBCATEGORIES.map((subcategory) => (
                  <ThcaSection
                    key={subcategory.id}
                    id={subcategory.id}
                    title={subcategory.name}
                    description={subcategory.description}
                    icon={subcategory.icon}
                    products={products[subcategory.id] || []}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
