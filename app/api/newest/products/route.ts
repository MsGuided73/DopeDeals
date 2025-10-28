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

    // Get newest products ordered by created_at (newest first)
    const { data: newProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price, fire_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, featured_product,
        brand_name, category_id, created_at, updated_at
      `)
      // Note: Removed .eq('is_active', true) filter for current manual inventory phase
      // Note: Removed .gt('stock_quantity', 0) filter for current manual inventory phase
      // Prioritize products with images
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Get more to filter for valid images

    if (error) {
      console.error('Error fetching new products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter for products with valid images
    const validProducts = (newProducts || []).filter((product: any) => {
      // Accept any non-empty image_url
      if (product.image_url && product.image_url.trim() !== '') {
        return hasRealProductImage(product.image_url);
      }

      // Check image_urls array for any non-empty URLs
      if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
        return product.image_urls.some((url: string) => url && url.trim() !== '' && hasRealProductImage(url));
      }

      return false;
    });

    console.log(`🎯 New Products API: ${validProducts.length} products with valid image URLs from ${newProducts?.length || 0} total`);

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
