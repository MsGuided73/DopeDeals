import pkg from 'pg';
const { Client } = pkg;

// Comprehensive authentication diagnosis
async function diagnoseAuth() {
  console.log('🔍 Comprehensive Supabase Authentication Diagnosis\n');
  
  // Check current DATABASE_URL
  const currentUrl = process.env.DATABASE_URL;
  console.log('Current DATABASE_URL:', currentUrl);
  
  try {
    const parsed = new URL(currentUrl);
    console.log('Parsed components:');
    console.log('  Protocol:', parsed.protocol);
    console.log('  Username:', parsed.username);
    console.log('  Password:', parsed.password);
    console.log('  Hostname:', parsed.hostname);
    console.log('  Port:', parsed.port);
    console.log('  Database:', parsed.pathname);
    console.log('  Search params:', parsed.search);
  } catch (e) {
    console.log('URL parsing failed:', e.message);
  }
  
  console.log('\n--- Testing Raw TCP Connection ---');
  try {
    const net = await import('net');
    const socket = new net.Socket();
    
    const tcpTest = new Promise((resolve, reject) => {
      socket.setTimeout(5000);
      socket.on('connect', () => {
        console.log('✅ TCP connection successful');
        socket.destroy();
        resolve(true);
      });
      socket.on('error', (err) => {
        console.log('❌ TCP connection failed:', err.message);
        reject(err);
      });
      socket.on('timeout', () => {
        console.log('❌ TCP connection timeout');
        socket.destroy();
        reject(new Error('Timeout'));
      });
    });
    
    socket.connect(6543, 'aws-0-us-west-1.pooler.supabase.com');
    await tcpTest;
    
  } catch (error) {
    console.log('TCP test failed:', error.message);
  }
  
  console.log('\n--- Testing Authentication Protocols ---');
  
  // Test different SASL mechanisms
  const authTests = [
    {
      name: 'Standard Connection',
      config: {
        host: 'aws-0-us-west-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.qirbapivptotybspnbet',
        password: 'vipsmoke2025',
        ssl: { rejectUnauthorized: false }
      }
    },
    {
      name: 'No SSL',
      config: {
        host: 'aws-0-us-west-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.qirbapivptotybspnbet',
        password: 'vipsmoke2025',
        ssl: false
      }
    },
    {
      name: 'Port 5432 Direct',
      config: {
        host: 'aws-0-us-west-1.pooler.supabase.com',
        port: 5432,
        database: 'postgres',
        user: 'postgres.qirbapivptotybspnbet',
        password: 'vipsmoke2025',
        ssl: { rejectUnauthorized: false }
      }
    }
  ];
  
  for (const test of authTests) {
    console.log(`\nTesting: ${test.name}`);
    const client = new Client(test.config);
    
    try {
      await client.connect();
      console.log(`✅ ${test.name} - SUCCESS!`);
      const result = await client.query('SELECT version()');
      console.log('Database version:', result.rows[0].version.substring(0, 50) + '...');
      await client.end();
      return test.config;
    } catch (error) {
      console.log(`❌ ${test.name} - Failed: ${error.message}`);
      if (error.code) console.log(`   Error code: ${error.code}`);
    }
  }
  
  console.log('\n🚨 DIAGNOSIS COMPLETE - NO WORKING CONNECTION FOUND');
  console.log('\nThis indicates either:');
  console.log('1. Password is still incorrect despite reset');
  console.log('2. Username format mismatch');
  console.log('3. Database authentication configuration issue');
  console.log('4. Network/firewall blocking connection');
  
  return null;
}

diagnoseAuth().then(workingConfig => {
  if (workingConfig) {
    console.log('\n🎉 WORKING CONFIGURATION:');
    console.log(JSON.stringify(workingConfig, null, 2));
  } else {
    console.log('\n❌ RECOMMENDATION: Create a new Supabase project with fresh credentials');
  }
});