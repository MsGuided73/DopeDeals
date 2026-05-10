import { createClient } from '@supabase/supabase-js';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://highway420store.com';
  const now = new Date();

  // Static pages
  const staticRoutes = [
    '/',
    '/products',
    '/categories',
    '/about',
    '/contact',
    '/help',
    '/blog',
    '/search',
    '/terms',
    '/privacy',
    '/shipping',
    '/returns',
    '/compliance',
    '/lab-results',
    '/rewards',
    '/gift-cards',
    '/wholesale',
    '/fresh-drops',
    '/hot-products',
    '/sale',
    '/new',
    '/pipes',
    '/bongs',
    '/bubblers',
    '/dab-rigs',
    '/vapes',
    '/edibles',
    '/pre-rolls',
    '/thca_flower',
    '/mushrooms',
    '/accessories',
    '/dope-deals',
    '/ride-with-us',
  ].map(route => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' as const : 'weekly' as const,
    priority: route === '/' ? 1.0 : 0.7,
  }));

  // Dynamic product pages
  let productRoutes: { url: string; lastModified: Date; priority: number }[] = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: products } = await supabase
      .from('main_site_products')
      .select('id, updated_at')
      .eq('is_active', true)
      .not('name', 'ilike', '%kratom%')
      .limit(5000);

    if (products) {
      productRoutes = products.map(p => ({
        url: `${base}/product/${p.id}`,
        lastModified: new Date(p.updated_at || now),
        priority: 0.8,
      }));
    }
  } catch {
    // If DB is unavailable, return static routes only
  }

  // Dynamic blog pages
  let blogRoutes: { url: string; lastModified: Date; priority: number }[] = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
      .limit(500);

    if (posts) {
      blogRoutes = posts.map(p => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: new Date(p.updated_at || now),
        priority: 0.6,
      }));
    }
  } catch {
    // Blog table may not exist yet
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
