const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCartTables() {
  try {
    console.log('Checking cart-related tables...');

    // Check if carts table exists
    const { data: carts, error: cartsError } = await supabase.from('carts').select('id').limit(1);
    if (cartsError) {
      console.error('Carts table error:', cartsError.message);
    } else {
      console.log('✅ Carts table exists');
    }

    // Check if cart_items table exists
    const { data: cartItems, error: cartItemsError } = await supabase.from('cart_items').select('id').limit(1);
    if (cartItemsError) {
      console.error('Cart items table error:', cartItemsError.message);
    } else {
      console.log('✅ Cart items table exists');
    }

    // Check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname')
      .in('tablename', ['carts', 'cart_items']);

    if (policiesError) {
      console.error('Policies check error:', policiesError.message);
    } else {
      console.log('RLS Policies:', policies?.length || 0, 'found');
      policies?.forEach(p => console.log(`  - ${p.tablename}: ${p.policyname}`));
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkCartTables();
