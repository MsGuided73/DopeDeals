#!/usr/bin/env tsx

import { supabaseServer } from '../lib/supabase-server.js';

async function createRoorBrand() {
  console.log('🎯 Creating ROOR brand entry...');
  
  try {
    // Check if ROOR brand already exists
    const { data: existingBrand } = await supabaseServer
      .from('brands')
      .select('*')
      .eq('slug', 'roor')
      .single();

    if (existingBrand) {
      console.log('✅ ROOR brand already exists:', existingBrand.name);
      return existingBrand;
    }

    // Create ROOR brand
    const { data: newBrand, error } = await supabaseServer
      .from('brands')
      .insert({
        name: 'ROOR',
        slug: 'roor',
        description: 'Premium German glass water pipes and smoking accessories. Founded in 1995, ROOR has become synonymous with precision engineering and clean, minimalist designs in borosilicate glass smoking accessories.',
        logo_url: '/images/brands/roor-logo.png',
        website: 'https://www.roor.com',
        country: 'Germany',
        founded_year: 1995,
        is_active: true,
        featured: true
      })
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error creating ROOR brand:', error);
      return null;
    }
    
    console.log('✅ Created ROOR brand:', newBrand);
    
    // Now update ROOR products to link to this brand
    console.log('🔄 Updating ROOR products to link to brand...');

    const { data: roorProducts, error: updateError } = await supabaseServer
      .from('products')
      .update({ brand_id: newBrand.id })
      .ilike('name', '%ROOR%')
      .select('id, name');
      
    if (updateError) {
      console.error('❌ Error updating ROOR products:', updateError);
    } else {
      console.log(`✅ Updated ${roorProducts?.length || 0} ROOR products with brand_id`);
      roorProducts?.forEach(product => {
        console.log(`  - ${product.name}`);
      });
    }
    
    return newBrand;
    
  } catch (error) {
    console.error('❌ Script error:', error);
    return null;
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
