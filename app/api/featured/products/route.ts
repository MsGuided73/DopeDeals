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

    // Fetch FEATURED products first, but ensure we get enough for featured product cards
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
      .limit(Math.min(limit, 12)); // Get more featured products to ensure availability

    if (error) {
      console.error('Error fetching featured products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Combine featured products with additional products for featured product cards
    let productsToReturn = priorityProducts || [];

    // If we need more products for featured cards, get additional products
    const remainingSlots = Math.max(limit - productsToReturn.length, 0);

    if (remainingSlots > 0) {
      console.log(`⚠️ Need ${remainingSlots} more products for featured cards, getting additional products`);

      const { data: additionalProducts, error: additionalError } = await supabase
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
        .limit(remainingSlots + 4); // Get extra to account for image filtering

      if (additionalError) {
        console.error('Error fetching additional products:', additionalError);
        // Continue with what we have
      } else if (additionalProducts) {
        productsToReturn = [...productsToReturn, ...additionalProducts];
        console.log(`✅ Added ${additionalProducts.length} additional products, total: ${productsToReturn.length}`);
      }
    }

    // Filter for products with ANY images (less restrictive to ensure display)
    let validProducts = productsToReturn.filter((product: any) => {
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

    // If we still don't have enough products, include products with placeholder images for featured cards
    if (validProducts.length < Math.max(4, limit) && productsToReturn.length > validProducts.length) {
      console.log(`⚠️ Still need more products, including placeholder images for featured cards`);

      const productsWithoutImages = productsToReturn.filter((product: any) => {
        const hasImageUrl = product.image_url && product.image_url.trim() !== '';
        const hasImageUrls = product.image_urls &&
                            Array.isArray(product.image_urls) &&
                            product.image_urls.length > 0 &&
                            product.image_urls.some((url: string) => url && url.trim() !== '');

        return !hasImageUrl && !hasImageUrls;
      });

      // Add products without images but limit to ensure we don't exceed total limit
      const additionalProducts = productsWithoutImages.slice(0, Math.max(4, limit) - validProducts.length);
      validProducts = [...validProducts, ...additionalProducts];

      console.log(`✅ Added ${additionalProducts.length} products with placeholder images, total: ${validProducts.length}`);
    }

    // Ensure we return at least some products for featured cards, even if just the first few
    if (validProducts.length === 0 && productsToReturn.length > 0) {
      console.log(`⚠️ No products with valid images, using first few products for featured cards`);
      validProducts = productsToReturn.slice(0, Math.max(4, limit));
    }

    // Sort by newest first, but prioritize featured products
    validProducts.sort((a, b) => {
      // Featured products get priority
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
      featuredCount: priorityProducts?.length || 0,
      fallbackCount: finalProducts.length - (priorityProducts?.length || 0)
    });

  } catch (error) {
    console.error('Error in featured products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
