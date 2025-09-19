import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY!;
const airtableBaseId = process.env.AIRTABLE_BASE_ID!;
const airtableTableName = process.env.AIRTABLE_TABLE_ID || 'SigDistro';

async function checkAllAirtableFields() {
  console.log('🔍 COMPREHENSIVE AIRTABLE FIELD ANALYSIS');
  console.log('=' .repeat(60));
  console.log(`Base ID: ${airtableBaseId}`);
  console.log(`Table: ${airtableTableName}`);
  console.log('');

  try {
    // Get first 20 records to analyze all possible fields
    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?maxRecords=20`;
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    
    if (!data.records || data.records.length === 0) {
      console.log('❌ No records found in table');
      return;
    }

    console.log(`✅ Found ${data.records.length} records`);
    
    // Collect all unique field names across all records
    const allFields = new Set<string>();
    const fieldSamples: Record<string, any[]> = {};
    
    data.records.forEach((record: any) => {
      Object.keys(record.fields).forEach(fieldName => {
        allFields.add(fieldName);
        if (!fieldSamples[fieldName]) {
          fieldSamples[fieldName] = [];
        }
        const value = record.fields[fieldName];
        if (value !== null && value !== undefined && value !== '') {
          fieldSamples[fieldName].push(value);
        }
      });
    });

    console.log(`\n📊 ALL AVAILABLE FIELDS (${allFields.size} total):`);
    console.log('=' .repeat(60));
    
    // Sort fields alphabetically
    const sortedFields = Array.from(allFields).sort();
    
    sortedFields.forEach((fieldName, index) => {
      const samples = fieldSamples[fieldName] || [];
      const uniqueSamples = [...new Set(samples)].slice(0, 3); // First 3 unique values
      
      console.log(`${index + 1}. "${fieldName}"`);
      console.log(`   Sample values (${samples.length} records have data):`);
      
      if (uniqueSamples.length > 0) {
        uniqueSamples.forEach(sample => {
          const displayValue = typeof sample === 'object' 
            ? JSON.stringify(sample).substring(0, 100) + '...'
            : String(sample).substring(0, 100);
          console.log(`   - ${displayValue}`);
        });
      } else {
        console.log('   - (no data in sample records)');
      }
      console.log('');
    });

    // Look specifically for brand-related fields
    console.log('🏷️  BRAND-RELATED FIELD ANALYSIS:');
    console.log('=' .repeat(60));
    
    const brandFields = sortedFields.filter(field => 
      field.toLowerCase().includes('brand') || 
      field.toLowerCase().includes('manufacturer') ||
      field.toLowerCase().includes('make')
    );
    
    if (brandFields.length > 0) {
      console.log('✅ Found potential brand fields:');
      brandFields.forEach(field => {
        const samples = fieldSamples[field] || [];
        console.log(`   - "${field}": ${samples.length} records with data`);
        if (samples.length > 0) {
          console.log(`     Sample: ${samples[0]}`);
        }
      });
    } else {
      console.log('❌ No obvious brand-related fields found');
    }

    // Look for RooR in any field
    console.log('\n🔍 SEARCHING FOR "ROOR" IN ALL FIELDS:');
    console.log('=' .repeat(60));
    
    let roorFound = false;
    
    data.records.forEach((record: any, recordIndex: number) => {
      Object.entries(record.fields).forEach(([fieldName, value]) => {
        if (value && typeof value === 'string' && value.toUpperCase().includes('ROOR')) {
          console.log(`✅ Found ROOR in record ${recordIndex + 1}:`);
          console.log(`   Field: "${fieldName}"`);
          console.log(`   Value: "${value}"`);
          console.log('');
          roorFound = true;
        }
      });
    });
    
    if (!roorFound) {
      console.log('❌ No "ROOR" found in any field of the sample records');
      console.log('   This could mean:');
      console.log('   - RooR products are not in the first 20 records');
      console.log('   - RooR is spelled differently (Roor, RooR, etc.)');
      console.log('   - RooR products are in a different table');
    }

  } catch (error) {
    console.error('❌ Error analyzing fields:', error);
  }
}

// Run the analysis
checkAllAirtableFields().then(() => {
  console.log('\n✅ Field analysis complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
