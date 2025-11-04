// C:\__Highway 420\DopeDeals\app\categories\page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories | Dope Deals',
};

// Ensure request-time rendering (prevents prerender from running request-scoped code)
export const dynamic = 'force-dynamic';

type Category = {
  id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
  product_count?: number;
};

export default async function CategoriesPage() {
  let categories: Category[] = [];

  try {
    const url = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`
      : '/api/categories';

    // Live request each render; consistent with force-dynamic
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const body = await res.json();
      categories = Array.isArray(body) ? body : [];
    }
  } catch {
    // swallow fetch errors; show empty state
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="px-6 py-8 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-wide">Categories</h1>

        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((c, idx) => {
              const base = (c.name || c.title || String(c.id ?? idx)).toString();
              const fallbackSlug = base.toLowerCase().replace(/\s+/g, '-');
              const slug = c.slug || (c.id != null ? String(c.id) : fallbackSlug);

              return (
                <Link
                  key={`${slug}-${idx}`}
                  href={`/category/${encodeURIComponent(slug)}`}
                  className="block border rounded-lg p-4 bg-white hover:shadow-md hover:bg-gray-50 transition"
                >
                  <div className="font-semibold">
                    {c.name || c.title || `Category ${idx + 1}`}
                  </div>
                  {typeof c.product_count === 'number' && (
                    <div className="text-xs text-gray-600">{c.product_count} products</div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
