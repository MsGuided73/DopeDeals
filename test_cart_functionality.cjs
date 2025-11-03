const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCartFunctionality() {
  try {
    console.log('🛒 Testing cart functionality...\n');

    // Test data
    const testSessionId = 'test_session_' + Date.now();
    const testProductId = '72b56efd-6419-4e60-9283-af75786040fa'; // From our earlier test

    console.log('1. Creating test cart...');
    // Create a test cart
    const { data: testCart, error: cartError } = await supabase
      .from('carts')
      .insert({
        session_id: testSessionId,
      })
      .select('id')
      .single();

    if (cartError) {
      console.error('❌ Failed to create test cart:', cartError.message);
      return;
    }

    console.log('✅ Test cart created:', testCart.id);

    console.log('\n2. Adding product to cart...');
    // Try to add an item to the cart
    const { data: cartItem, error: itemError } = await supabase
      .from('cart_items')
      .insert({
        cart_id: testCart.id,
        product_id: testProductId,
        quantity: 2,
        price_at_time: 15.99,
      })
      .select(`
        id,
        cart_id,
        product_id,
        quantity,
        price_at_time,
        main_site_products (
          id,
          name,
          our_price
        )
      `)
      .single();

    if (itemError) {
      console.error('❌ Failed to add cart item:', itemError.message);
      console.error('Error details:', itemError);
    } else {
      console.log('✅ Cart item added successfully!');
      console.log('   Item ID:', cartItem.id);
      console.log('   Product:', cartItem.main_site_products?.name || 'Unknown');
      console.log('   Quantity:', cartItem.quantity);
      console.log('   Price at time:', cartItem.price_at_time);
    }

    console.log('\n3. Testing cart retrieval with joins...');
    // Test retrieving cart with product details
    const { data: cartWithItems, error: retrieveError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        product_id,
        quantity,
        price_at_time,
        created_at,
        main_site_products (
          id,
          name,
          our_price,
          stock_quantity,
          is_active
        )
      `)
      .eq('cart_id', testCart.id);

    if (retrieveError) {
      console.error('❌ Failed to retrieve cart items:', retrieveError.message);
    } else {
      console.log('✅ Cart retrieval successful!');
      console.log('   Items in cart:', cartWithItems.length);
      cartWithItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.main_site_products?.name} - Qty: ${item.quantity} - Price: $${item.price_at_time}`);
      });
    }

    console.log('\n4. Testing quantity update...');
    // Test updating quantity
    if (cartItem) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: 3 })
        .eq('id', cartItem.id);

      if (updateError) {
        console.error('❌ Failed to update quantity:', updateError.message);
      } else {
        console.log('✅ Quantity updated successfully!');
      }
    }

    console.log('\n5. Testing item removal...');
    // Test removing item
    if (cartItem) {
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItem.id);

      if (deleteError) {
        console.error('❌ Failed to remove item:', deleteError.message);
      } else {
        console.log('✅ Item removed successfully!');
      }
    }

    console.log('\n6. Cleaning up test data...');
    // Clean up test cart
    const { error: cleanupError } = await supabase
      .from('carts')
      .delete()
      .eq('id', testCart.id);

    if (cleanupError) {
      console.error('❌ Failed to clean up test cart:', cleanupError.message);
    } else {
      console.log('✅ Test data cleaned up successfully!');
    }

    console.log('\n🎉 Cart functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testCartFunctionality();
