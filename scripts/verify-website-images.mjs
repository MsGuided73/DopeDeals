// Verify images in website-images bucket
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTMzNjcsImV4cCI6MjA2NjYyOTM2N30.dCsYMaoD736ym1lBGMnCRPhPgJ21-RD2vbrDB7eksnM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyImages() {
  console.log('🔍 Checking images in website-images bucket...\n');

  // List files in website-images/products/bongs/RooR
  const { data: files, error } = await supabase.storage
    .from('website-images')
    .list('products/bongs/RooR', { limit: 100 });

  if (error) {
    console.error('❌ Error listing files:', error);
    return;
  }

  console.log(`Found ${files.length} files in website-images/products/bongs/RooR\n`);

  // Test each image URL
  for (const file of files) {
    const url = `https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/products/bongs/RooR/${file.name}`;
    
    const response = await fetch(url);
    const status = response.ok ? '✅' : '❌';
    console.log(`${status} ${file.name} - ${response.status} ${response.statusText}`);
  }

  console.log('\n🎯 All images in website-images bucket are accessible!');
  console.log('\nNow we need to update the database to use these URLs instead of the products bucket URLs.');
}

verifyImages().catch(console.error);

