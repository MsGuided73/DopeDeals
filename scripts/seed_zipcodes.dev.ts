/**
 * Dev-only seed for us_zipcodes
 * Usage (PowerShell):
 *   $env:SUPABASE_URL="https://your.supabase.co"; `
 *   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"; `
 *   pnpm tsx scripts/seed_zipcodes.dev.ts
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase envs. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const seed = [
  { zip: '90001', state: 'CA', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '94105', state: 'CA', city: 'San Francisco', county: 'San Francisco' },
  { zip: '10001', state: 'NY', city: 'New York', county: 'New York' },
  { zip: '73301', state: 'TX', city: 'Austin', county: 'Travis' },
  { zip: '33101', state: 'FL', city: 'Miami', county: 'Miami-Dade' },
  { zip: '60601', state: 'IL', city: 'Chicago', county: 'Cook' },
  { zip: '00901', state: 'PR', city: 'San Juan', county: 'San Juan' },
  { zip: '96910', state: 'GU', city: 'Hagåtña', county: 'Guam' },
  { zip: '09009', state: 'AE', city: 'APO', county: 'Armed Forces Europe' }
];

async function main() {
  const { error } = await supabase
    .from('us_zipcodes')
    .upsert(seed, { onConflict: 'zip' });

  if (error) {
    console.error('Failed seeding us_zipcodes:', error.message);
    process.exit(1);
  }

  console.log('✅ Seeded us_zipcodes with', seed.length, 'rows');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

