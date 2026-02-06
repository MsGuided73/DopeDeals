"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronRight, 
  Plus, 
  Minus, 
  Shield, 
  Beaker, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  ShoppingCart,
  Package,
  Truck,
  Lock,
  FileText,
  Clock,
  MapPin,
  Info,
  ExternalLink,
  Search,
  Loader2,
  Leaf
} from 'lucide-react';
import { addToCart } from '../lib/cart-utils';
import { addToRecentlyViewed } from '../lib/recentlyViewed';
import { getComplianceInfo } from '../../lib/compliance-data';
import GlobalMasthead from './GlobalMasthead';

// ============================================================================
// Types
// ============================================================================

interface PDPImage {
  url: string;
  role: 'hero' | 'gallery' | 'label';
  is_primary: boolean;
  sort_order: number;
}

interface PDPIngredients {
  contains: string[];
  allergens: string[];
  dietary: string[];
  warnings: string[];
  source: 'label' | 'manufacturer' | 'unknown';
  last_verified_at: string | null;
}

interface PDPShipRestrictions {
  restricted_states: string[];
  restricted_counties: string[];
  restricted_cities: string[];
  ships_ground_only: boolean;
  requires_adult_signature: boolean;
  po_box_allowed: boolean;
  notes: string;
}

interface PDPProduct {
  id: string;
  slug: string;
  display_name: string;
  brand: string | null;
  short_description: string | null;
  description: string | null;
  product_type: string | null;
}

interface PDPResponse {
  product: PDPProduct;
  pricing_status: 'priced' | 'pending' | 'hidden';
  display_price_cents: number | null;
  compare_at_price_cents: number | null;
  images: PDPImage[];
  coa: { url: string | null };
  ingredients: PDPIngredients;
  ship_restrictions: PDPShipRestrictions;
  store_policies: {
    discreet_packaging: boolean;
    tracking_provided: boolean;
    fast_fulfillment: boolean;
  };
  selectors: any[];
  variants: any[];
  selected_variant_id: string | null;
  ui_state: {
    can_purchase: boolean;
    price_visible: boolean;
  };
  raw_product: any;
}

interface EnhancedPDPProps {
  productId: string;
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Trust Bar - Shows key trust signals above the fold
 */
function TrustBar({ 
  hasCOA, 
  policies 
}: { 
  hasCOA: boolean; 
  policies: PDPResponse['store_policies'];
}) {
  const badges = [
    hasCOA && { icon: Beaker, label: 'Lab Tested', color: 'text-emerald-600' },
    policies.fast_fulfillment && { icon: Clock, label: 'Fast Fulfillment', color: 'text-blue-600' },
    policies.tracking_provided && { icon: Truck, label: 'Tracking Included', color: 'text-indigo-600' },
    policies.discreet_packaging && { icon: Package, label: 'Discreet Packaging', color: 'text-purple-600' },
    { icon: Lock, label: 'Secure Checkout', color: 'text-gray-600' },
    { icon: Shield, label: '21+ Only', color: 'text-amber-600' },
  ].filter(Boolean) as { icon: any; label: string; color: string }[];

  return (
    <div className="flex flex-wrap gap-3 py-4 border-y border-gray-100">
      {badges.map((badge, i) => (
        <div 
          key={i} 
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600"
        >
          <badge.icon size={14} className={badge.color} />
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * COA Button - Primary call-to-action for viewing lab results
 */
function COAButton({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 hover:from-emerald-100 hover:to-teal-100 transition-all group"
    >
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
        <FileText size={20} className="text-emerald-600" />
      </div>
      <div className="text-left">
        <p className="text-sm font-bold text-emerald-800">View Lab Results (COA)</p>
        <p className="text-xs text-emerald-600">Third-party tested • PDF</p>
      </div>
      <ExternalLink size={16} className="text-emerald-400 ml-2" />
    </a>
  );
}

/**
 * Ingredients Section - For edibles and products with ingredients
 */
function IngredientsSection({ 
  ingredients, 
  productType 
}: { 
  ingredients: PDPIngredients; 
  productType: string | null;
}) {
  const isEdible = productType === 'edible' || productType === 'mushroom';
  
  // Only show for edibles or if there are ingredients
  if (!isEdible && ingredients.contains.length === 0) return null;

  const hasIngredients = ingredients.contains.length > 0;
  const hasAllergens = ingredients.allergens.length > 0;
  const hasWarnings = ingredients.warnings.length > 0;
  const hasDietary = ingredients.dietary.length > 0;

  return (
    <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Leaf size={20} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Ingredients</h3>
      </div>

      {hasIngredients ? (
        <div className="space-y-4">
          {/* Main ingredients list */}
          <p className="text-gray-700 leading-relaxed">
            {ingredients.contains.join(', ')}
          </p>

          {/* Allergens warning */}
          {hasAllergens && (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-800">Contains Allergens:</p>
                <p className="text-sm text-red-700">{ingredients.allergens.join(', ')}</p>
              </div>
            </div>
          )}

          {/* Dietary info */}
          {hasDietary && (
            <div className="flex flex-wrap gap-2">
              {ingredients.dietary.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Warnings */}
          {hasWarnings && (
            <div className="text-xs text-gray-500 italic">
              {ingredients.warnings.join(' • ')}
            </div>
          )}

          {/* Source attribution */}
          {ingredients.source !== 'unknown' && (
            <p className="text-xs text-gray-400">
              Source: {ingredients.source === 'label' ? 'Product Label' : 'Manufacturer'}
              {ingredients.last_verified_at && ` • Verified ${new Date(ingredients.last_verified_at).toLocaleDateString()}`}
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          Ingredients not provided yet—check product label or COA for details.
        </p>
      )}
    </div>
  );
}

/**
 * Shipping Restrictions Section
 */
function ShippingSection({ restrictions }: { restrictions: PDPShipRestrictions }) {
  const [zipCode, setZipCode] = useState('');
  const [checkStatus, setCheckStatus] = useState<'idle' | 'loading' | 'allowed' | 'restricted' | 'regulated' | 'error'>('idle');
  const [detectedState, setDetectedState] = useState<{name: string, abbr: string} | null>(null);
  const [complianceDetails, setComplianceDetails] = useState<{reason?: string, statutes?: string[]} | null>(null);

  const hasRestrictions = restrictions.restricted_states.length > 0 || 
                          restrictions.restricted_counties.length > 0 || 
                          restrictions.restricted_cities.length > 0;

  const handleCheckZip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.length !== 5) return;

    setCheckStatus('loading');
    setDetectedState(null);
    setComplianceDetails(null);

    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!res.ok) {
        setCheckStatus('error');
        return;
      }
      const data = await res.json();
      const place = data.places?.[0];
      
      if (!place) {
        setCheckStatus('error');
        return;
      }

      const stateName = place['state'];
      const stateAbbr = place['state abbreviation'];
      setDetectedState({ name: stateName, abbr: stateAbbr });

      // 1. Check Product-Specific Restrictions (Database)
      const isExplicitlyRestricted = restrictions.restricted_states.some(r => 
        r.toLowerCase() === stateName.toLowerCase() || 
        r.toLowerCase() === stateAbbr.toLowerCase()
      );

      // 2. Check General Compliance Knowledge Base (Agent Brain)
      const compliance = getComplianceInfo(stateAbbr);
      setComplianceDetails({
        reason: compliance.reason,
        statutes: compliance.statutes
      });

      if (isExplicitlyRestricted) {
        setCheckStatus('restricted');
      } else if (compliance.status === 'restricted') {
        // Even if DB doesn't say so, Agent Brain says restricted
        setCheckStatus('restricted');
      } else if (compliance.status === 'regulated') {
        setCheckStatus('regulated');
      } else {
        setCheckStatus('allowed');
      }

    } catch (err) {
      console.error(err);
      setCheckStatus('error');
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Truck size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Shipping Availability</h3>
      </div>

      <div className="space-y-5">
        {/* Zip Code Checker */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Check delivery to your location
            </label>
            <form onSubmit={handleCheckZip} className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Enter Zip Code"
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <MapPin size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <button 
                type="submit"
                disabled={zipCode.length !== 5 || checkStatus === 'loading'}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px] flex justify-center"
              >
                {checkStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Check'}
              </button>
            </form>

            {/* Results */}
            {checkStatus === 'allowed' && detectedState && (
              <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-100 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-start gap-2 text-sm text-green-700">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-green-600" />
                  <div>
                    <span className="font-bold block text-green-800">Sales Allowed!</span> 
                    Good news, we ship to {detectedState.name}.
                    {complianceDetails?.reason && <p className="text-xs mt-1 opacity-80">{complianceDetails.reason}.</p>}
                  </div>
                </div>
              </div>
            )}

            {checkStatus === 'regulated' && detectedState && (
              <div className="mt-3 bg-amber-50 p-3 rounded-lg border border-amber-100 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-start gap-2 text-sm text-amber-700">
                  <Info size={18} className="mt-0.5 flex-shrink-0 text-amber-600" />
                  <div>
                    <span className="font-bold block text-amber-800">Shipping Regulated</span> 
                    Shipments to {detectedState.name} are permitted but regulated.
                    {complianceDetails?.reason && <p className="text-xs mt-1 font-medium">{complianceDetails.reason}</p>}
                    {complianceDetails?.statutes && (
                      <p className="text-[10px] uppercase tracking-wide mt-1 text-amber-600/80">Ref: {complianceDetails.statutes.join(', ')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {checkStatus === 'restricted' && detectedState && (
              <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-600" />
                  <div>
                    <span className="font-bold block text-red-800">Shipping Restricted</span>
                    We cannot ship this item to {detectedState.name} due to local regulations.
                    {complianceDetails?.reason && <p className="text-xs mt-1 font-medium">{complianceDetails.reason}</p>}
                    {complianceDetails?.statutes && (
                      <p className="text-[10px] uppercase tracking-wide mt-1 text-red-600/80">Ref: {complianceDetails.statutes.join(', ')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {checkStatus === 'error' && (
              <div className="mt-3 text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertTriangle size={14} /> 
                <span>Please enter a valid US zip code.</span>
              </div>
            )}
        </div>

        {/* Existing Policy Badges */}
        {(restrictions.ships_ground_only || restrictions.requires_adult_signature || !restrictions.po_box_allowed) && (
          <div className="flex flex-wrap gap-2">
            {restrictions.ships_ground_only && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg">
                <Truck size={12} /> Ground Only
              </span>
            )}
            {restrictions.requires_adult_signature && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-lg">
                <Shield size={12} /> Adult Sig Req.
              </span>
            )}
            {!restrictions.po_box_allowed && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 text-xs font-semibold rounded-lg">
                <Lock size={12} /> No P.O. Boxes
              </span>
            )}
          </div>
        )}

        {/* Default Restricted List (State Laws) */}
        {hasRestrictions && (
             <div className="text-xs text-gray-500 mt-2 p-3 bg-gray-100 rounded-lg">
               <span className="font-bold block text-gray-700 mb-1">Known Restrictions:</span>
               Cannot ship to: {restrictions.restricted_states.join(', ')}
               {restrictions.restricted_counties.length > 0 && `, ${restrictions.restricted_counties.join(', ')}`}
             </div>
        )}

        {/* Notes */}
        {restrictions.notes && (
          <p className="text-xs text-gray-500 italic flex items-start gap-1.5 border-t border-gray-200 pt-3">
            <Info size={12} className="mt-0.5 flex-shrink-0" />
            {restrictions.notes}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * What You Get section - Packaging clarity
 */
function WhatYouGetSection({ productName, productType }: { productName: string; productType: string | null }) {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Package size={20} className="text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">What You Get</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700">1x {productName}</p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700">Discreet, unmarked packaging</p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700">Tracking number provided via email</p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700">Lab tested with COA available</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Image Gallery Component
 */
function ImageGallery({ 
  images, 
  productName 
}: { 
  images: PDPImage[]; 
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex] || images[0];

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-3xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Package size={48} className="mx-auto mb-2 opacity-50" />
          <p>No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <Image
          src={selectedImage.url}
          alt={productName}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                index === selectedIndex 
                  ? 'border-emerald-500 ring-2 ring-emerald-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Price Display with pending state
 */
function PriceDisplay({ 
  priceCents, 
  compareAtCents, 
  status 
}: { 
  priceCents: number | null; 
  compareAtCents: number | null;
  status: 'priced' | 'pending' | 'hidden';
}) {
  if (status !== 'priced' || priceCents === null) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-400">Pricing Coming Soon</span>
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
          Pending
        </span>
      </div>
    );
  }

  const price = priceCents / 100;
  const compareAt = compareAtCents ? compareAtCents / 100 : null;
  const hasDiscount = compareAt && compareAt > price;
  const discountPercent = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className="text-4xl font-black text-gray-900">
        ${price.toFixed(2)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-xl text-gray-400 line-through font-semibold">
            ${compareAt.toFixed(2)}
          </span>
          <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-lg">
            {discountPercent}% OFF
          </span>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function EnhancedPDP({ productId }: EnhancedPDPProps) {
  const [data, setData] = useState<PDPResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        
        const productData = await response.json();
        setData(productData);
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
    if (!data?.ui_state.can_purchase || isAddingToCart) return;

    setIsAddingToCart(true);
    const success = await addToCart(productId, quantity);
    if (success) setQuantity(1);
    setIsAddingToCart(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="aspect-square bg-gray-200 rounded-3xl" />
              <div className="flex gap-3 mt-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-12 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-16 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-white">
        <GlobalMasthead />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {error || 'The requested product could not be found.'}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const { product, images, ui_state, pricing_status, coa, ingredients, ship_restrictions, store_policies } = data;
  const inStock = data.raw_product?.stock_quantity > 0;
  const stockCount = data.raw_product?.stock_quantity || 0;

  const FAQ_ITEMS = [
    {
      question: "Is this product legal?",
      answer: "All products on our site contain less than 0.3% Delta 9 THC on a dry weight basis, making them federally legal under the 2018 Farm Bill. State laws vary—please check your local regulations."
    },
    {
      question: "How long does shipping take?",
      answer: "Orders are processed within 1-2 business days. Shipping typically takes 3-5 business days depending on your location. You'll receive tracking via email."
    },
    {
      question: "Are lab tests available?",
      answer: "Yes! We provide third-party lab test results (COA) for applicable products. Look for the 'View Lab Results' button on this page."
    },
    {
      question: "What's your return policy?",
      answer: "Due to the nature of our products, we accept returns only on unopened items within 14 days. Contact support immediately if your order arrived damaged."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />

      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 pt-4">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/" className="hover:text-white transition-colors">Shop</Link>
            <ChevronRight size={14} />
            <span className="text-white font-bold truncate">{product.display_name}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Above the Fold: 60/40 Layout */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-5 mb-16">
          {/* Left: Image Gallery (60%) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <ImageGallery images={images} productName={product.display_name} />
            </div>
          </div>

          {/* Right: Product Info (40%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand */}
            {product.brand && (
              <span className="inline-block text-sm font-bold text-emerald-600 uppercase tracking-widest px-3 py-1 bg-emerald-50 rounded-full">
                {product.brand}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
              {product.display_name}
            </h1>

            {/* Reviews placeholder */}
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-sm font-semibold text-gray-500">(Reviews coming soon)</span>
            </div>

            {/* Trust Bar */}
            <TrustBar hasCOA={!!coa.url} policies={store_policies} />

            {/* COA Button - Above the Fold */}
            {coa.url && (
              <div className="py-2">
                <COAButton url={coa.url} />
              </div>
            )}

            {/* Price */}
            <PriceDisplay 
              priceCents={data.display_price_cents} 
              compareAtCents={data.compare_at_price_cents}
              status={pricing_status}
            />

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Add to Cart Section */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold uppercase tracking-wide text-gray-500">Qty:</span>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(stockCount || 10, q + 1))}
                      disabled={quantity >= stockCount}
                      className="p-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold uppercase ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                  {inStock && <p className="text-xs text-gray-400">{stockCount} available</p>}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!ui_state.can_purchase || isAddingToCart}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-8 rounded-xl font-bold text-lg uppercase tracking-wide disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/30 disabled:shadow-none"
              >
                {isAddingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    {ui_state.can_purchase ? 'Add to Cart' : pricing_status === 'pending' ? 'Pricing Coming Soon' : 'Out of Stock'}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 font-medium">
                <Lock size={12} className="inline mr-1" />
                Secure checkout • Fast shipping • Discreet packaging
              </p>
            </div>
          </div>
        </div>

        {/* Below the Fold Sections */}
        <div className="space-y-8 max-w-4xl">
          {/* What You Get */}
          <WhatYouGetSection 
            productName={product.display_name} 
            productType={product.product_type} 
          />

          {/* Ingredients (for edibles) */}
          <IngredientsSection 
            ingredients={ingredients} 
            productType={product.product_type} 
          />

          {/* Full Description */}
          {product.description && (
            <div className="p-6 bg-white rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description.replace(/\\n/g, '<br/>') }}
              />
            </div>
          )}

          {/* Lab Testing / COA Section */}
          {coa.url && (
            <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Beaker size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Lab Testing & Transparency</h3>
              </div>
              <p className="text-gray-700 mb-4">
                This product has been tested by an independent third-party laboratory. 
                View the Certificate of Analysis (COA) to see detailed cannabinoid content, 
                potency information, and safety testing results.
              </p>
              <COAButton url={coa.url} />
              <div className="mt-4 text-sm text-gray-500">
                <Link href="/coa-library" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Browse all COAs in our Lab Results Library →
                </Link>
              </div>
            </div>
          )}

          {/* Shipping Restrictions */}
          <ShippingSection restrictions={ship_restrictions} />

          {/* FAQ */}
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {faq.question}
                    {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openFaq === index && (
                    <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
