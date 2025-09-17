import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    console.log('[Test Image Sync] Starting single product image sync test');
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const orgId = process.env.ZOHO_ORGANIZATION_ID || process.env.ZOHO_ORG_ID;

    // Get access token
    const { data: tokenRow } = await supabase
      .from('zoho_tokens')
      .select('*')
      .eq('org_id', orgId)
      .single();

    if (!tokenRow) {
      return NextResponse.json({ error: 'No Zoho token found' }, { status: 401 });
    }

    const accessToken = tokenRow.access_token;

    // Get just the first item from Zoho
    const itemsUrl = `https://www.zohoapis.com/inventory/v1/items?organization_id=${orgId}&page=1&per_page=1`;
    const response = await fetch(itemsUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Zoho API error: ${response.status}`,
        details: await response.text()
      }, { status: response.status });
    }

    const data = await response.json();
    const items = data.items || [];

    if (items.length === 0) {
      return NextResponse.json({ error: 'No items found in Zoho' }, { status: 404 });
    }

    const item = items[0];
    console.log('[Test Image Sync] Testing with item:', item.name, 'ID:', item.item_id);

    // Get detailed item data
    const detailUrl = `https://www.zohoapis.com/inventory/v1/items/${item.item_id}?organization_id=${orgId}`;
    const detailResponse = await fetch(detailUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    if (!detailResponse.ok) {
      return NextResponse.json({ 
        error: `Failed to get item details: ${detailResponse.status}` 
      }, { status: detailResponse.status });
    }

    const detailData = await detailResponse.json();
    const detailedItem = detailData.item;

    console.log('[Test Image Sync] Item images:', detailedItem.images);

    // Prepare product data with image_urls
    const productData: any = {
      zoho_item_id: item.item_id,
      name: item.name,
      sku: item.sku,
      price: parseFloat(item.rate) || 0,
      description: detailedItem.description || '',
      updated_at: new Date().toISOString()
    };

    // Process images using correct field name
    if (detailedItem.images && detailedItem.images.length > 0) {
      productData.image_urls = detailedItem.images[0].image_url || `/api/zoho/images/${detailedItem.images[0].image_id}`;
      console.log('[Test Image Sync] Setting image_urls to:', productData.image_urls);
    } else {
      console.log('[Test Image Sync] No images found for this item');
    }

    // Check if product exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('zoho_item_id', item.item_id)
      .single();

    let result;
    if (existingProduct) {
      // Update existing product
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', existingProduct.id)
        .select('id, name, image_urls')
        .single();

      if (error) {
        console.error('[Test Image Sync] Update error:', error);
        return NextResponse.json({ 
          error: `Update error: ${error.message}`,
          details: error
        }, { status: 500 });
      }
      result = { action: 'updated', product: data };
    } else {
      // Insert new product
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select('id, name, image_urls')
        .single();

      if (error) {
        console.error('[Test Image Sync] Insert error:', error);
        return NextResponse.json({ 
          error: `Insert error: ${error.message}`,
          details: error
        }, { status: 500 });
      }
      result = { action: 'inserted', product: data };
    }

    return NextResponse.json({
      success: true,
      result,
      zohoData: {
        item_id: item.item_id,
        name: item.name,
        images: detailedItem.images || []
      }
    });

  } catch (error) {
    console.error('[Test Image Sync] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
