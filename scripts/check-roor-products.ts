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
    .select('id, name, brand_name, sku, description, image_url, is_active')
    .or('name.ilike.%roor%,brand_name.ilike.%roor%,sku.ilike.%roor%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .limit(15);
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('📦 RooR products in Supabase:');
  data?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Brand: ${p.brand_name || 'N/A'}`);
    console.log(`   SKU: ${p.sku || 'N/A'}`);
    console.log(`   Image URL: ${p.image_url || 'None'}`);
    console.log(`   Active: ${p.is_active}`);
    console.log('');
  });

  // Check how many have images vs no images
  const withImages = data?.filter(p => p.image_url) || [];
  const withoutImages = data?.filter(p => !p.image_url) || [];

  console.log(`📊 Summary:`);
  console.log(`   Total RooR products: ${data?.length || 0}`);
  console.log(`   Products with images: ${withImages.length}`);
  console.log(`   Products without images: ${withoutImages.length}`);

  if (withoutImages.length > 0) {
    console.log(`\n❌ Products missing images:`);
    withoutImages.forEach((product, i) => {
      console.log(`   ${i + 1}. ${product.name} (${product.sku})`);
    });
  }
}

checkRoorProducts();
