/*
  Airtable Sync Script with Explicit Environment Loading
  This script loads .env.local explicitly and syncs Airtable data to Supabase

  Usage: pnpm tsx scripts/sync-airtable-with-env.ts
*/

// Suppress punycode deprecation warning
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
    return; // Ignore punycode warnings
  }
  console.warn(warning);
});

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
    console.log('✓ Loaded environment variables from .env.local');
  } else {
    console.log('⚠ No .env.local file found');
  }
}

// Load environment first
loadEnvFile();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN!;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE_ID || 'Products';

console.log('🔧 Environment Check:');
console.log('  SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
console.log('  SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
console.log('  AIRTABLE_TOKEN:', AIRTABLE_TOKEN ? '✓' : '✗');
console.log('  AIRTABLE_BASE:', AIRTABLE_BASE ? '✓' : '✗');
console.log('  AIRTABLE_TABLE:', AIRTABLE_TABLE);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !AIRTABLE_TOKEN || !AIRTABLE_BASE) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function syncAirtableToSupabase() {
  console.log('🚀 Starting Airtable to Supabase sync...');
  
  try {
    // Fetch records from Airtable
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`;
    console.log('📡 Fetching from:', airtableUrl);
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const records = data.records || [];
    
    console.log(`📦 Found ${records.length} records in Airtable`);
    
    if (records.length === 0) {
      console.log('ℹ No records found to sync');
      return;
    }

    // Show sample record structure
    if (records[0]) {
      console.log('📋 Sample record fields:', Object.keys(records[0].fields || {}));
    }

    let synced = 0;
    let errors = 0;

    for (const record of records) {
      try {
        const fields = record.fields || {};
        
        // Map Airtable fields to your product structure
        const regularPrice = fields['Regular price'];
        const price = regularPrice ? parseFloat(regularPrice.toString().replace(/[^0-9.]/g, '')) : 0;
        const inStock = fields['In stock?'];
        const stockQuantity = inStock === 'Yes' ? 10 : 0; // Default stock if in stock

        const productData = {
          name: fields.Name,
          description: fields.Name, // Use name as description for now
          price: price,
          sku: fields.SKU,
          image_url: fields.Images?.[0]?.url,
          category_id: null, // Will need mapping
          brand_id: null,    // Will need mapping
          stock_quantity: stockQuantity,
          is_active: fields.Published === 'Yes' || fields.Published === true,
          source: 'airtable',
          airtable_record_id: record.id,
          updated_at: new Date().toISOString(),
          // Additional fields from Airtable
          tax_status: fields['Tax status'],
          visibility: fields['Visibility in catalog']
        };

        // Only sync if we have essential data
        if (productData.name && productData.price > 0) {
          // Check if product already exists by SKU or name
          const { data: existing } = await supa
            .from('products')
            .select('id')
            .or(`sku.eq.${productData.sku},name.eq.${productData.name}`)
            .limit(1);

          if (existing && existing.length > 0) {
            // Update existing product
            const { error } = await supa
              .from('products')
              .update(productData)
              .eq('id', existing[0].id);
              
            if (error) throw error;
            console.log(`✓ Updated: ${productData.name}`);
          } else {
            // Insert new product
            const { error } = await supa
              .from('products')
              .insert(productData);
              
            if (error) throw error;
            console.log(`✓ Added: ${productData.name}`);
          }
          
          synced++;
        } else {
          console.log(`⚠ Skipped record (missing name or price):`, record.id);
        }
        
      } catch (error) {
        console.error(`❌ Error syncing record ${record.id}:`, error);
        errors++;
      }
    }

    console.log(`\n🎉 Sync Complete!`);
    console.log(`  ✅ Synced: ${synced} products`);
    console.log(`  ❌ Errors: ${errors} products`);
    
  } catch (error) {
    console.error('💥 Sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncAirtableToSupabase();
