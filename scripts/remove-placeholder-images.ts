import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define what constitutes a placeholder image
const PLACEHOLDER_PATTERNS = [
  'unsplash.com',
  'placehold.co',
  'placeholder.com',
  'placeholder',
  'Lost-Mary', // Specific placeholder pattern found in scripts
  'images.unsplash.com',
  'via.placeholder.com',
  'picsum.photos',
  'lorempixel.com',
  'dummyimage.com'
];

async function removePlaceholderImages() {
  console.log('🧹 Removing placeholder images from all products...\n');
  
  try {
    // 1. Find all products with placeholder images
    console.log('🔍 Scanning for products with placeholder images...');
    
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, sku, image_url, image_urls, brand_name')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (fetchError) {
      throw new Error(`Error fetching products: ${fetchError.message}`);
    }

    console.log(`📊 Analyzing ${allProducts?.length || 0} products...`);

    // 2. Identify products with placeholder images
    const productsWithPlaceholders = [];
    const productsWithMultiplePlaceholders = [];

    for (const product of allProducts || []) {
      let hasPlaceholderMain = false;
      let hasPlaceholderAdditional = false;
      let placeholderCount = 0;

      // Check main image_url
      if (product.image_url) {
        const isPlaceholder = PLACEHOLDER_PATTERNS.some(pattern => 
          product.image_url.toLowerCase().includes(pattern.toLowerCase())
        );
        if (isPlaceholder) {
          hasPlaceholderMain = true;
          placeholderCount++;
        }
      }

      // Check additional image_urls array
      if (product.image_urls && Array.isArray(product.image_urls)) {
        const placeholderAdditional = product.image_urls.filter(url => 
          url && PLACEHOLDER_PATTERNS.some(pattern => 
            url.toLowerCase().includes(pattern.toLowerCase())
          )
        );
        if (placeholderAdditional.length > 0) {
          hasPlaceholderAdditional = true;
          placeholderCount += placeholderAdditional.length;
        }
      }

      if (hasPlaceholderMain || hasPlaceholderAdditional) {
        const productInfo = {
          ...product,
          hasPlaceholderMain,
          hasPlaceholderAdditional,
          placeholderCount
        };

        productsWithPlaceholders.push(productInfo);

        if (placeholderCount > 1) {
          productsWithMultiplePlaceholders.push(productInfo);
        }
      }
    }

    console.log(`\n📋 PLACEHOLDER IMAGE ANALYSIS:`);
    console.log(`   🔄 Products with placeholder images: ${productsWithPlaceholders.length}`);
    console.log(`   📸 Products with multiple placeholders: ${productsWithMultiplePlaceholders.length}`);
    console.log(`   ✅ Products with real/no images: ${(allProducts?.length || 0) - productsWithPlaceholders.length}`);

    if (productsWithPlaceholders.length === 0) {
      console.log('\n🎉 No placeholder images found! All products are clean.');
      return;
    }

    // 3. Show sample of products that will be affected
    console.log(`\n📝 SAMPLE PRODUCTS TO BE CLEANED (showing first 10):`);
    productsWithPlaceholders.slice(0, 10).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Brand: ${product.brand_name || 'Unknown'}`);
      console.log(`   SKU: ${product.sku || 'N/A'}`);
      console.log(`   Main image placeholder: ${product.hasPlaceholderMain ? '❌ Yes' : '✅ No'}`);
      console.log(`   Additional placeholders: ${product.hasPlaceholderAdditional ? `❌ Yes (${product.placeholderCount - (product.hasPlaceholderMain ? 1 : 0)})` : '✅ No'}`);
      console.log('');
    });

    // 4. Perform the cleanup
    console.log(`\n🧹 CLEANING PLACEHOLDER IMAGES...`);
    
    let updated = 0;
    let failed = 0;

    for (const product of productsWithPlaceholders) {
      try {
        const updateData: any = {};

        // Remove main placeholder image
        if (product.hasPlaceholderMain) {
          updateData.image_url = null;
        }

        // Clean additional images array
        if (product.hasPlaceholderAdditional && product.image_urls) {
          const cleanedUrls = product.image_urls.filter(url => 
            url && !PLACEHOLDER_PATTERNS.some(pattern => 
              url.toLowerCase().includes(pattern.toLowerCase())
            )
          );
          updateData.image_urls = cleanedUrls.length > 0 ? cleanedUrls : null;
        }

        // Update the product
        const { error: updateError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', product.id);

        if (updateError) {
          console.log(`❌ Failed to clean ${product.name}: ${updateError.message}`);
          failed++;
        } else {
          console.log(`✅ Cleaned ${product.name} (removed ${product.placeholderCount} placeholder${product.placeholderCount > 1 ? 's' : ''})`);
          updated++;
        }

      } catch (error) {
        console.log(`❌ Error cleaning ${product.name}:`, error);
        failed++;
      }
    }

    // 5. Summary
    console.log(`\n📊 CLEANUP RESULTS:`);
    console.log(`   ✅ Successfully cleaned: ${updated} products`);
    console.log(`   ❌ Failed to clean: ${failed} products`);
    console.log(`   📈 Success rate: ${updated > 0 ? ((updated / (updated + failed)) * 100).toFixed(1) : 0}%`);

    if (updated > 0) {
      console.log(`\n🎉 Cleanup complete! ${updated} products now have clean image data.`);
      console.log(`   Products without images will show no image instead of placeholders.`);
      console.log(`   Consider running image sync scripts to add real product images.`);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the cleanup
const args = process.argv.slice(2);
const shouldApply = args.includes('--apply');

if (!shouldApply) {
  console.log('🔍 DRY RUN MODE - Add --apply flag to execute changes');
  console.log('This would remove placeholder images from products and set them to null.');
  console.log('Products will show no image instead of generic placeholders.');
  console.log('\nRun: npx tsx scripts/remove-placeholder-images.ts --apply');
} else {
  removePlaceholderImages();
}

export { removePlaceholderImages };
