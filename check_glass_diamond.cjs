dconst { createClient } = require('@supabase/supabase-js');

async function checkGlassDiamond() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('=== GLASS DIAMOND PRODUCTS CHECK ===\n');

    // Check Glass Diamond products
    const { data: glassDiamondProducts, error } = await supabase
      .from('main_site_products')
      .select('id, name, featured, is_active, image_url, image_urls, created_at, updated_at')
      .ilike('name', '%glass diamond%')
      .limit(10);

    if (error) {
      console.error('Error fetching Glass Diamond products:', error);
      return;
    }

    if (glassDiamondProducts && glassDiamondProducts.length > 0) {
      console.log(`Found ${glassDiamondProducts.length} Glass Diamond products:\n`);

      glassDiamondProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Featured: ${product.featured}`);
        console.log(`   Active: ${product.is_active}`);
        console.log(`   Has Image URL: ${!!product.image_url}`);
        console.log(`   Has Image URLs: ${Array.isArray(product.image_urls) && product.image_urls.length > 0}`);
        console.log(`   Created: ${new Date(product.created_at).toLocaleString()}`);
        console.log(`   Updated: ${new Date(product.updated_at).toLocaleString()}\n`);
      });
    } else {
      console.log('No Glass Diamond products found\n');
    }

    // Also check for variations like "Diamond Glass"
    const { data: diamondGlassProducts, error: error2 } = await supabase
      .from('main_site_products')
      .select('id, name, featured, is_active, image_url, image_urls')
      .ilike('name', '%diamond glass%')
      .limit(5);

    if (error2) {
      console.error('Error fetching Diamond Glass products:', error2);
    } else if (diamondGlassProducts && diamondGlassProducts.length > 0) {
      console.log(`Also found ${diamondGlassProducts.length} "Diamond Glass" products:\n`);

      diamondGlassProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Featured: ${product.featured}`);
        console.log(`   Active: ${product.active}`);
        console.log(`   Has Images: ${!!product.image_url || (Array.isArray(product.image_urls) && product.image_urls.length > 0)}\n`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkGlassDiamond();
