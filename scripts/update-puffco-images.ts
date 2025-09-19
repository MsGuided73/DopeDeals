import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Real Puffco product images from official and retailer sources
const puffcoImages = {
  'PUFFCO PEAK PRO': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/PeakPro_Opal_Angle_1024x1024.png',
  'PUFFCO PEAK PRO 3D CHAMBER': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/3DChamber_PeakPro_Angle_1024x1024.png',
  'PUFFCO PEAK PRO CHAMBER': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/Chamber_PeakPro_Angle_1024x1024.png',
  'PUFFCO TRAVEL GLASS PEAK': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/TravelGlass_Peak_Angle_1024x1024.png',
  'PUFFCO PEAK PRO TRAVEL PACK - DESERT': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/TravelPack_PeakPro_Desert_Angle_1024x1024.png',
  'PUFFCO PEAK PRO TRAVEL PACK - GUARDIAN': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/TravelPack_PeakPro_Guardian_Angle_1024x1024.png',
  'PUFFCO PROXY 3D CHAMBER': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/3DChamber_Proxy_Angle_1024x1024.png',
  'PUFFCO PROXY BUB BLACK': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/ProxyBub_Black_Angle_1024x1024.png',
  'PUFFCO PROXY BUB BLOOM': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/ProxyBub_Bloom_Angle_1024x1024.png',
  'PUFFCO PROXY BUB DESERT': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/ProxyBub_Desert_Angle_1024x1024.png',
  'PUFFCO PROXY TRAVEL PACK - DESERT': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/TravelPack_Proxy_Desert_Angle_1024x1024.png',
  'PUFFCO TRAVEL GLASS PEAK PRO': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/TravelGlass_PeakPro_Angle_1024x1024.png',
  'PUFFCO TRAVEL GLASS PEAK PRO GUARDIAN': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/TravelGlass_PeakPro_Guardian_Angle_1024x1024.png',
  'PUFFCO VISION PLUS CHAMBER': 'https://cdn.shopify.com/s/files/1/0277/4270/8029/products/Chamber_VisionPlus_Angle_1024x1024.png'
};

async function updatePuffcoImages() {
  console.log('🖼️ Updating Puffco product images with real product photos...\n');
  
  // Get all Puffco products
  const { data: products } = await supabase
    .from('products')
    .select('id, name, sku, image_url')
    .eq('brand_name', 'Puffco')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false)
    .order('name');
    
  if (!products || products.length === 0) {
    console.log('❌ No Puffco products found!');
    return;
  }
  
  console.log(`Found ${products.length} Puffco products:`);
  
  let updated = 0;
  let skipped = 0;
  let alreadyGood = 0;
  
  for (const product of products) {
    const newImageUrl = puffcoImages[product.name as keyof typeof puffcoImages];
    
    if (newImageUrl) {
      // Check if it's already using a good image (not unsplash)
      if (product.image_url && !product.image_url.includes('unsplash.com')) {
        console.log(`✅ ${product.name} - Already has good image`);
        alreadyGood++;
        continue;
      }
      
      console.log(`📸 Updating image for: ${product.name}`);
      console.log(`   Old: ${product.image_url || 'None'}`);
      console.log(`   New: ${newImageUrl}`);
      
      const { error } = await supabase
        .from('products')
        .update({ image_url: newImageUrl })
        .eq('id', product.id);
        
      if (error) {
        console.error(`❌ Error updating ${product.name}:`, error.message);
        skipped++;
      } else {
        console.log(`✅ Updated: ${product.name}\n`);
        updated++;
      }
    } else {
      console.log(`⚠️ No image mapping found for: ${product.name}`);
      skipped++;
    }
  }
  
  console.log(`📊 RESULTS:`);
  console.log(`✅ Updated: ${updated} products`);
  console.log(`✅ Already good: ${alreadyGood} products`);
  console.log(`⚠️ Skipped: ${skipped} products`);
  
  // Verify final results
  const { data: finalProducts } = await supabase
    .from('products')
    .select('id, name, image_url')
    .eq('brand_name', 'Puffco')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);
    
  const withImages = finalProducts?.filter(p => p.image_url).length || 0;
  const total = finalProducts?.length || 0;
  const realImages = finalProducts?.filter(p => p.image_url && !p.image_url.includes('unsplash.com')).length || 0;
  
  console.log(`\n🎯 FINAL STATUS:`);
  console.log(`Total Puffco products: ${total}`);
  console.log(`Products with images: ${withImages}/${total}`);
  console.log(`Products with real images: ${realImages}/${total}`);
  console.log(`Real image coverage: ${Math.round((realImages / total) * 100)}%`);
}

updatePuffcoImages();
