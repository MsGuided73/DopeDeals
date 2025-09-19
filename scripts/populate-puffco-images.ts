import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Real Puffco product images from various online sources
const puffcoImages = {
  'PUFFCO PEAK PRO': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/PeakPro_Opal_Angle_1024x1024.png',
  'PUFFCO PEAK PRO 3D CHAMBER': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/3DChamber_PeakPro_Angle_1024x1024.png',
  'PUFFCO PEAK PRO CHAMBER': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/Chamber_PeakPro_Angle_1024x1024.png',
  'PUFFCO TRAVEL GLASS PEAK': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/TravelGlass_Peak_Angle_1024x1024.png'
};

async function populatePuffcoImages() {
  console.log('🖼️ Populating missing Puffco product images...\n');
  
  // Get products without images
  const { data: products } = await supabase
    .from('products')
    .select('id, name, sku, image_url')
    .eq('brand_name', 'Puffco')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .is('image_url', null);
    
  if (!products || products.length === 0) {
    console.log('✅ All Puffco products already have images!');
    return;
  }
  
  console.log(`Found ${products.length} Puffco products without images:`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const product of products) {
    const imageUrl = puffcoImages[product.name as keyof typeof puffcoImages];
    
    if (imageUrl) {
      console.log(`📸 Adding image for: ${product.name}`);
      
      const { error } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', product.id);
        
      if (error) {
        console.error(`❌ Error updating ${product.name}:`, error.message);
        skipped++;
      } else {
        console.log(`✅ Updated: ${product.name}`);
        updated++;
      }
    } else {
      console.log(`⚠️ No image mapping found for: ${product.name}`);
      skipped++;
    }
  }
  
  console.log(`\n📊 RESULTS:`);
  console.log(`✅ Updated: ${updated} products`);
  console.log(`⚠️ Skipped: ${skipped} products`);
  
  // Verify results
  const { data: updatedProducts } = await supabase
    .from('products')
    .select('id, name, image_url')
    .eq('brand_name', 'Puffco')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);
    
  const withImages = updatedProducts?.filter(p => p.image_url).length || 0;
  const total = updatedProducts?.length || 0;
  
  console.log(`\n🎯 FINAL STATUS:`);
  console.log(`Total Puffco products: ${total}`);
  console.log(`Products with images: ${withImages}/${total}`);
  console.log(`Coverage: ${Math.round((withImages / total) * 100)}%`);
}

populatePuffcoImages();
