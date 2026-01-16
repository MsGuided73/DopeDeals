const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not configured');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('--- Checking users table schema ---');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (userError) {
      console.error('Error fetching users:', userError);
    } else if (userData && userData.length > 0) {
      console.log('Columns in users:');
      Object.keys(userData[0]).forEach(col => console.log(`- ${col}`));
    } else {
      console.log('No data found in users table to inspect columns.');
      // Try to get a single row just to see keys even if it's empty by using a query that might return nulls
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_table_columns', { table_name: 'users' });
      if (rpcError) console.log('Note: RPC get_table_columns failed (expected if not defined).');
    }

    console.log('\n--- Checking lab_certificates table schema ---');
    const { data: coaData, error: coaError } = await supabase
      .from('lab_certificates')
      .select('*')
      .limit(1);

    if (coaError) {
      console.error('Error fetching lab_certificates:', coaError);
    } else if (coaData && coaData.length > 0) {
      console.log('Columns in lab_certificates:');
      Object.keys(coaData[0]).forEach(col => console.log(`- ${col}`));
      console.log('\nSample COA data found!');
    } else {
      console.log('No data found in lab_certificates table.');
    }

    console.log('\n--- Checking coa-files storage bucket ---');
    const { data: bucketFiles, error: bucketError } = await supabase.storage
      .from('coa-files')
      .list();

    if (bucketError) {
      console.error('Error listing coa-files bucket:', bucketError);
    } else {
      console.log(`Found ${bucketFiles.length} files in coa-files bucket.`);
      bucketFiles.forEach(f => console.log(`- ${f.name}`));
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkSchema();
