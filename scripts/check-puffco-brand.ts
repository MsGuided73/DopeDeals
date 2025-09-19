import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkPuffcoBrand() {
  console.log('🔍 Checking Puffco brand and products...\n');
  
  // Check if Puffco brand exists
  const { data: brands, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .ilike('name', '%puffco%');
    
  if (brandError) {
    console.error('❌ Error fetching brands:', brandError);
    return;
  }
  
  console.log('📦 Puffco brands found:');
  if (brands && brands.length > 0) {
    brands.forEach(b => console.log(`- ${b.name} (id: ${b.id})`));
  } else {
    console.log('❌ No Puffco brand found in database');
  }
  
  // Check Puffco products
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name, brand_name, brand_id, description, image_url, price, sku')
    .or('brand_name.ilike.%puffco%,name.ilike.%puffco%')
    .limit(15);
    
  if (productError) {
    console.error('❌ Error fetching products:', productError);
    return;
  }
  
  console.log(`\n📊 Found ${products?.length || 0} Puffco products:`);
  if (products && products.length > 0) {
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Brand: ${p.brand_name || 'N/A'} (ID: ${p.brand_id || 'N/A'})`);
      console.log(`   Price: $${p.price || 'N/A'}`);
      console.log(`   SKU: ${p.sku || 'N/A'}`);
      console.log(`   Description: ${p.description ? (p.description.length > 50 ? 'Has description' : 'Short description') : 'No description'}`);
      console.log('');
    });
  } else {
    console.log('❌ No Puffco products found');
  }
}

checkPuffcoBrand();
