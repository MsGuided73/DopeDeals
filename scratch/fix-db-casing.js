
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixCasing() {
  console.log('🚀 Starting database image URL casing fix...');

  // Fetch all active products that have image data
  const { data: products, error } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, image_urls')
    .not('image_url', 'is', null);

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`🔍 Checking ${products.length} products for casing issues.`);

  let fixCount = 0;
  for (const product of products) {
    let needsUpdate = false;
    const updates = {};

    if (product.image_url && product.image_url.includes('/products/')) {
      updates.image_url = product.image_url.replace(/\/products\//g, '/PRODUCTS/');
      needsUpdate = true;
    }

    if (product.image_urls) {
      if (typeof product.image_urls === 'string' && product.image_urls.includes('/products/')) {
        updates.image_urls = product.image_urls.replace(/\/products\//g, '/PRODUCTS/');
        needsUpdate = true;
      } else if (Array.isArray(product.image_urls)) {
        const newUrls = product.image_urls.map(url => 
          typeof url === 'string' ? url.replace(/\/products\//g, '/PRODUCTS/') : url
        );
        if (JSON.stringify(newUrls) !== JSON.stringify(product.image_urls)) {
          updates.image_urls = newUrls;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('main_site_products')
        .update(updates)
        .eq('id', product.id);

      if (updateError) {
        console.error(`❌ Failed to update product ${product.id}:`, updateError);
      } else {
        fixCount++;
        // console.log(`✅ Fixed product: ${product.name}`);
      }
    }
  }

  console.log(`\n🎉 FINISHED! Total products fixed: ${fixCount}`);
}

fixCasing().catch(console.error);
