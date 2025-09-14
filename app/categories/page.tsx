import Link from 'next/link';

export const metadata = {
  title: 'Categories | Dope Deals',
};

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
    const url = (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/categories` : '/api/categories');
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      categories = await res.json();
    }
  } catch (_) {
    // ignore fetch errors in dev; show empty state
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold uppercase tracking-wide">Categories</h1>
      {(!categories || categories.length === 0) ? (
        <p className="text-sm text-muted-foreground">No categories available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((c, i) => {
            const base = (c.name || c.title || String(c.id || i)).toString();
            const fallbackSlug = base.toLowerCase().replace(/\s+/g, '-');
            const slug = c.slug || String(c.id ?? fallbackSlug) || fallbackSlug;
            return (
              <Link
                key={slug}
                href={`/category/${encodeURIComponent(slug)}`}
                className="block border rounded-lg p-4 bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div className="font-semibold">{c.name || c.title || `Category ${i + 1}`}</div>
                {typeof c.product_count === 'number' && (
                  <div className="text-xs text-gray-600">{c.product_count} products</div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}