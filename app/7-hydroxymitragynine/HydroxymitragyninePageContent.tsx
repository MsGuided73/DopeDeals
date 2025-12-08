'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  our_price: number;
  sale_price?: number;
  image_url?: string;
  image_urls?: string[];
  sku: string;
  stock_quantity: number;
  brand_name?: string;
  category_id?: string;
  tags?: string[];
  psychoactive_profile?: any;
}

interface CategorizedProducts {
  gummies: {
    kratom: Product[];
    hydroxy: Product[];
  };
  tablets: {
    kratom: Product[];
    hydroxy: Product[];
  };
  liquid: {
    kratom: Product[];
    hydroxy: Product[];
  };
  vape: {
    kratom: Product[];
    hydroxy: Product[];
  };
}

interface CategorizedResponse {
  categorized: CategorizedProducts;
  summary: {
    totalProducts: number;
    categorizedProducts: number;
    productTypes: {
      gummies: number;
      tablets: number;
      liquid: number;
      vape: number;
    };
    activeIngredients: {
      kratom: number;
      hydroxy: number;
    };
  };
}

function ProductCard({ product }: { product: Product }) {
  const getProductImage = (product: Product): string => {
    if (product.image_url && product.image_url.trim() !== '') {
      return product.image_url;
    }
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      return product.image_urls[0];
    }
    return '/images/placeholder-product.jpg';
  };

  const getProductPrice = (product: Product) => {
    const price = product.sale_price || product.our_price;
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        {product.sale_price && product.sale_price < product.our_price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {product.brand_name && (
          <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
            {product.brand_name}
          </p>
        )}
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            {product.sale_price && product.sale_price < product.our_price ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  ${getProductPrice(product)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.our_price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${getProductPrice(product)}
              </span>
            )}
          </div>
          {product.stock_quantity > 0 ? (
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
              In Stock
            </span>
          ) : (
            <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HydroxymitragyninePageContent() {
  const searchParams = useSearchParams();
  const [categorizedData, setCategorizedData] = useState<CategorizedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategorizedProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/7-hydroxymitragynine/categorized');

        if (!response.ok) {
          throw new Error('Failed to fetch categorized products');
        }

        const data = await response.json();
        setCategorizedData(data);
      } catch (err) {
        console.error('Error fetching categorized products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchCategorizedProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getProductImage = (product: Product): string => {
    if (product.image_url && product.image_url.trim() !== '') {
      return product.image_url;
    }
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      return product.image_urls[0];
    }
    return '/images/placeholder-product.jpg';
  };

  const getProductPrice = (product: Product) => {
    const price = product.sale_price || product.our_price;
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              🌿 Premium 7-Hydroxymitragynine & Kratom
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover our curated collection of high-quality 7-OH and Kratom products
            </p>
            <div className="flex justify-center gap-4 text-sm md:text-base">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ✓ Lab Tested
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ✓ Premium Quality
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                ✓ Discreet Shipping
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Understanding 7-Hydroxymitragynine & Kratom
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Learn about the benefits, risks, and key differences between these natural compounds
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Kratom Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🌿</div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">Kratom (Mitragynine)</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Benefits:</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>• Natural pain relief and analgesic properties</li>
                    <li>• Mood enhancement and stress reduction</li>
                    <li>• Energy boost and increased focus</li>
                    <li>• Traditional use in Southeast Asia for wellness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Risks & Considerations:</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>• Potential for dependency with prolonged use</li>
                    <li>• May cause nausea or digestive discomfort</li>
                    <li>• Individual responses vary significantly</li>
                    <li>• Not FDA-approved for medical use</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 7-Hydroxy Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">💜</div>
                <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200">7-Hydroxymitragynine (7-OH)</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Benefits:</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>• Potent analgesic effects (pain relief)</li>
                    <li>• Sedative and relaxing properties</li>
                    <li>• May provide deeper relaxation than kratom alone</li>
                    <li>• Shorter duration but more intense effects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Risks & Considerations:</h4>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>• More potent than standard kratom - start low</li>
                    <li>• Higher potential for side effects</li>
                    <li>• Limited research on long-term use</li>
                    <li>• May cause stronger sedative effects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Key Differences */}
          <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Key Differences: Kratom vs 7-Hydroxymitragynine
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">⚖️</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Potency</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  7-OH is significantly more potent than standard kratom. What takes 5-10g of kratom might require only 1-2mg of 7-OH.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⏱️</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Duration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kratom effects last 4-6 hours. 7-OH effects are shorter (2-4 hours) but more intense.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Effects</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kratom provides balanced stimulation/relaxation. 7-OH is more focused on pain relief and sedation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!categorizedData || categorizedData.summary.totalProducts === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Products Coming Soon
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our premium 7-Hydroxymitragynine and Kratom collection is currently being stocked.
              Check back soon for exciting new products!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Available Products ({categorizedData.summary.totalProducts})
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Premium 7-OH, 7-Hydroxymitragynine, and Kratom products organized by type and active ingredients
              </p>
            </div>

            {/* Product Type Sections */}
            {(['gummies', 'tablets', 'liquid', 'vape'] as const).map((productType) => {
              const kratomProducts = categorizedData.categorized[productType].kratom;
              const hydroxyProducts = categorizedData.categorized[productType].hydroxy;
              const totalInType = kratomProducts.length + hydroxyProducts.length;

              if (totalInType === 0) return null;

              return (
                <div key={productType} className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 capitalize">
                    {productType} ({totalInType})
                  </h3>

                  {/* Kratom subsection */}
                  {kratomProducts.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4 flex items-center">
                        <span className="mr-2">🌿</span>
                        Kratom {productType} ({kratomProducts.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {kratomProducts.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7-OH subsection */}
                  {hydroxyProducts.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4 flex items-center">
                        <span className="mr-2">💜</span>
                        7-Hydroxymitragynine {productType} ({hydroxyProducts.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {hydroxyProducts.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Lab Tested
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All products are third-party lab tested for purity and potency
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We source only the highest quality 7-OH and Kratom products
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Discreet Shipping
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fast, discreet shipping with plain packaging for your privacy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
