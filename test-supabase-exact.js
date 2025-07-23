import pkg from 'pg';
const { Client } = pkg;

// Test exact formats from the Supabase screenshot
async function testExactFormats() {
  console.log('Testing exact connection formats from Supabase dashboard...\n');
  
  // From the screenshot - these are the exact formats shown
  const formats = [
    {
      name: "Shared Connection Pooler (Current)",
      url: "postgresql://postgres.qirbapivptotybspnbet:vipsmoke2025@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    },
    {
      name: "Direct Connection (Migration Support)",
      url: "postgresql://postgres.qirbapivptotybspnbet:vipsmoke2025@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
    },
    {
      name: "IPv4 Dedicated Pooler",
      url: "postgresql://postgres:vipsmoke2025@db.qirbapivptotybspnbet.supabase.co:6543/postgres?pgbouncer=true"
    },
    {
      name: "Direct Connection IPv4",
      url: "postgresql://postgres:vipsmoke2025@db.qirbapivptotybspnbet.supabase.co:5432/postgres"
    }
  ];

  for (const format of formats) {
    console.log(`--- Testing: ${format.name} ---`);
    console.log(`URL: ${format.url}`);
    
    const client = new Client({
      connectionString: format.url,
      ssl: { 
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      const result = await client.query('SELECT version(), current_database()');
      console.log(`✅ SUCCESS: ${format.name}`);
      console.log(`Database: ${result.rows[0].current_database}`);
      await client.end();
      
      // Return the first working connection
      return format.url;
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      console.log(`Error code: ${error.code}`);
    }
    console.log('');
  }
  
  return null;
}

testExactFormats().then(workingUrl => {
  if (workingUrl) {
    console.log(`🎉 WORKING CONNECTION FOUND!`);
    console.log(`Use this DATABASE_URL:`);
    console.log(workingUrl);
  } else {
    console.log('❌ No working connection found');
  }
});