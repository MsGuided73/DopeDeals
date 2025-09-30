import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qirbapivptotybspnbet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8'
);

console.log('🔍 Checking brands table...\n');

// Check brands table
const { data: brands, error: brandsError } = await supabase
  .from('brands')
  .select('*')
  .order('name');

if (brandsError) {
  console.error('❌ Error fetching brands:', brandsError);
} else {
  console.log(`📊 Found ${brands.length} brands in table:\n`);
  brands.forEach((brand, i) => {
    console.log(`${i + 1}. ${brand.name} (slug: ${brand.slug})`);
  });
}

// Check distinct brand_name values in products
console.log('\n\n🔍 Checking brand_name values in products table...\n');

const { data: products, error: productsError } = await supabase
  .from('products')
  .select('brand_name')
  .not('brand_name', 'is', null)
  .eq('is_active', true);

if (productsError) {
  console.error('❌ Error fetching products:', productsError);
} else {
  const uniqueBrands = [...new Set(products.map(p => p.brand_name))].sort();
  console.log(`📊 Found ${uniqueBrands.length} unique brand_name values:\n`);
  uniqueBrands.forEach((brand, i) => {
    const count = products.filter(p => p.brand_name === brand).length;
    console.log(`${i + 1}. ${brand} (${count} products)`);
  });
}

// Check for Crave specifically
console.log('\n\n🔍 Checking Crave integration...\n');

const { data: craveProducts, error: craveError } = await supabase
  .from('products')
  .select('id, name, brand_name, sku')
  .or('name.ilike.%crave%,brand_name.ilike.%crave%,sku.ilike.%crave%')
  .eq('is_active', true)
  .limit(5);

if (craveError) {
  console.error('❌ Error fetching Crave products:', craveError);
} else {
  console.log(`✅ Found ${craveProducts.length} Crave products (showing first 5):\n`);
  craveProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Brand: ${p.brand_name || 'NOT SET'}`);
    console.log(`   SKU: ${p.sku}`);
    console.log('');
  });
}

console.log('✅ Check complete!\n');

