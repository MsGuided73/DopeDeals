const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  try {
    console.log('=== CARTS TABLE SCHEMA ===');
    const { data: cartsSchema, error: cartsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'carts')
      .order('ordinal_position');

    if (cartsError) {
      console.error('Carts schema error:', cartsError);
    } else {
      console.table(cartsSchema);
    }

    console.log('\n=== CART_ITEMS TABLE SCHEMA ===');
    const { data: cartItemsSchema, error: cartItemsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'cart_items')
      .order('ordinal_position');

    if (cartItemsError) {
      console.error('Cart items schema error:', cartItemsError);
    } else {
      console.table(cartItemsSchema);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSchema();
