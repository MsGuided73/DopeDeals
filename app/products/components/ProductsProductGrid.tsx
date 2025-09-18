import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../ProductsPageContent';

interface ProductsProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
}

export default function ProductsProductGrid({ products, viewMode }: ProductsProductGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-6">
              {/* Product Image */}
              <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format'}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      <Link href={`/product/${product.id}`} className="hover:text-dope-orange-600">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`p-2 rounded-full ${
                        favorites.has(product.id)
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <button
                      disabled={!product.inStock}
                      className="bg-dope-orange-500 hover:bg-dope-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Add to Cart
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            <Image
              src={product.imageUrl || 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-1">
              {product.isNew && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                  NEW
                </span>
              )}
              {product.isSale && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                  SALE
                </span>
              )}

            </div>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`absolute top-3 right-3 p-2 rounded-full ${
                favorites.has(product.id)
                  ? 'text-red-500 bg-white'
                  : 'text-gray-400 bg-white hover:text-red-500'
              } shadow-sm`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Quick View Button */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <Link
                href={`/product/${product.id}`}
                className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
              >
                Quick View
              </Link>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  <Link href={`/product/${product.id}`} className="hover:text-dope-orange-600">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <button
              disabled={!product.inStock}
              className="w-full mt-3 bg-dope-orange-500 hover:bg-dope-orange-600 disabled:bg-gray-300 text-white py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
