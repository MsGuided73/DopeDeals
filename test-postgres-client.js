import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
console.log('=== TESTING POSTGRES CLIENT ===');
console.log('Database URL:', databaseUrl);

try {
  // Create connection with proper config for Supabase
  const sql = postgres(databaseUrl, { 
    prepare: false,
    ssl: { rejectUnauthorized: false }
  });
  
  console.log('✅ Postgres client created');
  
  // Test connection
  const result = await sql`SELECT version()`;
  console.log('✅ Connection successful!');
  console.log('PostgreSQL version:', result[0].version);
  
  // Test table creation
  await sql`CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, name TEXT)`;
  console.log('✅ Table creation successful');
  
  // Clean up
  await sql`DROP TABLE IF EXISTS test_connection`;
  console.log('✅ Cleanup successful');
  
  await sql.end();
  console.log('✅ All tests passed - database connection working!');
  
} catch (error) {
  console.log('❌ Connection failed:', error.message);
  console.log('Error details:', error);
}