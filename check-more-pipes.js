import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMorePipes() {
  console.log('Checking more pipe products for image data...');

  const { data, error } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, image_urls, brand_name')
    .or('name.ilike.%pipe%,name.ilike.%chillum%,name.ilike.%spoon%')
    .not('name', 'ilike', '%bowl%')
    .not('name', 'ilike', '%water%')
    .limit(20);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data.length} pipe products:`);

  let withImages = 0;
  let withoutImages = 0;

  data.forEach((product, index) => {
    const hasImage = !!(product.image_url && product.image_url.trim());
    const hasImageUrls = !!(product.image_urls && product.image_urls.trim());

    if (hasImage || hasImageUrls) {
      withImages++;
      console.log(`✅ ${product.name}`);
      console.log(`   Brand: ${product.brand_name || 'NULL'}`);
      console.log(`   image_url: ${product.image_url || 'NULL'}`);
      console.log(`   image_urls: ${product.image_urls || 'NULL'}`);
    } else {
      withoutImages++;
      console.log(`❌ ${product.name}`);
      console.log(`   Brand: ${product.brand_name || 'NULL'}`);
      console.log(`   image_url: ${product.image_url || 'NULL'}`);
      console.log(`   image_urls: ${product.image_urls || 'NULL'}`);
    }
    console.log('');
  });

  console.log(`Summary: ${withImages} with images, ${withoutImages} without images`);
}

checkMorePipes().catch(console.error);
