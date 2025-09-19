#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createRoorBrand() {
  console.log('🎯 Creating ROOR brand with minimal fields...');
  
  try {
    // Try different combinations to find what works
    const attempts = [
      // Attempt 1: Just name and description
      {
        name: 'ROOR',
        description: 'Premium German glass water pipes and smoking accessories since 1995'
      },
      // Attempt 2: With UUID
      {
        id: randomUUID(),
        name: 'ROOR',
        description: 'Premium German glass water pipes and smoking accessories since 1995'
      },
      // Attempt 3: With title instead of name
      {
        title: 'ROOR',
        description: 'Premium German glass water pipes and smoking accessories since 1995'
      }
    ];
    
    for (let i = 0; i < attempts.length; i++) {
      console.log(`🔄 Attempt ${i + 1}:`, Object.keys(attempts[i]).join(', '));
      
      const { data: newBrand, error } = await supabase
        .from('brands')
        .insert(attempts[i])
        .select()
        .single();
        
      if (!error) {
        console.log('✅ Success! Created ROOR brand:', newBrand);
        await linkRoorProducts(newBrand.id);
        return newBrand;
      } else {
        console.log(`❌ Attempt ${i + 1} failed:`, error.message);
      }
    }
    
    console.log('❌ All attempts failed');
    return null;
    
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
