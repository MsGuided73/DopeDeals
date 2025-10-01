#!/usr/bin/env tsx

/**
 * Test script to debug bongs API issues
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testBongsAPI() {
  console.log('🔍 Testing Bongs API and Database Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic database connection...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count(*)')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    console.log('✅ Database connection successful');

    // Test 2: Check table structure
    console.log('\n2️⃣ Checking products table structure...');
    const { data: structureData, error: structureError } = await supabase
      .from('products')
      .select('id, name, is_active, nicotine_product, tobacco_product')
      .limit(1);

    if (structureError) {
      console.error('❌ Table structure check failed:', structureError);
      console.log('🔧 Trying without compliance columns...');
      
      const { data: basicData, error: basicError } = await supabase
        .from('products')
        .select('id, name, is_active')
        .limit(1);
        
      if (basicError) {
        console.error('❌ Basic table check failed:', basicError);
        return;
      } else {
        console.log('✅ Basic table structure works, compliance columns may be missing');
      }
    } else {
      console.log('✅ Full table structure available');
    }

    // Test 3: Fetch products with different approaches
    console.log('\n3️⃣ Testing product fetching approaches...');

    // Approach 1: Basic query
    console.log('📋 Approach 1: Basic active products query...');
    const { data: basicProducts, error: basicError } = await supabase
      .from('products')
      .select('id, name, sku, zoho_category_name, brand_name')
      .eq('is_active', true)
      .limit(10);

    if (basicError) {
      console.error('❌ Basic query failed:', basicError);
    } else {
      console.log(`✅ Basic query: Found ${basicProducts?.length || 0} products`);
      if (basicProducts && basicProducts.length > 0) {
        console.log('📊 Sample products:', basicProducts.slice(0, 3));
      }
    }

    // Approach 2: With compliance filters
    console.log('\n📋 Approach 2: With compliance filters...');
    try {
      const { data: complianceProducts, error: complianceError } = await supabase
        .from('products')
        .select('id, name, sku, zoho_category_name, brand_name')
        .eq('is_active', true)
        .eq('nicotine_product', false)
        .eq('tobacco_product', false)
        .limit(10);

      if (complianceError) {
        console.error('❌ Compliance query failed:', complianceError);
      } else {
        console.log(`✅ Compliance query: Found ${complianceProducts?.length || 0} products`);
      }
    } catch (error) {
      console.error('❌ Compliance query exception:', error);
    }

    // Test 4: Look for bong-like products
    console.log('\n4️⃣ Looking for bong-like products...');
    const { data: bongLikeProducts, error: bongError } = await supabase
      .from('products')
      .select('id, name, sku, zoho_category_name, brand_name, description')
      .eq('is_active', true)
      .or('name.ilike.%bong%,zoho_category_name.ilike.%bong%,description.ilike.%bong%')
      .limit(5);

    if (bongError) {
      console.error('❌ Bong search failed:', bongError);
    } else {
      console.log(`✅ Bong search: Found ${bongLikeProducts?.length || 0} bong-like products`);
      if (bongLikeProducts && bongLikeProducts.length > 0) {
        console.log('🎯 Bong products found:');
        bongLikeProducts.forEach(product => {
          console.log(`  - ${product.name} (${product.sku}) - Category: ${product.zoho_category_name}`);
        });
      }
    }

    // Test 5: Check ROOR products specifically
    console.log('\n5️⃣ Checking ROOR products (related to search issue)...');
    const { data: roorProducts, error: roorError } = await supabase
      .from('products')
      .select('id, name, sku, brand_name, zoho_category_name')
      .eq('is_active', true)
      .or('name.ilike.%ROOR%,brand_name.ilike.%ROOR%')
      .limit(5);

    if (roorError) {
      console.error('❌ ROOR search failed:', roorError);
    } else {
      console.log(`✅ ROOR search: Found ${roorProducts?.length || 0} ROOR products`);
      if (roorProducts && roorProducts.length > 0) {
        console.log('🏷️ ROOR products found:');
        roorProducts.forEach(product => {
          console.log(`  - ${product.name} (${product.sku}) - Brand: ${product.brand_name} - Category: ${product.zoho_category_name}`);
        });
      }
    }

  } catch (error) {
    console.error('💥 Test script error:', error);
  }
}

// Run the test
testBongsAPI().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
