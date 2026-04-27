
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixCasing() {
  console.log('🚀 Starting deep database image URL casing fix (all products)...');

  let processed = 0;
  let fixCount = 0;
  const pageSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data: products, error } = await supabase
      .from('main_site_products')
      .select('id, name, image_url, image_urls')
      .not('image_url', 'is', null)
      .range(processed, processed + pageSize - 1);

    if (error) {
      console.error('Error fetching products:', error);
      break;
    }

    if (!products || products.length === 0) {
      hasMore = false;
      break;
    }

    console.log(`🔍 Checking batch: ${processed} to ${processed + products.length}...`);

    for (const product of products) {
      let needsUpdate = false;
      const updates = {};

      // Match /products/ case-insensitively but only replace if it's lowercase
      const regex = /\/products\//g;

      if (product.image_url && product.image_url.includes('/products/')) {
        // SPECIAL CASE: Ignore the products/products bucket/folder path for mushrooms if it's correct
        // Actually, let's just replace all /products/ with /PRODUCTS/ and then revert the mushroom one specifically if needed.
        // Or better: only replace if bucket is Highway420_assets
        if (product.image_url.includes('/Highway420_assets/')) {
            updates.image_url = product.image_url.replace(/\/products\//g, '/PRODUCTS/');
            needsUpdate = true;
        }
      }

      if (product.image_urls) {
        if (typeof product.image_urls === 'string' && product.image_urls.includes('/products/')) {
          if (product.image_urls.includes('/Highway420_assets/')) {
            updates.image_urls = product.image_urls.replace(/\/products\//g, '/PRODUCTS/');
            needsUpdate = true;
          }
        } else if (Array.isArray(product.image_urls)) {
          const newUrls = product.image_urls.map(url => {
            if (typeof url === 'string' && url.includes('/products/') && url.includes('/Highway420_assets/')) {
              return url.replace(/\/products\//g, '/PRODUCTS/');
            }
            return url;
          });
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
        }
      }
    }

    processed += products.length;
    if (products.length < pageSize) {
      hasMore = false;
    }
    console.log(`✅ Progress: ${processed} checked, ${fixCount} fixed.`);
  }

  console.log(`\n🎉 FINISHED! Total products fixed: ${fixCount}`);
}

fixCasing().catch(console.error);
