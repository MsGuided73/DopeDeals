import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

async function setupDatabase() {
  // Use URL constructor to properly parse DATABASE_URL with special characters
  const dbUrl = new URL(process.env.DATABASE_URL);
  
  const user = dbUrl.username;
  const password = dbUrl.password; // Already decoded by URL constructor
  const host = dbUrl.hostname;
  const port = dbUrl.port;
  const database = dbUrl.pathname.slice(1); // Remove leading slash
  
  const client = new Client({
    user,
    password,
    host,
    port: parseInt(port),
    database,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected successfully!');
    
    // Read and execute the SQL file
    const sql = fs.readFileSync('create_tables.sql', 'utf8');
    console.log('Creating tables...');
    await client.query(sql);
    console.log('All tables created successfully!');
    
    // Check table count
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`Created ${result.rows.length} tables:`);
    result.rows.forEach(row => console.log(`- ${row.table_name}`));
    
  } catch (error) {
    console.error('Database setup failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

setupDatabase().catch(console.error);