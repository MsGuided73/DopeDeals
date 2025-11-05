"use client";
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToCart } from '../lib/cart-utils';
import { useFavorites } from '../hooks/useFavorites';
import { toast } from 'react-hot-toast';

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
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const scrollContainer = document.querySelector('.featured-products-scroll') as HTMLElement;
      if (scrollContainer) {
        const scrollSpeed = 1; // pixels per frame
        const interval = setInterval(() => {
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
            scrollContainer.scrollLeft = 0; // Reset to beginning
          } else {
            scrollContainer.scrollLeft += scrollSpeed;
          }
        }, 50); // Faster interval for snappier movement

        return () => clearInterval(interval);
      }
    }
  }, [products]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/featured/products?limit=12');

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status text
        }
        console.error('Featured products API error:', errorMessage);
        throw new Error(`Failed to fetch featured products: ${errorMessage}`);
      }

      const data = await response.json();

      if (!data.products) {
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

  const transformProductForCard = (product: Product) => {
    // Clean image URL to remove trailing characters that Next.js Image rejects
    const cleanImageUrl = (url: string | null): string | null => {
      if (!url) return null;
      // Remove trailing commas, spaces, and trailing characters that Next.js Image rejects
      return url.trim().replace(/[,.\s]+$/, '');
    };

    const primaryImageUrl = cleanImageUrl(product.image_url) ||
                           (product.image_urls && product.image_urls.length > 0
                            ? cleanImageUrl(product.image_urls[0]) : null);

    // Ensure price is a valid number
    const price = product.our_price && typeof product.our_price === 'number' && !isNaN(product.our_price)
      ? product.our_price
      : 0;

    return {
      id: product.id,
      name: product.name || 'Unnamed Product',
      price: price.toString(),
      image_url: primaryImageUrl || undefined,
      featured: product.featured,
      stock_quantity: product.stock_quantity,
      brand_name: product.brand_name || null, // Changed from 'Unknown Brand' to null for better conditional rendering
      short_description: getProductDescription(product),
      description: getProductDescription(product),
      sku: product.sku || '',
      compare_at_price: product.sale_price && product.sale_price < product.our_price ? product.sale_price : undefined,
      discount_percentage: product.sale_price && product.sale_price < product.our_price
        ? Math.round(((product.our_price - product.sale_price) / product.our_price) * 100)
        : undefined,
    };
  };

  // Memoize product transformations to prevent expensive recalculations on every render
  const transformedProducts = useMemo(() => {
    return products.slice(0, 8).map(product => ({
      ...transformProductForCard(product),
      originalProduct: product
    }));
  }, [products]);

  if (loading) {
    return (
      <section className="mt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-black mb-4">
            HOT PRODUCTS
          </h1>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-4 px-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse flex-shrink-0 w-96">
              <div className="p-4">
                <div className="h-6 bg-muted-foreground/30 rounded mb-2"></div>
                <div className="h-4 bg-muted-foreground/20 rounded mb-4"></div>
              </div>
              <div className="aspect-square bg-muted h-64 mx-4 rounded-lg"></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
                  <div className="h-8 bg-muted-foreground/30 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-black mb-4">
            HOT PRODUCTS
          </h1>
          <p className="text-red-500 mt-6">Error loading featured products: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-24">
      <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-black mb-4">
          HOT PRODUCTS
        </h1>
      </div>

      <div className="text-center mb-8">
        <Link
          href="/products"
          className="inline-block px-6 py-3 text-green-600 border-2 border-green-600 font-bold text-base rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg"
        >
          Shop all →
        </Link>
      </div>

      {products.length > 0 ? (
        <>
          {/* Mobile: Grid layout */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4">
              {transformedProducts.slice(0, 6).map((transformedProduct, index) => {
                // Get the original product for cart/favorites functionality
                const product = transformedProduct.originalProduct;
                return (
                  <Link
                    key={transformedProduct.id}
                    href={`/product/${transformedProduct.id}`}
                    className="product-card group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
                  >
                    <div className="p-4 flex flex-col">
                      {/* TOP SECTION: Brand Name and Product Name */}
                      <div className="mb-4">
                        <p className="text-sm font-bold text-dope-orange-600 mb-1 uppercase tracking-wide">
                          {transformedProduct.brand_name?.toUpperCase() || 'STORE BRAND'}
                        </p>
                        <h3 className="font-bold text-gray-900 text-xl leading-tight line-clamp-2 group-hover:text-dope-orange-700 transition-colors">
                          {transformedProduct.name}
                        </h3>
                      </div>

                      {/* MIDDLE SECTION: Image with badges */}
                      <div className="relative w-full h-80 bg-gray-50 overflow-hidden rounded-lg mb-4">
                        {transformedProduct.image_url ? (
                          <img
                            src={transformedProduct.image_url}
                            alt={transformedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📦</div>
                              <div className="text-sm font-medium">No Image</div>
                            </div>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {transformedProduct.featured && (
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              ⭐ Featured
                            </div>
                          )}
                          {transformedProduct.discount_percentage && (
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              -{transformedProduct.discount_percentage}% OFF
                            </div>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <button
                            className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 lg:opacity-100 transition-all duration-300 hover:scale-110"
                            onClick={async (e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              if (!product.sku) {
                                console.error('Product SKU missing for favorites');
                                toast.error('Unable to favorite this product');
                                return;
                              }

                              const success = await toggleFavorite(product.sku.toString());
                              if (success) {
                                const isCurrentlyFavorite = isFavorite(product.sku.toString());
                                toast.success(isCurrentlyFavorite ? 'Added to favorites!' : 'Removed from favorites');
                              } else {
                                toast.error('Failed to update favorites');
                              }
                            }}
                          >
                            <svg
                              className={`w-5 h-5 transition-colors duration-200 ${
                                isFavorite(product.sku || '') ? 'text-red-500 fill-red-500' : 'text-gray-700'
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Short description */}
                      <p className="text-base font-semibold text-gray-600 mb-4 line-clamp-2">
                        {transformedProduct.short_description}
                      </p>

                      {/* BOTTOM SECTION: Price and Buttons */}
                      <div className="mt-auto">
                        <div className="mb-4">
                          {/* Enhanced price display with fallbacks */}
                          <div className="text-2xl font-bold text-gray-900">
                            {transformedProduct.price && !isNaN(parseFloat(transformedProduct.price))
                              ? `$${parseFloat(transformedProduct.price).toFixed(2)}`
                              : 'Price Unavailable'
                            }
                          </div>
                        </div>

                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await addToCart(product.id, 1);
                            } catch (error) {
                              console.error('Failed to add to cart:', error);
                            }
                          }}
                          className="w-full px-4 py-2.5 bg-transparent text-green-800 border-2 border-green-800 font-bold rounded-full transition-all duration-300 text-center text-base hover:bg-green-800 hover:text-white hover:scale-105 hover:shadow-lg"
                          style={{
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                            letterSpacing: '0.05em',
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop: Horizontal scrolling */}
          <div className="hidden lg:flex lg:overflow-x-auto lg:gap-6 lg:pb-4 lg:px-4 featured-products-scroll">
            {transformedProducts.map((transformedProduct, index) => {
              // Get the original product for cart/favorites functionality
              const product = transformedProduct.originalProduct;
              return (
                <Link
                  key={transformedProduct.id}
                  href={`/product/${transformedProduct.id}`}
                  className="product-card group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-96"
                >
                  <div className="p-4 flex flex-col">
                    {/* TOP SECTION: Brand Name and Product Name */}
                    <div className="mb-4">
                      <p className="text-sm font-bold text-dope-orange-600 mb-1 uppercase tracking-wide">
                        {transformedProduct.brand_name?.toUpperCase() || 'STORE BRAND'}
                      </p>
                      <h3 className="font-bold text-gray-900 text-xl leading-tight line-clamp-2 group-hover:text-dope-orange-700 transition-colors">
                        {transformedProduct.name}
                      </h3>
                    </div>

                    {/* MIDDLE SECTION: Image with badges */}
                    <div className="relative w-full h-80 bg-gray-50 overflow-hidden rounded-lg mb-4">
                      {transformedProduct.image_url ? (
                        <img
                          src={transformedProduct.image_url}
                          alt={transformedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📦</div>
                            <div className="text-sm font-medium">No Image</div>
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {transformedProduct.featured && (
                          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ⭐ Featured
                          </div>
                        )}
                        {transformedProduct.discount_percentage && (
                          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            -{transformedProduct.discount_percentage}% OFF
                          </div>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 lg:opacity-100 transition-all duration-300 hover:scale-110"
                          onClick={async (e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            if (!product.sku) {
                              console.error('Product SKU missing for favorites');
                              toast.error('Unable to favorite this product');
                              return;
                            }

                            const success = await toggleFavorite(product.sku.toString());
                            if (success) {
                              const isCurrentlyFavorite = isFavorite(product.sku.toString());
                              toast.success(isCurrentlyFavorite ? 'Added to favorites!' : 'Removed from favorites');
                            } else {
                              toast.error('Failed to update favorites');
                            }
                          }}
                        >
                          <svg
                            className={`w-5 h-5 transition-colors duration-200 ${
                              isFavorite(product.sku || '') ? 'text-red-500 fill-red-500' : 'text-gray-700'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          />
                        </svg>
                      </button>
                      </div>
                    </div>

                    {/* Short description */}
                    <p className="text-base font-semibold text-gray-600 mb-4 line-clamp-2">
                      {transformedProduct.short_description}
                    </p>

                    {/* BOTTOM SECTION: Price and Buttons */}
                    <div className="mt-auto">
                      <div className="mb-4">
                        {/* Enhanced price display with fallbacks */}
                        <div className="text-2xl font-bold text-gray-900">
                          {transformedProduct.price && !isNaN(parseFloat(transformedProduct.price))
                            ? `$${parseFloat(transformedProduct.price).toFixed(2)}`
                            : 'Price Unavailable'
                          }
                        </div>
                      </div>

                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await addToCart(product.id, 1);
                          } catch (error) {
                            console.error('Failed to add to cart:', error);
                          }
                        }}
                        className="w-full px-4 py-2.5 bg-transparent text-green-800 border-2 border-green-800 font-bold rounded-full transition-all duration-300 text-center text-base hover:bg-green-800 hover:text-white hover:scale-105 hover:shadow-lg"
                        style={{
                          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                          letterSpacing: '0.05em',
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No featured products available</div>
          <p className="text-gray-400">Check back soon for new products with images!</p>
        </div>
      )}
    </section>
  );
}
