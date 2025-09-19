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

async function findMislabeledRoor() {
  console.log('🔍 FINDING MISLABELED ROOR PRODUCTS');
  console.log('=' .repeat(60));
  
  try {
    // 1. Get all RooR SKUs from Airtable (our source of truth)
    console.log('📥 Getting all RooR SKUs from Airtable...');
    
    let allRoorRecords: any[] = [];
    let offset = '';
    
    do {
      const filterFormula = `OR(FIND("Roor",{Brands}),FIND("ROOR",{Brands}),FIND("roor",{Brands}),FIND("Roor",{Name}),FIND("ROOR",{Name}),FIND("roor",{Name}))`;
      const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=${encodeURIComponent(filterFormula)}${offset ? `&offset=${offset}` : ''}`;
      
      const response = await fetch(airtableUrl, {
        headers: {
          'Authorization': `Bearer ${airtablePAT}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      const data = await response.json();
      allRoorRecords = allRoorRecords.concat(data.records || []);
      offset = data.offset || '';
      
    } while (offset);

    console.log(`✅ Found ${allRoorRecords.length} RooR products in Airtable`);

    // Extract all RooR SKUs from Airtable
    const roorSKUs = new Set();
    const roorNames = new Set();
    
    allRoorRecords.forEach(record => {
      if (record.fields.SKU) {
        roorSKUs.add(record.fields.SKU.toUpperCase());
      }
      if (record.fields.Name) {
        roorNames.add(record.fields.Name.toUpperCase());
      }
    });

    console.log(`📋 Collected ${roorSKUs.size} unique RooR SKUs and ${roorNames.size} names from Airtable`);

    // 2. Search Supabase for products with matching SKUs but different brands
    console.log('\n🔍 Searching Supabase for products with RooR SKUs...');
    
    const { data: allProducts, error } = await supabase
      .from('products')
      .select('id, name, sku, brand_id, brand_name, zoho_category_name, manufacturer')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`📊 Analyzing ${allProducts?.length || 0} products in Supabase...`);

    // 3. Find potential matches
    const potentialMatches = [];
    const exactSKUMatches = [];
    const nameMatches = [];

    for (const product of allProducts || []) {
      const productSKU = product.sku?.toUpperCase() || '';
      const productName = product.name?.toUpperCase() || '';
      
      // Check for exact SKU matches
      if (roorSKUs.has(productSKU)) {
        exactSKUMatches.push({
          product,
          matchType: 'EXACT_SKU',
          matchValue: productSKU,
          currentBrand: product.brand_name || product.zoho_category_name || product.manufacturer || 'Unknown'
        });
      }
      
      // Check for name matches with RooR keywords
      const hasRoorInName = productName.includes('ROOR') || productName.includes('ROOR') || 
                           productName.includes('BEAKER') || productName.includes('STRAIGHT') ||
                           productName.includes('ZEAKER');
      
      if (hasRoorInName && !productName.includes('ROOR')) {
        // Find the closest Airtable name match
        let bestNameMatch = '';
        let bestScore = 0;
        
        for (const airtableName of roorNames) {
          const airtableWords = airtableName.split(/\s+/);
          const productWords = productName.split(/\s+/);
          
          const commonWords = airtableWords.filter(word => 
            productWords.some(pWord => pWord.includes(word) || word.includes(pWord))
          );
          
          const score = commonWords.length / Math.max(airtableWords.length, productWords.length);
          
          if (score > bestScore && score > 0.3) {
            bestScore = score;
            bestNameMatch = airtableName;
          }
        }
        
        if (bestNameMatch) {
          nameMatches.push({
            product,
            matchType: 'NAME_SIMILARITY',
            matchValue: bestNameMatch,
            similarity: bestScore,
            currentBrand: product.brand_name || product.zoho_category_name || product.manufacturer || 'Unknown'
          });
        }
      }
    }

    // 4. Display results
    console.log('\n📊 ANALYSIS RESULTS');
    console.log('=' .repeat(60));

    console.log(`\n🎯 EXACT SKU MATCHES (${exactSKUMatches.length} found):`);
    console.log('These products have RooR SKUs but may be labeled as different brands:');
    
    exactSKUMatches.forEach((match, index) => {
      console.log(`\n${index + 1}. ${match.product.name}`);
      console.log(`   SKU: ${match.product.sku}`);
      console.log(`   Current Brand: ${match.currentBrand}`);
      console.log(`   Brand ID: ${match.product.brand_id || 'None'}`);
      console.log(`   ⚠️  SHOULD BE: RooR (based on SKU match)`);
    });

    console.log(`\n🔍 NAME SIMILARITY MATCHES (${nameMatches.length} found):`);
    console.log('These products might be RooR based on name patterns:');
    
    nameMatches.slice(0, 10).forEach((match, index) => {
      console.log(`\n${index + 1}. ${match.product.name}`);
      console.log(`   SKU: ${match.product.sku}`);
      console.log(`   Current Brand: ${match.currentBrand}`);
      console.log(`   Similarity: ${(match.similarity * 100).toFixed(1)}%`);
      console.log(`   Matched Airtable: ${match.matchValue}`);
      console.log(`   ⚠️  MIGHT BE: RooR`);
    });

    // 5. Brand analysis
    console.log('\n🏷️  BRAND ANALYSIS OF POTENTIAL ROOR PRODUCTS');
    console.log('=' .repeat(60));
    
    const brandCounts = new Map();
    [...exactSKUMatches, ...nameMatches].forEach(match => {
      const brand = match.currentBrand;
      brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
    });

    console.log('Brands that might contain mislabeled RooR products:');
    Array.from(brandCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([brand, count]) => {
        console.log(`   - ${brand}: ${count} products`);
      });

    // 6. Get all brands in Supabase for reference
    console.log('\n📋 ALL BRANDS IN SUPABASE:');
    const { data: brands } = await supabase
      .from('brands')
      .select('id, name, slug')
      .order('name');

    if (brands && brands.length > 0) {
      brands.forEach((brand, index) => {
        console.log(`   ${index + 1}. ${brand.name} (${brand.slug})`);
      });
    } else {
      console.log('   No brands found in brands table');
    }

    // 7. Summary and recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('=' .repeat(60));
    
    if (exactSKUMatches.length > 0) {
      console.log('🔧 IMMEDIATE ACTION NEEDED:');
      console.log(`   - ${exactSKUMatches.length} products have RooR SKUs but wrong brand labels`);
      console.log('   - These should be updated to the RooR brand immediately');
      console.log('   - Run with --fix-exact flag to automatically correct these');
    }
    
    if (nameMatches.length > 0) {
      console.log('\n🔍 MANUAL REVIEW RECOMMENDED:');
      console.log(`   - ${nameMatches.length} products might be mislabeled RooR products`);
      console.log('   - Review these manually to confirm they should be RooR brand');
    }

    console.log('\n📊 SUMMARY:');
    console.log(`   - RooR products in Airtable: ${allRoorRecords.length}`);
    console.log(`   - Products with RooR SKUs in Supabase: ${exactSKUMatches.length}`);
    console.log(`   - Potential mislabeled products: ${nameMatches.length}`);
    console.log(`   - Total potential RooR products found: ${exactSKUMatches.length + nameMatches.length}`);

    return { exactSKUMatches, nameMatches, allRoorRecords };

  } catch (error) {
    console.error('❌ Error finding mislabeled RooR products:', error);
    throw error;
  }
}

// Run the analysis
findMislabeledRoor().then(() => {
  console.log('\n✅ Mislabeled RooR analysis complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
