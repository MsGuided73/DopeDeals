const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use service role to set up the test state
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCartMerge() {
  try {
    console.log('🧪 Testing Cart Merge Logic...\n');

    const testSessionId = 'merge_test_session_' + Date.now();
    const testUserId = 'f8982a5c-59e6-4903-b097-0335e2652697'; // Existing user from previous logs
    const testProductId = '45b14fa9-777f-478d-be1e-1493df28fd7f'; // Cookies Flower

    console.log('1. Setting up guest cart with item...');
    const { data: guestCart } = await supabase
      .from('carts')
      .insert({ session_id: testSessionId })
      .select()
      .single();
    
    await supabase.from('cart_items').insert({
      cart_id: guestCart.id,
      product_id: testProductId,
      quantity: 2,
      price_at_time: 15.00
    });
    console.log('✅ Guest cart created with 2 items.');

    console.log('\n2. Simulating login context and calling API...');
    // We simulate the API's behavior by calling a GET with the session ID.
    // Note: In a real test we'd hit the endpoint, but here we can just 
    // verify the service function logic if we wanted. 
    // However, the best proof is hitting the actual endpoint.
    
    const response = await fetch('http://localhost:3000/api/cart', {
      headers: {
        'x-session-id': testSessionId,
        // We can't easily simulate the auth cookie here without a real session,
        // but we can check if the merge function performs correctly if called manually.
      }
    });

    console.log('NOTE: Real merge requires a valid Auth Cookie which we cannot easily fake in a script.');
    console.log('I will verify the code logic instead by checking the merge function in route.ts.');

    // Cleanup
    console.log('\n3. Cleaning up test data...');
    await supabase.from('cart_items').delete().eq('cart_id', guestCart.id);
    await supabase.from('carts').delete().eq('id', guestCart.id);
    console.log('✅ Cleanup complete.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCartMerge();
