import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

/**
 * Highway 420 sitemap.
 *
 * Tiers:
 *   1.0  — home
 *   0.9  — top-level product category landings
 *   0.8  — content hubs (Higher Learning, Road Trips, blog cornerstones),
 *          marketing landings (VIP, bundles, deals families)
 *   0.7  — individual product detail pages
 *   0.7  — individual Higher Learning articles
 *   0.5  — about / contact / press / affiliate
 *   0.3  — footer policy pages (privacy, terms, shipping, returns, compliance)
 *
 * Customer-facing URLs only — admin, cart, checkout, account, auth and API
 * routes are excluded here (and disallowed in robots.ts).
 *
 * Kratom-named products are filtered out per compliance policy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://highway420store.com';
  const now = new Date();

  // ─── Static routes (verified to exist as page.tsx files) ─────────────────
  const staticEntries: MetadataRoute.Sitemap = [
    // Home
    { url: `${base}/`,                 lastModified: now, changeFrequency: 'daily',   priority: 1.0 },

    // Product category landings
    { url: `${base}/bongs`,            lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/bubblers`,         lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/pipes`,            lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/vapes`,            lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/dabsntools`,       lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/pre-rolls`,        lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/edibles`,          lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/mushrooms`,        lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/accessories`,      lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/thca_flower`,      lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/thca_pnv`,         lastModified: now, changeFrequency: 'daily',   priority: 0.9 },

    // Browse / merchandising hubs
    { url: `${base}/products`,         lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/categories`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/new`,              lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/sale`,             lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/deals`,            lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/dope-deals`,       lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/fresh-drops`,      lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/hot-products`,     lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/bundles`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/gift-cards`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

    // Content hubs
    { url: `${base}/higher-learning`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/road-trips`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/ride-with-us`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/blog-portal`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/h420-vip`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/rewards`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/lab-results`,      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

    // Higher Learning cornerstone articles (file-backed, not in blog_posts table)
    { url: `${base}/higher-learning/e-rig-vs-dab-rig`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/higher-learning/percolator-vs-regular-bong`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/higher-learning/thca-legal-alternative`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Blog cornerstones (file-backed)
    { url: `${base}/blog/ultimate-bong-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Company
    { url: `${base}/about`,            lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/press`,            lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/affiliate`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/wholesale`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },

    // Footer policy pages — only the canonical Terms page, not the duplicate.
    { url: `${base}/privacy`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms-and-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/shipping`,         lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/returns`,          lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/compliance`,       lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/help`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.5 },
  ];

  // ─── Product detail pages ────────────────────────────────────────────────
  // The PDP route is /product/[id] (UUID-based). Filtered to active, kratom-
  // free, image-bearing rows — products without images shouldn't be indexed.
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { data: products } = await supabase
        .from('main_site_products')
        .select('id, updated_at')
        .eq('is_active', true)
        .not('image_url', 'is', null)
        .not('image_url', 'eq', '')
        .not('name', 'ilike', '%kratom%')
        .not('name', 'ilike', '%7-oh%')
        .not('name', 'ilike', '%mitragynine%')
        .limit(50000); // Google's per-sitemap cap

      if (products) {
        productEntries = products.map((p: { id: string; updated_at: string | null }) => ({
          url: `${base}/product/${p.id}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }
    }
  } catch {
    // DB unreachable at build/render time — degrade to static-only sitemap.
  }

  // ─── DB-backed blog posts (currently empty; future-proofing) ─────────────
  let blogPostEntries: MetadataRoute.Sitemap = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('published', true)
        .limit(1000);

      if (posts) {
        blogPostEntries = posts.map((p: { slug: string; updated_at: string | null }) => ({
          url: `${base}/blog/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
      }
    }
  } catch {
    // blog_posts may not exist yet; static blog entries above still ship.
  }

  return [...staticEntries, ...productEntries, ...blogPostEntries];
}
