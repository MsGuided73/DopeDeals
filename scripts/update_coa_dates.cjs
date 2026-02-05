const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Update the `coa_date` field in `compliance_info` to 2025-02-06T12:00:00Z for products whose `brand_name` contains "Truemoola".
 *
 * Fetches matching rows from the `main_site_products` table (selecting `id`, `name`, and `compliance_info`) and updates each row's `compliance_info.coa_date`. Logs overall progress and reports fetch or per-product update errors. */
async function updateTruemoolaDates() {
  console.log('Fetching Truemoola products...');
  
  // Fetch relevant products
  const { data: products, error } = await supabase
    .from('main_site_products')
    .select('id, name, compliance_info')
    .ilike('brand_name', '%Truemoola%');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} Truemoola products.`);

  for (const p of products) {
    const newInfo = {
      ...p.compliance_info,
      coa_date: '2025-02-06T12:00:00Z' // Set specific date
    };

    const { error: updateError } = await supabase
      .from('main_site_products')
      .update({ compliance_info: newInfo })
      .eq('id', p.id);

    if (updateError) {
      console.error(`Failed to update ${p.name}:`, updateError);
    } else {
      console.log(`Updated ${p.name}`);
    }
  }
}

updateTruemoolaDates();