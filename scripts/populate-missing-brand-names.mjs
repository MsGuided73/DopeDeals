import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qirbapivptotybspnbet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8'
);

console.log('🔍 Populating missing brand_name values...\n');

// Brand detection patterns
const BRAND_PATTERNS = [
  { name: 'Crave', patterns: ['crave', 'crv-', 'cravec-', 'cravemax'] },
  { name: 'ROOR', patterns: ['roor', 'roa', 'zeaker'] },
  { name: 'Puffco', patterns: ['puffco', 'peak', 'proxy'] },
  { name: 'Cookies', patterns: ['cookies', 'cookie'] },
  { name: 'Urth Farmacy', patterns: ['urth', 'farmacy'] },
  { name: 'Hidden Hills', patterns: ['hidden hills', 'hh-'] },
  { name: 'Geek Bar', patterns: ['geek bar', 'geekbar'] },
  { name: 'Elf Bar', patterns: ['elf bar', 'elfbar'] },
  { name: 'Lost Mary', patterns: ['lost mary', 'lostmary'] },
  { name: 'Hyde', patterns: ['hyde'] },
  { name: 'Fume', patterns: ['fume'] },
  { name: 'Breeze', patterns: ['breeze'] },
  { name: 'Air Bar', patterns: ['air bar', 'airbar'] },
  { name: 'Blazy Susan', patterns: ['blazy susan', 'blazy'] },
];

// Get products without brand_name
const { data: products, error } = await supabase
  .from('products')
  .select('id, name, sku')
  .or('brand_name.is.null,brand_name.eq.')
  .eq('is_active', true)
  .limit(1000);

if (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}

console.log(`📊 Found ${products.length} products without brand_name\n`);

let updated = 0;
let notMatched = 0;

for (const product of products) {
  const searchText = `${product.name} ${product.sku}`.toLowerCase();
  let matchedBrand = null;

  // Try to match against brand patterns
  for (const brand of BRAND_PATTERNS) {
    if (brand.patterns.some(pattern => searchText.includes(pattern.toLowerCase()))) {
      matchedBrand = brand.name;
      break;
    }
  }

  if (matchedBrand) {
    // Update the product
    const { error: updateError } = await supabase
      .from('products')
      .update({ brand_name: matchedBrand })
      .eq('id', product.id);

    if (updateError) {
      console.log(`❌ Failed to update ${product.name}: ${updateError.message}`);
    } else {
      updated++;
      if (updated <= 10) {
        console.log(`✅ ${product.name} → ${matchedBrand}`);
      }
    }
  } else {
    notMatched++;
  }
}

console.log(`\n📈 RESULTS:`);
console.log(`   Updated: ${updated} products`);
console.log(`   Not Matched: ${notMatched} products`);
console.log(`\n✅ Complete!\n`);

