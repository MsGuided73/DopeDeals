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
  };
}

interface SupabaseProduct {
  id: string;
  sku: string;
  name: string;
  image_url?: string;
}

// Smart matching function
function calculateMatchScore(airtableRecord: AirtableRecord, supabaseProduct: SupabaseProduct): number {
  let score = 0;
  
  const airtableName = (airtableRecord.fields.Name || '').toLowerCase();
  const airtableSKU = (airtableRecord.fields.SKU || '').toLowerCase();
  const supabaseName = (supabaseProduct.name || '').toLowerCase();
  const supabaseSKU = supabaseProduct.sku.toLowerCase();
  
  // Brand matching (high weight)
  const brands = ['crave', 'hidden hills', 'roor', 'maven', 'zyn', 'tyson', 'smok'];
  for (const brand of brands) {
    if (airtableName.includes(brand) && supabaseName.includes(brand)) {
      score += 50;
      break;
    }
    if (airtableSKU.includes(brand) && supabaseSKU.includes(brand)) {
      score += 40;
      break;
    }
  }
  
  // Product type matching (medium weight)
  const productTypes = [
    'grinder', 'pipe', 'beaker', 'torch', 'disposable', 'gummies', 
    'pouch', 'nicotine', 'thca', 'water pipe', 'hand pipe'
  ];
  for (const type of productTypes) {
    if (airtableName.includes(type) && supabaseName.includes(type)) {
      score += 30;
    }
  }
  
  // Exact SKU match (highest weight)
  if (airtableSKU === supabaseSKU) {
    score += 100;
  }
  
  // Partial SKU match
  if (airtableSKU.includes(supabaseSKU) || supabaseSKU.includes(airtableSKU)) {
    score += 25;
  }
  
  // Name similarity (word matching)
  const airtableWords = airtableName.split(/\s+/).filter(w => w.length > 2);
  const supabaseWords = supabaseName.split(/\s+/).filter(w => w.length > 2);
  
  let commonWords = 0;
  for (const aWord of airtableWords) {
    for (const sWord of supabaseWords) {
      if (aWord === sWord || aWord.includes(sWord) || sWord.includes(aWord)) {
        commonWords++;
        break;
      }
    }
  }
  
  score += commonWords * 10;
  
  return score;
}

async function fetchAirtableRecordsWithImages(limit?: number): Promise<AirtableRecord[]> {
  console.log('📡 Fetching Airtable records with images...');
  
  let allRecords: AirtableRecord[] = [];
  let offset = '';
  let recordCount = 0;
  
  do {
    const maxRecords = limit ? Math.min(100, limit - recordCount) : 100;
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=${maxRecords}${offset ? `&offset=${offset}` : ''}`;
    
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
    
    const recordsWithImages = records.filter((record: AirtableRecord) => 
      record.fields.Image_url && record.fields.Image_url.trim() !== '' && record.fields.SKU
    );
    
    allRecords = allRecords.concat(recordsWithImages);
    recordCount += records.length;
    offset = data.offset || '';
    
    console.log(`   Fetched ${records.length} records, ${recordsWithImages.length} with images, total: ${allRecords.length}`);
    
    if (limit && recordCount >= limit) break;
    
  } while (offset);
  
  return allRecords;
}

async function fetchSupabaseProductsWithoutImages(): Promise<SupabaseProduct[]> {
  console.log('🗄️ Fetching Supabase products without images...');
  
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, name, image_url')
    .or('image_url.is.null,image_url.eq.')
    .eq('is_active', true)
    .limit(500);
  
  if (error) throw error;
  
  console.log(`   Found ${data?.length || 0} products without images`);
  return data || [];
}

async function uploadImageToSupabase(imageUrl: string, sku: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const urlParts = imageUrl.split('/');
    const originalFilename = urlParts[urlParts.length - 1] || 'image.jpg';
    const sanitizedSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
    const timestamp = Date.now();
    const extension = originalFilename.split('.').pop() || 'jpg';
    const fileName = `${sanitizedSku}_${timestamp}.${extension}`;
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

async function smartImageSync(limit?: number, dryRun: boolean = true, minScore: number = 40) {
  console.log('🧠 Starting smart Airtable image sync...\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Limit: ${limit || 'No limit'}`);
  console.log(`Min match score: ${minScore}\n`);
  
  try {
    const [airtableRecords, supabaseProducts] = await Promise.all([
      fetchAirtableRecordsWithImages(limit),
      fetchSupabaseProductsWithoutImages()
    ]);
    
    if (airtableRecords.length === 0) {
      console.log('❌ No Airtable records with images found');
      return;
    }
    
    if (supabaseProducts.length === 0) {
      console.log('❌ No Supabase products without images found');
      return;
    }
    
    console.log(`\n📊 Analysis:`);
    console.log(`   Airtable records with images: ${airtableRecords.length}`);
    console.log(`   Supabase products without images: ${supabaseProducts.length}\n`);
    
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
        const score = calculateMatchScore(airtableRecord, supabaseProduct);
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
          
          // Remove from available products to avoid duplicates
          const index = supabaseProducts.indexOf(bestMatch);
          if (index > -1) {
            supabaseProducts.splice(index, 1);
          }
        }
      } else {
        console.log(`   ❌ Failed to upload image`);
      }
      
      processed++;
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log(`\n📊 Sync Summary:`);
    console.log(`   Records processed: ${processed}`);
    console.log(`   Products updated: ${updated}`);
    console.log(`   Skipped (no match): ${skipped}`);
    
    if (dryRun) {
      console.log(`\n💡 This was a dry run. To actually sync images, run:`);
      console.log(`   pnpm exec tsx scripts/smart-airtable-image-sync.ts --live`);
    }
    
  } catch (error) {
    console.error('❌ Error during sync:', error);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const limitArg = args.find(arg => arg.startsWith('--limit='));
const scoreArg = args.find(arg => arg.startsWith('--min-score='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
const minScore = scoreArg ? parseInt(scoreArg.split('=')[1]) : 40;
const dryRun = !args.includes('--live');

smartImageSync(limit, dryRun, minScore).catch(console.error);
