import { config } from 'dotenv';

config({ path: '.env.local' });

async function getAllCraveProducts() {
  console.log('🔍 FETCHING ALL CRAVE PRODUCTS');
  console.log('=' .repeat(40));
  
  try {
    let allRecords: any[] = [];
    let offset = '';
    let pageCount = 0;
    
    // Fetch all records using pagination
    do {
      pageCount++;
      let url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?maxRecords=100`;
      
      if (offset) {
        url += `&offset=${offset}`;
      }
      
      console.log(`📡 Page ${pageCount}...`);
      
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
      
      console.log(`   +${data.records.length} records (total: ${allRecords.length})`);
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } while (offset);
    
    console.log(`\n📊 TOTAL RECORDS: ${allRecords.length}`);
    
    // Filter for Crave products using the Brands field
    const craveProducts = allRecords.filter(record => {
      const brand = record.fields.Brands;
      return brand && brand.toLowerCase() === 'crave';
    });
    
    console.log(`🏷️  CRAVE PRODUCTS: ${craveProducts.length}`);
    
    if (craveProducts.length === 0) {
      console.log('❌ No Crave products found!');
      
      // Debug: Show what brands we do have
      const brands = new Set();
      allRecords.forEach(record => {
        if (record.fields.Brands) {
          brands.add(record.fields.Brands);
        }
      });
      
      console.log('\n🔍 Available brands:');
      Array.from(brands).forEach(brand => console.log(`   - ${brand}`));
      
      return;
    }
    
    // Analyze Crave products
    const withImages = craveProducts.filter(p => p.fields.Image_url).length;
    const published = craveProducts.filter(p => p.fields.Published).length;
    const inStock = craveProducts.filter(p => p.fields['In stock?']).length;
    
    // Check for nicotine content
    const nicotineProducts = craveProducts.filter(product => {
      const contents = (product.fields.Contents || '').toLowerCase();
      const name = (product.fields.Name || '').toLowerCase();
      return contents.includes('nicotine') || name.includes('nicotine');
    });
    
    console.log(`\n📊 CRAVE ANALYSIS:`);
    console.log(`📷 With images: ${withImages}/${craveProducts.length}`);
    console.log(`📋 Published: ${published}/${craveProducts.length}`);
    console.log(`📦 In stock: ${inStock}/${craveProducts.length}`);
    console.log(`🚫 Nicotine products: ${nicotineProducts.length}/${craveProducts.length}`);
    console.log(`✅ Highway420 ready: ${craveProducts.length - nicotineProducts.length}/${craveProducts.length}`);
    
    // Show categories
    const categories = new Map();
    craveProducts.forEach(product => {
      const cats = product.fields.Categories || 'No Category';
      categories.set(cats, (categories.get(cats) || 0) + 1);
    });
    
    console.log(`\n📂 CATEGORIES:`);
    Array.from(categories.entries())
      .sort(([,a], [,b]) => b - a)
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}`);
      });
    
    // List all Crave products
    console.log(`\n📋 ALL ${craveProducts.length} CRAVE PRODUCTS:`);
    console.log('=' .repeat(60));
    
    craveProducts.forEach((product, i) => {
      const hasImage = product.fields.Image_url ? '🖼️' : '❌';
      const isNicotine = nicotineProducts.includes(product) ? '🚫' : '✅';
      const price = product.fields['Regular price'] ? `$${product.fields['Regular price']}` : 'No Price';
      
      console.log(`${String(i + 1).padStart(2, ' ')}. ${product.fields.Name || 'No Name'} ${hasImage} ${isNicotine}`);
      console.log(`    SKU: ${product.fields.SKU || 'No SKU'} | Price: ${price}`);
      console.log(`    Categories: ${product.fields.Categories || 'None'}`);
      console.log(`    Contents: ${product.fields.Contents || 'None'}`);
      console.log('');
    });
    
    return craveProducts;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  }
}

// Run the function
getAllCraveProducts()
  .then(products => {
    if (products && products.length > 0) {
      console.log(`✅ Successfully found ${products.length} Crave products!`);
    }
  })
  .catch(console.error);
