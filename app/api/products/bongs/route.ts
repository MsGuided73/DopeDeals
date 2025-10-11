import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Direct Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ message: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get products from main_site_products table using new categories JSONB field for bongs
    let query = supabase
      .from('main_site_products')
      .select(`
        id,
        name,
        description,
        short_description,
        our_price,
        sale_price,
        fire_price,
        image_url,
        image_urls,
        sku,
        stock_quantity,
        materials,
        vip_exclusive,
        featured,
        channels,
        is_active,
        specs,
        attributes,
        brand_id,
        category_id,
        categories,
        seo_keywords,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .not('name', 'ilike', '%test%')
      .not('name', 'ilike', '%sample%'); // Exclude sample products

    // Filter for bong-related products using simple name search
    query = query.or('name.ilike.%bong%,name.ilike.%water pipe%,name.ilike.%hookah%,name.ilike.%beaker%,name.ilike.%percolator%');

    query = query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(48); // Show first 48 bong products

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({
        message: 'Failed to fetch bong products',
        error: error.message
      }, { status: 500 });
    }

    // Transform products to match our interface
    const transformedProducts = products?.map(product => {
      // Determine bong style from name
      const name = product.name.toLowerCase();
      let style = 'Water Bong';

      if (name.includes('beaker')) style = 'Beaker Bong';
      else if (name.includes('straight')) style = 'Straight Tube';
      else if (name.includes('percolator')) style = 'Percolator Bong';
      else if (name.includes('scientific')) style = 'Scientific Glass';
      else if (name.includes('mini')) style = 'Mini Bong';
      else if (name.includes('hookah')) style = 'Hookah';

      // Determine size from name or specs
      let size = 'Medium';
      if (name.includes('mini') || name.includes('small')) size = 'Small';
      else if (name.includes('large') || name.includes('big')) size = 'Large';
      else if (name.includes('xl') || name.includes('extra large')) size = 'XL';

      // Determine if it's on sale
      const isSale = product.sale_price && product.sale_price > product.our_price;

      // Determine if it's new (created within last 30 days)
      const isNew = product.created_at &&
        new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      return {
        id: product.id,
        name: product.name,
        our_price: parseFloat(product.our_price),
        sale_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        image_url: product.image_url,
        imageUrl: product.image_url,
        image: product.image_url,
        description: product.description,
        short_description: product.short_description,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active,
        featured: product.featured || false,
        brand_id: product.brand_id,
        category_id: product.category_id,
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Add compatibility fields
        price: parseFloat(product.our_price),
        isNew,
        isSale,
        originalPrice: product.sale_price && product.sale_price > product.our_price ? parseFloat(product.sale_price) : undefined,
        inStock: (product.stock_quantity || 0) > 0,
        brand: product.brand_id || 'Unknown Brand',
        category: 'Bongs'
      };
    }) || [];

    return NextResponse.json({
      message: 'Bong products loaded successfully',
      totalCount: transformedProducts.length,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Error fetching bong products:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
