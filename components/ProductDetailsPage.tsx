"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Universal Product interface that handles all product types
export interface UniversalProduct {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  vip_price?: number;
  compare_at_price?: number;
  sku: string;
  image_url?: string;
  image_urls?: string[];
  brand_id?: string;
  category_id?: string;
  materials?: string[];
  stock_quantity?: number;
  is_active?: boolean;
  featured?: boolean;
  vip_exclusive?: boolean;
  channels?: string[];
  
  // Enhanced product details
  specs?: any;
  attributes?: any;
  video_urls?: string[];
  weight_g?: number;
  dim_mm?: any;
  
  // Compliance fields
  nicotine_product?: boolean;
  tobacco_product?: boolean;
  requires_lab_test?: boolean;
  lab_test_url?: string;
  batch_number?: string;
  expiration_date?: string;
  
  // Computed fields for display
  brand?: string;
  category?: string;
  material?: string;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

interface ProductDetailsPageProps {
  productId: string;
  showRecommendations?: boolean;
}

export default function ProductDetailsPage({ 
  productId, 
  showRecommendations = true 
}: ProductDetailsPageProps) {
  const [product, setProduct] = useState<UniversalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        
        const storage = getStorage();
        const productData = await storage.getProduct(productId);
        
        if (!productData) {
          setError('Product not found');
          return;
        }

        // Transform and enrich product data
        const enrichedProduct: UniversalProduct = {
          ...productData,
          // Compute display fields
          brand: productData.brand_id || 'DOPE CITY',
          category: productData.category_id || 'Accessories',
          material: Array.isArray(productData.materials) 
            ? productData.materials.join(', ') 
            : productData.materials || 'Premium Quality',
          inStock: (productData.stock_quantity || 0) > 0,
          isNew: productData.featured || false,
          isSale: productData.compare_at_price ? productData.price < productData.compare_at_price : false,
          originalPrice: productData.compare_at_price || undefined,
        };

        setProduct(enrichedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="animate-pulse">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested product could not be found.'}</p>
          <a 
            href="/products" 
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            ← Back to Products
          </a>
        </div>
      </div>
    );
  }

  // Get all available images
  const allImages = [
    product.image_url,
    ...(product.image_urls || [])
  ].filter(Boolean);

  const currentImage = allImages[selectedImageIndex] || 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=800&fit=crop&auto=format';

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log(`Adding ${quantity} of product ${product.id} to cart`);
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Compliance Notice */}
      {(product.nicotine_product || product.tobacco_product) && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Age Restricted Product:</strong> This product is restricted to adults 21+ and may have shipping limitations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Product Section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <Panel className="p-4 md:p-6">
          <div className="aspect-square w-full bg-neutral-100 rounded-lg overflow-hidden mb-4">
            <Image 
              src={currentImage} 
              alt={product.name} 
              width={800} 
              height={800} 
              className="object-cover w-full h-full"
              priority
            />
          </div>
          
          {/* Image Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <Image 
                    src={imageUrl} 
                    alt={`${product.name} view ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </Panel>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.brand && (
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {product.brand}
                </span>
              )}
              {product.isNew && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  NEW
                </span>
              )}
              {product.isSale && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                  SALE
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">
              {product.name}
            </h1>
            
            {product.short_description && (
              <p className="text-lg text-gray-600 mb-4">{product.short_description}</p>
            )}
          </div>

          <MetalDivider />

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              {product.vip_price && (
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  VIP: ${Number(product.vip_price).toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stock_quantity && product.stock_quantity <= 5 && product.inStock && (
                <span className="text-sm text-orange-600">
                  Only {product.stock_quantity} left!
                </span>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
                disabled={!product.inStock}
              >
                {[...Array(Math.min(10, product.stock_quantity || 1))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <MetalDivider />

          {/* Product Information */}
          <div className="space-y-4">
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Product Details</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>SKU:</strong> {product.sku}</li>
                {product.material && <li><strong>Material:</strong> {product.material}</li>}
                {product.category && <li><strong>Category:</strong> {product.category}</li>}
                {product.weight_g && <li><strong>Weight:</strong> {product.weight_g}g</li>}
                {product.batch_number && <li><strong>Batch:</strong> {product.batch_number}</li>}
              </ul>
            </div>

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lab Test Results */}
            {product.lab_test_url && (
              <div>
                <h3 className="font-semibold mb-2">Lab Test Results</h3>
                <a 
                  href={product.lab_test_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  View Certificate of Analysis →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
