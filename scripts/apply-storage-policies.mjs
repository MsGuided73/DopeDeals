// Apply storage policies via Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyStoragePolicies() {
  console.log('🔧 Applying Storage Policies...\n');

  // SQL to create public read policy
  const sql = `
    -- Enable RLS
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Public read access for products" ON storage.objects;
    
    -- Create public read policy
    CREATE POLICY "Public read access for products"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error applying policies:', error);
      console.log('\n📋 MANUAL FIX REQUIRED:');
      console.log('\n1. Go to: https://supabase.com/dashboard/project/qirbapivptotybspnbet/storage/policies');
      console.log('2. Select the "products" bucket');
      console.log('3. Click "New Policy"');
      console.log('4. Choose "For full customization"');
      console.log('5. Policy name: "Public read access"');
      console.log('6. Allowed operation: SELECT');
      console.log('7. Policy definition: bucket_id = \'products\'');
      console.log('8. Click "Save policy"');
      console.log('\nOR run the SQL in scripts/create-storage-policies.sql in the SQL Editor');
      return;
    }

    console.log('✅ Policies applied successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 MANUAL FIX REQUIRED - See instructions above');
  }

  // Test the image URL
  console.log('\n🔍 Testing image URL...\n');
  const testUrl = 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/products/bongs/RooR/Roor-Classic-18-Straight-50x5mm-Black-White.webp';
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const response = await fetch(testUrl);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      console.log('✅ SUCCESS! Images are now accessible!');
    } else {
      console.log('⚠️ Still getting errors - manual fix needed');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

applyStoragePolicies().catch(console.error);

