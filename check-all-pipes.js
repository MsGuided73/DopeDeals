import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllPipes() {
  console.log('Checking ALL potential pipe products (no filters)...');

  // First, let's see what the current API query finds
  const { data: currentQuery, error: currentError } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, image_urls, brand_name')
    .or('name.ilike.%pipe%,name.ilike.%chillum%,name.ilike.%spoon%,name.ilike.%sherlock%,name.ilike.%one hitter%,name.ilike.%hand pipe%')
    .not('name', 'ilike', '%bowl%')
    .not('name', 'ilike', '%water pipe%')
    .not('name', 'ilike', '%water pipes%')
    .limit(50);

  if (currentError) {
    console.error('Error with current query:', currentError);
    return;
  }

  console.log(`\n=== CURRENT API QUERY RESULTS ===`);
  console.log(`Found ${currentQuery.length} products`);

  let withImages = 0;
  let withoutImages = 0;

  currentQuery.forEach((product, index) => {
    const hasImage = !!(product.image_url && product.image_url.trim());
    if (hasImage) {
      withImages++;
      console.log(`✅ ${product.name} - ${product.image_url}`);
    } else {
      withoutImages++;
      console.log(`❌ ${product.name} - NULL`);
    }
  });

  console.log(`\nSummary: ${withImages} with images, ${withoutImages} without images`);

  // Now let's try a broader search to see if we're missing products
  console.log(`\n=== BROADER SEARCH (just 'pipe' in name) ===`);
  const { data: broadQuery, error: broadError } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, brand_name')
    .ilike('name', '%pipe%')
    .limit(50);

  if (broadError) {
    console.error('Error with broad query:', broadError);
    return;
  }

  console.log(`Found ${broadQuery.length} products with 'pipe' in name`);

  broadQuery.forEach((product, index) => {
    const hasImage = !!(product.image_url && product.image_url.trim());
    if (hasImage) {
      console.log(`✅ ${product.name} - ${product.image_url}`);
    } else {
      console.log(`❌ ${product.name} - NULL`);
    }
  });
}

checkAllPipes().catch(console.error);
