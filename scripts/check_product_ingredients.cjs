
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductIngredients() {
  console.log('Searching for Truemoola products...');
  
  const { data: products, error } = await supabase
    .from('main_site_products')
    .select('*')
    .ilike('name', '%Truemoola%')
    .limit(5);

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  if (products.length === 0) {
    console.log('No Truemoola products found.');
    return;
  }

  console.log(`Found ${products.length} products.`);
  
  // Fetch categories to map IDs
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, slug');
    
  const catMap = {};
  if (categories) {
    categories.forEach(c => catMap[c.id] = c);
  }

  products.forEach(p => {
    console.log('\n---------------------------------------------------');
    console.log(`Product: ${p.name} (ID: ${p.id})`);
    
    // Check specific fields
    console.log('ingredients (column):', p.ingredients);
    console.log('specs (column):', JSON.stringify(p.specs, null, 2));
    console.log('compliance_info:', JSON.stringify(p.compliance_info, null, 2));
    
    if (p.category_id) {
        const cat = catMap[p.category_id];
        console.log(`Category ID: ${p.category_id}`);
        console.log(`Category Name: ${cat ? cat.name : 'Unknown'}`);
        console.log(`Category Slug: ${cat ? cat.slug : 'Unknown'}`);
    } else {
        console.log('Category ID: null');
    }

    // Check description for keywords
    // console.log('Description start:', p.description ? p.description.substring(0, 100) : 'None');
  });
}

checkProductIngredients();
