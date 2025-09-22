import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugCartFunctionality() {
  console.log('🛒 Debugging Cart Functionality...\n');
  
  try {
    // Step 1: Check if shopping_cart table exists
    console.log('📋 Step 1: Checking shopping_cart table...');
    
    const { data: cartData, error: cartError } = await supabase
      .from('shopping_cart')
      .select('*')
      .limit(5);
      
    if (cartError) {
      console.error('❌ shopping_cart table error:', cartError);
      
      // Check if table exists in schema
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_table_names');
        
      if (tablesError) {
        console.log('📊 Available tables check failed:', tablesError);
      } else {
        console.log('📊 Available tables:', tables);
      }
    } else {
      console.log('✅ shopping_cart table accessible');
      console.log(`📊 Current cart items: ${cartData.length}`);
      if (cartData.length > 0) {
        console.log('Sample cart item:', JSON.stringify(cartData[0], null, 2));
      }
    }
    
    // Step 2: Test product lookup
    console.log('\n📦 Step 2: Testing product lookup...');
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, is_active')
      .eq('is_active', true)
      .limit(3);
      
    if (productsError) {
      console.error('❌ Products table error:', productsError);
    } else {
      console.log('✅ Products table accessible');
      console.log(`📊 Active products found: ${products.length}`);
      if (products.length > 0) {
        console.log('Sample product:', JSON.stringify(products[0], null, 2));
      }
    }
    
    // Step 3: Test cart API simulation
    console.log('\n🧪 Step 3: Simulating cart operations...');
    
    if (products && products.length > 0) {
      const testProduct = products[0];
      const testSessionId = 'debug_session_' + Date.now();
      
      console.log(`Testing with product: ${testProduct.name} (${testProduct.id})`);
      
      // Test adding to cart
      const { data: addResult, error: addError } = await supabase
        .from('shopping_cart')
        .insert({
          product_id: testProduct.id,
          quantity: 1,
          price_at_time: parseFloat(testProduct.price),
          session_id: testSessionId
        })
        .select();
        
      if (addError) {
        console.error('❌ Add to cart failed:', addError);
      } else {
        console.log('✅ Add to cart successful:', addResult);
        
        // Test retrieving cart
        const { data: getResult, error: getError } = await supabase
          .from('shopping_cart')
          .select(`
            id,
            product_id,
            quantity,
            price_at_time,
            products (
              id,
              name,
              price,
              image_url
            )
          `)
          .eq('session_id', testSessionId);
          
        if (getError) {
          console.error('❌ Get cart failed:', getError);
        } else {
          console.log('✅ Get cart successful:', getResult);
        }
        
        // Clean up test data
        await supabase
          .from('shopping_cart')
          .delete()
          .eq('session_id', testSessionId);
        console.log('🧹 Test data cleaned up');
      }
    }
    
    // Step 4: Check for any RLS policies that might be blocking
    console.log('\n🔒 Step 4: Checking RLS policies...');
    
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'shopping_cart' });
      
    if (policiesError) {
      console.log('📊 RLS policies check failed (this is normal):', policiesError.message);
    } else {
      console.log('📊 RLS policies:', policies);
    }
    
    console.log('\n🎉 Cart functionality debug completed!');
    
  } catch (error) {
    console.error('💥 Debug script error:', error);
  }
}

debugCartFunctionality();
