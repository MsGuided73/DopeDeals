'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Award, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Minus,
  CheckCircle,
  Info,
  Package,
  Leaf,
  Zap,
  Clock,
  ShoppingCart,
  Lock,
  Search,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { addToCart } from '../lib/cart-utils';
import { ShippingSection } from './ShippingSection';

// Types match your stack
interface EnhancedPDPProps {
  productId?: string; // Make optional if we support direct passing
  product?: any;
  pricing_status?: 'priced' | 'pending' | 'hidden';
  display_price_cents?: number | null;
  compare_at_price_cents?: number | null;
  images?: any[];
  coa?: { url: string | null };
  ingredients?: any;
  ship_restrictions?: any;
  store_policies?: any;
  ui_state?: any;
}

export default function EnhancedPDP(props: EnhancedPDPProps) {
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(!props.product);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(props.product ? props : null);
  
  // Destructure from data or props
  const product = data?.product || props.product;
  const pricing_status = data?.pricing_status || props.pricing_status;
  const display_price_cents = data?.display_price_cents ?? props.display_price_cents;
  const compare_at_price_cents = data?.compare_at_price_cents ?? props.compare_at_price_cents;
  const images = data?.images || props.images || [];
  const coa = data?.coa || props.coa || {};
  const ingredients = data?.ingredients || props.ingredients || {};
  const ship_restrictions = data?.ship_restrictions || props.ship_restrictions || {};
  const ui_state = data?.ui_state || props.ui_state || {};

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'lab' | 'reviews'>('details');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  React.useEffect(() => {
    if (!props.product && props.productId) {
      setLoading(true);
      fetch(`/api/products/${props.productId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load product');
          return res.json();
        })
        .then(json => {
          setData(json);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load product details');
          setLoading(false);
        });
    }
  }, [props.productId, props.product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
        <p>{error || 'Product not found'}</p>
      </div>
    );
  }

  // Helper values
  const rawProduct = data?.raw_product || props.product || {}; 
  const price = display_price_cents ? display_price_cents / 100 : 0;
  const originalPrice = compare_at_price_cents ? compare_at_price_cents / 100 : null;
  const stockCount = rawProduct.stock_quantity || 0; 
  // If we can't find stock data, we might default to inStock for safety, or check ui_state
  // But strictly, raw_product should have it.
  const inStock = stockCount > 0;
  const displayImages = images.length > 0 ? images.map((i: any) => i.url) : ['/api/placeholder/600/600'];

  // Handle Add to Cart
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      refreshCart();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const FAQS = [
    {
      question: 'Is this product legal?',
      answer: 'Yes, this product contains legal hemp-derived compounds and complies with federal regulations (2018 Farm Bill).'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. We ship via USPS with tracking provided.'
    },
    {
      question: 'Is packaging discreet?',
      answer: 'Absolutely. All proprietary packaging is plain and odorless for your privacy.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 font-sans">
      {/* Breadcrumb - Adapted to Next.js Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-emerald-600 cursor-pointer transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-emerald-600 cursor-pointer transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">{product.display_name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl ring-1 ring-slate-200">
              <div className="aspect-square relative group">
                <img 
                  src={displayImages[selectedImage]} 
                  alt={product.display_name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {originalPrice && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      SALE
                    </span>
                  )}
                  {coa.url && (
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      LAB TESTED
                    </span>
                  )}
                </div>

                {/* Wishlist & Share */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} 
                    />
                  </button>
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {displayImages.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-xl overflow-hidden aspect-square transition-all ${
                    selectedImage === index 
                      ? 'ring-4 ring-emerald-500 shadow-lg scale-105' 
                      : 'ring-1 ring-slate-200 hover:ring-2 hover:ring-emerald-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.display_name} ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-200 text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-900">Lab Tested</div>
                <div className="text-xs text-slate-600">3rd Party</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200 text-center">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-900">Free Shipping</div>
                <div className="text-xs text-slate-600">Orders $75+</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-200 text-center">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-900">Premium</div>
                <div className="text-xs text-slate-600">Quality</div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide">
                {product.product_type || 'Premium'}
              </span>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                {product.display_name}
              </h1>
            </div>

            {/* Rating (Placeholder logic until reviews implemented) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < 5 // Defaulting to 5 stars for now
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-slate-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-slate-900 font-semibold">5.0</span>
              <span className="text-slate-600">(New Arrival)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              {pricing_status === 'pending' ? (
                <span className="text-2xl font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">Coming Soon</span>
              ) : (
                <>
                  <span className="text-5xl font-bold text-slate-900">
                    ${price.toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-2xl text-slate-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                  {originalPrice && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description Short */}
            <div className="text-slate-600 text-lg leading-relaxed space-y-4">
              {/* If we have a short description, use it. Otherwise truncate regular description */}
              <p>{product.short_description || "Experience the Highway Standard."}</p>
            </div>

            {/* Shipping Restrictions Card (Your Brain) */}
            <ShippingSection restrictions={ship_restrictions} />

            {/* Stock Status */}
            <div>
              {inStock ? (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200 w-fit">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">In Stock - Ready to Ship</span>
                </div>
              ) : (
                 <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200 w-fit">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Cart */}
            {inStock && pricing_status !== 'pending' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="p-4 hover:bg-slate-50 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-5 h-5 text-slate-700" />
                      </button>
                      <span className="px-8 py-4 text-xl font-bold text-slate-900 min-w-[80px] text-center">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => setQuantity(q => Math.min(stockCount || 10, q + 1))}
                        className="p-4 hover:bg-slate-50 transition-colors"
                        disabled={quantity >= stockCount}
                      >
                        <Plus className="w-5 h-5 text-slate-700" />
                      </button>
                    </div>
                    <span className="text-slate-600">
                      Total: <span className="text-2xl font-bold text-slate-900">
                        ${(price * quantity).toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-5 px-8 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                  >
                    {isAdding ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6" />
                        ADD TO CART
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
           
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-slate-200">
            <div className="flex gap-4 md:gap-8 overflow-x-auto">
              {[
                { id: 'details', label: 'Product Details', icon: Info },
                { id: 'ingredients', label: 'Ingredients', icon: Leaf },
                { id: 'lab', label: 'Lab Testing', icon: ShieldCheck },
                { id: 'reviews', label: 'Reviews', icon: Star }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 pb-4 px-2 font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-emerald-600 border-b-4 border-emerald-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="py-12">
            {activeTab === 'details' && (
              <div className="prose max-w-none text-slate-700">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                   {/* We render standard HTML description here */}
                   {product.description ? (
                      <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\\n/g, '<br/>') }} />
                   ) : (
                    <p>No description available.</p>
                   )}
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Ingredients</h3>
                {ingredients.contains && ingredients.contains.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {ingredients.contains.map((ingredient: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 capitalize">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Ingredients info not available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'lab' && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-start gap-4 mb-8">
                  <ShieldCheck className="w-12 h-12 text-emerald-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Lab Testing & Transparency</h3>
                    <p className="text-slate-600">
                      This product has been tested by a licensed third-party laboratory. View the Certificate 
                      of Analysis (COA) for detailed potency and safety results.
                    </p>
                  </div>
                </div>

                {coa.url ? (
                  <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border-2 border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-slate-900">Certificate of Analysis</span>
                      <span className="text-sm text-slate-600">Verified</span>
                    </div>
                    <a 
                      href={coa.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      View COA (PDF)
                    </a>
                  </div>
                ) : (
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center text-slate-500">
                      COA currently being digitized. Please check back soon.
                   </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                   <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                   <h3 className="text-2xl font-bold text-slate-900 mb-2">Reviews Coming Soon</h3>
                   <p className="text-slate-600">Be the first to review this new arrival!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-lg">{faq.question}</span>
                  {expandedFAQ === index ? <ChevronUp className="w-6 h-6 text-slate-600" /> : <ChevronDown className="w-6 h-6 text-slate-600" />}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 border-t border-slate-100 mt-2 pt-4">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
