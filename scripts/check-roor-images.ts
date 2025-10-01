#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRoorImages() {
  console.log('🔍 CHECKING ROOR PRODUCT IMAGES');
  console.log('================================================================================\n');

  try {
    // Get ROOR products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, price, imageUrl, brand_name')
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,brand_name.ilike.%ROOR%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .order('price', { ascending: false })
      .limit(10);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!products || products.length === 0) {
      console.log('❌ No ROOR products found');
      return;
    }

    console.log(`✅ Found ${products.length} ROOR products\n`);

    // Group products by image URL to find duplicates
    const imageGroups: { [imageUrl: string]: any[] } = {};
    
    products.forEach(product => {
      const imageUrl = product.imageUrl || 'NO_IMAGE';
      if (!imageGroups[imageUrl]) {
        imageGroups[imageUrl] = [];
      }
      imageGroups[imageUrl].push(product);
    });

    // Show products and highlight duplicates
    console.log('📋 PRODUCT LIST WITH IMAGE ANALYSIS:\n');
    
    products.forEach((product, index) => {
      const imageUrl = product.imageUrl || 'NO_IMAGE';
      const duplicateCount = imageGroups[imageUrl].length;
      const isDuplicate = duplicateCount > 1;
      
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   💰 Price: $${product.price}`);
      console.log(`   📦 SKU: ${product.sku}`);
      console.log(`   🏷️  Brand: ${product.brand_name || 'N/A'}`);
      
      if (isDuplicate) {
        console.log(`   🚨 IMAGE: DUPLICATE (${duplicateCount} products using same image)`);
      } else {
        console.log(`   ✅ IMAGE: Unique`);
      }
      
      if (product.imageUrl) {
        console.log(`   🖼️  URL: ${product.imageUrl}`);
      } else {
        console.log(`   ❌ URL: No image assigned`);
      }
      console.log('');
    });

    // Show duplicate image analysis
    console.log('\n🔍 DUPLICATE IMAGE ANALYSIS:\n');
    
    Object.entries(imageGroups).forEach(([imageUrl, products]) => {
      if (products.length > 1) {
        console.log(`🚨 DUPLICATE IMAGE FOUND:`);
        console.log(`   Image URL: ${imageUrl}`);
        console.log(`   Used by ${products.length} products:`);
        products.forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name} ($${product.price})`);
        });
        console.log('');
      }
    });

    // Show summary
    const duplicateImages = Object.values(imageGroups).filter(group => group.length > 1);
    const uniqueImages = Object.values(imageGroups).filter(group => group.length === 1);
    
    console.log('\n📊 SUMMARY:');
    console.log(`   Total products: ${products.length}`);
    console.log(`   Unique images: ${uniqueImages.length}`);
    console.log(`   Duplicate images: ${duplicateImages.length}`);
    console.log(`   Products with no image: ${imageGroups['NO_IMAGE']?.length || 0}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the check
checkRoorImages();
