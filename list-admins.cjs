const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAdmins() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Error listing users:', error);
      return;
    }

    const admins = users.filter(u => 
      u.app_metadata?.role === 'admin' || 
      u.user_metadata?.role === 'admin'
    );

    console.log('--- Current Admins ---');
    admins.forEach(u => {
      console.log(`- ${u.email} (ID: ${u.id})`);
      console.log(`  App Metadata:`, u.app_metadata);
      console.log(`  User Metadata:`, u.user_metadata);
    });

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

listAdmins();
