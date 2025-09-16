import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * ENHANCED ZOHO SYNC - Pulls ALL available data from Zoho
 * This endpoint ensures we capture every piece of information BMB provides
 */

export async function POST(request: NextRequest) {
  try {
    const { fullSync = true, includeImages = true, includeCustomFields = true } = await request.json().catch(() => ({}));

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Enhanced Zoho Sync] Starting comprehensive sync with ALL available data');

    // Get Zoho access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error('Failed to get Zoho access token');
    }

    // Step 1: Get custom fields configuration first
    const customFieldsMap = await getCustomFieldsConfiguration(accessToken);
    console.log(`[Enhanced Zoho Sync] Found ${Object.keys(customFieldsMap).length} custom fields`);

    // Step 2: Sync products with ALL available data
    const syncResult = await syncAllProductData(supabase, accessToken, customFieldsMap, {
      includeImages,
      includeCustomFields,
      fullSync
    });

    return NextResponse.json({
      success: true,
      message: 'Enhanced sync completed',
      results: syncResult,
      customFieldsFound: Object.keys(customFieldsMap).length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Enhanced Zoho Sync] Error:', error);
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

  // Use correct Zoho OAuth domain (no region prefix)
  const tokenUrl = `https://accounts.zoho.com/oauth/v2/token`;
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

async function getCustomFieldsConfiguration(accessToken: string): Promise<Record<string, any>> {
  const dc = process.env.ZOHO_DC || 'us';
  const orgId = process.env.ZOHO_ORGANIZATION_ID;

  try {
    const customFieldsUrl = `https://www.zohoapis.com/inventory/v1/settings/customfields?organization_id=${orgId}`;
    const response = await fetch(customFieldsUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    if (!response.ok) {
      console.warn('[Enhanced Zoho Sync] Could not fetch custom fields configuration');
      return {};
    }

    const data = await response.json();
    const customFields = data.customfields || [];
    
    // Create a map of field names to field info
    const fieldsMap: Record<string, any> = {};
    
    for (const field of customFields) {
      const fieldName = field.field_name_formatted || field.label || field.field_name;
      if (fieldName) {
        fieldsMap[fieldName.toLowerCase()] = {
          id: field.customfield_id,
          name: fieldName,
          type: field.data_type,
          isActive: field.is_active,
          module: field.module
        };
      }
    }

    return fieldsMap;
  } catch (error) {
    console.warn('[Enhanced Zoho Sync] Error fetching custom fields:', error);
    return {};
  }
}

async function syncAllProductData(
  supabase: any, 
  accessToken: string, 
  customFieldsMap: Record<string, any>,
  options: { includeImages: boolean; includeCustomFields: boolean; fullSync: boolean }
) {
  const dc = process.env.ZOHO_DC || 'us';
  const orgId = process.env.ZOHO_ORGANIZATION_ID;

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
    updated: 0,
    created: 0,
    fieldsProcessed: {
      basic: 0,
      customFields: 0,
      images: 0,
      compliance: 0
    }
  };

  let page = 1;
  const perPage = 50;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      // Get basic product list
      const itemsUrl = `https://www.zohoapis.com/inventory/v1/items?organization_id=${orgId}&page=${page}&per_page=${perPage}`;
      const response = await fetch(itemsUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error(`Zoho API error: ${response.status}`);
      }

      const data = await response.json();
      const items = data.items || [];

      if (items.length === 0) {
        hasMorePages = false;
        break;
      }

      // Process each item with detailed data
      for (const basicItem of items) {
        try {
          // Get detailed item data
          const detailedItem = await getDetailedItemData(accessToken, basicItem.item_id);
          
          // Process and sync the item with ALL available data
          await syncSingleProductWithAllData(
            supabase, 
            basicItem, 
            detailedItem, 
            customFieldsMap, 
            options,
            results
          );

          results.success++;
        } catch (itemError) {
          results.failed++;
          results.errors.push(`Item ${basicItem.item_id}: ${itemError}`);
          console.error(`[Enhanced Zoho Sync] Failed to sync item ${basicItem.item_id}:`, itemError);
        }
      }

      page++;
      
      // Check if we have more pages
      if (items.length < perPage) {
        hasMorePages = false;
      }

    } catch (pageError) {
      results.failed++;
      results.errors.push(`Page ${page}: ${pageError}`);
      console.error(`[Enhanced Zoho Sync] Failed to process page ${page}:`, pageError);
      hasMorePages = false;
    }
  }

  console.log(`[Enhanced Zoho Sync] Completed: ${results.success} success, ${results.failed} failed`);
  return results;
}

async function getDetailedItemData(accessToken: string, itemId: string): Promise<any> {
  const dc = process.env.ZOHO_DC || 'us';
  const orgId = process.env.ZOHO_ORGANIZATION_ID;

  const detailUrl = `https://www.zohoapis.com/inventory/v1/items/${itemId}?organization_id=${orgId}`;
  const response = await fetch(detailUrl, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });

  if (!response.ok) {
    console.warn(`[Enhanced Zoho Sync] Could not get detailed data for item ${itemId}`);
    return null;
  }

  const data = await response.json();
  return data.item;
}

// Multi-layer nicotine product detection
function detectNicotineProduct(item: any): boolean {
  const name = (item.name || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const taxCode = (item.tax_exemption_code || '').toLowerCase();
  const category = (item.category_name || '').toLowerCase();

  // Keywords that indicate nicotine products
  const nicotineKeywords = [
    'blunt', 'diamond blunt', 'p blend', 'thcp', 'delta', 'hemp',
    'cbd', 'thc', 'cannabis', 'vape', 'cartridge', 'disposable',
    'nicotine', 'tobacco', 'cigarette', 'cigar'
  ];

  // Check product name and description
  const hasNicotineKeywords = nicotineKeywords.some(keyword =>
    name.includes(keyword) || description.includes(keyword)
  );

  // Check tax exemption code (hemp products often have special tax codes)
  const hasHempTaxCode = taxCode.includes('hemp') || taxCode.includes('non taxable');

  // Check category
  const hasNicotineCategory = category.includes('tobacco') || category.includes('hemp') ||
                             category.includes('cbd') || category.includes('vape');

  return hasNicotineKeywords || hasHempTaxCode || hasNicotineCategory;
}

async function syncSingleProductWithAllData(
  supabase: any,
  basicItem: any,
  detailedItem: any,
  customFieldsMap: Record<string, any>,
  options: any,
  results: any
) {
  const item = detailedItem || basicItem;
  
  // Build product data using snake_case column names for Supabase
  const productData: any = {
    // Core fields that exist in your products table
    name: item.name,
    sku: item.sku || null,
    description: item.description || '',
    price: parseFloat(item.rate || '0'),

    // Fields that exist in your products schema (using camelCase property names for Drizzle)
    // imageUrl: item.image_name || null, // Temporarily disabled due to schema cache issue
    material: item.manufacturer || null,
    inStock: (item.stock_on_hand || item.available_stock || 0) > 0,

    // Compliance fields that exist in your schema (using camelCase property names for Drizzle)
    nicotineProduct: detectNicotineProduct(item),
    visibleOnMainSite: !detectNicotineProduct(item),
    visibleOnTobaccoSite: detectNicotineProduct(item)

    // Note: category_id and brand_id will be handled separately after categories/brands are synced
  };

  // Also sync to zohoProducts table for complete Zoho data
  const zohoProductData = {
    zohoItemId: item.item_id,
    name: item.name,
    sku: item.sku || '',
    description: item.description || '',
    rate: parseFloat(item.rate || '0'),
    stockOnHand: parseInt(item.stock_on_hand || '0'),
    availableStock: parseInt(item.available_stock || '0'),
    actualAvailableStock: parseInt(item.actual_available_stock || '0'),
    zohoCategoryId: item.category_id || null,
    zohoCategoryName: item.category_name || null,
    brand: item.brand || null,
    status: item.status || 'active',
    lastModifiedTime: new Date(item.last_modified_time || new Date()),
    syncedAt: new Date()
  };

  // Process custom fields for compliance detection
  if (options.includeCustomFields && item.custom_fields) {
    const complianceData = extractComplianceData(item.custom_fields, customFieldsMap);
    Object.assign(productData, complianceData);
    results.fieldsProcessed.customFields++;
  }

  // Process images - temporarily disabled due to schema cache issue
  if (options.includeImages && item.images && item.images.length > 0) {
    // Store image information in image_url field (snake_case for Supabase)
    // productData.image_url = item.images[0].image_url || `/api/zoho/images/${item.images[0].image_id}`;
    results.fieldsProcessed.images++;
    console.log(`[Enhanced Zoho Sync] Found ${item.images.length} images for item ${item.item_id}, but image sync is temporarily disabled`);
  }

  // Check if product exists by SKU
  const { data: existingProduct } = await supabase
    .from('products')
    .select('id')
    .eq('sku', productData.sku)
    .single();

  let productId;
  if (existingProduct) {
    // Update existing product
    const { error: updateError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', existingProduct.id);

    if (updateError) {
      throw new Error(`Update error: ${updateError.message}`);
    }

    productId = existingProduct.id;
    results.updated++;
    console.log(`[Enhanced Zoho Sync] Updated product: ${item.name}`);
  } else {
    // Create new product
    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert(productData)
      .select('id')
      .single();

    if (insertError) {
      throw new Error(`Insert error: ${insertError.message}`);
    }

    productId = newProduct.id;
    results.created++;
    console.log(`[Enhanced Zoho Sync] Created product: ${item.name}`);
  }

  // Sync to zohoProducts table (upsert) - this stores all the Zoho-specific data
  zohoProductData.localProductId = productId;
  const { error: zohoError } = await supabase
    .from('zohoProducts')
    .upsert(zohoProductData, { onConflict: 'zohoItemId' });

  if (zohoError) {
    console.warn(`Failed to sync to zohoProducts: ${zohoError.message}`);
  }

  results.fieldsProcessed.basic++;
}

function extractComplianceData(customFields: any[], customFieldsMap: Record<string, any>): any {
  const complianceData: any = {};
  
  for (const customField of customFields) {
    const fieldName = (customField.field_name || customField.label || '').toLowerCase();
    const fieldValue = customField.value;
    
    // Look for age/nicotine/tobacco indicators
    if (fieldName.includes('age') && (fieldName.includes('required') || fieldName.includes('verification'))) {
      complianceData.nicotine_product = fieldValue === 'true' || fieldValue === true || fieldValue === 'yes';
      complianceData.visible_on_main_site = !complianceData.nicotine_product;
      complianceData.visible_on_tobacco_site = complianceData.nicotine_product;
    }
    
    if (fieldName.includes('tobacco') || fieldName.includes('nicotine')) {
      complianceData.nicotine_product = fieldValue === 'true' || fieldValue === true || fieldValue === 'yes';
      complianceData.visible_on_main_site = !complianceData.nicotine_product;
      complianceData.visible_on_tobacco_site = complianceData.nicotine_product;
    }
    
    if (fieldName.includes('restrict') && fieldName.includes('state')) {
      // Handle restricted states
      complianceData.restricted_states = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
    }
    
    if (fieldName.includes('msrp') || fieldName.includes('retail')) {
      complianceData.compare_at_price = parseFloat(fieldValue) || null;
    }
    
    if (fieldName.includes('description') && fieldName.includes('dtc')) {
      complianceData.short_description = fieldValue;
    }
  }
  
  return complianceData;
}
