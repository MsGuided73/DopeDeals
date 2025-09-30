// Quick diagnostic script to check brands table
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTMzNjcsImV4cCI6MjA2NjYyOTM2N30.dCsYMaoD736ym1lBGMnCRPhPgJ21-RD2vbrDB7eksnM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBrands() {
  console.log('🔍 Checking brands table...\n');

  const { data: brands, error } = await supabase
    .from('brands')
    .select('id, name, slug')
    .order('name');

  if (error) {
    console.error('❌ Error fetching brands:', error);
    return;
  }

  console.log(`Found ${brands.length} brands:\n`);

  brands.forEach((brand, index) => {
    console.log(`${index + 1}. ${brand.name}`);
    console.log(`   ID: ${brand.id}`);
    console.log(`   Slug: ${brand.slug || 'NO SLUG'}`);
    console.log('');
  });

  // Check specifically for ROOR
  const roorBrand = brands.find(b => 
    b.name.toLowerCase().includes('roor') || 
    (b.slug && b.slug.toLowerCase().includes('roor'))
  );

  if (roorBrand) {
    console.log('✅ ROOR brand found in database!');
    console.log(`   Name: ${roorBrand.name}`);
    console.log(`   Slug: ${roorBrand.slug}`);
  } else {
    console.log('❌ ROOR brand NOT found in database!');
    console.log('   This is why the [id] route returns 404');
  }
}

checkBrands().catch(console.error);

