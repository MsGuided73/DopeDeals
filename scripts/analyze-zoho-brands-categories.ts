#!/usr/bin/env node

/**
 * Analyze Zoho Products for Brands and Categories
 * 
 * This script examines all products in the database to identify:
 * 1. All unique brands that need to be created
 * 2. All unique categories that need to be created
 * 3. Current state of brand/category relationships
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProductAnalysis {
  totalProducts: number;
  uniqueBrands: Set<string>;
  uniqueCategories: Set<string>;
  productsWithBrands: number;
  productsWithCategories: number;
  productsWithoutBrands: number;
  productsWithoutCategories: number;
}

async function analyzeZohoData(): Promise<void> {
  console.log('🔍 Analyzing Zoho Products Data...\n');

  try {
    // Get all products with brand and category information
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id, name, sku, brand_name, brand_id, category_id, 
        zoho_category_name, manufacturer, channels
      `);

    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  No products found in database');
      return;
    }

    const analysis: ProductAnalysis = {
      totalProducts: products.length,
      uniqueBrands: new Set(),
      uniqueCategories: new Set(),
      productsWithBrands: 0,
      productsWithCategories: 0,
      productsWithoutBrands: 0,
      productsWithoutCategories: 0
    };

    // Analyze each product
    products.forEach(product => {
      // Brand analysis
      const brandName = product.brand_name || product.manufacturer;
      if (brandName && brandName.trim()) {
        analysis.uniqueBrands.add(brandName.trim());
        analysis.productsWithBrands++;
      } else {
        analysis.productsWithoutBrands++;
      }

      // Category analysis
      const categoryName = product.zoho_category_name;
      if (categoryName && categoryName.trim()) {
        analysis.uniqueCategories.add(categoryName.trim());
        analysis.productsWithCategories++;
      } else {
        analysis.productsWithoutCategories++;
      }
    });

    // Display results
    console.log('📊 ANALYSIS RESULTS');
    console.log('='.repeat(50));
    console.log(`Total Products: ${analysis.totalProducts}`);
    console.log(`Products with Brands: ${analysis.productsWithBrands}`);
    console.log(`Products without Brands: ${analysis.productsWithoutBrands}`);
    console.log(`Products with Categories: ${analysis.productsWithCategories}`);
    console.log(`Products without Categories: ${analysis.productsWithoutCategories}`);
    console.log();

    console.log('🏷️  UNIQUE BRANDS FOUND');
    console.log('='.repeat(50));
    const sortedBrands = Array.from(analysis.uniqueBrands).sort();
    sortedBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand}`);
    });
    console.log(`\nTotal Unique Brands: ${analysis.uniqueBrands.size}`);
    console.log();

    console.log('📂 UNIQUE CATEGORIES FOUND');
    console.log('='.repeat(50));
    const sortedCategories = Array.from(analysis.uniqueCategories).sort();
    sortedCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });
    console.log(`\nTotal Unique Categories: ${analysis.uniqueCategories.size}`);
    console.log();

    // Check current brands and categories tables
    console.log('🗄️  CURRENT DATABASE STATE');
    console.log('='.repeat(50));
    
    const { data: existingBrands } = await supabase
      .from('brands')
      .select('id, name, slug');
    
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id, name, slug');

    console.log(`Existing Brands in DB: ${existingBrands?.length || 0}`);
    console.log(`Existing Categories in DB: ${existingCategories?.length || 0}`);
    console.log();

    // Show missing brands and categories
    const existingBrandNames = new Set(existingBrands?.map(b => b.name) || []);
    const existingCategoryNames = new Set(existingCategories?.map(c => c.name) || []);

    const missingBrands = sortedBrands.filter(brand => !existingBrandNames.has(brand));
    const missingCategories = sortedCategories.filter(cat => !existingCategoryNames.has(cat));

    console.log('❌ MISSING BRANDS (need to be created)');
    console.log('='.repeat(50));
    missingBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand}`);
    });
    console.log(`\nMissing Brands: ${missingBrands.length}`);
    console.log();

    console.log('❌ MISSING CATEGORIES (need to be created)');
    console.log('='.repeat(50));
    missingCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });
    console.log(`\nMissing Categories: ${missingCategories.length}`);
    console.log();

    // Summary
    console.log('📋 NEXT STEPS');
    console.log('='.repeat(50));
    console.log(`1. Create ${missingBrands.length} missing brands`);
    console.log(`2. Create ${missingCategories.length} missing categories`);
    console.log(`3. Update ${analysis.productsWithoutBrands} products without brands`);
    console.log(`4. Update ${analysis.productsWithoutCategories} products without categories`);
    console.log(`5. Link all products to their correct brand/category IDs`);

  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

// Run the analysis
analyzeZohoData().then(() => {
  console.log('\n✅ Analysis complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
