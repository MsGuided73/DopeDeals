import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkProductSlugs() {
  console.log('🔍 Checking product slug patterns...\n');
  
  // Check Puffco product slugs
  const { data: puffcoProducts, error } = await supabase
    .from('products')
    .select('id, name, slug, brand_name')
    .eq('brand_name', 'Puffco')
    .limit(5);
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('📊 Puffco product slug examples:');
  puffcoProducts?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   Slug: ${p.slug || 'No slug'}`);
    console.log('');
  });
  
  // Check general slug patterns
  const { data: moreProducts } = await supabase
    .from('products')
    .select('name, slug, brand_name')
    .not('slug', 'is', null)
    .limit(10);
    
  console.log('📋 General slug patterns:');
  moreProducts?.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} → ${p.slug}`);
    console.log(`   Brand: ${p.brand_name || 'N/A'}`);
    console.log('');
  });
  
  // Suggest brand slug pattern
  console.log('💡 SUGGESTED BRAND SLUG PATTERNS:');
  console.log('- Puffco → "puffco"');
  console.log('- RooR → "roor"');
  console.log('- Raw → "raw"');
  console.log('- OCB → "ocb"');
  console.log('');
  console.log('This matches the lowercase, hyphenated pattern used in product slugs.');
}

checkProductSlugs();
