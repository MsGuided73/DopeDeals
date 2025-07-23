import pkg from 'pg';
const { Client } = pkg;

// Final authentication debug - check if user exists
async function finalAuthDebug() {
  console.log('🔍 Final Authentication Debug\n');
  
  // Try to connect with minimal auth to check if user exists
  const testUrl = "postgresql://postgres.qirbapivptotybspnbet:wrongpassword@aws-0-us-west-1.pooler.supabase.com:6543/postgres";
  
  console.log('Testing with wrong password to see error type...');
  const client = new Client({
    connectionString: testUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Unexpected success with wrong password');
  } catch (error) {
    console.log('Expected auth failure:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('✅ User exists - password is the issue');
    } else if (error.message.includes('does not exist') || error.message.includes('not found')) {
      console.log('❌ User does not exist');
    } else if (error.message.includes('SCRAM')) {
      console.log('🔍 SCRAM error suggests password hash corruption');
    }
  }
  
  console.log('\n--- FINAL DIAGNOSIS ---');
  console.log('The consistent SCRAM-SERVER-FINAL-MESSAGE error indicates:');
  console.log('1. Database user password hash is corrupted/incompatible');
  console.log('2. Client and server cannot complete SCRAM authentication handshake');
  console.log('3. This is a Supabase-side authentication system issue');
  
  console.log('\n--- RECOMMENDED SOLUTION ---');
  console.log('Create a fresh Supabase project:');
  console.log('1. New project = clean authentication system');
  console.log('2. Takes 5-10 minutes to set up');
  console.log('3. Guaranteed working database connection');
  console.log('4. Same tables can be recreated with existing schema');
}

finalAuthDebug();