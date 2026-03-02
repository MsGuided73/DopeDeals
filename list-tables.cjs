const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  const { data, error } = await supabase.rpc('get_tables');
  if (error) {
    // Fallback if RPC doesn't exist
    const { data: tables, error: tablesError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
       // Another try - query via standard SQL if possible? 
       // Just list some likely names
       const likelyTables = ['users', 'profiles', 'roles', 'user_roles', 'admin_users'];
       console.log('Likely tables to check:');
       for (const t of likelyTables) {
         const { error: checkError } = await supabase.from(t).select('id').limit(1);
         if (!checkError) console.log(`- ${t} (Exists)`);
         else if (checkError.code !== '42P01') console.log(`- ${t} (Error: ${checkError.message})`);
       }
    } else {
      console.log('Tables found via pg_tables:');
      tables.forEach(t => console.log(`- ${t.tablename}`));
    }
  } else {
    console.log('Tables found via RPC:', data);
  }
}

listTables();
