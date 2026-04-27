"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToCart } from '../../lib/cart-utils';
import { Heart, Eye, ShoppingCart, Lock } from 'lucide-react';
import { useCompliance } from '../../contexts/ComplianceContext';

interface ProductCard1RowProps {
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

export default function ProductCard1Row({ product }: ProductCard1RowProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { restrictedProductIds, checkProductEligibility, userZipCode } = useCompliance();

  const isRestricted = restrictedProductIds.includes(product.id);

  useEffect(() => {
    if (userZipCode && !isRestricted) {
      checkProductEligibility([product.id]);
    }
  }, [userZipCode, product.id]);

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
    <div className="relative group">
      <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 min-h-[200px] w-full block ${
        isRestricted ? 'opacity-60 grayscale' : 'hover:shadow-lg hover:border-dope-orange-300 hover:-translate-y-1'
      }`}>
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-48 h-48 bg-white flex-shrink-0 p-4">
            <Link href={isRestricted ? '#' : `/product/${product.id}`} className={isRestricted ? 'cursor-not-allowed' : ''}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <div className="text-center">
                    <div className="text-3xl mb-1">🚬</div>
                    <div className="text-xs font-medium">No Image</div>
                  </div>
                </div>
              )}
            </Link>

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
            {!isRestricted && (
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
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            {/* Header Info */}
            <div className="flex-1">
              {/* Brand */}
              {(product.brand || product.brand_name) && (
                <p className="text-sm font-semibold text-dope-orange-600 mb-2 uppercase tracking-wide">
                  {product.brand || product.brand_name}
                </p>
              )}

              {/* Product Name */}
              <Link href={isRestricted ? '#' : `/product/${product.id}`} className={isRestricted ? 'cursor-not-allowed' : ''}>
                <h3 className="font-bold text-gray-900 text-xl leading-tight mb-3 hover:text-dope-orange-700 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              {/* Description */}
              {(product.short_description || product.description) && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {product.short_description || product.description}
                </p>
              )}
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-end">
              {/* Price */}
              <div className="flex-1">
                {hasDiscount && product.compare_at_price ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        ${Number(product.compare_at_price).toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        Save {discountPercentage}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${price.toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">
                    ${price.toFixed(2)}
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 ml-6" onClick={(e) => e.stopPropagation()}>
                {!isRestricted && (
                  <Link href={`/product/${product.id}`}>
                    <button className="px-4 py-2.5 bg-transparent text-dope-orange-600 border-2 border-dope-orange-600 font-bold rounded-full transition-all duration-300 text-sm hover:bg-dope-orange-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-dope-orange-600/25">
                      <Eye className="w-4 h-4 inline mr-1" />
                      View Details
                    </button>
                  </Link>
                )}
                <button
                  onClick={async (e) => {
                    if (isRestricted) return;
                    setIsAddingToCart(true);
                    try {
                      await addToCart(product.id, 1);
                    } catch (error) {
                      console.error('Failed to add to cart:', error);
                    } finally {
                      setIsAddingToCart(false);
                    }
                  }}
                  disabled={isAddingToCart || isRestricted}
                  className={`px-4 py-2.5 font-bold rounded-full transition-all duration-300 text-sm flex items-center gap-2 ${
                    isRestricted 
                      ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed' 
                      : 'bg-dope-orange-600 hover:bg-dope-orange-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-dope-orange-600/25 disabled:opacity-50'
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : isRestricted ? (
                    <>
                      <Lock className="w-4 h-4" />
                      Restricted
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restriction Overlay Badge */}
      {isRestricted && (
        <div className="absolute inset-0 z-20 flex items-center justify-start pl-32 pointer-events-none">
          <div className="bg-black/90 backdrop-blur-md border border-red-500/50 rounded-2xl p-4 flex flex-col items-center text-center shadow-2xl transform rotate-[-3deg]">
            <Lock className="w-6 h-6 text-red-500 mb-1" />
            <span className="text-white font-black uppercase tracking-tighter text-sm leading-none">Local Restriction</span>
            <span className="text-red-400 text-[8px] font-bold uppercase tracking-widest mt-0.5">Check Address</span>
          </div>
        </div>
      )}
    </div>
  );
}
