#!/usr/bin/env node

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testSearchFunctionality() {
  console.log('🔍 Testing Enhanced Search Functionality...\n');

  // Test 1: Search for PUFFCO products
  console.log('📦 Test 1: Searching for "PUFFCO" products...');
  try {
    const response = await fetch('http://localhost:3000/api/search/suggestions?q=PUFFCO&limit=5');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.suggestions.length} suggestions:`);
      data.suggestions.forEach((suggestion: any, index: number) => {
        console.log(`  ${index + 1}. [${suggestion.type.toUpperCase()}] ${suggestion.title}`);
        if (suggestion.subtitle) console.log(`     ${suggestion.subtitle}`);
        if (suggestion.price) console.log(`     $${suggestion.price}`);
      });
    } else {
      console.log('❌ API request failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Error testing search API:', error);
  }

  console.log('\n');

  // Test 2: Direct database search for PUFFCO
  console.log('📊 Test 2: Direct database search for PUFFCO products...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, brand_name, price')
    .or('name.ilike.%PUFFCO%,brand_name.ilike.%PUFFCO%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .limit(5);

  if (error) {
    console.log('❌ Database error:', error);
  } else {
    console.log(`✅ Found ${products.length} PUFFCO products in database:`);
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (${product.brand_name}) - $${product.price}`);
    });
  }

  console.log('\n');

  // Test 3: Brand detection
  console.log('🏷️  Test 3: Testing brand detection...');
  const { data: brand } = await supabase
    .from('brands')
    .select('id, name, slug')
    .ilike('name', '%PUFFCO%')
    .single();

  if (brand) {
    console.log(`✅ Brand detected: ${brand.name} (slug: ${brand.slug})`);
  } else {
    console.log('❌ No brand found for PUFFCO');
  }

  console.log('\n🎉 Search functionality test completed!');
}

// Run the test
testSearchFunctionality().catch(console.error);
