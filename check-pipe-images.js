import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPipeImages() {
  console.log('🔍 Checking ALL pipe products and their VALID image URLs...');

  // First, find ALL pipe products (no limit)
  const { data, error } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, image_urls, brand_name, category_slug, subcategory_slug, categories')
    .or('name.ilike.%pipe%,name.ilike.%chillum%,name.ilike.%spoon%,name.ilike.%sherlock%,name.ilike.%one hitter%,name.ilike.%hand pipe%,name.ilike.%glass pipe%,name.ilike.%smoking pipe%')
    .not('name', 'ilike', '%bowl%')
    .not('name', 'ilike', '%water pipe%')
    .not('name', 'ilike', '%water pipes%')
    .not('name', 'ilike', '%tobacco pipe%')
    .not('name', 'ilike', '%hookah%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`📊 Found ${data?.length || 0} potential pipe products`);

  let totalPipes = 0;
  let pipesWithValidImages = 0;
  let pipesWithoutImages = 0;

  const results = (data || []).map((product) => {
    // Check if it's actually a pipe product using same logic as the API
    const isPipeProduct = product.category_slug === 'pipes' ||
                         product.category_slug === 'hand-pipes' ||
                         product.subcategory_slug === 'pipes' ||
                         (Array.isArray(product.categories) &&
                          product.categories.some(cat =>
                            cat?.toLowerCase().includes('pipe') &&
                            !cat?.toLowerCase().includes('water') &&
                            !cat?.toLowerCase().includes('bong')
                          ));

    // Check for valid image using same strict validation as the API
    const hasValidImage = product.image_url &&
                         product.image_url.trim() !== '' &&
                         product.image_url.trim() !== 'NULL' &&
                         product.image_url.trim() !== 'null' &&
                         !product.image_url.includes('placehold') &&
                         !product.image_url.includes('placeholder') &&
                         !product.image_url.includes('example.com') &&
                         !product.image_url.includes('test.com') &&
                         (product.image_url.startsWith('http://') || product.image_url.startsWith('https://')) &&
                         (product.image_url.includes('.jpg') ||
                          product.image_url.includes('.jpeg') ||
                          product.image_url.includes('.png') ||
                          product.image_url.includes('.webp') ||
                          product.image_url.includes('sigdistro.com') ||
                          product.image_url.includes('supabase.co'));

    const hasMultipleImages = !!(product.image_urls && product.image_urls.length > 0);

    totalPipes++;
    if (hasValidImage || hasMultipleImages) {
      pipesWithValidImages++;
      return { ...product, status: '✅ HAS IMAGE', isPipe: isPipeProduct, hasValidImage };
    } else {
      pipesWithoutImages++;
      return { ...product, status: '❌ NO IMAGE', isPipe: isPipeProduct, hasValidImage: false };
    }
  });

  console.log('\n📈 FINAL RESULTS:');
  console.log('='.repeat(60));
  console.log(`🎯 Total pipe products analyzed: ${totalPipes}`);
  console.log(`✅ Pipes WITH valid image URLs: ${pipesWithValidImages}`);
  console.log(`❌ Pipes WITHOUT valid image URLs: ${pipesWithoutImages}`);
  console.log(`📊 Image coverage: ${((pipesWithValidImages / totalPipes) * 100).toFixed(1)}%`);

  console.log('\n🔍 SAMPLE RESULTS (first 15 pipe products):');
  console.log('-'.repeat(60));

  results.slice(0, 15).forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   Status: ${product.status}`);
    console.log(`   Brand: ${product.brand_name || 'Unknown'}`);
    console.log(`   Image: ${product.image_url ? product.image_url.substring(0, 50) + '...' : 'None'}`);
    console.log('');
  });

  console.log(`\n📝 SUMMARY:`);
  console.log(`Out of ${totalPipes} pipe products found across all 4600+ products,`);
  console.log(`${pipesWithValidImages} have valid image URLs that will show on the pipes page.`);
}

checkPipeImages().catch(console.error);
