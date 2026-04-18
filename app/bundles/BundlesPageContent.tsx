'use client';

import { useState, useEffect } from 'react';
import GlobalMasthead from '../components/GlobalMasthead';
import CollectionPageTemplate from '../components/CollectionPageTemplate';
import Link from 'next/link';

const BUNDLE_IMAGE =
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Notifications/Full%20Page%20Version-Bundle.png';

const API_ENDPOINT = '/api/products/bundles';

export default function BundlesPageContent() {
  const [hasProducts, setHasProducts] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    fetch(API_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        setHasProducts(Array.isArray(data.products) && data.products.length > 0);
      })
      .catch(() => {
        // On error, fall back to the notice so the page doesn't break
        setHasProducts(false);
      });
  }, []);

  // ── Still checking ────────────────────────────────────────────────────────
  if (hasProducts === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500" />
      </div>
    );
  }

  // ── Products exist → full catalog experience ──────────────────────────────
  if (hasProducts) {
    return (
      <CollectionPageTemplate
        title="BUNDLES"
        subtitle="More product. Better price. Hand-picked combos for every kind of session."
        apiEndpoint={API_ENDPOINT}
        gradientFrom="from-amber-500"
        gradientVia="via-yellow-600"
        gradientTo="to-orange-700"
        icon="🎁"
        breadcrumbName="Bundles"
        emptyMessage="Our bundle collection is being curated. Check back soon!"
      />
    );
  }

  // ── No products yet → full-page coming-soon image ─────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <GlobalMasthead />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <img
            src={BUNDLE_IMAGE}
            alt="Highway 420 Bundles — Coming Soon"
            className="w-full h-auto object-contain"
            style={{ display: 'block' }}
          />
        </div>
      </div>

      <div className="pb-10 text-center">
        <Link
          href="/"
          className="inline-block text-sm uppercase tracking-widest font-bold"
          style={{
            color: '#C5A059',
            fontFamily: "'Oswald', 'Highway Gothic', sans-serif",
            letterSpacing: '0.15em',
          }}
        >
          ← Back to Highway 420
        </Link>
      </div>
    </div>
  );
}
