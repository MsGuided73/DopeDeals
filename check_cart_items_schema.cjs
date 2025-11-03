const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchemas() {
  try {
    console.log('=== CART_ITEMS TABLE STRUCTURE ===');
    // Get a sample cart_items record to see structure
    const { data: cartItemsSample, error: cartItemsError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1);

    if (cartItemsError) {
      console.error('Cart items error:', cartItemsError.message);
    } else {
      console.log('Cart items sample:', cartItemsSample);
      if (cartItemsSample && cartItemsSample.length > 0) {
        console.log('Columns present:', Object.keys(cartItemsSample[0]));
      } else {
        console.log('Table is empty - checking if it has any structure by trying to describe it');
      }
    }

    console.log('\n=== MAIN_SITE_PRODUCTS TABLE STRUCTURE ===');
    const { data: productsSample, error: productsError } = await supabase
      .from('main_site_products')
      .select('id, name, our_price, fire_price, stock_quantity, is_active, nicotine_product, tobacco_product, image_url')
      .limit(1);

    if (productsError) {
      console.error('Products error:', productsError.message);
    } else {
      console.log('Products sample:', productsSample);
      if (productsSample && productsSample.length > 0) {
        console.log('Product columns present:', Object.keys(productsSample[0]));
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSchemas();
