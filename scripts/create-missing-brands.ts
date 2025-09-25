#!/usr/bin/env node

/**
 * Create Missing Brands
 * 
 * This script creates all missing brands found in the products data
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

async function createMissingBrands(): Promise<void> {
  console.log('🏷️  Creating Missing Brands...\n');

  try {
    // Get all unique brands from products
    const { data: products } = await supabase
      .from('products')
      .select('brand_name, manufacturer')
      .not('brand_name', 'is', null)
      .not('manufacturer', 'is', null);

    const brandNames = new Set<string>();
    products?.forEach(product => {
      const brandName = product.brand_name || product.manufacturer;
      if (brandName && brandName.trim() && brandName !== 'null') {
        brandNames.add(brandName.trim());
      }
    });

    // Get existing brands
    const { data: existingBrands } = await supabase
      .from('brands')
      .select('name');

    const existingBrandNames = new Set(existingBrands?.map(b => b.name) || []);

    // Find missing brands
    const missingBrands = Array.from(brandNames).filter(brand => !existingBrandNames.has(brand));

    console.log(`Found ${missingBrands.length} missing brands to create:`);
    missingBrands.forEach(brand => console.log(`  • ${brand}`));
    console.log();

    // Create missing brands
    for (const brandName of missingBrands) {
      const slug = createSlug(brandName);
      
      console.log(`Creating brand: ${brandName} → ${slug}`);
      
      const { data, error } = await supabase
        .from('brands')
        .insert({
          id: randomUUID(),
          name: brandName,
          slug: slug,
          description: `${brandName} brand products`
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating brand ${brandName}:`, error.message);
      } else {
        console.log(`✅ Created brand: ${brandName} (ID: ${data.id})`);
      }
    }

    // Show final count
    const { data: finalBrands } = await supabase
      .from('brands')
      .select('id, name, slug');

    console.log(`\n✅ Total brands in database: ${finalBrands?.length || 0}`);
    finalBrands?.forEach(brand => {
      console.log(`  • ${brand.name} (${brand.slug})`);
    });

  } catch (error) {
    console.error('❌ Error creating brands:', error);
  }
}

// Run the script
createMissingBrands().then(() => {
  console.log('\n✅ Brand creation complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
