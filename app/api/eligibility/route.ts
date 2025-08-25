import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    if (!zip) {
      return NextResponse.json({ error: 'Invalid zip' }, { status: 400 });
    }

    // Resolve state
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: zipRow, error: zipErr } = await supabase
      .from('us_zipcodes')
      .select('zip, state, city, county')
      .eq('zip', zip)
      .single();

    if (zipErr || !zipRow) {
      return NextResponse.json({ error: 'Zip not found' }, { status: 404 });
    }

    const state = zipRow.state as string;

    // Fetch compliance rules that restrict this state
    const { data: rules, error: rulesErr } = await supabase
      .from('compliance_rules')
      .select('id, category, shipping_restrictions, age_requirement')
      .contains('restricted_states', [state]);

    if (rulesErr) {
      return NextResponse.json({ error: 'Failed to load compliance rules' }, { status: 500 });
    }

    const restrictedCategories = (rules || []).map((r: any) => r.category);

    // Aggregate shipping restrictions
    const shipping = (rules || []).reduce(
      (acc: any, r: any) => {
        const sr = r.shipping_restrictions || {};
        if (sr.carrierRestrictions) {
          acc.carrierRestrictions = Array.from(new Set([...(acc.carrierRestrictions || []), ...sr.carrierRestrictions]));
        }
        if (typeof sr.requiresAdultSignature === 'boolean') {
          acc.requiresAdultSignature = acc.requiresAdultSignature || sr.requiresAdultSignature;
        }
        if (typeof sr.maxQuantityPerOrder === 'number') {
          acc.maxQuantityPerOrder = Math.min(acc.maxQuantityPerOrder ?? sr.maxQuantityPerOrder, sr.maxQuantityPerOrder);
        }
        if (typeof sr.noInternationalShipping === 'boolean') {
          acc.noInternationalShipping = acc.noInternationalShipping || sr.noInternationalShipping;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return NextResponse.json({
      zip: zipRow.zip,
      state,
      city: zipRow.city,
      county: zipRow.county,
      restrictedCategories: Array.from(new Set(restrictedCategories)),
      shippingRestrictions: shipping,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Eligibility check failed' }, { status: 500 });
  }
}

