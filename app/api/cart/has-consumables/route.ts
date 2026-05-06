import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CONSUMABLE_CATEGORY_SLUGS } from '../../../../lib/consumable-categories';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const productIds: string[] = Array.isArray(body?.productIds) ? body.productIds : [];

    if (productIds.length === 0) {
      return NextResponse.json({ hasConsumables: false });
    }

    // Single-row probe: do any of these productIds belong to a consumable category?
    // Bypass is_active so cart hydration matches the disclaimer state even when
    // a SKU was de-listed mid-checkout.
    const { count, error } = await supabase
      .from('main_site_products')
      .select('id', { count: 'exact', head: true })
      .in('id', productIds)
      .in('category_slug', CONSUMABLE_CATEGORY_SLUGS as readonly string[] as string[]);

    if (error) {
      console.error('has-consumables lookup failed:', error);
      // Fail-closed: assume consumable so the disclaimer still shows.
      return NextResponse.json({ hasConsumables: true, error: error.message }, { status: 200 });
    }

    return NextResponse.json({ hasConsumables: (count ?? 0) > 0 });
  } catch (err) {
    console.error('has-consumables route error:', err);
    return NextResponse.json({ hasConsumables: true }, { status: 200 });
  }
}
