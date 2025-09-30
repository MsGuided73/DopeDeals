import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Auditing Product Images...\n');

// Fetch all bong products
const { data: products, error } = await supabase
  .from('products')
  .select('id, name, price, image_url, sku')
  .ilike('name', '%bong%')
  .eq('is_active', true)
  .order('price', { ascending: false });

if (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}

console.log(`📊 Found ${products.length} bong products\n`);

// Group products by image URL
const imageGroups = {};
products.forEach(product => {
  const imageUrl = product.image_url || 'NO_IMAGE';
  if (!imageGroups[imageUrl]) {
    imageGroups[imageUrl] = [];
  }
  imageGroups[imageUrl].push(product);
});

// Find duplicates
console.log('🔴 DUPLICATE IMAGES (Same image used for multiple products):\n');
let duplicateCount = 0;
Object.entries(imageGroups).forEach(([imageUrl, prods]) => {
  if (prods.length > 1) {
    duplicateCount++;
    console.log(`\n📸 Image: ${imageUrl.substring(0, 80)}...`);
    console.log(`   Used by ${prods.length} products:`);
    prods.forEach(p => {
      console.log(`   - ${p.name} ($${p.price}) [SKU: ${p.sku}]`);
    });
  }
});

console.log(`\n\n📈 SUMMARY:`);
console.log(`   Total Products: ${products.length}`);
console.log(`   Unique Images: ${Object.keys(imageGroups).length}`);
console.log(`   Duplicate Image Groups: ${duplicateCount}`);

// Show most expensive products
console.log(`\n\n💰 TOP 5 MOST EXPENSIVE BONGS:\n`);
products.slice(0, 5).forEach((p, i) => {
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   Price: $${p.price}`);
  console.log(`   SKU: ${p.sku}`);
  console.log(`   Image: ${p.image_url ? '✅ Has Image' : '❌ No Image'}`);
  if (p.image_url) {
    console.log(`   URL: ${p.image_url}`);
  }
  console.log('');
});

// Products without images
const noImageProducts = products.filter(p => !p.image_url);
if (noImageProducts.length > 0) {
  console.log(`\n\n⚠️  ${noImageProducts.length} PRODUCTS WITHOUT IMAGES:\n`);
  noImageProducts.forEach(p => {
    console.log(`   - ${p.name} ($${p.price}) [SKU: ${p.sku}]`);
  });
}

console.log('\n✅ Audit Complete!\n');

