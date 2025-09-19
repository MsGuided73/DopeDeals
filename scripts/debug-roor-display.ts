import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugRoorDisplay() {
  console.log('🔍 Investigating RooR brand display issue...\n');
  
  // Check brand table
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .or('name.ilike.%roor%,name.ilike.%ROOR%');
    
  console.log('🏷️ BRANDS TABLE:');
  console.log(`Found ${brands?.length || 0} RooR brands:`);
  brands?.forEach(brand => {
    console.log(`- ID: ${brand.id}, Name: "${brand.name}"`);
  });
  
  // Check products with different brand name variations
  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand_id, brand_name, sku, is_active, nicotine_product, tobacco_product')
    .or('name.ilike.%roor%,brand_name.ilike.%roor%,sku.ilike.%roor%')
    .limit(25);
    
  console.log(`\n📦 PRODUCTS TABLE:`);
  console.log(`Found ${products?.length || 0} RooR products (showing first 25):\n`);
  
  const brandNames = new Set();
  const brandIds = new Set();
  let activeCount = 0;
  let nicotineCount = 0;
  
  products?.forEach((product, i) => {
    brandNames.add(product.brand_name || 'NULL');
    brandIds.add(product.brand_id || 'NULL');
    if (product.is_active) activeCount++;
    if (product.nicotine_product || product.tobacco_product) nicotineCount++;
    
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   Brand Name: "${product.brand_name || 'NULL'}"`);
    console.log(`   Brand ID: "${product.brand_id || 'NULL'}"`);
    console.log(`   Active: ${product.is_active ? '✅' : '❌'}`);
    console.log(`   Nicotine/Tobacco: ${product.nicotine_product || product.tobacco_product ? '⚠️ YES' : '✅ No'}`);
    console.log('');
  });
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`Brand Names found: ${Array.from(brandNames).join(', ')}`);
  console.log(`Brand IDs found: ${Array.from(brandIds).join(', ')}`);
  console.log(`Active products: ${activeCount}/${products?.length || 0}`);
  console.log(`Nicotine/Tobacco products: ${nicotineCount}/${products?.length || 0}`);
  
  // Check what the frontend would see
  const { data: frontendProducts } = await supabase
    .from('products')
    .select('id, name, brand_name, brand_id')
    .or('name.ilike.%roor%,brand_name.ilike.%roor%,sku.ilike.%roor%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);
    
  console.log(`\n🌐 FRONTEND WOULD SEE:`);
  console.log(`${frontendProducts?.length || 0} RooR products after filtering`);
  
  // Check if there's a specific brand filtering issue
  const { data: roorBrandProducts } = await supabase
    .from('products')
    .select('id, name, brand_name')
    .eq('brand_name', 'ROOR')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);
    
  console.log(`Products with exact brand_name='ROOR': ${roorBrandProducts?.length || 0}`);
  
  const { data: rBrandProducts } = await supabase
    .from('products')
    .select('id, name, brand_name')
    .eq('brand_name', 'R')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);
    
  console.log(`Products with exact brand_name='R': ${rBrandProducts?.length || 0}`);
}

debugRoorDisplay();
