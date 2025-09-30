// Fix Supabase storage bucket permissions
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
// Use service role key for admin operations
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixStoragePermissions() {
  console.log('🔧 Fixing Supabase Storage Permissions...\n');

  // Try to update the products bucket to be public
  const { data, error } = await supabase.storage.updateBucket('products', {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  });

  if (error) {
    console.error('❌ Error updating bucket:', error);
    console.log('\n📋 Manual fix required:');
    console.log('1. Go to: https://supabase.com/dashboard/project/qirbapivptotybspnbet/storage/buckets');
    console.log('2. Click on "products" bucket');
    console.log('3. Click "Edit bucket"');
    console.log('4. Toggle "Public bucket" to ON');
    console.log('5. Save changes');
    return;
  }

  console.log('✅ Successfully updated products bucket to public!');
  
  // Test the image URL again
  console.log('\n🔍 Testing image URL after fix...\n');
  const testUrl = 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp';
  
  // Wait a moment for changes to propagate
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const response = await fetch(testUrl);
    console.log(`Test URL: ${testUrl}`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      console.log('✅ SUCCESS! Images are now accessible!');
      console.log('\n🎉 Your product images should now display on the website!');
    } else {
      console.log('⚠️ Still getting errors. Manual intervention needed.');
    }
  } catch (error) {
    console.log(`❌ Error fetching: ${error.message}`);
  }
}

fixStoragePermissions().catch(console.error);

