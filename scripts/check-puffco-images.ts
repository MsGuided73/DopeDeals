import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkPuffcoImages() {
  console.log('🖼️  Checking Puffco product images...\n');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, image_url, price')
    .eq('brand_name', 'Puffco')
    .order('name');
    
  if (error) {
    console.error('❌ Error fetching Puffco products:', error);
    return;
  }
  
  console.log(`📊 Found ${products?.length || 0} Puffco products:\n`);
  
  let hasImages = 0;
  let missingImages = 0;
  let placeholderImages = 0;
  
  products?.forEach((product, i) => {
    const hasImage = product.image_url && product.image_url.trim() !== '';
    const isPlaceholder = product.image_url && (
      product.image_url.includes('placehold.co') || 
      product.image_url.includes('placeholder') ||
      product.image_url.includes('unsplash.com')
    );
    
    let status = '❌ No image';
    if (hasImage) {
      if (isPlaceholder) {
        status = '🔄 Placeholder';
        placeholderImages++;
      } else {
        status = '✅ Has image';
        hasImages++;
      }
    } else {
      missingImages++;
    }
    
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   SKU: ${product.sku || 'N/A'}`);
    console.log(`   Price: $${product.price || 'N/A'}`);
    console.log(`   Image: ${status}`);
    if (product.image_url) {
      console.log(`   URL: ${product.image_url.substring(0, 80)}${product.image_url.length > 80 ? '...' : ''}`);
    }
    console.log('');
  });
  
  console.log('📈 IMAGE SUMMARY:');
  console.log(`✅ Products with real images: ${hasImages}`);
  console.log(`🔄 Products with placeholder images: ${placeholderImages}`);
  console.log(`❌ Products missing images: ${missingImages}`);
  console.log(`📊 Total products: ${products?.length || 0}`);
  
  const needsImages = missingImages + placeholderImages;
  if (needsImages > 0) {
    console.log(`\n⚠️  ${needsImages} products need proper images`);
    console.log('Consider running the image sync script or manually adding product images.');
  } else {
    console.log('\n🎉 All Puffco products have proper images!');
  }
}

checkPuffcoImages();
