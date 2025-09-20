/**
 * Product Categorization Utilities
 * 
 * Functions to detect brands and categories from product names
 * since the database fields are mostly null.
 */

export interface ProductCategory {
  value: string;
  label: string;
  count?: number;
}

export interface ProductBrand {
  value: string;
  label: string;
  count?: number;
}

// Detect brand from product name
export function detectBrand(productName: string): string {
  const name = productName.toLowerCase();
  
  if (name.includes('crave')) return 'crave';
  if (name.includes('geek bar') || name.includes('geekbar')) return 'geek-bar';
  if (name.includes('elf bar') || name.includes('elfbar')) return 'elf-bar';
  if (name.includes('puffco')) return 'puffco';
  if (name.includes('roor')) return 'roor';
  if (name.includes('blazy')) return 'blazy-susan';
  if (name.includes('float')) return 'float';
  if (name.includes('nu e-liquid')) return 'nu-e-liquid';
  if (name.includes('lost mary')) return 'lost-mary';
  if (name.includes('hyde')) return 'hyde';
  if (name.includes('fume')) return 'fume';
  if (name.includes('air bar')) return 'air-bar';
  if (name.includes('breeze')) return 'breeze';
  if (name.includes('vuse')) return 'vuse';
  
  return 'other';
}

// Detect category from product name
export function detectCategory(productName: string): string {
  const name = productName.toLowerCase();
  
  if (name.includes('dispo') || name.includes('disposable') || name.includes('puff')) {
    return 'disposables';
  }
  if (name.includes('battery') || name.includes('charger') || name.includes('mod')) {
    return 'batteries';
  }
  if (name.includes('pipe') || name.includes('bong') || name.includes('rig')) {
    return 'pipes-bongs';
  }
  if (name.includes('joint') || name.includes('cone') || name.includes('paper') || name.includes('wrap')) {
    return 'rolling-papers';
  }
  if (name.includes('thca') || name.includes('cbg') || name.includes('cbd') || name.includes('preroll')) {
    return 'cannabis';
  }
  if (name.includes('e-liquid') || name.includes('juice') || name.includes('vape juice')) {
    return 'e-liquids';
  }
  if (name.includes('knife') || name.includes('tool')) {
    return 'tools';
  }
  if (name.includes('holder') || name.includes('display') || name.includes('case')) {
    return 'accessories';
  }
  if (name.includes('tab') || name.includes('gummy') || name.includes('edible')) {
    return 'edibles';
  }
  
  return 'other';
}

// Get brand display name
export function getBrandDisplayName(brandValue: string): string {
  const brandMap: { [key: string]: string } = {
    'crave': 'Crave',
    'geek-bar': 'Geek Bar',
    'elf-bar': 'Elf Bar',
    'puffco': 'Puffco',
    'roor': 'ROOR',
    'blazy-susan': 'Blazy Susan',
    'float': 'Float',
    'nu-e-liquid': 'NU E-Liquid',
    'lost-mary': 'Lost Mary',
    'hyde': 'Hyde',
    'fume': 'Fume',
    'air-bar': 'Air Bar',
    'breeze': 'Breeze',
    'vuse': 'Vuse',
    'other': 'Other'
  };
  
  return brandMap[brandValue] || brandValue;
}

// Get category display name
export function getCategoryDisplayName(categoryValue: string): string {
  const categoryMap: { [key: string]: string } = {
    'disposables': 'Disposables',
    'batteries': 'Batteries',
    'pipes-bongs': 'Pipes & Bongs',
    'rolling-papers': 'Rolling Papers',
    'cannabis': 'Cannabis',
    'e-liquids': 'E-Liquids',
    'tools': 'Tools',
    'accessories': 'Accessories',
    'edibles': 'Edibles',
    'other': 'Other'
  };
  
  return categoryMap[categoryValue] || categoryValue;
}

// Available categories for filtering
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'disposables', label: 'Disposables' },
  { value: 'e-liquids', label: 'E-Liquids' },
  { value: 'cannabis', label: 'Cannabis' },
  { value: 'pipes-bongs', label: 'Pipes & Bongs' },
  { value: 'batteries', label: 'Batteries' },
  { value: 'rolling-papers', label: 'Rolling Papers' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'tools', label: 'Tools' },
  { value: 'edibles', label: 'Edibles' },
  { value: 'other', label: 'Other' }
];

// Available brands for filtering
export const PRODUCT_BRANDS: ProductBrand[] = [
  { value: 'all', label: 'All Brands' },
  { value: 'crave', label: 'Crave' },
  { value: 'geek-bar', label: 'Geek Bar' },
  { value: 'elf-bar', label: 'Elf Bar' },
  { value: 'nu-e-liquid', label: 'NU E-Liquid' },
  { value: 'roor', label: 'ROOR' },
  { value: 'puffco', label: 'Puffco' },
  { value: 'blazy-susan', label: 'Blazy Susan' },
  { value: 'float', label: 'Float' },
  { value: 'lost-mary', label: 'Lost Mary' },
  { value: 'hyde', label: 'Hyde' },
  { value: 'fume', label: 'Fume' },
  { value: 'air-bar', label: 'Air Bar' },
  { value: 'breeze', label: 'Breeze' },
  { value: 'vuse', label: 'Vuse' },
  { value: 'other', label: 'Other' }
];

// Price ranges for filtering
export const PRICE_RANGES = [
  { value: 'all', label: 'All Prices', min: 0, max: 10000 },
  { value: '0-10', label: 'Under $10', min: 0, max: 10 },
  { value: '10-25', label: '$10 - $25', min: 10, max: 25 },
  { value: '25-50', label: '$25 - $50', min: 25, max: 50 },
  { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
  { value: '100-200', label: '$100 - $200', min: 100, max: 200 },
  { value: '200+', label: '$200+', min: 200, max: 10000 }
];

// Filter products by detected brand
export function filterByBrand(products: any[], brandValue: string): any[] {
  if (brandValue === 'all') return products;
  
  return products.filter(product => {
    const detectedBrand = detectBrand(product.name);
    return detectedBrand === brandValue;
  });
}

// Filter products by detected category
export function filterByCategory(products: any[], categoryValue: string): any[] {
  if (categoryValue === 'all') return products;
  
  return products.filter(product => {
    const detectedCategory = detectCategory(product.name);
    return detectedCategory === categoryValue;
  });
}

// Filter products by price range
export function filterByPriceRange(products: any[], priceRangeValue: string): any[] {
  if (priceRangeValue === 'all') return products;
  
  const range = PRICE_RANGES.find(r => r.value === priceRangeValue);
  if (!range) return products;
  
  return products.filter(product => {
    const price = parseFloat(product.price) || 0;
    return price >= range.min && price <= range.max;
  });
}

// Get product statistics by category and brand
export function getProductStats(products: any[]) {
  const categoryStats: { [key: string]: number } = {};
  const brandStats: { [key: string]: number } = {};
  
  products.forEach(product => {
    const category = detectCategory(product.name);
    const brand = detectBrand(product.name);
    
    categoryStats[category] = (categoryStats[category] || 0) + 1;
    brandStats[brand] = (brandStats[brand] || 0) + 1;
  });
  
  return { categoryStats, brandStats };
}
