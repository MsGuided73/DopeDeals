const { neon } = require('@neondatabase/serverless');

const correctUrl = "postgresql://postgres:SAB%40459dcr%21@aws-0-us-west-1.pooler.supabase.com:6543/postgres";

console.log('Testing corrected URL format...');
console.log('URL:', correctUrl);

async function testConnection() {
  try {
    const sql = neon(correctUrl);
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Connection successful!');
    console.log('Test query result:', result);
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('Error details:', error);
  }
}

testConnection();