import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkDescriptionFields() {
  console.log('🔍 Checking product description fields...\n');
  
  const { data: sample, error } = await supabase
    .from('products')
    .select('id, name, short_description, description, description_md')
    .eq('brand_name', 'ROOR')
    .limit(3);
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
    
  console.log('📊 Sample RooR products with description fields:');
  sample?.forEach((product, i) => {
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   short_description: ${product.short_description ? '✅ Has content' : '❌ Empty'}`);
    console.log(`   description: ${product.description ? '✅ Has content' : '❌ Empty'}`);
    console.log(`   description_md: ${product.description_md ? '✅ Has content' : '❌ Empty'}`);
    console.log('');
  });
  
  // Check if description_md field exists
  const { data: allFields } = await supabase
    .from('products')
    .select('*')
    .limit(1);
    
  if (allFields && allFields[0]) {
    const fieldNames = Object.keys(allFields[0]);
    console.log('📋 Available description-related fields:');
    fieldNames.filter(field => field.includes('description')).forEach(field => {
      console.log(`   - ${field}`);
    });
  }
}

checkDescriptionFields();
