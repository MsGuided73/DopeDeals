import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * USER INPUT REQUIRED:
 * Fill out the mapping below with your research.
 * 
 * Each key is the general Product "Category" or Subcategory identifier (e.g., 'THCA', 'Kratom').
 * The value is an array of 2-letter state abbreviations that prohibit this category.
 */
const RESTRICTIONS_MAPPING: Record<string, string[]> = {
  'THCA': [
    // Add 2-letter state codes here. Example: 'TX', 'CA', 'ID'
  ],
  'Kratom': [
    // Add 2-letter state codes here.
  ],
  // Add other categories...
  'Mushroom': [

  ],
};

async function applyShippingRestrictions() {
  console.log("🚀 Starting Shipping Restrictions Link Script...");

  for (const [category, restrictedStates] of Object.entries(RESTRICTIONS_MAPPING)) {
    if (restrictedStates.length === 0) {
      console.log(`⏩ Skipping ${category}: No states provided.`);
      continue;
    }

    console.log(`\n📦 Processing Category: ${category}`);
    console.log(`   Restricted States: ${restrictedStates.join(', ')}`);

    // 1. Create or Update the Compliance Rule in the database
    const { data: ruleData, error: ruleErr } = await supabase
      .from('compliance_rules')
      .upsert({
        category: category,
        restricted_states: restrictedStates,
        age_requirement: 21,
      }, { onConflict: 'category' })
      .select()
      .single();

    if (ruleErr) {
      console.error(`❌ Failed to upsert rule for ${category}:`, ruleErr);
      continue;
    }

    const ruleId = ruleData.id;
    console.log(`✅ Rule upserted. ID: ${ruleId}`);

    // 2. Fetch all products matching this category (case insensitive search)
    console.log(`   Searching for products matching '${category}'...`);
    const { data: products, error: prodErr } = await supabase
      .from('main_site_products')
      .select('id, name, category, subcategory')
      .or(`category.ilike.%${category}%,subcategory.ilike.%${category}%,name.ilike.%${category}%`);

    if (prodErr) {
      console.error(`❌ Failed to fetch products for ${category}:`, prodErr);
      continue;
    }

    console.log(`   Found ${products.length} products to restrict.`);

    // 3. Link products to the compliance rule
    if (products.length > 0) {
      const complianceLinks = products.map((p) => ({
        product_id: p.id,
        compliance_id: ruleId,
      }));

      const { error: linkErr } = await supabase
        .from('product_compliance')
        .upsert(complianceLinks, { onConflict: 'product_id,compliance_id' });

      if (linkErr) {
        console.error(`❌ Failed to link products for ${category}:`, linkErr);
      } else {
        console.log(`✅ Successfully linked ${products.length} products to ${category} rule.`);
      }
    }
  }

  console.log("\n🎉 Shipping Restrictions mapping complete!");
}

applyShippingRestrictions()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Fatal Error:", e);
    process.exit(1);
  });
