#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBrandsSchema() {
  console.log('🔍 Checking brands table schema and data...');
  
  try {
    // Get all brands to see the structure
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .limit(5);
      
    if (error) {
      console.error('❌ Error querying brands:', error);
      return;
    }
    
    console.log('📊 Found', brands?.length || 0, 'brands');
    
    if (brands && brands.length > 0) {
      console.log('🏗️ Brands table structure (first record):');
      console.log(JSON.stringify(brands[0], null, 2));
      
      console.log('\n📋 All brands:');
      brands.forEach((brand, i) => {
        console.log(`${i + 1}. ${brand.name || brand.title || 'Unnamed'} (ID: ${brand.id})`);
      });
    } else {
      console.log('📋 No brands found in table');
    }
    
    // Also check if there are any ROOR products
    console.log('\n🔍 Checking for ROOR products...');
    const { data: roorProducts, error: roorError } = await supabase
      .from('products')
      .select('id, name, brand_id')
      .ilike('name', '%ROOR%')
      .limit(5);
      
    if (roorError) {
      console.error('❌ Error querying ROOR products:', roorError);
    } else {
      console.log(`📦 Found ${roorProducts?.length || 0} ROOR products`);
      roorProducts?.forEach(product => {
        console.log(`  - ${product.name} (brand_id: ${product.brand_id || 'null'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
checkBrandsSchema().then(() => {
  console.log('✅ Schema check complete!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
