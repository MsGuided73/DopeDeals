import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPipeImages() {
  console.log('Checking pipe products and their images...');

  const { data, error } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, brand_name')
    .or('name.ilike.%pipe%,name.ilike.%chillum%,name.ilike.%spoon%')
    .not('name', 'ilike', '%bowl%')
    .limit(10);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data.length} pipe products:`);
  data.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   Brand: ${product.brand_name || 'NULL'}`);
    console.log(`   Image URL: ${product.image_url || 'NULL'}`);
    console.log(`   Has valid image: ${!!(product.image_url && product.image_url.trim())}`);
    console.log('');
  });
}

checkPipeImages().catch(console.error);
