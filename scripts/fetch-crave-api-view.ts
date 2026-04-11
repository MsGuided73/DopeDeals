import { config } from 'dotenv';

config({ path: '.env.local' });

async function fetchCraveAPIView() {
  console.log('🎯 FETCHING CRAVE PRODUCTS FROM API VIEW');
  console.log('=' .repeat(50));
  
  try {
    let allRecords: any[] = [];
    let offset = '';
    let pageCount = 0;
    
    // Use the view name "CRAVE Products - API View"
    const viewName = encodeURIComponent('CRAVE Products - API View');
    
    do {
      pageCount++;
      let url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?view=${viewName}&maxRecords=100`;
      
      if (offset) {
        url += `&offset=${offset}`;
      }
      
      console.log(`📡 Fetching page ${pageCount}...`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset || '';
      
      console.log(`   ✅ Page ${pageCount}: +${data.records.length} records (total: ${allRecords.length})`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } while (offset);
    
    console.log(`\n🎉 TOTAL CRAVE PRODUCTS FETCHED: ${allRecords.length}`);
    
    // Analyze the products
    const withImages = allRecords.filter(p => p.fields.Image_url).length;
    const published = allRecords.filter(p => p.fields.Published).length;
    const inStock = allRecords.filter(p => p.fields['In stock?']).length;
    const withPrices = allRecords.filter(p => p.fields['Regular price']).length;
    
    // Check for nicotine products
    const nicotineProducts = allRecords.filter(product => {
      const contents = (product.fields.Contents || '').toLowerCase();
      const name = (product.fields.Name || '').toLowerCase();
      return contents.includes('nicotine') || name.includes('nicotine');
    });
    
    console.log(`\n📊 CRAVE PRODUCTS ANALYSIS:`);
    console.log(`📷 With images: ${withImages}/${allRecords.length} (${(withImages/allRecords.length*100).toFixed(1)}%)`);
    console.log(`📋 Published: ${published}/${allRecords.length} (${(published/allRecords.length*100).toFixed(1)}%)`);
    console.log(`📦 In stock: ${inStock}/${allRecords.length} (${(inStock/allRecords.length*100).toFixed(1)}%)`);
    console.log(`💰 With prices: ${withPrices}/${allRecords.length} (${(withPrices/allRecords.length*100).toFixed(1)}%)`);
    console.log(`🚫 Nicotine products: ${nicotineProducts.length}/${allRecords.length} (${(nicotineProducts.length/allRecords.length*100).toFixed(1)}%)`);
    console.log(`✅ Highway420 ready: ${allRecords.length - nicotineProducts.length}/${allRecords.length} (${((allRecords.length - nicotineProducts.length)/allRecords.length*100).toFixed(1)}%)`);
    
    // Group by categories
    const categoryGroups = new Map<string, any[]>();
    
    allRecords.forEach(product => {
      const categories = product.fields.Categories || 'No Category';
      if (!categoryGroups.has(categories)) {
        categoryGroups.set(categories, []);
      }
      categoryGroups.get(categories)!.push(product);
    });
    
    console.log(`\n📂 CATEGORIES (${categoryGroups.size} total):`);
    console.log('=' .repeat(50));
    
    // Sort categories by product count
    const sortedCategories = Array.from(categoryGroups.entries())
      .sort(([,a], [,b]) => b.length - a.length);
    
    sortedCategories.forEach(([category, products]) => {
      const withImagesInCat = products.filter(p => p.fields.Image_url).length;
      const nicotineInCat = products.filter(p => {
        const contents = (p.fields.Contents || '').toLowerCase();
        const name = (p.fields.Name || '').toLowerCase();
        return contents.includes('nicotine') || name.includes('nicotine');
      }).length;
      
      console.log(`\n🏷️  ${category}`);
      console.log(`   📊 ${products.length} products`);
      console.log(`   📷 ${withImagesInCat} with images (${(withImagesInCat/products.length*100).toFixed(1)}%)`);
      console.log(`   🚫 ${nicotineInCat} nicotine products (${(nicotineInCat/products.length*100).toFixed(1)}%)`);
      console.log(`   ✅ ${products.length - nicotineInCat} Highway420 ready (${((products.length - nicotineInCat)/products.length*100).toFixed(1)}%)`);
      
      // Show first few products in each category
      console.log(`   📋 Sample products:`);
      products.slice(0, 3).forEach(product => {
        const hasImage = product.fields.Image_url ? '🖼️' : '❌';
        const isNicotine = (
          (product.fields.Contents || '').toLowerCase().includes('nicotine') ||
          (product.fields.Name || '').toLowerCase().includes('nicotine')
        ) ? '🚫' : '✅';
        const price = product.fields['Regular price'] ? `$${product.fields['Regular price']}` : 'No Price';
        
        console.log(`      - ${product.fields.Name || 'No Name'} ${hasImage} ${isNicotine} (${price})`);
      });
      
      if (products.length > 3) {
        console.log(`      ... and ${products.length - 3} more`);
      }
    });
    
    // Price analysis
    const prices = allRecords
      .map(p => parseFloat(p.fields['Regular price']))
      .filter(p => !isNaN(p))
      .sort((a, b) => a - b);
    
    if (prices.length > 0) {
      console.log(`\n💰 PRICE ANALYSIS:`);
      console.log(`   Range: $${prices[0]} - $${prices[prices.length - 1]}`);
      console.log(`   Average: $${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}`);
      console.log(`   Median: $${prices[Math.floor(prices.length / 2)].toFixed(2)}`);
    }
    
    // Export summary for integration planning
    const integrationSummary = {
      totalProducts: allRecords.length,
      readyForIntegration: allRecords.length - nicotineProducts.length,
      withImages: withImages,
      categories: Object.fromEntries(
        sortedCategories.map(([cat, products]) => [
          cat,
          {
            total: products.length,
            withImages: products.filter(p => p.fields.Image_url).length,
            nonNicotine: products.filter(p => {
              const contents = (p.fields.Contents || '').toLowerCase();
              const name = (p.fields.Name || '').toLowerCase();
              return !contents.includes('nicotine') && !name.includes('nicotine');
            }).length
          }
        ])
      )
    };
    
    console.log(`\n📋 INTEGRATION SUMMARY:`);
    console.log(`🎯 Ready to integrate: ${integrationSummary.readyForIntegration} non-nicotine Crave products`);
    console.log(`📷 With high-quality images: ${integrationSummary.withImages} products`);
    console.log(`📂 Across ${Object.keys(integrationSummary.categories).length} categories`);
    
    return allRecords;
    
  } catch (error) {
    console.error('❌ Error fetching Crave API view:', error);
    return [];
  }
}

// Run the fetch
fetchCraveAPIView()
  .then(products => {
    if (products.length > 0) {
      console.log(`\n🎉 SUCCESS: Fetched ${products.length} Crave products from API view!`);
      console.log(`\n🚀 READY FOR NEXT STEPS:`);
      console.log(`   1. Match products to existing Supabase inventory`);
      console.log(`   2. Import new products to expand Highway420 catalog`);
      console.log(`   3. Update product images and descriptions`);
      console.log(`   4. Apply proper categorization and filtering`);
    }
  })
  .catch(console.error);
