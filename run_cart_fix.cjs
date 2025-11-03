const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('Running cart schema fix migration...');

    // Read the migration file
    const migrationSQL = fs.readFileSync('supabase/migrations/2025-11-03_fix_cart_schema.sql', 'utf8');

    // Split into individual statements (basic approach)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);

        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.error(`Error in statement ${i + 1}:`, error);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`Failed to execute statement ${i + 1}:`, err.message);
        }
      }
    }

    console.log('Migration completed. Verifying results...');

    // Verify the cart_items table was created properly
    const { data: cartItemsSample, error: cartItemsError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1);

    if (cartItemsError) {
      console.error('Cart items table verification failed:', cartItemsError.message);
    } else {
      console.log('✅ Cart items table exists and is accessible');
    }

    // Test cart creation
    console.log('Testing cart creation...');
    const testSessionId = 'test_session_' + Date.now();

    const { data: testCart, error: testError } = await supabase
      .from('carts')
      .insert({
        session_id: testSessionId,
      })
      .select('id')
      .single();

    if (testError) {
      console.error('Cart creation test failed:', testError.message);
    } else {
      console.log('✅ Cart creation successful, ID:', testCart.id);

      // Clean up test cart
      await supabase.from('carts').delete().eq('id', testCart.id);
      console.log('✅ Test cart cleaned up');
    }

  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

runMigration();
