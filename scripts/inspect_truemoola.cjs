const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Query the main_site_products table for a product whose brand_name contains "Truemoola" and log the result.
 *
 * Selects the fields `name`, `compliance_info`, and `updated_at` for a single record matched case-insensitively (ILIKE '%Truemoola%').
 * On error, logs the error to the console; on success, logs the retrieved data as pretty-printed JSON.
 */
async function inspectTruemoola() {
  const { data, error } = await supabase
    .from('main_site_products')
    .select('name, compliance_info, updated_at')
    .ilike('brand_name', '%Truemoola%')
    .limit(1);

  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

inspectTruemoola();