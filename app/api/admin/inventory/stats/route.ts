import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('stock_quantity, price');

    if (error) {
      console.error('[Inventory Stats API] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch inventory stats' }, { status: 500 });
    }

    const stats = (products || []).reduce((acc, p) => {
      acc.totalProducts++;
      const stock = p.stock_quantity || 0;
      if (stock > 10) acc.inStockProducts++;
      else if (stock > 0) acc.lowStockProducts++;
      else acc.outOfStockProducts++;
      
      acc.totalValue += (stock * (p.price || 0));
      if (stock <= 10 && stock > 0) acc.lowStockAlerts++;
      
      return acc;
    }, {
      totalProducts: 0,
      inStockProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalValue: 0,
      lowStockAlerts: 0
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[Inventory Stats API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
