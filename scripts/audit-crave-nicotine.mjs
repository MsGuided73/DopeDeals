import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qirbapivptotybspnbet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8'
);

console.log('🔍 Auditing Crave Products for Nicotine...\n');

// Fetch all Crave products
const { data: craveProducts, error } = await supabase
  .from('products')
  .select('id, name, sku, nicotine_product, tobacco_product, price')
  .eq('brand_name', 'Crave')
  .eq('is_active', true)
  .order('name');

if (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}

console.log(`📊 Total Crave Products: ${craveProducts.length}\n`);

// Nicotine detection keywords
const NICOTINE_KEYWORDS = [
  'nicotine', 'nic', 'tobacco', 'cigarette', 'vape juice', 'e-liquid',
  'salt nic', 'freebase', 'mg nicotine', 'nic pouch', 'pouch',
  '3mg', '6mg', '9mg', '12mg', '18mg', '24mg', '25mg', '35mg', '50mg'
];

// Categorize products
const nicotineProducts = [];
const cleanProducts = [];
const flaggedButClean = [];

craveProducts.forEach(product => {
  const searchText = `${product.name} ${product.sku}`.toLowerCase();
  const hasNicotineKeyword = NICOTINE_KEYWORDS.some(keyword => 
    searchText.includes(keyword.toLowerCase())
  );

  if (hasNicotineKeyword) {
    nicotineProducts.push(product);
  } else if (product.nicotine_product || product.tobacco_product) {
    flaggedButClean.push(product);
  } else {
    cleanProducts.push(product);
  }
});

console.log('🚨 NICOTINE PRODUCTS FOUND (showing first 20):\n');
nicotineProducts.slice(0, 20).forEach((p, i) => {
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   SKU: ${p.sku}`);
  console.log(`   Currently Flagged: ${p.nicotine_product ? 'YES' : 'NO'}`);
  console.log('');
});

if (nicotineProducts.length > 20) {
  console.log(`... and ${nicotineProducts.length - 20} more\n`);
}

console.log('\n⚠️  FLAGGED BUT APPEAR CLEAN:\n');
flaggedButClean.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name}`);
  console.log(`   SKU: ${p.sku}`);
  console.log('');
});

console.log('\n📈 SUMMARY:');
console.log(`   Total Crave Products: ${craveProducts.length}`);
console.log(`   🚨 Nicotine Products: ${nicotineProducts.length}`);
console.log(`   ✅ Clean Products: ${cleanProducts.length}`);
console.log(`   ⚠️  Flagged but Clean: ${flaggedButClean.length}`);

console.log('\n\n💡 RECOMMENDED SQL TO FIX:');
console.log(`
-- Flag all Crave nicotine products
UPDATE products
SET nicotine_product = true
WHERE brand_name = 'Crave'
  AND is_active = true
  AND (
    name ILIKE '%nicotine%' OR
    name ILIKE '%nic pouch%' OR
    name ILIKE '%e-liquid%' OR
    name ILIKE '%vape juice%' OR
    name ILIKE '%3mg%' OR
    name ILIKE '%6mg%' OR
    name ILIKE '%9mg%' OR
    name ILIKE '%12mg%' OR
    name ILIKE '%18mg%' OR
    name ILIKE '%24mg%' OR
    name ILIKE '%25mg%' OR
    name ILIKE '%35mg%' OR
    name ILIKE '%50mg%' OR
    sku ILIKE '%nic%' OR
    sku ILIKE '%NDC%'
  );

-- Verify the changes
SELECT 
  COUNT(*) as total_crave,
  SUM(CASE WHEN nicotine_product = true THEN 1 ELSE 0 END) as nicotine_count,
  SUM(CASE WHEN nicotine_product = false OR nicotine_product IS NULL THEN 1 ELSE 0 END) as clean_count
FROM products
WHERE brand_name = 'Crave' AND is_active = true;
`);

console.log('\n✅ Audit Complete!\n');

