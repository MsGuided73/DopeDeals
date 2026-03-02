const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function elevateUser(id) {
  console.log('--- Elevating User to Admin ---');
  
  // 1. Update Auth metadata
  const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
    id,
    { app_metadata: { role: 'admin' } }
  );

  if (authError) {
    console.error('Error updating auth metadata:', authError);
  } else {
    console.log('Auth metadata updated successfully for admin');
  }

  // 2. Check if users table has role column and update it
  // I know from previous check it might NOT have it, but I should try to add it or update if it exists
  const { error: dbError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', id);

  if (dbError) {
    console.log('Note: Database update failed (likely missing role column), but Auth metadata is set:', dbError.message);
  } else {
    console.log('Database user profile updated with admin role');
  }
}

const userId = '3f7e15dc-e19f-441b-9d52-dbe00d96c868'; // dcbenson73@gmail.com
elevateUser(userId);
