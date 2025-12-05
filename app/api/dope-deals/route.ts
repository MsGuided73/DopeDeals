import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Dope Deals API Route
 *
 * Returns products that have active discount flags (DD10 or DD15)
 * Applies the discount automatically during the query
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hasRealProductImage(imageUrl: string | null): boolean {
  if (!imageUrl) return false;

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

  if (placeholderDomains.some(domain => cleanUrl.toLowerCase().includes(domain))) {
    return false;
  }

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
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get products that have active dope deal flags
    const { data: dopeDeals, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, featured_product,
        brand_name, category_id, created_at, updated_at, DD10, DD15
      `)

      .or('DD10.eq.true,DD15.eq.true') // Products with either DD10 or DD15 flag
      .eq('is_active', true) // Only active products
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching dope deals:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`⏬ Fetched ${dopeDeals?.length || 0} dope deal products`);

    // Filter for products with valid image URLs
    const validProducts = (dopeDeals || []).filter((product: any) => {
      if (product.image_url && product.image_url.trim() !== '' && hasRealProductImage(product.image_url)) {
        console.log(`✅ Valid image_url for dope deal: ${product.name}`);
        return true;
      }

      if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
        const hasValidUrls = product.image_urls.some((url: string) =>
          url && url.trim() !== '' && hasRealProductImage(url)
        );
        if (hasValidUrls) {
          console.log(`✅ Valid image_urls for dope deal: ${product.name}`);
          return true;
        }
      }

      return false;
    });

    console.log(`🎯 Dope Deals API: ${validProducts.length} products with valid images from ${dopeDeals?.length || 0} total deals`);

    return NextResponse.json({
      products: validProducts,
      total: validProducts.length,
      message: 'Dope deals retrieved successfully'
    });

  } catch (error) {
    console.error('Error in dope deals API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
