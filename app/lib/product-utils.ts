/**
 * Utility functions for product data processing
 */

/**
 * Clean HTML and dev language from product descriptions
 */
export function cleanProductDescription(description: string | null | undefined): string {
  if (!description) return '';
  
  // Remove HTML tags and dev language
  let cleaned = description
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Remove escaped characters
    .replace(/\\n/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    // Remove React/dev class names and attributes
    .replace(/className="[^"]*"/g, ' ')
    .replace(/data-[^=]*="[^"]*"/g, ' ')
    // Remove CSS class references
    .replace(/\b[a-z-]+:[a-z-]+\b/g, ' ')
    // Remove multiple spaces and normalize
    .replace(/\s+/g, ' ')
    .trim();
  
  // If the cleaned text is still mostly dev language, return empty
  if (cleaned.includes('react-scroll') || 
      cleaned.includes('css-') || 
      cleaned.includes('data-testid') ||
      cleaned.includes('flex-col') ||
      cleaned.includes('overflow-hidden') ||
      cleaned.length < 10) {
    return '';
  }
  
  return cleaned;
}

/**
 * Extract meaningful product description from messy HTML
 */
export function extractProductDescription(description: string | null | undefined): string {
  if (!description) return '';
  
  // Look for actual product description patterns
  const patterns = [
    // Look for text after common product description indicators
    /(?:approximately|features|crafted|made|includes|tall|glass|joint)[^.]*\./gi,
    // Look for size and material descriptions
    /\d+[""′]\s*tall[^.]*\./gi,
    /\d+mm\s*x\s*\d+mm[^.]*\./gi,
    // Look for brand and quality descriptions
    /German\s+[^.]*\./gi,
    /ROOR[^.]*\./gi,
  ];
  
  let extracted = '';
  for (const pattern of patterns) {
    const matches = description.match(pattern);
    if (matches) {
      extracted += matches.join(' ');
    }
  }
  
  if (extracted.length > 20) {
    return extracted.trim();
  }
  
  // Fallback: clean the entire description
  return cleanProductDescription(description);
}

/**
 * Check if an image URL is appropriate for the product type
 */
export function isImageAppropriateForProduct(imageUrl: string | null | undefined, productName: string): boolean {
  if (!imageUrl || !productName) return false;
  
  const name = productName.toLowerCase();
  const url = imageUrl.toLowerCase();
  
  // Ash catcher products should not use bong/beaker/straight tube images
  if (name.includes('ash') && (name.includes('catcher') || name.includes('catch'))) {
    // These are clearly bong images, not ash catcher images
    if (url.includes('beaker') || 
        url.includes('straight') || 
        url.includes('tube') ||
        url.includes('zeaker')) {
      return false;
    }
  }
  
  // Beaker products should not use straight tube images
  if (name.includes('beaker')) {
    if (url.includes('straight') || url.includes('tube')) {
      return false;
    }
  }
  
  // Straight tube products should not use beaker images
  if (name.includes('straight') && name.includes('tube')) {
    if (url.includes('beaker')) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get appropriate placeholder text for product type
 */
export function getProductPlaceholder(productName: string): { icon: string; text: string } {
  const name = productName.toLowerCase();
  
  if (name.includes('ash') && (name.includes('catcher') || name.includes('catch'))) {
    return { icon: '🔧', text: 'Ash Catcher' };
  }
  
  if (name.includes('beaker')) {
    return { icon: '🏺', text: 'Beaker' };
  }
  
  if (name.includes('straight') && name.includes('tube')) {
    return { icon: '🔬', text: 'Straight Tube' };
  }
  
  if (name.includes('bong') || name.includes('water pipe')) {
    return { icon: '💨', text: 'Water Pipe' };
  }
  
  if (name.includes('pipe')) {
    return { icon: '🚬', text: 'Pipe' };
  }
  
  if (name.includes('vape') || name.includes('vaporizer')) {
    return { icon: '💨', text: 'Vaporizer' };
  }
  
  if (name.includes('grinder')) {
    return { icon: '⚙️', text: 'Grinder' };
  }
  
  return { icon: '📦', text: 'Product' };
}

/**
 * Generate a clean product description if none exists
 */
export function generateProductDescription(product: any): string {
  if (!product) return '';
  
  const name = product.name || '';
  const brand = product.brand_name || '';
  const price = product.price || '';
  
  // Extract key features from the name
  const features = [];
  
  if (name.includes('Premium')) features.push('premium quality');
  if (name.includes('Professional')) features.push('professional grade');
  if (name.includes('Classic')) features.push('classic design');
  if (name.includes('German')) features.push('German engineering');
  if (name.includes('Schott')) features.push('Schott glass construction');
  if (name.includes('Borosilicate')) features.push('borosilicate glass');
  
  // Extract size information
  const sizeMatch = name.match(/(\d+(?:\.\d+)?)[""′]/);
  const size = sizeMatch ? `${sizeMatch[1]}" tall` : '';
  
  // Build description
  let description = '';
  if (brand) {
    description += `${brand} `;
  }
  
  if (name.includes('Ash Catcher')) {
    description += 'ash catcher featuring ';
  } else if (name.includes('Beaker')) {
    description += 'beaker featuring ';
  } else if (name.includes('Straight Tube')) {
    description += 'straight tube featuring ';
  } else {
    description += 'product featuring ';
  }
  
  if (features.length > 0) {
    description += features.join(', ');
  } else {
    description += 'quality construction';
  }
  
  if (size) {
    description += ` and measuring ${size}`;
  }
  
  description += '.';
  
  return description;
}
