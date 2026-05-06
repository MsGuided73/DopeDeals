"use client";

import { useEffect, useState, type MouseEvent } from 'react';
import Link from 'next/link';

import AutoScrollContainer, { type ProductViewMode } from './AutoScrollContainer';
import ViewModeToggle from './ViewModeToggle';
import UniversalProductCard from './UniversalProductCard';
import { addToCart } from '../lib/cart-utils';
import { useCompliance } from '../contexts/ComplianceContext';

interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  our_price: number;
  sale_price?: number | null;
  fire_price?: number | null;
  image_url: string | null;
  image_urls?: string[] | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  brand_id: string | null;
  brand_name: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  rating?: number;
  review_count?: number;
}

interface ProductCardData {
  id: string;
  name: string;
  price: string;
  image_url?: string;
  featured: boolean;
  stock_quantity: number;
  brand_name: string;
  short_description: string;
  description: string;
  sku: string;
  compare_at_price?: number;
  discount_percentage?: number;
  rating?: number;
  review_count?: number;
}

const formatPrice = (value: string | number): string => {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00';
};

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ProductViewMode>('manual');
  
  const { restrictedProductIds, checkProductEligibility, userZipCode } = useCompliance();

  useEffect(() => {
    void fetchProducts();
    void fetchPersistedFavorites();
  }, []);

  // Pre-fetch eligibility for all products once they are loaded
  useEffect(() => {
    if (userZipCode && products.length > 0) {
      const idsToCheck = products.map(p => p.id).filter(id => !restrictedProductIds.includes(id));
      if (idsToCheck.length > 0) {
        checkProductEligibility(idsToCheck);
      }
    }
  }, [userZipCode, products, restrictedProductIds, checkProductEligibility]);

  const fetchPersistedFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        if (data.favorites && Array.isArray(data.favorites)) {
          setFavorites(new Set(data.favorites));
        }
      }
    } catch {
      // Network errors are non-critical; local state remains empty.
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/featured');

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, fall back to the HTTP status text.
        }
        console.error('Featured products API error:', errorMessage);
        throw new Error(`Failed to fetch featured products: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.products) {
        console.warn('No featured products data received');
        setProducts([]);
        return;
      }

      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getProductDescription = (product: Product): string => {
    return product.short_description || product.description || 'Premium quality product';
  };

  const transformProductForCard = (product: Product): ProductCardData => {
    const primaryImageUrl =
      product.image_url ||
      (product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : null);

    return {
      id: product.id,
      name: product.name,
      price: (product.sale_price && product.sale_price < (product.our_price ?? 0) 
        ? product.sale_price 
        : (product.our_price ?? 0)).toString(),
      image_url: primaryImageUrl || undefined,
      featured: product.featured,
      stock_quantity: product.stock_quantity,
      brand_name: product.brand_name || 'Unknown Brand',
      short_description: getProductDescription(product),
      description: getProductDescription(product),
      sku: product.sku || '',
      compare_at_price:
        product.sale_price && product.sale_price < (product.our_price ?? 0) 
          ? product.our_price 
          : undefined,
      discount_percentage:
        product.sale_price && product.sale_price < (product.our_price ?? 0) && (product.our_price ?? 0) > 0
          ? Math.round((((product.our_price ?? 0) - product.sale_price) / (product.our_price ?? 0)) * 100)
          : undefined,
      rating: product.rating,
      review_count: product.review_count,
    };
  };

  const handleFavorite = async (productId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const isCurrentlyFavorite = favorites.has(productId);

    setFavorites((previous) => {
      const next = new Set(previous);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    try {
      const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSku: productId }),
      });
      if (!response.ok && response.status !== 401) {
        throw new Error(`API returned ${response.status}`);
      }
    } catch {
      setFavorites((previous) => {
        const next = new Set(previous);
        if (isCurrentlyFavorite) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
    }
  };

  const handleAddToCart = async (productId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await addToCart(productId, 1);
    } catch (err) {
      console.error('Error adding item to cart:', err);
    }
  };

  const renderProductCard = (product: Product, variant: 'mobile' | 'desktop') => {
    return (
      <UniversalProductCard
        key={product.id}
        product={{
          ...product,
          price: product.sale_price && product.sale_price < (product.our_price ?? 0) 
            ? product.sale_price 
            : (product.our_price ?? 0),
          compare_at_price: product.sale_price && product.sale_price < (product.our_price ?? 0) 
            ? product.our_price 
            : undefined,
        }}
        viewMode="grid"
        size="medium"
        showQuickView={false}
        context="homepage"
        className={variant === 'desktop' ? 'w-[260px] flex-shrink-0' : ''}
      />
    );
  };


  return (
    <section style={{ background: '#ffffff', padding: '60px 0 72px', position: 'relative' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 16px' }}>
        <h2 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", color: '#1c1208', fontSize: 'clamp(32px,5vw,64px)', fontWeight: 400, lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
          HOT PRODUCTS
        </h2>
        <p style={{ fontFamily: "'Fira Sans','Inter',sans-serif", fontSize: '15px', color: '#5B6560', margin: '10px 0 0', maxWidth: '500px', marginInline: 'auto', lineHeight: 1.5 }}>
          In High Demand
        </p>
        <div style={{ borderTop: '1px dashed rgba(20,92,60,0.4)', margin: '20px auto 0', maxWidth: '360px' }} />
      </div>

      {/* Mobile grid */}
      <div className="block lg:hidden" style={{ padding: '0 16px' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((product) => renderProductCard(product, 'mobile'))}
        </div>
      </div>

      {/* Desktop view — toggle between auto-scroll, manual scroll, and grid */}
      <div className="hidden lg:block" style={{ padding: '0 24px' }}>
        <div className="max-w-7xl mx-auto flex justify-end mb-4">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>
        <AutoScrollContainer mode={viewMode}>
          {products.map((product) => renderProductCard(product, 'desktop'))}
        </AutoScrollContainer>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '44px' }}>
        <Link
          href="/hot-products"
          style={{ display: 'inline-block', background: 'transparent', color: '#2d8f47', fontFamily: "'BebasNeue','Bebas Neue',sans-serif", fontSize: '19px', letterSpacing: '0.06em', padding: '12px 48px', textDecoration: 'none', border: '2px solid #2d8f47', borderRadius: '4px', transition: 'background 0.18s, color 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'radial-gradient(ellipse at 50% 35%, #3cb05b 0%, #2d8f47 55%, #226b35 100%)'; (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#2d8f47'; }}
        >
          SHOP ALL HOT PRODUCTS →
        </Link>
      </div>

    </section>
  );
}

