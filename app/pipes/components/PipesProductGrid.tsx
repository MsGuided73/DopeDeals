'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PipesProductCard from './PipesProductCard';
import UniversalProductCard from '../../components/UniversalProductCard';
import SmartBgImage from '../../components/SmartBgImage';
import { addToCart } from '../../lib/cart-utils';
import type { PipeProduct } from '../PipesPageContent';

interface PipesProductGridProps {
  products: PipeProduct[];
  viewMode: 'grid' | 'list' | 'sidebar';
}

export default function PipesProductGrid({ products, viewMode }: PipesProductGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const formatPrice = (price: any) => {
    if (price === undefined || price === null) return '0.00';
    const num = typeof price === 'string' ? parseFloat(price) : Number(price);
    return Number.isFinite(num) ? num.toFixed(2) : '0.00';
  };

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
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pipes found</h3>
        <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters to see more products.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
              {/* Product Image */}
              <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🚬</div>
                      <div className="text-sm">No Image</div>
                    </div>
                  </div>
                )}
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </span>
                )}
                {product.isSale && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    SALE
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold font-sans text-gray-900 dark:text-white mb-1">
                      <Link href={`/product/${product.id}`} className="hover:text-dope-orange-500 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-2">{product.brand}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    {favorites.has(product.id) ? (
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {product.style && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {product.style}
                    </span>
                  )}
                  {product.material && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {product.material}
                    </span>
                  )}
                  {product.size && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {product.size}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {product.short_description || product.description || 'Premium quality glass pipe with excellent craftsmanship.'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${formatPrice(product.price)}
                    </span>
                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${formatPrice(product.compare_at_price)}
                      </span>
                    )}
                    {product.vip_price && (
                      <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium dark:bg-purple-900 dark:text-purple-200">
                        VIP: ${formatPrice(product.vip_price)}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/product/${product.id}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                  >
                    View Details
                  </Link>
                </div>

                {!product.inStock && (
                  <div className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium">
                    Out of Stock
                  </div>
                )}

                {/* Add to Cart Button at bottom */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={async () => {
                      if (product.inStock) {
                        try {
                          await addToCart(product.id, 1);
                        } catch (error) {
                          console.error('Failed to add to cart:', error);
                        }
                      }
                    }}
                    className="w-full px-4 py-2 bg-dope-orange-500 hover:bg-dope-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!product.inStock}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                    </svg>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Sidebar view - Image on left, content on right (your requested layout)
  if (viewMode === 'sidebar') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <UniversalProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              brand_name: product.brand,
              short_description: product.description,
              stock_quantity: product.inStock ? 10 : 0, // Mock stock data
              featured: product.featured,
            }}
            viewMode="sidebar"
            size="medium"
            showAddToCart={true}
            showFavorite={true}
            showQuickView={true}
            showRating={true}
            showBrand={true}
            showDescription={true}
            showStock={true}
            showDiscount={true}
            onFavorite={toggleFavorite}
          />
        ))}
      </div>
    );
  }

  // Grid view — frameless cards, image fills the entire tile, 3-up on desktop.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {products.map((product) => (
        <div key={product.id} className="overflow-hidden group">
          {/* Product Image — full image visible; bg auto-matches dominant edge color when image doesn't fill the tile */}
          <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
            {product.image_url ? (
              <SmartBgImage
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                <div className="text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-1">
              {product.isNew && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-sm text-xs font-bold">
                  NEW
                </span>
              )}
              {product.isSale && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-sm text-xs font-bold">
                  SALE
                </span>
              )}
            </div>

            {/* Favorite Button - Floating Heart */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              aria-label={favorites.has(product.id) ? 'Remove from favorites' : 'Add to favorites'}
              className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm z-10 ${
                favorites.has(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>

          {/* Product Info */}
          <div className="pt-4 pb-2">
            <h3 className="text-base font-bold text-[#1a1a1a] mb-1 line-clamp-2 leading-tight">
              <Link href={`/product/${product.id}`} className="hover:text-[#2d8f47] transition-colors">
                {product.name}
              </Link>
            </h3>

            {/* Mock Ratings */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-[#1c352d]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <svg className="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <span className="text-sm text-gray-500 font-medium">({Math.floor(Math.random() * 150) + 12})</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-[#1a1a1a]">${formatPrice(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-gray-500 line-through">${formatPrice(product.compare_at_price)}</span>
              )}
            </div>

            {/* Action Buttons — ghost View Details on left, filled Add to Cart on right */}
            <div className="flex gap-2 mt-3">
              <Link
                href={`/product/${product.id}`}
                className="flex-1 px-3 py-2 bg-transparent border-2 border-dope-orange-600 text-dope-orange-600 hover:bg-dope-orange-600 hover:text-white rounded-md text-sm font-medium transition-all duration-300 text-center"
              >
                View Details
              </Link>
              {(() => {
                const inStock = product.inStock ?? ((product.stock_quantity ?? 0) > 0);
                return (
                  <button
                    onClick={async () => {
                      if (inStock) {
                        try {
                          await addToCart(product.id, 1);
                        } catch (error) {
                          console.error('Failed to add to cart:', error);
                        }
                      }
                    }}
                    disabled={!inStock}
                    className="flex-1 px-3 py-2 bg-dope-orange-600 hover:bg-dope-orange-700 disabled:bg-dope-orange-400 text-white rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
