import { config } from 'dotenv';

config({ path: '.env.local' });

async function analyzeAirtableBrands() {
  console.log('🔍 ANALYZING AIRTABLE BRANDS');
  console.log('=' .repeat(40));
  
  try {
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?maxRecords=100`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`📊 Found ${data.records.length} total records\n`);
    
    const brands = {
      puffco: [] as any[],
      roor: [] as any[],
      crave: [] as any[],
      cookies: [] as any[],
      raw: [] as any[],
      other: [] as any[]
    };
    
    data.records.forEach((record: any) => {
      const name = (record.fields.Name || '').toLowerCase();
      const sku = (record.fields.SKU || '').toLowerCase();
      const hasImage = !!record.fields.Image_url;
      
      const product = {
        name: record.fields.Name,
        sku: record.fields.SKU,
        hasImage,
        imageUrl: record.fields.Image_url
      };
      
      if (name.includes('puffco') || sku.includes('puffco')) {
        brands.puffco.push(product);
      } else if (name.includes('roor') || sku.includes('roor')) {
        brands.roor.push(product);
      } else if (name.includes('crave') || sku.includes('crave')) {
        brands.crave.push(product);
      } else if (name.includes('cookies') || sku.includes('cookies')) {
        brands.cookies.push(product);
      } else if (name.includes('raw') || sku.includes('raw')) {
        brands.raw.push(product);
      } else {
        brands.other.push(product);
      }
    });
    
    // Report findings
    Object.entries(brands).forEach(([brandName, products]) => {
      console.log(`🏷️  ${brandName.toUpperCase()}: ${products.length} products`);
      
      if (products.length > 0) {
        const withImages = products.filter(p => p.hasImage).length;
        console.log(`   📸 With images: ${withImages}/${products.length}`);
        
        // Show first few products
        products.slice(0, 3).forEach(product => {
          console.log(`   - ${product.name} (${product.sku || 'No SKU'}) ${product.hasImage ? '🖼️' : '❌'}`);
        });
        
        if (products.length > 3) {
          console.log(`   ... and ${products.length - 3} more`);
        }
      }
      console.log('');
    });
    
    // Show some sample "other" products to understand what's available
    console.log('🔍 SAMPLE OTHER PRODUCTS (first 15):');
    brands.other.slice(0, 15).forEach(product => {
      console.log(`   - ${product.name} (${product.sku || 'No SKU'}) ${product.hasImage ? '🖼️' : '❌'}`);
    });
    
    // Analyze image URLs for brand patterns
    console.log('\n🖼️  IMAGE URL ANALYSIS:');
    const allProductsWithImages = Object.values(brands).flat().filter(p => p.hasImage);
    console.log(`Total products with images: ${allProductsWithImages.length}`);
    
    // Extract potential brands from image URLs
    const urlBrands = new Set<string>();
    allProductsWithImages.forEach(product => {
      const url = product.imageUrl.toLowerCase();
      const filename = url.split('/').pop() || '';
      
      // Look for brand patterns in filename
      const brandPatterns = ['puffco', 'roor', 'cookies', 'raw', 'crave', 'grav', 'empire'];
      brandPatterns.forEach(brand => {
        if (filename.includes(brand)) {
          urlBrands.add(brand);
        }
      });
    });
    
    console.log('Brands found in image URLs:', Array.from(urlBrands).join(', '));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

analyzeAirtableBrands();
