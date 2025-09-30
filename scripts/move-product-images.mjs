// Move product images from 'products' bucket to 'website-images' bucket
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function moveImages() {
  console.log('📦 Moving Product Images to website-images bucket...\n');

  // List all files in products bucket
  const { data: files, error: listError } = await supabase.storage
    .from('products')
    .list('bongs/RooR', { limit: 100 });

  if (listError) {
    console.error('❌ Error listing files:', listError);
    return;
  }

  console.log(`Found ${files.length} files in products/bongs/RooR\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const sourcePath = `bongs/RooR/${file.name}`;
    const destPath = `products/bongs/RooR/${file.name}`;

    console.log(`Moving: ${file.name}`);

    try {
      // Download from products bucket
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('products')
        .download(sourcePath);

      if (downloadError) {
        console.log(`  ❌ Download failed: ${downloadError.message}`);
        errorCount++;
        continue;
      }

      // Upload to website-images bucket
      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(destPath, fileData, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) {
        console.log(`  ❌ Upload failed: ${uploadError.message}`);
        errorCount++;
        continue;
      }

      console.log(`  ✅ Moved successfully`);
      successCount++;

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Successfully moved: ${successCount}`);
  console.log(`  ❌ Failed: ${errorCount}`);

  // Test the new URL
  if (successCount > 0) {
    const testUrl = 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp';
    console.log(`\n🧪 Testing new URL:`);
    console.log(testUrl);
    
    const response = await fetch(testUrl);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('✅ Images are now accessible!');
    }
  }
}

moveImages().catch(console.error);

