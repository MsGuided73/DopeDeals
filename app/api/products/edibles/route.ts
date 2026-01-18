import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Edibles API Route
 *
 * Returns products with category_slug in: "gummies", "edibles"
 * Filters: Active products only, valid images, no batteries
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // NO LIMIT: Return all products for the category
    const limit = 5000;

    // Get edibles products with comprehensive filtering
    const { data: rawProducts, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured,
        brand_name, category_id, category_slug, created_at, updated_at
      `)
      .eq('is_active', true) // Only active products
      .not('image_url', 'is', null) // Must have image_url
      .neq('image_url', '') // Must not be empty string
      .not('name', 'ilike', '%battery%') // No batteries
      .not('description', 'ilike', '%battery%')
      // Include products with category_slug = 'gummies' OR 'edibles' OR name/description contains edible terms
      .or(
        `category_slug.eq.gummies,` +
        `category_slug.eq.edibles,` +
        `category_slug.ilike.%gummies%,` +
        `category_slug.ilike.%edibles%,` +
        `name.ilike.%gummy%,` +
        `name.ilike.%gummies%,` +
        `name.ilike.%edible%,` +
        `name.ilike.%edibles%,` +
        `name.ilike.%candy%,` +
        `name.ilike.%chocolate%,` +
        `name.ilike.%brownie%,` +
        `name.ilike.%cookie%,` +
        `name.ilike.%lollipop%,` +
        `name.ilike.%sour%,` +
        `name.ilike.%sweet%,` +
        `name.ilike.%treat%,` +
        `name.ilike.%snack%,` +
        `brand_name.ilike.%gummy%,` +
        `brand_name.ilike.%gummies%,` +
        `brand_name.ilike.%edible%,` +
        `brand_name.ilike.%edibles%,` +
        `brand_name.ilike.%candy%,` +
        `brand_name.ilike.%chocolate%,` +
        `brand_name.ilike.%brownie%,` +
        `brand_name.ilike.%cookie%,` +
        `brand_name.ilike.%lollipop%,` +
        `brand_name.ilike.%sour%,` +
        `brand_name.ilike.%sweet%,` +
        `brand_name.ilike.%treat%,` +
        `brand_name.ilike.%snack%,` +
        `description.ilike.%gummy%,` +
        `description.ilike.%gummies%,` +
        `description.ilike.%edible%,` +
        `description.ilike.%edibles%,` +
        `description.ilike.%candy%,` +
        `description.ilike.%chocolate%,` +
        `description.ilike.%brownie%,` +
        `description.ilike.%cookie%,` +
        `description.ilike.%lollipop%,` +
        `description.ilike.%sour%,` +
        `description.ilike.%sweet%,` +
        `description.ilike.%treat%,` +
        `description.ilike.%snack%`
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching edibles products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`🎯 Edibles API: Retrieved ${rawProducts?.length || 0} active edibles products with valid images`);

    // Transform products to match expected interface
    const transformedProducts = (rawProducts || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      our_price: product.our_price,
      sale_price: product.sale_price,
      image_url: product.image_url,
      image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
      description: product.description,
      short_description: product.short_description,
      sku: product.sku,
      stock_quantity: product.stock_quantity || 0,
      is_active: product.is_active,
      featured: product.featured || false,
      brand_name: product.brand_name,
      category_id: product.category_id,
      category_slug: product.category_slug,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length,
      message: 'Edibles products retrieved successfully'
    });

  } catch (error) {
    console.error('Error in edibles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
