const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductsWithCOAs() {
  try {
    console.log('--- Checking products with lab_test_url ---');
    const { data, error } = await supabase
      .from('products')
      .select('id, name, lab_test_url, requires_lab_test')
      .not('lab_test_url', 'is', null);

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      console.log(`Found ${data.length} products with lab_test_url.`);
      data.forEach(p => console.log(`- ${p.name}: ${p.lab_test_url}`));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkProductsWithCOAs();
