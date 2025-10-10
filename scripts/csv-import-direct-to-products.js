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
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/product_csv/10-08-25_inventory_list/CSV1-First%201500%20Lines%20-%20Columns%20Reduced.csv';

const BATCH_SIZE = 100; // Smaller batch size for direct import

// Transform CSV row to match main_site_products schema
function transformRowForProducts(row) {
  // Parse cannabinoid data from CSV if available
  const cannabinoidProfile = {
    thc_variants: {
      delta9_thc: 0,
      delta8_thc: 0,
      thca: 0,
      thcp: 0,
      thcv: 0
    },
    other_cannabinoids: {
      cbd: 0,
      cbg: 0,
      cbn: 0,
      cbc: 0
    },
    total_cannabinoids: 0,
    dominant_cannabinoid: null,
    profile_type: "full_spectrum"
  };

  // Parse effects data from CSV if available
  const effectsProfile = {
    primary_effects: [],
    secondary_effects: [],
    medicinal_benefits: [],
    best_for: [],
    avoid_if: []
  };

  // Parse terpene data if available
  const terpeneProfile = {
    primary_terpenes: [],
    aroma_notes: [],
    effects_influence: []
  };

  return {
    name: row.Name || row.name || '',
    description: row.Description || row.description || '',
    short_description: row['Short Description'] || '',
    sku: row.SKU || row.sku || '',
    price: parseFloat(row['Regular price'] || row.price || 0) || 0,
    compare_at_price: parseFloat(row['Sale price'] || row.sale_price || 0) || null,
    brand_id: row.Brands || row.brands || null,
    category_id: row.Categories || row.categories || null,
    stock_quantity: parseInt(row.Stock || row.stock || 0) || 0,
    weight: parseFloat(row['Weight (lbs)'] || row.weight || 0) || null,
    image_url: row.Images || row.images || null,
    image_urls: row.Images ? [row.Images] : [],
    attributes: {},
    specs: {},
    tags: row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [],
    is_active: true,
    featured: false,
    vip_exclusive: false,
    requires_membership: false,
    seo_title: row.Name || row.name || '',
    seo_description: row.Description || row.description || '',
    seo_keywords: row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [],
    nicotine_free: true,
    tobacco_free: true,
    farm_bill_compliant: true,
    cannabinoid_profile: cannabinoidProfile,
    terpene_profile: terpeneProfile,
    effects_profile: effectsProfile,
    psychoactive_profile: cannabinoidProfile, // Mirror cannabinoid data for psychoactive
    main_site_approved: true,
    main_site_approved_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  console.log('🚀 Starting direct CSV import to main_site_products table...');

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

  const rows = parsed.data.filter((r) => r && Object.keys(r).length > 0 && (r.Name || r.name));
  console.log(`📊 Found ${rows.length} valid product rows to import`);

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
      .map(row => transformRowForProducts(row))
      .filter(product => product.name && product.price > 0);

    if (batch.length === 0) {
      skipped += BATCH_SIZE;
      continue;
    }

    console.log(`📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} products)...`);

    const { data, error } = await supabase
      .from('main_site_products')
      .insert(batch, { returning: 'minimal' });

    if (error) {
      console.error('Insert error at batch starting index', i, error);
      console.error('First few rows of batch:', batch.slice(0, 2));
      throw error;
    }

    inserted += batch.length;
    console.log(`✅ Inserted ${inserted} products so far`);

    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`🎉 Import complete!`);
  console.log(`   ✅ Inserted: ${inserted} products`);
  console.log(`   ⏭️  Skipped: ${skipped} empty/invalid rows`);
  console.log(`   📊 Total processed: ${inserted + skipped} rows`);

  // Verification query
  const { count, error: countError } = await supabase
    .from('main_site_products')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error verifying import:', countError);
  } else {
    console.log(`📈 Total products in main_site_products table: ${count}`);
  }
}

main().catch((e) => {
  console.error('❌ Import failed:', e);
  process.exit(1);
});
