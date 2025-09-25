import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE!;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_ID || process.env.AIRTABLE_TABLE || 'Products';

interface AirtableRecord {
  id: string;
  fields: {
    SKU?: string;
    Name?: string;
    Image_url?: string;
    Brands?: string;
    Categories?: string;
    [key: string]: any;
  };
}

interface SupabaseProduct {
  id: string;
  sku: string;
  name: string;
  image_url?: string;
  brand_name?: string;
}

// Puffco-specific matching function
function calculatePuffcoMatchScore(airtableRecord: AirtableRecord, supabaseProduct: SupabaseProduct): number {
  let score = 0;
  
  const airtableName = (airtableRecord.fields.Name || '').toLowerCase();
  const airtableSKU = (airtableRecord.fields.SKU || '').toLowerCase();
  const airtableBrands = (airtableRecord.fields.Brands || '').toLowerCase();
  const airtableCategories = (airtableRecord.fields.Categories || '').toLowerCase();
  
  const supabaseName = (supabaseProduct.name || '').toLowerCase();
  const supabaseSKU = supabaseProduct.sku.toLowerCase();
  
  // Must be Puffco brand (highest priority)
  const isPuffcoAirtable = airtableName.includes('puffco') || 
                          airtableSKU.includes('puffco') || 
                          airtableBrands.includes('puffco');
  
  const isPuffcoSupabase = supabaseName.includes('puffco') || 
                          supabaseSKU.includes('puffco');
  
  if (!isPuffcoAirtable || !isPuffcoSupabase) {
    return 0; // Must be Puffco on both sides
  }
  
  score += 100; // Base Puffco match
  
  // Product type matching (very high weight for Puffco)
  const puffcoProducts = [
    { keywords: ['peak pro', 'peakpro'], weight: 50 },
    { keywords: ['peak'], weight: 45 },
    { keywords: ['proxy'], weight: 50 },
    { keywords: ['chamber', '3d chamber'], weight: 40 },
    { keywords: ['travel glass', 'travel pack'], weight: 35 },
    { keywords: ['vision plus'], weight: 30 },
    { keywords: ['guardian'], weight: 25 },
    { keywords: ['desert'], weight: 20 },
    { keywords: ['bloom'], weight: 20 },
    { keywords: ['black'], weight: 15 }
  ];
  
  for (const product of puffcoProducts) {
    for (const keyword of product.keywords) {
      if (airtableName.includes(keyword) && supabaseName.includes(keyword)) {
        score += product.weight;
        break;
      }
    }
  }
  
  // Exact SKU match (very high weight)
  if (airtableSKU === supabaseSKU) {
    score += 200;
  }
  
  // Partial SKU match
  if (airtableSKU.includes(supabaseSKU.replace('puffco-', '')) || 
      supabaseSKU.includes(airtableSKU.replace('puffco', ''))) {
    score += 75;
  }
  
  // Name word matching
  const airtableWords = airtableName.split(/\s+/).filter(w => w.length > 2 && w !== 'puffco');
  const supabaseWords = supabaseName.split(/\s+/).filter(w => w.length > 2 && w !== 'puffco');
  
  let commonWords = 0;
  for (const aWord of airtableWords) {
    for (const sWord of supabaseWords) {
      if (aWord === sWord || aWord.includes(sWord) || sWord.includes(aWord)) {
        commonWords++;
        break;
      }
    }
  }
  
  score += commonWords * 15;
  
  return score;
}

async function fetchPuffcoFromAirtable(): Promise<AirtableRecord[]> {
  console.log('📡 Fetching Puffco records from Airtable...');
  
  let allRecords: AirtableRecord[] = [];
  let offset = '';
  
  do {
    // Filter for Puffco products with images
    const filterFormula = `AND(OR(FIND("Puffco",{Name}),FIND("PUFFCO",{Name}),FIND("puffco",{Name}),FIND("Puffco",{Brands}),FIND("PUFFCO",{Brands})),{Image_url}!="")`;
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}${offset ? `&offset=${offset}` : ''}`;
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    const records = data.records || [];
    
    allRecords = allRecords.concat(records);
    offset = data.offset || '';
    
    console.log(`   Fetched ${records.length} Puffco records, total: ${allRecords.length}`);
    
  } while (offset);
  
  return allRecords;
}

async function fetchPuffcoFromSupabase(): Promise<SupabaseProduct[]> {
  console.log('🗄️ Fetching Puffco products from Supabase...');
  
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, name, image_url, brand_name')
    .or('name.ilike.%puffco%,sku.ilike.%puffco%,brand_name.ilike.%puffco%')
    .eq('is_active', true)
    .eq('nicotine_product', false)
    .eq('tobacco_product', false);
  
  if (error) throw error;
  
  console.log(`   Found ${data?.length || 0} Puffco products`);
  return data || [];
}

async function uploadImageToSupabase(imageUrl: string, sku: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const urlParts = imageUrl.split('/');
    const originalFilename = urlParts[urlParts.length - 1] || 'puffco_image.jpg';
    const sanitizedSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
    const timestamp = Date.now();
    const extension = originalFilename.split('.').pop() || 'jpg';
    const fileName = `puffco_${sanitizedSku}_${timestamp}.${extension}`;
    const filePath = `products/${sanitizedSku}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, buffer, {
        upsert: true,
        contentType: response.headers.get('content-type') || 'image/jpeg',
        cacheControl: 'public, max-age=31536000, immutable'
      });

    if (error) return null;

    const { data: publicData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (error) {
    return null;
  }
}

async function syncPuffcoImages(dryRun: boolean = true, minScore: number = 150) {
  console.log('🔥 PUFFCO IMAGE SYNC FROM AIRTABLE');
  console.log('=' .repeat(50));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Min match score: ${minScore}\n`);
  
  try {
    const [airtableRecords, supabaseProducts] = await Promise.all([
      fetchPuffcoFromAirtable(),
      fetchPuffcoFromSupabase()
    ]);
    
    if (airtableRecords.length === 0) {
      console.log('❌ No Puffco records with images found in Airtable');
      return;
    }
    
    if (supabaseProducts.length === 0) {
      console.log('❌ No Puffco products found in Supabase');
      return;
    }
    
    console.log(`\n📊 Analysis:`);
    console.log(`   Airtable Puffco records with images: ${airtableRecords.length}`);
    console.log(`   Supabase Puffco products: ${supabaseProducts.length}\n`);
    
    // Show what we found
    console.log('📋 Airtable Puffco Records:');
    airtableRecords.forEach((record, i) => {
      console.log(`   ${i + 1}. ${record.fields.Name} (${record.fields.SKU || 'No SKU'})`);
    });
    
    console.log('\n📋 Supabase Puffco Products:');
    supabaseProducts.forEach((product, i) => {
      const hasImage = product.image_url ? '🖼️' : '❌';
      console.log(`   ${i + 1}. ${hasImage} ${product.name} (${product.sku})`);
    });
    
    let processed = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const airtableRecord of airtableRecords) {
      const airtableName = airtableRecord.fields.Name || 'Unknown';
      const airtableSKU = airtableRecord.fields.SKU || 'Unknown';
      const imageUrl = airtableRecord.fields.Image_url!;
      
      console.log(`\n🔍 Processing: ${airtableName} (${airtableSKU})`);
      
      // Find best match
      let bestMatch: SupabaseProduct | null = null;
      let bestScore = 0;
      
      for (const supabaseProduct of supabaseProducts) {
        const score = calculatePuffcoMatchScore(airtableRecord, supabaseProduct);
        if (score > bestScore && score >= minScore) {
          bestScore = score;
          bestMatch = supabaseProduct;
        }
      }
      
      if (!bestMatch) {
        console.log(`   ❌ No suitable match found (best score: ${bestScore})`);
        skipped++;
        continue;
      }
      
      console.log(`   ✅ Match found: ${bestMatch.name} (${bestMatch.sku})`);
      console.log(`   📊 Match score: ${bestScore}`);
      console.log(`   🖼️  Image: ${imageUrl}`);
      
      // Check if product already has an image (but we'll update it anyway for accuracy)
      if (bestMatch.image_url && !bestMatch.image_url.includes('placeholder')) {
        console.log(`   🔄 Product has image, but updating with more accurate Airtable image`);
      }
      
      if (dryRun) {
        console.log(`   🔍 DRY RUN: Would update product with image`);
        processed++;
        continue;
      }
      
      // Upload image and update product
      console.log(`   📤 Uploading image...`);
      const uploadedUrl = await uploadImageToSupabase(imageUrl, bestMatch.sku);
      
      if (uploadedUrl) {
        const { error } = await supabase
          .from('products')
          .update({ 
            image_url: uploadedUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', bestMatch.id);
        
        if (error) {
          console.log(`   ❌ Failed to update product: ${error.message}`);
        } else {
          console.log(`   ✅ Successfully updated product with image`);
          updated++;
        }
      } else {
        console.log(`   ❌ Failed to upload image`);
      }
      
      processed++;
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\n📊 Puffco Sync Summary:`);
    console.log(`   Records processed: ${processed}`);
    console.log(`   Products updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    
    if (dryRun) {
      console.log(`\n💡 This was a dry run. To actually sync images, run:`);
      console.log(`   pnpm exec tsx scripts/sync-puffco-images-from-airtable.ts --live`);
    }
    
  } catch (error) {
    console.error('❌ Error during Puffco sync:', error);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const scoreArg = args.find(arg => arg.startsWith('--min-score='));
const minScore = scoreArg ? parseInt(scoreArg.split('=')[1]) : 150;
const dryRun = !args.includes('--live');

syncPuffcoImages(dryRun, minScore).catch(console.error);
