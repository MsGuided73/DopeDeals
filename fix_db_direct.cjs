const pg = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixUsersTable() {
  const client = await pool.connect();
  try {
    console.log('--- Fixing users table via direct PG connection ---');
    
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'");
    console.log("Success: Added column 'role'");
    
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true");
    console.log("Success: Added column 'is_active'");
    
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_tier_id UUID");
    console.log("Success: Added column 'membership_tier_id'");

    console.log('\n--- Checking lab_certificates table ---');
    const res = await client.query("SELECT COUNT(*) FROM lab_certificates");
    console.log(`Current COA count in lab_certificates: ${res.rows[0].count}`);

  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixUsersTable();
