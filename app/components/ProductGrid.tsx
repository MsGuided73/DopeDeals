'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UniversalProductCard from './UniversalProductCard';
import SmartBgImage from './SmartBgImage';
import { addToCart } from '../lib/cart-utils';

// Minimal shape the grid needs from each product. Category-specific page
// types (PipeProduct, BongProduct, BubblerProduct, etc.) all satisfy this
// structurally — TypeScript will accept any object that has these fields,
// so consumers don't need to remap their data shape.
export interface ProductGridItem {
  id: string;
  name: string;
  price: number | string;
  compare_at_price?: number;
  vip_price?: number;
  image_url?: string;
  brand?: string;
  description?: string;
  short_description?: string;
  style?: string;
  material?: string;
  size?: string;
  stock_quantity?: number;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  featured?: boolean;
  rating?: number;
  review_count?: number;
}

interface ProductGridProps {
  products: ProductGridItem[];
  viewMode: 'grid' | 'list' | 'sidebar';
}

// Shared product grid used by every category listing page (bongs, pipes,
// dab-rigs, vapes, bubblers, etc.). Three view modes:
//   - grid    : 3-up frameless cards, image fills the tile, smart bg color
//   - list    : horizontal layout with product details + actions
//   - sidebar : 2-column UniversalProductCard layout
export default function ProductGrid({ products, viewMode }: ProductGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const formatPrice = (price: number | string | undefined | null) => {
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
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
        <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters to see more products.</p>
      </div>
    );
  }

  // Grid view — standardized via UniversalProductCard
  return (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10" : "grid grid-cols-1 gap-4"}>
      {products.map((product) => (
        <UniversalProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            brand_name: product.brand,
            short_description: product.short_description || product.description,
            stock_quantity: product.stock_quantity ?? (product.inStock ? 10 : 0),
            featured: product.featured,
            compare_at_price: product.compare_at_price,
            rating: product.rating,
            review_count: product.review_count,
          }}
          viewMode={viewMode === 'sidebar' ? 'sidebar' : viewMode === 'list' ? 'list' : 'grid'}
          size="medium"
          showAddToCart={true}
          showFavorite={true}
          showQuickView={true}
          showRating={true}
          showBrand={true}
          showDescription={true}
          showStock={true}
          showDiscount={true}
          onFavorite={(id) => toggleFavorite(id)}
        />
      ))}
    </div>
  );
}
