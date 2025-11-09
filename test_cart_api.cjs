const fetch = require('node-fetch');

async function testCartAPI() {
  try {
    console.log('🛒 Testing cart API endpoints...\n');

    // Test data
    const testSessionId = 'test_session_' + Date.now();
    const testProductId = '72b56efd-6419-4e60-9283-af75786040fa'; // From our earlier test

    console.log('1. Testing GET cart (empty cart)...');
    const getResponse = await fetch('http://localhost:3000/api/cart', {
      headers: {
        'x-session-id': testSessionId,
      },
    });

    if (!getResponse.ok) {
      console.error('❌ GET cart failed:', getResponse.status, getResponse.statusText);
      const errorText = await getResponse.text();
      console.error('Error details:', errorText);
    } else {
      const cartData = await getResponse.json();
      console.log('✅ GET cart successful!');
      console.log('   Cart items:', cartData.cart?.items?.length || 0);
      console.log('   Item count:', cartData.cart?.itemCount || 0);
    }

    console.log('\n2. Testing POST cart (add item)...');
    const postResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': testSessionId,
      },
      body: JSON.stringify({
        productId: testProductId,
        quantity: 1,
      }),
    });

    if (!postResponse.ok) {
      console.error('❌ POST cart failed:', postResponse.status, postResponse.statusText);
      const errorText = await postResponse.text();
      console.error('Error details:', errorText);
    } else {
      const result = await postResponse.json();
      console.log('✅ POST cart successful!');
      console.log('   Message:', result.message);
      console.log('   Quantity:', result.quantity);
      console.log('   Item ID:', result.itemId);
    }

    console.log('\n3. Testing GET cart (after adding item)...');
    const getResponse2 = await fetch('http://localhost:3000/api/cart', {
      headers: {
        'x-session-id': testSessionId,
      },
    });

    if (!getResponse2.ok) {
      console.error('❌ GET cart failed:', getResponse2.status, getResponse2.statusText);
    } else {
      const cartData = await getResponse2.json();
      console.log('✅ GET cart successful!');
      console.log('   Cart items:', cartData.cart?.items?.length || 0);
      console.log('   Item count:', cartData.cart?.itemCount || 0);
      if (cartData.cart?.items?.length > 0) {
        console.log('   First item:', cartData.cart.items[0].product?.name);
      }
    }

    console.log('\n4. Testing PUT cart (update quantity)...');
    // First get the cart to find the item ID
    const getForUpdate = await fetch('http://localhost:3000/api/cart', {
      headers: {
        'x-session-id': testSessionId,
      },
    });

    if (getForUpdate.ok) {
      const cartData = await getForUpdate.json();
      if (cartData.cart?.items?.length > 0) {
        const itemId = cartData.cart.items[0].id;

        const putResponse = await fetch('http://localhost:3000/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-session-id': testSessionId,
          },
          body: JSON.stringify({
            cartItemId: itemId,
            quantity: 2,
          }),
        });

        if (!putResponse.ok) {
          console.error('❌ PUT cart failed:', putResponse.status, putResponse.statusText);
          const errorText = await putResponse.text();
          console.error('Error details:', errorText);
        } else {
          const result = await putResponse.json();
          console.log('✅ PUT cart successful!');
          console.log('   Message:', result.message);
          console.log('   Quantity:', result.quantity);
        }
      } else {
        console.log('⚠️  No items to update');
      }
    }

    console.log('\n5. Testing DELETE cart (clear cart)...');
    const deleteResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'DELETE',
      headers: {
        'x-session-id': testSessionId,
      },
    });

    if (!deleteResponse.ok) {
      console.error('❌ DELETE cart failed:', deleteResponse.status, deleteResponse.statusText);
      const errorText = await deleteResponse.text();
      console.error('Error details:', errorText);
    } else {
      const result = await deleteResponse.json();
      console.log('✅ DELETE cart successful!');
      console.log('   Message:', result.message);
      console.log('   Items cleared:', result.itemsCleared);
    }

    console.log('\n🎉 Cart API test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Check if server is running
console.log('Checking if server is running on localhost:3000...');
fetch('http://localhost:3000/api/cart')
  .then(() => {
    console.log('✅ Server is running, proceeding with tests...\n');
    testCartAPI();
  })
  .catch(() => {
    console.log('❌ Server is not running on localhost:3000');
    console.log('Please start the development server with: npm run dev\n');
  });
