import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function quickProductCardAnalysis() {
  console.log('🔍 Quick Product Card Data Analysis...\n');
  
  // Get sample of products to check key fields
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url, short_description, description, brand_name, stock_quantity')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .limit(10);

  if (!products || products.length === 0) {
    console.log('❌ No products found!');
    return;
  }

  console.log('📊 Sample Product Card Data:');
  console.log('=' .repeat(60));
  
  products.forEach((product, i) => {
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   Price: ${product.price ? '✅ $' + product.price : '❌ Missing'}`);
    console.log(`   Image: ${product.image_url ? '✅ Has URL' : '❌ Missing'}`);
    console.log(`   Short Desc: ${product.short_description ? '✅ Has content' : '❌ Missing'}`);
    console.log(`   Description: ${product.description ? '✅ Has content' : '❌ Missing'}`);
    console.log(`   Brand: ${product.brand_name ? '✅ ' + product.brand_name : '❌ Missing'}`);
    console.log(`   Stock: ${product.stock_quantity !== null ? '✅ ' + product.stock_quantity : '❌ Missing'}`);
    console.log('');
  });

  // Get counts for key fields
  const { count: totalCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);

  const { count: withImages } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .not('image_url', 'is', null)
    .neq('image_url', '');

  const { count: withShortDesc } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .not('short_description', 'is', null)
    .neq('short_description', '');

  const { count: withBrands } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .not('brand_name', 'is', null)
    .neq('brand_name', '');

  console.log('📈 Overall Completion Rates:');
  console.log('=' .repeat(40));
  console.log(`Total Products: ${totalCount}`);
  console.log(`With Images: ${withImages}/${totalCount} (${totalCount ? ((withImages || 0) / totalCount * 100).toFixed(1) : 0}%)`);
  console.log(`With Short Descriptions: ${withShortDesc}/${totalCount} (${totalCount ? ((withShortDesc || 0) / totalCount * 100).toFixed(1) : 0}%)`);
  console.log(`With Brands: ${withBrands}/${totalCount} (${totalCount ? ((withBrands || 0) / totalCount * 100).toFixed(1) : 0}%)`);

  console.log('\n🎯 IMMEDIATE ACTIONS NEEDED:');
  console.log('=' .repeat(50));
  
  if ((withImages || 0) < (totalCount || 0) * 0.8) {
    console.log('🖼️  HIGH PRIORITY: Populate product images');
    console.log('   Run: npx tsx scripts/smart-airtable-image-sync.ts');
  }
  
  if ((withShortDesc || 0) < (totalCount || 0) * 0.5) {
    console.log('📝 HIGH PRIORITY: Generate product descriptions');
    console.log('   Run: npx tsx scripts/generate-dope-descriptions.ts');
  }
  
  if ((withBrands || 0) < (totalCount || 0) * 0.5) {
    console.log('🏷️  HIGH PRIORITY: Populate brand relationships');
    console.log('   Run: npx tsx scripts/scalable-brand-integration-workflow.ts --live');
  }
}

quickProductCardAnalysis().catch(console.error);
