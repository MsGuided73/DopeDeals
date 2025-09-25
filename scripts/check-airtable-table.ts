import { config } from 'dotenv';

config({ path: '.env.local' });

const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

console.log('🔍 Airtable Configuration Check:');
console.log('Base ID:', AIRTABLE_BASE_ID);
console.log('Table ID:', AIRTABLE_TABLE_ID);
console.log('PAT:', AIRTABLE_PAT ? 'Present' : 'Missing');

async function exploreAirtableTable() {
  try {
    // Try with table ID first
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?maxRecords=3`;
    console.log('\n📡 Trying URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Found', data.records?.length || 0, 'records');
      
      if (data.records && data.records.length > 0) {
        console.log('\n📋 Sample record fields:');
        const sampleRecord = data.records[0];
        console.log('Record ID:', sampleRecord.id);
        console.log('Available Fields:', Object.keys(sampleRecord.fields));
        
        // Show first few field values
        console.log('\n📝 Sample field values:');
        Object.entries(sampleRecord.fields).slice(0, 8).forEach(([key, value]) => {
          const displayValue = typeof value === 'string' 
            ? value.substring(0, 100) + (value.length > 100 ? '...' : '')
            : Array.isArray(value) 
              ? `[Array with ${value.length} items]`
              : value;
          console.log(`  ${key}: ${displayValue}`);
        });
        
        // Check for image fields specifically
        console.log('\n🖼️  Image-related fields:');
        Object.entries(sampleRecord.fields).forEach(([key, value]) => {
          if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('picture')) {
            console.log(`  ${key}: ${value}`);
          }
        });
        
        // Check for brand fields
        console.log('\n🏷️  Brand-related fields:');
        Object.entries(sampleRecord.fields).forEach(([key, value]) => {
          if (key.toLowerCase().includes('brand') || key.toLowerCase().includes('manufacturer')) {
            console.log(`  ${key}: ${value}`);
          }
        });
        
        // Check for category fields
        console.log('\n📂 Category-related fields:');
        Object.entries(sampleRecord.fields).forEach(([key, value]) => {
          if (key.toLowerCase().includes('category') || key.toLowerCase().includes('type') || key.toLowerCase().includes('class')) {
            console.log(`  ${key}: ${value}`);
          }
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      
      // Try with table name instead
      console.log('\n🔄 Trying with table name "Products"...');
      const urlWithName = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Products?maxRecords=3`;
      
      const response2 = await fetch(urlWithName, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Response status (with name):', response2.status);
      
      if (response2.ok) {
        const data2 = await response2.json();
        console.log('✅ Success with table name! Found', data2.records?.length || 0, 'records');
      } else {
        const errorText2 = await response2.text();
        console.log('❌ Error with table name:', errorText2);
      }
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

exploreAirtableTable().catch(console.error);
