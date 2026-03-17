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
      console.warn(`[Eligibility] Zip code ${zip} not found in database.`);
      return NextResponse.json({ 
        zip, 
        state: 'Unknown', 
        city: 'Unknown',
        restrictedCategories: [],
        restrictedProducts: [],
        shippingRestrictions: {},
        warning: 'Zip code not found in compliance database'
      }, { status: 200 });
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

    // If productIds are provided, check which specific products are restricted
    const productIds = searchParams.get('productIds')?.split(',').filter(Boolean) || [];
    let restrictedProducts: string[] = [];
    let customWarning = '';
    
    if (productIds.length > 0) {
      // 1. Check state-level restrictions via compliance rules mappings
      if (rules && rules.length > 0) {
        const ruleIds = rules.map((r: any) => r.id);
        const { data: pcRows } = await supabase
          .from('product_compliance')
          .select('product_id')
          .in('product_id', productIds)
          .in('compliance_id', ruleIds);
          
        if (pcRows) {
          restrictedProducts.push(...pcRows.map((row: any) => row.product_id));
        }
      }

      const { data: individualRows } = await supabase
        .from('main_site_products')
        .select('id, name, category, category_id, subcategory, compliance_info')
        .in('id', productIds);

      if (individualRows) {
        for (const p of individualRows) {
          const compInfo = p.compliance_info as any;
          if (compInfo?.restricted_zipcodes?.includes(zip)) {
            restrictedProducts.push(p.id);
          }
          
          const nameLower = p.name?.toLowerCase() || '';
          const isThca = p.category?.toLowerCase().includes('thca') || 
                         p.category_id?.toLowerCase().startsWith('thca-') ||
                         nameLower.includes('thca') || 
                         nameLower.includes('thc-a');
                         
          if (isThca) {
            const thcaRule = rules?.find((r: any) => r.category?.toLowerCase().includes('thca'));
            if (thcaRule) {
              restrictedProducts.push(p.id);
            } else {
              const thcaStates = ['HI', 'ID', 'MN', 'OR', 'RI', 'UT', 'VT', 'AR', 'CA'];
              if (thcaStates.includes(state)) {
                restrictedProducts.push(p.id);
              }
            }
          }
        }
      }

      // Remove duplicates
      restrictedProducts = Array.from(new Set(restrictedProducts));

      // Generate dynamic warning if any restrictions found
      if (restrictedProducts.length > 0 && restrictedCategories.length > 0) {
        customWarning = `The law prohibits shipping of ${restrictedCategories.join(', ')} products to ${state} residents. Please remove these items from your cart to proceed.`;
      } else if (restrictedProducts.length > 0) {
        customWarning = `Some items in your cart cannot be shipped to ${state} due to state regulations or age restrictions.`;
      }
    }

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
      restrictedProducts, 
      shippingRestrictions: shipping,
      warning: customWarning || undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Eligibility check failed' }, { status: 500 });
  }
}

