/**
 * Asset Manager Utility
 * Provides efficient access to website assets with caching and optimization
 */

type AssetBucket = 'products' | 'website-images' | 'ads';

interface AssetOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'original';
}

/**
 * Get optimized asset URL from Supabase Storage
 * Automatically applies transformations for better performance
 */
export function getAssetUrl(
  bucket: AssetBucket,
  path: string,
  options?: AssetOptions
): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not configured');
    return '';
  }

  // Base URL
  let url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;

  // Add transformations if specified
  if (options && (options.width || options.height || options.quality || options.format)) {
    const params = new URLSearchParams();
    
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.format && options.format !== 'original') {
      params.append('format', options.format);
    }

    url += `?${params.toString()}`;
  }

  return url;
}

/**
 * Get multiple size variants of an asset
 * Useful for responsive images with srcset
 */
export function getAssetVariants(bucket: AssetBucket, path: string) {
  return {
    thumbnail: getAssetUrl(bucket, path, { width: 200, height: 200, quality: 80 }),
    small: getAssetUrl(bucket, path, { width: 400, quality: 85 }),
    medium: getAssetUrl(bucket, path, { width: 800, quality: 85 }),
    large: getAssetUrl(bucket, path, { width: 1200, quality: 90 }),
    original: getAssetUrl(bucket, path),
  };
}

/**
 * Predefined asset paths for common website images
 * Makes it easy to reference frequently used assets
 */
export const WEBSITE_ASSETS = {
  // Hero/Banner Images
  hero: {
    cityscape: 'hero/cityscape.jpg',
    vipRewards: 'rewards/WhatsApp%20Image%202025-09-25%20at%2011.27.52_e3fa4258.jpg',
  },
  
  // Logos
  logos: {
    dopeCityMain: 'logos/dope-city-logo.png',
    dopeCityWhite: 'logos/dope-city-white.png',
  },
  
  // Collection Images
  collections: {
    bongs: 'collections/bongs.jpg',
    dabRigs: 'collections/dab-rigs.jpg',
    pipes: 'collections/pipes.jpg',
    preRolls: 'collections/pre-rolls.jpg',
    accessories: 'collections/accessories.jpg',
  },
  
  // Brand Images
  brands: {
    roor: 'brands/roor.jpg',
    puffco: 'brands/puffco.jpg',
    cookies: 'brands/cookies.jpg',
  },
} as const;

/**
 * Get a predefined website asset URL
 */
export function getWebsiteAsset(
  category: keyof typeof WEBSITE_ASSETS,
  name: string,
  options?: AssetOptions
): string {
  const assets = WEBSITE_ASSETS[category] as Record<string, string>;
  const path = assets[name];
  
  if (!path) {
    console.warn(`Asset not found: ${category}.${name}`);
    return '';
  }
  
  return getAssetUrl('website-images', path, options);
}

/**
 * Asset cache for client-side performance
 * Stores recently accessed asset URLs
 */
class AssetCache {
  private cache: Map<string, string> = new Map();
  private maxSize: number = 100;

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const assetCache = new AssetCache();

/**
 * Preload critical assets for better performance
 */
export function preloadAssets(assets: Array<{ bucket: AssetBucket; path: string }>) {
  if (typeof window === 'undefined') return;

  assets.forEach(({ bucket, path }) => {
    const url = getAssetUrl(bucket, path);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  bucket: AssetBucket,
  path: string,
  widths: number[] = [400, 800, 1200, 1600]
): string {
  return widths
    .map(width => {
      const url = getAssetUrl(bucket, path, { width, quality: 85 });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get optimized product image URL
 * Convenience function for product images
 */
export function getProductImage(
  sku: string,
  imageName: string,
  options?: AssetOptions
): string {
  const sanitizedSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
  const path = `products/${sanitizedSku}/${imageName}`;
  return getAssetUrl('products', path, options);
}

/**
 * Check if an asset exists (client-side)
 */
export async function assetExists(
  bucket: AssetBucket,
  path: string
): Promise<boolean> {
  try {
    const url = getAssetUrl(bucket, path);
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get asset metadata (size, type, etc.)
 */
export async function getAssetMetadata(
  bucket: AssetBucket,
  path: string
): Promise<{ size: number; type: string; lastModified: Date } | null> {
  try {
    const url = getAssetUrl(bucket, path);
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) return null;

    return {
      size: parseInt(response.headers.get('content-length') || '0'),
      type: response.headers.get('content-type') || 'unknown',
      lastModified: new Date(response.headers.get('last-modified') || Date.now()),
    };
  } catch {
    return null;
  }
}

/**
 * Batch load multiple assets
 */
export async function batchLoadAssets(
  assets: Array<{ bucket: AssetBucket; path: string }>
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  await Promise.all(
    assets.map(async ({ bucket, path }) => {
      const key = `${bucket}/${path}`;
      const url = getAssetUrl(bucket, path);
      
      // Check if exists
      const exists = await assetExists(bucket, path);
      if (exists) {
        results.set(key, url);
        assetCache.set(key, url);
      }
    })
  );

  return results;
}

/**
 * Get placeholder image URL for loading states
 */
export function getPlaceholderImage(width: number = 400, height: number = 400): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ELoading...%3C/text%3E%3C/svg%3E`;
}

/**
 * Convert external image URL to Supabase storage
 * Useful for migrating images from external sources
 */
export async function migrateExternalImage(
  externalUrl: string,
  bucket: AssetBucket,
  targetPath: string
): Promise<string | null> {
  try {
    const response = await fetch('/api/admin/assets/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ externalUrl, bucket, targetPath }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.url;
  } catch {
    return null;
  }
}

