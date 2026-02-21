import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { BubblerProduct } from '../BubblersPageContent';

interface BubblersProductGridProps {
  products: BubblerProduct[];
  viewMode: 'grid' | 'list';
}

export default function BubblersProductGrid({ products, viewMode }: BubblersProductGridProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getImageUrl = (product: BubblerProduct) => {
    if (product.image_url && product.image_url.trim() !== '') {
      return product.image_url;
    }
    return '/images/placeholder-bubbler.jpg'; // Fallback image
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🫧</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No bubblers found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters to see more products.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl(product)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-bubbler.jpg';
                    }}
                  />
                  {product.stock_quantity <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    <Link 
                      href={`/product/${product.id}`}
                      className="hover:text-dope-orange-500 transition-colors"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </button>
                </div>

                {product.brand && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {product.brand}
                  </p>
                )}

                {product.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(product.price)}
                    </span>
                    {product.vip_price && product.vip_price < product.price && (
                      <span className="text-sm text-dope-orange-500 font-medium">
                        VIP: {formatPrice(product.vip_price)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                    <button
                      disabled={product.stock_quantity <= 0}
                      className="px-4 py-2 bg-dope-orange-500 hover:bg-dope-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group"
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
            <Image
              src={getImageUrl(product)}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-bubbler.jpg';
              }}
            />
            {product.stock_quantity <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Out of Stock</span>
              </div>
            )}
            
            {/* Overlay Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => toggleFavorite(product.id)}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 ${
                    favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
              <Link 
                href={`/product/${product.id}`}
                className="hover:text-dope-orange-500 transition-colors"
              >
                {product.name}
              </Link>
            </h3>

            {product.brand && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                by {product.brand}
              </p>
            )}

            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(product.price)}
                </span>
                {product.vip_price && product.vip_price < product.price && (
                  <div className="text-sm text-dope-orange-500 font-medium">
                    VIP: {formatPrice(product.vip_price)}
                  </div>
                )}
              </div>
              
              {product.stock_quantity > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {product.stock_quantity} in stock
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Link
                href={`/product/${product.id}`}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center text-sm font-medium"
              >
                View Details
              </Link>
              <button
                disabled={product.stock_quantity <= 0}
                className="flex-1 px-3 py-2 bg-dope-orange-500 hover:bg-dope-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
              >
                {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
