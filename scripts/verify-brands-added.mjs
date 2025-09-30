import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qirbapivptotybspnbet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8'
);

console.log('🔍 Verifying brands table after SQL insert...\n');

// Get all brands
const { data: brands, error: brandsError } = await supabase
  .from('brands')
  .select('id, name, slug, created_at')
  .order('name');

if (brandsError) {
  console.error('❌ Error:', brandsError);
  process.exit(1);
}

console.log(`📊 Total Brands in Table: ${brands.length}\n`);
console.log('═'.repeat(60));

// Get product count for each brand
for (const brand of brands) {
  const { data: products, error } = await supabase
    .from('products')
    .select('id')
    .eq('brand_name', brand.name)
    .eq('is_active', true);
  
  const count = products?.length || 0;
  const hasPage = ['crave', 'puffco', 'roor', 'cookies', 'urth-farmacy'].includes(brand.slug);
  
  console.log(`\n${brand.name}`);
  console.log(`  Slug: ${brand.slug}`);
  console.log(`  Products: ${count}`);
  console.log(`  Brand Page: ${hasPage ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log(`  Created: ${new Date(brand.created_at).toLocaleDateString()}`);
}

console.log('\n' + '═'.repeat(60));

// Summary
const totalProducts = brands.reduce((sum, brand) => {
  return sum + (brands.filter(b => b.name === brand.name).length);
}, 0);

console.log('\n📈 SUMMARY:');
console.log(`   Total Brands: ${brands.length}`);
console.log(`   Brands with Pages: ${brands.filter(b => ['crave', 'puffco', 'roor', 'cookies', 'urth-farmacy'].includes(b.slug)).length}`);
console.log(`   Brands without Pages: ${brands.filter(b => !['crave', 'puffco', 'roor', 'cookies', 'urth-farmacy'].includes(b.slug)).length}`);

console.log('\n✅ Verification complete!\n');

