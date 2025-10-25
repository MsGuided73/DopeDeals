import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fixProductCategorization() {
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    console.log('🔍 CHECKING CURRENT CATEGORY STRUCTURE...\n');

    // First, check what categories exist in the categories_new table
    const { data: categories, error: catError } = await supabase
      .from('categories_new')
      .select('id, name, slug, tier, parent_id')
      .eq('is_active', true)
      .order('tier', { ascending: true })
      .order('sort_order', { ascending: true });

    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }

    console.log('📂 CURRENT CATEGORY STRUCTURE:');
    console.log('=============================');

    // Group categories by tier
    const mainCategories = categories.filter(c => c.tier === 'main');
    const subCategories = categories.filter(c => c.tier === 'sub');

    mainCategories.forEach(cat => {
      console.log(`\n🏠 ${cat.name} (slug: '${cat.slug}')`);
      const subs = subCategories.filter(sub => sub.parent_id === cat.id);
      subs.forEach(sub => {
        console.log(`   └── ${sub.name} (slug: '${sub.slug}')`);
      });
    });

    console.log('\n🎯 RECOMMENDED CATEGORY_ID VALUES FOR PRODUCTS:');
    console.log('===============================================');
    subCategories.forEach(cat => {
      console.log(`'${cat.slug}' - ${cat.name}`);
    });

    // Now check for specific products mentioned by user
    console.log('\n🔍 SEARCHING FOR DELTA 8 AND HIDDEN HILLS PRODUCTS...\n');

    const searchTerms = ['delta 8', 'delta-8', 'delta8', 'hidden hills', 'cartridge', 'cart'];
    const { data: specificProducts, error: searchError } = await supabase
      .from('main_site_products')
      .select('id, name, description, category_id, our_price')
      .eq('is_active', true)
      .or(searchTerms.map(term => `name.ilike.%${term}%`).join(','));

    if (searchError) {
      console.error('❌ Error searching products:', searchError);
      return;
    }

    console.log(`Found ${specificProducts.length} products matching search terms:\n`);

    specificProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: $${product.our_price}`);
      console.log(`   Current Category ID: ${product.category_id || 'NULL'}`);
      console.log(`   Suggested Category: ${product.name.toLowerCase().includes('cartridge') || product.name.toLowerCase().includes('cart') ? 'concentrate-vaporizers' : 'thca-concentrates'}`);
      console.log('');
    });

    // Show current categorization status
    const { data: allProducts, error: allError } = await supabase
      .from('main_site_products')
      .select('category_id')
      .eq('is_active', true);

    if (!allError && allProducts) {
      const categorized = allProducts.filter(p => p.category_id && p.category_id.trim() !== '').length;
      const uncategorized = allProducts.length - categorized;

      console.log('📊 CATEGORIZATION STATUS:');
      console.log(`   Total Products: ${allProducts.length}`);
      console.log(`   Categorized: ${categorized}`);
      console.log(`   Uncategorized: ${uncategorized}`);
      console.log(`   Completion Rate: ${Math.round((categorized / allProducts.length) * 100)}%`);
    }

    // NOW AUTO-CATEGORIZE ALL PRODUCTS
    console.log('\n🚀 AUTO-CATEGORIZING ALL PRODUCTS...\n');

    // Define comprehensive category mapping with proper category IDs
    const categoryMapping = {
      'concentrate-vaporizers': {
        keywords: ['delta 8', 'delta-8', 'delta8', 'cartridge', 'cart', 'vape', 'disposable', 'pen', '510 thread'],
        updates: []
      },
      'thca-concentrates': {
        keywords: ['hidden hills', 'live resin', 'liquid diamond', 'resin', 'rosin', 'budder', 'sauce', 'diamonds', 'badder', 'sugar', 'distillate', 'extract', 'concentrate', 'wax', 'shatter'],
        updates: []
      },
      'bongs': {
        keywords: ['bong', 'water pipe', 'waterpipe', 'beaker', 'straight tube', 'percolator', 'ice catcher', 'downstem', 'glass bong'],
        updates: []
      },
      'thca-pre-rolls': {
        keywords: ['pre-roll', 'preroll', 'pre roll', 'joint', 'pre-rolled', 'pre rolled', 'preroll jar'],
        updates: []
      }
    };

    // Categorize products based on keywords
    const productsToUpdate = [];

    specificProducts.forEach(product => {
      const searchText = `${product.name} ${product.description || ''} ${product.short_description || ''}`.toLowerCase();

      for (const [categoryId, categoryInfo] of Object.entries(categoryMapping)) {
        const hasKeyword = categoryInfo.keywords.some(keyword =>
          searchText.includes(keyword.toLowerCase())
        );

        if (hasKeyword) {
          categoryInfo.updates.push({
            id: product.id,
            category_id: categoryId,
            name: product.name,
            matched_keyword: categoryInfo.keywords.find(k => searchText.includes(k.toLowerCase()))
          });
          productsToUpdate.push({
            id: product.id,
            category_id: categoryId
          });
          break; // Only assign to first matching category
        }
      }
    });

    // Show categorization results
    console.log('🎯 CATEGORIZATION RESULTS:\n');

    Object.entries(categoryMapping).forEach(([categoryId, categoryInfo]) => {
      console.log(`${categoryId.toUpperCase()}: ${categoryInfo.updates.length} products`);
      if (categoryInfo.updates.length > 0) {
        categoryInfo.updates.slice(0, 3).forEach(update => {
          console.log(`  • ${update.name} (matched: "${update.matched_keyword}")`);
        });
        if (categoryInfo.updates.length > 3) {
          console.log(`  ... and ${categoryInfo.updates.length - 3} more`);
        }
      }
      console.log('');
    });

    // Update database with new category assignments
    if (productsToUpdate.length > 0) {
      console.log(`📝 UPDATING ${productsToUpdate.length} PRODUCTS IN DATABASE...\n`);

      // Update in batches of 20 to avoid overwhelming the database
      const batchSize = 20;
      let successCount = 0;

      for (let i = 0; i < productsToUpdate.length; i += batchSize) {
        const batch = productsToUpdate.slice(i, i + batchSize);

        const updatePromises = batch.map(async (product) => {
          const { data, error } = await supabase
            .from('main_site_products')
            .update({ category_id: product.category_id })
            .eq('id', product.id)
            .select('id, name, category_id');

          if (error) {
            console.error(`❌ Error updating ${product.id}:`, error);
            return null;
          }

          return data;
        });

        const results = await Promise.all(updatePromises);
        const successful = results.filter(r => r !== null);

        successCount += successful.length;
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: Updated ${successful.length}/${batch.length} products`);

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log(`\n🎉 SUCCESSFULLY CATEGORIZED ${successCount}/${productsToUpdate.length} PRODUCTS!`);
    } else {
      console.log('ℹ️ No products needed categorization updates.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function markFeaturedProducts() {
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    console.log('⭐ MARKING FEATURED PRODUCTS...\n');

    // Get products that should be featured (recent, with images, good variety)
    const { data: products, error } = await supabase
      .from('main_site_products')
      .select('id, name, image_url, our_price, category_id, featured')
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .not('image_url', 'eq', '')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }

    console.log(`📊 Found ${products.length} products with images\n`);

    // Mark a diverse selection as featured
    const featuredUpdates = [
      // Mark some bongs as featured
      ...products.filter(p => p.name.toLowerCase().includes('bong')).slice(0, 2),
      // Mark some Delta 8 products as featured
      ...products.filter(p => p.name.toLowerCase().includes('delta 8')).slice(0, 2),
      // Mark some Hidden Hills products as featured
      ...products.filter(p => p.name.toLowerCase().includes('hidden hills')).slice(0, 2),
      // Mark some high-priced items as featured
      ...products.filter(p => p.our_price > 50).slice(0, 2)
    ];

    console.log(`⭐ Marking ${featuredUpdates.length} products as featured:\n`);

    featuredUpdates.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.our_price}`);
    });

    // Update products to be featured
    if (featuredUpdates.length > 0) {
      const updatePromises = featuredUpdates.map(async (product) => {
        const { data, error } = await supabase
          .from('main_site_products')
          .update({ featured: true })
          .eq('id', product.id)
          .select('id, name, featured');

        if (error) {
          console.error(`❌ Error updating ${product.id}:`, error);
          return null;
        }

        return data;
      });

      const results = await Promise.all(updatePromises);
      const successful = results.filter(r => r !== null);

      console.log(`\n✅ Successfully marked ${successful.length} products as featured!`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixProductCategorization();
markFeaturedProducts();
