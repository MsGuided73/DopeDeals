import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { fullSync = false } = await request.json().catch(() => ({}));

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Zoho Category Sync] Starting category sync');

    // Get Zoho access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error('Failed to get Zoho access token');
    }

    // Sync categories from Zoho
    const result = await syncCategoriesFromZoho(supabase, accessToken);

    return NextResponse.json({
      success: true,
      syncType: 'categories',
      fullSync,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Zoho Category Sync] Error:', error);
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

async function syncCategoriesFromZoho(supabase: any, accessToken: string) {
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
    // Fetch categories from Zoho Inventory
    const categoriesUrl = `https://inventory.${dc}.zoho.com/api/v1/categories?organization_id=${orgId}`;
    const response = await fetch(categoriesUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Zoho Category Sync] Found ${data.categories?.length || 0} categories`);

    // Process each category
    for (const zohoCategory of data.categories || []) {
      try {
        // Check if category exists
        const { data: existingCategories, error: searchError } = await supabase
          .from('categories')
          .select('id')
          .eq('id', zohoCategory.category_id);
          
        if (searchError) {
          throw new Error(`Database search error: ${searchError.message}`);
        }

        const categoryData = {
          id: zohoCategory.category_id,
          name: zohoCategory.category_name,
          description: zohoCategory.description || '',
          parent_id: zohoCategory.parent_category_id || null,
          updated_at: new Date().toISOString()
        };

        if (existingCategories && existingCategories.length > 0) {
          // Update existing category
          const { error: updateError } = await supabase
            .from('categories')
            .update(categoryData)
            .eq('id', zohoCategory.category_id);

          if (updateError) {
            throw new Error(`Update error: ${updateError.message}`);
          }

          results.updated++;
          console.log(`[Zoho Category Sync] Updated category: ${zohoCategory.category_name} (${zohoCategory.category_id})`);
        } else {
          // Create new category
          categoryData.created_at = new Date().toISOString();
          
          const { error: insertError } = await supabase
            .from('categories')
            .insert([categoryData]);

          if (insertError) {
            throw new Error(`Insert error: ${insertError.message}`);
          }

          results.created++;
          console.log(`[Zoho Category Sync] Created category: ${zohoCategory.category_name} (${zohoCategory.category_id})`);
        }

        results.success++;

      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to sync category ${zohoCategory.category_id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMsg);
        console.error(`[Zoho Category Sync] ${errorMsg}`);
      }
    }

    console.log(`[Zoho Category Sync] Category sync completed: ${results.success} success (${results.updated} updated, ${results.created} created), ${results.failed} failed`);
    return results;

  } catch (error) {
    console.error('[Zoho Category Sync] Category sync failed:', error);
    throw error;
  }
}
