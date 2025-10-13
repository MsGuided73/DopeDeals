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
      console.log('Pipes API - Environment check:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPrefix: supabaseUrl?.substring(0, 20) + '...',
        keyPrefix: supabaseKey?.substring(0, 20) + '...'
      });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Pipes API - Missing credentials:', {
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

    // Optimized query - get products from main_site_products table
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
        created_at
      `)
      // Note: Removed .eq('is_active', true) filter for current manual inventory phase
      // Add back when connecting to Zoho Inventory for automated product management
      .not('name', 'ilike', '%test%')
      .not('name', 'ilike', '%sample%'); // Exclude sample products

    // Simplified filtering - use category_id for better performance
    query = query.or('category_id.ilike.%pipe%,category_id.ilike.%chillum%,category_id.ilike.%spoon%,category_id.ilike.%sherlock%,category_id.ilike.%bowl%');

    // Optimize ordering and limit for better performance
    query = query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100); // Increased limit but still reasonable for performance

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ 
        message: 'Failed to fetch pipe products', 
        error: error.message 
      }, { status: 500 });
    }

    // Transform products to match our interface
    const transformedProducts = products?.map(product => {
      // Determine pipe style from name
      const name = product.name.toLowerCase();
      let style = 'Hand Pipe';
      
      if (name.includes('chillum')) style = 'Chillum';
      else if (name.includes('sherlock')) style = 'Sherlock';
      else if (name.includes('one hitter') || name.includes('onehitter')) style = 'One Hitter';
      else if (name.includes('steamroller')) style = 'Steamroller';
      else if (name.includes('gandalf')) style = 'Gandalf';
      else if (name.includes('spoon')) style = 'Spoon Pipe';
      else if (name.includes('bowl')) style = 'Bowl';

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
        vip_price: product.fire_price ? parseFloat(product.fire_price) : undefined,
        compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        image_url: product.image_url,
        image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
        brand_id: product.brand_id,
        category_id: product.category_id,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        materials: product.materials || [],
        material: product.materials?.[0] || 'Glass',
        vip_exclusive: product.vip_exclusive || false,
        featured: product.featured || false,
        channels: product.channels || [],
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
          'Premium Construction',
          'Smooth Airflow',
          'Easy to Clean',
          'Portable Design'
        ],
        tags: ['pipe', 'glass', 'smoking', style.toLowerCase().replace(' ', '-')]
      };
    }) || [];

    return NextResponse.json({
      message: 'Products loaded successfully',
      totalCount: transformedProducts.length,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Error fetching pipe products:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
