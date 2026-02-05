
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
  
  products.forEach(p => {
    console.log('\n---------------------------------------------------');
    console.log(`Product: ${p.name} (ID: ${p.id})`);
    console.log('Keys present in object:', Object.keys(p).join(', '));
    
    // Check specific fields of interest
    console.log('ingredients column:', p.ingredients);
    console.log('specs column:', JSON.stringify(p.specs, null, 2));
    console.log('attributes column:', JSON.stringify(p.attributes, null, 2));
    console.log('description:', p.description ? p.description.substring(0, 100) + '...' : 'N/A');
    console.log('category_id:', p.category_id);
    
    // Check if description contains "ingredients"
    if (p.description && p.description.toLowerCase().includes('ingredients')) {
        console.log('*** Description mentions "ingredients" ***');
    }
  });
}

checkProductIngredients();
