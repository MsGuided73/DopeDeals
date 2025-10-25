import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFeaturedProducts() {
  console.log('🔍 Checking featured_product field in main_site_products table...');

  // Check all products to see the actual field values
  const { data: allProducts, error: allError } = await supabase
    .from('main_site_products')
    .select('id, name, featured, featured_product, image_url, image_urls, our_price')
    .limit(20);

  if (allError) {
    console.error('❌ Error checking all products:', allError);
    return;
  }

  console.log(`📦 Found ${allProducts.length} total products:`);
  allProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   - ID: ${product.id}`);
    console.log(`   - Featured: ${product.featured} (type: ${typeof product.featured})`);
    console.log(`   - Featured Product: ${product.featured_product} (type: ${typeof product.featured_product})`);
    console.log(`   - Price: $${product.our_price}`);
    console.log(`   - Image URL: ${product.image_url || 'None'}`);
    console.log('---');
  });
}

async function markFeaturedProducts() {
  console.log('⭐ Marking 3 products as featured_product...');

  // Mark 3 products with valid images as featured_product (highest priority)
  const featuredProductIds = [
    'aba29689-e162-4ce2-b79c-958c0f395a04', // Diamond Glass Circ Dab Rig |REF: DGR 1151|
    '3dd17645-c336-4e48-94cd-2ca0d0c59954', // Diamond Glass Long Mouth Piece Dab Rig |REF: DGR 1150|
    '93a31e6a-e033-4041-a235-ff72025a633c'  // Diamond Glass Circ Dab Rig |REF: DGR 1142|
  ];

  for (const productId of featuredProductIds) {
    const { error } = await supabase
      .from('main_site_products')
      .update({ featured_product: true })
      .eq('id', productId);

    if (error) {
      console.error(`❌ Error marking product ${productId} as featured_product:`, error);
    } else {
      console.log(`✅ Marked product ${productId} as featured_product`);
    }
  }

  console.log('🎉 Finished marking featured_product items!');
}

async function main() {
  await checkFeaturedProducts();
  await markFeaturedProducts();
  console.log('🔄 Checking featured products again...');
  await checkFeaturedProducts();
}

main().catch(console.error);
