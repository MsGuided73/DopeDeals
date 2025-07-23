import { neon } from '@neondatabase/serverless';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
console.log('=== DATABASE CONNECTION DIAGNOSIS ===');
console.log('Database URL:', databaseUrl);
console.log('');

// Test 1: Try with neon client (what we're currently using)
console.log('TEST 1: Neon client connection...');
try {
  const sql = neon(databaseUrl);
  const result = await sql`SELECT version()`;
  console.log('✅ Neon client SUCCESS:', result[0]);
} catch (error) {
  console.log('❌ Neon client FAILED:', error.message);
  console.log('Error code:', error.code);
  console.log('Error details:', error.detail || 'No details');
}

console.log('');

// Test 2: Try with regular pg client
console.log('TEST 2: PostgreSQL pg client connection...');
try {
  const client = new pg.Client(databaseUrl);
  await client.connect();
  const result = await client.query('SELECT version()');
  console.log('✅ pg client SUCCESS:', result.rows[0]);
  await client.end();
} catch (error) {
  console.log('❌ pg client FAILED:', error.message);
  console.log('Error code:', error.code);
  console.log('Error details:', error.detail || 'No details');
}

console.log('');

// Test 3: Parse and analyze URL components
console.log('TEST 3: URL component analysis...');
try {
  const url = new URL(databaseUrl);
  console.log('Protocol:', url.protocol);
  console.log('Username:', url.username);
  console.log('Password length:', url.password ? url.password.length : 0);
  console.log('Password (first 3 chars):', url.password ? url.password.substring(0, 3) + '...' : 'None');
  console.log('Hostname:', url.hostname);
  console.log('Port:', url.port);
  console.log('Database name:', url.pathname.substring(1));
  
  // Check if password needs different encoding
  const decodedPassword = decodeURIComponent(url.password);
  console.log('Decoded password length:', decodedPassword.length);
  console.log('Contains @:', decodedPassword.includes('@'));
  console.log('Contains !:', decodedPassword.includes('!'));
} catch (error) {
  console.log('❌ URL parsing failed:', error.message);
}

console.log('');

// Test 4: Try alternative URL formats
console.log('TEST 4: Testing alternative connection formats...');

// Format 1: Using postgres://
const altUrl1 = databaseUrl.replace('postgresql://', 'postgres://');
console.log('Alternative format 1 (postgres://):', altUrl1);
try {
  const sql1 = neon(altUrl1);
  const result1 = await sql1`SELECT 1 as test`;
  console.log('✅ Alternative format 1 SUCCESS');
} catch (error) {
  console.log('❌ Alternative format 1 FAILED:', error.message);
}

// Format 2: Try without port
const url = new URL(databaseUrl);
const altUrl2 = `postgresql://${url.username}:${url.password}@${url.hostname}/postgres`;
console.log('Alternative format 2 (no port):', altUrl2);
try {
  const sql2 = neon(altUrl2);
  const result2 = await sql2`SELECT 1 as test`;
  console.log('✅ Alternative format 2 SUCCESS');
} catch (error) {
  console.log('❌ Alternative format 2 FAILED:', error.message);
}

console.log('=== DIAGNOSIS COMPLETE ===');