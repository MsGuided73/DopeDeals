import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  return NextResponse.json({
    message: 'Zoho sync endpoint ready',
    availableMethods: ['POST'],
    parameters: {
      syncType: 'products (default)',
      fullSync: 'false (default)'
    }
  });
}

export async function POST(request: Request) {
  try {
    let syncType = 'products';
    let fullSync = true; // Default to full sync for now

    try {
      const body = await request.json();
      syncType = body.syncType || 'products';
      fullSync = body.fullSync !== undefined ? body.fullSync : true;
    } catch (jsonError) {
      console.log('[Zoho Sync] Using default parameters due to JSON parse error');
    }
    
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get Zoho credentials
    const orgId = process.env.ZOHO_ORGANIZATION_ID!;
    const clientId = process.env.ZOHO_CLIENT_ID!;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET!;
    const dc = process.env.ZOHO_DC || 'us';
    
    // Get refresh token from database
    const { data: tokenRow, error: tokenError } = await supabase
      .from('zoho_tokens')
      .select('*')
      .eq('org_id', orgId)
      .single();

    if (tokenError || !tokenRow) {
      return NextResponse.json({ 
        success: false, 
        error: 'Zoho tokens not found',
        detail: tokenError?.message 
      }, { status: 404 });
    }

    // Get fresh access token
    const accessToken = await getValidAccessToken(tokenRow.refresh_token, clientId, clientSecret);
    
    if (syncType === 'products') {
      const result = await syncProductsFromZoho(accessToken, orgId, dc, supabase, fullSync);
      return NextResponse.json({
        success: true,
        syncType: 'products',
        fullSync,
        result,
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Unsupported sync type',
      supportedTypes: ['products']
    }, { status: 400 });
    
  } catch (error) {
    console.error('[Zoho Sync] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}

async function getValidAccessToken(refreshToken: string, clientId: string, clientSecret: string): Promise<string> {
  // Use the correct Zoho OAuth domain (no region prefix)
  const tokenUrl = `https://accounts.zoho.com/oauth/v2/token`;
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh Zoho access token: ${await res.text()}`);
  }

  const json = await res.json();
  return json.access_token as string;
}

async function syncProductsFromZoho(accessToken: string, orgId: string, dc: string, supabase: any, fullSync: boolean) {
  const results = { success: 0, failed: 0, errors: [] as string[], updated: 0, created: 0 };
  let page = 1;
  const perPage = 50;
  
  console.log(`[Zoho Sync] Starting ${fullSync ? 'full' : 'incremental'} product sync`);
  
  try {
    do {
      // Use the correct Zoho API domain
      const itemsUrl = `https://www.zohoapis.com/inventory/v1/items?organization_id=${orgId}&page=${page}&per_page=${perPage}`;
      const response = await fetch(itemsUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
      });
      
      if (!response.ok) {
        throw new Error(`Zoho API error: ${response.status} ${await response.text()}`);
      }
      
      const data = await response.json();
      
      for (const zohoItem of data.items || []) {
        try {
          // Check if product exists by zoho_item_id (primary) or name similarity (fallback)
          const { data: existingProducts, error: searchError } = await supabase
            .from('products')
            .select('id, zoho_item_id, name, sku')
            .or(`zoho_item_id.eq.${zohoItem.item_id},name.ilike.%${zohoItem.name.replace(/'/g, "''")}%`);
            
          if (searchError) {
            throw new Error(`Database search error: ${searchError.message}`);
          }
          
          const productData = {
            name: zohoItem.name,
            sku: zohoItem.sku || null, // BMB manages SKUs, we just store them
            description: zohoItem.description || '',
            price: parseFloat(zohoItem.rate || '0'),
            zoho_item_id: zohoItem.item_id, // Primary key for matching
            category_id: zohoItem.category_id || null,
            stock_quantity: zohoItem.stock_on_hand || zohoItem.available_stock || 0,
            is_active: (zohoItem.stock_on_hand || zohoItem.available_stock || 0) > 0, // Available if in stock
            updated_at: new Date().toISOString()
          };
          
          if (existingProducts && existingProducts.length > 0) {
            // Update existing product
            const existingProduct = existingProducts[0];
            const { error: updateError } = await supabase
              .from('products')
              .update(productData)
              .eq('id', existingProduct.id);
              
            if (updateError) {
              throw new Error(`Update error: ${updateError.message}`);
            }
            
            results.updated++;
            console.log(`[Zoho Sync] Updated product: ${zohoItem.name} (${zohoItem.sku})`);
          } else {
            // Create new product
            const { error: insertError } = await supabase
              .from('products')
              .insert(productData);
              
            if (insertError) {
              throw new Error(`Insert error: ${insertError.message}`);
            }
            
            results.created++;
            console.log(`[Zoho Sync] Created product: ${zohoItem.name} (${zohoItem.sku})`);
          }
          
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Product ${zohoItem.item_id} (${zohoItem.sku}): ${error}`);
          console.error(`[Zoho Sync] Failed to sync product ${zohoItem.item_id}:`, error);
        }
      }
      
      // Check if there are more pages
      if (!data.page_context?.has_more_page) break;
      page++;

      // Limit to first 3 pages for testing
      if (page > 3) break;

    } while (page <= 100); // Safety limit
    
    console.log(`[Zoho Sync] Product sync completed: ${results.success} success (${results.updated} updated, ${results.created} created), ${results.failed} failed`);
    return results;
    
  } catch (error) {
    console.error('[Zoho Sync] Product sync failed:', error);
    throw error;
  }
}
