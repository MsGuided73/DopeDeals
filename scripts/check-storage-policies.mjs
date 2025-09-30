// Check what storage policies exist
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPolicies() {
  console.log('🔍 Checking Storage Policies...\n');

  // Query the policies from pg_policies
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies 
      WHERE tablename = 'objects'
      ORDER BY policyname;
    `
  });

  if (error) {
    console.error('❌ Error querying policies:', error);
    console.log('\n💡 Trying alternative method...\n');
    
    // Try direct query
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('📦 Storage Buckets:\n');
    buckets.forEach(bucket => {
      console.log(`Bucket: ${bucket.name}`);
      console.log(`  ID: ${bucket.id}`);
      console.log(`  Public: ${bucket.public}`);
      console.log(`  File size limit: ${bucket.file_size_limit || 'unlimited'}`);
      console.log('');
    });
    
    return;
  }

  console.log('📋 Storage Policies:\n');
  if (data && data.length > 0) {
    data.forEach(policy => {
      console.log(`Policy: ${policy.policyname}`);
      console.log(`  Command: ${policy.cmd}`);
      console.log(`  Roles: ${policy.roles}`);
      console.log(`  Definition: ${policy.qual}`);
      console.log('');
    });
  } else {
    console.log('No policies found or unable to query.');
  }
}

checkPolicies().catch(console.error);

