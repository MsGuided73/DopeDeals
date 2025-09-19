import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyzeCraveProducts() {
  console.log('🔍 Analyzing Crave brand products...\n');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, description, short_description, image_url, price, nicotine_product, tobacco_product, brand_name, zoho_category_name, tags')
    .or('name.ilike.%crave%,brand_name.ilike.%crave%,sku.ilike.%crave%')
    .eq('is_active', true)
    .order('name');
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`📊 Found ${products?.length || 0} Crave products\n`);
  
  let withImages = 0;
  let withDescriptions = 0;
  let nicotineProducts = 0;
  let cleanProducts = 0;
  
  products?.forEach((product, i) => {
    const hasImage = product.image_url && product.image_url.trim() !== '';
    const hasDescription = product.description && product.description.length > 50;
    const hasNicotine = product.nicotine_product ||
                       product.tobacco_product ||
                       product.tags?.some((tag: string) => tag.toLowerCase().includes('nicotine'));
    
    if (hasImage) withImages++;
    if (hasDescription) withDescriptions++;
    if (hasNicotine) nicotineProducts++;
    else cleanProducts++;
    
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   SKU: ${product.sku || 'N/A'}`);
    console.log(`   Brand: ${product.brand_name || 'Unknown'}`);
    console.log(`   Price: $${product.price || 0}`);
    console.log(`   Image: ${hasImage ? '✅ Yes' : '❌ No'}`);
    console.log(`   Description: ${hasDescription ? '✅ Good' : '❌ Missing/Short'}`);
    console.log(`   Tags: ${product.tags?.join(', ') || 'N/A'}`);
    console.log(`   Nicotine: ${hasNicotine ? '⚠️ YES - EXCLUDE' : '✅ Clean'}`);
    console.log('');
  });
  
  console.log('📈 CRAVE BRAND SUMMARY:');
  console.log(`   📦 Total products: ${products?.length || 0}`);
  console.log(`   ✅ Clean products (no nicotine): ${cleanProducts}`);
  console.log(`   ⚠️ Nicotine products (exclude): ${nicotineProducts}`);
  console.log(`   🖼️ Products with images: ${withImages}`);
  console.log(`   📝 Products with good descriptions: ${withDescriptions}`);
  console.log(`   🔧 Products needing work: ${cleanProducts - Math.min(withImages, withDescriptions)}`);
}

analyzeCraveProducts();
