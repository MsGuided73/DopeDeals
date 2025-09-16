import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { fullSync = false } = await request.json().catch(() => ({}));

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Zoho Inventory Sync] Starting inventory sync');

    // Get Zoho access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error('Failed to get Zoho access token');
    }

    // Sync inventory from Zoho
    const result = await syncInventoryFromZoho(supabase, accessToken);

    return NextResponse.json({
      success: true,
      syncType: 'inventory',
      fullSync,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Zoho Inventory Sync] Error:', error);
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

async function getValidAccessToken(): Promise<string | null> {
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

async function syncInventoryFromZoho(supabase: any, accessToken: string) {
  const dc = process.env.ZOHO_DC || 'us';
  const orgId = process.env.ZOHO_ORGANIZATION_ID;

  if (!orgId) {
    throw new Error('Missing Zoho organization ID');
  }

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
    updated: 0,
    created: 0
  };

  try {
    // Fetch inventory adjustments/stock from Zoho Inventory
    // Note: Zoho Inventory API has different endpoints for stock levels
    const inventoryUrl = `https://inventory.${dc}.zoho.com/api/v1/items?organization_id=${orgId}&include=stock_on_hand`;
    const response = await fetch(inventoryUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Zoho Inventory Sync] Found ${data.items?.length || 0} items with inventory data`);

    // Process each item's inventory
    for (const zohoItem of data.items || []) {
      try {
        // Skip items without stock information
        if (!zohoItem.stock_on_hand && !zohoItem.available_stock) {
          continue;
        }

        // Check if inventory record exists
        const { data: existingInventory, error: searchError } = await supabase
          .from('inventory')
          .select('product_id, warehouse_id')
          .eq('product_id', zohoItem.item_id);
          
        if (searchError) {
          throw new Error(`Database search error: ${searchError.message}`);
        }

        const inventoryData = {
          product_id: zohoItem.item_id,
          warehouse_id: 'main', // Default warehouse - could be enhanced with actual warehouse data
          available: parseInt(zohoItem.stock_on_hand || zohoItem.available_stock || '0'),
          reserved: 0, // Zoho doesn't provide reserved stock directly
          sku: zohoItem.sku,
          name: zohoItem.name,
          description: zohoItem.description || '',
          short_description: zohoItem.description?.substring(0, 255) || '',
          categories: zohoItem.category_name || '',
          last_synced_at: new Date().toISOString(),
          source_version: 'zoho-sync-v1'
        };

        if (existingInventory && existingInventory.length > 0) {
          // Update existing inventory record
          const { error: updateError } = await supabase
            .from('inventory')
            .update(inventoryData)
            .eq('product_id', zohoItem.item_id)
            .eq('warehouse_id', 'main');

          if (updateError) {
            throw new Error(`Update error: ${updateError.message}`);
          }

          results.updated++;
          console.log(`[Zoho Inventory Sync] Updated inventory: ${zohoItem.name} (${zohoItem.item_id}) - Stock: ${inventoryData.available}`);
        } else {
          // Create new inventory record
          const { error: insertError } = await supabase
            .from('inventory')
            .insert([inventoryData]);

          if (insertError) {
            throw new Error(`Insert error: ${insertError.message}`);
          }

          results.created++;
          console.log(`[Zoho Inventory Sync] Created inventory: ${zohoItem.name} (${zohoItem.item_id}) - Stock: ${inventoryData.available}`);
        }

        results.success++;

      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to sync inventory for ${zohoItem.item_id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMsg);
        console.error(`[Zoho Inventory Sync] ${errorMsg}`);
      }
    }

    console.log(`[Zoho Inventory Sync] Inventory sync completed: ${results.success} success (${results.updated} updated, ${results.created} created), ${results.failed} failed`);
    return results;

  } catch (error) {
    console.error('[Zoho Inventory Sync] Inventory sync failed:', error);
    throw error;
  }
}
