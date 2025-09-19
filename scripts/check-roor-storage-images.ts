import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRoorStorageImages() {
  console.log('🔍 Checking Supabase storage for ROOR product images...\n');
  
  try {
    // Check different possible folder structures
    const foldersToCheck = [
      'products',
      'bongs', 
      'roor',
      'products/roor',
      'products/bongs',
      'bongs/roor',
      'images/products',
      'images/bongs',
      'images/roor'
    ];
    
    console.log('📁 Checking storage folders:\n');
    
    for (const folder of foldersToCheck) {
      console.log(`🔍 Checking folder: ${folder}`);
      
      const { data: files, error } = await supabase.storage
        .from('product-images')
        .list(folder, {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });
        
      if (error) {
        console.log(`   ❌ Error accessing ${folder}: ${error.message}`);
        continue;
      }
      
      if (!files || files.length === 0) {
        console.log(`   📂 Empty or doesn't exist`);
        continue;
      }
      
      console.log(`   ✅ Found ${files.length} items`);
      
      // Filter for ROOR-related images
      const roorFiles = files.filter(file => 
        file.name.toLowerCase().includes('roor') ||
        file.name.toLowerCase().includes('r24') ||
        file.name.toLowerCase().includes('zeaker') ||
        file.name.toLowerCase().includes('beaker') ||
        file.name.toLowerCase().includes('straight')
      );
      
      if (roorFiles.length > 0) {
        console.log(`   🏺 ROOR-related files (${roorFiles.length}):`);
        roorFiles.forEach(file => {
          console.log(`      - ${file.name} (${Math.round(file.metadata?.size / 1024 || 0)}KB)`);
        });
      }
      
      console.log('');
    }
    
    // Also check the root level
    console.log('🔍 Checking root level of product-images bucket:');
    const { data: rootFiles, error: rootError } = await supabase.storage
      .from('product-images')
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });
      
    if (rootError) {
      console.log(`❌ Error accessing root: ${rootError.message}`);
    } else if (rootFiles && rootFiles.length > 0) {
      console.log(`✅ Found ${rootFiles.length} items in root`);
      
      const roorRootFiles = rootFiles.filter(file => 
        file.name.toLowerCase().includes('roor') ||
        file.name.toLowerCase().includes('r24') ||
        file.name.toLowerCase().includes('zeaker')
      );
      
      if (roorRootFiles.length > 0) {
        console.log(`🏺 ROOR-related files in root (${roorRootFiles.length}):`);
        roorRootFiles.forEach(file => {
          console.log(`   - ${file.name}`);
        });
      }
    }
    
    // Get current ROOR products to compare
    console.log('\n📦 Current ROOR products in database:');
    const { data: products } = await supabase
      .from('products')
      .select('id, name, sku, image_url')
      .eq('brand_name', 'ROOR')
      .eq('is_active', true)
      .order('name');
      
    products?.forEach((product, i) => {
      console.log(`${i + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Current Image: ${product.image_url || 'None'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking storage:', error);
  }
}

checkRoorStorageImages();
