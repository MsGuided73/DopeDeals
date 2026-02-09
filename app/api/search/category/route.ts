import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mode        = url.searchParams.get('mode') ?? 'thca_all';
    const minPriceStr = url.searchParams.get('minPrice');
    const maxPriceStr = url.searchParams.get('maxPrice');
    const inStockOnly = url.searchParams.get('inStockOnly') === 'true';
    const saleOnly    = url.searchParams.get('sale') === 'true';
    const sortBy      = url.searchParams.get('sort') ?? 'featured';
    const page        = Number(url.searchParams.get('page') ?? 1);
    const pageSize    = Number(url.searchParams.get('pageSize') ?? 24);

    const { data, error } = await supabase.rpc('msp_search_category', {
      mode,
      min_price: minPriceStr ? Number(minPriceStr) : null,
      max_price: maxPriceStr ? Number(maxPriceStr) : null,
      in_stock_only: inStockOnly,
      sale_only: saleOnly,
      sort_by: sortBy,
      page,
      page_size: pageSize,
    });

    if (error) {
      console.error('[msp_search_category] error:', error);
      return NextResponse.json({ products: [], error: error.message }, { status: 500 });
    }

    // Filter out tinctures and salves from the results
    const filteredProducts = (data ?? []).filter((p: any) => {
       const text = (p.name + ' ' + (p.description || '')).toLowerCase();
       return !text.includes('tincture') && !text.includes('salve');
    });

    return NextResponse.json({ products: filteredProducts });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ products: [], error: err.message }, { status: 500 });
  }
}
