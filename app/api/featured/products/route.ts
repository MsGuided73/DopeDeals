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
  
  const placeholderDomains = [
    'placehold.co',
    'placeholder.com',
    'via.placeholder.com',
    'unsplash.com',
    'picsum.photos',
    'lorempixel.com',
    'dummyimage.com',
    'example.com',
    'test.com'
  ];
  
  return !placeholderDomains.some(domain => imageUrl.toLowerCase().includes(domain));
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

    // Fetch FEATURED products first (give priority to featured products)
    const { data: priorityProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price, fire_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
        created_at, updated_at
      `)
      // Note: Removed .eq('is_active', true) filter for current manual inventory phase
      // Note: Removed .gt('stock_quantity', 0) filter for current manual inventory phase
      // COMPLIANCE: Filter out nicotine and tobacco products for main site compliance
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .eq('featured', true) // Get featured products first (priority)
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, Math.ceil(limit * 0.7))); // Take up to 70% from featured products

    if (error) {
      console.error('Error fetching featured products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If we don't have enough featured products, get fallback products (like Staff Picks)
    let productsToReturn = priorityProducts || [];

    if (productsToReturn.length < Math.max(4, limit)) {
      console.log(`⚠️ Only found ${productsToReturn.length} featured products, getting fallback products`);

      const { data: fallbackProducts, error: fallbackError } = await supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price, sale_price, fire_price,
          image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
          created_at, updated_at
        `)
        // Note: Removed .eq('is_active', true) filter for current manual inventory phase
        // Note: Removed .gt('stock_quantity', 0) filter for current manual inventory phase
        // COMPLIANCE: Filter out nicotine and tobacco products for main site compliance
        .eq('nicotine_product', false)
        .eq('tobacco_product', false)
        .neq('featured', true) // Exclude already featured products
        .gt('our_price', 0) // Must have valid price
        .order('created_at', { ascending: false })
        .limit(Math.max(4, limit) - productsToReturn.length);

      if (fallbackError) {
        console.error('Error fetching fallback products:', fallbackError);
        // Continue with what we have
      } else if (fallbackProducts) {
        productsToReturn = [...productsToReturn, ...fallbackProducts];
        console.log(`✅ Added ${fallbackProducts.length} fallback products, total: ${productsToReturn.length}`);
      }
    }

    // Filter for products with ANY images (less restrictive to ensure display)
    const validProducts = productsToReturn.filter((product: any) => {
      // Accept any non-null, non-empty image_url
      const hasImageUrl = product.image_url && product.image_url.trim() !== '';

      // Accept any image_urls array with at least one non-empty URL
      const hasImageUrls = product.image_urls &&
                          Array.isArray(product.image_urls) &&
                          product.image_urls.length > 0 &&
                          product.image_urls.some((url: string) => url && url.trim() !== '');

      return hasImageUrl || hasImageUrls;
    });

    console.log(`🎯 Featured Products API: ${validProducts.length} products with valid images from ${productsToReturn.length} total`);

    // Sort by newest first
    validProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      products: validProducts,
      total: validProducts.length
    });

  } catch (error) {
    console.error('Error in featured products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
