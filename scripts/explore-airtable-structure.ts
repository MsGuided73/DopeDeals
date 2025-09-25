import { config } from 'dotenv';

config({ path: '.env.local' });

const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE!;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_ID || process.env.AIRTABLE_TABLE || 'Products';

async function exploreAirtableStructure() {
  console.log('🔍 Exploring Airtable structure...\n');
  console.log(`Base ID: ${AIRTABLE_BASE_ID}`);
  console.log(`Table: ${AIRTABLE_TABLE_NAME}\n`);
  
  try {
    // Fetch first 5 records to see structure
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=5`;
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const records = data.records || [];
    
    console.log(`📊 Found ${records.length} records\n`);
    
    // Analyze field structure
    const allFields = new Set<string>();
    const imageFields = new Set<string>();
    
    records.forEach((record: any, index: number) => {
      console.log(`📝 Record ${index + 1} (ID: ${record.id}):`);
      
      const fields = record.fields || {};
      Object.keys(fields).forEach(fieldName => {
        allFields.add(fieldName);
        
        const fieldValue = fields[fieldName];
        
        // Check if this might be an image field
        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
          const firstItem = fieldValue[0];
          if (firstItem && typeof firstItem === 'object' && firstItem.url) {
            imageFields.add(fieldName);
            console.log(`   🖼️  ${fieldName}: ${fieldValue.length} images`);
            fieldValue.forEach((img: any, imgIndex: number) => {
              console.log(`      ${imgIndex + 1}. ${img.filename || 'Unknown'} (${img.type || 'Unknown type'})`);
            });
          } else {
            console.log(`   📋 ${fieldName}: [${fieldValue.length} items] ${JSON.stringify(fieldValue).substring(0, 100)}...`);
          }
        } else if (fieldValue && typeof fieldValue === 'string' && fieldValue.length > 0) {
          console.log(`   📝 ${fieldName}: ${fieldValue.substring(0, 50)}${fieldValue.length > 50 ? '...' : ''}`);
        } else {
          console.log(`   📄 ${fieldName}: ${JSON.stringify(fieldValue)}`);
        }
      });
      console.log('');
    });
    
    console.log(`📋 All Fields Found (${allFields.size}):`);
    Array.from(allFields).sort().forEach(field => {
      const isImageField = imageFields.has(field);
      console.log(`   ${isImageField ? '🖼️ ' : '📝 '} ${field}`);
    });
    
    if (imageFields.size > 0) {
      console.log(`\n🖼️  Image Fields Found (${imageFields.size}):`);
      Array.from(imageFields).forEach(field => {
        console.log(`   - ${field}`);
      });
    } else {
      console.log(`\n❌ No image fields found in the first ${records.length} records`);
      console.log(`   Try checking more records or different field names`);
    }
    
    // Check for common image field variations
    const commonImageFieldNames = [
      'Images', 'Image', 'Photos', 'Photo', 'Pictures', 'Picture', 
      'Attachments', 'Files', 'Media', 'Gallery', 'Thumbnail',
      'Product Images', 'Product Photos', 'Main Image'
    ];
    
    console.log(`\n🔍 Checking for common image field names:`);
    commonImageFieldNames.forEach(fieldName => {
      const hasField = allFields.has(fieldName);
      console.log(`   ${hasField ? '✅' : '❌'} ${fieldName}`);
    });
    
  } catch (error) {
    console.error('❌ Error exploring Airtable:', error);
  }
}

exploreAirtableStructure().catch(console.error);
