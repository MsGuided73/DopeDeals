"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, Minus, Shield, Beaker, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Star, ShoppingCart } from 'lucide-react';
import ProductGallery from '../app/components/ProductGallery';
import FlavorSelector from '../app/components/FlavorSelector';
import { addToCart } from '../app/lib/cart-utils';
import { addToRecentlyViewed } from '../app/lib/recentlyViewed';
import GlobalMasthead from '../app/components/GlobalMasthead';
import { ConsumableProductDetails } from './ConsumableProductDetails';

interface Variation {
  id: string;
  name: string;
  image_url?: string;
  price: number;
  sale_price?: number;
  inStock: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  description_md?: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  sku: string;
  image_url?: string;
  image_urls?: string[];
  stock_quantity?: number;
  materials?: string[];
  brand_id?: string;
  category_id?: string;
  benefits?: string[];
  ingredients?: string[];
  suggested_use?: string;
  lab_test_url?: string;
  warnings?: string[];
  variations?: Variation[];
}

interface SimpleProductPageProps {
  productId: string;
  isConsumable?: boolean;
}

const FAQ_ITEMS = [
  {
    question: "Is this product legal?",
    answer: "Yes, all products on our site contain less than 0.3% Delta 9 THC on a dry weight basis, making them federally legal under the 2018 Farm Bill. However, state laws vary, so please check your local regulations."
  },
  {
    question: "How long does shipping take?",
    answer: "We typically process orders within 1-2 business days. Shipping usually takes 3-5 business days depending on your location. You will receive a tracking number via email once your order ships."
  },
  {
    question: "Do you offer lab tests?",
    answer: "Absolutely. Transparency is core to our mission. You can find the Certificate of Analysis (COA) for this product in the 'Lab Test' section below or by scanning the QR code on the packaging."
  },
  {
    question: "What is the return policy?",
    answer: "Due to the nature of our products, we can only accept returns on unopened and unused items within 14 days of delivery. If your product arrived damaged, please contact our support team immediately."
  }
];

export default function SimpleProductPage({ productId, isConsumable = false }: SimpleProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json();
        setProduct(productData);

        addToRecentlyViewed(productId);
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
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse grid gap-12 md:grid-cols-2">
            <div className="aspect-square bg-gray-200 rounded-2xl"></div>
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 text-red-600">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 font-inter">Product Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">{error || 'The requested product could not be found.'}</p>
          <a 
            href="/products" 
            className="inline-flex items-center px-8 py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all hover:scale-105"
          >
            ← Back to Products
          </a>
        </div>
      </div>
    );
  }

  const inStock = (product.stock_quantity || 0) > 0;
  const savings = product.sale_price ? Number(product.price) - Number(product.sale_price) : 0;
  const discountPercent = product.sale_price ? Math.round((savings / Number(product.price)) * 100) : 0;

  // Create unique image list for gallery to prevent duplicates
  const mainImage = product.image_url;
  const rawImages = mainImage ? [mainImage, ...(product.image_urls || [])] : (product.image_urls || []);
  const allImages = Array.from(new Set(rawImages.filter(Boolean) as string[]));

  return (
    <div className="min-h-screen bg-white font-inter">
      <GlobalMasthead />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <a href="/" className="hover:text-black transition-colors">Home</a>
            <ChevronRight size={14} />
            <a href="/products" className="hover:text-black transition-colors">Products</a>
            <ChevronRight size={14} />
            <span className="text-black truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-16 lg:grid-cols-2 mb-20">
          
          {/* Left: Product Images & Variants */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <ProductGallery
                image_urls={allImages}
                productName={product.name}
                productId={product.id}
                viewMode="detail"
                selectedVariant={selectedVariant}
                onVariantChange={(index) => setSelectedVariant(index)}
                className="rounded-[2.5rem] overflow-hidden"
              />

              {/* Variant Selector (Flavor List) - NOW UNDER THE IMAGE */}
              {product.variations && product.variations.length > 0 && (
                <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <FlavorSelector
                    variations={product.variations}
                    currentProductId={product.id}
                  />
                </div>
              )}
              
              {/* Trust Badges under gallery/selector */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tighter">3rd-Party</p>
                    <p className="text-xs text-gray-500 font-bold">Lab Tested</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tighter">Highest</p>
                    <p className="text-xs text-gray-500 font-bold">Quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {product.brand_id && (
                  <span className="text-sm font-black text-dope-orange-500 uppercase tracking-widest px-3 py-1 bg-dope-orange-50 rounded-full">
                    {product.brand_id}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-sm font-black text-white uppercase tracking-widest px-3 py-1 bg-red-600 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 py-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <span className="text-sm font-bold text-gray-500">(241 Reviews)</span>
              </div>
              
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-gray-900">
                  ${Number(product.sale_price || product.price).toFixed(2)}
                </span>
                {product.sale_price && (
                  <span className="text-2xl text-gray-400 line-through font-bold">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div 
              className="prose prose-lg text-gray-600 max-w-none font-bold leading-relaxed description-content"
              dangerouslySetInnerHTML={{ __html: (product.short_description || product.description_md || product.description || '').replace(/\\n/g, '<br/>') }}
            />

            {/* Add to Cart Section */}
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black uppercase tracking-widest text-gray-500">Quantity:</span>
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= (product.stock_quantity || 10)}
                      className="p-3 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black uppercase tracking-widest ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {inStock ? 'In Stock' : 'Sold Out'}
                  </p>
                  {inStock && <p className="text-xs font-bold text-gray-400">{product.stock_quantity} available</p>}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className="w-full flex items-center justify-center gap-4 bg-black text-white py-5 px-8 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-300 transition-all hover:scale-[1.02] shadow-xl"
              >
                {isAddingToCart ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={24} />
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-6 text-xs font-black uppercase tracking-widest text-gray-400">
                <span className="flex items-center gap-2"><Shield size={14} /> Secure Checkout</span>
                <span className="flex items-center gap-2"><Beaker size={14} /> COA Guaranteed</span>
              </div>
            </div>

          </div>
        </div>

        {isConsumable && <ConsumableProductDetails product={product} />}

        {/* FAQ Section */}
        <section className="py-20 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-widest">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left font-black uppercase tracking-widest hover:bg-gray-100 transition-colors"
                  >
                    {faq.question}
                    {openFaq === index ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {openFaq === index && (
                    <div className="p-6 pt-0 font-bold text-gray-600 leading-relaxed border-t border-gray-100/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews Summary Placeholder */}
        <section className="py-20 border-t border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-black mb-8 uppercase tracking-widest">Customer Reviews</h2>
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-[3rem] border border-gray-100">
              <div className="text-6xl font-black mb-2">4.8</div>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={32} fill="currentColor" />)}
              </div>
              <p className="text-xl font-bold text-gray-500 mb-8">Based on 241 Verified Reviews</p>
              <button className="px-12 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                Write A Review
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
