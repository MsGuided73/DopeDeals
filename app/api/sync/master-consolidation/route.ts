import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * MASTER DATA CONSOLIDATION ENDPOINT
 * 
 * Consolidates data from multiple sources in optimal order:
 * 1. Zoho Categories → Fix foreign key constraints
 * 2. Airtable Product Details → Rich descriptions & images
 * 3. Zoho Inventory → Real-time stock levels
 * 4. Zoho Products → Complete product sync
 * 
 * This ensures data integrity and maximizes successful syncs.
 */

export async function POST(request: NextRequest) {
  try {
    const { 
      syncCategories = true,
      syncAirtable = true, 
      syncInventory = true,
      syncProducts = true,
      fullSync = false 
    } = await request.json().catch(() => ({}));

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Master Consolidation] Starting comprehensive data sync');

    const results = {
      categories: { success: 0, failed: 0, skipped: false },
      airtable: { success: 0, failed: 0, skipped: false },
      inventory: { success: 0, failed: 0, skipped: false },
      products: { success: 0, failed: 0, skipped: false },
      totalTime: 0,
      errors: [] as string[]
    };

    const startTime = Date.now();

    // PHASE 1: Sync Categories First (fixes foreign key constraints)
    if (syncCategories) {
      try {
        console.log('[Master Consolidation] Phase 1: Syncing categories from Zoho');
        const categoryResult = await syncZohoCategories(supabase);
        results.categories = categoryResult;
      } catch (error) {
        results.categories.failed = 1;
        results.errors.push(`Categories sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      results.categories.skipped = true;
    }

    // PHASE 2: Sync Airtable Product Details (rich content)
    if (syncAirtable) {
      try {
        console.log('[Master Consolidation] Phase 2: Syncing product details from Airtable');
        const airtableResult = await syncAirtableProducts(supabase);
        results.airtable = airtableResult;
      } catch (error) {
        results.airtable.failed = 1;
        results.errors.push(`Airtable sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      results.airtable.skipped = true;
    }

    // PHASE 3: Sync Inventory Levels (real-time stock)
    if (syncInventory) {
      try {
        console.log('[Master Consolidation] Phase 3: Syncing inventory from Zoho');
        const inventoryResult = await syncZohoInventory(supabase);
        results.inventory = inventoryResult;
      } catch (error) {
        results.inventory.failed = 1;
        results.errors.push(`Inventory sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      results.inventory.skipped = true;
    }

    // PHASE 4: Final Product Sync (complete remaining products)
    if (syncProducts) {
      try {
        console.log('[Master Consolidation] Phase 4: Final product sync from Zoho');
        const productResult = await syncZohoProducts(supabase, fullSync);
        results.products = productResult;
      } catch (error) {
        results.products.failed = 1;
        results.errors.push(`Products sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      results.products.skipped = true;
    }

    results.totalTime = Date.now() - startTime;

    console.log('[Master Consolidation] Consolidation completed:', results);

    return NextResponse.json({
      success: true,
      consolidationType: 'master',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Master Consolidation] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function to get Zoho access token
async function getZohoAccessToken(): Promise<string> {
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const dc = process.env.ZOHO_DC || 'us';

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error('Missing Zoho credentials');
  }

  const tokenUrl = `https://accounts.${dc}.zoho.com/oauth/v2/token`;
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token'
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Phase 1: Sync Categories
async function syncZohoCategories(supabase: any) {
  const accessToken = await getZohoAccessToken();
  const dc = process.env.ZOHO_DC || 'us';
  const orgId = process.env.ZOHO_ORGANIZATION_ID;

  const categoriesUrl = `https://inventory.${dc}.zoho.com/api/v1/categories?organization_id=${orgId}`;
  const response = await fetch(categoriesUrl, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Zoho Categories API error: ${response.status}`);
  }

  const data = await response.json();
  let success = 0, failed = 0;

  for (const category of data.categories || []) {
    try {
      const categoryData = {
        id: category.category_id,
        name: category.category_name,
        description: category.description || '',
        parent_id: category.parent_category_id || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('categories')
        .upsert([categoryData], { onConflict: 'id' });

      if (error) throw error;
      success++;
    } catch (error) {
      failed++;
      console.error(`Failed to sync category ${category.category_id}:`, error);
    }
  }

  return { success, failed };
}

// Phase 2: Sync Airtable Products
async function syncAirtableProducts(supabase: any) {
  const airtableToken = process.env.AIRTABLE_TOKEN;
  const airtableBase = process.env.AIRTABLE_BASE;
  const airtableTable = process.env.AIRTABLE_TABLE || 'Products';

  if (!airtableToken || !airtableBase) {
    throw new Error('Missing Airtable credentials');
  }

  const url = `https://api.airtable.com/v0/${airtableBase}/${encodeURIComponent(airtableTable)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${airtableToken}` }
  });

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const data = await response.json();
  let success = 0, failed = 0;

  for (const record of data.records || []) {
    try {
      const fields = record.fields;
      const sku = fields.SKU || fields.sku;
      
      if (!sku) continue;

      // Update product with rich Airtable data
      const productData = {
        name: fields.Name || fields.name,
        short_description: fields['Short Description'] || fields.short_description,
        description_md: fields.Description || fields.description,
        airtable_record_id: record.id,
        updated_at: new Date().toISOString()
      };

      const { error: productError } = await supabase
        .from('products')
        .update(productData)
        .eq('sku', sku);

      if (productError) throw productError;

      // Handle image attachments
      const images = fields.Images || fields.images || [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        await uploadProductImage(supabase, sku, image, i);
      }

      success++;
    } catch (error) {
      failed++;
      console.error(`Failed to sync Airtable record ${record.id}:`, error);
    }
  }

  return { success, failed };
}

// Helper function to upload product images
async function uploadProductImage(supabase: any, sku: string, image: any, index: number) {
  try {
    // Download image from Airtable
    const response = await fetch(image.url);
    if (!response.ok) return;

    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = image.filename || `image_${index}.jpg`;
    const path = `products/${sku}/${filename}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(path, buffer, {
        upsert: true,
        contentType: image.type || 'image/jpeg'
      });

    if (uploadError) throw uploadError;

    // Get product ID
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('sku', sku)
      .single();

    if (!product) return;

    // Create product_media record
    const mediaData = {
      product_id: product.id,
      type: 'image',
      path: path,
      alt: image.filename || `${sku} image ${index + 1}`,
      role: index === 0 ? 'primary' : 'gallery',
      sort: index,
      width: image.width,
      height: image.height
    };

    await supabase
      .from('product_media')
      .upsert([mediaData], { onConflict: 'product_id,path' });

  } catch (error) {
    console.error(`Failed to upload image for SKU ${sku}:`, error);
  }
}

// Phase 3: Sync Inventory
async function syncZohoInventory(supabase: any) {
  // Call the existing inventory sync endpoint logic
  const response = await fetch('/api/zoho/sync-inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullSync: true })
  });

  if (!response.ok) {
    throw new Error('Inventory sync failed');
  }

  const result = await response.json();
  return { success: result.result?.success || 0, failed: result.result?.failed || 0 };
}

// Phase 4: Sync Products
async function syncZohoProducts(supabase: any, fullSync: boolean) {
  // Call the existing product sync endpoint logic
  const response = await fetch('/api/zoho/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ syncType: 'products', fullSync })
  });

  if (!response.ok) {
    throw new Error('Product sync failed');
  }

  const result = await response.json();
  return { success: result.result?.success || 0, failed: result.result?.failed || 0 };
}
