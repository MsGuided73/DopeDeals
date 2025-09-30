// Check what's in Supabase storage buckets
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTMzNjcsImV4cCI6MjA2NjYyOTM2N30.dCsYMaoD736ym1lBGMnCRPhPgJ21-RD2vbrDB7eksnM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log('🔍 Checking Supabase Storage...\n');

  // List all buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError);
    return;
  }

  console.log(`Found ${buckets.length} storage buckets:\n`);
  
  for (const bucket of buckets) {
    console.log(`📦 Bucket: ${bucket.name}`);
    console.log(`   Public: ${bucket.public}`);
    console.log(`   Created: ${bucket.created_at}`);
    
    // List files in bucket
    const { data: files, error: filesError } = await supabase.storage
      .from(bucket.name)
      .list('', { limit: 10 });
    
    if (filesError) {
      console.log(`   ❌ Error listing files: ${filesError.message}`);
    } else {
      console.log(`   Files/Folders: ${files.length}`);
      if (files.length > 0) {
        files.slice(0, 5).forEach(file => {
          console.log(`      - ${file.name} (${file.metadata?.size || 'folder'})`);
        });
      }
    }
    console.log('');
  }

  // Check specifically for products bucket
  console.log('\n🔍 Checking products bucket in detail...\n');
  
  const { data: productFiles, error: productError } = await supabase.storage
    .from('products')
    .list('bongs/RooR', { limit: 20 });
  
  if (productError) {
    console.log(`❌ Error: ${productError.message}`);
  } else {
    console.log(`Found ${productFiles.length} files in products/bongs/RooR:`);
    productFiles.forEach(file => {
      console.log(`   - ${file.name}`);
    });
  }

  // Check a sample product image URL
  console.log('\n🔍 Testing sample image URL...\n');
  const testUrl = 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp';
  
  try {
    const response = await fetch(testUrl);
    console.log(`Test URL: ${testUrl}`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    if (response.status === 404) {
      console.log('❌ Image does not exist in storage');
    } else if (response.status === 200) {
      console.log('✅ Image exists and is accessible');
    }
  } catch (error) {
    console.log(`❌ Error fetching: ${error.message}`);
  }
}

checkStorage().catch(console.error);

