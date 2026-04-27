import { createClient } from '@supabase/supabase-js';
import { normalizeProductImages } from '../../../lib/utils/image-utils';
import { applyRestrictedProductFilter } from '../../../lib/compliance-filters';

// Module-level singleton — uses NEXT_PUBLIC_ vars baked in at build time (same pattern as /api/newest/products)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    // NO LIMIT: Return all products
    const limit = 5000;
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const category = url.searchParams.get('category');

    // Build query - Use main_site_products table
    // Only show active products and exclude restricted products (batteries, kratom, etc.)
    let query = supabase
      .from('main_site_products')
      .select('*')
      .eq('is_active', true)
      .not('name', 'ilike', '%battery%')
      .not('description', 'ilike', '%battery%')
      .not('short_description', 'ilike', '%battery%');

    // Apply centralized compliance filters
    query = applyRestrictedProductFilter(query, ['name', 'description', 'short_description']);

    // Apply category filter if provided
    if (category) {
      query = query.eq('category_id', category);
    }

    // Apply pagination
    if (limit > 0) {
      query = query.limit(limit);
    }
    if (offset > 0) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
    }

    // Get total count for pagination info (only active products, excluding restricted products)
    let countQuery = supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .not('name', 'ilike', '%battery%')
      .not('description', 'ilike', '%battery%')
      .not('short_description', 'ilike', '%battery%');

    // Apply centralized compliance filters
    countQuery = applyRestrictedProductFilter(countQuery, ['name', 'description', 'short_description']);

    // Apply category filter to count query if provided
    if (category) {
      countQuery = countQuery.eq('category_id', category);
    }

    const { count } = await countQuery;

    // Normalize products data
    const transformedProducts = (products || []).map((product: any) => {
      const { image_url, image_urls } = normalizeProductImages(product);

      return {
        ...product,
        image_url,
        image_urls
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      totalCount: count || 0,
      limit,
      offset,
      hasMore: count ? (offset + (transformedProducts.length)) < count : false
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products', details: String(error) }, { status: 500 });
  }
}
