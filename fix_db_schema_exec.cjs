const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSql(sql) {
  const { data, error } = await supabase.rpc('exec', { query: sql });
  if (error) {
    console.error(`Error executing SQL: ${error.message}`);
    return { error };
  }
  return { data };
}

async function fixUsersTable() {
  console.log('--- Fixing users table via exec RPC ---');
  
  const queries = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_tier_id UUID;"
  ];

  for (const sql of queries) {
    const { error } = await runSql(sql);
    if (error) {
      console.log(`Failed statement: ${sql}`);
    } else {
      console.log(`Success: ${sql}`);
    }
  }
}

fixUsersTable();
