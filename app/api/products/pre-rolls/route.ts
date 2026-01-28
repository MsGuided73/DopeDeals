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
      console.log('Pre-rolls API - Environment check:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPrefix: supabaseUrl?.substring(0, 20) + '...',
        keyPrefix: supabaseKey?.substring(0, 20) + '...'
      });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Pre-rolls API - Missing credentials:', {
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

    const shouldLogSupabase = process.env.NODE_ENV === 'development';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: async (input, init) => {
          const url = typeof input === 'string' ? input : input.url;
          const method = init?.method || (typeof input !== 'string' ? input.method : 'GET');
          const headers = new Headers(init?.headers || (typeof input !== 'string' ? input.headers : undefined));
          const redactedHeaders = Object.fromEntries(
            Array.from(headers.entries()).map(([key, value]) => [
              key,
              ['apikey', 'authorization'].includes(key.toLowerCase()) ? '[redacted]' : value
            ])
          );

          if (shouldLogSupabase) {
            console.log('[Supabase Fetch][Request]', {
              method,
              url,
              headers: redactedHeaders
            });
          }

          const response = await fetch(input, init);

          if (shouldLogSupabase) {
            const responseHeaders = Object.fromEntries(response.headers.entries());
            console.log('[Supabase Fetch][Response]', {
              status: response.status,
              statusText: response.statusText,
              headers: responseHeaders
            });
          }

          return response;
        }
      }
    });

    // NO LIMIT: Return all products
    const limit = 5000;

    // Search active products first, then filter for pre-rolls with images
    const { data: allProducts, error: allError } = await supabase
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
      .not('description', 'ilike', '%7-ohmz%')
      .limit(limit);

    if (allError) {
      console.error('Error fetching all products:', allError);
      return NextResponse.json({
        message: 'Failed to fetch products',
        error: allError.message
      }, { status: 500 });
    }

    console.log(`🔍 Searching through ${allProducts?.length || 0} total products for pre-rolls with images...`);

    // Filter for pre-roll products using category_slug = 'prerolls'
    const prerollProducts = allProducts?.filter(product => {
      const name = product.name?.toLowerCase() || '';
      const cat = (product.category_slug || '').toLowerCase();

      const isPrerollProduct = cat === 'prerolls';

      // EXCLUSION: Ensure we don't accidentally pick up accessories like trays or batteries unless they are explicitly infused products
      const excludedKeywords = ['tray', 'battery', 'glass', 'pipe', 'bong', 'grinder'];
      const isExcluded = excludedKeywords.some(k => name.includes(k) && !name.includes('infused'));

      return isPrerollProduct && !isExcluded;
    }) || [];

    console.log(`🎯 Found ${prerollProducts.length} pre-roll products with valid images!`);

    // Helper to parse image URLs that might be comma-separated strings
    const parseImageUrls = (value?: string[] | string | null) => {
      if (!value) return [] as string[];
      if (Array.isArray(value)) {
        return value
          .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : [entry]))
          .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
          .filter(Boolean);
      }
      if (typeof value !== 'string') return [value].filter(Boolean);
      return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);


    };

    // Transform products to match our interface
    const transformedProducts = prerollProducts.map((product: any) => {
      // Determine pre-roll type from name
      const name = product.name.toLowerCase();
      let type = 'Classic Pre-Roll';

      if (name.includes('infused') || name.includes('edible')) type = 'Infused Pre-Roll';
      else if (name.includes('hemp') || name.includes('cbd')) type = 'Hemp/CBD Pre-Roll';
      else if (name.includes('blunt')) type = 'Blunt';
      else if (name.includes('backwood')) type = 'Backwood';
      else if (name.includes('cross') || name.includes('hybrid')) type = 'Hybrid Pre-Roll';
      else if (name.includes('indica')) type = 'Indica Pre-Roll';
      else if (name.includes('sativa')) type = 'Sativa Pre-Roll';

      // Determine size from name
      let size = '0.5g';
      if (name.includes('1g') || name.includes('1 gram')) size = '1g';
      else if (name.includes('0.75g') || name.includes('0.75 gram')) size = '0.75g';
      else if (name.includes('0.25g') || name.includes('0.25 gram')) size = '0.25g';
      else if (name.includes('2g') || name.includes('2 gram')) size = '2g';
      else if (name.includes('mini') || name.includes('small')) size = 'Mini';

      // Determine THC content from name or specs
      let thc = 'Unknown';
      const thcMatch = name.match(/(\d+(?:\.\d+)?)\s*%/);
      if (thcMatch) {
        thc = thcMatch[1] + '%';
      }

      // Determine if it's on sale
      const isSale = product.sale_price && product.sale_price > product.our_price;

      // Determine if it's new (created within last 30 days)
      const isNew = product.created_at &&
        new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const normalizedImages = Array.from(new Set([
        ...parseImageUrls(product.image_urls),
        ...parseImageUrls(product.image_url)
      ]));

      return {
        id: product.id,
        name: product.name,
        price: parseFloat(product.our_price),
        our_price: parseFloat(product.our_price),
        vip_price: product.fire_price ? parseFloat(product.fire_price) : undefined,
        sale_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        compare_at_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
        image_url: normalizedImages[0] || product.image_url,
        image_urls: normalizedImages,
        brand_id: product.brand_name, // Keep for backward compatibility
        brand: product.brand_name, // Add the brand name field
        category_id: product.category_id,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        materials: product.materials || [],
        material: product.materials?.[0] || 'Paper',
        vip_exclusive: false, // Default to false since column doesn't exist
        featured: product.featured || false,

        is_active: product.is_active,
        description: product.description,
        short_description: product.short_description,
        specs: product.specs,
        attributes: product.attributes,

        // Computed fields
        type,
        size,
        thc,
        inStock: (product.stock_quantity || 0) > 0,
        isNew,
        isSale,
        features: [
          'Premium Flower',
          'Expertly Rolled',
          'Lab Tested',
          'Slow Burning'
        ],
        tags: ['pre-roll', 'joint', 'cannabis', 'smoke', type.toLowerCase().replace(' ', '-')],
        category: 'Pre-Rolls'
      };
    }) || [];

    return NextResponse.json({
      message: 'Pre-roll products loaded successfully',
      totalCount: transformedProducts.length,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Error fetching pre-roll products:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

