import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qirbapivptotybspnbet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8'
);

console.log('🔍 Auditing ROOR Product Images...\n');

// Fetch ROOR products
const { data: products, error } = await supabase
  .from('products')
  .select('id, name, price, image_url, sku')
  .or('name.ilike.%ROOR%,brand_name.ilike.%ROOR%')
  .eq('is_active', true)
  .order('price', { ascending: false });

if (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}

console.log(`📊 Found ${products.length} ROOR products\n`);

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
console.log('🔴 DUPLICATE IMAGES:\n');
let duplicateCount = 0;
Object.entries(imageGroups).forEach(([imageUrl, prods]) => {
  if (prods.length > 1) {
    duplicateCount++;
    const shortUrl = imageUrl.includes('http') ? imageUrl.split('/').pop() : imageUrl;
    console.log(`\n📸 ${shortUrl}`);
    console.log(`   Used by ${prods.length} products:`);
    prods.forEach(p => {
      console.log(`   - ${p.name.substring(0, 50)} ($${p.price})`);
    });
  }
});

console.log(`\n\n📈 SUMMARY:`);
console.log(`   Total ROOR Products: ${products.length}`);
console.log(`   Unique Images: ${Object.keys(imageGroups).length}`);
console.log(`   Duplicate Image Groups: ${duplicateCount}`);

// Show most expensive products
console.log(`\n\n💰 TOP 5 MOST EXPENSIVE ROOR PRODUCTS:\n`);
products.slice(0, 5).forEach((p, i) => {
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   Price: $${p.price}`);
  console.log(`   SKU: ${p.sku}`);
  console.log(`   Image: ${p.image_url ? '✅ Has Image' : '❌ No Image'}`);
  if (p.image_url) {
    const shortUrl = p.image_url.split('/').pop();
    console.log(`   File: ${shortUrl}`);
  }
  console.log('');
});

// Products without images
const noImageProducts = products.filter(p => !p.image_url);
if (noImageProducts.length > 0) {
  console.log(`\n\n⚠️  ${noImageProducts.length} PRODUCTS WITHOUT IMAGES:\n`);
  noImageProducts.forEach(p => {
    console.log(`   - ${p.name} ($${p.price})`);
  });
}

console.log('\n✅ Audit Complete!\n');

