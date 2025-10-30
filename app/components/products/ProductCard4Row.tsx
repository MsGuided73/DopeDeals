"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToCart } from '../../lib/cart-utils';
import { Heart } from 'lucide-react';

interface ProductCard4RowProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    image_url?: string;
    image_urls?: string[];
    brand?: string;
    brand_name?: string;
    short_description?: string;
    description?: string;
    stock_quantity?: number;
    featured?: boolean;
    sku?: string;
    compare_at_price?: string | number;
    discount_percentage?: number;
    inStock?: boolean;
  };
}

export default function ProductCard4Row({ product }: ProductCard4RowProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  // Safely parse price to ensure it's always a valid number
  const rawPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const price = Number.isFinite(rawPrice) ? rawPrice : 0;
  const compareAtPrice = typeof product.compare_at_price === 'string' ? parseFloat(product.compare_at_price) : (product.compare_at_price || 0);
  const hasDiscount = compareAtPrice && Number.isFinite(compareAtPrice) && compareAtPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : product.discount_percentage;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-dope-orange-300 transition-all duration-300 hover:-translate-y-1 w-full min-h-[380px] flex-shrink-0 block"
    >
      {/* Image Container - Optimized for 4-column grid */}
      <div className="relative w-full h-64 bg-white overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            <div className="text-center">
              <div className="text-3xl mb-1">🚬</div>
              <div className="text-xs font-medium">No Image</div>
            </div>
          </div>
        )}

        {/* Featured and Discount Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
              Featured
            </div>
          )}
          {discountPercentage && discountPercentage > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2">
          <button
            className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col h-full">

        {/* Brand */}
        {(product.brand || product.brand_name) && (
          <p className="text-xs font-semibold text-dope-orange-600 mb-1 uppercase tracking-wide">
            {product.brand || product.brand_name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 line-clamp-2 group-hover:text-dope-orange-700 transition-colors">
          {product.name}
        </h3>

        {/* Description - Compact */}
        {(product.short_description || product.description) && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1">
            {product.short_description || product.description}
          </p>
        )}

        {/* Price */}
        <div className="mb-3">
          {hasDiscount && product.compare_at_price ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 line-through">
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-medium">
                  -{discountPercentage}%
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="text-xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            setIsAddingToCart(true);
            try {
              await addToCart(product.id, 1);
            } catch (error) {
              console.error('Failed to add to cart:', error);
            } finally {
              setIsAddingToCart(false);
            }
          }}
          disabled={isAddingToCart}
          className="w-full px-3 py-2 bg-dope-orange-600 hover:bg-dope-orange-700 text-white font-bold rounded-full transition-all duration-300 text-center text-sm hover:scale-105 hover:shadow-lg hover:shadow-dope-orange-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
              Adding...
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </Link>
  );
}
