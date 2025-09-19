import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCategoriesTable() {
  console.log('🔍 Checking categories table structure...');
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .limit(3);
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('📊 Sample categories:');
  categories?.forEach((c, i) => {
    console.log(`${i + 1}. ${JSON.stringify(c, null, 2)}`);
  });
  
  console.log(`\n📈 Total categories: ${categories?.length || 0}`);
  
  if (categories && categories.length > 0) {
    console.log('\n🔑 Available columns:');
    Object.keys(categories[0]).forEach(key => {
      console.log(`- ${key}`);
    });
  }
}

checkCategoriesTable();
