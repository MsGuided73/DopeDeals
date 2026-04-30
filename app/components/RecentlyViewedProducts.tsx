"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, X } from 'lucide-react';
import { useCompliance } from '../contexts/ComplianceContext';

interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  viewedAt: string;
}

export default function RecentlyViewedProducts() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const { restrictedProductIds, checkProductEligibility, userZipCode } = useCompliance();

  useEffect(() => {
    // Load recently viewed products from localStorage
    const loadRecentlyViewed = () => {
      try {
        const stored = localStorage.getItem('recently_viewed_products');
        if (stored) {
          const products = JSON.parse(stored);
          setRecentlyViewed(products);
        }
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      }
    };

    loadRecentlyViewed();
  }, []);

  // Pre-fetch eligibility for all products once they are loaded
  useEffect(() => {
    if (userZipCode && recentlyViewed.length > 0) {
      const idsToCheck = recentlyViewed.map(p => p.id).filter(id => !restrictedProductIds.includes(id));
      if (idsToCheck.length > 0) {
        checkProductEligibility(idsToCheck);
      }
    }
  }, [userZipCode, recentlyViewed, restrictedProductIds, checkProductEligibility]);

  const removeFromRecentlyViewed = (productId: string) => {
    const updated = recentlyViewed.filter(product => product.id !== productId);
    setRecentlyViewed(updated);
    localStorage.setItem('recently_viewed_products', JSON.stringify(updated));
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recently_viewed_products');
  };

  // Don't show if no recently viewed products or not visible
  if (!isVisible || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-dope-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
            <span className="text-sm text-gray-500">({recentlyViewed.length} items)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearRecentlyViewed}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentlyViewed.map((product) => {
            const isRestricted = restrictedProductIds.includes(product.id);
            return (
              <div key={product.id} className="group relative">
                <Link
                  href={isRestricted ? '#' : `/product/${product.id}`}
                  className={`block bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 relative ${
                    isRestricted 
                      ? 'opacity-60 grayscale cursor-not-allowed' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="aspect-square relative p-4">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        sizes="200px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Clock className="w-8 h-8" />
                      </div>
                    )}

                    {/* Restriction Overlay */}
                    {isRestricted && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 pointer-events-none">
                        <div className="bg-black/90 backdrop-blur-md border border-red-500/50 rounded-xl p-3 flex flex-col items-center text-center shadow-xl transform rotate-[-3deg]">
                          <div className="text-2xl mb-1 text-red-500">🚫</div>
                          <span className="text-white font-black uppercase tracking-tighter text-[10px] leading-none whitespace-nowrap">Local Restriction</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-dope-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold text-dope-orange-600 mt-1">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromRecentlyViewed(product.id);
                  }}
                  className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Show message if no products */}
        {recentlyViewed.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recently viewed products</p>
            <p className="text-sm text-gray-400 mt-1">Products you view will appear here</p>
          </div>
        )}
      </div>
    </section>
  );
}
