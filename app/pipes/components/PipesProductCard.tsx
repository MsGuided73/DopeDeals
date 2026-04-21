"use client";
import { useState, type MouseEvent } from 'react';
import Link from 'next/link';
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

const LIME = '#52C41A';
const LIME_BRIGHT = '#63D420';
const INK = '#1c1208';

export default function PipesProductCard({ product }: PipesProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const rawPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const price = Number.isFinite(rawPrice) ? rawPrice : 0;
  const hasDiscount = !!(
    product.compare_at_price && Number.isFinite(product.compare_at_price) && product.compare_at_price > price
  );
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - price) / product.compare_at_price!) * 100)
    : product.discount_percentage;

  const hasVariantIndicators = product.image_urls && product.image_urls.length > 1;
  const detailHref = `/product/${product.id}`;

  return (
    <div
      className="group product-card flex-shrink-0 w-96 min-h-[400px]"
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.3s, transform 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top lime accent bar */}
      <div
        style={{
          height: '4px',
          background: `linear-gradient(90deg, ${LIME_BRIGHT}, ${LIME})`,
          borderRadius: '10px 10px 0 0',
        }}
      />

      {/* Image (links to details) */}
      <Link
        href={detailHref}
        className="relative w-full h-80 bg-white overflow-hidden block"
      >
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

        {hasVariantIndicators && (
          <div className="absolute top-3 right-3">
            <VariantIndicator imageUrls={product.image_urls!} className="scale-75" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <div
              className="text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              style={{ background: `linear-gradient(90deg, ${LIME_BRIGHT}, ${LIME})` }}
            >
              ⭐ Featured
            </div>
          )}
          {discountPercentage && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercentage}% OFF
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {(product.brand || product.brand_name) && (
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: LIME,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            {product.brand || product.brand_name}
          </p>
        )}

        <Link href={detailHref}>
          <h3
            className="line-clamp-2 group-hover:opacity-70 transition-opacity"
            style={{ fontWeight: 700, color: INK, fontSize: '18px', lineHeight: 1.3, marginBottom: '8px' }}
          >
            {product.name}
          </h3>
        </Link>

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
                <div style={{ fontWeight: 700, fontSize: '24px', color: LIME, letterSpacing: '0.03em' }}>
                  ${price.toFixed(2)}
                </div>
              </div>
            ) : (
              <div style={{ fontWeight: 700, fontSize: '24px', color: LIME, letterSpacing: '0.03em' }}>
                ${price.toFixed(2)}
              </div>
            )}
          </div>

          {/* 2-button row — Add to Cart (filled primary) + View Details (ghost) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              style={{
                flex: 1,
                background: isAddingToCart
                  ? '#C3E8A8'
                  : `linear-gradient(to bottom, ${LIME_BRIGHT}, ${LIME})`,
                color: '#fff',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.05em',
                padding: '10px 6px',
                border: 'none',
                cursor: isAddingToCart ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(82,196,26,0.30)',
                transition: 'box-shadow 0.18s, transform 0.1s',
              }}
              onMouseEnter={(e) => {
                if (isAddingToCart) return;
                const el = e.currentTarget as HTMLButtonElement;
                el.style.boxShadow = '0 4px 14px rgba(82,196,26,0.45)';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.boxShadow = '0 2px 6px rgba(82,196,26,0.30)';
                el.style.transform = 'none';
              }}
            >
              {isAddingToCart ? 'Adding…' : 'Add to Cart'}
            </button>
            <Link
              href={detailHref}
              style={{
                flex: 1,
                border: `1.5px solid ${LIME}`,
                color: LIME,
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.05em',
                padding: '9px 6px',
                textAlign: 'center',
                display: 'block',
                background: 'transparent',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'background 0.18s, color 0.18s',
              }}
              className="hover:bg-[#52C41A] hover:text-white"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
