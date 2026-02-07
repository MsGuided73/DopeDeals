import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, nicotine_product, requires_lab_test');

    if (error) {
      console.error('[AI Stats API] Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch AI stats' }, { status: 500 });
    }

    // In a production app, we would have a specific 'ai_classified' column
    // For now, we'll calculate based on available flags
    const stats = (products || []).reduce((acc, p) => {
      acc.total++;
      if (p.nicotine_product || p.requires_lab_test) acc.classified++;
      if (p.nicotine_product) acc.nicotineProducts++;
      if (p.requires_lab_test) acc.requiresLabTest++;
      return acc;
    }, {
      total: 0,
      classified: 0,
      unclassified: 0,
      nicotineProducts: 0,
      requiresLabTest: 0
    });

    stats.unclassified = stats.total - stats.classified;

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[AI Stats API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
