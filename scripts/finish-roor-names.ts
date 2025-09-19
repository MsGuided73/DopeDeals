import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function finishRoorNames() {
  console.log('🔧 Finishing ROOR product name cleanup...\n');
  
  // Manual fixes for the remaining products
  const nameUpdates = [
    {
      oldName: 'BEAKER 18\' ROOR',
      newName: 'ROOR Classic Beaker 18" - Clear Borosilicate Glass'
    },
    {
      oldName: 'STRAIGHT 18\'  MIX COLOR ROOR',
      newName: 'ROOR Classic Straight Tube 18" - Mixed Colors'
    },
    {
      oldName: 'ZEAKER 5MM ROOR',
      newName: 'ROOR Zeaker 5mm - Premium Thick Glass Beaker'
    },
    {
      oldName: 'ZEAKER 9MM ROOR',
      newName: 'ROOR Zeaker 9mm - Ultra Thick Glass Beaker'
    },
    {
      oldName: 'ROAR CUSTOM KING PUB  ROOR',
      newName: 'ROOR Custom King Pub - Collector\'s Edition Masterpiece'
    }
  ];
  
  for (const update of nameUpdates) {
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('name', update.oldName)
      .eq('brand_name', 'ROOR')
      .single();
      
    if (product) {
      const { error } = await supabase
        .from('products')
        .update({ name: update.newName })
        .eq('id', product.id);
        
      if (error) {
        console.log(`❌ Failed to update ${update.oldName}:`, error.message);
      } else {
        console.log(`✅ Updated: ${update.oldName}`);
        console.log(`   → ${update.newName}`);
      }
    } else {
      console.log(`⚠️  Product not found: ${update.oldName}`);
    }
  }
  
  console.log('\n🎉 ROOR product name cleanup complete!');
  
  // Show final results
  console.log('\n📋 Final ROOR product names:');
  const { data: finalProducts } = await supabase
    .from('products')
    .select('name, price')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .order('name');
    
  finalProducts?.forEach((product, i) => {
    console.log(`${i + 1}. ${product.name} - $${product.price}`);
  });
}

finishRoorNames();
