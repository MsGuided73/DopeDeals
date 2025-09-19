#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addRoorBrand() {
  console.log('🎯 Adding ROOR brand to existing brands table...');
  
  try {
    // Check if ROOR brand already exists
    const { data: existingBrand } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', 'roor')
      .single();
      
    if (existingBrand) {
      console.log('✅ ROOR brand already exists:', existingBrand.name);
      console.log('   ID:', existingBrand.id);
      console.log('   Slug:', existingBrand.slug);
      
      // Update ROOR products to use this brand_id
      await updateRoorProducts(existingBrand.id);
      return existingBrand;
    }
    
    // Create ROOR brand using your existing schema
    const { data: newBrand, error } = await supabase
      .from('brands')
      .insert({
        name: 'ROOR',
        slug: 'roor',
        description: 'Premium German glass water pipes and smoking accessories since 1995',
        // Add any other fields that exist in your brands table
      })
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error creating ROOR brand:', error);
      return null;
    }
    
    console.log('✅ Created ROOR brand:', newBrand);
    
    // Update ROOR products to use this brand_id
    await updateRoorProducts(newBrand.id);
    
    return newBrand;
    
  } catch (error) {
    console.error('❌ Script error:', error);
    return null;
  }
}

async function updateRoorProducts(brandId: string) {
  console.log('🔄 Updating ROOR products to link to brand ID:', brandId);
  
  try {
    const { data: roorProducts, error: updateError } = await supabase
      .from('products')
      .update({ brand_id: brandId })
      .ilike('name', '%ROOR%')
      .select('id, name, brand_id');
      
    if (updateError) {
      console.error('❌ Error updating ROOR products:', updateError);
    } else {
      console.log(`✅ Updated ${roorProducts?.length || 0} ROOR products with brand_id`);
      roorProducts?.forEach(product => {
        console.log(`  - ${product.name} (brand_id: ${product.brand_id})`);
      });
    }
  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
}

// Run the script
addRoorBrand().then(() => {
  console.log('🎉 ROOR brand setup complete!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
