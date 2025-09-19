import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixRoorDescriptionMapping() {
  console.log('🔧 Fixing RooR description field mapping...\n');
  
  // Get all RooR products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, short_description, description, description_md')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .order('name');
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📦 Found ${products?.length || 0} RooR products\n`);
  
  let updatedCount = 0;
  
  for (const product of products || []) {
    let needsUpdate = false;
    const updates: any = {};
    
    // If description has content but description_md is empty, move it
    if (product.description && product.description.trim().length > 50 && !product.description_md) {
      updates.description_md = product.description;
      updates.description = null; // Clear the old field
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', product.id);
        
      if (updateError) {
        console.log(`❌ Failed to update ${product.name}:`, updateError.message);
        continue;
      }
      
      console.log(`✅ Updated ${product.name}`);
      console.log(`   Moved detailed description to description_md field`);
      updatedCount++;
    } else {
      console.log(`⏭️  Skipped ${product.name} - already correctly mapped`);
    }
  }
  
  console.log(`\n🎉 Description mapping fix complete!`);
  console.log(`📊 Updated ${updatedCount} products`);
  
  // Verify the fix
  console.log('\n🔍 Verification - checking field status:');
  const { data: verification } = await supabase
    .from('products')
    .select('id, name, short_description, description, description_md')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true);
    
  let withShort = 0;
  let withDetailed = 0;
  
  verification?.forEach(product => {
    if (product.short_description && product.short_description.trim().length > 10) withShort++;
    if (product.description_md && product.description_md.trim().length > 50) withDetailed++;
  });
  
  console.log(`✅ Products with short_description: ${withShort}/${verification?.length || 0}`);
  console.log(`✅ Products with description_md: ${withDetailed}/${verification?.length || 0}`);
}

fixRoorDescriptionMapping();
