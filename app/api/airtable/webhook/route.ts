import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    // Airtable automations can POST a single record or a batch; accept both
    const records = Array.isArray(payload?.records) ? payload.records : [payload];

    const supa = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const upserts: any[] = [];

    for (const rec of records) {
      const fields = rec.fields || rec;
      const sku = fields.SKU || fields.sku;
      if (!sku) continue;

      upserts.push({
        sku: String(sku),
        name: fields.Name || fields.name || null,
        short_description: fields['Short Description'] || fields.short_description || null,
        description_md: fields.Description || fields.description || null,
        slug: (fields.Name || fields.name ? String(fields.Name || fields.name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') : null),
        airtable_record_id: rec.id || fields.recordId || null,
      });
    }

    if (upserts.length > 0) {
      const { error } = await supa.from('products').upsert(upserts, { onConflict: 'sku' });
      if (error) throw error;
    }

    return NextResponse.json({ success: true, upserts: upserts.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed' }, { status: 500 });
  }
}

