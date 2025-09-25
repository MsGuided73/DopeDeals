import { config } from 'dotenv';

config({ path: '.env.local' });

async function extractCraveProducts() {
  console.log('🔍 EXTRACTING ALL CRAVE PRODUCTS FROM AIRTABLE');
  console.log('=' .repeat(60));
  
  try {
    // Fetch all records from Airtable
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?maxRecords=200`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`📊 Total records fetched: ${data.records.length}\n`);
    
    // Filter for Crave products
    const craveProducts = data.records.filter((record: any) => {
      const name = (record.fields.Name || '').toLowerCase();
      const sku = (record.fields.SKU || '').toLowerCase();
      
      return name.includes('crave') || sku.includes('crave');
    });
    
    console.log(`🏷️  FOUND ${craveProducts.length} CRAVE PRODUCTS:`);
    console.log('=' .repeat(60));
    
    craveProducts.forEach((product: any, index: number) => {
      console.log(`\n${index + 1}. ${product.fields.Name || 'No Name'}`);
      console.log(`   📦 SKU: ${product.fields.SKU || 'No SKU'}`);
      console.log(`   💰 Price: $${product.fields['Regular price'] || 'No Price'}`);
      console.log(`   📷 Image: ${product.fields.Image_url ? '✅ Has Image' : '❌ No Image'}`);
      console.log(`   🔗 Image URL: ${product.fields.Image_url || 'None'}`);
      console.log(`   📂 Type: ${Array.isArray(product.fields.Type) ? product.fields.Type.join(', ') : product.fields.Type || 'No Type'}`);
      console.log(`   📋 Published: ${product.fields.Published ? 'Yes' : 'No'}`);
      console.log(`   👁️  Visibility: ${product.fields['Visibility in catalog'] || 'Unknown'}`);
      console.log(`   📦 In Stock: ${product.fields['In stock?'] ? 'Yes' : 'No'}`);
      
      // Show any attributes that might contain additional info
      const attributes = [];
      for (let i = 1; i <= 10; i++) {
        const attrName = product.fields[`Attribute ${i} name`];
        const attrValue = product.fields[`Attribute ${i} value(s)`];
        if (attrName && attrValue) {
          attributes.push(`${attrName}: ${Array.isArray(attrValue) ? attrValue.join(', ') : attrValue}`);
        }
      }
      
      if (attributes.length > 0) {
        console.log(`   🏷️  Attributes: ${attributes.join(' | ')}`);
      }
      
      console.log(`   🆔 Record ID: ${product.id}`);
    });
    
    // Summary statistics
    console.log('\n📊 CRAVE PRODUCTS SUMMARY:');
    console.log('=' .repeat(40));
    
    const withImages = craveProducts.filter(p => p.fields.Image_url).length;
    const published = craveProducts.filter(p => p.fields.Published).length;
    const inStock = craveProducts.filter(p => p.fields['In stock?']).length;
    const withPrices = craveProducts.filter(p => p.fields['Regular price']).length;
    
    console.log(`📷 Products with images: ${withImages}/${craveProducts.length}`);
    console.log(`📋 Published products: ${published}/${craveProducts.length}`);
    console.log(`📦 In stock products: ${inStock}/${craveProducts.length}`);
    console.log(`💰 Products with prices: ${withPrices}/${craveProducts.length}`);
    
    // Show unique types
    const types = new Set();
    craveProducts.forEach(product => {
      const type = product.fields.Type;
      if (Array.isArray(type)) {
        type.forEach(t => types.add(t));
      } else if (type) {
        types.add(type);
      }
    });
    
    console.log(`📂 Product types: ${Array.from(types).join(', ')}`);
    
    // Show price range
    const prices = craveProducts
      .map(p => parseFloat(p.fields['Regular price']))
      .filter(p => !isNaN(p))
      .sort((a, b) => a - b);
    
    if (prices.length > 0) {
      console.log(`💰 Price range: $${prices[0]} - $${prices[prices.length - 1]}`);
    }
    
    // Export to JSON for further analysis
    const exportData = craveProducts.map(product => ({
      id: product.id,
      name: product.fields.Name,
      sku: product.fields.SKU,
      price: product.fields['Regular price'],
      image_url: product.fields.Image_url,
      type: product.fields.Type,
      published: product.fields.Published,
      in_stock: product.fields['In stock?'],
      visibility: product.fields['Visibility in catalog'],
      attributes: Object.keys(product.fields)
        .filter(key => key.startsWith('Attribute') && key.includes('name'))
        .map(nameKey => {
          const num = nameKey.match(/\d+/)?.[0];
          const valueKey = `Attribute ${num} value(s)`;
          return {
            name: product.fields[nameKey],
            value: product.fields[valueKey]
          };
        })
        .filter(attr => attr.name && attr.value)
    }));
    
    console.log(`\n💾 Export data prepared for ${exportData.length} Crave products`);
    
    return exportData;
    
  } catch (error) {
    console.error('❌ Error extracting Crave products:', error);
    return [];
  }
}

// Run the extraction
extractCraveProducts()
  .then(data => {
    if (data.length > 0) {
      console.log('\n✅ Crave product extraction completed successfully!');
    }
  })
  .catch(console.error);
