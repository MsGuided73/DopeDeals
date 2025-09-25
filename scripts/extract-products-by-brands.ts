import { config } from 'dotenv';

config({ path: '.env.local' });

async function extractProductsByBrands() {
  console.log('🏷️  EXTRACTING PRODUCTS BY BRANDS COLUMN');
  console.log('=' .repeat(60));
  
  try {
    // Fetch all records
    let allRecords: any[] = [];
    let offset = '';
    
    do {
      const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?maxRecords=100${offset ? `&offset=${offset}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset || '';
      
    } while (offset);
    
    console.log(`📊 Total records fetched: ${allRecords.length}\n`);
    
    // Group products by brand
    const brandGroups: { [key: string]: any[] } = {};
    let noBrandCount = 0;
    
    allRecords.forEach(record => {
      const brand = record.fields.Brands;
      
      if (brand) {
        if (!brandGroups[brand]) {
          brandGroups[brand] = [];
        }
        brandGroups[brand].push(record);
      } else {
        noBrandCount++;
      }
    });
    
    // Sort brands by product count
    const sortedBrands = Object.entries(brandGroups)
      .sort(([,a], [,b]) => b.length - a.length);
    
    console.log('🏷️  BRANDS SUMMARY:');
    console.log('=' .repeat(40));
    sortedBrands.forEach(([brand, products]) => {
      const withImages = products.filter(p => p.fields.Image_url).length;
      const published = products.filter(p => p.fields.Published).length;
      const inStock = products.filter(p => p.fields['In stock?']).length;
      
      console.log(`${brand}: ${products.length} products (${withImages} with images, ${published} published, ${inStock} in stock)`);
    });
    
    if (noBrandCount > 0) {
      console.log(`No Brand: ${noBrandCount} products`);
    }
    
    // Show detailed breakdown for each brand
    console.log('\n📋 DETAILED BRAND BREAKDOWN:');
    console.log('=' .repeat(60));
    
    sortedBrands.forEach(([brand, products]) => {
      console.log(`\n🏷️  ${brand.toUpperCase()} (${products.length} products):`);
      console.log('-' .repeat(40));
      
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.fields.Name || 'No Name'}`);
        console.log(`   📦 SKU: ${product.fields.SKU || 'No SKU'}`);
        console.log(`   💰 Price: $${product.fields['Regular price'] || 'No Price'}`);
        console.log(`   📷 Image: ${product.fields.Image_url ? '✅' : '❌'}`);
        console.log(`   📂 Categories: ${product.fields.Categories || 'None'}`);
        console.log(`   📝 Contents: ${product.fields.Contents || 'None'}`);
        console.log(`   📋 Published: ${product.fields.Published ? 'Yes' : 'No'}`);
        console.log(`   📦 In Stock: ${product.fields['In stock?'] ? 'Yes' : 'No'}`);
        
        if (index < products.length - 1) console.log('');
      });
    });
    
    // Focus on Crave products specifically
    if (brandGroups['Crave']) {
      console.log('\n🎯 CRAVE PRODUCTS ANALYSIS:');
      console.log('=' .repeat(40));
      
      const craveProducts = brandGroups['Crave'];
      const categories = new Set<string>();
      const contents = new Set<string>();
      
      craveProducts.forEach(product => {
        if (product.fields.Categories) {
          product.fields.Categories.split(',').forEach((cat: string) => {
            categories.add(cat.trim());
          });
        }
        if (product.fields.Contents) {
          contents.add(product.fields.Contents);
        }
      });
      
      console.log(`📂 Categories: ${Array.from(categories).join(', ')}`);
      console.log(`📝 Contents: ${Array.from(contents).join(', ')}`);
      
      // Check for nicotine products
      const nicotineProducts = craveProducts.filter(product => {
        const contents = (product.fields.Contents || '').toLowerCase();
        const name = (product.fields.Name || '').toLowerCase();
        return contents.includes('nicotine') || name.includes('nicotine');
      });
      
      console.log(`🚫 Nicotine products (need filtering): ${nicotineProducts.length}`);
      nicotineProducts.forEach(product => {
        console.log(`   - ${product.fields.Name}`);
      });
      
      const nonNicotineProducts = craveProducts.filter(product => {
        const contents = (product.fields.Contents || '').toLowerCase();
        const name = (product.fields.Name || '').toLowerCase();
        return !contents.includes('nicotine') && !name.includes('nicotine');
      });
      
      console.log(`✅ Non-nicotine products (DopeDeals ready): ${nonNicotineProducts.length}`);
    }
    
    return { brandGroups, totalRecords: allRecords.length };
    
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

extractProductsByBrands()
  .then(result => {
    if (result) {
      console.log(`\n✅ Successfully analyzed ${result.totalRecords} products across ${Object.keys(result.brandGroups).length} brands!`);
    }
  })
  .catch(console.error);
