import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';

export const metadata = {
  title: 'Brands | Dope Deals',
};

export const dynamic = 'force-dynamic';

type Brand = {
  id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
  product_count?: number;
};

export default async function BrandsPage() {
  let brands: Brand[] = [];
  try {
    const url = (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/brands` : '/api/brands');
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      brands = await res.json();
    }
  } catch (_) {
    // ignore fetch errors in dev; show empty state
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Age Verification Popup */}
      <AgeVerification />

      {/* Universal Layout Components */}
      <GlobalMasthead />

      <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-wide">Brands</h1>
      {(!brands || brands.length === 0) ? (
        <p className="text-sm text-muted-foreground">No brands available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((b, i) => {
            const base = (b.name || b.title || String(b.id || i)).toString();
            const fallbackSlug = base.toLowerCase().replace(/\s+/g, '-');
            const slug = b.slug || String(b.id ?? fallbackSlug) || fallbackSlug;
            return (
              <Link
                key={slug}
                href={`/brands/${encodeURIComponent(slug)}`}
                className="block border rounded-lg p-4 bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div className="font-semibold">{b.name || b.title || `Brand ${i + 1}`}</div>
                {typeof b.product_count === 'number' && (
                  <div className="text-xs text-gray-600">{b.product_count} products</div>
                )}
              </Link>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}