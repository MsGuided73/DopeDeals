// Test authenticated access to storage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTMzNjcsImV4cCI6MjA2NjYyOTM2N30.dCsYMaoD736ym1lBGMnCRPhPgJ21-RD2vbrDB7eksnM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAccess() {
  console.log('🔍 Testing Authenticated Storage Access...\n');

  // Try to get a public URL
  const { data: publicUrlData } = supabase.storage
    .from('products')
    .getPublicUrl('bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp');

  console.log('Public URL:', publicUrlData.publicUrl);

  // Try to fetch it
  const response = await fetch(publicUrlData.publicUrl);
  console.log('Status:', response.status, response.statusText);

  if (!response.ok) {
    const text = await response.text();
    console.log('Error response:', text);
  }

  console.log('\n🔍 Trying to download with authenticated client...\n');

  // Try authenticated download
  const { data, error } = await supabase.storage
    .from('products')
    .download('bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp');

  if (error) {
    console.error('❌ Download error:', error);
  } else {
    console.log('✅ Download successful!');
    console.log('File size:', data.size, 'bytes');
    console.log('File type:', data.type);
  }

  console.log('\n🔍 Checking bucket configuration...\n');

  // Check bucket details
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError);
    return;
  }

  const productsBucket = buckets.find(b => b.id === 'products');
  if (productsBucket) {
    console.log('Products bucket config:');
    console.log('  Public:', productsBucket.public);
    console.log('  File size limit:', productsBucket.file_size_limit);
    console.log('  Allowed MIME types:', productsBucket.allowed_mime_types);
  }
}

testAccess().catch(console.error);

