import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';

// Load .env.local explicitly in development
if (process.env.NODE_ENV === 'development') {
  const envPath = path.resolve(process.cwd(), '.env.local');
  config({ path: envPath });
}

export async function GET(req: NextRequest) {
  try {
    // Ensure environment variables are loaded in development
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Bubblers API - Environment check:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPrefix: supabaseUrl?.substring(0, 20) + '...',
        keyPrefix: supabaseKey?.substring(0, 20) + '...'
      });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Bubblers API - Missing credentials:', {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      });
      return NextResponse.json({
        message: 'Supabase credentials not configured',
        debug: process.env.NODE_ENV === 'development' ? {
          supabaseUrl: !!supabaseUrl,
          supabaseKey: !!supabaseKey
        } : undefined
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search ALL products first, then filter for bubblers with images
    const { data: allProducts, error: allError } = await supabase
      .from('main_site_products')
      .select(`
        id,
        name,
        description,
        short_description,
        our_price,
        sale_price,
        vip_price,
        image_url,
        image_urls,
        sku,
        stock_quantity,
        materials,
        featured,
        is_active,
        specs,
        attributes,
        brand_name,
        category_id,
        categories,
        category_slug,
        subcategory_slug,
        seo_keywords,
        created_at
      `)
      .eq('is_active', true) // Only show active products on the site
      .not('name', 'ilike', '%test%')
      .not('name', 'ilike', '%sample%') // Exclude sample products
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
      .not('description', 'ilike', '%7-ohmz%');

    if (allError) {
      console.error('Error fetching all products:', allError);
      return NextResponse.json({
        message: 'Failed to fetch products',
        error: allError.message
      }, { status: 500 });
    }

    console.log(`🔍 Searching through ${allProducts?.length || 0} total products for bubblers with images...`);

    // Filter for bubbler products that have valid images
    const bubblerProducts = allProducts?.filter(product => {
      // Check if it's a bubbler product using category_slug (more reliable than name matching)
      const isBubblerProduct = product.category_slug === 'bubblers' ||
                              product.subcategory_slug?.includes('bubbler') ||
                              product.subcategory_slug?.includes('bubbl') ||
                              (Array.isArray(product.categories) &&
                               product.categories.some(cat =>
                                 cat?.toLowerCase().includes('bubbler') ||
                                 cat?.toLowerCase().includes('bubbl') ||
                                 cat?.toLowerCase().includes('water pipe')
                               ));

      // Check if it has a valid image URL (strict validation like pipes)
      const hasValidImage = product.image_url &&
                           product.image_url.trim() !== '' &&
                           product.image_url.trim() !== 'NULL' &&
                           product.image_url.trim() !== 'null' &&
                           !product.image_url.includes('placehold') &&
                           !product.image_url.includes('placeholder') &&
                           !product.image_url.includes('example.com') &&
                           !product.image_url.includes('test.com') &&
                           (product.image_url.startsWith('http://') || product.image_url.startsWith('https://')) &&
                           (product.image_url.includes('.jpg') ||
                            product.image_url.includes('.jpeg') ||
                            product.image_url.includes('.png') ||
                            product.image_url.includes('.webp') ||
                            product.image_url.includes('sigdistro.com') ||
                            product.image_url.includes('supabase.co'));

      return isBubblerProduct && hasValidImage;
    }) || [];

    console.log(`🎯 Found ${bubblerProducts.length} bubbler products with valid images!`);

    // Transform products to match our interface
    const transformedProducts = bubblerProducts.map((product: any) => {
      // Determine bubbler style from name
      const name = product.name.toLowerCase();
      let style = 'Classic Bubbler';

      if (name.includes('mini') || name.includes('small')) style = 'Mini Bubbler';
      else if (name.includes('large') || name.includes('big')) style = 'Large Bubbler';
      else if (name.includes('scientific') || name.includes('beaker')) style = 'Scientific Bubbler';
      else if (name.includes('hammer')) style = 'Hammer Bubbler';
      else if (name.includes('sidecar')) style = 'Sidecar Bubbler';
      else if (name.includes('showerhead')) style = 'Showerhead Bubbler';

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
        price: parseFloat(product.our_price),
        vip_price: undefined, // fire_price column doesn't exist in main_site_products
        compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        image_url: product.image_url,
        image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
        brand_id: product.brand_name, // Keep for backward compatibility
        brand: product.brand_name, // Add the brand name field
        category_id: product.category_id,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        materials: product.materials || [],
        material: product.materials?.[0] || 'Glass',
        vip_exclusive: false, // Default to false since column doesn't exist
        featured: product.featured || false,

        is_active: product.is_active,
        description: product.description,
        short_description: product.short_description,
        specs: product.specs,
        attributes: product.attributes,

        // Computed fields
        style,
        size,
        inStock: (product.stock_quantity || 0) > 0,
        isNew,
        isSale,
        features: [
          'Smooth Water Filtration',
          'Compact Design',
          'Easy to Clean',
          'Durable Construction'
        ],
        tags: ['bubbler', 'water pipe', 'glass', style.toLowerCase().replace(' ', '-')],
        category: 'Bubblers'
      };
    }) || [];

    return NextResponse.json({
      message: 'Bubbler products loaded successfully',
      totalCount: transformedProducts.length,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Error fetching bubbler products:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
