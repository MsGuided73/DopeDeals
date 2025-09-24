import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseState() {
  console.log('🔍 Checking current database state for Phase 2 planning...\n');
  
  try {
    // Check products
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    console.log('📦 Total Products:', productsCount || 0);
    
    // Check active products
    const { count: activeProductsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    console.log('✅ Active Products:', activeProductsCount || 0);
    
    // Check categories
    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    console.log('📂 Categories:', categoriesCount || 0);
    
    // Check inventory
    const { count: inventoryCount } = await supabase
      .from('inventory')
      .select('*', { count: 'exact', head: true });
    console.log('📊 Inventory Records:', inventoryCount || 0);
    
    // Check brands
    const { count: brandsCount } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });
    console.log('🏷️  Brands:', brandsCount || 0);
    
    console.log('\n🔍 CRITICAL ISSUES ANALYSIS:');
    
    // Check products with missing categories
    const { count: missingCategoriesCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .is('category_id', null)
      .eq('is_active', true);
    console.log('❌ Active products missing categories:', missingCategoriesCount || 0);
    
    // Check products with missing images
    const { count: missingImagesCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .is('image_url', null)
      .eq('is_active', true);
    console.log('🖼️  Active products missing images:', missingImagesCount || 0);
    
    // Check products with missing descriptions
    const { count: missingDescriptionsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .or('description.is.null,description.eq.')
      .eq('is_active', true);
    console.log('📝 Active products missing descriptions:', missingDescriptionsCount || 0);
    
    console.log('\n🔄 ZOHO SYNC STATUS:');
    
    // Check Zoho sync status
    const { count: zohoProductsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('zoho_item_id', 'is', null);
    console.log('✅ Products with Zoho ID:', zohoProductsCount || 0);
    
    // Check products missing Zoho sync
    const { count: missingZohoCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .is('zoho_item_id', null)
      .eq('is_active', true);
    console.log('❌ Active products missing Zoho ID:', missingZohoCount || 0);
    
    // Check products with Zoho category names
    const { count: zohoCategories } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('zoho_category_name', 'is', null);
    console.log('📂 Products with Zoho category names:', zohoCategories || 0);
    
    console.log('\n📊 PHASE 2 PRIORITY ANALYSIS:');
    
    // Calculate sync completion percentages
    const totalActive = activeProductsCount || 0;
    const categoryCompletion = totalActive > 0 ? Math.round(((totalActive - (missingCategoriesCount || 0)) / totalActive) * 100) : 0;
    const imageCompletion = totalActive > 0 ? Math.round(((totalActive - (missingImagesCount || 0)) / totalActive) * 100) : 0;
    const zohoCompletion = totalActive > 0 ? Math.round(((zohoProductsCount || 0) / totalActive) * 100) : 0;
    const inventoryCompletion = totalActive > 0 ? Math.round(((inventoryCount || 0) / totalActive) * 100) : 0;
    
    console.log(`🎯 Category Assignment: ${categoryCompletion}% complete`);
    console.log(`🖼️  Image Population: ${imageCompletion}% complete`);
    console.log(`🔄 Zoho Sync: ${zohoCompletion}% complete`);
    console.log(`📊 Inventory Sync: ${inventoryCompletion}% complete`);
    
    console.log('\n🚨 IMMEDIATE ACTION ITEMS:');
    
    if (categoriesCount === 0) {
      console.log('1. 🔴 CRITICAL: No categories found - run category sync first');
    } else if ((missingCategoriesCount || 0) > 0) {
      console.log(`1. 🟡 ${missingCategoriesCount} products need category assignment`);
    } else {
      console.log('1. ✅ Category assignment complete');
    }
    
    if (inventoryCount === 0) {
      console.log('2. 🔴 CRITICAL: No inventory records - run inventory sync');
    } else if (inventoryCompletion < 90) {
      console.log(`2. 🟡 Inventory sync ${inventoryCompletion}% complete - needs update`);
    } else {
      console.log('2. ✅ Inventory sync mostly complete');
    }
    
    if ((missingImagesCount || 0) > (totalActive * 0.5)) {
      console.log('3. 🔴 CRITICAL: Most products missing images - run image sync');
    } else if ((missingImagesCount || 0) > 0) {
      console.log(`3. 🟡 ${missingImagesCount} products need images`);
    } else {
      console.log('3. ✅ Image population complete');
    }
    
    // Sample some products to understand data quality
    console.log('\n📋 SAMPLE PRODUCT DATA:');
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('id, name, sku, category_id, image_url, zoho_item_id, zoho_category_name, brand_name')
      .eq('is_active', true)
      .limit(3);
    
    sampleProducts?.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku || 'N/A'}`);
      console.log(`   Category ID: ${product.category_id || 'MISSING'}`);
      console.log(`   Zoho Category: ${product.zoho_category_name || 'N/A'}`);
      console.log(`   Brand: ${product.brand_name || 'N/A'}`);
      console.log(`   Image: ${product.image_url ? 'YES' : 'MISSING'}`);
      console.log(`   Zoho ID: ${product.zoho_item_id || 'MISSING'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking database state:', error);
  }
}

checkDatabaseState();
