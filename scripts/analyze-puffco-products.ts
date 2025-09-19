import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyzePuffcoProducts() {
  console.log('🔍 Analyzing Puffco products and images...\n');
  
  const { data: products } = await supabase
    .from('products')
    .select('id, name, sku, image_url, image_urls, price, short_description')
    .eq('brand_name', 'Puffco')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('name');
    
  console.log(`📦 Found ${products?.length || 0} Puffco products:\n`);
  
  let withImages = 0;
  let withoutImages = 0;
  let withDescriptions = 0;
  
  products?.forEach((product, i) => {
    const hasImage = product.image_url || (product.image_urls && product.image_urls.length > 0);
    const hasDescription = product.short_description && product.short_description.trim().length > 0;
    
    if (hasImage) withImages++;
    else withoutImages++;
    
    if (hasDescription) withDescriptions++;
    
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   SKU: ${product.sku || 'N/A'}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   Image: ${hasImage ? '✅ Has Image' : '❌ No Image'}`);
    console.log(`   Description: ${hasDescription ? '✅ Has Description' : '❌ No Description'}`);
    console.log('');
  });
  
  console.log(`📊 SUMMARY:`);
  console.log(`Total products: ${products?.length || 0}`);
  console.log(`With images: ${withImages}`);
  console.log(`Without images: ${withoutImages}`);
  console.log(`With descriptions: ${withDescriptions}`);
}

analyzePuffcoProducts();
