const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugProducts() {
  try {
    console.log('Fetching products from main_site_products...');

    const { data, error } = await supabase
      .from('main_site_products')
      .select(`
        id, name, description, short_description, our_price, sale_price, fire_price,
        image_url, sku, stock_quantity, is_active, featured, brand_id, category_id,
        created_at, updated_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3); // Just get first 3 for debugging

    if (error) {
      console.error('Supabase error:', error);
      return;
    }

    console.log('Raw data from database:');
    console.log(JSON.stringify(data, null, 2));

    if (data && data.length > 0) {
      console.log('\nTransformed products:');
      const transformedProducts = data.map((product) => {
        try {
          const price = Number(product.our_price) || 0;
          const salePrice = product.sale_price ? Number(product.sale_price) : null;
          const isOnSale = salePrice && salePrice < price;

          return {
            id: product.id,
            name: product.name || 'Unnamed Product',
            description: product.description || product.short_description || '',
            price: price,
            originalPrice: isOnSale ? price : undefined,
            image: product.image_url || '',
            imageUrl: product.image_url || null,
            sku: product.sku || '',
            brand: product.brand_id || 'Unknown',
            category: product.category_id || 'Accessories',
            material: 'Glass',
            size: 'Standard',
            inStock: (product.stock_quantity || 0) > 0,
            featured: Boolean(product.featured),
            isNew: product.created_at ? new Date(product.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 : false,
            isSale: isOnSale || false,
            features: [],
            tags: []
          };
        } catch (transformError) {
          console.error('Error transforming product:', product.id, transformError);
          return null;
        }
      }).filter(p => p !== null);

      console.log(JSON.stringify(transformedProducts, null, 2));
    }

  } catch (err) {
    console.error('Connection error:', err);
  }
}

debugProducts();
