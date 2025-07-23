import postgres from 'postgres';

// Test with the raw password (no encoding) since pooler might handle encoding differently
const rawPassword = 'SAB@459dcr!';
const testUrls = [
  // Original format with encoded password
  'postgresql://postgres.qirbapivptotybspnbet:SAB%40459dcr%21@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
  
  // Raw password format 
  `postgresql://postgres.qirbapivptotybspnbet:${rawPassword}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
  
  // Session pooler (port 5432)
  `postgresql://postgres.qirbapivptotybspnbet:${rawPassword}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
  
  // Different SSL config
];

console.log('=== TESTING DIFFERENT PASSWORD FORMATS ===');

for (let i = 0; i < testUrls.length; i++) {
  const url = testUrls[i];
  console.log(`\nTEST ${i + 1}: ${i === 0 ? 'Encoded password' : i === 1 ? 'Raw password (6543)' : 'Raw password (5432)'}`);
  
  try {
    const sql = postgres(url, { 
      prepare: false,
      ssl: { rejectUnauthorized: false },
      connection: {
        application_name: 'vip-smoke-app'
      }
    });
    
    const result = await sql`SELECT 1 as test`;
    console.log('✅ SUCCESS!');
    console.log('Working URL:', url.replace(rawPassword, '[PASSWORD]'));
    await sql.end();
    break;
    
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
}