import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function applyDelta8Restrictions() {
  console.log('--- Applying Delta-8 Compliance Restrictions ---');
  
  // 1. Define restricted states for Delta 8
  // Based on 2026 data: AK, CO, DE, ID, IA, MN, MT, NV, NY, ND, RI, SC, UT, VT, WA, OH
  const restrictedStates = ['AK', 'CO', 'DE', 'ID', 'IA', 'MN', 'MT', 'NV', 'NY', 'ND', 'RI', 'SC', 'UT', 'VT', 'WA', 'OH'];
  
  console.log('\\n1. Creating or Updating Delta-8 Rule');
  
  // Try to find existing rule first
  let targetRuleId;
  const { data: existingRule } = await supabase
    .from('compliance_rules')
    .select('id')
    .eq('category', 'Delta-8')
    .single();
    
  if (existingRule) {
    console.log('Found existing Delta-8 rule:', existingRule.id);
    targetRuleId = existingRule.id;
    // Update it with the correct states
    await supabase
      .from('compliance_rules')
      .update({ restricted_states: restrictedStates, age_requirement: 21 })
      .eq('id', targetRuleId);
  } else {
    // Create new rule
    const { data: newRule, error: ruleErr } = await supabase
      .from('compliance_rules')
      .insert({
        category: 'Delta-8',
        restricted_states: restrictedStates,
        age_requirement: 21,
      })
      .select()
      .single();
      
    if (ruleErr) {
      console.error('Error creating Delta-8 rule:', ruleErr.message);
      return;
    }
    console.log('Created Delta-8 Rule:', newRule.id);
    targetRuleId = newRule.id;
  }

  // 2. Find all ACTIVE products with Delta 8 in their name
  console.log('\\n2. Finding ACTIVE Delta-8 Products');
  const { data: products, error: prodErr } = await supabase
    .from('main_site_products')
    .select('id, name')
    .eq('is_active', true)
    .or('name.ilike.%delta 8%,name.ilike.%delta-8%,name.ilike.%d8%');

  if (prodErr) {
    console.error('Error fetching products:', prodErr.message);
    return;
  }
  
  if (!products || products.length === 0) {
    console.log('No active Delta-8 products found in main_site_products. Stopping mapping.');
    return;
  }
  
  console.log(`Found ${products.length} active Delta-8 products. Examples:`, products.slice(0, 3).map(p => p.name));

  // 3. Map them in product_compliance (upsert or insert)
  console.log('\\n3. Mapping Delta-8 products to Delta-8 Rule');
  
  // First, get existing mappings to avoid duplicates if any
  const { data: existingMappings } = await supabase
    .from('product_compliance')
    .select('product_id')
    .eq('compliance_id', targetRuleId);
    
  const existingProductIds = new Set(existingMappings?.map(m => m.product_id) || []);
  
  const mappingsToInsert = products
    .filter(p => !existingProductIds.has(p.id))
    .map(p => ({
      product_id: p.id,
      compliance_id: targetRuleId
    }));

  if (mappingsToInsert.length > 0) {
    const { error: mapErr } = await supabase
      .from('product_compliance')
      .insert(mappingsToInsert);

    if (mapErr) {
      console.error('Error mapping products:', mapErr.message);
    } else {
      console.log(`Successfully newly mapped ${mappingsToInsert.length} active products to Delta-8 compliance rule!`);
    }
  } else {
    console.log('All active Delta-8 products were already mapped to this rule.');
  }
}

applyDelta8Restrictions().catch(console.error);
