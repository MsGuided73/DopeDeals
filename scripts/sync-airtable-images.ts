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
    [key: string]: any;
  };
}

async function fetchAirtableRecords(limit?: number): Promise<AirtableRecord[]> {
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
      throw new Error(`Airtable API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const records = data.records || [];
    
    // Filter records that have image URLs
    const recordsWithImages = records.filter((record: AirtableRecord) =>
      record.fields.Image_url && record.fields.Image_url.trim() !== ''
    );
    
    allRecords = allRecords.concat(recordsWithImages);
    recordCount += records.length;
    offset = data.offset || '';
    
    console.log(`   Fetched ${records.length} records, ${recordsWithImages.length} with images, total with images: ${allRecords.length}`);
    
    if (limit && recordCount >= limit) break;
    
  } while (offset);
  
  return allRecords;
}

async function uploadImageToSupabase(
  imageUrl: string, 
  sku: string, 
  filename: string, 
  imageType: string
): Promise<string | null> {
  try {
    // Download image from Airtable
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`❌ Failed to download image: ${imageUrl}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const sanitizedSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
    const timestamp = Date.now();
    const extension = imageType?.split('/')[1] || filename.split('.').pop() || 'jpg';
    const fileName = `${sanitizedSku}_${timestamp}_${filename}`;
    const filePath = `products/${sanitizedSku}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, buffer, {
        upsert: true,
        contentType: imageType || 'image/jpeg',
        cacheControl: 'public, max-age=31536000, immutable'
      });

    if (error) {
      console.error(`❌ Failed to upload to Supabase:`, error);
      return null;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (error) {
    console.error(`❌ Error uploading image:`, error);
    return null;
  }
}

async function updateProductWithImages(sku: string, imageUrls: string[]): Promise<boolean> {
  try {
    const updateData: any = {
      image_url: imageUrls[0], // Primary image
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('sku', sku);

    if (error) {
      console.error(`❌ Failed to update product ${sku}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Error updating product ${sku}:`, error);
    return false;
  }
}

async function syncAirtableImages(limit?: number, dryRun: boolean = true) {
  console.log('🖼️  Starting Airtable image sync...\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE UPDATE'}`);
  console.log(`Limit: ${limit || 'No limit'}\n`);
  
  try {
    // Fetch Airtable records with images
    const airtableRecords = await fetchAirtableRecords(limit);
    
    if (airtableRecords.length === 0) {
      console.log('❌ No Airtable records with images found');
      return;
    }
    
    console.log(`\n📊 Found ${airtableRecords.length} Airtable records with images\n`);
    
    let processed = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const record of airtableRecords) {
      const sku = record.fields.SKU;
      const name = record.fields.Name;
      const imageUrl = record.fields.Image_url;

      if (!sku) {
        console.log(`⚠️  Skipping record without SKU: ${name || record.id}`);
        skipped++;
        continue;
      }

      if (!imageUrl) {
        console.log(`⚠️  Skipping record without image URL: ${name} (${sku})`);
        skipped++;
        continue;
      }

      console.log(`\n🔄 Processing: ${name} (${sku})`);
      console.log(`   Image URL: ${imageUrl}`);

      // Check if product exists in Supabase
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, name, image_url')
        .eq('sku', sku)
        .single();

      if (!existingProduct) {
        console.log(`   ⚠️  Product not found in Supabase, skipping`);
        skipped++;
        continue;
      }

      // Check if product already has an image
      if (existingProduct.image_url && !existingProduct.image_url.includes('placeholder')) {
        console.log(`   ✅ Product already has image, skipping`);
        skipped++;
        continue;
      }

      if (dryRun) {
        console.log(`   🔍 DRY RUN: Would download and upload image from ${imageUrl}`);
        processed++;
        continue;
      }

      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1] || 'image.jpg';
      const imageType = filename.includes('.webp') ? 'image/webp' :
                       filename.includes('.png') ? 'image/png' : 'image/jpeg';

      console.log(`   📤 Downloading and uploading image: ${filename}`);

      const uploadedUrl = await uploadImageToSupabase(
        imageUrl,
        sku,
        filename,
        imageType
      );

      if (uploadedUrl) {
        // Update product with new image
        const success = await updateProductWithImages(sku, [uploadedUrl]);
        if (success) {
          console.log(`   ✅ Updated product with new image`);
          updated++;
        } else {
          console.log(`   ❌ Failed to update product`);
          errors++;
        }
      } else {
        console.log(`   ❌ Failed to upload image`);
        errors++;
      }

      processed++;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\n📊 Sync Summary:`);
    console.log(`   Records processed: ${processed}`);
    console.log(`   Products updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors}`);
    
    if (dryRun) {
      console.log(`\n💡 This was a dry run. To actually sync images, run:`);
      console.log(`   pnpm exec tsx scripts/sync-airtable-images.ts --live`);
    }
    
  } catch (error) {
    console.error('❌ Error during sync:', error);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const limitArg = args.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
const dryRun = !args.includes('--live');

syncAirtableImages(limit, dryRun).catch(console.error);
