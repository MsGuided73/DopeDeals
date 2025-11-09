const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProductCount() {
  try {
    const { count, error } = await supabase
      .from('main_site_products')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Total products in database:', count);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkProductCount();
