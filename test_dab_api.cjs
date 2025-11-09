const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testDabAPI() {
  try {
    console.log('🔍 Testing dab-rigs-and-tools API...\n');

    // Test the same query logic as the API
    const dabKeywords = [
      'dab rig', 'dabrig', 'oil rig', 'concentrate rig', 'quartz banger',
      'nail', 'domeless nail', 'banger', 'carb cap', 'dab tool', 'dabber',
      'e-rig', 'erig', 'electric rig', 'puffco', 'proxy', 'peak pro',
      'concentrate tool', 'dabbing tool', 'wax tool'
    ];

    // Build the OR condition for keywords
    const keywordCondition = dabKeywords.map(keyword =>
      `name.ilike.%${keyword}%`
    ).join(',');

    console.log('Searching with keywords:', dabKeywords.slice(0, 5), '...');

    const { data: products, error, count } = await supabase
      .from('main_site_products')
      .select('id, name, our_price, stock_quantity, category_id')
      .or(keywordCondition)
      .eq('is_active', true)
      .limit(10);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`✅ Found ${count} dab-related products in database\n`);

    if (products && products.length > 0) {
      console.log('Sample products found:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: $${product.our_price}`);
        console.log(`   Stock: ${product.stock_quantity}`);
        console.log(`   Category: ${product.category_id || 'No category'}`);
        console.log('   ---');
      });
    } else {
      console.log('No products found with the current search criteria.');
    }

    // Check products in the 'dab-rig - e-rig' category specifically
    console.log('\n🔍 Checking dab-rig category products...\n');

    const { data: dabRigProducts, error: dabError, count: dabCount } = await supabase
      .from('main_site_products')
      .select('id, name, our_price, stock_quantity')
      .eq('category_id', 'dab-rig - e-rig')
      .eq('is_active', true)
      .limit(10);

    if (dabError) {
      console.error('❌ Error checking dab-rig category:', dabError);
    } else {
      console.log(`✅ Found ${dabCount} products in 'dab-rig - e-rig' category:`);
      dabRigProducts?.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.our_price} (Stock: ${product.stock_quantity})`);
      });
    }

    // Also check what categories exist
    console.log('\n� All available categories:\n');

    const { data: categories } = await supabase
      .from('main_site_products')
      .select('category_id')
      .not('category_id', 'is', null);

    const uniqueCategories = [...new Set(categories?.map(c => c.category_id) || [])];
    console.log('Available categories:', uniqueCategories);

    // Count products per category
    console.log('\n📈 Product counts by category:\n');
    for (const category of uniqueCategories) {
      const { count } = await supabase
        .from('main_site_products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category)
        .eq('is_active', true);

      console.log(`${category}: ${count} products`);
    }

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testDabAPI();
