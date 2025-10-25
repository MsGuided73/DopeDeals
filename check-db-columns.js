import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
  console.log('Checking main_site_products table structure...');

  // Get one sample product to see the actual column names
  const { data, error } = await supabase
    .from('main_site_products')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Available columns in main_site_products:');
    console.log(Object.keys(data[0]));

    console.log('\nImage-related columns:');
    Object.keys(data[0]).forEach(col => {
      if (col.toLowerCase().includes('image')) {
        console.log(`- ${col}: ${data[0][col] || 'NULL'}`);
      }
    });
  }
}

checkColumns().catch(console.error);
