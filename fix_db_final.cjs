const pg = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

// Map of categories to lab results (simulated since bucket is empty)
const simulatedCOAs = [
  {
    product_name: "Truemoola Blue Lotus Gummies",
    product_sku: "TRU-BLG-001",
    brand_name: "Truemoola",
    lab_name: "Green Scientific Labs",
    test_date: "2025-11-15",
    file_url: "https://sigdistro.com/wp-content/uploads/2024/01/COA-Placeholder.pdf"
  },
  {
    product_name: "Blaze Delta-8 Disposables",
    product_sku: "BLZ-D8-900",
    brand_name: "Blaze",
    lab_name: "Kaycha Labs",
    test_date: "2025-12-01",
    file_url: "https://sigdistro.com/wp-content/uploads/2024/01/COA-Placeholder.pdf"
  }
];

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixDatabase() {
  const client = await pool.connect();
  try {
    console.log('--- Fixing users table ---');
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'");
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true");
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_tier_id UUID");
    console.log("Success: Users table updated.");

    console.log('\n--- Seeding lab_certificates table ---');
    // Clear existing if any (optional)
    // await client.query("DELETE FROM lab_certificates");
    
    // Get a product ID for seeding
    const prodRes = await client.query("SELECT id FROM main_site_products LIMIT 2");
    if (prodRes.rows.length > 0) {
      for (let i = 0; i < prodRes.rows.length; i++) {
        const coa = simulatedCOAs[i] || simulatedCOAs[0];
        const prodId = prodRes.rows[i].id;
        
        await client.query(`
          INSERT INTO lab_certificates (product_id, batch_number, lab_name, tested_at, url, is_valid)
          VALUES ($1, $2, $3, $4, $5, true)
          ON CONFLICT DO NOTHING
        `, [prodId, coa.product_sku, coa.lab_name, coa.test_date, coa.file_url]);
        
        console.log(`Seeded COA for product ${prodId}`);
      }
    } else {
      console.log("No products found to link COAs to.");
    }

  } catch (err) {
    console.error('Error during database operations:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixDatabase();
