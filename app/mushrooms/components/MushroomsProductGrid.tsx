'use client';

import { MushroomProduct } from '../MushroomsPageContent';
import Link from 'next/link';
import Image from 'next/image';

interface MushroomsProductGridProps {
  products: MushroomProduct[];
  viewMode: 'grid' | 'list';
}

export default function MushroomsProductGrid({ products, viewMode }: MushroomsProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">🍄</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No mushrooms found</h3>
        <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters to see more products.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Type: {product.type}</span>
                <span>Strength: {product.strength}</span>
                <span>Form: {product.form}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-dope-orange-500">${product.price}</div>
              <button className="mt-2 bg-dope-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-dope-orange-600">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                🍄
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                New
              </div>
            )}
            {product.isSale && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                Sale
              </div>
            )}
            {product.featured && (
              <div className="absolute bottom-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                Featured
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {product.name}
            </h3>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 space-y-1">
              <div>Type: {product.type}</div>
              <div>Strength: {product.strength}</div>
              <div>Form: {product.form}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-dope-orange-500">
                ${product.price}
              </div>
              {!product.inStock && (
                <span className="text-sm text-red-500">Out of Stock</span>
              )}
            </div>

            <button
              className="w-full mt-3 bg-dope-orange-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-dope-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
