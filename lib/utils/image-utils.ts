
/**
 * Image parsing and normalization utilities for Highway 420.
 * Handles single URLs, comma-separated lists, and JSONB arrays.
 */

/**
 * Parses image URLs from various raw formats into a clean array of unique URLs.
 * 
 * IMPORTANT: This function is "comma-aware" and will not split a single URL 
 * that contains a comma (common in some brand filenames like Cookies).
 * It only splits if the resulting parts are multiple distinct URLs.
 * 
 * @param value The raw image data (string, array, or null)
 * @returns An array of unique, non-empty image URLs
 */
export function parseImageUrls(value?: string[] | string | null): string[] {
  if (!value) return [];

  // If already an array, filter and return
  if (Array.isArray(value)) {
    return Array.from(new Set(
      value
        .filter(entry => typeof entry === 'string' && entry.trim() !== '')
        .map(entry => entry.trim())
    ));
  }

  // If not a string, return as single item array if truthy
  if (typeof value !== 'string') {
    return [String(value)].filter(Boolean);
  }

  const trimmed = value.trim();
  if (trimmed === '') return [];

  /**
   * SMART SPLIT LOGIC:
   * We only want to split on commas if the string actually contains multiple URLs.
   * A single URL might contain a comma (e.g. "3,5g-flower.png").
   * We check for multiple occurrences of "http" or "https".
   */
  const protocolMatches = trimmed.match(/https?:\/\//g);
  
  if (!protocolMatches || protocolMatches.length <= 1) {
    // Single URL (possibly with commas), return as is
    return [trimmed];
  }

  // Multiple URLs found, split using a lookahead to ensure we only split at the start of a new URL
  return Array.from(new Set(
    trimmed
      .split(/,(?=\s*https?:\/\/)/)
      .map(url => url.trim())
      .filter(url => url !== '')
  ));
}

/**
 * Normalizes image data for a product into a single primary URL and a gallery array.
 * 
 * @param product Product object containing image_url and/or image_urls
 * @returns Object with primary image_url and image_urls gallery array
 */
export function normalizeProductImages(product: { image_url?: string | null, image_urls?: string | string[] | null }) {
  const allUrls = Array.from(new Set([
    ...parseImageUrls(product.image_url),
    ...parseImageUrls(product.image_urls)
  ]));

  return {
    image_url: allUrls[0] || product.image_url || null,
    image_urls: allUrls
  };
}
