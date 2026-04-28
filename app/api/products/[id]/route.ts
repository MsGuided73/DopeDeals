import { getStorage } from '../../../../lib/storage';
import { parseImageUrls } from '../../../../lib/utils/image-utils';

// TypeScript interfaces for the new PDP response shape
interface PDPImage {
  url: string;
  role: 'hero' | 'gallery' | 'label';
  is_primary: boolean;
  sort_order: number;
}

interface PDPIngredients {
  contains: string[];
  allergens: string[];
  dietary: string[];
  warnings: string[];
  source: 'label' | 'manufacturer' | 'unknown';
  last_verified_at: string | null;
}

interface PDPShipRestrictions {
  restricted_states: string[];
  restricted_counties: string[];
  restricted_cities: string[];
  ships_ground_only: boolean;
  requires_adult_signature: boolean;
  po_box_allowed: boolean;
  notes: string;
}

interface PDPStorePolicies {
  discreet_packaging: boolean;
  tracking_provided: boolean;
  fast_fulfillment: boolean;
}

interface PDPUIState {
  can_purchase: boolean;
  price_visible: boolean;
}

interface PDPResponse {
  product: {
    id: string;
    slug: string;
    display_name: string;
    brand: string | null;
    short_description: string | null;
    description: string | null;
    description_markdown?: string | null;
    highlights?: string[] | null;
    flavors?: string[] | null;
    allergy_warning?: string | null;
    product_type: string | null;
    stock_quantity: number;
  };
  pricing_status: 'priced' | 'pending' | 'hidden';
  display_price_cents: number | null;
  compare_at_price_cents: number | null;
  images: PDPImage[];
  coa: { url: string | null };
  ingredients: PDPIngredients;
  ship_restrictions: PDPShipRestrictions;
  store_policies: PDPStorePolicies;
  selectors: any[];
  variants: any[];
  selected_variant_id: string | null;
  ui_state: PDPUIState;
}

// Default ingredients structure when not provided
const DEFAULT_INGREDIENTS: PDPIngredients = {
  contains: [],
  allergens: [],
  dietary: [],
  warnings: [],
  source: 'unknown',
  last_verified_at: null
};

// Default shipping restrictions
const DEFAULT_SHIP_RESTRICTIONS: PDPShipRestrictions = {
  restricted_states: [],
  restricted_counties: [],
  restricted_cities: [],
  ships_ground_only: false,
  requires_adult_signature: false,
  po_box_allowed: true,
  notes: 'Shipping restrictions may apply based on your location.'
};

// Store policies - discreet packaging is ALWAYS true
const STORE_POLICIES: PDPStorePolicies = {
  discreet_packaging: true,
  tracking_provided: true,
  fast_fulfillment: true
};

/**
 * Parse image URLs from various formats into a consistent images array
 */
function buildImagesArray(rawProduct: any): PDPImage[] {
  const images: PDPImage[] = [];
  const seenUrls = new Set<string>();

  // Helper to add image if not duplicate
  const addImage = (url: string | null | undefined, role: 'hero' | 'gallery' | 'label', isPrimary: boolean) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return;
    const cleanUrl = url.trim();
    if (seenUrls.has(cleanUrl)) return;
    seenUrls.add(cleanUrl);
    images.push({
      url: cleanUrl,
      role,
      is_primary: isPrimary,
      sort_order: images.length
    });
  };

  // 1. Primary image (hero)
  addImage(rawProduct.image_url, 'hero', true);

  // 2. Gallery images from image_urls array
  if (rawProduct.image_urls) {
    const urls = parseImageUrls(rawProduct.image_urls);
    urls.forEach((url: string) => addImage(url, 'gallery', false));
  }

  // 3. Gallery images from gallery_images JSONB (new format)
  if (rawProduct.gallery_images && Array.isArray(rawProduct.gallery_images)) {
    rawProduct.gallery_images.forEach((img: any) => {
      if (typeof img === 'string') {
        addImage(img, 'gallery', false);
      } else if (img && typeof img === 'object' && img.url) {
        addImage(img.url, img.role || 'gallery', false);
      }
    });
  }

  return images;
}

/**
 * Normalize ingredients from various formats to the standard structure
 */
function normalizeIngredients(rawIngredients: any): PDPIngredients {
  if (!rawIngredients) return DEFAULT_INGREDIENTS;

  // If it's already in the expected format
  if (typeof rawIngredients === 'object' && !Array.isArray(rawIngredients)) {
    // Handle the specific Micro Dot format (ingredients array inside object, with allergens)
    if (rawIngredients.ingredients && Array.isArray(rawIngredients.ingredients)) {
      const parsedContains = rawIngredients.ingredients.map((i: any) => typeof i === 'string' ? i : i.name);
      return {
        contains: parsedContains,
        allergens: rawIngredients.allergens?.contains || [],
        dietary: [],
        warnings: rawIngredients.allergens?.warning ? [rawIngredients.allergens.warning] : [],
        source: 'label',
        last_verified_at: null
      };
    }

    return {
      contains: Array.isArray(rawIngredients.contains) ? rawIngredients.contains : [],
      allergens: Array.isArray(rawIngredients.allergens) ? rawIngredients.allergens : [],
      dietary: Array.isArray(rawIngredients.dietary) ? rawIngredients.dietary : [],
      warnings: Array.isArray(rawIngredients.warnings) ? rawIngredients.warnings : [],
      source: rawIngredients.source || 'unknown',
      last_verified_at: rawIngredients.last_verified_at || null
    };
  }

  // If it's a simple array (legacy format), convert to contains
  if (Array.isArray(rawIngredients)) {
    return {
      contains: rawIngredients.filter(i => typeof i === 'string'),
      allergens: [],
      dietary: [],
      warnings: [],
      source: 'label',
      last_verified_at: null
    };
  }

  return DEFAULT_INGREDIENTS;
}

/**
 * Normalize shipping restrictions from various formats
 */
function normalizeShipRestrictions(rawRestrictions: any): PDPShipRestrictions {
  if (!rawRestrictions || typeof rawRestrictions !== 'object') {
    return DEFAULT_SHIP_RESTRICTIONS;
  }

  return {
    restricted_states: Array.isArray(rawRestrictions.restricted_states) 
      ? rawRestrictions.restricted_states : [],
    restricted_counties: Array.isArray(rawRestrictions.restricted_counties) 
      ? rawRestrictions.restricted_counties : [],
    restricted_cities: Array.isArray(rawRestrictions.restricted_cities) 
      ? rawRestrictions.restricted_cities : [],
    ships_ground_only: Boolean(rawRestrictions.ships_ground_only),
    requires_adult_signature: Boolean(rawRestrictions.requires_adult_signature),
    po_box_allowed: rawRestrictions.po_box_allowed !== false, // Default true
    notes: rawRestrictions.notes || DEFAULT_SHIP_RESTRICTIONS.notes
  };
}

/**
 * Determine pricing status based on product data
 */
function determinePricingStatus(rawProduct: any): 'priced' | 'pending' | 'hidden' {
  const price = parseFloat(rawProduct.our_price);
  
  // Check for placeholder prices (0.01, 0, null)
  if (isNaN(price) || price <= 0.01) {
    return 'pending';
  }
  
  // Check display_price_type flag if exists
  if (rawProduct.display_price_type === 'hidden') {
    return 'hidden';
  }

  return 'priced';
}

/**
 * Infer product type from category and name if not explicitly set
 */
function inferProductType(rawProduct: any): string | null {
  if (rawProduct.product_type) {
    return rawProduct.product_type;
  }

  const name = (rawProduct.name || '').toLowerCase();
  const category = (rawProduct.category_slug || rawProduct.category_id || '').toLowerCase();

  // Check for edibles
  if (category.includes('gumm') || category.includes('edible') || category.includes('chocolate') ||
      name.includes('gumm') || name.includes('edible') || name.includes('chocolate')) {
    return 'edible';
  }

  // Check for vapes
  if (category.includes('vape') || category.includes('cart') || category.includes('disposable') ||
      name.includes('vape') || name.includes('cart') || name.includes('disposable')) {
    return 'vape';
  }

  // Check for flower
  if (category.includes('flower') || name.includes('flower')) {
    return 'flower';
  }

  // Check for pre-rolls
  if (category.includes('preroll') || category.includes('pre-roll') ||
      name.includes('preroll') || name.includes('pre-roll')) {
    return 'pre-roll';
  }

  // Check for mushrooms
  if (category.includes('mushroom') || category.includes('shroom') ||
      name.includes('mushroom') || name.includes('shroom')) {
    return 'mushroom';
  }

  // Check for concentrates
  if (category.includes('concentrate') || category.includes('dab') || category.includes('wax') ||
      name.includes('concentrate') || name.includes('dab') || name.includes('wax')) {
    return 'concentrate';
  }

  return 'other';
}

// Next.js 15 requires params as a Promise
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    console.log('PDP API: Looking up product with ID:', id);

    const storage = await getStorage();
    const rawProduct = await storage.getProduct(id);

    if (!rawProduct) {
      console.log('PDP API: Product not found for ID:', id);
      return NextResponse.json({
        message: 'Product not found',
        productId: id,
        suggestion: 'This product may have been removed or the ID may be incorrect'
      }, { status: 404 });
    }

    // Fetch variations
    let variations: any[] = [];
    try {
      variations = await storage.getProductVariations(rawProduct);
    } catch (varError) {
      console.error('Error fetching variations:', varError);
    }

    // Build the new standardized response
    const pricingStatus = determinePricingStatus(rawProduct);
    const priceVisible = pricingStatus === 'priced';
    const canPurchase = priceVisible && (rawProduct.stock_quantity || 0) > 0;

    // Handle COA URL - field name has hyphen in DB
    const coaUrl = rawProduct['coa-url'] || null;
    // Clean up false-string values
    const cleanCoaUrl = (coaUrl === 'false' || coaUrl === '') ? null : coaUrl;

    const response: PDPResponse = {
      product: {
        id: rawProduct.id,
        slug: rawProduct.sku || rawProduct.id,
        display_name: rawProduct.display_name || rawProduct.name,
        brand: rawProduct.brand_name || rawProduct.brand_id || null,
        short_description: rawProduct.short_description || null,
        description: rawProduct.description || null,
        description_markdown: rawProduct.description_markdown || null,
        highlights: rawProduct.highlights || null,
        flavors: rawProduct.flavors || null,
        allergy_warning: rawProduct.allergy_warning || null,
        product_type: inferProductType(rawProduct),
        stock_quantity: rawProduct.stock_quantity || 0
      },
      pricing_status: pricingStatus,
      display_price_cents: priceVisible 
        ? Math.round(parseFloat(rawProduct.our_price) * 100) 
        : null,
      compare_at_price_cents: priceVisible && rawProduct.sale_price 
        ? Math.round(parseFloat(rawProduct.sale_price) * 100) 
        : null,
      images: buildImagesArray(rawProduct),
      coa: { url: cleanCoaUrl },
      ingredients: normalizeIngredients(rawProduct.ingredients),
      ship_restrictions: normalizeShipRestrictions(rawProduct.ship_restrictions),
      store_policies: STORE_POLICIES,
      selectors: [], // Placeholder for future variant selectors
      variants: variations.map((v: any) => ({
        id: v.id,
        name: v.name,
        image_url: v.image_url,
        price_cents: Math.round(parseFloat(v.our_price) * 100) || null,
        sale_price_cents: v.sale_price ? Math.round(parseFloat(v.sale_price) * 100) : null,
        in_stock: (v.stock_quantity || 0) > 0
      })),
      selected_variant_id: null,
      ui_state: {
        can_purchase: canPurchase,
        price_visible: priceVisible
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch product',
        error: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
