import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Direct Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query parameters
    const url = new URL(req.url);
    const rawOffset = url.searchParams.get('offset');

    // NO LIMIT: Return all products
    const limit = 5000;
    const offset = isNaN(parseInt(rawOffset || '0')) ? 0 : Math.max(0, parseInt(rawOffset || '0'));

    const effectiveLimit = limit;

    // Query THCA products from main_site_products table
    const { data: rawProducts, error } = await supabase
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
        is_active,
        featured,
        brand_id,
        brand_name,
        category_id,
        nicotine_product,
        tobacco_product,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .neq('image_url', '')
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
      .or('name.ilike.%thca%,name.ilike.%packman%,name.ilike.%crave%,name.ilike.%hidden.hills%,name.ilike.%hidden-hills%,name.ilike.%flower%,name.ilike.%preroll%,name.ilike.%cartridge%,name.ilike.%vape%,name.ilike.%concentrate%,name.ilike.%edible%,brand_name.ilike.%thca%,brand_name.ilike.%packman%,brand_name.ilike.%crave%,brand_name.ilike.%hidden.hills%,brand_name.ilike.%hidden-hills%,brand_name.ilike.%flower%,brand_name.ilike.%preroll%,brand_name.ilike.%cartridge%,brand_name.ilike.%vape%,brand_name.ilike.%concentrate%,brand_name.ilike.%edible%,description.ilike.%thca%,description.ilike.%packman%,description.ilike.%crave%,description.ilike.%hidden.hills%,description.ilike.%hidden-hills%,description.ilike.%flower%,description.ilike.%preroll%,description.ilike.%cartridge%,description.ilike.%vape%,description.ilike.%concentrate%,description.ilike.%edible%')
      .order('created_at', { ascending: false })
      .limit(effectiveLimit);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch THCA products', details: error.message }, { status: 500 });
    }

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

    // Remove duplicates by ID, name, and SKU while normalizing data
    const seenIds = new Set();
    const seenNames = new Set();
    const seenSkus = new Set();
    const products = (rawProducts || [])
      .filter(product => {
        if (seenIds.has(product.id)) return false;
        const normalizedName = product.name?.trim().toLowerCase();
        if (normalizedName && seenNames.has(normalizedName)) return false;
        if (product.sku && seenSkus.has(product.sku)) return false;
        seenIds.add(product.id);
        if (normalizedName) seenNames.add(normalizedName);
        if (product.sku) seenSkus.add(product.sku);
        return true;
      })
      .map((product: any) => {
        const normalizedImages = Array.from(new Set([
          ...parseImageUrls(product.image_urls),
          ...parseImageUrls(product.image_url)
        ]));

        return {
          ...product,
          image_url: normalizedImages[0] || product.image_url,
          image_urls: normalizedImages,
          inStock: (product.stock_quantity || 0) > 0
        };
      });

    // Get total count
    const { count } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .neq('image_url', '')
      .or('name.ilike.%thca%,name.ilike.%packman%,name.ilike.%crave%,name.ilike.%hidden.hills%,name.ilike.%hidden-hills%,name.ilike.%flower%,name.ilike.%preroll%,name.ilike.%cartridge%,name.ilike.%vape%,name.ilike.%concentrate%,name.ilike.%edible%,brand_name.ilike.%thca%,brand_name.ilike.%packman%,brand_name.ilike.%crave%,brand_name.ilike.%hidden.hills%,brand_name.ilike.%hidden-hills%,brand_name.ilike.%flower%,brand_name.ilike.%preroll%,brand_name.ilike.%cartridge%,brand_name.ilike.%vape%,brand_name.ilike.%concentrate%,brand_name.ilike.%edible%,description.ilike.%thca%,description.ilike.%packman%,description.ilike.%crave%,description.ilike.%hidden.hills%,description.ilike.%hidden-hills%,description.ilike.%flower%,description.ilike.%preroll%,description.ilike.%cartridge%,description.ilike.%vape%,description.ilike.%concentrate%,description.ilike.%edible%');

    return NextResponse.json({
      products: products,
      totalCount: count || 0,
      limit: products.length,
      offset,
      hasMore: false
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch THCA products', details: String(error) }, { status: 500 });
  }
}
