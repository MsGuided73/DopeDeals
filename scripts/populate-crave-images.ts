import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CraveProduct {
  id: string;
  name: string;
  sku: string;
  image_url?: string;
  price: number;
}

// Common Crave product image patterns based on SKU and name
const IMAGE_PATTERNS = {
  // Disposables
  'CRAVE MAX': 'https://sigdistro.com/images/crave-max-2500-puff-disposable.jpg',
  'CRAVE BC7000': 'https://sigdistro.com/images/crave-bc7000-7000-puff-disposable.jpg',
  'CRAVE MEGA': 'https://sigdistro.com/images/crave-mega-5500-puff-disposable.jpg',
  'CRAVE TURBO': 'https://sigdistro.com/images/crave-turbo-20000-puff-disposable.jpg',
  
  // Batteries and Accessories
  'BATTERY': 'https://sigdistro.com/images/crave-battery-display.jpg',
  'CHARGER': 'https://sigdistro.com/images/crave-usb-charger.jpg',
  'GRINDER': 'https://sigdistro.com/images/crave-grinder-4-piece.jpg',
  
  // Hand Pipes
  'HAND PIPE': 'https://sigdistro.com/images/crave-hand-pipe-glass.jpg',
  
  // Cannabis Products
  'THCA': 'https://sigdistro.com/images/crave-thca-preroll.jpg',
  'PREROLL': 'https://sigdistro.com/images/crave-preroll-shorties.jpg',
  'CART': 'https://sigdistro.com/images/crave-resin-cartridge.jpg',
};

function findImageForProduct(product: CraveProduct): string | null {
  const name = product.name.toUpperCase();
  const sku = product.sku.toUpperCase();
  
  // Check for specific product patterns
  for (const [pattern, imageUrl] of Object.entries(IMAGE_PATTERNS)) {
    if (name.includes(pattern) || sku.includes(pattern)) {
      return imageUrl;
    }
  }
  
  // Fallback based on product type
  if (name.includes('PUFF') || name.includes('DISPOSABLE')) {
    return IMAGE_PATTERNS['CRAVE MAX']; // Generic disposable image
  }
  
  if (name.includes('BATTERY') || name.includes('MOD')) {
    return IMAGE_PATTERNS['BATTERY'];
  }
  
  if (name.includes('PIPE')) {
    return IMAGE_PATTERNS['HAND PIPE'];
  }
  
  if (name.includes('THCA') || name.includes('PREROLL')) {
    return IMAGE_PATTERNS['THCA'];
  }
  
  return null;
}

async function populateCraveImages() {
  console.log('🖼️ Populating Crave product images...\n');
  
  // Get clean Crave products without images
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, image_url, price')
    .or('name.ilike.%crave%,brand_name.ilike.%crave%,sku.ilike.%crave%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .is('image_url', null)
    .order('name');
    
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📊 Found ${products?.length || 0} Crave products without images\n`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const product of products || []) {
    const imageUrl = findImageForProduct(product);
    
    if (!imageUrl) {
      console.log(`⏭️ No image pattern found for: ${product.name}`);
      skipped++;
      continue;
    }
    
    console.log(`🖼️ Adding image to: ${product.name}`);
    console.log(`   Image: ${imageUrl}`);
    
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`❌ Error updating ${product.name}:`, updateError);
        continue;
      }
      
      console.log(`✅ Updated ${product.name}\n`);
      updated++;
      
    } catch (error) {
      console.error(`❌ Error processing ${product.name}:`, error);
    }
  }
  
  console.log('\n📈 IMAGE POPULATION SUMMARY:');
  console.log(`   ✅ Products updated with images: ${updated}`);
  console.log(`   ⏭️ Products skipped (no pattern): ${skipped}`);
  console.log(`   📦 Total processed: ${updated + skipped}`);
}

// Run the function
populateCraveImages();
