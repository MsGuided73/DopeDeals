import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function checkBongCategories() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('Checking category_slug values and bong products...\n');

  // Check what category_slug values exist for products that might be bongs
  const { data: products, error } = await supabase
    .from('main_site_products')
    .select('id, name, category_slug, categories, brand_id')
    .not('name', 'ilike', '%test%')
    .not('name', 'ilike', '%sample%')
    .limit(50);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample products and their category_slug values:');
  products.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name.substring(0, 50)}..., category_slug: ${p.category_slug || 'NULL'}, brand_id: ${p.brand_id || 'NULL'}`);
  });

  // Check for products with bong-related names
  const { data: bongProducts, error: bongError } = await supabase
    .from('main_site_products')
    .select('id, name, category_slug, categories, brand_id')
    .or('name.ilike.%bong%,name.ilike.%water pipe%,name.ilike.%beaker%,name.ilike.%percolator%')
    .limit(20);

  if (bongError) {
    console.error('Error fetching bong products:', bongError);
    return;
  }

  console.log('\nBong-related products found:');
  bongProducts.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name}, category_slug: ${p.category_slug || 'NULL'}, brand_id: ${p.brand_id || 'NULL'}`);
  });

  // Check unique category_slug values
  const { data: uniqueCategories, error: catError } = await supabase
    .from('main_site_products')
    .select('category_slug')
    .not('category_slug', 'is', null);

  if (!catError && uniqueCategories) {
    const uniqueSlugs = [...new Set(uniqueCategories.map(c => c.category_slug))];
    console.log('\nUnique category_slug values:');
    uniqueSlugs.forEach(slug => {
      console.log(`- ${slug}`);
    });
  }
}

checkBongCategories().catch(console.error);
