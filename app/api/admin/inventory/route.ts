import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    // Fetch products with their inventory data
    // Note: Adjusting to the schema where stock might be in a related table or columns
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        stock_quantity,
        price,
        image_url,
        updated_at,
        brand_id,
        category_id
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[Inventory API] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }

    // Map to the format expected by the UI
    const inventory = (products || []).map(p => ({
      id: p.id,
      product_id: p.id,
      name: p.name,
      sku: p.sku || 'N/A',
      stock_quantity: p.stock_quantity || 0,
      reserved_quantity: 0, // Placeholder if not in schema
      available_quantity: p.stock_quantity || 0,
      low_stock_threshold: 10, // Default
      price: p.price || 0,
      image_url: p.image_url,
      last_updated: p.updated_at,
      status: (p.stock_quantity || 0) > 10 ? 'in_stock' : (p.stock_quantity || 0) > 0 ? 'low_stock' : 'out_of_stock'
    }));

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('[Inventory API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
