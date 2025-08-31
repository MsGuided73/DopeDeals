import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../lib/supabase-server';

function normalizeZip(zip: string | null): string | null {
  if (!zip) return null;
  const z = zip.trim();
  if (/^\d{5}$/.test(z)) return z;
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zip = normalizeZip(searchParams.get('zip'));
    if (!zip) return NextResponse.json({ error: 'Invalid zip' }, { status: 400 });

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)));
    const offset = (page - 1) * limit;

    // Resolve state
    const { data: zipRow, error: zipErr } = await supabaseServer
      .from('us_zipcodes')
      .select('state')
      .eq('zip', zip)
      .single();
    if (zipErr || !zipRow) return NextResponse.json({ error: 'Zip not found' }, { status: 404 });
    const state = zipRow.state as string;

    // Get restricted categories for state
    const { data: rules } = await supabaseServer
      .from('compliance_rules')
      .select('category')
      .contains('restricted_states', [state]);
    const restrictedCategories = new Set((rules || []).map((r: any) => r.category));

    // Query eligible products joined with inventory
    // Note: This assumes product_compliance links product->category; if not, we filter by product flags + future mapping.
    const { data: products, error } = await supabaseServer
      .from('products')
      .select('id, name, price, sku, vip_exclusive, featured, image_urls, materials, category_id, stock_quantity, nicotine_product, tobacco_product')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });

    // Filter by inventory.available > 0 (prefer inventory table; fallback to stock_quantity)
    const ids = (products || []).map((p: any) => p.id);
    let available: Record<string, number> = {};

    if (ids.length > 0) {
      const { data: inv } = await supabaseServer
        .from('inventory')
        .select('product_id, available')
        .in('product_id', ids);
      if (inv) {
        inv.forEach((row: any) => (available[row.product_id] = row.available));
      }
    }

    const filtered = (products || []).filter((p: any) => {
      const avail = available[p.id] ?? p.stock_quantity ?? 0;
      if (avail <= 0) return false;
      // TODO: If product->compliance category mapping exists, exclude by restrictedCategories
      return true;
    });

    return NextResponse.json({
      state,
      page,
      limit,
      products: filtered,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Eligible products query failed' }, { status: 500 });
  }
}

