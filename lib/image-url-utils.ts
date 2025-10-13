/**
 * Image URL transformation utilities for handling remote image sources
 */

/**
 * Transform image URLs from sigdistro.com to the desired format
 * @param imageUrl - The original image URL from the database
 * @returns Transformed image URL or original if no transformation needed
 */
export function transformImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;

  // Handle sigdistro.com URLs - treat as source images from remote server
  if (imageUrl.includes('sigdistro.com')) {
    // For now, return the original URL since sigdistro.com is the source
    // In production, you might want to proxy these through your own domain
    // or transform them to a different CDN
    return imageUrl;
  }

  // Handle relative URLs (assume they're from your public domain)
  if (imageUrl.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
    return `${baseUrl}${imageUrl}`;
  }

  // Handle other absolute URLs (return as-is)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Handle data URLs or other formats (return as-is)
  return imageUrl;
}

/**
 * Generate responsive image srcSet for optimized loading
 * @param imageUrl - Base image URL
 * @param sizes - Array of sizes to generate
 * @returns srcSet string for responsive images
 */
export function generateImageSrcSet(imageUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280]): string {
  if (!imageUrl) return '';

  // For sigdistro.com images, we can't generate srcSet without knowing the image server capabilities
  // Return the original URL for now
  if (imageUrl.includes('sigdistro.com')) {
    return imageUrl;
  }

  // For other URLs, you could implement srcSet generation logic here
  return imageUrl;
}

/**
 * Get optimized image props for Next.js Image component
 * @param imageUrl - Original image URL
 * @param alt - Alt text for the image
 * @returns Object with optimized image properties
 */
export function getOptimizedImageProps(imageUrl: string | null | undefined, alt: string = '') {
  const transformedUrl = transformImageUrl(imageUrl);

  return {
    src: transformedUrl || '/placeholder-image.jpg',
    alt,
    width: 500,
    height: 500,
    srcSet: transformedUrl ? generateImageSrcSet(transformedUrl) : undefined,
    // Enable Next.js Image optimization for non-sigdistro URLs
    unoptimized: transformedUrl?.includes('sigdistro.com') || false,
  };
}
