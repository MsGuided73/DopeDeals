import pkg from 'pg';
const { Client } = pkg;

// Test different authentication approaches
async function testAuthMethods() {
  console.log('Testing different authentication methods...\n');

  // Test 1: Try with explicit SSL disable
  console.log('--- Test 1: SSL Disabled ---');
  try {
    const client = new Client({
      host: 'aws-0-us-west-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres.qirbapivptotybspnbet',
      password: 'vipsmoke2025',
      ssl: false
    });
    await client.connect();
    console.log('✅ SSL disabled connection works!');
    await client.end();
    return 'ssl-disabled';
  } catch (error) {
    console.log(`❌ SSL disabled failed: ${error.message}`);
  }

  // Test 2: Try with simple postgres user
  console.log('\n--- Test 2: Simple Username ---');
  try {
    const client = new Client({
      host: 'aws-0-us-west-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres',
      password: 'vipsmoke2025',
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    console.log('✅ Simple username works!');
    await client.end();
    return 'simple-username';
  } catch (error) {
    console.log(`❌ Simple username failed: ${error.message}`);
  }

  // Test 3: Direct connection port 5432
  console.log('\n--- Test 3: Direct Connection Port 5432 ---');
  try {
    const client = new Client({
      host: 'aws-0-us-west-1.pooler.supabase.com',
      port: 5432,
      database: 'postgres',
      user: 'postgres.qirbapivptotybspnbet',
      password: 'vipsmoke2025',
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    console.log('✅ Direct connection works!');
    await client.end();
    return 'direct-connection';
  } catch (error) {
    console.log(`❌ Direct connection failed: ${error.message}`);
  }

  return 'none';
}

testAuthMethods().then(result => {
  console.log(`\nResult: ${result}`);
  if (result === 'none') {
    console.log('\n🚨 CRITICAL: Need fresh connection string from Supabase dashboard');
    console.log('Please copy the exact connection string from Settings → Database → Connection String');
  }
});