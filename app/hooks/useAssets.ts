"use client";

import { useState, useEffect, useCallback } from 'react';

// Import from lib folder (not in app directory, so use relative path)
const getAssetUrl = (bucket: string, path: string, options?: any) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return '';
  let url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  if (options && (options.width || options.height || options.quality)) {
    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    url += `?${params.toString()}`;
  }
  return url;
};

const getAssetVariants = (bucket: string, path: string) => ({
  thumbnail: getAssetUrl(bucket, path, { width: 200, height: 200, quality: 80 }),
  small: getAssetUrl(bucket, path, { width: 400, quality: 85 }),
  medium: getAssetUrl(bucket, path, { width: 800, quality: 85 }),
  large: getAssetUrl(bucket, path, { width: 1200, quality: 90 }),
  original: getAssetUrl(bucket, path),
});

const assetExists = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const url = getAssetUrl(bucket, path);
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

type AssetOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'original';
  preload?: boolean;
  checkExists?: boolean;
};

type AssetBucket = 'products' | 'website-images' | 'ads';

interface UseAssetOptions extends AssetOptions {
  preload?: boolean;
  checkExists?: boolean;
}

/**
 * Hook for managing a single asset
 */
export function useAsset(
  bucket: AssetBucket,
  path: string,
  options?: UseAssetOptions
) {
  const [url, setUrl] = useState<string>('');
  const [exists, setExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAsset = async () => {
      setLoading(true);

      // Get URL
      const assetUrl = getAssetUrl(bucket, path, options);
      setUrl(assetUrl);

      // Check if exists (if requested)
      if (options?.checkExists) {
        const doesExist = await assetExists(bucket, path);
        setExists(doesExist);
      }

      // Preload (if requested)
      if (options?.preload && typeof window !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = assetUrl;
        document.head.appendChild(link);
      }

      setLoading(false);
    };

    if (bucket && path) {
      loadAsset();
    }
  }, [bucket, path, options?.width, options?.height, options?.quality]);

  return { url, exists, loading };
}

/**
 * Hook for managing multiple asset variants (responsive images)
 */
export function useAssetVariants(bucket: AssetBucket, path: string) {
  const [variants, setVariants] = useState<ReturnType<typeof getAssetVariants> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bucket && path) {
      const assetVariants = getAssetVariants(bucket, path);
      setVariants(assetVariants);
      setLoading(false);
    }
  }, [bucket, path]);

  return { variants, loading };
}

/**
 * Hook for managing multiple assets
 */
export function useAssets(
  assets: Array<{ bucket: AssetBucket; path: string; options?: AssetOptions }>
) {
  const [urls, setUrls] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = () => {
      setLoading(true);
      const urlMap = new Map<string, string>();

      assets.forEach(({ bucket, path, options }) => {
        const key = `${bucket}/${path}`;
        const url = getAssetUrl(bucket, path, options);
        urlMap.set(key, url);
      });

      setUrls(urlMap);
      setLoading(false);
    };

    if (assets.length > 0) {
      loadAssets();
    }
  }, [assets]);

  const getUrl = useCallback(
    (bucket: AssetBucket, path: string) => {
      return urls.get(`${bucket}/${path}`) || '';
    },
    [urls]
  );

  return { urls, getUrl, loading };
}

/**
 * Hook for uploading assets (admin only)
 */
export function useAssetUpload(bucket: AssetBucket) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, folder?: string) => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);
        if (folder) formData.append('folder', folder);

        const response = await fetch('/api/admin/assets/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Upload failed');
        }

        const data = await response.json();
        setProgress(100);
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [bucket]
  );

  const uploadMultiple = useCallback(
    async (files: File[], folder?: string) => {
      setUploading(true);
      setProgress(0);
      setError(null);

      const results = [];
      const total = files.length;

      for (let i = 0; i < files.length; i++) {
        try {
          const result = await upload(files[i], folder);
          results.push(result);
          setProgress(((i + 1) / total) * 100);
        } catch (err) {
          console.error(`Failed to upload ${files[i].name}:`, err);
        }
      }

      setUploading(false);
      return results;
    },
    [upload]
  );

  return { upload, uploadMultiple, uploading, progress, error };
}

/**
 * Hook for deleting assets (admin only)
 */
export function useAssetDelete(bucket: AssetBucket) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAsset = useCallback(
    async (assetId: string) => {
      setDeleting(true);
      setError(null);

      try {
        const response = await fetch('/api/admin/assets/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetIds: [assetId], bucket }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Delete failed');
        }

        return await response.json();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Delete failed';
        setError(errorMessage);
        throw err;
      } finally {
        setDeleting(false);
      }
    },
    [bucket]
  );

  const deleteMultiple = useCallback(
    async (assetIds: string[]) => {
      setDeleting(true);
      setError(null);

      try {
        const response = await fetch('/api/admin/assets/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetIds, bucket }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Delete failed');
        }

        return await response.json();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Delete failed';
        setError(errorMessage);
        throw err;
      } finally {
        setDeleting(false);
      }
    },
    [bucket]
  );

  return { deleteAsset, deleteMultiple, deleting, error };
}

/**
 * Hook for searching assets
 */
export function useAssetSearch(bucket: AssetBucket, initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchAssets = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `/api/admin/assets?bucket=${bucket}&search=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data.assets || []);
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAssets, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, bucket]);

  return { query, setQuery, results, loading };
}

