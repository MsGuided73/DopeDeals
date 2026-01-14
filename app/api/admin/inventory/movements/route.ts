import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    // In the legacy system, movements might be derived or in a specific log table.
    // For now, we'll return the most recent stock updates as "movements"
    // or look for an audit/movement table if it exists.
    
    // Attempting to fetch from a logical audit trail or just recent product updates
    const { data: movements, error } = await supabase
      .from('products')
      .select('id, name, stock_quantity, updated_at')
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('[Inventory Movements API] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch movements' }, { status: 500 });
    }

    // Map to movement format
    const formattedMovements = (movements || []).map((m: any) => ({
      id: `mov-${m.id}`,
      product_id: m.id,
      product_name: m.name,
      type: 'adjustment',
      quantity: m.stock_quantity,
      reason: 'System sync or manual update',
      created_at: m.updated_at,
      created_by: 'System'
    }));

    return NextResponse.json({ movements: formattedMovements });
  } catch (error) {
    console.error('[Inventory Movements API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
