const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProducts() {
  try {
    console.log('Checking products in main_site_products table...');

    const { data, error, count } = await supabase
      .from('main_site_products')
      .select('id, name, is_active, stock_quantity', { count: 'exact' })
      .limit(5);

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Total products found:', count);
    console.log('First 5 products:');
    data?.forEach(p => console.log(`- ${p.name} (active: ${p.is_active}, stock: ${p.stock_quantity})`));

    // Check active products specifically
    const { data: activeData, count: activeCount } = await supabase
      .from('main_site_products')
      .select('id, name', { count: 'exact' })
      .eq('is_active', true);

    console.log('Active products count:', activeCount);
    if (activeData && activeData.length > 0) {
      console.log('Sample Active Product:');
      console.log(`- ID: ${activeData[0].id}, Name: ${activeData[0].name}`);
    }

  } catch (err) {
    console.error('Connection error:', err);
  }
}

checkProducts();
