import pkg from 'pg';
const { Client } = pkg;

// Test the direct connection format from Supabase dashboard
async function testDirectConnection() {
  // Based on the screenshot, try direct connection on port 5432
  const directUrl = "postgresql://postgres.qirbapivptotybspnbet:vipsmoke2025@aws-0-us-west-1.pooler.supabase.com:5432/postgres";
  
  console.log('Testing DIRECT connection format...');
  console.log('URL:', directUrl);
  
  const client = new Client({
    connectionString: directUrl,
    ssl: { 
      rejectUnauthorized: false,
      mode: 'require'
    }
  });

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('Database info:', result.rows[0]);
    
    // Test creating a simple table
    await client.query('CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())');
    console.log('✅ Table creation test passed');
    
    await client.query('DROP TABLE test_connection');
    console.log('✅ Table cleanup completed');
    
    await client.end();
    console.log('✅ All tests passed - Direct connection working!');
    return true;
    
  } catch (error) {
    console.log('❌ Direct connection failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Error detail:', error.detail);
    return false;
  }
}

testDirectConnection();