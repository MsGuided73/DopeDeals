"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import GlobalMasthead from '../app/components/GlobalMasthead';
import { addToCart } from '../app/lib/cart-utils';

interface Product {
  id: string;
  name: string;
  description?: string;
  description_md?: string;
  short_description?: string;
  price: number;
  sku: string;
  image_url?: string;
  stock_quantity?: number;
  materials?: string[];
  brand_id?: string;
  category_id?: string;
}

interface SimpleProductPageProps {
  productId: string;
}

export default function SimpleProductPage({ productId }: SimpleProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        
        // Fetch product from API
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || !inStock || isAddingToCart) return;

    setIsAddingToCart(true);
    const success = await addToCart(productId, quantity);

    if (success) {
      // Reset quantity after successful add
      setQuantity(1);
    }

    setIsAddingToCart(false);
  };

  const incrementQuantity = () => {
    if (quantity < Math.min(10, product?.stock_quantity || 1)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested product could not be found.'}</p>
          <a 
            href="/products" 
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            ← Back to Products
          </a>
        </div>
      </div>
    );
  }

  const imageUrl = product.image_url;
  const inStock = (product.stock_quantity || 0) > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Global Masthead with Search Bar */}
      <GlobalMasthead />

      {/* Product Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="text-sm">
            <a href="/products" className="text-gray-600 hover:text-black">Products</a>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-black font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-12 md:grid-cols-2">
          
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <div className="text-lg font-medium">No Image Available</div>
                    <div className="text-sm">Product image coming soon</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            
            {/* Product Title & Brand */}
            <div>
              {product.brand_id && (
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  {product.brand_id}
                </p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            {(product.description_md || product.description) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="text-gray-700 leading-relaxed">
                  {product.description_md || product.description}
                </div>
              </div>
            )}

            {/* Product Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="font-medium text-gray-900 w-24">SKU:</dt>
                  <dd className="text-gray-700">{product.sku}</dd>
                </div>
                {product.materials && product.materials.length > 0 && (
                  <div className="flex">
                    <dt className="font-medium text-gray-900 w-24">Material:</dt>
                    <dd className="text-gray-700">{product.materials.join(', ')}</dd>
                  </div>
                )}
                {product.category_id && (
                  <div className="flex">
                    <dt className="font-medium text-gray-900 w-24">Category:</dt>
                    <dd className="text-gray-700">{product.category_id}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4 pt-6">
              {inStock ? (
                <>
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3">
                    <label htmlFor="quantity" className="font-medium text-gray-900 text-sm">
                      Quantity:
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>

                      <span className="w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center font-medium text-gray-900">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={incrementQuantity}
                        disabled={quantity >= Math.min(10, product.stock_quantity || 1)}
                        className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    <span className="text-sm text-gray-500">
                      ({product.stock_quantity || 0} available)
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock || isAddingToCart}
                    className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-lg font-semibold text-lg cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
