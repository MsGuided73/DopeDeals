import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function countPipesWithValidImages() {
  console.log('🔍 Counting ALL pipes with valid image URLs across all 4600+ products...');

  // First, identify all pipe-related products using comprehensive search criteria
  const pipeSearchTerms = [
    'pipe', 'chillum', 'spoon', 'sherlock', 'one hitter',
    'hand pipe', 'glass pipe', 'smoking pipe'
  ];

  const pipeQueries = pipeSearchTerms.map(term =>
    `name.ilike.%${term.replace(' ', '%')}%`
  ).join(',');

  console.log(`Searching for products containing: ${pipeSearchTerms.join(', ')}`);

  // Get ALL pipe products (no limit)
  const { data: pipeProducts, error: pipeError } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, image_urls, brand_name')
    .or(pipeQueries)
    .not('name', 'ilike', '%bowl%')
    .not('name', 'ilike', '%water pipe%')
    .not('name', 'ilike', '%water pipes%')
    .not('name', 'ilike', '%tobacco pipe%')
    .not('name', 'ilike', '%hookah%');

  if (pipeError) {
    console.error('❌ Error fetching pipe products:', pipeError);
    return;
  }

  const totalPipes = pipeProducts?.length || 0;
  console.log(`📊 Total pipe products found: ${totalPipes}`);

  let validImageCount = 0;
  let invalidImageCount = 0;
  let detailedResults = [];

  // Check each product for valid images
  pipeProducts.forEach((product, index) => {
    const hasPrimaryImage = !!(product.image_url && product.image_url.trim());
    const hasMultipleImages = !!(product.image_urls && product.image_urls.length > 0);

    let imageStatus = 'no image';

    if (hasPrimaryImage || hasMultipleImages) {
      validImageCount++;
      if (hasPrimaryImage && hasMultipleImages) {
        imageStatus = 'primary + multiple images';
      } else if (hasPrimaryImage) {
        imageStatus = 'primary image only';
      } else {
        imageStatus = 'multiple images only';
      }
    } else {
      invalidImageCount++;
      imageStatus = 'no image';
    }

    detailedResults.push({
      name: product.name,
      brand: product.brand_name || 'Unknown',
      image_url: product.image_url,
      image_urls: product.image_urls,
      status: imageStatus
    });
  });

  // Output results
  console.log('\n📈 FINAL RESULTS:');
  console.log('='.repeat(50));
  console.log(`🎯 Total pipe products found: ${totalPipes}`);
  console.log(`✅ Pipes WITH valid images: ${validImageCount}`);
  console.log(`❌ Pipes WITHOUT images: ${invalidImageCount}`);
  console.log(`📊 Image coverage: ${((validImageCount / totalPipes) * 100).toFixed(1)}%`);

  console.log('\n🔍 SAMPLE RESULTS (first 10):');
  detailedResults.slice(0, 10).forEach((result, index) => {
    console.log(`${index + 1}. ${result.name}`);
    console.log(`   Brand: ${result.brand}`);
    console.log(`   Status: ${result.status}`);
    console.log('');
  });

  return {
    totalPipes,
    pipesWithValidImages: validImageCount,
    pipesWithoutImages: invalidImageCount,
    coveragePercentage: ((validImageCount / totalPipes) * 100).toFixed(1)
  };
}

// Run the analysis
countPipesWithValidImages()
  .then(result => {
    console.log('✅ Analysis complete!');
  })
  .catch(error => {
    console.error('❌ Analysis failed:', error);
  });
