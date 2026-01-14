import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: products, error } = await supabase
      .from('main_site_products')
      .select('id, name, sku, category_id, brand_name, image_url, created_at')
      .or('image_url.is.null,image_url.eq.""')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      products: products || [],
      count: products?.length || 0
    });

  } catch (error) {
    console.error('Admin missing images API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products missing images' },
      { status: 500 }
    );
  }
}
