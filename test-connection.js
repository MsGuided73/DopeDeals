import postgres from 'postgres';

async function testConnection() {
  try {
    console.log('Testing direct Supabase connection...');
    
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 60,
    });
    
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Connection successful!', result);
    
    // Test creating a simple table
    await sql`CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT)`;
    console.log('✅ Table creation successful!');
    
    await sql.end();
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Try alternative connection method
    console.log('Trying alternative connection...');
    try {
      const altSql = postgres(process.env.DATABASE_URL, {
        ssl: false,
        max: 1,
      });
      
      const result = await altSql`SELECT 1 as test`;
      console.log('✅ Alternative connection successful!', result);
      await altSql.end();
      
    } catch (altError) {
      console.error('❌ Alternative connection also failed:', altError.message);
    }
  }
}

testConnection();