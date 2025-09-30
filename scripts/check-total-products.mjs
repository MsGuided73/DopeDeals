import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qirbapivptotybspnbet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8'
);

console.log('📊 Product Count Analysis\n');

// Total active products
const { data: allProducts, error: allError } = await supabase
  .from('products')
  .select('id, brand_name')
  .eq('is_active', true);

if (allError) {
  console.error('❌ Error:', allError);
  process.exit(1);
}

console.log(`Total Active Products: ${allProducts.length}\n`);

// Products with brand_name
const withBrand = allProducts.filter(p => p.brand_name && p.brand_name.trim() !== '');
const withoutBrand = allProducts.filter(p => !p.brand_name || p.brand_name.trim() === '');

console.log(`Products WITH brand_name: ${withBrand.length}`);
console.log(`Products WITHOUT brand_name: ${withoutBrand.length}\n`);

// Breakdown by brand
const brandCounts = {};
withBrand.forEach(p => {
  const brand = p.brand_name.trim();
  brandCounts[brand] = (brandCounts[brand] || 0) + 1;
});

console.log('Breakdown by Brand:');
Object.entries(brandCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} products`);
  });

console.log('\n✅ Analysis complete!\n');

