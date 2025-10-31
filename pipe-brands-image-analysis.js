import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzePipeBrands() {
  console.log('🔍 Analyzing pipe products by brand - which brands need images most...');

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

  console.log(`📊 Processing ${data?.length || 0} pipe products...`);

  // Analyze by brand
  const brandStats = {};
  let totalPipes = 0;

  (data || []).forEach((product) => {
    const brand = product.brand_name || 'Unknown';

    if (!brandStats[brand]) {
      brandStats[brand] = {
        total: 0,
        withImages: 0,
        withoutImages: 0,
        products: []
      };
    }

    brandStats[brand].total++;

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

    if (hasValidImage || hasMultipleImages) {
      brandStats[brand].withImages++;
    } else {
      brandStats[brand].withoutImages++;
      brandStats[brand].products.push(product.name);
    }

    totalPipes++;
  });

  // Calculate coverage and sort by brands needing most images
  const brandAnalysis = Object.entries(brandStats)
    .map(([brand, stats]) => ({
      brand,
      ...stats,
      coverage: stats.total > 0 ? ((stats.withImages / stats.total) * 100).toFixed(1) : '0.0',
      imagesNeeded: stats.withoutImages,
      priority: stats.withoutImages // Higher numbers = higher priority
    }))
    .filter(brand => brand.total > 0) // Only show brands that actually have products
    .sort((a, b) => b.priority - a.priority); // Sort by images needed

  console.log('\n📊 BRAND-BY-BRAND IMAGE ANALYSIS:');
  console.log('='.repeat(80));
  console.log(`Total brands with pipe products: ${brandAnalysis.length}`);
  console.log('Sorted by: Images needed (priority)');
  console.log('');

  console.log('🏆 TOP 15 BRANDS MOST IN NEED OF IMAGES:');
  console.log('-'.repeat(80));

  brandAnalysis.slice(0, 15).forEach((brand, index) => {
    const priority = brand.priority > 20 ? '🔴 CRITICAL' :
                    brand.priority > 10 ? '🟡 HIGH' :
                    brand.priority > 5 ? '🟠 MEDIUM' :
                    brand.priority > 0 ? '🟢 LOW' : '';
    console.log(`${index + 1}. ${brand.brand} - ${priority}`);
    console.log(`   📦 Total pipes: ${brand.total}`);
    console.log(`   ✅ With images: ${brand.withImages}`);
    console.log(`   ❌ Need images: ${brand.withoutImages}`);
    console.log(`   📊 Coverage: ${brand.coverage}%`);

    if (brand.products.length > 0 && brand.products.length <= 10) {
      console.log(`   🖼️  Missing images for: ${brand.products.slice(0, 5).join(', ')}${brand.products.length > 5 ? `... (+${brand.products.length - 5} more)` : ''}`);
    }
    console.log('');
  });

  // Summary of high priority brands
  const criticalBrands = brandAnalysis.filter(brand => brand.priority > 20);
  const highPriorityBrands = brandAnalysis.filter(brand => brand.priority > 10);

  console.log('\n🚨 CRITICAL PRIORITY BRANDS (>20 pipes without images):');
  console.log('-'.repeat(60));
  criticalBrands.forEach((brand) => {
    console.log(`🔴 ${brand.brand}: ${brand.withoutImages} pipes need images`);
  });

  console.log('\n⚠️  HIGH PRIORITY BRANDS (>10 pipes without images):');
  console.log('-'.repeat(60));
  highPriorityBrands.slice(0, 10).forEach((brand) => {
    console.log(`🟡 ${brand.brand}: ${brand.withoutImages} pipes need images`);
  });

  console.log('\n💡 RECOMMENDATION:');
  console.log(`Focus image sourcing on the ${criticalBrands.length} critical brands first.`);
  console.log(`They represent ${criticalBrands.reduce((sum, b) => sum + b.withoutImages, 0)} individual pipes that could be added to your pipes page.`);

  return brandAnalysis;
}

analyzePipeBrands().catch(console.error);
