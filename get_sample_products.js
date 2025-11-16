import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSampleProducts() {
  try {
    const { data, error } = await supabase
      .from('main_site_products')
      .select('name')
      .not('name', 'is', null)
      .neq('name', '')
      .limit(20);

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Sample product names:');
    console.log('===================');
    data.forEach((product, index) => {
      console.log(`${index + 1}. "${product.name}"`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

getSampleProducts();
