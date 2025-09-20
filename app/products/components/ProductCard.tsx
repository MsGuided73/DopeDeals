"use client";
import Link from 'next/link';
import Image from 'next/image';
import { cleanProductDescription, extractProductDescription, isImageAppropriateForProduct, getProductPlaceholder, generateProductDescription } from '../../lib/product-utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    image_url?: string;
    imageUrl?: string;
    image?: string;
    featured?: boolean;
    stock_quantity?: number;
    brand_name?: string;
    short_description?: string;
  };
  viewMode?: 'grid' | 'list';
  showAddToCart?: boolean;
}

export default function ProductCard({ product, viewMode = 'grid', showAddToCart = false }: ProductCardProps) {
  // Handle different image field names for compatibility
  const rawImageUrl = product.image_url || product.imageUrl || product.image;

  // Check if the image is appropriate for this product type
  const isImageAppropriate = isImageAppropriateForProduct(rawImageUrl, product.name);
  const imageUrl = isImageAppropriate ? rawImageUrl : null;
  const hasImage = imageUrl && imageUrl.trim() !== '';

  // Clean up product descriptions
  const cleanShortDescription = product.short_description
    ? extractProductDescription(product.short_description) || cleanProductDescription(product.short_description)
    : generateProductDescription(product);

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const isInStock = (product.stock_quantity || 0) > 0;

  // Get appropriate placeholder for product type
  const placeholder = getProductPlaceholder(product.name);

  if (viewMode === 'list') {
    return (
      <Link href={`/product/${product.id}`} className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex">
          {/* Product Image */}
          <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100">
            {hasImage ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                sizes="192px"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">{placeholder.icon}</div>
                  <div className="text-sm">{placeholder.text}</div>
                  {!isImageAppropriate && rawImageUrl && (
                    <div className="text-xs mt-1 text-red-400">Image mismatch</div>
                  )}
                </div>
              </div>
            )}
            {product.featured && (
              <div className="absolute top-2 left-2 bg-dope-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Featured
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-dope-orange-600 transition-colors">
              {product.name}
            </h3>

            {product.brand_name && (
              <p className="text-sm text-gray-500 mb-2">{product.brand_name}</p>
            )}

            {cleanShortDescription && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {cleanShortDescription}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-dope-orange-600">
                ${price.toFixed(2)}
              </span>

              <div className="flex items-center gap-3">
                {product.stock_quantity !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isInStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                )}

                {showAddToCart && (
                  <button
                    className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    disabled={!isInStock}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link href={`/product/${product.id}`} className="group block border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">{placeholder.icon}</div>
              <div className="text-sm">{placeholder.text}</div>
              {!isImageAppropriate && rawImageUrl && (
                <div className="text-xs mt-1 text-red-400">Image mismatch</div>
              )}
            </div>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-dope-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-dope-orange-600 transition-colors">
          {product.name}
        </h3>

        {product.brand_name && (
          <p className="text-sm text-gray-500 mb-2">{product.brand_name}</p>
        )}

        {cleanShortDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {cleanShortDescription}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-dope-orange-600">
            ${price.toFixed(2)}
          </span>

          {product.stock_quantity !== undefined && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>

        {showAddToCart && (
          <button
            className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            disabled={!isInStock}
          >
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}

