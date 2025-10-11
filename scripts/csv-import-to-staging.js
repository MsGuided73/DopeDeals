import 'dotenv/config';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

const CSV_URL =
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/product_csv/Inventory_list/100925-Updated%20CSV%20for%20Rebuild-v5150.csv';

const BATCH_SIZE = 500;

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  const csvText = await res.text();

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length) {
    console.error('Parse errors (first 3):', parsed.errors.slice(0, 3));
    throw new Error('CSV parse failed; see errors above.');
  }

  const rows = parsed.data.filter((r) => r && Object.keys(r).length > 0);

  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map((r) => {
      const out = {};
      for (const [k, v] of Object.entries(r)) {
        out[k] = v === undefined ? null : v;
      }
      return out;
    });

    const { error } = await supabase
      .from('_staging_products_csv_tmp')
      .insert(batch, { returning: 'minimal' });

    if (error) {
      console.error('Insert error at batch starting index', i, error);
      throw error;
    }

    inserted += batch.length;
    console.log(`Inserted ${inserted}/${rows.length}`);
  }

  console.log(`Done. Inserted ${inserted} rows into public._staging_products_csv_tmp`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
