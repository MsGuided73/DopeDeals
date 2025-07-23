import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

async function setupDatabase() {
  // Handle special characters in password by URL encoding them manually
  let connectionString = process.env.DATABASE_URL;
  
  // Manual parsing for complex password with @ and ! characters
  // Expected format: postgres://postgres:SAB@459dcr!@db.qirbapivptotybspnbet.supabase.co:6543/postgres
  const parts = connectionString.split(':');
  if (parts.length < 4) {
    throw new Error('Invalid DATABASE_URL format');
  }
  
  const username = 'postgres';
  
  // Extract password: everything between second : and before the hostname
  // From: postgres://postgres:SAB@459dcr!@db.qirbapivptotybspnbet.supabase.co:6543/postgres
  // Password is: SAB@459dcr!
  const afterSecondColon = parts.slice(2).join(':'); // "SAB@459dcr!@db.qirbapivptotybspnbet.supabase.co:6543/postgres"
  const hostStartIndex = afterSecondColon.indexOf('@db.'); // Find where host starts
  const rawPassword = afterSecondColon.substring(0, hostStartIndex); // "SAB@459dcr!"
  const hostAndDb = afterSecondColon.substring(hostStartIndex + 1); // "db.qirbapivptotybspnbet.supabase.co:6543/postgres"
  
  console.log('Detected password:', rawPassword);
  console.log('Host and DB:', hostAndDb);
  
  // URL encode special characters in password
  const encodedPassword = encodeURIComponent(rawPassword);
  
  // Reconstruct the connection string with encoded password
  connectionString = `postgresql://${username}:${encodedPassword}@${hostAndDb}`;
  
  console.log('Using encoded connection string...');
  
  const client = new Client({
    connectionString,
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