const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDatabase() {
  console.log('--- Applying database fixes ---');

  // Since we don't have a direct SQL execution tool, we have to rely on RPC 
  // or check if there's a way to run migrations. 
  // However, Supabase doesn't allow arbitrary SQL via the client unless a special function exists.
  
  // Let's check if we can use the 'supabase' CLI if it's available in the path, 
  // or if we can find a migration script that we can leverage.
  
  // Alternatively, I'll try to find a way to run SQL.
  // Many Supabase setups have a 'exec_sql' or similar function for internal use.
}

async function checkAllTables() {
  const tables = ['users', 'products', 'main_site_products', 'lab_certificates'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table '${table}': ERROR (${error.message})`);
    } else {
      console.log(`Table '${table}': EXISTS (${data.length} rows found)`);
      if (data.length > 0) {
        console.log(`  Columns: ${Object.keys(data[0]).join(', ')}`);
      }
    }
  }
}

checkAllTables();
