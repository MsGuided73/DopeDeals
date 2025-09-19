import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkBrandsTable() {
  console.log('🔍 Checking brands table structure...\n');
  
  // Get existing brands to see the structure
  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .limit(5);
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`📊 Found ${brands?.length || 0} existing brands:`);
  brands?.forEach((b, i) => {
    console.log(`${i + 1}. ${JSON.stringify(b, null, 2)}`);
    console.log('');
  });
  
  // Check if Puffco already exists
  const { data: puffcoBrand } = await supabase
    .from('brands')
    .select('*')
    .ilike('name', '%puffco%')
    .single();
    
  if (puffcoBrand) {
    console.log('✅ Puffco brand already exists:', puffcoBrand);
  } else {
    console.log('❌ Puffco brand does not exist in brands table');
  }
}

checkBrandsTable();
