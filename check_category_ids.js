import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategoryIds() {
  try {
    // First, get distinct category_ids from products
    const { data: categoryIds, error } = await supabase
      .from('main_site_products')
      .select('category_id')
      .not('category_id', 'is', null);

    if (error) {
      console.error('Error:', error);
      return;
    }

    const distinctIds = [...new Set(categoryIds.map(item => item.category_id))];

    console.log('Distinct category_ids found in products:', distinctIds);

    // Try to get category info if it exists
    if (distinctIds.length > 0) {
      // Try common category table names
      const tableNames = ['categories', 'product_categories', 'category'];

      for (const tableName of tableNames) {
        try {
          console.log(`\nTrying to query table: ${tableName}`);
          const { data: cats, error: catError } = await supabase
            .from(tableName)
            .select('*')
            .in('id', distinctIds)
            .limit(10);

          if (!catError && cats && cats.length > 0) {
            console.log(`Found categories in table '${tableName}':`);
            cats.forEach(cat => {
              console.log(`  ${cat.id}: ${cat.name || cat.title} (slug: ${cat.slug})`);
            });
            break;
          } else if (catError) {
            console.log(`No data in table '${tableName}': ${catError.message}`);
          }
        } catch (e) {
          console.log(`Table '${tableName}' may not exist or is not accessible`);
        }
      }
    }

    // Get sample products with their category_ids
    console.log('\nSample products with category_ids:');
    const { data: sampleProducts } = await supabase
      .from('main_site_products')
      .select('name, category_id')
      .limit(10);

    sampleProducts.forEach(product => {
      console.log(`"${product.name}" -> category_id: ${product.category_id}`);
    });

  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

checkCategoryIds();
