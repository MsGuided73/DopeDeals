const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  try {
    console.log('=== CHECKING CART TABLES ===');

    // Try to select from carts table
    console.log('\n--- CARTS TABLE ---');
    const { data: cartsData, error: cartsError } = await supabase
      .from('carts')
      .select('*')
      .limit(1);

    if (cartsError) {
      console.error('Carts table error:', cartsError.message);
    } else {
      console.log('Carts table exists, sample data:', cartsData);
    }

    // Try to select from cart_items table
    console.log('\n--- CART_ITEMS TABLE ---');
    const { data: cartItemsData, error: cartItemsError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1);

    if (cartItemsError) {
      console.error('Cart items table error:', cartItemsError.message);
    } else {
      console.log('Cart items table exists, sample data:', cartItemsData);
    }

    // Try to select from shopping_cart table
    console.log('\n--- SHOPPING_CART TABLE ---');
    const { data: shoppingCartData, error: shoppingCartError } = await supabase
      .from('shopping_cart')
      .select('*')
      .limit(1);

    if (shoppingCartError) {
      console.error('Shopping cart table error:', shoppingCartError.message);
    } else {
      console.log('Shopping cart table exists, sample data:', shoppingCartData);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTables();
