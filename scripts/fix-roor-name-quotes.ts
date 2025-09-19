import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixRoorNameQuotes() {
  console.log('🔧 Fixing ROOR product name quotes...\n');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true);
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  let fixedCount = 0;
  
  for (const product of products || []) {
    if (product.name.startsWith('"') && product.name.endsWith('"')) {
      const cleanName = product.name.slice(1, -1); // Remove first and last character (quotes)
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ name: cleanName })
        .eq('id', product.id);
        
      if (updateError) {
        console.log(`❌ Failed to update ${product.name}:`, updateError.message);
        continue;
      }
      
      console.log(`✅ Fixed: ${product.name} → ${cleanName}`);
      fixedCount++;
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} product names by removing quotes`);
  
  // Show final results
  console.log('\n📋 Final ROOR product names:');
  const { data: finalProducts } = await supabase
    .from('products')
    .select('name')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .order('name');
    
  finalProducts?.forEach((product, i) => {
    console.log(`${i + 1}. ${product.name}`);
  });
}

fixRoorNameQuotes();
