// Quick diagnostic script to check ROOR product images
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRoorImages() {
  console.log('🔍 Checking ROOR products...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, image_url, brand_name')
    .or('brand_name.ilike.%ROOR%,name.ilike.%ROOR%,sku.ilike.%ROOR%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .limit(10);

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} ROOR products\n`);

  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   SKU: ${product.sku}`);
    console.log(`   Brand: ${product.brand_name}`);
    console.log(`   Image URL: ${product.image_url || 'NO IMAGE'}`);
    console.log(`   Has Image: ${product.image_url ? '✅' : '❌'}`);
    console.log('');
  });

  // Summary
  const withImages = products.filter(p => p.image_url).length;
  const withoutImages = products.length - withImages;
  
  console.log('📊 SUMMARY:');
  console.log(`   Total products: ${products.length}`);
  console.log(`   With images: ${withImages} (${Math.round(withImages/products.length*100)}%)`);
  console.log(`   Without images: ${withoutImages} (${Math.round(withoutImages/products.length*100)}%)`);
}

checkRoorImages().catch(console.error);

