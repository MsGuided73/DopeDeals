/**
 * Simple Airtable to Supabase Image URL Sync
 *
 * Pulls Image_url field from Airtable and updates Supabase products by brand
 *
 * Usage: pnpm tsx scripts/simple-airtable-enrichment.ts [brand_name]
 * Example: pnpm tsx scripts/simple-airtable-enrichment.ts ROOR
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN!;
const airtableBaseId = process.env.AIRTABLE_BASE_ID!;
const airtableTableName = process.env.AIRTABLE_TABLE_ID || 'SigDistro';

const supabase = createClient(supabaseUrl, supabaseKey);

interface AirtableRecord {
  id: string;
  fields: {
    Image_url?: string;
    Name?: string;
    [key: string]: any;
  };
}

interface ProductMatch {
  supabaseId: string;
  supabaseName: string;
  airtableRecord: AirtableRecord;
  updates: {
    image_url?: string;
  };
}

async function fetchAirtableRecords(brandFilter?: string): Promise<AirtableRecord[]> {
  console.log(`🔍 Fetching records from Airtable table: ${airtableTableName}`);
  
  let allRecords: AirtableRecord[] = [];
  let offset = '';
  
  do {
    let url = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}?pageSize=100`;
    
    // Add brand filter if specified
    if (brandFilter) {
      const filterFormula = `FIND("${brandFilter}", {Brands}) > 0`;
      url += `&filterByFormula=${encodeURIComponent(filterFormula)}`;
    }
    
    if (offset) {
      url += `&offset=${offset}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset || '';

    console.log(`   Fetched ${data.records?.length || 0} records, total: ${allRecords.length}`);

    // Debug: Show first few records if no brand filter
    if (!brandFilter && data.records?.length > 0) {
      console.log(`   Sample records:`);
      data.records.slice(0, 3).forEach((record: any, i: number) => {
        console.log(`     ${i + 1}. Name: "${record.fields?.Name || 'N/A'}", Image_url: ${record.fields?.Image_url ? 'Yes' : 'No'}`);
      });
    }
    
  } while (offset);
  
  return allRecords;
}

async function fetchSupabaseProducts(brandFilter?: string) {
  console.log(`🔍 Fetching products from Supabase${brandFilter ? ` for brand: ${brandFilter}` : ''}`);

  let query = supabase
    .from('products')
    .select('id, name, image_url')
    .eq('is_active', true);

  if (brandFilter) {
    query = query.or(`brand_name.ilike.%${brandFilter}%,name.ilike.%${brandFilter}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  console.log(`   Found ${data?.length || 0} products in Supabase`);
  return data || [];
}

function findMatches(supabaseProducts: any[], airtableRecords: AirtableRecord[]): ProductMatch[] {
  console.log(`🎯 Finding matches between Supabase and Airtable records`);

  const matches: ProductMatch[] = [];

  for (const supabaseProduct of supabaseProducts) {
    // Try to find matching Airtable record by name similarity
    const airtableMatch = airtableRecords.find(record => {
      const airtableName = (record.fields.Name || '').toLowerCase();
      const supabaseName = (supabaseProduct.name || '').toLowerCase();

      // Extract key terms for better matching
      const extractKeyTerms = (name: string) => {
        return name
          .replace(/[|]/g, ' ') // Remove pipe characters
          .replace(/ref:/gi, '') // Remove "REF:"
          .replace(/\d+[""′]/g, '') // Remove size measurements like 18"
          .replace(/\d+mm/g, '') // Remove mm measurements
          .replace(/x\s*\d+mm/g, '') // Remove "x 5mm" type measurements
          .split(/[\s\-_]+/) // Split on spaces, dashes, underscores
          .filter(term => term.length > 2) // Keep terms longer than 2 chars
          .slice(0, 4); // Take first 4 terms
      };

      const airtableTerms = extractKeyTerms(airtableName);
      const supabaseTerms = extractKeyTerms(supabaseName);

      // Check for ROOR specific matching
      if (airtableName.includes('roor') && supabaseName.includes('roor')) {
        // For ROOR products, check if they share key terms like "beaker", "ash", "catcher", etc.
        const sharedTerms = airtableTerms.filter(term =>
          supabaseTerms.some(sTerm => sTerm.includes(term) || term.includes(sTerm))
        );

        if (sharedTerms.length >= 1) {
          console.log(`   Potential match: "${supabaseName}" <-> "${airtableName}"`);
          return true;
        }
      }

      // General matching for other products
      const sharedTerms = airtableTerms.filter(term =>
        supabaseTerms.some(sTerm => sTerm.includes(term) || term.includes(sTerm))
      );

      return sharedTerms.length >= 2; // Need at least 2 shared terms
    });

    if (airtableMatch) {
      const updates: any = {};

      // Only sync image_url field
      if (airtableMatch.fields.Image_url && airtableMatch.fields.Image_url !== supabaseProduct.image_url) {
        updates.image_url = airtableMatch.fields.Image_url;
      }

      // Only include if there are updates to make
      if (Object.keys(updates).length > 0) {
        matches.push({
          supabaseId: supabaseProduct.id,
          supabaseName: supabaseProduct.name,
          airtableRecord: airtableMatch,
          updates
        });
      }
    }
  }

  console.log(`   Found ${matches.length} products that need updates`);
  return matches;
}

async function applyUpdates(matches: ProductMatch[]): Promise<{ success: number; failed: number }> {
  console.log(`🔄 Applying updates to Supabase products`);
  
  let success = 0;
  let failed = 0;
  
  for (const match of matches) {
    try {
      const { error } = await supabase
        .from('products')
        .update(match.updates)
        .eq('id', match.supabaseId);
      
      if (error) {
        console.error(`   ❌ Failed to update ${match.supabaseName}: ${error.message}`);
        failed++;
      } else {
        console.log(`   ✅ Updated ${match.supabaseName}`);
        console.log(`      Updates: ${Object.keys(match.updates).join(', ')}`);
        success++;
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`   ❌ Error updating ${match.supabaseName}:`, error);
      failed++;
    }
  }
  
  return { success, failed };
}

async function main() {
  const brandFilter = process.argv[2]; // Get brand from command line argument
  
  console.log(`🚀 Starting Simple Airtable Image URL Sync${brandFilter ? ` for brand: ${brandFilter}` : ''}`);
  console.log(`📋 Field to sync: Image_url only`);
  
  try {
    // 1. Fetch data from both sources
    const [airtableRecords, supabaseProducts] = await Promise.all([
      fetchAirtableRecords(brandFilter),
      fetchSupabaseProducts(brandFilter)
    ]);
    
    if (airtableRecords.length === 0) {
      console.log(`⚠️  No Airtable records found${brandFilter ? ` for brand: ${brandFilter}` : ''}`);
      return;
    }
    
    if (supabaseProducts.length === 0) {
      console.log(`⚠️  No Supabase products found${brandFilter ? ` for brand: ${brandFilter}` : ''}`);
      return;
    }
    
    // 2. Find matches and determine updates needed
    const matches = findMatches(supabaseProducts, airtableRecords);
    
    if (matches.length === 0) {
      console.log(`ℹ️  No products need updates`);
      return;
    }
    
    // 3. Show preview of updates
    console.log(`\n📊 PREVIEW OF UPDATES:`);
    matches.slice(0, 5).forEach(match => {
      console.log(`   ${match.supabaseName}:`);
      Object.entries(match.updates).forEach(([field, value]) => {
        console.log(`     - ${field}: "${value}"`);
      });
    });
    
    if (matches.length > 5) {
      console.log(`   ... and ${matches.length - 5} more products`);
    }
    
    // 4. Apply updates
    const results = await applyUpdates(matches);
    
    console.log(`\n✅ ENRICHMENT COMPLETE:`);
    console.log(`   - Successfully updated: ${results.success} products`);
    console.log(`   - Failed updates: ${results.failed} products`);
    console.log(`   - Total processed: ${matches.length} products`);
    
  } catch (error) {
    console.error(`❌ Enrichment failed:`, error);
    process.exit(1);
  }
}

// Run the script
main();
