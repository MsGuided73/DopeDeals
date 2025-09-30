/**
 * Enhanced Product Categorization System
 * Accurately categorizes products into proper categories
 */

export interface ProductCategory {
  id: string;
  name: string;
  keywords: string[];
  exclusions: string[];
  priority: number; // Higher priority checked first
}

// Define all product categories with keywords and exclusions
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  // Nicotine/Tobacco products (highest priority - must exclude)
  {
    id: 'nicotine',
    name: 'Nicotine Products',
    keywords: ['nicotine', 'cigarette', 'cig', 'tobacco', 'vape juice', 'e-liquid', 'salt nic'],
    exclusions: [],
    priority: 100
  },
  
  // Rolling papers and wraps
  {
    id: 'papers',
    name: 'Rolling Papers',
    keywords: ['paper', 'rolling paper', 'cigarette paper', 'hemp paper', 'rice paper', 'zig zag', 'raw paper', 'ocb'],
    exclusions: ['bong', 'pipe', 'rig'],
    priority: 90
  },
  
  {
    id: 'wraps',
    name: 'Wraps & Cones',
    keywords: ['wrap', 'blunt wrap', 'hemp wrap', 'cone', 'pre-roll cone', 'king size cone'],
    exclusions: ['bong', 'pipe', 'rig'],
    priority: 89
  },
  
  // Glass categories
  {
    id: 'bongs',
    name: 'Bongs & Water Pipes',
    keywords: ['bong', 'water pipe', 'beaker', 'straight tube', 'percolator bong', 'ice bong'],
    exclusions: ['dab rig', 'oil rig', 'concentrate', 'bubbler', 'pipe', 'hand pipe'],
    priority: 80
  },
  
  {
    id: 'dab-rigs',
    name: 'Dab Rigs',
    keywords: ['dab rig', 'oil rig', 'concentrate rig', 'quartz banger', 'nail', 'dabbing'],
    exclusions: ['e-rig', 'electronic', 'puffco'],
    priority: 79
  },
  
  {
    id: 'e-rigs',
    name: 'E-Rigs',
    keywords: ['e-rig', 'electronic rig', 'puffco', 'peak', 'carta', 'boost', 'electric dab'],
    exclusions: [],
    priority: 78
  },
  
  {
    id: 'bubblers',
    name: 'Bubblers',
    keywords: ['bubbler', 'hammer bubbler', 'sherlock bubbler', 'sidecar bubbler'],
    exclusions: ['bong', 'rig'],
    priority: 77
  },
  
  {
    id: 'pipes',
    name: 'Hand Pipes',
    keywords: ['pipe', 'hand pipe', 'spoon pipe', 'sherlock', 'chillum', 'one hitter', 'dugout'],
    exclusions: ['water pipe', 'bong', 'bubbler', 'rig'],
    priority: 76
  },
  
  // Vaporizers
  {
    id: 'vaporizers',
    name: 'Vaporizers',
    keywords: ['vaporizer', 'vape', 'volcano', 'pax', 'mighty', 'crafty', 'arizer', 'dry herb vape'],
    exclusions: ['e-liquid', 'nicotine', 'cartridge'],
    priority: 75
  },
  
  // Cannabis products
  {
    id: 'thca-flower',
    name: 'THCA Flower',
    keywords: ['thca flower', 'thca bud', 'hemp flower', 'cbd flower', 'delta 8 flower', 'delta 9 flower'],
    exclusions: ['pre-roll', 'preroll'],
    priority: 70
  },
  
  {
    id: 'pre-rolls',
    name: 'Pre-Rolls',
    keywords: ['pre-roll', 'preroll', 'pre roll', 'joint', 'thca pre-roll', 'hemp pre-roll'],
    exclusions: ['cone', 'paper'],
    priority: 69
  },
  
  {
    id: 'concentrates',
    name: 'Concentrates',
    keywords: ['concentrate', 'wax', 'shatter', 'crumble', 'live resin', 'rosin', 'budder', 'sauce', 'diamonds'],
    exclusions: [],
    priority: 68
  },
  
  {
    id: 'edibles',
    name: 'Edibles',
    keywords: ['edible', 'gummy', 'gummies', 'chocolate', 'candy', 'cookie', 'brownie', 'thc edible'],
    exclusions: [],
    priority: 67
  },
  
  // Accessories
  {
    id: 'grinders',
    name: 'Grinders',
    keywords: ['grinder', 'herb grinder', 'metal grinder', '4 piece grinder'],
    exclusions: [],
    priority: 60
  },
  
  {
    id: 'storage',
    name: 'Storage',
    keywords: ['storage', 'jar', 'container', 'stash box', 'smell proof', 'airtight'],
    exclusions: [],
    priority: 59
  },
  
  {
    id: 'cleaning',
    name: 'Cleaning Supplies',
    keywords: ['cleaner', 'cleaning', 'iso', 'alcohol', 'brush', 'pipe cleaner', 'formula 420'],
    exclusions: [],
    priority: 58
  },
  
  {
    id: 'accessories',
    name: 'Accessories',
    keywords: ['accessory', 'tool', 'lighter', 'torch', 'mat', 'tray', 'ashtray', 'carb cap'],
    exclusions: [],
    priority: 50
  }
];

/**
 * Categorize a product based on its name and description
 */
export function categorizeProduct(product: {
  name: string;
  description?: string | null;
  zoho_category_name?: string | null;
}): string {
  const searchText = `${product.name} ${product.description || ''}`.toLowerCase();
  
  // Sort categories by priority (highest first)
  const sortedCategories = [...PRODUCT_CATEGORIES].sort((a, b) => b.priority - a.priority);
  
  for (const category of sortedCategories) {
    // Check if any keyword matches
    const hasKeyword = category.keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
    
    if (!hasKeyword) continue;
    
    // Check if any exclusion matches (if so, skip this category)
    const hasExclusion = category.exclusions.some(exclusion => 
      searchText.includes(exclusion.toLowerCase())
    );
    
    if (hasExclusion) continue;
    
    // Found a match!
    return category.id;
  }
  
  // Default to accessories if no match
  return 'accessories';
}

/**
 * Check if a product should be excluded from the main site (nicotine/tobacco)
 */
export function isNicotineProduct(product: {
  name: string;
  description?: string | null;
  nicotine_product?: boolean;
  tobacco_product?: boolean;
}): boolean {
  // Check database flags first
  if (product.nicotine_product === true || product.tobacco_product === true) {
    return true;
  }
  
  // Check content
  const searchText = `${product.name} ${product.description || ''}`.toLowerCase();
  const nicotineKeywords = ['nicotine', 'cigarette', 'tobacco', 'vape juice', 'e-liquid', 'salt nic'];
  
  return nicotineKeywords.some(keyword => searchText.includes(keyword));
}

/**
 * Get category display name
 */
export function getCategoryName(categoryId: string): string {
  const category = PRODUCT_CATEGORIES.find(c => c.id === categoryId);
  return category?.name || 'Accessories';
}

/**
 * Filter products by category
 */
export function filterProductsByCategory(
  products: any[],
  categoryId: string
): any[] {
  return products.filter(product => {
    const productCategory = categorizeProduct(product);
    return productCategory === categoryId;
  });
}

