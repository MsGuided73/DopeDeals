import { neon } from '@neondatabase/serverless';
import pkg from 'pg';
const { Client } = pkg;

// Test different connection formats from Supabase dashboard
async function testConnectionFormats() {
  const baseUrl = "postgresql://postgres.qirbapivptotybspnbet:vipsmoke2025@aws-0-us-west-1.pooler.supabase.com:6543/postgres";
  
  const formats = [
    // Current format (Transaction pooler)
    baseUrl,
    
    // With SSL mode
    baseUrl + "?sslmode=require",
    
    // With pgbouncer=true
    baseUrl + "?pgbouncer=true",
    
    // Direct connection format (from screenshot)
    "postgresql://postgres.qirbapivptotybspnbet:vipsmoke2025@aws-0-us-west-1.pooler.supabase.com:5432/postgres",
    
    // IPv4 dedicated pooler format
    "postgresql://postgres:vipsmoke2025@db.qirbapivptotybspnbet.supabase.co:6543/postgres?pgbouncer=true",
    
    // Alternative pooler format
    "postgresql://postgres:vipsmoke2025@db.qirbapivptotybspnbet.supabase.co:5432/postgres"
  ];

  for (let i = 0; i < formats.length; i++) {
    const url = formats[i];
    console.log(`\n--- Testing Format ${i + 1} ---`);
    console.log(`URL: ${url}`);
    
    // Test with Neon client
    try {
      const sql = neon(url);
      const result = await sql`SELECT 1 as test`;
      console.log(`✅ Neon client SUCCESS:`, result[0]);
      return url; // Return first working format
    } catch (error) {
      console.log(`❌ Neon client failed:`, error.message);
    }

    // Test with pg client
    try {
      const client = new Client({
        connectionString: url,
        ssl: { rejectUnauthorized: false }
      });
      await client.connect();
      const result = await client.query('SELECT NOW()');
      console.log(`✅ PG client SUCCESS:`, result.rows[0]);
      await client.end();
      return url; // Return first working format
    } catch (error) {
      console.log(`❌ PG client failed:`, error.message);
    }
  }
  
  console.log('\n❌ All connection formats failed');
  return null;
}

testConnectionFormats().then(workingUrl => {
  if (workingUrl) {
    console.log(`\n🎉 WORKING CONNECTION FOUND:`);
    console.log(workingUrl);
  }
});