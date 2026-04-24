"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, type MouseEvent } from 'react';
import { addToCart } from '../../lib/cart-utils';
import {
  cleanProductDescription,
  extractProductDescription,
  isImageAppropriateForProduct,
  getProductPlaceholder,
  generateProductDescription,
} from '../../lib/product-utils';

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
  /** Kept for backward compatibility. The canonical card now always renders
   *  Add to Cart + View Details; pass `false` to hide the Add to Cart button
   *  (the View Details ghost button will still render). */
  showAddToCart?: boolean;
}

const LIME = '#2d8f47';
const LIME_BRIGHT = '#3cb05b';
const LIME_DARK = '#226b35';
const INK = '#1c1208';

export default function ProductCard({ product, viewMode = 'grid', showAddToCart = true }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const rawImageUrl = product.image_url || product.imageUrl || product.image;
  const isImageAppropriate = isImageAppropriateForProduct(rawImageUrl, product.name);
  const imageUrl = isImageAppropriate ? rawImageUrl : null;
  const hasImage = imageUrl && imageUrl.trim() !== '';

  const cleanShortDescription = product.short_description
    ? extractProductDescription(product.short_description) || cleanProductDescription(product.short_description)
    : generateProductDescription(product);

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const isInStock = (product.stock_quantity || 0) > 0;
  const placeholder = getProductPlaceholder(product.name);
  const detailHref = `/product/${product.id}`;

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInStock || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ── Primary "Add to Cart" button (filled lime gradient) ──
  const AddToCartButton = ({ fullWidth = false }: { fullWidth?: boolean }) => {
    const disabled = !isInStock || isAddingToCart;
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled}
        style={
          disabled
            ? {
                flex: fullWidth ? undefined : 1,
                width: fullWidth ? '100%' : undefined,
                background: '#e5e5e5',
                color: '#999',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.05em',
                padding: '9px 4px',
                border: 'none',
                cursor: 'not-allowed',
                textTransform: 'uppercase',
                borderRadius: '4px',
              }
            : {
                flex: fullWidth ? undefined : 1,
                width: fullWidth ? '100%' : undefined,
                background: `linear-gradient(to bottom, ${LIME_BRIGHT}, ${LIME})`,
                color: '#fff',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.05em',
                padding: '9px 4px',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(82,196,26,0.30)',
                transition: 'box-shadow 0.18s, transform 0.1s',
              }
        }
        onMouseEnter={(e) => {
          if (disabled) return;
          const el = e.currentTarget as HTMLButtonElement;
          el.style.boxShadow = '0 4px 14px rgba(82,196,26,0.45)';
          el.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          if (disabled) return;
          const el = e.currentTarget as HTMLButtonElement;
          el.style.boxShadow = '0 2px 6px rgba(82,196,26,0.30)';
          el.style.transform = 'none';
        }}
      >
        {!isInStock ? 'Out of Stock' : isAddingToCart ? 'Adding…' : 'Add to Cart'}
      </button>
    );
  };

  // ── Secondary "View Details" ghost button (lime outline) ──
  const ViewDetailsButton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <Link
      href={detailHref}
      style={{
        flex: fullWidth ? undefined : 1,
        width: fullWidth ? '100%' : undefined,
        border: `1.5px solid ${LIME}`,
        color: LIME,
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.05em',
        padding: '8px 4px',
        textAlign: 'center',
        display: 'block',
        background: 'transparent',
        textTransform: 'uppercase',
        textDecoration: 'none',
        borderRadius: '4px',
        transition: 'background 0.18s, color 0.18s',
      }}
      className="hover:bg-[#2d8f47] hover:text-white"
    >
      View Details
    </Link>
  );

  if (viewMode === 'list') {
    return (
      <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 product-card">
        <div className="flex">
          {/* Image (links to details) */}
          <Link href={detailHref} className="relative w-48 h-48 flex-shrink-0 bg-gray-100 block">
            {hasImage ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                sizes="192px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">{placeholder.icon}</div>
                  <div className="text-sm">{placeholder.text}</div>
                </div>
              </div>
            )}
            {product.featured && (
              <div
                className="absolute top-2 left-2 text-white px-2 py-1 rounded text-xs font-semibold"
                style={{ background: LIME }}
              >
                Featured
              </div>
            )}
          </Link>

          {/* Info */}
          <div className="flex-1 p-6 flex flex-col">
            {product.brand_name && (
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
                {product.brand_name}
              </p>
            )}

            <Link href={detailHref}>
              <h3
                className="line-clamp-2"
                style={{
                  fontWeight: 600,
                  color: INK,
                  fontSize: '16px',
                  lineHeight: 1.35,
                  marginBottom: '8px',
                }}
              >
                {product.name}
              </h3>
            </Link>

            {cleanShortDescription && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cleanShortDescription}</p>
            )}

            <div className="flex items-center justify-between mt-auto gap-4 flex-wrap">
              <span style={{ fontWeight: 700, fontSize: '22px', color: LIME, letterSpacing: '0.03em' }}>
                ${price.toFixed(2)}
              </span>

              <div className="flex items-center gap-2 min-w-[260px]">
                {showAddToCart && <AddToCartButton />}
                <ViewDetailsButton />
              </div>
            </div>

            {product.stock_quantity !== undefined && (
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded-full self-start ${
                  isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isInStock ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default) ────────────────────────────────────────────────
  return (
    <div
      className="group product-card"
      style={{
        background: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.3s, transform 0.3s',
        borderRadius: '6px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Solid lime-green top accent bar */}
      <div
        style={{
          height: '4px',
          background: `linear-gradient(90deg, ${LIME_BRIGHT}, ${LIME})`,
          borderRadius: '6px 6px 0 0',
        }}
      />

      {/* Image (links to details) */}
      <Link
        href={detailHref}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          background: '#ffffff',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">{placeholder.icon}</div>
              <div className="text-sm">{placeholder.text}</div>
            </div>
          </div>
        )}
        {product.featured && (
          <div
            className="absolute top-2 left-2 text-white px-2 py-1 rounded text-xs font-semibold"
            style={{ background: LIME, zIndex: 2 }}
          >
            Featured
          </div>
        )}
      </Link>

      {/* Body */}
      <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {product.brand_name && (
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: LIME,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '3px',
            }}
          >
            {product.brand_name}
          </p>
        )}

        <Link href={detailHref}>
          <h3
            className="line-clamp-2 group-hover:opacity-70 transition-opacity"
            style={{
              fontWeight: 600,
              color: INK,
              fontSize: '14px',
              lineHeight: 1.35,
              marginBottom: '6px',
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div
          style={{
            fontWeight: 700,
            fontSize: '21px',
            color: LIME,
            letterSpacing: '0.03em',
            marginBottom: '11px',
            marginTop: 'auto',
          }}
        >
          ${price.toFixed(2)}
        </div>

        {/* 2-button row — Add to Cart (filled) + View Details (ghost) */}
        <div style={{ display: 'flex', gap: '7px' }}>
          {showAddToCart && <AddToCartButton />}
          <ViewDetailsButton fullWidth={!showAddToCart} />
        </div>
      </div>
    </div>
  );
}
