import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Premium image sources that match DOPE CITY's aesthetic
const PREMIUM_IMAGE_SOURCES = {
  puffco: {
    'PEAK PRO': [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Premium vaporizer
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // Sleek device
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'  // Modern tech
    ],
    'PROXY': [
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80', // Portable device
      'https://images.unsplash.com/photo-1573883430930-b2b2e3b8e3b8?w=800&q=80', // Compact tech
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'  // Premium portable
    ],
    'CHAMBER': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80', // Precision parts
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80', // Tech components
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'  // Premium accessories
    ],
    'TRAVEL': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', // Travel accessories
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80', // Portable gear
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'  // Travel tech
    ],
    'GLASS': [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Glass accessories
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80', // Premium glass
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'  // Clear glass
    ]
  },
  generic: {
    'PREMIUM': [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80'
    ]
  }
};

function getProductImageCategory(productName: string): string {
  const name = productName.toUpperCase();
  
  if (name.includes('PEAK PRO') || name.includes('PEAK')) return 'PEAK PRO';
  if (name.includes('PROXY')) return 'PROXY';
  if (name.includes('CHAMBER') || name.includes('ATOMIZER')) return 'CHAMBER';
  if (name.includes('TRAVEL')) return 'TRAVEL';
  if (name.includes('GLASS')) return 'GLASS';
  
  return 'PREMIUM';
}

function selectBestImage(productName: string, sku: string): string {
  const category = getProductImageCategory(productName);
  const brand = productName.toUpperCase().includes('PUFFCO') ? 'puffco' : 'generic';
  
  // Get images for this category
  const categoryImages = PREMIUM_IMAGE_SOURCES[brand]?.[category] || PREMIUM_IMAGE_SOURCES.generic.PREMIUM;
  
  // Use SKU hash to consistently select the same image for the same product
  const skuHash = sku ? sku.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
  const imageIndex = skuHash % categoryImages.length;
  
  return categoryImages[imageIndex];
}

async function syncPremiumProductImages() {
  console.log('🎨 DOPE CITY Premium Image Sync\n');
  console.log('Finding stunning images that match our premium aesthetic...\n');

  try {
    // Get products that need better images
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, image_url, brand_name, price')
      .or('image_url.is.null,image_url.eq.,image_url.like.%placehold%,image_url.like.%Lost-Mary%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .order('brand_name', { ascending: true })
      .order('price', { ascending: false });

    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }

    console.log(`🔍 Found ${products?.length || 0} products needing premium images\n`);

    if (!products || products.length === 0) {
      console.log('✅ All products already have great images!');
      return;
    }

    let updated = 0;
    let failed = 0;

    for (const product of products) {
      try {
        console.log(`🎯 Processing: ${product.name}`);
        console.log(`   Brand: ${product.brand_name || 'Generic'}`);
        console.log(`   Price: $${product.price || 'N/A'}`);
        console.log(`   Current image: ${product.image_url ? 'Has image (needs upgrade)' : 'No image'}`);

        // Select the perfect image for this product
        const newImageUrl = selectBestImage(product.name, product.sku);
        
        console.log(`   🎨 Selected premium image: ${newImageUrl.substring(0, 60)}...`);

        // Update the product with the new image
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: newImageUrl })
          .eq('id', product.id);

        if (updateError) {
          console.log(`   ❌ Failed to update: ${updateError.message}`);
          failed++;
        } else {
          console.log(`   ✅ Updated with premium image`);
          updated++;
        }

        console.log('');

      } catch (error) {
        console.log(`   ❌ Error processing ${product.name}:`, error);
        failed++;
      }
    }

    console.log('🎉 PREMIUM IMAGE SYNC COMPLETE!');
    console.log(`✅ Products updated: ${updated}`);
    console.log(`❌ Failed updates: ${failed}`);
    console.log(`📊 Total processed: ${products.length}`);
    
    if (updated > 0) {
      console.log('\n🔥 Your products now have stunning, professional images');
      console.log('that perfectly match the DOPE CITY premium aesthetic!');
    }

  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Run the sync
const args = process.argv.slice(2);
const shouldApply = args.includes('--apply');

if (!shouldApply) {
  console.log('🔍 DRY RUN MODE - Add --apply flag to execute changes');
  console.log('This will find and apply premium images for products that:');
  console.log('- Have no images');
  console.log('- Have placeholder images');
  console.log('- Have incorrect images (like the Lost Mary vape on Peak Pro)');
  console.log('- Need aesthetic upgrades');
  console.log('\nImages will be:');
  console.log('✨ High-quality and professional');
  console.log('🎯 Matched to product categories');
  console.log('🔥 Consistent with DOPE CITY premium vibe');
  console.log('\nRun: npx tsx scripts/sync-premium-product-images.ts --apply');
} else {
  syncPremiumProductImages();
}
