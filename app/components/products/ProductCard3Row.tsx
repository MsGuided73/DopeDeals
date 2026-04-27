"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToCart } from '../../lib/cart-utils';
import { Heart, Eye, Lock } from 'lucide-react';
import { useCompliance } from '../../contexts/ComplianceContext';

interface ProductCard3RowProps {
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

export default function ProductCard3Row({ product }: ProductCard3RowProps) {
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

  const hasVariantIndicators = product.image_urls && product.image_urls.length > 1;

  return (
    <div className="relative group">
      <Link
        href={isRestricted ? '#' : `/product/${product.id}`}
        className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 min-h-[420px] w-full block ${
          isRestricted 
            ? 'opacity-60 grayscale cursor-not-allowed pointer-events-none' 
            : 'hover:shadow-lg hover:border-dope-orange-300 hover:-translate-y-1'
        }`}
      >
        {/* Image Container - Larger for 3-row layout */}
        <div className="relative w-full h-80 bg-white overflow-hidden p-6">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              <div className="text-center">
                <div className="text-4xl mb-2">🚬</div>
                <div className="text-sm font-medium">No Image</div>
              </div>
            </div>
          )}

          {/* Featured and Discount Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ⭐ Featured
              </div>
            )}
            {discountPercentage && discountPercentage > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                -{discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Favorite Button */}
          {!isRestricted && (
            <div className="absolute top-3 right-3">
              <button
                className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleFavorite(product.id);
                }}
                aria-label="Add to favorites"
              >
                <Heart className={`w-5 h-5 ${favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col h-full">

          {/* Brand */}
          {(product.brand || product.brand_name) && (
            <p className="text-sm font-semibold text-dope-orange-600 mb-2 uppercase tracking-wide">
              {product.brand || product.brand_name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 line-clamp-2 group-hover:text-dope-orange-700 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {(product.short_description || product.description) && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
              {product.short_description || product.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-4">
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
          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isRestricted) return;
                router.push(`/product/${product.id}`);
              }}
              disabled={isRestricted}
              className={`flex-1 px-4 py-2.5 font-bold rounded-full transition-all duration-300 text-center text-sm flex items-center justify-center gap-2 ${
                isRestricted
                  ? 'bg-zinc-100 text-zinc-400 border-zinc-200 border-2 cursor-not-allowed'
                  : 'bg-transparent text-dope-orange-600 border-2 border-dope-orange-600 hover:bg-dope-orange-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-dope-orange-600/25'
              }`}
            >
              {isRestricted ? (
                <>
                  <Lock className="w-4 h-4" />
                  Restricted
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  View Details
                </>
              )}
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
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
              className={`flex-1 px-4 py-2.5 font-bold rounded-full transition-all duration-300 text-center text-sm ${
                isRestricted
                  ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                  : 'bg-dope-orange-600 hover:bg-dope-orange-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-dope-orange-600/25 disabled:opacity-50'
              }`}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                  Adding...
                </>
              ) : isRestricted ? (
                'N/A'
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Restriction Overlay Badge */}
      {isRestricted && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-8 pointer-events-none">
          <div className="bg-black/90 backdrop-blur-md border border-red-500/50 rounded-2xl p-5 flex flex-col items-center text-center shadow-2xl transform rotate-[2deg]">
            <Lock className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-white font-black uppercase tracking-tighter text-xl leading-none">Local Restriction</span>
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1">Check Address</span>
          </div>
        </div>
      )}
    </div>
  );
}
