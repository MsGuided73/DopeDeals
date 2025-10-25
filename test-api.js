import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAPI() {
  console.log('Testing the updated pipes API filtering...');

  const { data, error } = await supabase
    .from('main_site_products')
    .select('id, name, image_url, brand_name')
    .not('name', 'ilike', '%test%')
    .not('name', 'ilike', '%sample%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total products in database: ${data.length}`);

  // Apply the same filtering logic as the API
  const filteredProducts = data.filter(product => {
    const name = product.name.toLowerCase();

    // Check if it's a pipe product (excluding water pipes, perc pipes, and recyclers)
    const isPipeProduct = (name.includes('pipe') ||
                         name.includes('chillum') ||
                         name.includes('spoon') ||
                         name.includes('sherlock') ||
                         name.includes('one hitter') ||
                         name.includes('hand pipe')) &&
                         !name.includes('water pipe') &&
                         !name.includes('water pipes') &&
                         !name.includes('perc') &&
                         !name.includes('percolator') &&
                         !name.includes('percolators') &&
                         !name.includes('recycler');

    // Check if it has a valid image URL (strict validation)
    const hasValidImage = product.image_url &&
                         product.image_url.trim() !== '' &&
                         product.image_url.trim() !== 'NULL' &&
                         product.image_url.trim() !== 'null' &&
                         !product.image_url.includes('placehold') &&
                         !product.image_url.includes('placeholder') &&
                         !product.image_url.includes('example.com') &&
                         !product.image_url.includes('test.com') &&
                         (product.image_url.startsWith('http://') || product.image_url.startsWith('https://')) &&
                         (product.image_url.includes('.jpg') ||
                          product.image_url.includes('.jpeg') ||
                          product.image_url.includes('.png') ||
                          product.image_url.includes('.webp') ||
                          product.image_url.includes('sigdistro.com') ||
                          product.image_url.includes('supabase.co'));

    // Exclude straight pipes that reference percolators/percs
    const isStraightPipeWithPerc = name.includes('straight pipe') &&
                                 (name.includes('percolator') || name.includes('perc'));

    return isPipeProduct && hasValidImage && !isStraightPipeWithPerc;
  });

  console.log(`\n🎯 FINAL COUNT: ${filteredProducts.length} pipe products with valid images`);

  // Check for any water pipes, perc pipes, or recyclers that might have slipped through
  const problematicProducts = filteredProducts.filter(product => {
    const name = product.name.toLowerCase();
    return name.includes('water pipe') ||
           name.includes('water pipes') ||
           name.includes('perc') ||
           name.includes('percolator') ||
           name.includes('percolators') ||
           name.includes('recycler');
  });

  if (problematicProducts.length > 0) {
    console.log('\n❌ FOUND PROBLEMATIC PRODUCTS:');
    problematicProducts.forEach(product => {
      console.log(`- ${product.name}`);
    });
  } else {
    console.log('\n✅ NO WATER PIPES, PERC PIPES, OR RECYCLER PIPES FOUND!');
  }

  console.log('\n📋 Sample of remaining products:');
  filteredProducts.slice(0, 10).forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   Brand: ${product.brand_name || 'NULL'}`);
    console.log(`   Image: ${product.image_url}`);
    console.log('');
  });
}

testAPI().catch(console.error);
