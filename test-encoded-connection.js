import postgres from 'postgres';

async function testEncodedConnection() {
  try {
    console.log('Testing connection with current DATABASE_URL...');
    
    // Try the connection as-is first
    const sql = postgres(process.env.DATABASE_URL, { prepare: false });
    
    const result = await sql`SELECT current_database() as db_name, version() as pg_version`;
    console.log('✅ Connection successful!');
    console.log('Database:', result[0].db_name);
    console.log('PostgreSQL version:', result[0].pg_version.split(' ')[0]);
    
    // Test creating a simple table
    await sql`CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())`;
    console.log('✅ Table creation test successful!');
    
    // Clean up test table
    await sql`DROP TABLE IF EXISTS connection_test`;
    console.log('✅ Table cleanup successful!');
    
    await sql.end();
    console.log('✅ All database tests passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('');
      console.log('🔧 DIAGNOSIS: DNS resolution failed');
      console.log('This usually means:');
      console.log('1. Hostname is incorrect');
      console.log('2. Special characters in password are not URL-encoded');
      console.log('3. Missing port number (:6543)');
      console.log('');
      console.log('📋 PLEASE CHECK:');
      console.log('- Are you using the Transaction pooler URL?');
      console.log('- Did you replace @ with %40 in your password?');
      console.log('- Did you replace ! with %21 in your password?');
      console.log('- Does your URL include :6543 port?');
    }
  }
}

testEncodedConnection();