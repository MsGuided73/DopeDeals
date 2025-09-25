#!/usr/bin/env node

/**
 * Comprehensive Zoho Data Analysis
 * 
 * This script examines the zoho_products table and all product-related tables
 * to get a complete picture of available brands and categories
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyzeFullZohoData(): Promise<void> {
  console.log('🔍 Comprehensive Zoho Data Analysis...\n');

  try {
    // 1. Check zoho_products table
    console.log('📋 ZOHO PRODUCTS TABLE');
    console.log('='.repeat(50));
    
    const { data: zohoProducts, error: zohoError } = await supabase
      .from('zoho_products')
      .select('*')
      .limit(10);

    if (zohoError) {
      console.log('❌ Error accessing zoho_products:', zohoError.message);
    } else if (zohoProducts && zohoProducts.length > 0) {
      console.log(`✅ Found ${zohoProducts.length} sample Zoho products`);
      console.log('Sample product structure:');
      console.log(JSON.stringify(zohoProducts[0], null, 2));
    } else {
      console.log('⚠️  No data in zoho_products table');
    }

    // 2. Get total count of zoho products
    const { count: zohoCount } = await supabase
      .from('zoho_products')
      .select('*', { count: 'exact', head: true });

    console.log(`\nTotal Zoho Products: ${zohoCount || 0}`);

    // 3. Analyze brands in zoho_products
    const { data: zohoBrands } = await supabase
      .from('zoho_products')
      .select('brand')
      .not('brand', 'is', null)
      .not('brand', 'eq', '');

    const uniqueZohoBrands = new Set(zohoBrands?.map(p => p.brand?.trim()).filter(Boolean) || []);
    
    console.log('\n🏷️  BRANDS IN ZOHO_PRODUCTS');
    console.log('='.repeat(50));
    Array.from(uniqueZohoBrands).sort().forEach((brand, index) => {
      console.log(`${index + 1}. ${brand}`);
    });
    console.log(`\nTotal Unique Zoho Brands: ${uniqueZohoBrands.size}`);

    // 4. Analyze categories in zoho_products
    const { data: zohoCategories } = await supabase
      .from('zoho_products')
      .select('zoho_category_name, zoho_category_id')
      .not('zoho_category_name', 'is', null)
      .not('zoho_category_name', 'eq', '');

    const uniqueZohoCategories = new Set(
      zohoCategories?.map(p => p.zoho_category_name?.trim()).filter(Boolean) || []
    );
    
    console.log('\n📂 CATEGORIES IN ZOHO_PRODUCTS');
    console.log('='.repeat(50));
    Array.from(uniqueZohoCategories).sort().forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });
    console.log(`\nTotal Unique Zoho Categories: ${uniqueZohoCategories.size}`);

    // 5. Check main products table for comparison
    console.log('\n📊 MAIN PRODUCTS TABLE COMPARISON');
    console.log('='.repeat(50));
    
    const { count: mainProductsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    console.log(`Main Products Count: ${mainProductsCount || 0}`);
    console.log(`Zoho Products Count: ${zohoCount || 0}`);
    console.log(`Difference: ${(zohoCount || 0) - (mainProductsCount || 0)}`);

    // 6. Check for products with zoho_item_id
    const { data: linkedProducts } = await supabase
      .from('products')
      .select('zoho_item_id')
      .not('zoho_item_id', 'is', null);

    console.log(`Products linked to Zoho: ${linkedProducts?.length || 0}`);

    // 7. Sample some zoho products with rich data
    console.log('\n🔍 SAMPLE ZOHO PRODUCTS WITH CATEGORIES');
    console.log('='.repeat(50));
    
    const { data: sampleProducts } = await supabase
      .from('zoho_products')
      .select('name, brand, zoho_category_name, sku')
      .not('zoho_category_name', 'is', null)
      .limit(10);

    sampleProducts?.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Brand: ${product.brand || 'N/A'}`);
      console.log(`   Category: ${product.zoho_category_name || 'N/A'}`);
      console.log(`   SKU: ${product.sku}`);
      console.log();
    });

    // 8. Check if we need to sync from Zoho
    console.log('🔄 SYNC STATUS');
    console.log('='.repeat(50));
    
    if ((zohoCount || 0) > (mainProductsCount || 0)) {
      console.log(`⚠️  Zoho has ${(zohoCount || 0) - (mainProductsCount || 0)} more products than main table`);
      console.log('   Consider running a full sync from Zoho to main products table');
    } else if ((zohoCount || 0) === (mainProductsCount || 0)) {
      console.log('✅ Product counts match - sync appears complete');
    } else {
      console.log('⚠️  Main table has more products than Zoho - investigate data source');
    }

    // 9. Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('='.repeat(50));
    
    if (uniqueZohoBrands.size > 0) {
      console.log(`1. Create ${uniqueZohoBrands.size} brands from Zoho data`);
    }
    
    if (uniqueZohoCategories.size > 0) {
      console.log(`2. Create ${uniqueZohoCategories.size} categories from Zoho data`);
    }
    
    if ((zohoCount || 0) > (mainProductsCount || 0)) {
      console.log('3. Sync remaining products from zoho_products to main products table');
    }
    
    console.log('4. Update product relationships to link brands and categories');
    console.log('5. Generate slugs for all brands and categories');

  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

// Run the analysis
analyzeFullZohoData().then(() => {
  console.log('\n✅ Comprehensive analysis complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
