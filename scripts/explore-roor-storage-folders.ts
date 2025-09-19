import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function exploreRoorStorageFolders() {
  console.log('🔍 Exploring ROOR image folders in detail...\n');
  
  try {
    // Check products bucket - Bongs folder
    console.log('📁 Exploring products/Bongs folder:');
    const { data: bongsFiles, error: bongsError } = await supabase.storage
      .from('products')
      .list('Bongs', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });
      
    if (bongsError) {
      console.log(`❌ Error: ${bongsError.message}`);
    } else if (bongsFiles && bongsFiles.length > 0) {
      console.log(`✅ Found ${bongsFiles.length} items in products/Bongs:`);
      bongsFiles.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size ? Math.round(file.metadata.size / 1024) + 'KB' : 'Unknown size'})`);
      });
    }
    
    // Check products bucket - bongs/RooR folder
    console.log('\n📁 Exploring products/bongs/RooR folder:');
    const { data: roorFiles, error: roorError } = await supabase.storage
      .from('products')
      .list('bongs/RooR', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });
      
    if (roorError) {
      console.log(`❌ Error: ${roorError.message}`);
    } else if (roorFiles && roorFiles.length > 0) {
      console.log(`✅ Found ${roorFiles.length} items in products/bongs/RooR:`);
      roorFiles.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size ? Math.round(file.metadata.size / 1024) + 'KB' : 'Unknown size'})`);
      });
    }
    
    // Check website-images bucket - products/bongs folder
    console.log('\n📁 Exploring website-images/products/bongs folder:');
    const { data: websiteBongsFiles, error: websiteBongsError } = await supabase.storage
      .from('website-images')
      .list('products/bongs', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });
      
    if (websiteBongsError) {
      console.log(`❌ Error: ${websiteBongsError.message}`);
    } else if (websiteBongsFiles && websiteBongsFiles.length > 0) {
      console.log(`✅ Found ${websiteBongsFiles.length} items in website-images/products/bongs:`);
      websiteBongsFiles.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size ? Math.round(file.metadata.size / 1024) + 'KB' : 'Unknown size'})`);
      });
    }
    
    // Generate URLs for the found images
    console.log('\n🌐 Generating public URLs for found images:');
    
    const imagePaths = [];
    
    // Add products bucket images
    if (bongsFiles && bongsFiles.length > 0) {
      bongsFiles.forEach(file => {
        if (file.name.toLowerCase().includes('.jpg') || file.name.toLowerCase().includes('.png') || file.name.toLowerCase().includes('.webp')) {
          imagePaths.push({ bucket: 'products', path: `Bongs/${file.name}`, name: file.name });
        }
      });
    }
    
    if (roorFiles && roorFiles.length > 0) {
      roorFiles.forEach(file => {
        if (file.name.toLowerCase().includes('.jpg') || file.name.toLowerCase().includes('.png') || file.name.toLowerCase().includes('.webp')) {
          imagePaths.push({ bucket: 'products', path: `bongs/RooR/${file.name}`, name: file.name });
        }
      });
    }
    
    // Add website-images bucket images
    if (websiteBongsFiles && websiteBongsFiles.length > 0) {
      websiteBongsFiles.forEach(file => {
        if (file.name.toLowerCase().includes('.jpg') || file.name.toLowerCase().includes('.png') || file.name.toLowerCase().includes('.webp')) {
          imagePaths.push({ bucket: 'website-images', path: `products/bongs/${file.name}`, name: file.name });
        }
      });
    }
    
    console.log(`\n📸 Found ${imagePaths.length} image files:`);
    imagePaths.forEach((img, i) => {
      const { data: publicUrl } = supabase.storage
        .from(img.bucket)
        .getPublicUrl(img.path);
        
      console.log(`${i + 1}. ${img.name}`);
      console.log(`   Bucket: ${img.bucket}`);
      console.log(`   Path: ${img.path}`);
      console.log(`   URL: ${publicUrl.publicUrl}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error exploring folders:', error);
  }
}

exploreRoorStorageFolders();
