import { createClient } from '@supabase/supabase-js';

/**
 * CSV IMPORT ENGINE
 * Complete data transformation and import system for sigdistro CSV data
 */

export interface CSVProduct {
  id: string;
  type: 'variable' | 'variation';
  sku: string;
  name: string;
  description: string;
  regular_price: string;
  sale_price?: string;
  categories: string;
  tags: string;
  images: string;
  // Additional fields from your CSV
  short_description?: string;
  weight_lbs?: string;
  length_in?: string;
  width_in?: string;
  height_in?: string;
  brands?: string;
  attribute_1_name?: string;
  attribute_1_values?: string;
  attribute_2_name?: string;
  attribute_2_values?: string;
  meta_rank_math_title?: string;
  meta_rank_math_description?: string;
}

export interface TransformedProduct {
  name: string;
  sku: string;
  description: string;
  price: number;
  compare_at_price?: number;
  image_urls: string[];
  category_name: string;
  tags: string[];
  attributes: Record<string, any>;
  specs: Record<string, any>;
  seo_title?: string;
  short_description?: string;
  weight_g?: number;
  dimensions?: Record<string, number>;
  brand_name?: string;
}

export interface ImportResults {
  total: number;
  processed: number;
  imported: number;
  updated: number;
  failed: number;
  errors: string[];
}

/**
 * Transform CSV product data to our database schema
 */
export function transformCSVProduct(csvProduct: any): TransformedProduct {
  return {
    // Core product data
    name: cleanProductName(csvProduct.name),
    sku: csvProduct.sku || generateSKU(csvProduct),
    description: cleanDescriptionForStorage(csvProduct.description || '', 5000),

    // Pricing
    price: parseFloat(csvProduct.regular_price) || 0,
    compare_at_price: csvProduct.sale_price ? parseFloat(csvProduct.sale_price) : undefined,

    // Images
    image_urls: extractImageUrls(csvProduct.images),

    // Categories and tags
    category_name: extractPrimaryCategory(csvProduct.categories),
    tags: parseTags(csvProduct.tags),

    // Attributes
    attributes: extractAttributes(csvProduct),

    // Physical specifications
    specs: extractSpecifications(csvProduct.description),

    // SEO data
    seo_title: csvProduct.meta_rank_math_title,
    short_description: csvProduct.short_description || generateShortDescription(csvProduct.description),

    // Physical measurements
    weight_g: csvProduct.weight_lbs ? Math.round(parseFloat(csvProduct.weight_lbs) * 453.592) : undefined,
    dimensions: extractDimensions(csvProduct),

    // Brand - intelligent extraction from product name and context
    brand_name: extractBrandName(csvProduct.name, csvProduct.categories)
  };
}

/**
 * Find matching product in database using multiple strategies
 */
export async function findMatchingProduct(
  transformedProduct: TransformedProduct,
  supabase: any
): Promise<{ matchType: 'exact' | 'similar' | 'none', productId?: string }> {

  // Strategy 1: REF Code matching (most reliable)
  const refCode = extractREFCode(transformedProduct.name);
  if (refCode) {
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .ilike('name', `%${refCode}%`)
      .single();

    if (existingProduct) {
      return { matchType: 'exact', productId: existingProduct.id };
    }
  }

  // Strategy 2: Name similarity matching
  const cleanName = transformedProduct.name;
  const { data: similarProducts } = await supabase
    .from('products')
    .select('id, name')
    .ilike('name', `%${cleanName}%`);

  if (similarProducts && similarProducts.length > 0) {
    // Use fuzzy matching to find best match
    const bestMatch = findBestNameMatch(cleanName, similarProducts);
    return { matchType: 'similar', productId: bestMatch.id };
  }

  return { matchType: 'none' };
}



/**
 * UTILITY FUNCTIONS
 */

export function cleanProductName(name: string): string {
  return name
    .replace(/^-limited edition-/i, '')
    .replace(/\|ref:\s*\w+\|/i, '')
    .trim();
}

export function extractREFCode(name: string): string | null {
  const match = name.match(/REF:\s*(\w+)/i);
  return match ? match[1] : null;
}

export function extractImageUrls(images: string): string[] {
  if (!images) return [];

  // Extract URLs from WordPress image format
  const urlMatches = images.match(/https:\/\/[^,\s]+/g);
  return urlMatches || [];
}

export function extractPrimaryCategory(categories: string): string {
  if (!categories) return 'Uncategorized';

  // Split by common delimiters and return first category
  const primary = categories.split(/[,>]/)[0].trim();
  return primary || 'Uncategorized';
}

export function parseTags(tags: string): string[] {
  if (!tags) return [];

  return tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

export function extractAttributes(csvProduct: any): Record<string, any> {
  const attributes: Record<string, any> = {};

  // Extract attribute 1
  if (csvProduct.attribute_1_name && csvProduct.attribute_1_values) {
    attributes[csvProduct.attribute_1_name] = csvProduct.attribute_1_values
      .split(',')
      .map((value: string) => value.trim());
  }

  // Extract attribute 2
  if (csvProduct.attribute_2_name && csvProduct.attribute_2_values) {
    attributes[csvProduct.attribute_2_name] = csvProduct.attribute_2_values
      .split(',')
      .map((value: string) => value.trim());
  }

  return attributes;
}

export function extractSpecifications(description: string): Record<string, any> {
  const specs: Record<string, any> = {};

  if (!description) return specs;

  // Extract height, width, bowl size from descriptions
  const heightMatch = description.match(/height\s+(\d+)["']/i);
  if (heightMatch) specs.height_inches = parseInt(heightMatch[1]);

  const widthMatch = description.match(/width\s+(\d+)["']/i);
  if (widthMatch) specs.width_inches = parseInt(widthMatch[1]);

  const bowlMatch = description.match(/(\d+)mm\s+male\s+bowl/i);
  if (bowlMatch) specs.bowl_size_mm = parseInt(bowlMatch[1]);

  return specs;
}

export function extractDimensions(csvProduct: any): Record<string, number> | undefined {
  const dimensions: Record<string, number> = {};

  if (csvProduct.length_in) dimensions.length_inches = parseFloat(csvProduct.length_in);
  if (csvProduct.width_in) dimensions.width_inches = parseFloat(csvProduct.width_in);
  if (csvProduct.height_in) dimensions.height_inches = parseFloat(csvProduct.height_in);

  return Object.keys(dimensions).length > 0 ? dimensions : undefined;
}

export function generateSKU(csvProduct: any): string {
  // Generate SKU from product name and ID
  const cleanName = cleanProductName(csvProduct.name).toUpperCase();
  const words = cleanName.split(' ').slice(0, 3).join('-');
  return `SIG-${words}-${csvProduct.id}`.substring(0, 50);
}

export function generateShortDescription(description: string): string {
  if (!description) return '';

  // Clean HTML and extract first paragraph
  const cleanText = stripHtml(description);
  const firstParagraph = cleanText.split('\n')[0];
  return firstParagraph.length > 200
    ? firstParagraph.substring(0, 200) + '...'
    : firstParagraph;
}

/**
 * Strip HTML tags and clean text for display
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  // Remove HTML tags
  let cleanText = html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&/g, '&') // Decode ampersands
    .replace(/</g, '<') // Decode less than
    .replace(/>/g, '>') // Decode greater than
    .replace(/"/g, '"') // Decode quotes
    .replace(/&#39;/g, "'") // Decode apostrophes
    .trim();

  // Remove extra whitespace and newlines
  cleanText = cleanText
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s+/g, '\n') // Clean up newlines
    .trim();

  return cleanText;
}

/**
 * Clean description for database storage (remove HTML, limit length)
 */
export function cleanDescriptionForStorage(description: string, maxLength: number = 5000): string {
  if (!description) return '';

  const cleanText = stripHtml(description);

  // Limit length if specified
  if (maxLength > 0 && cleanText.length > maxLength) {
    return cleanText.substring(0, maxLength - 3) + '...';
  }

  return cleanText;
}

export function findBestNameMatch(targetName: string, products: any[]): any {
  let bestMatch = products[0];
  let bestScore = 0;

  for (const product of products) {
    const score = calculateNameSimilarity(targetName, product.name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = product;
    }
  }

  return bestMatch;
}

export function calculateNameSimilarity(name1: string, name2: string): number {
  // Simple similarity score based on common words
  const words1 = name1.toLowerCase().split(' ');
  const words2 = name2.toLowerCase().split(' ');

  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

/**
 * Detect if product is a nicotine product that should be excluded from main site
 */
export function detectNicotineProduct(productName: string, categories: string, tags: string): boolean {
  const productNameLower = productName.toLowerCase();
  const categoriesLower = categories.toLowerCase();
  const tagsLower = tags.toLowerCase();

  // Check for nicotine indicators in product name
  const nicotineKeywords = [
    'nicotine', 'vape', 'e-liquid', 'e-juice', 'ejuice',
    'disposable', 'cartridge', 'pod', 'nic salt', 'nic-salt',
    'tobacco', 'cigarette', 'cigar'
  ];

  for (const keyword of nicotineKeywords) {
    if (productNameLower.includes(keyword)) {
      return true;
    }
  }

  // Check categories for nicotine products
  if (categoriesLower.includes('nicotine') || categoriesLower.includes('vape') ||
      categoriesLower.includes('tobacco') || categoriesLower.includes('e-liquid')) {
    return true;
  }

  // Check tags for nicotine products
  if (tagsLower.includes('nicotine') || tagsLower.includes('vape') ||
      tagsLower.includes('tobacco') || tagsLower.includes('disposable')) {
    return true;
  }

  // Special handling for brands that have both nicotine and non-nicotine products
  const dualBrands = ['crave', 'hidden hills', 'packman'];
  for (const brand of dualBrands) {
    if (productNameLower.includes(brand)) {
      // Check if it's specifically a nicotine product
      if (productNameLower.includes('vape') || productNameLower.includes('disposable') ||
          categoriesLower.includes('vape') || tagsLower.includes('nicotine')) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extract brand name from product name and context
 * Uses comprehensive brand list organized by category
 */
export function extractBrandName(productName: string, categories: string): string {
  // Comprehensive brand lists by category
  const BRANDS_BY_CATEGORY = {
    'thca': [
      'astro eight', 'astro-eight', 'astro_eight',
      'cali green gold', 'cali-green-gold', 'cali_green_gold',
      'cookies',
      'crave',
      'goo\'d extracts', 'good extracts', 'goo-d-extracts', 'good-extracts',
      'hidden hills', 'hidden-hills', 'hidden_hills',
      'mellow fellow', 'mellow-fellow', 'mellow_fellow',
      'packman',
      'pressure',
      'ryntz',
      'truemoola',
      'twenty-one', 'twenty_one', '21',
      'urth farmacy', 'urth-farmacy', 'urth_farmacy',
      'xsir'
    ],
    'kratom': [
      'doze',
      'float',
      'hydro7ever', 'hydro-7ever', 'hydro_7ever',
      'lucid',
      'pmp',
      'pure7', 'pure-7', 'pure_7',
      'opia',
      'edp'
    ],
    'mushrooms': [
      'mmelt', 'm-melt', 'm_melt',
      'mush caps', 'mush-caps', 'mush_caps',
      'truemoola',
      'zoomers',
      'tre house', 'tre-house', 'tre_house'
    ],
    'glass': [
      'utopia',
      'limited edition', 'limited-edition', 'limited_edition',
      'engraved',
      'graphic',
      'beaker'
    ],
    'nitrous': [
      'best whip', 'best-whip', 'best_whip',
      'doodlez',
      'infuzd',
      'let\'s go charge up', 'lets go charge up', 'let\'s-go-charge-up', 'lets-go-charge-up',
      'savage',
      'whip trip', 'whip-trip', 'whip_trip'
    ],
    'bongs_pipes': [
      'aztec',
      'diamond glass', 'diamond-glass', 'diamond_glass',
      'crave',
      'roor',
      'cany cane', 'cany-cane', 'cany_cane',
      'utopia',
      'limited edition', 'limited-edition', 'limited_edition'
    ],
    'dab_rigs': [
      'leaf buddi', 'leaf-buddi', 'leaf_buddi',
      'lotus',
      'puffco',
      'herbal connection', 'herbal-connection', 'herbal_connection'
    ],
    'hookahs': [
      'neo hookah', 'neo-hookah', 'neo_hookah',
      'ploox'
    ],
    'accessories': [
      'brass knuckles', 'brass-knuckles', 'brass_knuckles',
      'kalibloom',
      'fls lighter', 'fls-lighter', 'fls_lighter',
      'nifty',
      'raw papers', 'raw-papers', 'raw_papers',
      'special blue', 'special-blue', 'special_blue',
      'thicket',
      'zengaz',
      'screaming o', 'screaming-o', 'screaming_o',
      'crave'
    ]
  };

  const productNameLower = productName.toLowerCase();
  const categoriesLower = categories.toLowerCase();

  // Check each category's brands
  for (const [category, brands] of Object.entries(BRANDS_BY_CATEGORY)) {
    for (const brand of brands) {
      if (productNameLower.includes(brand) || categoriesLower.includes(brand)) {
        // Return properly formatted brand name
        return formatBrandName(brand);
      }
    }
  }

  // Special handling for Limited Edition combinations
  if (productNameLower.includes('limited edition')) {
    if (productNameLower.includes('utopia')) {
      return 'UTOPIA';
    }
    if (productNameLower.includes('engraved') || productNameLower.includes('graphic') || productNameLower.includes('beaker')) {
      return 'Limited Edition';
    }
  }

  // Category-based fallback for products without specific brand matches
  if (categoriesLower.includes('glass water pipes') || categoriesLower.includes('water pipes')) {
    return 'Glass Water Pipes';
  }
  if (categoriesLower.includes('smoking pipes') || categoriesLower.includes('pipes') || categoriesLower.includes('bongs')) {
    return 'Bongs & Pipes';
  }
  if (categoriesLower.includes('dab rigs') || categoriesLower.includes('dab-rigs') || categoriesLower.includes('dab_rigs') ||
      categoriesLower.includes('e-rigs') || categoriesLower.includes('vaporizors') || categoriesLower.includes('vaporizers')) {
    return 'Dab Rigs & Vaporizers';
  }
  if (categoriesLower.includes('hookahs') || categoriesLower.includes('hookah')) {
    return 'Hookahs';
  }
  if (categoriesLower.includes('accessories') || categoriesLower.includes('grinders') ||
      categoriesLower.includes('rolling trays') || categoriesLower.includes('ashtrays')) {
    return 'Accessories';
  }
  if (categoriesLower.includes('nitrous oxide') || categoriesLower.includes('nitrous-oxide') ||
      categoriesLower.includes('nitrous_oxide') || categoriesLower.includes('n2o')) {
    return 'Nitrous Oxide';
  }
  if (categoriesLower.includes('thca') || categoriesLower.includes('flower') ||
      categoriesLower.includes('concentrates') || categoriesLower.includes('vapes')) {
    return 'THCA Products';
  }
  if (categoriesLower.includes('kratom') || categoriesLower.includes('7-hydroxy') ||
      categoriesLower.includes('7-hydroxymitragynine')) {
    return 'Kratom Products';
  }
  if (categoriesLower.includes('mushroom')) {
    return 'Mushroom Products';
  }

  // Default fallback - no specific brand identified
  return 'Generic';
}

/**
 * Format brand name for consistent display
 */
function formatBrandName(brandKey: string): string {
  const brandFormatting: Record<string, string> = {
    'astro eight': 'Astro Eight',
    'astro-eight': 'Astro Eight',
    'astro_eight': 'Astro Eight',
    'cali green gold': 'Cali Green Gold',
    'cali-green-gold': 'Cali Green Gold',
    'cali_green_gold': 'Cali Green Gold',
    'goo\'d extracts': 'Goo\'d Extracts',
    'good extracts': 'Goo\'d Extracts',
    'goo-d-extracts': 'Goo\'d Extracts',
    'good-extracts': 'Goo\'d Extracts',
    'hidden hills': 'Hidden Hills',
    'hidden-hills': 'Hidden Hills',
    'hidden_hills': 'Hidden Hills',
    'mellow fellow': 'Mellow Fellow',
    'mellow-fellow': 'Mellow Fellow',
    'mellow_fellow': 'Mellow Fellow',
    'twenty-one': 'Twenty-One',
    'twenty_one': 'Twenty-One',
    'urth farmacy': 'Urth Farmacy',
    'urth-farmacy': 'Urth Farmacy',
    'urth_farmacy': 'Urth Farmacy',
    'hydro7ever': 'Hydro7ever',
    'hydro-7ever': 'Hydro7ever',
    'hydro_7ever': 'Hydro7ever',
    'pure7': 'Pure7',
    'pure-7': 'Pure7',
    'pure_7': 'Pure7',
    'tre house': 'Tre House',
    'tre-house': 'Tre House',
    'tre_house': 'Tre House',
    'mmelt': 'MMelt',
    'm-melt': 'MMelt',
    'm_melt': 'MMelt',
    'mush caps': 'Mush Caps',
    'mush-caps': 'Mush Caps',
    'mush_caps': 'Mush Caps',
    'limited edition': 'Limited Edition',
    'limited-edition': 'Limited Edition',
    'limited_edition': 'Limited Edition'
  };

  return brandFormatting[brandKey] || brandKey.charAt(0).toUpperCase() + brandKey.slice(1);
}

/**
 * Analyze products for review without importing to database
 */
export async function analyzeProductsForReview(csvProducts: any[], supabase: any) {
  const results = {
    total: csvProducts.length,
    analyzed: 0,
    main_site_products: 0,
    nicotine_products: 0,
    review_items: [] as any[]
  };

  // Filter out non-product rows (like headers or invalid data)
  const validProducts = csvProducts.filter(product =>
    product.name &&
    product.name.trim().length > 0 &&
    product.type // Must have a type field
  );

  console.log(`[CSV Analysis] Found ${validProducts.length} valid products out of ${csvProducts.length} total rows`);

  for (const csvProduct of validProducts) {
    try {
      // Check if this is a nicotine product that should be excluded from main site
      const isNicotineProduct = detectNicotineProduct(
        csvProduct.name || '',
        csvProduct.categories || '',
        csvProduct.tags || ''
      );

      if (isNicotineProduct) {
        results.nicotine_products++;
        results.review_items.push({
          csvProduct: {
            name: csvProduct.name,
            sku: csvProduct.sku,
            price: csvProduct.regular_price,
            category: csvProduct.categories,
            tags: csvProduct.tags
          },
          analysis: {
            isNicotineProduct: true,
            detectedBrand: 'NICOTINE_PRODUCT',
            recommendedAction: '❌ EXCLUDE_FROM_MAIN_SITE',
            reason: 'Detected as nicotine/vape product'
          }
        });
        results.analyzed++;
        continue;
      }

      // Transform CSV data to our schema
      const transformedProduct = transformCSVProduct(csvProduct);

      // Find existing product or prepare for new import
      const match = await findMatchingProduct(transformedProduct, supabase);

      // Extract brand using comprehensive brand detection
      const detectedBrand = extractBrandName(csvProduct.name || '', csvProduct.categories || '');

      results.main_site_products++;
      results.review_items.push({
        csvProduct: {
          name: csvProduct.name,
          sku: csvProduct.sku,
          price: csvProduct.regular_price,
          category: csvProduct.categories,
          tags: csvProduct.tags,
          image: csvProduct.images
        },
        analysis: {
          proposedMatch: match.productId ? 'Existing Product' : 'New Product',
          matchType: match.matchType,
          confidence: match.matchType === 'exact' ? '100%' : match.matchType === 'similar' ? '75%' : '0%',
          detectedBrand: detectedBrand,
          detectedCategory: transformedProduct.category_name,
          isNicotineProduct: false,
          recommendedAction: match.matchType === 'exact' ? '✅ AUTO_APPROVE' :
                           match.matchType === 'similar' ? '⚠️ REVIEW_NEEDED' : '❌ MANUAL_REVIEW'
        },
        transformedData: transformedProduct
      });

      results.analyzed++;
    } catch (error) {
      console.error(`[CSV Analysis] Failed to analyze product ${csvProduct.name}:`, error);
      results.review_items.push({
        csvProduct: {
          name: csvProduct.name,
          sku: csvProduct.sku,
          price: csvProduct.regular_price
        },
        analysis: {
          error: error instanceof Error ? error.message : 'Analysis failed',
          recommendedAction: '❌ ERROR_REVIEW_NEEDED'
        }
      });
      results.analyzed++;
    }
  }

  console.log(`[CSV Analysis] Analysis completed:`, results);
  return results;
}

/**
 * Import a batch of products with progress tracking
 */
export async function importProductsBatch(
  csvProducts: any[],
  supabase: any,
  batchSize: number = 25
): Promise<ImportResults> {
  const results: ImportResults = {
    total: csvProducts.length,
    processed: 0,
    imported: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  for (const csvProduct of csvProducts) {
    try {
      // Check if this is a nicotine product that should be excluded from main site
      const isNicotineProduct = detectNicotineProduct(
        csvProduct.name || '',
        csvProduct.categories || '',
        csvProduct.tags || ''
      );

      if (isNicotineProduct) {
        console.log(`[CSV Import] Skipping nicotine product: ${csvProduct.name}`);
        results.processed++;
        continue; // Skip nicotine products for main site
      }

      // Transform CSV data to our schema
      const transformedProduct = transformCSVProduct(csvProduct);

      // Find existing product or prepare for new import
      const match = await findMatchingProduct(transformedProduct, supabase);

      if (match.productId) {
        // Update existing product
        await updateExistingProduct(match.productId, transformedProduct, supabase);
        results.updated++;
      } else {
        // Create new product
        await createNewProduct(transformedProduct, supabase);
        results.imported++;
      }

      results.processed++;
    } catch (error) {
      results.failed++;
      results.errors.push(`Product ${csvProduct.name}: ${error}`);
      console.error(`[CSV Import] Failed to process product ${csvProduct.name}:`, error);
    }
  }

  return results;
}

/**
 * Update existing product with CSV data
 */
async function updateExistingProduct(
  productId: string,
  transformedProduct: TransformedProduct,
  supabase: any
) {
  const updateData = {
    name: transformedProduct.name,
    description: transformedProduct.description,
    price: transformedProduct.price,
    compare_at_price: transformedProduct.compare_at_price,
    image_urls: transformedProduct.image_urls,
    short_description: transformedProduct.short_description,
    specs: transformedProduct.specs,
    attributes: transformedProduct.attributes,
    tags: transformedProduct.tags,
    weight_g: transformedProduct.weight_g,
    dim_mm: transformedProduct.dimensions,
    seo_title: transformedProduct.seo_title,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', productId);

  if (error) {
    throw new Error(`Update failed: ${error.message}`);
  }

  console.log(`[CSV Import] Updated product: ${transformedProduct.name}`);
}

/**
 * Create new product from CSV data
 */
async function createNewProduct(
  transformedProduct: TransformedProduct,
  supabase: any
) {
  // First, ensure category exists or create it
  const categoryId = await ensureCategoryExists(transformedProduct.category_name, supabase);

  // First, ensure brand exists or create it
  const brandId = await ensureBrandExists(transformedProduct.brand_name || 'SIG DISTRO', supabase);

  const productData = {
    name: transformedProduct.name,
    sku: transformedProduct.sku,
    description: transformedProduct.description,
    price: transformedProduct.price,
    compare_at_price: transformedProduct.compare_at_price,
    image_urls: transformedProduct.image_urls,
    category_id: categoryId,
    brand_id: brandId,
    short_description: transformedProduct.short_description,
    specs: transformedProduct.specs,
    attributes: transformedProduct.attributes,
    tags: transformedProduct.tags,
    weight_g: transformedProduct.weight_g,
    dim_mm: transformedProduct.dimensions,
    seo_title: transformedProduct.seo_title,
    is_active: true,
    in_stock: true, // Assume in stock if in CSV
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('products')
    .insert(productData);

  if (error) {
    throw new Error(`Insert failed: ${error.message}`);
  }

  console.log(`[CSV Import] Created product: ${transformedProduct.name}`);
}

/**
 * Ensure category exists, create if not
 */
async function ensureCategoryExists(categoryName: string, supabase: any): Promise<string> {
  // First try to find existing category
  const { data: existingCategory } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', categoryName)
    .single();

  if (existingCategory) {
    return existingCategory.id;
  }

  // Create new category
  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert({
      name: categoryName,
      slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      is_active: true
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Category creation failed: ${error.message}`);
  }

  return newCategory.id;
}

/**
 * Ensure brand exists, create if not
 */
async function ensureBrandExists(brandName: string, supabase: any): Promise<string> {
  // First try to find existing brand
  const { data: existingBrand } = await supabase
    .from('brands')
    .select('id')
    .ilike('name', brandName)
    .single();

  if (existingBrand) {
    return existingBrand.id;
  }

  // Create new brand
  const { data: newBrand, error } = await supabase
    .from('brands')
    .insert({
      name: brandName,
      slug: brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      is_active: true
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Brand creation failed: ${error.message}`);
  }

  return newBrand.id;
}
