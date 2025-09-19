import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixRoorBrandName() {
  console.log('🔧 Fixing ROOR brand name inconsistency...\n');
  
  // Find the product with brand_name 'R'
  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand_name')
    .eq('brand_name', 'R');
    
  console.log(`Found ${products?.length || 0} products with brand_name 'R':`);
  products?.forEach(product => {
    console.log(`- ${product.name} (ID: ${product.id})`);
  });
  
  if (products && products.length > 0) {
    // Update brand_name from 'R' to 'ROOR'
    const { error } = await supabase
      .from('products')
      .update({ brand_name: 'ROOR' })
      .eq('brand_name', 'R');
      
    if (error) {
      console.error('❌ Error updating brand name:', error);
    } else {
      console.log('✅ Successfully updated brand name from "R" to "ROOR"');
    }
  }
  
  // Verify the fix
  const { data: allRoorProducts } = await supabase
    .from('products')
    .select('id, name, brand_name')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);
    
  console.log(`\n✅ Total ROOR products after fix: ${allRoorProducts?.length || 0}`);
}

fixRoorBrandName();
