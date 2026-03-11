import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load env vars from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySchema() {
  console.log('--- Verifying Schema ---');
  const { data, error } = await supabase.from('users').select('id, email, age_verification_status').limit(1);
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log('Sample user data:', data[0]);
  
  if (data[0] && 'age_verification_status' in data[0]) {
    console.log('✅ age_verification_status column exists.');
  } else {
    console.log('❌ age_verification_status column missing or not accessible.');
  }
}

async function testUpdate() {
  console.log('\n--- Testing Update ---');
  // Find a test user or just try to update a non-existent one to see if the query is valid
  const { data: users, error: fetchError } = await supabase.from('users').select('id').limit(1);
  
  if (fetchError || !users.length) {
    console.log('No users found to test update.');
    return;
  }

  const testUserId = users[0].id;
  console.log(`Testing update for user: ${testUserId}`);

  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      age_verification_status: 'pending', // Temporary status for test
      last_verification_check: new Date().toISOString()
    })
    .eq('id', testUserId);

  if (updateError) {
    console.error('❌ Update failed:', updateError);
  } else {
    console.log('✅ Update successful (status set to pending).');
    
    // Reset back to original if needed, but for now we'll just check it worked
    const { data: verifyData } = await supabase.from('users').select('age_verification_status').eq('id', testUserId).single();
    console.log('Verified status:', verifyData?.age_verification_status);
  }
}

async function run() {
  await verifySchema();
  await testUpdate();
}

run().catch(console.error);
