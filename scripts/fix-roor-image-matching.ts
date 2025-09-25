import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Available RooR images in your storage
const availableImages = {
  beakers: [
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-14-Beaker-50x5mm-Black-White.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Beaker-50x5mm-Flame-Polish.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Beaker-50x5mm-Flame-Polish-2.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-PD-Classic-18-Beaker-45x5mm-White-No-Ice-Pinches.webp'
  ],
  straightTubes: [
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-14-Color-Straight-50x5mm-Mint.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-14-Straight-45x5mm-Tie-Dye.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Straight-45x5mm-White-Red.webp',
    'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp'
  ]
};

function categorizeProduct(name: string): 'beaker' | 'straight' | 'ash-catcher' | 'other' {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('beaker') || lowerName.includes('zeaker')) {
    return 'beaker';
  }
  if (lowerName.includes('straight') && lowerName.includes('tube')) {
    return 'straight';
  }
  if (lowerName.includes('ash') && lowerName.includes('catcher')) {
    return 'ash-catcher';
  }
  return 'other';
}

function getAppropriateImage(productName: string, currentImage: string): string {
  const category = categorizeProduct(productName);
  
  // If current image is already appropriate, keep it
  const currentImageLower = currentImage.toLowerCase();
  
  switch (category) {
    case 'beaker':
      // If current image is a beaker image, keep it
      if (currentImageLower.includes('beaker')) {
        return currentImage;
      }
      // Otherwise assign a random beaker image
      return availableImages.beakers[Math.floor(Math.random() * availableImages.beakers.length)];
      
    case 'straight':
      // If current image is a straight tube image, keep it
      if (currentImageLower.includes('straight')) {
        return currentImage;
      }
      // Otherwise assign a random straight tube image
      return availableImages.straightTubes[Math.floor(Math.random() * availableImages.straightTubes.length)];
      
    case 'ash-catcher':
      // For ash catchers, we don't have specific ash catcher images
      // So we'll use a generic beaker image (most appropriate)
      return availableImages.beakers[0]; // Use the first beaker image
      
    default:
      // For other products, keep current image or use a beaker
      return currentImage.includes('supabase') ? currentImage : availableImages.beakers[0];
  }
}

async function fixRoorImageMatching() {
  console.log('🔧 Fixing RooR product image matching...\n');
  
  try {
    // Get all RooR products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, image_url')
      .or('name.ilike.%roor%,brand_name.ilike.%roor%,sku.ilike.%roor%')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);
      
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log(`Found ${products?.length || 0} RooR products to check\n`);
    
    const updates = [];
    
    for (const product of products || []) {
      const currentImage = product.image_url;
      const appropriateImage = getAppropriateImage(product.name, currentImage);
      
      if (currentImage !== appropriateImage) {
        updates.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          oldImage: currentImage,
          newImage: appropriateImage
        });
        
        console.log(`🔄 ${product.name} (${product.sku})`);
        console.log(`   Category: ${categorizeProduct(product.name)}`);
        console.log(`   Old: ${currentImage?.substring(currentImage.lastIndexOf('/') + 1) || 'None'}`);
        console.log(`   New: ${appropriateImage.substring(appropriateImage.lastIndexOf('/') + 1)}`);
        console.log('');
      } else {
        console.log(`✅ ${product.name} - Image already appropriate`);
      }
    }
    
    if (updates.length === 0) {
      console.log('\n🎉 All RooR products already have appropriate images!');
      return;
    }
    
    console.log(`\n📊 Summary: ${updates.length} products need image updates`);
    console.log('\n⚠️  This script identified the mismatches but did not update them.');
    console.log('To apply the updates, uncomment the update code below and run again.');
    
    // Apply the updates:
    console.log('\n🚀 Applying updates...');

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: update.newImage })
        .eq('id', update.id);

      if (updateError) {
        console.error(`❌ Failed to update ${update.name}:`, updateError);
      } else {
        console.log(`✅ Updated ${update.name}`);
      }
    }

    console.log('\n🎉 All updates completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixRoorImageMatching().catch(console.error);
