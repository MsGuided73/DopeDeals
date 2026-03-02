
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function listTables() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qirbapivptotybspnbet.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching table list...');
    
    // Using a raw query to get tables since rpc might not be defined
    const { data: tables, error } = await supabase
      .from('pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public');

    if (error) {
           // Fallback to a list of common tables we might expect to see if we can just select from them
           console.log('Direct pg_tables query failed, trying individual selects...');
           const testTables = ['users', 'profiles', 'orders', 'age_verifications', 'compliance_rules', 'products'];
           const results = {};
           for (const table of testTables) {
             const { error: tableError } = await supabase.from(table).select('*', { count: 'exact', head: true });
             results[table] = tableError ? 'Missing or Error' : 'Exists';
           }
           console.log('Table Probe Results:', JSON.stringify(results, null, 2));
    } else {
      console.log('Tables Found:', JSON.stringify(tables.map(t => t.tablename), null, 2));
    }
  } catch (err) {
    console.error('Script error:', err);
  }
}

listTables();
