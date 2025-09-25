import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateCraveBrands() {
  console.log('🔥 Updating Crave brand names...\n');
  
  try {
    // Find products with CRAVE in the name and update brand_name
    const { data: craveProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, brand_name')
      .or('name.ilike.%CRAVE%,name.ilike.%crave%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);
      
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${craveProducts?.length || 0} products with CRAVE in name`);
    
    if (!craveProducts || craveProducts.length === 0) {
      console.log('❌ No Crave products found');
      return;
    }
    
    console.log('\n🎯 Sample Crave products found:');
    craveProducts.slice(0, 5).forEach((product, i) => {
      console.log(`${i + 1}. ${product.name}`);
      console.log(`   Current brand: ${product.brand_name || 'None'}`);
    });
    
    // Update brand_name to 'Crave' for these products
    let updated = 0;
    console.log('\n🔄 Updating brand names...');
    
    for (const product of craveProducts) {
      if (product.brand_name !== 'Crave') {
        const { error: updateError } = await supabase
          .from('products')
          .update({ brand_name: 'Crave' })
          .eq('id', product.id);
          
        if (updateError) {
          console.log(`❌ Failed to update ${product.name}: ${updateError.message}`);
        } else {
          console.log(`✅ Updated: ${product.name}`);
          updated++;
        }
      } else {
        console.log(`⏭️  Already set: ${product.name}`);
      }
    }
    
    console.log(`\n🎯 Updated ${updated} products with Crave brand name`);
    console.log(`📊 Total Crave products: ${craveProducts.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateCraveBrands().catch(console.error);
