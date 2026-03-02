const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllAuthUsers() {
  console.log('--- Listing Auth Users ---');
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('Error listing auth users:', error);
    return;
  }

  console.log('Found', users.length, 'users in auth.users');
  users.forEach(u => {
    console.log(`[${u.id}] ${u.email}`);
  });
}

listAllAuthUsers();
