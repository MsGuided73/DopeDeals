const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName) {
  console.log(`\n--- Inspecting ${tableName} columns via RPC/SQL ---`);
  
  // We can try to use a query that will fail if columns are missing, 
  // or we can use the 'rpc' method if we have a custom function, 
  // but most likely we can just use a raw query if we had a function.
  // Since we don't have a direct SQL executor, we'll try to select common columns one by one.
  
  const commonColumns = ['id', 'email', 'role', 'membership_tier_id', 'is_active', 'membershipTierId'];
  for (const col of commonColumns) {
    const { error } = await supabase.from(tableName).select(col).limit(0);
    if (error) {
      console.log(`Column '${col}': MISSING or ERROR (${error.message})`);
    } else {
      console.log(`Column '${col}': EXISTS`);
    }
  }
}

async function run() {
  await inspectTable('users');
}

run();
