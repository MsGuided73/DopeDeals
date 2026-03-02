const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not configured');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
  console.log('--- Fetching User List ---');
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, role, first_name, last_name');

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log('Total users found:', users.length);
  users.forEach(u => {
    console.log(`[${u.id}] ${u.email} | Role: ${u.role || 'NONE'} | Name: ${u.first_name || ''} ${u.last_name || ''}`);
  });
}

listUsers();
