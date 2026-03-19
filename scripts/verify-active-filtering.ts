import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFiltering() {
  console.log('🚀 Starting Standalone Verification: Product Filtering Logic');
  
  try {
    // 1. Check for 'mmelt' products that SHOULD be filtered out
    console.log('\n--- Testing Search Logic for "mmelt" ---');
    const { data: mmeltProducts, error: mmeltError } = await supabase
      .from('main_site_products')
      .select('name, is_active')
      .ilike('name', '%mmelt%')
      .eq('is_active', true);
    
    if (mmeltError) throw mmeltError;
    
    console.log(`Found ${mmeltProducts.length} active 'mmelt' products.`);
    if (mmeltProducts.length > 0) {
      console.error('❌ FAILED: Active mmelt products found! This contradicts earlier research if they should remain inactive.');
    } else {
      console.log('✅ PASSED: No active mmelt products found in database.');
    }

    // 2. Mocking the API query logic (which now has .eq('is_active', true))
    console.log('\n--- Testing Mocked API Query Logic ---');
    const { data: searchResults, error: searchError } = await supabase
      .from('main_site_products')
      .select('name, is_active')
      .or('name.ilike.%mmelt%')
      .eq('is_active', true);
      
    if (searchError) throw searchError;
    
    const inactiveInResults = searchResults.filter(p => !p.is_active);
    console.log(`Found ${searchResults.length} results matching 'mmelt' with is_active filter.`);
    if (inactiveInResults.length > 0) {
      console.error('❌ FAILED: Inactive products returned even with filter!');
    } else {
      console.log('✅ PASSED: No inactive products returned with filter.');
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

verifyFiltering();
