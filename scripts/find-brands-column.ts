import { config } from 'dotenv';

config({ path: '.env.local' });

async function findBrandsColumn() {
  console.log('🔍 SEARCHING FOR BRANDS COLUMN');
  console.log('=' .repeat(40));
  
  try {
    // Fetch more records to get a complete field list
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?maxRecords=50`, {
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
    console.log(`📊 Fetched ${data.records.length} records`);
    
    // Collect all unique field names
    const allFields = new Set<string>();
    data.records.forEach((record: any) => {
      Object.keys(record.fields).forEach(field => allFields.add(field));
    });
    
    console.log(`\n📋 FOUND ${allFields.size} UNIQUE FIELDS:`);
    const sortedFields = Array.from(allFields).sort();
    sortedFields.forEach((field, i) => {
      console.log(`${String(i + 1).padStart(2, ' ')}. ${field}`);
    });
    
    // Look for BRANDS field (case insensitive)
    console.log('\n🏷️  SEARCHING FOR BRANDS FIELD:');
    const brandFields = sortedFields.filter(field => 
      field.toUpperCase().includes('BRAND') || 
      field.toUpperCase() === 'BRANDS' ||
      field.toLowerCase().includes('brand')
    );
    
    if (brandFields.length > 0) {
      console.log(`✅ Found ${brandFields.length} brand-related field(s):`);
      brandFields.forEach(field => console.log(`   - "${field}"`));
      
      // Show sample data from brand fields
      console.log('\n📊 SAMPLE BRAND DATA:');
      let sampleCount = 0;
      
      for (const record of data.records) {
        if (sampleCount >= 10) break;
        
        let hasBrandData = false;
        const brandData: any = {};
        
        brandFields.forEach(field => {
          if (record.fields[field]) {
            brandData[field] = record.fields[field];
            hasBrandData = true;
          }
        });
        
        if (hasBrandData) {
          sampleCount++;
          console.log(`\n${sampleCount}. ${record.fields.Name || 'No Name'}`);
          Object.entries(brandData).forEach(([field, value]) => {
            console.log(`   ${field}: ${value}`);
          });
        }
      }
      
      if (sampleCount === 0) {
        console.log('❌ No records found with brand data');
      }
      
    } else {
      console.log('❌ No BRANDS field found');
      
      // Look for other fields that might contain brand info
      console.log('\n🔍 OTHER FIELDS THAT MIGHT CONTAIN BRAND INFO:');
      const possibleBrandFields = sortedFields.filter(field => 
        field.toLowerCase().includes('manufacturer') ||
        field.toLowerCase().includes('vendor') ||
        field.toLowerCase().includes('supplier') ||
        field.toLowerCase().includes('company') ||
        field.toLowerCase().includes('make')
      );
      
      if (possibleBrandFields.length > 0) {
        possibleBrandFields.forEach(field => console.log(`   - "${field}"`));
      } else {
        console.log('   None found');
      }
    }
    
    // Also check if brand info might be in product names
    console.log('\n🔍 CHECKING PRODUCT NAMES FOR BRAND PATTERNS:');
    const brandPatterns = ['puffco', 'roor', 'crave', 'cookies', 'raw', 'grav', 'empire', 'storz', 'bickel'];
    const foundBrands = new Set<string>();
    
    data.records.forEach((record: any) => {
      const name = (record.fields.Name || '').toLowerCase();
      brandPatterns.forEach(brand => {
        if (name.includes(brand)) {
          foundBrands.add(brand);
        }
      });
    });
    
    if (foundBrands.size > 0) {
      console.log('✅ Brands found in product names:');
      Array.from(foundBrands).forEach(brand => console.log(`   - ${brand}`));
    } else {
      console.log('❌ No recognizable brands found in product names');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

findBrandsColumn();
