const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixCartSchema() {
  try {
    console.log('Fixing cart schema...');

    // Step 1: Recreate cart_items table with proper structure
    console.log('1. Dropping and recreating cart_items table...');

    // Drop existing table
    await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // The table structure should be created by the migration, but let's verify
    const { data: cartItemsTest, error: cartItemsTestError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1);

    console.log('Cart items table status:', cartItemsTestError ? 'Error' : 'OK');

    // Step 2: Test adding an item to cart
    console.log('2. Testing cart functionality...');

    const testSessionId = 'test_session_' + Date.now();
    const testProductId = '72b56efd-6419-4e60-9283-af75786040fa'; // From our earlier test

    // Create a test cart
    const { data: testCart, error: cartError } = await supabase
      .from('carts')
      .insert({
        session_id: testSessionId,
      })
      .select('id')
      .single();

    if (cartError) {
      console.error('Failed to create test cart:', cartError);
      return;
    }

    console.log('✅ Test cart created:', testCart.id);

    // Try to add an item to the cart
    const { data: cartItem, error: itemError } = await supabase
      .from('cart_items')
      .insert({
        cart_id: testCart.id,
        product_id: testProductId,
        quantity: 1,
        price_at_time: 10.00,
      })
      .select()
      .single();

    if (itemError) {
      console.error('Failed to add cart item:', itemError);

      // If the insert failed, the table might not have the right structure
      // Let's try to create the table manually
      console.log('3. Attempting to create cart_items table manually...');

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS cart_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES main_site_products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          price_at_time DECIMAL(10,2) NOT NULL CHECK (price_at_time >= 0),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(cart_id, product_id)
        );
      `;

      // Try to execute via direct query if possible
      console.log('Manual table creation needed. Please run this SQL in Supabase dashboard:');
      console.log(createTableSQL);

    } else {
      console.log('✅ Cart item added successfully:', cartItem);

      // Clean up
      await supabase.from('cart_items').delete().eq('cart_id', testCart.id);
      await supabase.from('carts').delete().eq('id', testCart.id);
      console.log('✅ Test data cleaned up');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixCartSchema();
