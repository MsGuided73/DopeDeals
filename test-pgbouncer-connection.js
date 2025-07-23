import pkg from 'pg';
const { Client } = pkg;
import { neon } from '@neondatabase/serverless';

// Test the exact connection string with pgbouncer=true
async function testPgBouncerConnection() {
  const connectionString = "postgresql://postgres.qirbapivptotybspnbet:vipsmoke2025@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  
  console.log('Testing exact connection string with pgbouncer=true...');
  console.log('URL:', connectionString);
  
  // Test with pg client
  console.log('\n--- Testing with pg Client ---');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ PG Client connected successfully!');
    
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('Database info:', result.rows[0]);
    
    // Test table creation
    await client.query('CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())');
    console.log('✅ Table creation successful');
    
    await client.query('DROP TABLE connection_test');
    console.log('✅ Table cleanup successful');
    
    await client.end();
    return true;
    
  } catch (error) {
    console.log('❌ PG Client failed:', error.message);
    if (error.code) console.log('Error code:', error.code);
  }

  // Test with Neon client
  console.log('\n--- Testing with Neon Client ---');
  try {
    const sql = neon(connectionString);
    const result = await sql`SELECT 1 as test, current_database(), current_user`;
    console.log('✅ Neon client connected successfully!');
    console.log('Database info:', result[0]);
    return true;
  } catch (error) {
    console.log('❌ Neon client failed:', error.message);
  }

  return false;
}

testPgBouncerConnection().then(success => {
  if (success) {
    console.log('\n🎉 CONNECTION SUCCESSFUL!');
    console.log('Ready to update DATABASE_URL and switch to database storage');
  } else {
    console.log('\n❌ Connection still failing');
  }
});