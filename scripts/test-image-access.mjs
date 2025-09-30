// Test if product images are accessible

const testImages = [
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp',
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Zeaker-9mm-Ultra-Thick.webp',
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/PreWritten_DopeClub.jpg'
];

async function testImageAccess() {
  console.log('🖼️  Testing Product Image Access...\n');

  for (const url of testImages) {
    const filename = url.split('/').pop();
    console.log(`Testing: ${filename}`);
    
    try {
      const response = await fetch(url);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        console.log(`   ✅ Image accessible!`);
        console.log(`   Content-Type: ${contentType}`);
        console.log(`   Size: ${(contentLength / 1024).toFixed(2)} KB`);
      } else {
        console.log(`   ❌ Image not accessible`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 Summary:');
  console.log('If all images show ✅, your RLS policy is working correctly!');
  console.log('If images show ❌, there may be another issue.');
}

testImageAccess().catch(console.error);

