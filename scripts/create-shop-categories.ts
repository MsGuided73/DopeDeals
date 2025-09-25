#!/usr/bin/env node

/**
 * Create Shop Categories
 * 
 * This script creates all the categories defined in your "Shop by Category" navigation
 * and product categorization system
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

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

// Categories from your existing navigation and product categorization
const SHOP_CATEGORIES = [
  // Main product categories
  { name: 'Disposables', slug: 'disposables', description: 'Disposable vaping devices and e-cigarettes' },
  { name: 'E-Liquids', slug: 'e-liquids', description: 'Vape juices and e-liquid refills' },
  { name: 'Cannabis', slug: 'cannabis', description: 'Cannabis products including THCA flower and pre-rolls' },
  { name: 'Pipes & Bongs', slug: 'pipes-bongs', description: 'Glass pipes, bongs, and water pipes' },
  { name: 'Batteries', slug: 'batteries', description: 'Vape batteries and charging accessories' },
  { name: 'DOPE CLUB', slug: 'dope-club', description: 'Exclusive DOPE CLUB member products' },
  { name: 'Torches & Lighters', slug: 'torches-lighters', description: 'Butane torches, lighters, and ignition tools' },
  { name: 'Accessories', slug: 'accessories', description: 'Smoking and vaping accessories' },
  { name: 'Tools', slug: 'tools', description: 'Dabbing tools and smoking utensils' },
  { name: 'Edibles', slug: 'edibles', description: 'Cannabis edibles and infused products' },
  
  // Specific subcategories from navigation
  { name: 'Bongs & Water Pipes', slug: 'bongs', description: 'Glass bongs, water pipes, and bubblers' },
  { name: 'Hand Pipes', slug: 'pipes', description: 'Glass hand pipes, spoons, and dry pipes' },
  { name: 'Dab Rigs', slug: 'dab-rigs', description: 'Concentrate rigs and dabbing equipment' },
  { name: 'Vaporizers', slug: 'vaporizers', description: 'Dry herb and concentrate vaporizers' },
  { name: 'E-Rigs', slug: 'e-rigs', description: 'Electronic dab rigs and e-nails' },
  { name: 'Grinders', slug: 'grinders', description: 'Herb grinders and preparation tools' },
  { name: 'Rolling Papers', slug: 'rolling-papers', description: 'Rolling papers, wraps, and rolling accessories' },
  
  // Additional categories based on materials found
  { name: 'Glass', slug: 'glass', description: 'Glass smoking accessories and art pieces' },
  { name: 'Hookah', slug: 'hookah', description: 'Hookah pipes and shisha accessories' },
  { name: 'Kratom', slug: 'kratom', description: 'Kratom products and botanical supplements' },
  { name: 'Hemp', slug: 'hemp', description: 'Hemp-derived products and CBD items' },
  { name: 'Novelty', slug: 'novelty', description: 'Novelty items and unique accessories' },
  { name: 'Paper', slug: 'paper', description: 'Rolling papers, filters, and paper accessories' },
  
  // Catch-all
  { name: 'Other', slug: 'other', description: 'Miscellaneous products and accessories' }
];

async function createShopCategories(): Promise<void> {
  console.log('📂 Creating Shop Categories...\n');

  try {
    // Get existing categories
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('name');

    const existingCategoryNames = new Set(existingCategories?.map(c => c.name) || []);

    console.log(`Existing categories: ${existingCategories?.length || 0}`);
    console.log(`Categories to create: ${SHOP_CATEGORIES.length}`);
    console.log();

    // Filter out categories that already exist
    const categoriesToCreate = SHOP_CATEGORIES.filter(category =>
      !existingCategoryNames.has(category.name)
    );

    console.log(`New categories to create: ${categoriesToCreate.length}`);
    console.log();

    // Create missing categories
    let createdCount = 0;
    for (const category of categoriesToCreate) {
      console.log(`Creating category: ${category.name} → ${category.slug}`);
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          id: randomUUID(),
          name: category.name,
          description: category.description
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating category ${category.name}:`, error.message);
      } else {
        console.log(`✅ Created category: ${category.name} (ID: ${data.id})`);
        createdCount++;
      }
    }

    // Show final results
    const { data: finalCategories } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    console.log(`\n📊 FINAL RESULTS`);
    console.log('='.repeat(50));
    console.log(`Categories created: ${createdCount}`);
    console.log(`Total categories in database: ${finalCategories?.length || 0}`);
    console.log();

    console.log('📂 ALL CATEGORIES:');
    finalCategories?.forEach((category, index) => {
      console.log(`${String(index + 1).padStart(3, ' ')}. ${category.name}`);
    });

  } catch (error) {
    console.error('❌ Error creating categories:', error);
  }
}

// Run the script
createShopCategories().then(() => {
  console.log('\n✅ Category creation complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
