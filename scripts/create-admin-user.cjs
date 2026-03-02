const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdminUser() {
  try {
    const email = 'admin-master@highway420store.com';
    const password = 'AdminMaster123!@#';
    
    console.log(`Creating admin user: ${email}...`);
    
    // Create admin user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        first_name: 'Admin',
        last_name: 'Master'
      },
      app_metadata: {
        role: 'admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists in Auth. Updating metadata...');
        // Find user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          await supabase.auth.admin.updateUserById(existingUser.id, { app_metadata: { role: 'admin' } });
          console.log('Auth metadata updated for existing user.');
        }
      } else {
        console.error('Error creating admin user in Auth:', authError);
        return;
      }
    } else {
      console.log('Admin user created in Auth:', authData.user.email);
    }

    // Attempt to update/upsert into users table (even if role column might be missing)
    // We get the ID from authData or by looking it up if it already existed
    let userId;
    if (authData && authData.user) {
      userId = authData.user.id;
    } else {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      userId = users.find(u => u.email === email)?.id;
    }

    if (userId) {
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: email,
          first_name: 'Admin',
          last_name: 'Master',
          // role: 'admin', // Skip if column is missing to avoid error, metadata is enough for now
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.log('Note: Database user profile upsert failed (non-critical):', profileError.message);
      } else {
        console.log('Admin user profile upserted successfully');
      }
    }

    console.log('\n--- SUCCESS ---');
    console.log('You can now log in with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('URL: /admin');

  } catch (error) {
    console.error('Script error:', error);
  }
}

createAdminUser();
