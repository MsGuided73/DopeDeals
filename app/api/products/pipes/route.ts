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

    // Search for pipe-related products using multiple criteria
    const pipeKeywords = [
      'HAND PIPE',
      'GLASS PIPE',
      'SPOON PIPE',
      'CHILLUM',
      'ONE HITTER',
      'SHERLOCK',
      'STEAMROLLER',
      'GANDALF',
      'BOWL',
      'PIPE'
    ];

    // Build the query to find pipe products
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        vip_price,
        compare_at_price,
        image_url,
        brand_id,
        category_id,
        sku,
        stock_quantity,
        materials,
        vip_exclusive,
        featured,
        channels,
        is_active,
        short_description,
        specs,
        attributes,
        created_at
      `)
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    // Create OR conditions for pipe keywords
    const orConditions = pipeKeywords.map(keyword => `name.ilike.%${keyword}%`).join(',');
    query = query.or(orConditions);

    const { data: products, error } = await query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200);

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
      const isSale = product.compare_at_price && product.compare_at_price > product.price;
      
      // Determine if it's new (created within last 30 days)
      const isNew = product.created_at && 
        new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      return {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        vip_price: product.vip_price ? parseFloat(product.vip_price) : undefined,
        compare_at_price: product.compare_at_price ? parseFloat(product.compare_at_price) : undefined,
        image_url: product.image_url,
        image_urls: product.image_url ? [product.image_url] : [],
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

    // Filter out products that don't seem to be actual pipes
    const filteredProducts = transformedProducts.filter(product => {
      const name = product.name.toLowerCase();
      // Exclude display cases, accessories, etc.
      return !name.includes('display') && 
             !name.includes('case') && 
             !name.includes('tray') &&
             !name.includes('grinder') &&
             !name.includes('lighter');
    });

    return NextResponse.json({
      message: 'Pipe products loaded successfully',
      totalCount: filteredProducts.length,
      products: filteredProducts
    });

  } catch (error) {
    console.error('Error fetching pipe products:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
