import type { MetadataRoute } from 'next';

/**
 * Highway 420 robots policy.
 *
 * Allows: the customer-facing storefront (everything that ships in sitemap.ts).
 * Disallows: admin tools, transactional flows (cart / checkout / account),
 *            auth & API endpoints, internal/system routes, and known
 *            duplicate-content URLs (/terms — canonical is /terms-and-conditions).
 *
 * URLs with a `?reason=kratom_blocked` query string come from the middleware
 * redirect for restricted product paths — those land back on `/` which IS
 * crawlable, so no special rule is needed.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://highway420store.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Internal / system
          '/api/',
          '/_next/',
          '/admin/',

          // Auth & account (user-specific, not for indexing)
          '/auth/',
          '/signin',
          '/signup',
          '/account/',
          '/profile',
          '/orders',
          '/payment-methods',
          '/wishlist',

          // Transactional flows
          '/cart',
          '/checkout',
          '/checkout/',
          '/returns/start',
          '/age-verification',

          // Duplicate-content guard — /terms-and-conditions is canonical
          '/terms',

          // Restricted/legacy slugs
          '/kratom',
          '/7-oh',
          '/7-hydroxy',
          '/mitragynine',
          '/brands/', // /brands is legacy; brand discovery happens via /search?brand=X
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ''),
  };
}
