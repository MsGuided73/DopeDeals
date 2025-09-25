#!/usr/bin/env node

/**
 * Analyze ALL Products for Brands and Categories
 * 
 * This script examines all 4,579+ products in the main products table
 * to identify all unique brands and categories that need to be created
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function analyzeAllProductsData(): Promise<void> {
  console.log('🔍 Analyzing ALL Products Data (4,579+ products)...\n');

  try {
    // Get all products with brand and category information
    console.log('📊 Fetching all products...');
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id, name, sku, brand_name, brand_id, category_id, 
        zoho_category_name, manufacturer, channels, materials,
        tags, created_at
      `);

    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  No products found in database');
      return;
    }

    console.log(`✅ Loaded ${products.length} products\n`);

    // Analyze brands
    const brandSources = new Set<string>();
    const categorySources = new Set<string>();
    const materialSources = new Set<string>();
    
    let productsWithBrands = 0;
    let productsWithCategories = 0;
    let productsWithMaterials = 0;

    products.forEach(product => {
      // Brand analysis - check multiple fields
      const brandName = product.brand_name || product.manufacturer;
      if (brandName && brandName.trim() && brandName !== 'null') {
        brandSources.add(brandName.trim());
        productsWithBrands++;
      }

      // Category analysis - check multiple fields
      const categoryName = product.zoho_category_name;
      if (categoryName && categoryName.trim() && categoryName !== 'null') {
        categorySources.add(categoryName.trim());
        productsWithCategories++;
      }

      // Materials analysis
      if (product.materials && Array.isArray(product.materials)) {
        product.materials.forEach(material => {
          if (material && material.trim()) {
            materialSources.add(material.trim());
            productsWithMaterials++;
          }
        });
      }
    });

    // Display results
    console.log('📊 ANALYSIS RESULTS');
    console.log('='.repeat(60));
    console.log(`Total Products: ${products.length}`);
    console.log(`Products with Brands: ${productsWithBrands}`);
    console.log(`Products without Brands: ${products.length - productsWithBrands}`);
    console.log(`Products with Categories: ${productsWithCategories}`);
    console.log(`Products without Categories: ${products.length - productsWithCategories}`);
    console.log(`Products with Materials: ${productsWithMaterials}`);
    console.log();

    // Show brands
    console.log('🏷️  ALL UNIQUE BRANDS FOUND');
    console.log('='.repeat(60));
    const sortedBrands = Array.from(brandSources).sort();
    sortedBrands.forEach((brand, index) => {
      console.log(`${String(index + 1).padStart(3, ' ')}. ${brand}`);
    });
    console.log(`\nTotal Unique Brands: ${brandSources.size}`);
    console.log();

    // Show categories
    console.log('📂 ALL UNIQUE CATEGORIES FOUND');
    console.log('='.repeat(60));
    const sortedCategories = Array.from(categorySources).sort();
    sortedCategories.forEach((category, index) => {
      console.log(`${String(index + 1).padStart(3, ' ')}. ${category}`);
    });
    console.log(`\nTotal Unique Categories: ${categorySources.size}`);
    console.log();

    // Show materials (for reference)
    console.log('🧱 MATERIALS FOUND (for reference)');
    console.log('='.repeat(60));
    const sortedMaterials = Array.from(materialSources).sort();
    sortedMaterials.slice(0, 20).forEach((material, index) => {
      console.log(`${String(index + 1).padStart(3, ' ')}. ${material}`);
    });
    if (materialSources.size > 20) {
      console.log(`... and ${materialSources.size - 20} more materials`);
    }
    console.log(`\nTotal Unique Materials: ${materialSources.size}`);
    console.log();

    // Check current database state
    console.log('🗄️  CURRENT DATABASE STATE');
    console.log('='.repeat(60));
    
    const { data: existingBrands } = await supabase
      .from('brands')
      .select('id, name, slug');
    
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id, name, slug');

    console.log(`Existing Brands in DB: ${existingBrands?.length || 0}`);
    console.log(`Existing Categories in DB: ${existingCategories?.length || 0}`);
    console.log();

    // Show what needs to be created
    const existingBrandNames = new Set(existingBrands?.map(b => b.name) || []);
    const existingCategoryNames = new Set(existingCategories?.map(c => c.name) || []);

    const missingBrands = sortedBrands.filter(brand => !existingBrandNames.has(brand));
    const missingCategories = sortedCategories.filter(cat => !existingCategoryNames.has(cat));

    console.log('❌ MISSING BRANDS (need to be created)');
    console.log('='.repeat(60));
    missingBrands.forEach((brand, index) => {
      const slug = createSlug(brand);
      console.log(`${String(index + 1).padStart(3, ' ')}. ${brand} → ${slug}`);
    });
    console.log(`\nMissing Brands: ${missingBrands.length}`);
    console.log();

    console.log('❌ MISSING CATEGORIES (need to be created)');
    console.log('='.repeat(60));
    missingCategories.forEach((category, index) => {
      const slug = createSlug(category);
      console.log(`${String(index + 1).padStart(3, ' ')}. ${category} → ${slug}`);
    });
    console.log(`\nMissing Categories: ${missingCategories.length}`);
    console.log();

    // Show sample products for each brand
    console.log('🔍 SAMPLE PRODUCTS BY BRAND');
    console.log('='.repeat(60));
    for (const brand of sortedBrands.slice(0, 10)) {
      const sampleProducts = products
        .filter(p => (p.brand_name || p.manufacturer) === brand)
        .slice(0, 3);
      
      console.log(`\n${brand} (${sampleProducts.length} sample products):`);
      sampleProducts.forEach(product => {
        console.log(`  • ${product.name} (${product.sku})`);
      });
    }

    // Final summary
    console.log('\n📋 IMPLEMENTATION PLAN');
    console.log('='.repeat(60));
    console.log(`1. Create ${missingBrands.length} missing brands with slugs`);
    console.log(`2. Create ${missingCategories.length} missing categories with slugs`);
    console.log(`3. Update ${products.length - productsWithBrands} products without brand relationships`);
    console.log(`4. Update ${products.length - productsWithCategories} products without category relationships`);
    console.log(`5. Test brand and category pages with linked products`);

  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

// Run the analysis
analyzeAllProductsData().then(() => {
  console.log('\n✅ Complete analysis finished!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
