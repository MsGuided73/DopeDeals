import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixComplianceData() {
  console.log('--- Fixing Database Compliance Data ---');
  
  // 1. Create a THCA compliance rule restricted in CA
  console.log('\\n1. Creating THCA Rule');
  const { data: newRule, error: ruleErr } = await supabase
    .from('compliance_rules')
    .insert({
      category: 'THCA',
      restricted_states: ['CA', 'ID', 'UT'],
      age_requirement: 21
    })
    .select()
    .single();
    
  if (ruleErr) {
    console.error('Error creating THCA rule:', ruleErr.message);
    return;
  }
  console.log('Created THCA Rule:', newRule.id);

  // 2. Find all products with THCA in their name or category
  console.log('\\n2. Finding THCA Products');
  const { data: products, error: prodErr } = await supabase
    .from('main_site_products')
    .select('id, name')
    .ilike('name', '%THCA%');

  if (prodErr || !products || products.length === 0) {
    console.log('No THCA products found in main_site_products. Stopping mapping.');
    return;
  }
  
  console.log(`Found ${products.length} THCA products.`);

  // 3. Map them in product_compliance
  console.log('\\n3. Mapping THCA products to THCA Rule');
  const mappings = products.map(p => ({
    product_id: p.id,
    compliance_id: newRule.id
  }));

  const { error: mapErr } = await supabase
    .from('product_compliance')
    .insert(mappings);

  if (mapErr) {
    console.error('Error mapping products:', mapErr.message);
  } else {
    console.log(`Successfully mapped ${mappings.length} products to THCA compliance rule! Checkout for CA zip codes will now fail for these products.`);
  }
}

fixComplianceData().catch(console.error);
