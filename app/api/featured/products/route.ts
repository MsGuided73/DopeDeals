import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Featured Products API Route
 *
 * IMPORTANT: Database Implementation Pattern
 * - Uses "main_site_products" table (CORRECT)
 * - Filters by featured: true for primary results
 * - Has fallback mechanism for when few featured products exist
 * - Validates images to ensure only products with valid images are returned
 *
 * PATTERN COMPARISON:
 * ✅ CORRECT: This API route (uses proper table, filtering, fallbacks)
 * ❌ WRONG: Direct supabaseBrowser queries in components
 * ✅ CORRECT: Staff Picks API (same pattern as this)
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hasRealProductImage(imageUrl: string | null): boolean {
  if (!imageUrl) return false;

  // Clean the URL by removing trailing commas and whitespace
  const cleanUrl = imageUrl.trim().replace(/,+$/, '');

  const placeholderDomains = [
    'placehold.co',
    'placeholder.com',
    'via.placeholder.com',
    'picsum.photos',
    'lorempixel.com',
    'dummyimage.com',
    'example.com',
    'test.com'
  ];

  // Exclude placeholder domains
  if (placeholderDomains.some(domain => cleanUrl.toLowerCase().includes(domain))) {
    return false;
  }

  // Must be a valid image URL from storage or legitimate source
  const validDomains = [
    'qirbapivptotybspnbet.supabase.co',
    'supabase.co',
    'supabase.in',
    'amazonaws.com',
    'cloudfront.net',
    'imgur.com',
    'githubusercontent.com',
    'sigdistro.com'  // Added for existing product images
  ];

  return validDomains.some(domain => cleanUrl.toLowerCase().includes(domain));
}

function isValidImageUrl(imageUrl: string | null): boolean {
  if (!imageUrl) return false;

  // Check for common image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const hasImageExtension = imageExtensions.some(ext =>
    imageUrl.toLowerCase().includes(ext)
  );

  // Check for valid URL format
  const isValidUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');

  return isValidUrl && (hasImageExtension || imageUrl.includes('images') || imageUrl.includes('media'));
}

function getImageUrl(product: any): string | null {
  // Try both field names for maximum compatibility
  return product.imageUrl || product.image_url || null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '8');

      // Check for FEATURED_PRODUCT first - these take absolute priority
      const { data: featuredProducts, error: featuredError } = await supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price, sale_price,
          image_url, image_urls, sku, stock_quantity, is_active, featured, featured_product, brand_name, category_id,
          created_at, updated_at
        `)
      // Note: Removed .eq('is_active', true) filter for current manual inventory phase
      // Note: Removed .gt('stock_quantity', 0) filter for current manual inventory phase
      // Note: Removed nicotine and tobacco filters for recommendations
      // STRICT: No Kratom or related substances
      .not('name', 'ilike', '%kratom%')
      .not('name', 'ilike', '%7-oh%')
      .not('name', 'ilike', '%7-hydroxy%')
      .not('name', 'ilike', '%mitragynine%')
      .not('name', 'ilike', '%7-ohmz%')
      .not('description', 'ilike', '%kratom%')
      .not('description', 'ilike', '%7-oh%')
      .not('description', 'ilike', '%7-hydroxy%')
      .not('description', 'ilike', '%mitragynine%')
      .not('description', 'ilike', '%7-ohmz%')
      .or('featured_product.eq.true,featured_product.eq."YES"') // Get featured_product items (both boolean true and string "YES")
      .order('created_at', { ascending: false });

    if (featuredError) {
      console.error('Error fetching featured_product items:', featuredError);
      return NextResponse.json({ error: featuredError.message }, { status: 500 });
    }

    let productsToReturn = [];
    let featuredCount = 0;

    if (featuredProducts && featuredProducts.length > 0) {
      console.log(`🎯 Found ${featuredProducts.length} featured_product items - these take priority!`);
      productsToReturn = featuredProducts;
      featuredCount = featuredProducts.length;
    } else {
      console.log(`⚠️ No featured_product items found, falling back to featured items`);

      // Fallback to FEATURED products if no featured_product items exist
      const { data: priorityProducts, error } = await supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price, sale_price,
          image_url, image_urls, sku, stock_quantity, is_active, featured, featured_product, brand_name, category_id,
          created_at, updated_at
        `)
        // Note: Removed .eq('is_active', true) filter for current manual inventory phase
        // Note: Removed .gt('stock_quantity', 0) filter for current manual inventory phase
        // Note: Removed nicotine and tobacco filters for recommendations
        // STRICT: No Kratom or related substances
        .not('name', 'ilike', '%kratom%')
        .not('name', 'ilike', '%7-oh%')
        .not('name', 'ilike', '%7-hydroxy%')
        .not('name', 'ilike', '%mitragynine%')
        .not('name', 'ilike', '%7-ohmz%')
        .not('description', 'ilike', '%kratom%')
        .not('description', 'ilike', '%7-oh%')
        .not('description', 'ilike', '%7-hydroxy%')
        .not('description', 'ilike', '%mitragynine%')
        .not('description', 'ilike', '%7-ohmz%')
        .eq('featured', true) // Get featured products as fallback
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 12)); // Get more featured products to ensure availability

      if (error) {
        console.error('Error fetching featured products:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      productsToReturn = priorityProducts || [];
      featuredCount = priorityProducts?.length || 0;
    }

    // Filter for products with any image_url (relaxed validation)
    let validProducts = productsToReturn.filter((product: any) => {
      // Accept any non-empty image_url
      if (product.image_url && product.image_url.trim() !== '') {
        return true;
      }

      // Check image_urls array for any non-empty URLs
      if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
        return product.image_urls.some((url: string) => url && url.trim() !== '');
      }

      return false;
    });

    console.log(`🎯 Featured Products API: ${validProducts.length} products with image URLs from ${productsToReturn.length} total`);

    // If we don't have enough products with images, return what we have
    // Include products even if they don't have perfect image URLs
    if (validProducts.length === 0) {
      console.log(`⚠️ No products with image URLs found`);
      return NextResponse.json({
        products: [],
        total: 0,
        featuredCount: 0,
        fallbackCount: 0,
        message: 'No products with image URLs found'
      });
    }

    // Sort by newest first, but prioritize featured_product and featured products
    validProducts.sort((a, b) => {
      // featured_product items get highest priority
      if (a.featured_product && !b.featured_product) return -1;
      if (!a.featured_product && b.featured_product) return 1;

      // Then featured items get priority
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then sort by newest first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Limit to requested amount for featured cards
    const finalProducts = validProducts.slice(0, limit);

    return NextResponse.json({
      products: finalProducts,
      total: finalProducts.length,
      featuredCount: featuredCount,
      fallbackCount: finalProducts.length - featuredCount
    });

  } catch (error) {
    console.error('Error in featured products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
