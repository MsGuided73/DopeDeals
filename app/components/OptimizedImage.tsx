"use client";

import { useState } from 'react';
import Image from 'next/image';

// Inline utility functions (lib folder not in app directory)
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

const generateSrcSet = (bucket: string, path: string, widths: number[] = [400, 800, 1200, 1600]) => {
  return widths
    .map(width => {
      const url = getAssetUrl(bucket, path, { width, quality: 85 });
      return `${url} ${width}w`;
    })
    .join(', ');
};

const getPlaceholderImage = (width: number = 400, height: number = 400) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ELoading...%3C/text%3E%3C/svg%3E`;
};

type AssetBucket = 'products' | 'website-images' | 'ads';

interface OptimizedImageProps {
  bucket: AssetBucket;
  path: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component
 * Automatically handles asset URLs, responsive images, and loading states
 */
export default function OptimizedImage({
  bucket,
  path,
  alt,
  width,
  height,
  quality = 85,
  className = '',
  priority = false,
  fill = false,
  sizes,
  objectFit = 'cover',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get optimized URL
  const imageUrl = getAssetUrl(bucket, path, { width, height, quality });

  // Generate srcset for responsive images
  const srcSet = !fill && width
    ? generateSrcSet(bucket, path, [
        Math.round(width * 0.5),
        width,
        Math.round(width * 1.5),
        Math.round(width * 2),
      ])
    : undefined;

  // Placeholder for loading state
  const placeholder = getPlaceholderImage(width || 400, height || 400);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  // Show error state
  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <div className="text-center text-gray-500">
          <span className="text-4xl block mb-2">🖼️</span>
          <p className="text-sm">Image not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <span className="text-2xl">⏳</span>
        </div>
      )}

      {/* Actual image */}
      {fill ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          quality={quality}
          priority={priority}
          sizes={sizes}
          className={`object-${objectFit} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <Image
          src={imageUrl}
          alt={alt}
          width={width || 400}
          height={height || 400}
          quality={quality}
          priority={priority}
          sizes={sizes}
          srcSet={srcSet}
          className={`object-${objectFit} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

/**
 * Product Image Component
 * Specialized component for product images with SKU-based paths
 */
export function ProductImage({
  sku,
  imageName,
  alt,
  width = 400,
  height = 400,
  quality = 85,
  className = '',
  priority = false,
}: {
  sku: string;
  imageName: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
}) {
  const sanitizedSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
  const path = `products/${sanitizedSku}/${imageName}`;

  return (
    <OptimizedImage
      bucket="products"
      path={path}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      className={className}
      priority={priority}
    />
  );
}

/**
 * Website Asset Image Component
 * For common website images (logos, banners, etc.)
 */
export function WebsiteImage({
  path,
  alt,
  width,
  height,
  quality = 85,
  className = '',
  priority = false,
  fill = false,
}: {
  path: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  return (
    <OptimizedImage
      bucket="website-images"
      path={path}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      className={className}
      priority={priority}
      fill={fill}
    />
  );
}

/**
 * Responsive Image Component
 * Automatically generates multiple sizes for different screen sizes
 */
export function ResponsiveImage({
  bucket,
  path,
  alt,
  aspectRatio = '16/9',
  className = '',
  priority = false,
}: {
  bucket: AssetBucket;
  path: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        bucket={bucket}
        path={path}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        objectFit="cover"
      />
    </div>
  );
}

/**
 * Background Image Component
 * For hero sections and backgrounds
 */
export function BackgroundImage({
  bucket,
  path,
  alt = '',
  overlay = true,
  overlayOpacity = 0.5,
  children,
  className = '',
}: {
  bucket: AssetBucket;
  path: string;
  alt?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const imageUrl = getAssetUrl(bucket, path, { width: 1920, quality: 85 });

  return (
    <div className={`relative ${className}`}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
        role="img"
        aria-label={alt}
      />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

