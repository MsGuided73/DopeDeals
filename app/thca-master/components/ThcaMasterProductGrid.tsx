'use client';

import { useState } from 'react';
import UniversalProductCard from '../../components/UniversalProductCard';
import { addToCart } from '../../lib/cart-utils';
import type { ThcaMasterProduct } from '../ThcaMasterPageContent';

interface ThcaMasterProductGridProps {
  products: ThcaMasterProduct[];
  viewMode: 'grid' | 'list' | 'sidebar';
}

export default function ThcaMasterProductGrid({ products, viewMode }: ThcaMasterProductGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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
        <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or category selection.</p>
      </div>
    );
  }

  // Sidebar view - Image on left, content on right (requested layout from pipes page)
  if (viewMode === 'sidebar') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <UniversalProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              price: product.our_price || product.price || 0,
              image_url: product.image_url || undefined,
              brand_name: product.brand || undefined,
              short_description: product.short_description || product.description || undefined,
              stock_quantity: product.stock_quantity,
              featured: product.featured,
              compare_at_price: product.sale_price || undefined,
            }}
            viewMode="sidebar"
            size="medium"
            showAddToCart={true}
            showFavorite={true}
            showQuickView={true}
            showRating={false}
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

  // Grid view - Traditional 3-column layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <UniversalProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            price: product.our_price || product.price || 0,
            image_url: product.image_url || undefined,
            brand_name: product.brand || undefined,
            short_description: product.short_description || product.description || undefined,
            stock_quantity: product.stock_quantity,
            featured: product.featured,
            compare_at_price: product.sale_price || undefined,
          }}
          viewMode="grid"
          size="medium"
          showAddToCart={true}
          showFavorite={true}
          showQuickView={true}
          showRating={false}
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
