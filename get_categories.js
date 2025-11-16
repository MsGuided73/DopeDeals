import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Product Categories:');
    console.log('==================');
    data.forEach((category, index) => {
      console.log(`${category.id}: "${category.name}" (slug: ${category.slug})`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

getCategories();
