import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY!;
const airtableBaseId = process.env.AIRTABLE_BASE_ID!;
const airtableTableName = process.env.AIRTABLE_TABLE_ID || 'SigDistro';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeDataStructure() {
  console.log('🔍 ANALYZING DATA STRUCTURE FOR BETTER MATCHING');
  console.log('=' .repeat(60));

  try {
    // 1. Analyze Airtable structure
    console.log('\n📊 STEP 1: Analyzing Airtable Data Structure');
    
    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?maxRecords=10`;
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const sampleRecord = data.records?.[0];
    
    if (sampleRecord) {
      console.log('✅ Sample Airtable record structure:');
      console.log('   Fields available:', Object.keys(sampleRecord.fields));
      
      // Show sample values for key fields
      const keyFields = ['SKU', 'Name', 'Brand', 'Category', 'Images'];
      keyFields.forEach(field => {
        const value = sampleRecord.fields[field];
        if (value !== undefined) {
          console.log(`   ${field}:`, typeof value === 'object' ? JSON.stringify(value).substring(0, 100) + '...' : value);
        }
      });
    }

    // 2. Analyze Supabase structure
    console.log('\n📊 STEP 2: Analyzing Supabase Data Structure');
    
    const { data: supabaseProducts } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (supabaseProducts && supabaseProducts.length > 0) {
      console.log('✅ Sample Supabase product structure:');
      console.log('   Fields available:', Object.keys(supabaseProducts[0]));
      
      // Show sample values
      const sampleProduct = supabaseProducts[0];
      console.log(`   name: ${sampleProduct.name}`);
      console.log(`   sku: ${sampleProduct.sku}`);
      console.log(`   brand_id: ${sampleProduct.brand_id}`);
      console.log(`   image_url: ${sampleProduct.image_url || 'null'}`);
      console.log(`   image_urls: ${JSON.stringify(sampleProduct.image_urls) || 'null'}`);
    }

    // 3. Find RooR products in both systems
    console.log('\n📊 STEP 3: Analyzing RooR Products Specifically');
    
    // Airtable RooR products
    const roorAirtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=OR(FIND("ROOR",{Name}),FIND("RooR",{Name}),FIND("Roor",{Name}),FIND("ROOR",{Brand}),FIND("RooR",{Brand}),FIND("Roor",{Brand}))&maxRecords=10`;
    const roorResponse = await fetch(roorAirtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });

    const roorData = await roorResponse.json();
    console.log(`✅ Found ${roorData.records?.length || 0} RooR products in Airtable (sample)`);
    
    if (roorData.records && roorData.records.length > 0) {
      console.log('   Sample RooR products from Airtable:');
      roorData.records.slice(0, 5).forEach((record: any, index: number) => {
        console.log(`   ${index + 1}. Name: ${record.fields.Name}`);
        console.log(`      SKU: ${record.fields.SKU || 'N/A'}`);
        console.log(`      Brand: ${record.fields.Brand || 'N/A'}`);
        console.log(`      Images: ${record.fields.Images ? (Array.isArray(record.fields.Images) ? record.fields.Images.length : 'Has images') : 'No images'}`);
        console.log('');
      });
    }

    // Supabase RooR products
    const { data: roorSupabase } = await supabase
      .from('products')
      .select('name, sku, brand_id, image_url, image_urls')
      .or('name.ilike.%ROOR%,sku.ilike.%ROOR%,description.ilike.%ROOR%')
      .limit(10);

    console.log(`✅ Found ${roorSupabase?.length || 0} RooR products in Supabase (sample)`);
    
    if (roorSupabase && roorSupabase.length > 0) {
      console.log('   Sample RooR products from Supabase:');
      roorSupabase.forEach((product: any, index: number) => {
        console.log(`   ${index + 1}. Name: ${product.name}`);
        console.log(`      SKU: ${product.sku}`);
        console.log(`      Brand ID: ${product.brand_id || 'N/A'}`);
        console.log(`      Has Images: ${product.image_url || product.image_urls ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    // 4. Analyze SKU patterns
    console.log('\n📊 STEP 4: Analyzing SKU Patterns');
    
    // Get sample SKUs from both systems
    const { data: supabaseSKUs } = await supabase
      .from('products')
      .select('sku')
      .limit(20);

    const airtableSKUsUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?fields[]=SKU&maxRecords=20`;
    const skuResponse = await fetch(airtableSKUsUrl, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });
    const skuData = await skuResponse.json();

    console.log('✅ Sample SKU patterns:');
    console.log('   Supabase SKUs:');
    supabaseSKUs?.slice(0, 10).forEach((product: any, index: number) => {
      console.log(`   ${index + 1}. ${product.sku}`);
    });

    console.log('   Airtable SKUs:');
    skuData.records?.slice(0, 10).forEach((record: any, index: number) => {
      if (record.fields.SKU) {
        console.log(`   ${index + 1}. ${record.fields.SKU}`);
      }
    });

    // 5. Brand analysis
    console.log('\n📊 STEP 5: Brand Analysis');
    
    const { data: brands } = await supabase
      .from('brands')
      .select('id, name, slug');

    console.log(`✅ Brands in Supabase: ${brands?.length || 0}`);
    if (brands && brands.length > 0) {
      console.log('   Sample brands:');
      brands.slice(0, 10).forEach((brand: any, index: number) => {
        console.log(`   ${index + 1}. ${brand.name} (${brand.slug})`);
      });
    }

    // Get unique brands from Airtable
    const brandUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?fields[]=Brand&maxRecords=100`;
    const brandResponse = await fetch(brandUrl, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });
    const brandData = await brandResponse.json();
    
    const airtableBrands = new Set();
    brandData.records?.forEach((record: any) => {
      if (record.fields.Brand) {
        airtableBrands.add(record.fields.Brand);
      }
    });

    console.log(`✅ Unique brands in Airtable (sample): ${airtableBrands.size}`);
    console.log('   Sample Airtable brands:');
    Array.from(airtableBrands).slice(0, 15).forEach((brand: any, index: number) => {
      console.log(`   ${index + 1}. ${brand}`);
    });

    // 6. Recommendations
    console.log('\n📊 STEP 6: Matching Strategy Recommendations');
    console.log('=' .repeat(60));
    
    console.log('🔧 RECOMMENDATIONS FOR IMPROVED MATCHING:');
    console.log('');
    console.log('1. **SKU Normalization**: Create fuzzy SKU matching that handles:');
    console.log('   - Different prefixes/suffixes between systems');
    console.log('   - Case variations');
    console.log('   - Special character differences');
    console.log('');
    console.log('2. **Name-Based Matching**: Implement intelligent name matching:');
    console.log('   - Extract key product identifiers (model numbers, sizes)');
    console.log('   - Brand name extraction from product names');
    console.log('   - Keyword-based similarity scoring');
    console.log('');
    console.log('3. **Brand Standardization**: Create brand mapping table:');
    console.log('   - Map Airtable brand names to Supabase brand IDs');
    console.log('   - Handle brand name variations (ROOR vs RooR vs Roor)');
    console.log('');
    console.log('4. **Multi-Stage Matching**: Implement cascading match strategy:');
    console.log('   - Stage 1: Exact SKU match');
    console.log('   - Stage 2: Fuzzy SKU match');
    console.log('   - Stage 3: Brand + name similarity');
    console.log('   - Stage 4: Name-only similarity with high threshold');
    console.log('');
    console.log('5. **Manual Review Queue**: For unmatched high-value products');

  } catch (error) {
    console.error('❌ Analysis error:', error);
  }
}

// Run the analysis
analyzeDataStructure().then(() => {
  console.log('\n✅ Data structure analysis complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
