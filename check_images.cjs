const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkImages() {
  try {
    console.log('Checking products with non-null image URLs...');

    const { data, error, count } = await supabase
      .from('main_site_products')
      .select('id, name, image_url')
      .not('image_url', 'is', null)
      .limit(10);

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Products with non-null image URLs:', count);
    console.log('Sample products:');
    data?.forEach(p => console.log(`- ${p.name}: ${p.image_url}`));

    // Check for non-empty image URLs
    const { data: nonEmptyData, count: nonEmptyCount } = await supabase
      .from('main_site_products')
      .select('id, name, image_url')
      .neq('image_url', '')
      .not('image_url', 'is', null)
      .limit(10);

    console.log('Products with non-empty, non-null image URLs:', nonEmptyCount);

  } catch (err) {
    console.error('Error:', err);
  }
}

checkImages();
