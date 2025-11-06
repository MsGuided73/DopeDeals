const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not configured');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFeaturedProducts() {
  try {
    console.log('Checking featured products...\n');

    // Check total products count
    const { count: totalCount, error: countError } = await supabase
      .from('main_site_products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting total count:', countError);
    } else {
      console.log(`Total products in database: ${totalCount}`);
    }

    // Check sample products
    const { data: allProducts, error: allError } = await supabase
      .from('main_site_products')
      .select('id, name, is_active, featured')
      .limit(5);

    if (allError) {
      console.error('Error fetching sample products:', allError);
      return;
    }

    console.log('\nSample products (first 5):');
    allProducts.forEach(product => {
      console.log(`- ${product.name}: active=${product.is_active}, featured=${product.featured}`);
    });

    // Check featured products
    const { data: featuredProducts, error: featuredError } = await supabase
      .from('main_site_products')
      .select('id, name, is_active, featured')
      .eq('featured', true);

    if (featuredError) {
      console.error('Error fetching featured products:', featuredError);
      return;
    }

    console.log(`\nTotal featured products: ${featuredProducts.length}`);
    if (featuredProducts.length > 0) {
      console.log('Featured products:');
      featuredProducts.forEach(product => {
        console.log(`- ${product.name}: active=${product.is_active}`);
      });
    }

    // Check active featured products
    const { data: activeFeaturedProducts, error: activeFeaturedError } = await supabase
      .from('main_site_products')
      .select('id, name, is_active, featured')
      .eq('is_active', true)
      .eq('featured', true);

    if (activeFeaturedError) {
      console.error('Error fetching active featured products:', activeFeaturedError);
      return;
    }

    console.log(`\nActive featured products: ${activeFeaturedProducts.length}`);
    if (activeFeaturedProducts.length > 0) {
      console.log('Active featured products:');
      activeFeaturedProducts.forEach(product => {
        console.log(`- ${product.name}`);
      });
    } else {
      console.log('No active featured products found!');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkFeaturedProducts();
