import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRoorNames() {
  console.log('🔍 Checking RooR product names...\n');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, price')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .order('name');
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
    
  console.log(`📦 Found ${products?.length || 0} RooR products with current names:\n`);
  
  products?.forEach((product, i) => {
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   SKU: ${product.sku}`);
    console.log(`   Price: $${product.price}`);
    console.log('');
  });
  
  console.log('🎯 ANALYSIS:');
  const skuLikeNames = products?.filter(p => 
    /^[A-Z0-9\-]+/.test(p.name) && 
    (p.name.includes('MIX') || p.name.includes('-') || /^\w+\d+/.test(p.name))
  ) || [];
  
  console.log(`❌ SKU-like names: ${skuLikeNames.length}/${products?.length || 0}`);
  console.log(`✅ Descriptive names: ${(products?.length || 0) - skuLikeNames.length}/${products?.length || 0}`);
}

checkRoorNames();
