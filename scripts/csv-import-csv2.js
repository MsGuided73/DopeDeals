import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// 1) Load env from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('[warn] .env.local not found. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
}

// 2) Required env vars
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[fatal] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// 3) Supabase client (service role, server-side only)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 4) Single CSV to process
const CSV_URL = 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/product_csv/10-08-25_inventory_list/CSV2-Next_1499_Lines-columns_reduced.csv';

// 5) Tweakable settings
const BATCH_SIZE = 500; // reduce if you hit payload/time limits
const TEMP_TABLE = '_staging_products_csv_tmp'; // using the staging table that worked before

// Enhanced CSV parser that handles malformed headers and quoted fields
function parseCsvSimple(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  // Use a more robust CSV parsing approach
  const headers = parseCsvLine(lines[0]);
  console.log(`[debug] Headers: ${headers.slice(0, 10).join(', ')}...`);

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] ?? '').trim();
    });
    rows.push(row);
  }
  return { headers, rows };
}

// Parse a single CSV line handling quotes and commas properly
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current.trim());

  return result;
}

async function fetchCsv(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${url} (status ${res.status})`);
  }
  return await res.text();
}

async function insertBatch(rows) {
  try {
    // Convert empty strings to null for better database compatibility
    const cleanedRows = rows.map(row => {
      const cleaned = {};
      for (const [key, value] of Object.entries(row)) {
        if (value === '' || value === null || value === undefined) {
          cleaned[key] = null;
        } else {
          cleaned[key] = value;
        }
      }
      return cleaned;
    });

    const { error } = await supabase.from(TEMP_TABLE).insert(cleanedRows, { returning: 'minimal' });
    if (error) throw error;
  } catch (error) {
    console.error('[error] Insert batch failed. First row sample:', JSON.stringify(rows[0], null, 2));
    console.error('[error] Full error:', error);
    throw error;
  }
}

async function importCsv(url) {
  console.log(`\n[info] Starting import: ${url}`);
  const csvText = await fetchCsv(url);
  const { headers, rows } = parseCsvSimple(csvText);

  if (rows.length === 0) {
    console.log('[info] CSV empty or only headers. Skipping.');
    return;
  }

  console.log(`[info] Parsed ${rows.length} rows with ${headers.length} columns.`);

  let start = 0;
  while (start < rows.length) {
    const batch = rows.slice(start, start + BATCH_SIZE);
    await insertBatch(batch);
    start += BATCH_SIZE;
    console.log(`[info] Inserted ${Math.min(start, rows.length)}/${rows.length}`);
  }

  console.log('[success] Import complete for:', url);
}

async function main() {
  try {
    await importCsv(CSV_URL);
    console.log('\n[done] CSV2 processed into temp table.');
  } catch (err) {
    console.error('[fatal] Import failed:', err?.message ?? err);
    process.exit(1);
  }
}

main();
