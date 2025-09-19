import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRoorProducts() {
  console.log('🔍 Checking RooR products in Supabase...\n');
  
  const { data, error } = await supabase
    .from('products')
    .select('id, name, brand_name, sku, description')
    .or('name.ilike.%roor%,brand_name.ilike.%roor%,sku.ilike.%roor%')
    .limit(50);
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('📦 RooR products in Supabase:');
  data?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Brand: ${p.brand_name || 'N/A'}`);
    console.log(`   SKU: ${p.sku || 'N/A'}`);
    console.log(`   Description: ${p.description ? (p.description.length > 100 ? 'Has description' : 'Short description') : 'No description'}`);
    console.log('');
  });
  
  console.log(`\n📊 Total: ${data?.length || 0} RooR products found`);
}

checkRoorProducts();
