import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeProductImages } from '../../../../lib/utils/image-utils';

/**
 * Fresh Drops API Route
 *
 * IMPORTANT: Database Implementation Pattern
 * - Uses "main_site_products" table
 * - Orders by created_at (newest first) to show the most recent products
 * - Filters by is_active ONLY - no other requirements
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    // Get active products only with images, ordered by newest first
    // Fetch extra to account for duplicates and battery filtering
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, featured_product,
        brand_name, category_id, created_at, updated_at
      `)
      .eq('is_active', true) // ONLY active products
      .not('image_url', 'is', null) // Must have image_url
      .neq('image_url', '') // Must not be empty string
      .not('name', 'ilike', '%battery%')
      .not('description', 'ilike', '%battery%')
      .not('name', 'ilike', '%tincture%')
      .not('name', 'ilike', '%salve%')
      .not('description', 'ilike', '%tincture%')
      .not('description', 'ilike', '%salve%')
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Fetch extra to ensure we have enough after deduplication

    if (error) {
      console.error('Error fetching fresh drops products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Remove duplicates by ID, name, and SKU (ensure unique products only)
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const seenSkus = new Set<string>();
    const uniqueProducts = (rawProducts || []).filter(product => {
      // Check ID duplicates
      if (seenIds.has(String(product.id))) {
        return false;
      }
      
      // Check name duplicates (normalize by trimming and lowercasing)
      const normalizedName = product.name?.trim().toLowerCase();
      if (normalizedName && seenNames.has(normalizedName)) {
        return false;
      }
      
      // Check SKU duplicates (if SKU exists)
      if (product.sku && seenSkus.has(product.sku)) {
        return false;
      }
      
      // Add to tracking sets
      seenIds.add(String(product.id));
      if (normalizedName) seenNames.add(normalizedName);
      if (product.sku) seenSkus.add(product.sku);
      
      return true;
    });

    // Take only the requested limit and normalize image data
    const products = uniqueProducts.slice(0, limit).map((product: any) => {
      const { image_url, image_urls } = normalizeProductImages(product);

      const ourPrice = product.our_price ?? 0;
      const salePrice = product.sale_price;
      const hasValidSale = salePrice !== null && salePrice !== undefined && salePrice < ourPrice;
      const price = hasValidSale ? salePrice : ourPrice;
      const compare_at_price = hasValidSale ? ourPrice : undefined;

      return {
        ...product,
        image_url,
        image_urls,
        price,
        compare_at_price
      };
    });

    console.log(`🎯 Fresh Drops API: Retrieved ${products.length} unique active products (no batteries, no duplicates)`);

    return NextResponse.json({
      products: products,
      total: products.length,
      message: 'Fresh drops products retrieved successfully'
    });

  } catch (error) {
    console.error('Error in fresh drops API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
