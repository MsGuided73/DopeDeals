import type { Product, Category } from "@shared/schema";

export interface SitemapUrl {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(products: Product[], categories: Category[]): string {
  const baseUrl = 'https://vipsmoke.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    // Static pages
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/vip-membership`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3
    }
  ];

  // Add category pages
  categories.forEach(category => {
    urls.push({
      url: `${baseUrl}/category/${category.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7
    });
  });

  // Add product pages
  products.forEach(product => {
    urls.push({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    });
  });

  // Generate XML sitemap
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const xmlNamespace = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  const xmlUrls = urls.map(url => {
    return `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  }).join('\n');

  const xmlFooter = '\n</urlset>';

  return xmlHeader + xmlNamespace + xmlUrls + xmlFooter;
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Age verification compliance
Disallow: /age-restricted/
Disallow: /checkout/
Disallow: /account/

# SEO optimization
Sitemap: https://vipsmoke.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Special rules for specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block known bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /`;
}