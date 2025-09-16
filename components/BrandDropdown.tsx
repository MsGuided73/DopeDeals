"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Brand {
  id: string;
  name: string;
  slug: string;
  product_count?: number;
}

interface BrandDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandDropdown({ isOpen, onClose }: BrandDropdownProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch('/api/zoho/sync-brands');
        const data = await response.json();
        
        if (data.success && data.brands) {
          // Sort brands by product count (descending) and then by name
          const sortedBrands = data.brands
            .sort((a: Brand, b: Brand) => {
              if (b.product_count !== a.product_count) {
                return (b.product_count || 0) - (a.product_count || 0);
              }
              return a.name.localeCompare(b.name);
            })
            .slice(0, 10); // Show top 10 brands
          
          setBrands(sortedBrands);
        } else {
          setError('Failed to load brands');
        }
      } catch (err) {
        setError('Failed to load brands');
        console.error('Brand fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 z-50">
      <div className="py-2">
        {loading ? (
          <div className="px-4 py-2 text-sm text-gray-500">Loading brands...</div>
        ) : error ? (
          <>
            <div className="px-4 py-2 text-sm text-red-500">{error}</div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            {/* Fallback to static brands */}
            <Link 
              href="/brands/raw" 
              className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors"
              onClick={onClose}
            >
              RAW
            </Link>
            <Link 
              href="/brands/puffco" 
              className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors"
              onClick={onClose}
            >
              Puffco
            </Link>
            <Link 
              href="/brands/storz-bickel" 
              className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors"
              onClick={onClose}
            >
              Storz & Bickel
            </Link>
            <Link 
              href="/brands/roor" 
              className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors"
              onClick={onClose}
            >
              ROOR
            </Link>
          </>
        ) : brands.length > 0 ? (
          <>
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors flex justify-between items-center"
                onClick={onClose}
              >
                <span>{brand.name}</span>
                {brand.product_count && brand.product_count > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {brand.product_count}
                  </span>
                )}
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <Link 
              href="/brands" 
              className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium text-dope-orange"
              onClick={onClose}
            >
              View All Brands →
            </Link>
          </>
        ) : (
          <>
            <div className="px-4 py-2 text-sm text-gray-500">No brands available yet</div>
            <div className="px-4 py-2 text-xs text-gray-400">
              Run enhanced sync to populate brands
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <Link 
              href="/brands" 
              className="block px-4 py-2 text-sm hover:bg-dope-orange/20 transition-colors font-medium"
              onClick={onClose}
            >
              View All Brands
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
