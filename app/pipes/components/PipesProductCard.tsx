"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToCart } from '../../lib/cart-utils';
import { VariantIndicator } from '../../components/VariantSelector';

interface PipesProductCardProps {
  product: {
    id: string;
    name: string;
    price: number | string;
    image_url?: string;
    image_urls?: string[];
    brand?: string;
    category?: string;
    short_description?: string;
    description?: string;
    brand_name?: string;
    stock_quantity?: number;
    compare_at_price?: number;
    discount_percentage?: number;
    featured?: boolean;
    inStock?: boolean;
    sku?: string;
  };
}

export default function PipesProductCard({ product }: PipesProductCardProps) {
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

  const handleAddToCart = async (productId: string) => {
    setIsAddingToCart(true);
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Safely parse price to ensure it's always a valid number
  const rawPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const price = Number.isFinite(rawPrice) ? rawPrice : 0;
  const hasDiscount = product.compare_at_price && Number.isFinite(product.compare_at_price) && product.compare_at_price > price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price - price) / product.compare_at_price) * 100)
    : product.discount_percentage;

  const hasVariantIndicators = product.image_urls && product.image_urls.length > 1;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-96 min-h-[400px] block"
    >
      <div className="relative w-full h-80 bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            <div className="text-center">
              <div className="text-4xl mb-2">🚬</div>
              <div className="text-sm font-medium">No Image</div>
            </div>
          </div>
        )}

        {/* Variant Indicators */}
        {hasVariantIndicators && (
          <div className="absolute top-3 right-3">
            <VariantIndicator
              imageUrls={product.image_urls!}
              className="scale-75"
            />
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <div className="bg-gradient-to-r from-[#2d8f47] to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Featured
            </div>
          )}
          {discountPercentage && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercentage}% OFF
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <button
            className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col h-full">
        {(product.brand || product.brand_name) && (
          <p className="text-sm font-semibold text-[#2d8f47] mb-1 uppercase tracking-wide">
            {product.brand || product.brand_name}
          </p>
        )}

        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-[#2d8f47] transition-colors">
          {product.name}
        </h3>

        {(product.short_description || product.description) && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.short_description || product.description}
          </p>
        )}

        <div className="mt-auto">
          <div className="mb-4">
            {hasDiscount && product.compare_at_price ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    ${product.compare_at_price?.toFixed(2) || '0.00'}
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

          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/product/${product.id}`);
              }}
              className="flex-1 px-4 py-2.5 bg-transparent text-[#2d8f47] border-2 border-[#2d8f47] font-bold rounded-full transition-all duration-300 text-center text-sm font-highway uppercase tracking-wide hover:bg-[#2d8f47] hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-[#2d8f47]/25"
              style={{
                fontFamily: "'Highway Gothic', 'Arial', sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.05em',
              }}
            >
              Learn More
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await addToCart(product.id, 1);
                } catch (error) {
                  console.error('Failed to add to cart:', error);
                }
              }}
              className="flex-1 px-4 py-2.5 bg-transparent text-[#2d8f47] border-2 border-[#2d8f47] font-bold rounded-full transition-all duration-300 text-center text-sm font-highway uppercase tracking-wide hover:bg-[#2d8f47] hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-[#2d8f47]/25"
              style={{
                fontFamily: "'Highway Gothic', 'Arial', sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.05em',
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
