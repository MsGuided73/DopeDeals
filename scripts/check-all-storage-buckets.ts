import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAllStorageBuckets() {
  console.log('🔍 Checking all Supabase storage buckets for ROOR images...\n');
  
  try {
    // List all storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return;
    }
    
    console.log(`📁 Found ${buckets?.length || 0} storage buckets:\n`);
    
    for (const bucket of buckets || []) {
      console.log(`🗂️  Bucket: ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`);
      
      // Check root level of each bucket
      const { data: files, error } = await supabase.storage
        .from(bucket.name)
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });
        
      if (error) {
        console.log(`   ❌ Error accessing bucket: ${error.message}`);
        continue;
      }
      
      if (!files || files.length === 0) {
        console.log(`   📂 Empty bucket`);
        continue;
      }
      
      console.log(`   ✅ Found ${files.length} items`);
      
      // Look for ROOR-related files
      const roorFiles = files.filter(file => 
        file.name.toLowerCase().includes('roor') ||
        file.name.toLowerCase().includes('r24') ||
        file.name.toLowerCase().includes('zeaker') ||
        file.name.toLowerCase().includes('beaker') ||
        file.name.toLowerCase().includes('straight') ||
        file.name.toLowerCase().includes('bong')
      );
      
      if (roorFiles.length > 0) {
        console.log(`   🏺 ROOR/Bong-related files (${roorFiles.length}):`);
        roorFiles.forEach(file => {
          console.log(`      - ${file.name}`);
        });
      }
      
      // Also check common subfolders
      const foldersToCheck = ['products', 'bongs', 'roor', 'images'];
      for (const folder of foldersToCheck) {
        const { data: subFiles } = await supabase.storage
          .from(bucket.name)
          .list(folder, { limit: 50 });
          
        if (subFiles && subFiles.length > 0) {
          const roorSubFiles = subFiles.filter(file => 
            file.name.toLowerCase().includes('roor') ||
            file.name.toLowerCase().includes('bong')
          );
          
          if (roorSubFiles.length > 0) {
            console.log(`   📁 ${folder}/ folder has ${roorSubFiles.length} ROOR files:`);
            roorSubFiles.forEach(file => {
              console.log(`      - ${folder}/${file.name}`);
            });
          }
        }
      }
      
      console.log('');
    }
    
    // Check current image URLs to see what external sources we're using
    console.log('🌐 Current external image sources for ROOR products:');
    const { data: products } = await supabase
      .from('products')
      .select('name, image_url')
      .eq('brand_name', 'ROOR')
      .eq('is_active', true);
      
    const imageUrls = [...new Set(products?.map(p => p.image_url).filter(Boolean))];
    imageUrls.forEach((url, i) => {
      console.log(`${i + 1}. ${url}`);
      
      // Count how many products use this image
      const count = products?.filter(p => p.image_url === url).length || 0;
      console.log(`   Used by ${count} products`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking storage:', error);
  }
}

checkAllStorageBuckets();
