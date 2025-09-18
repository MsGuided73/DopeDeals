const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/2025-09-17_cart_orders_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Supabase connection details
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    
    console.log('🚀 Running database migration...');
    console.log('📁 Migration file:', migrationPath);
    
    // Execute the migration using Supabase REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        sql: migrationSQL
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Migration failed: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log('✅ Migration completed successfully!');
    console.log('📊 Result:', result);
    
    // Verify tables were created
    console.log('\n🔍 Verifying tables were created...');
    const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    if (verifyResponse.ok) {
      console.log('✅ user_profiles table created successfully');
    } else {
      console.log('❌ user_profiles table verification failed');
    }
    
    const cartVerifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/shopping_cart?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    if (cartVerifyResponse.ok) {
      console.log('✅ shopping_cart table created successfully');
    } else {
      console.log('❌ shopping_cart table verification failed');
    }
    
    console.log('\n🎉 Database migration completed! Your cart and orders system is ready.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the migration
runMigration();
