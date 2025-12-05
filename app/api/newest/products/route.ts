 import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * New Products API Route
 *
 * IMPORTANT: Database Implementation Pattern
 * - Uses "main_site_products" table
 * - Orders by created_at (newest first) to show the most recent products
 * - Validates images to ensure only products with valid images are returned
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
    'sigdistro.com'
  ];

  return validDomains.some(domain => cleanUrl.toLowerCase().includes(domain));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    // Get products specifically marked as "new arrivals" with valid images
    const { data: newProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, featured_product,
        brand_name, category_id, created_at, updated_at
      `)

      .eq('is_new', true) // Filter for products marked as new
      .order('created_at', { ascending: false })
      .limit(50); // Limit since we're targeting specific products

    if (error) {
      console.error('Error fetching new products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`⏬ Fetched ${newProducts?.length || 0} products with non-null image_url`);

    // Filter for products with valid image URLs (including sigdistro.com)
    const validProducts = (newProducts || []).filter((product: any) => {
      // Check if image_url has a valid URL (including sigdistro.com)
      if (product.image_url && product.image_url.trim() !== '' && hasRealProductImage(product.image_url)) {
        console.log(`✅ Valid image_url for ${product.name}: ${product.image_url}`);
        return true;
      }

      // Fallback: Check image_urls array for valid URLs
      if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
        const hasValidUrls = product.image_urls.some((url: string) =>
          url && url.trim() !== '' && hasRealProductImage(url)
        );
        if (hasValidUrls) {
          console.log(`✅ Valid image_urls for ${product.name}: ${product.image_urls}`);
          return true;
        }
      }

      return false; // Strict filtering - only show products with valid image URLs
    });

    console.log(`🎯 New Products API: ${validProducts.length} products with valid image URLs from ${newProducts?.length || 0} total products checked`);

    // Take only the requested number
    const finalProducts = validProducts.slice(0, limit);

    return NextResponse.json({
      products: finalProducts,
      total: finalProducts.length,
      message: 'New products retrieved successfully'
    });

  } catch (error) {
    console.error('Error in new products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
