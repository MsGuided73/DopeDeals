const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not configured');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdmin(email) {
  try {
    console.log(`--- Attempting to make ${email} a master-admin ---`);
    
    // 1. Find user in public.users table (avoiding role column)
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (findError) {
      console.error('Error finding user in public.users:', findError);
      return;
    }

    if (!user) {
      console.warn(`User with email ${email} not found in public.users table.`);
      console.log('Searching in auth.users...');
      
      const { data: { users: authUsers }, error: authFindError } = await supabase.auth.admin.listUsers();
      if (authFindError) {
        console.error('Error listing auth users:', authFindError);
        return;
      }
      
      const foundAuthUser = authUsers.find(u => u.email === email);
      if (!foundAuthUser) {
        console.error(`User with email ${email} not found in Auth either. They MUST sign up first.`);
        return;
      }
      
      console.log(`Found user in Auth: ${foundAuthUser.email} (ID: ${foundAuthUser.id})`);
      user.id = foundAuthUser.id;
    } else {
      console.log(`Found user in public.users: ${user.email} (ID: ${user.id})`);
    }

    // 2. Update auth.users app_metadata and user_metadata
    console.log('Updating auth.users app_metadata and user_metadata to role: "admin"...');
    const { data: authUser, error: authError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        app_metadata: { role: 'admin' },
        user_metadata: { role: 'admin' }
      }
    );

    if (authError) {
      console.error('Error updating auth user:', authError.message);
    } else {
      console.log('Successfully updated auth user permissions.');
      console.log('New app_metadata:', authUser.user.app_metadata);
      console.log('New user_metadata:', authUser.user.user_metadata);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

const targetEmail = 'psychoplastogens@gmail.com';
addAdmin(targetEmail);
