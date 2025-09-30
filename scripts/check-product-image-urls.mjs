// Check which products have image URLs and what bucket they point to
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTMzNjcsImV4cCI6MjA2NjYyOTM2N30.dCsYMaoD736ym1lBGMnCRPhPgJ21-RD2vbrDB7eksnM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkImageUrls() {
  console.log('🔍 Checking Product Image URLs...\n');

  // Get products with image URLs
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, image_url, brand_name')
    .not('image_url', 'is', null)
    .limit(100);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${products.length} products with image URLs\n`);

  const bucketCounts = {
    'products': 0,
    'website-images': 0,
    'external': 0,
    'other': 0
  };

  const productsBucket = [];
  const websiteImagesBucket = [];

  products.forEach(product => {
    if (product.image_url.includes('/storage/v1/object/public/products/')) {
      bucketCounts['products']++;
      productsBucket.push(product);
    } else if (product.image_url.includes('/storage/v1/object/public/website-images/')) {
      bucketCounts['website-images']++;
      websiteImagesBucket.push(product);
    } else if (product.image_url.startsWith('http')) {
      bucketCounts['external']++;
    } else {
      bucketCounts['other']++;
    }
  });

  console.log('📊 Image URL Distribution:\n');
  console.log(`  Products bucket: ${bucketCounts['products']}`);
  console.log(`  Website-images bucket: ${bucketCounts['website-images']}`);
  console.log(`  External URLs: ${bucketCounts['external']}`);
  console.log(`  Other: ${bucketCounts['other']}`);

  if (productsBucket.length > 0) {
    console.log(`\n⚠️  ${productsBucket.length} products still using 'products' bucket (broken):\n`);
    productsBucket.slice(0, 10).forEach(p => {
      console.log(`  - ${p.name}`);
      console.log(`    ${p.image_url}`);
    });
    
    if (productsBucket.length > 10) {
      console.log(`  ... and ${productsBucket.length - 10} more`);
    }
  }

  if (websiteImagesBucket.length > 0) {
    console.log(`\n✅ ${websiteImagesBucket.length} products using 'website-images' bucket (working):\n`);
    websiteImagesBucket.slice(0, 5).forEach(p => {
      console.log(`  - ${p.name}`);
    });
  }

  console.log('\n💡 To fix products using the broken "products" bucket:');
  console.log('   Run: scripts/update-image-urls.sql in Supabase SQL Editor');
}

checkImageUrls().catch(console.error);

