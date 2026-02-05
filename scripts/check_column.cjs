const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Checks whether the `coa_date` column exists on the `main_site_products` table and logs a sample row or an error.
 *
 * Performs a single-row query for `coa_date` and logs either an error message when the query fails
 * (e.g., column missing or other DB error) or a sample of the retrieved data when successful.
 */
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