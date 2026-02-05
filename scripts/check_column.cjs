const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumn() {
  const { data, error } = await supabase
    .from('main_site_products')
    .select('coa_date')
    .limit(1);

  if (error) {
    console.log('Error or column missing:', error.message);
  } else {
    console.log('Column exists. Data sample:', data);
  }
}

checkColumn();
