import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { runProductMatching } from './product-matching-system';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface SyncResult {
  updated: number;
  failed: number;
  skipped: number;
  errors: Array<{ product: string; error: string }>;
}

// Update product with images from Airtable
async function updateProductImages(productId: string, imageUrls: string[], productName: string): Promise<boolean> {
  try {
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // Set primary image (first image)
    if (imageUrls.length > 0) {
      updateData.image_url = imageUrls[0];
    }
    
    // Set all images array
    if (imageUrls.length > 0) {
      updateData.image_urls = imageUrls;
    }
    
    // Update the product
    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId);
    
    if (error) {
      console.error(`❌ Failed to update ${productName}:`, error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${productName}:`, error);
    return false;
  }
}

// Sync images for matched products
async function syncProductImages(dryRun: boolean = false): Promise<SyncResult> {
  console.log('🖼️  STARTING PRODUCT IMAGE SYNC');
  console.log('=' .repeat(60));
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made');
  }
  
  const result: SyncResult = {
    updated: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };
  
  try {
    // Get product matches
    console.log('🔄 Running product matching...');
    const { matches } = await runProductMatching();
    
    console.log(`\n📊 Processing ${matches.length} matched products...`);
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const { airtableRecord, supabaseProduct, score, matchType } = match;
      
      const productName = supabaseProduct.name;
      const images = airtableRecord.fields.Images;
      let imageUrls: string[] = [];

      if (images) {
        if (Array.isArray(images)) {
          imageUrls = images.map(img => typeof img === 'string' ? img : img.url).filter(Boolean);
        } else if (typeof images === 'string') {
          imageUrls = [images];
        }
      }
      
      console.log(`\n${i + 1}/${matches.length} Processing: ${productName}`);
      console.log(`   Match: ${(score * 100).toFixed(1)}% (${matchType})`);
      console.log(`   Images: ${imageUrls.length}`);
      
      // Skip if no images
      if (imageUrls.length === 0) {
        console.log('   ⏭️  Skipped - No images');
        result.skipped++;
        continue;
      }
      
      // Skip if product already has images (unless forcing update)
      const hasExistingImages = supabaseProduct.image_url || (supabaseProduct.image_urls && supabaseProduct.image_urls.length > 0);
      if (hasExistingImages) {
        console.log('   ⏭️  Skipped - Already has images');
        result.skipped++;
        continue;
      }
      
      // Skip low-confidence matches
      if (score < 0.75) {
        console.log(`   ⏭️  Skipped - Low confidence (${(score * 100).toFixed(1)}%)`);
        result.skipped++;
        continue;
      }
      
      if (dryRun) {
        console.log(`   ✅ Would update with ${imageUrls.length} images`);
        result.updated++;
      } else {
        // Update the product
        const success = await updateProductImages(supabaseProduct.id, imageUrls, productName);
        
        if (success) {
          console.log(`   ✅ Updated with ${imageUrls.length} images`);
          result.updated++;
        } else {
          console.log('   ❌ Update failed');
          result.failed++;
          result.errors.push({
            product: productName,
            error: 'Database update failed'
          });
        }
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Image sync error:', error);
    throw error;
  }
}

// Sync brand information
async function syncBrandInformation(dryRun: boolean = false): Promise<void> {
  console.log('\n🏷️  SYNCING BRAND INFORMATION');
  console.log('=' .repeat(60));
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made');
  }
  
  try {
    // Get product matches
    const { matches } = await runProductMatching();
    
    // Extract unique brands from Airtable
    const brandMap = new Map<string, number>();
    
    matches.forEach(match => {
      const airtableBrand = match.airtableRecord.fields.Brand;
      if (airtableBrand && airtableBrand.trim()) {
        const normalizedBrand = airtableBrand.trim().toUpperCase();
        brandMap.set(normalizedBrand, (brandMap.get(normalizedBrand) || 0) + 1);
      }
    });
    
    console.log(`\n📊 Found ${brandMap.size} unique brands:`);
    Array.from(brandMap.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([brand, count]) => {
        console.log(`   - ${brand}: ${count} products`);
      });
    
    // Check which brands exist in Supabase
    const { data: existingBrands } = await supabase
      .from('brands')
      .select('id, name, slug');
    
    console.log(`\n🏪 Existing brands in database: ${existingBrands?.length || 0}`);
    
    // Create missing brands
    const existingBrandNames = new Set(
      (existingBrands || []).map(b => b.name.toUpperCase())
    );
    
    const missingBrands = Array.from(brandMap.keys()).filter(
      brand => !existingBrandNames.has(brand)
    );
    
    if (missingBrands.length > 0) {
      console.log(`\n➕ Missing brands to create: ${missingBrands.length}`);
      missingBrands.forEach(brand => {
        console.log(`   - ${brand}`);
      });
      
      if (!dryRun) {
        // Create missing brands
        for (const brandName of missingBrands) {
          const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          
          const { error } = await supabase
            .from('brands')
            .insert({
              name: brandName,
              slug: slug,
              description: `${brandName} products and accessories`
            });
          
          if (error) {
            console.error(`❌ Failed to create brand ${brandName}:`, error.message);
          } else {
            console.log(`✅ Created brand: ${brandName}`);
          }
        }
      }
    } else {
      console.log('✅ All brands already exist');
    }
    
  } catch (error) {
    console.error('❌ Brand sync error:', error);
    throw error;
  }
}

// Main sync function
async function runImageSync(options: { dryRun?: boolean; syncBrands?: boolean } = {}) {
  const { dryRun = false, syncBrands = true } = options;
  
  console.log('🚀 PRODUCT IMAGE & BRAND SYNC SYSTEM');
  console.log('=' .repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Sync Brands: ${syncBrands ? 'YES' : 'NO'}`);
  
  try {
    // Sync images
    const result = await syncProductImages(dryRun);
    
    // Sync brands if requested
    if (syncBrands) {
      await syncBrandInformation(dryRun);
    }
    
    // Final summary
    console.log('\n📋 FINAL SUMMARY');
    console.log('=' .repeat(60));
    console.log(`✅ Products updated: ${result.updated}`);
    console.log(`⏭️  Products skipped: ${result.skipped}`);
    console.log(`❌ Products failed: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => {
        console.log(`   - ${error.product}: ${error.error}`);
      });
    }
    
    if (dryRun) {
      console.log('\n🔍 This was a dry run - no changes were made');
      console.log('Run with --live to apply changes');
    } else {
      console.log('\n✅ Image sync complete!');
    }
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  }
}

// Command line interface (ES module compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--live');
  const syncBrands = !args.includes('--no-brands');

  runImageSync({ dryRun, syncBrands })
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { runImageSync, syncProductImages, syncBrandInformation };
