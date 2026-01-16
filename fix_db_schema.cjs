const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSql(sql) {
  const { data, error } = await supabase.rpc('execute_sql', { query: sql });
  if (error) {
    console.error(`Error executing SQL: ${error.message}`);
    return { error };
  }
  return { data };
}

async function fixUsersTable() {
  console.log('--- Fixing users table ---');
  
  const sql = `
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
      END IF;

      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='membership_tier_id') THEN
        ALTER TABLE users ADD COLUMN membership_tier_id UUID;
      END IF;
    END $$;
  `;

  const { error } = await runSql(sql);
  if (error) {
    console.log('Failed to execute SQL via RPC. Trying direct table check and alert.');
  } else {
    console.log('Successfully updated users table schema.');
  }
}

fixUsersTable();
