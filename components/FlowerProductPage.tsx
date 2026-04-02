"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { ChevronRight, Plus, Minus, Heart, Star, ShoppingCart, Share2 } from 'lucide-react';
import ProductGallery from '../app/components/ProductGallery';
import FlavorSelector from '../app/components/FlavorSelector';
import { addToCart } from '../app/lib/cart-utils';
import { addToRecentlyViewed } from '../app/lib/recentlyViewed';
import GlobalMasthead from '../app/components/GlobalMasthead';
import { ConsumableProductDetails } from './ConsumableProductDetails';

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
  brand_id?: string;
  category_id?: string;
  
  // Strain specific details
  thca_pct?: string;
  effects?: string[];
  flavors?: string[];
  helps_with?: string[];
  situation?: string;
  style?: string; // flower, preroll
  size?: string;
}

interface FlowerProductPageProps {
  productId: string;
}

export default function FlowerProductPage({ productId }: FlowerProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'once' | 'subscribe'>('once');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        
        // Mocking strain details if they don't exist in DB yet
        const enrichedData = {
          ...data,
          thca_pct: data.thca_pct || "31.57%",
          effects: data.effects || ["Euphoric and Uplifting", "Relaxing and Tingling", "Appetite-Boosting"],
          flavors: data.flavors || ["Sweet and fruity", "Grapes", "Apple", "Fresh berries"],
          helps_with: data.helps_with || ["Insomnia", "Sleep issues", "Chronic pain", "Muscle spasms", "Depression", "Stress"],
          situation: data.situation || "Its balance of mental uplift and physical relaxation makes it a versatile option for both daytime and evening use",
          size: data.size || "3.5g"
        };
        
        setProduct(enrichedData);
        addToRecentlyViewed(productId);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchProduct();
  }, [productId]);

  if (loading) return <div className="min-h-screen bg-white animate-pulse"><GlobalMasthead /><div className="max-w-7xl mx-auto p-12 h-96 bg-gray-50 rounded-3xl mt-12" /></div>;
  if (error || !product) return <div className="min-h-screen bg-white"><GlobalMasthead /><div className="text-center py-20">Product Not Found</div></div>;

  const inStock = (product.stock_quantity || 0) > 0;

  // Create unique image list for gallery and dropdown to prevent duplicates
  const mainImage = product.image_url;
  const rawImages = mainImage ? [mainImage, ...(product.image_urls || [])] : (product.image_urls || []);
  const allImages = Array.from(new Set(rawImages.filter(Boolean) as string[]));

  return (
    <div className="min-h-screen bg-white font-inter">
      <GlobalMasthead />

      {/* Navigation Breadcrumb */}
      <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 pt-4">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-widest">
          <a href="/" className="hover:text-white transition-colors">Home</a> <ChevronRight size={12} /> 
          <a href="/thca-flower" className="hover:text-white transition-colors">THCA Flower</a> <ChevronRight size={12} /> 
          <span className="text-white font-black">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid gap-8 md:gap-12 lg:gap-16 lg:grid-cols-2">
          
          {/* Left: Product Gallery */}
          <div>
            <ProductGallery
              image_urls={allImages}
              productName={product.name}
              productId={product.id}
              viewMode="detail"
              selectedVariant={selectedVariant}
              onVariantChange={(index) => setSelectedVariant(index)}
              className="rounded-[2.5rem] overflow-hidden"
            />
          </div>

          {/* Right: Product Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-sm rounded-full">
                  Premium {product.size}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-xs font-bold text-gray-500">(74 reviews)</span>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900">
                ${Number(product.sale_price || product.price).toFixed(2)}
              </div>
            </div>

            {/* Strain Stats Box */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-4 leading-relaxed">
              <div className="text-sm">
                <span className="font-black uppercase tracking-tighter mr-2">THCA:</span> 
                <span className="text-gray-600 font-bold">{product.thca_pct}</span>
              </div>
              <div className="text-sm">
                <span className="font-black uppercase tracking-tighter mr-2">Effects:</span> 
                <span className="text-gray-600 font-bold">{product.effects?.join(", ")}</span>
              </div>
              <div className="text-sm">
                <span className="font-black uppercase tracking-tighter mr-2">Flavours:</span> 
                <span className="text-gray-600 font-bold">{product.flavors?.join(", ")}</span>
              </div>
              <div className="text-sm">
                <span className="font-black uppercase tracking-tighter mr-2">Helps with:</span> 
                <span className="text-gray-600 font-bold">{product.helps_with?.join(", ")}</span>
              </div>
              <div className="text-sm pt-2 italic border-t border-gray-50">
                <span className="font-black uppercase tracking-tighter mr-2 not-italic">Situation/use case:</span> 
                <span className="text-gray-600 font-bold">{product.situation}</span>
              </div>
            </div>

            <div 
              className="text-gray-600 text-sm font-bold leading-relaxed description-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((product.description || product.short_description || '').replace(/\\n/g, '<br/>')) }}
            />

            {/* Variant Selector (Flavor Dropdown) */}
            {allImages.length > 1 && (
              <FlavorSelector
                imageUrls={allImages}
                selectedVariant={selectedVariant}
                onVariantChange={(index) => setSelectedVariant(index)}
                className="pt-4"
              />
            )}

            {/* Purchase Options */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="purchase" 
                    checked={purchaseType === 'once'} 
                    onChange={() => setPurchaseType('once')}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm font-bold text-gray-700 group-hover:text-black">Purchase one time</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="purchase" 
                    checked={purchaseType === 'subscribe'} 
                    onChange={() => setPurchaseType('subscribe')}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm font-bold text-gray-700 group-hover:text-black">Subscribe and save up to 20%</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-12">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 hover:bg-gray-50"><Minus size={14}/></button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="px-4 hover:bg-gray-50"><Plus size={14}/></button>
                </div>
                <button 
                  onClick={() => addToCart(product.id, quantity)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white h-12 md:h-14 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/30 hover:scale-[1.02]"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>

              <button className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                <Heart size={14} /> Add to wishlist
              </button>
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-2 text-xs font-bold text-gray-400">
              <div><span className="text-gray-900 uppercase">Categories:</span> Flower, THCA, Premium</div>
              <div><span className="text-gray-900 uppercase">Tags:</span> flower, Hybrid, indica dominant</div>
              <div className="flex items-center gap-4 pt-4">
                <span className="text-gray-900 uppercase">Share:</span>
                <div className="flex gap-3">
                   <Share2 size={16} className="cursor-pointer hover:text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConsumableProductDetails product={product} />
      </main>
    </div>
  );
}
