const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function findTHCAFlowerProducts() {
  try {
    console.log('🔍 Searching for THCA Flower products using search vector...\n');

    // First, get ALL THCA products
    const { data: allThcaData, error: allThcaError, count: allThcaCount } = await supabase
      .from('main_site_products')
      .select('id, name, description, short_description, our_price, sale_price, image_url, stock_quantity, is_active')
      .textSearch('search_vec', 'THCA', {
        type: 'websearch',
        config: 'english'
      })
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (allThcaError) {
      console.error('❌ Error searching for THCA products:', allThcaError);
      return;
    }

    console.log(`✅ Found ${allThcaCount} total THCA products\n`);

    // Filter for flower-related products
    const flowerKeywords = ['flower', 'bud', 'bloom', 'preroll', 'pre-roll', 'joint', 'jar'];
    const thcaFlowerProducts = allThcaData?.filter(product => {
      const searchText = `${product.name} ${product.description || ''} ${product.short_description || ''}`.toLowerCase();
      return flowerKeywords.some(keyword => searchText.includes(keyword));
    }) || [];

    console.log(`🌿 Found ${thcaFlowerProducts.length} THCA Flower-related products:\n`);

    // Separate products with and without images
    const productsWithImages = thcaFlowerProducts.filter(p => p.image_url);
    const productsWithoutImages = thcaFlowerProducts.filter(p => !p.image_url);

    console.log(`📸 Products WITH images: ${productsWithImages.length}`);
    if (productsWithImages.length > 0) {
      productsWithImages.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name}`);
        console.log(`     Image URL: ${product.image_url}`);
      });
    }

    console.log(`\n📭 Products WITHOUT images: ${productsWithoutImages.length}`);
    if (productsWithoutImages.length > 0 && productsWithoutImages.length <= 5) {
      productsWithoutImages.slice(0, 5).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name}`);
      });
      if (productsWithoutImages.length > 5) {
        console.log(`  ... and ${productsWithoutImages.length - 5} more`);
      }
    }

    if (thcaFlowerProducts.length > 0) {
      thcaFlowerProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Price: $${product.our_price}`);
        if (product.sale_price) {
          console.log(`   Sale Price: $${product.sale_price}`);
        }
        console.log(`   Stock: ${product.stock_quantity}`);
        console.log(`   Image: ${product.image_url ? 'Has image' : 'No image'}`);
        console.log(`   Description: ${product.short_description || product.description || 'No description'}`.substring(0, 100) + '...');
        console.log('   ---');
      });
    }

    // Show breakdown by product type
    console.log('\n📊 THCA Product Breakdown:\n');

    const productTypes = {
      'Prerolls/Pre-rolls': ['preroll', 'pre-roll', 'joint'],
      'Flower/Jars': ['flower', 'jar', 'bud'],
      'Cartridges': ['cartridge', 'cart'],
      'Disposables': ['disposable', 'vape'],
      'Diamonds': ['diamond'],
      'Concentrates': ['concentrate', 'live resin', 'distillate']
    };

    Object.entries(productTypes).forEach(([type, keywords]) => {
      const count = allThcaData?.filter(product => {
        const searchText = `${product.name} ${product.description || ''}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      }).length || 0;

      if (count > 0) {
        console.log(`${type}: ${count} products`);
      }
    });

    // Check specifically for edibles (must contain both THCA and edible keywords)
    const edibleKeywords = ['edible', 'gummies', 'chocolate', 'candy', 'capsule', 'pill', 'tincture', 'drink', 'beverage'];
    const thcaEdibles = allThcaData?.filter(product => {
      const searchText = `${product.name} ${product.description || ''} ${product.short_description || ''}`.toLowerCase();
      const hasThca = searchText.includes('thca') || searchText.includes('thc-a');
      const hasEdible = edibleKeywords.some(keyword => searchText.includes(keyword));
      return hasThca && hasEdible;
    }) || [];

    console.log(`\n🍬 True THCA Edibles: ${thcaEdibles.length} products`);
    if (thcaEdibles.length > 0) {
      console.log('THCA Edible products found:');
      thcaEdibles.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name}`);
        console.log(`     Description: ${(product.short_description || product.description || '').substring(0, 80)}...`);
      });
    } else {
      console.log('No true THCA edibles found in current inventory.');
    }

    // Show what was incorrectly categorized as edibles
    const falseEdibles = allThcaData?.filter(product => {
      const searchText = `${product.name} ${product.description || ''} ${product.short_description || ''}`.toLowerCase();
      const hasEdible = edibleKeywords.some(keyword => searchText.includes(keyword));
      const hasThca = searchText.includes('thca') || searchText.includes('thc-a');
      return hasEdible && !hasThca;
    }) || [];

    if (falseEdibles.length > 0) {
      console.log(`\n⚠️  Products with edible keywords but not THCA: ${falseEdibles.length}`);
      console.log('These appear to be Delta 8 or other cannabinoid products:');
      falseEdibles.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name}`);
      });
    }

    // Show sample of other non-flower THCA products
    const nonFlowerThca = allThcaData?.filter(product => {
      const searchText = `${product.name} ${product.description || ''}`.toLowerCase();
      return !flowerKeywords.some(keyword => searchText.includes(keyword)) &&
             !edibleKeywords.some(keyword => searchText.includes(keyword));
    }) || [];

    console.log(`\n❌ Other non-flower/edible THCA products: ${nonFlowerThca.length}`);
    if (nonFlowerThca.length > 0 && nonFlowerThca.length <= 10) {
      console.log('Sample other THCA products:');
      nonFlowerThca.slice(0, 5).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name}`);
      });
    }

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

findTHCAFlowerProducts();
