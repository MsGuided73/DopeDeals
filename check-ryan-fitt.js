import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRyanFitt() {
  console.log('Checking for Ryan Fitt products in database...');

  const { data, error } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, image_urls')
    .ilike('name', '%ryan%fitt%')
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Ryan Fitt products found:', data?.length || 0);
  data?.forEach(product => {
    console.log('Product ID:', product.id);
    console.log('Product Name:', product.name);
    console.log('Image URL:', product.image_url);
    console.log('Image URLs array:', product.image_urls);
    console.log('---');
  });

  // Also check for puffco products
  console.log('\nChecking for Puffco products...');
  const { data: puffcoData, error: puffcoError } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, image_urls')
    .ilike('name', '%puffco%')
    .limit(5);

  if (puffcoError) {
    console.error('Puffco Error:', puffcoError);
    return;
  }

  console.log('Puffco products found:', puffcoData?.length || 0);
  puffcoData?.forEach(product => {
    console.log('Product ID:', product.id);
    console.log('Product Name:', product.name);
    console.log('Image URL:', product.image_url);
    console.log('Image URLs array:', product.image_urls);
    console.log('---');
  });
}

checkRyanFitt().catch(console.error);
