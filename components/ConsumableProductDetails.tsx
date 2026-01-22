"use client";

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Beaker, CheckCircle2, ChevronDown, ChevronUp, Shield, Star } from 'lucide-react';

interface ConsumableProductDetailsProps {
  product: {
    id: string;
    name: string;
    description?: string;
    description_md?: string;
    short_description?: string;
    sku?: string;
    brand_id?: string;
    category_id?: string;
    category_slug?: string;
    materials?: string[];
    thca_pct?: string;
    effects?: string[];
    flavors?: string[];
    helps_with?: string[];
    size?: string;
    benefits?: string[];
    ingredients?: string[];
    suggested_use?: string;
    lab_test_url?: string;
    warnings?: string[];
  };
}

const DEFAULT_BENEFITS = ['Calm', 'Creative', 'Energetic', 'Focus', 'Happy', 'Relaxed'];
const DEFAULT_INGREDIENTS = [
  'Organic Cane Sugar',
  'Organic Tapioca Syrup',
  'Purified Water',
  'Pectin',
  'Citric Acid',
  'Natural Flavoring',
  'Natural Coloring'
];
const DEFAULT_SUGGESTED_USE = [
  '1 Gummy — Vibing',
  '2 Gummies — Endless Smiles',
  '3+ Gummies — To the Moon',
  'Wait 60-90 minutes before taking more.'
];
const DEFAULT_WARNINGS = [
  'Do not operate vehicles or heavy machinery after use.',
  'Do not use if pregnant or nursing.',
  'Keep out of reach of children and pets.',
  'Must be 21+ to purchase.',
  'Store in a cool, dry place away from light.'
];

const BADGES = [
  { title: 'Beyond CBD & THC', icon: Shield },
  { title: 'Highest Quality', icon: CheckCircle2 },
  { title: 'Pure Hemp Extract', icon: Beaker },
  { title: 'No Cutting Agents', icon: AlertTriangle },
  { title: '3rd-Party Lab Tested', icon: Shield },
  { title: 'Benefits You Can Feel', icon: Star }
];

export function ConsumableProductDetails({ product }: ConsumableProductDetailsProps) {
  const [openSection, setOpenSection] = useState<string | null>('benefits');
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');

  const benefits = product.benefits && product.benefits.length > 0 ? product.benefits : DEFAULT_BENEFITS;
  const nameLower = product.name.toLowerCase();
  const categoryLower = (product.category_slug || product.category_id || '').toLowerCase();
  const isGummy = nameLower.includes('gumm') || categoryLower.includes('gumm');
  const ingredients = isGummy
    ? product.ingredients && product.ingredients.length > 0
      ? product.ingredients
      : DEFAULT_INGREDIENTS
    : [];
  const suggestedUse = isGummy
    ? product.suggested_use
      ? product.suggested_use.split('\n').filter(Boolean)
      : DEFAULT_SUGGESTED_USE
    : [];
  const warnings = product.warnings && product.warnings.length > 0 ? product.warnings : DEFAULT_WARNINGS;

  const descriptionHtml = useMemo(() => {
    const raw = product.description_md || product.description || product.short_description || '';
    return raw.replace(/\n/g, '<br/>');
  }, [product.description_md, product.description, product.short_description]);

  const additionalInfo = [
    product.sku ? { label: 'SKU', value: product.sku } : null,
    product.brand_id ? { label: 'Brand', value: product.brand_id } : null,
    product.category_id ? { label: 'Category', value: product.category_id } : null,
    product.size ? { label: 'Size', value: product.size } : null,
    product.thca_pct ? { label: 'THCA %', value: product.thca_pct } : null,
    product.effects && product.effects.length > 0 ? { label: 'Effects', value: product.effects.join(', ') } : null,
    product.flavors && product.flavors.length > 0 ? { label: 'Flavors', value: product.flavors.join(', ') } : null,
    product.helps_with && product.helps_with.length > 0 ? { label: 'Helps With', value: product.helps_with.join(', ') } : null,
    product.materials && product.materials.length > 0 ? { label: 'Materials', value: product.materials.join(', ') } : null
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const sections = [
    {
      key: 'benefits',
      title: 'Benefits',
      content: (
        <div className="flex flex-wrap gap-2">
          {benefits.map((benefit) => (
            <span
              key={benefit}
              className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-bold border border-gray-100"
            >
              {benefit}
            </span>
          ))}
        </div>
      )
    },
    isGummy
      ? {
          key: 'ingredients',
          title: 'Ingredients',
          content: (
            <p className="text-sm font-bold text-gray-600 leading-relaxed">
              {ingredients.join(', ')}
            </p>
          )
        }
      : null,
    isGummy
      ? {
          key: 'suggested',
          title: 'Suggested Use',
          content: (
            <div className="bg-gray-50 p-6 rounded-2xl space-y-2 font-bold text-sm text-gray-700">
              {suggestedUse.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          )
        }
      : null,
    {
      key: 'lab',
      title: 'Lab Test',
      content: (
        <a
          href={product.lab_test_url || '/lab-results'}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
        >
          <Beaker size={18} /> View COA Lab Results
        </a>
      )
    },
    {
      key: 'warning',
      title: 'Warning',
      content: (
        <ul className="space-y-2 text-xs font-bold text-red-500/80 uppercase tracking-tight">
          {warnings.map((warning) => (
            <li key={warning}>• {warning}</li>
          ))}
        </ul>
      )
    }
  ].filter(Boolean) as Array<{ key: string; title: string; content: React.ReactNode }>;

  return (
    <section className="pt-12 border-t border-gray-100 space-y-12">
      <div className="max-w-5xl mx-auto space-y-4">
        {sections.map((section) => {
          const isOpen = openSection === section.key;
          return (
            <div key={section.key} className="border-b border-gray-200 pb-4">
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section.key)}
                className="w-full flex items-center justify-between text-left text-sm font-black uppercase tracking-widest text-gray-700"
              >
                {section.title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isOpen && <div className="mt-4">{section.content}</div>}
            </div>
          );
        })}
      </div>

      <div className="border-t border-b border-gray-100 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-xs font-black uppercase tracking-widest text-gray-500">
          {BADGES.map(({ title, icon: Icon }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700">
                <Icon size={18} />
              </div>
              <span>{title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`px-4 py-3 text-sm font-black uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-dope-orange-500 text-dope-orange-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('additional')}
            className={`px-4 py-3 text-sm font-black uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === 'additional'
                ? 'border-dope-orange-500 text-dope-orange-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Additional Information
          </button>
        </div>

        <div className="pt-6">
          {activeTab === 'description' ? (
            <div
              className="prose prose-lg text-gray-600 max-w-none font-bold leading-relaxed description-content"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <div className="space-y-4 text-sm font-bold text-gray-600">
              {additionalInfo.length > 0 ? (
                additionalInfo.map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="uppercase tracking-widest text-gray-400">{item.label}</span>
                    <span className="text-gray-700 text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Additional product details will be available soon.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
