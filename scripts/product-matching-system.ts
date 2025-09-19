import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY!;
const airtableBaseId = process.env.AIRTABLE_BASE_ID!;
const airtableTableName = process.env.AIRTABLE_TABLE_ID || 'SigDistro';

if (!supabaseUrl || !supabaseKey || !airtablePAT || !airtableBaseId) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface AirtableRecord {
  id: string;
  fields: {
    SKU?: string;
    Name?: string;
    Brand?: string;
    Category?: string;
    Images?: Array<{ url: string; filename?: string }>;
    [key: string]: any;
  };
}

interface SupabaseProduct {
  id: string;
  name: string;
  sku: string;
  brand_id?: string;
  category_id?: string;
  image_url?: string;
  image_urls?: string[];
  description?: string;
  materials?: string[];
}

// Normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Extract brand from various fields
function extractBrand(record: AirtableRecord): string | null {
  const fields = record.fields;
  
  // Check Brand field first
  if (fields.Brand && fields.Brand.trim()) {
    return fields.Brand.trim();
  }
  
  // Check if brand is in the name
  const name = fields.Name || '';
  const brandPatterns = [
    /^(ROOR|RooR|Roor)\b/i,
    /^(RAW|Raw)\b/i,
    /^(GRAV|Grav)\b/i,
    /^(PUFFCO|Puffco)\b/i,
    /^(STORZ|Storz)\b/i,
    /^(EMPIRE|Empire)\b/i,
    /^(HIGHER|Higher)\b/i,
    /\b(ROOR|RooR|Roor)\b/i,
    /\b(RAW|Raw)\s+(Papers|Rolling)/i,
    /\b(GRAV|Grav)\s+(Labs|Glass)/i,
  ];
  
  for (const pattern of brandPatterns) {
    const match = name.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  
  return null;
}

// Calculate similarity score between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeText(str1);
  const norm2 = normalizeText(str2);
  
  if (norm1 === norm2) return 1.0;
  
  // Jaccard similarity using word sets
  const words1 = new Set(norm1.split(' '));
  const words2 = new Set(norm2.split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// Match Airtable record to Supabase product
function findBestMatch(airtableRecord: AirtableRecord, supabaseProducts: SupabaseProduct[]): {
  product: SupabaseProduct;
  score: number;
  matchType: string;
} | null {
  const airtableSKU = airtableRecord.fields.SKU || '';
  const airtableName = airtableRecord.fields.Name || '';
  const airtableBrand = extractBrand(airtableRecord);
  
  let bestMatch: { product: SupabaseProduct; score: number; matchType: string } | null = null;
  
  for (const product of supabaseProducts) {
    let score = 0;
    let matchType = '';
    
    // 1. Exact SKU match (highest priority)
    if (airtableSKU && product.sku && normalizeText(airtableSKU) === normalizeText(product.sku)) {
      score = 1.0;
      matchType = 'exact_sku';
    }
    // 2. Partial SKU match
    else if (airtableSKU && product.sku) {
      const skuSimilarity = calculateSimilarity(airtableSKU, product.sku);
      if (skuSimilarity > 0.8) {
        score = 0.9 * skuSimilarity;
        matchType = 'partial_sku';
      }
    }
    
    // 3. Name similarity with brand matching
    if (score < 0.8) {
      const nameSimilarity = calculateSimilarity(airtableName, product.name);
      if (nameSimilarity > 0.7) {
        score = Math.max(score, 0.7 * nameSimilarity);
        matchType = score === 0.7 * nameSimilarity ? 'name_similarity' : matchType;
        
        // Boost score if brands match
        if (airtableBrand) {
          const productBrand = extractBrandFromSupabaseProduct(product);
          if (productBrand && normalizeText(airtableBrand) === normalizeText(productBrand)) {
            score += 0.2;
            matchType += '_brand_match';
          }
        }
      }
    }
    
    // Update best match if this is better
    if (score > 0.7 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { product, score, matchType };
    }
  }
  
  return bestMatch;
}

// Extract brand from Supabase product
function extractBrandFromSupabaseProduct(product: SupabaseProduct): string | null {
  // Check if brand info is in materials or description
  const searchText = `${product.name} ${product.description || ''} ${(product.materials || []).join(' ')}`;
  
  const brandPatterns = [
    /\b(ROOR|RooR|Roor)\b/i,
    /\b(RAW|Raw)\b/i,
    /\b(GRAV|Grav)\b/i,
    /\b(PUFFCO|Puffco)\b/i,
    /\b(STORZ|Storz)\b/i,
    /\b(EMPIRE|Empire)\b/i,
    /\b(HIGHER|Higher)\b/i,
  ];
  
  for (const pattern of brandPatterns) {
    const match = searchText.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  
  return null;
}

// Fetch all Airtable records
async function fetchAirtableRecords(): Promise<AirtableRecord[]> {
  console.log('📥 Fetching Airtable records...');
  
  let allRecords: AirtableRecord[] = [];
  let offset = '';
  
  do {
    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}${offset ? `?offset=${offset}` : ''}`;
    
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
    allRecords = allRecords.concat(data.records || []);
    offset = data.offset || '';
    
    console.log(`   Fetched ${data.records?.length || 0} records, total: ${allRecords.length}`);
  } while (offset);
  
  return allRecords;
}

// Fetch all Supabase products
async function fetchSupabaseProducts(): Promise<SupabaseProduct[]> {
  console.log('📥 Fetching Supabase products...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, sku, brand_id, category_id, image_url, image_urls, description, materials');
  
  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }
  
  console.log(`   Found ${products?.length || 0} products in Supabase`);
  return products || [];
}

// Main matching function
async function runProductMatching() {
  console.log('🔄 STARTING PRODUCT MATCHING SYSTEM');
  console.log('=' .repeat(60));
  
  try {
    // Fetch data from both sources
    const [airtableRecords, supabaseProducts] = await Promise.all([
      fetchAirtableRecords(),
      fetchSupabaseProducts()
    ]);
    
    console.log(`\n📊 Data Summary:`);
    console.log(`   - Airtable records: ${airtableRecords.length}`);
    console.log(`   - Supabase products: ${supabaseProducts.length}`);
    
    // Filter Airtable records that have images
    const recordsWithImages = airtableRecords.filter(record => 
      record.fields.Images && record.fields.Images.length > 0
    );
    
    console.log(`   - Airtable records with images: ${recordsWithImages.length}`);
    
    // Process matches
    const matches: Array<{
      airtableRecord: AirtableRecord;
      supabaseProduct: SupabaseProduct;
      score: number;
      matchType: string;
    }> = [];
    
    const unmatched: AirtableRecord[] = [];
    
    console.log('\n🔍 Processing matches...');
    
    for (const record of recordsWithImages) {
      const match = findBestMatch(record, supabaseProducts);
      
      if (match) {
        matches.push({
          airtableRecord: record,
          supabaseProduct: match.product,
          score: match.score,
          matchType: match.matchType
        });
      } else {
        unmatched.push(record);
      }
    }
    
    // Sort matches by score (best first)
    matches.sort((a, b) => b.score - a.score);
    
    console.log(`\n📈 Matching Results:`);
    console.log(`   - Successful matches: ${matches.length}`);
    console.log(`   - Unmatched records: ${unmatched.length}`);
    console.log(`   - Match rate: ${((matches.length / recordsWithImages.length) * 100).toFixed(1)}%`);
    
    // Show sample matches
    console.log('\n🎯 Sample Matches (Top 10):');
    matches.slice(0, 10).forEach((match, index) => {
      console.log(`${index + 1}. ${match.airtableRecord.fields.Name} → ${match.supabaseProduct.name}`);
      console.log(`   Score: ${(match.score * 100).toFixed(1)}% | Type: ${match.matchType}`);
      console.log(`   Images: ${match.airtableRecord.fields.Images?.length || 0}`);
      console.log('');
    });
    
    return { matches, unmatched, recordsWithImages };
    
  } catch (error) {
    console.error('❌ Matching system error:', error);
    throw error;
  }
}

// Export for use in other scripts
export { runProductMatching, findBestMatch, extractBrand };

// Run if called directly (ES module compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  runProductMatching()
    .then(() => {
      console.log('✅ Product matching analysis complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Product matching failed:', error);
      process.exit(1);
    });
}
