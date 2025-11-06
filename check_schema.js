const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not configured');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('Checking main_site_products schema...\n');

    const { data, error } = await supabase
      .from('main_site_products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Columns in main_site_products:');
      Object.keys(data[0]).forEach(col => console.log(`- ${col}`));
    } else {
      console.log('No data found in main_site_products');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();
