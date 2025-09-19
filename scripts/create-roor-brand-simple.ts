#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createRoorBrand() {
  console.log('🎯 Creating ROOR brand with minimal fields...');
  
  try {
    // Try to create ROOR brand with just name first
    const { data: newBrand, error } = await supabase
      .from('brands')
      .insert({
        name: 'ROOR',
        description: 'Premium German glass water pipes and smoking accessories since 1995'
      })
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error creating ROOR brand:', error);
      
      // If slug is required, try adding it
      if (error.message.includes('slug')) {
        console.log('🔄 Trying with slug field...');
        const { data: brandWithSlug, error: slugError } = await supabase
          .from('brands')
          .insert({
            name: 'ROOR',
            slug: 'roor',
            description: 'Premium German glass water pipes and smoking accessories since 1995'
          })
          .select()
          .single();
          
        if (slugError) {
          console.error('❌ Error with slug:', slugError);
          return null;
        }
        
        console.log('✅ Created ROOR brand with slug:', brandWithSlug);
        await linkRoorProducts(brandWithSlug.id);
        return brandWithSlug;
      }
      
      return null;
    }
    
    console.log('✅ Created ROOR brand:', newBrand);
    await linkRoorProducts(newBrand.id);
    return newBrand;
    
  } catch (error) {
    console.error('❌ Script error:', error);
    return null;
  }
}

async function linkRoorProducts(brandId: string) {
  console.log('🔗 Linking ROOR products to brand ID:', brandId);
  
  try {
    const { data: updatedProducts, error } = await supabase
      .from('products')
      .update({ brand_id: brandId })
      .ilike('name', '%ROOR%')
      .select('id, name');
      
    if (error) {
      console.error('❌ Error linking products:', error);
    } else {
      console.log(`✅ Linked ${updatedProducts?.length || 0} ROOR products to brand`);
      updatedProducts?.forEach(product => {
        console.log(`  - ${product.name}`);
      });
    }
  } catch (error) {
    console.error('❌ Error in linkRoorProducts:', error);
  }
}

// Run the script
createRoorBrand().then(() => {
  console.log('🎉 ROOR brand creation complete!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
