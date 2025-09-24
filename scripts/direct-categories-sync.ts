import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getValidAccessToken() {
  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function syncCategoriesFromZoho(accessToken: string) {
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
    const categoriesUrl = `https://www.zohoapis.com/inventory/v1/categories?organization_id=${orgId}`;
    const response = await fetch(categoriesUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Zoho Category Sync] Found ${data.categories?.length || 0} categories`);

    // Debug: Log the first category to see the structure
    if (data.categories && data.categories.length > 0) {
      console.log('[DEBUG] First category structure:', JSON.stringify(data.categories[0], null, 2));
    }

    if (!data.categories || data.categories.length === 0) {
      console.log('[Zoho Category Sync] No categories found in Zoho');
      return results;
    }

    // Process each category
    for (const zohoCategory of data.categories) {
      try {
        // Check if category already exists
        const { data: existingCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('zoho_category_id', zohoCategory.category_id)
          .single();

        // Skip ROOT category and invalid categories
        if (!zohoCategory.name || zohoCategory.name === 'ROOT' || zohoCategory.category_id === '-1') {
          continue;
        }

        const categoryData = {
          name: zohoCategory.name,
          slug: zohoCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: zohoCategory.description || null,
          zoho_category_id: zohoCategory.category_id,
          is_active: zohoCategory.visibility !== false,
          updated_at: new Date().toISOString()
        };

        if (existingCategory) {
          // Update existing category
          const { error: updateError } = await supabase
            .from('categories')
            .update(categoryData)
            .eq('zoho_category_id', zohoCategory.category_id);

          if (updateError) {
            throw new Error(`Update error: ${updateError.message}`);
          }

          results.updated++;
          console.log(`[Zoho Category Sync] Updated category: ${zohoCategory.category_name}`);
        } else {
          // Create new category
          const { error: insertError } = await supabase
            .from('categories')
            .insert([{
              ...categoryData,
              created_at: new Date().toISOString()
            }]);

          if (insertError) {
            throw new Error(`Insert error: ${insertError.message}`);
          }

          results.created++;
          console.log(`[Zoho Category Sync] Created category: ${zohoCategory.category_name}`);
        }

        results.success++;

      } catch (error) {
        results.failed++;
        const errorMessage = `Category ${zohoCategory.category_name}: ${error}`;
        results.errors.push(errorMessage);
        console.error(`[Zoho Category Sync] ${errorMessage}`);
      }
    }

    console.log(`[Zoho Category Sync] Completed: ${results.success} success, ${results.failed} failed`);
    return results;

  } catch (error) {
    console.error('[Zoho Category Sync] Error:', error);
    throw error;
  }
}

async function runDirectCategoriesSync() {
  console.log('🔄 Running Direct Categories Sync...\n');
  
  try {
    // Get Zoho access token
    console.log('🔑 Getting Zoho access token...');
    const accessToken = await getValidAccessToken();
    console.log('✅ Access token obtained');

    // Sync categories from Zoho
    console.log('📂 Syncing categories from Zoho...');
    const result = await syncCategoriesFromZoho(accessToken);

    console.log('\n✅ Categories sync completed successfully!');
    console.log('📊 Results:');
    console.log(`   Created: ${result.created}`);
    console.log(`   Updated: ${result.updated}`);
    console.log(`   Success: ${result.success}`);
    console.log(`   Failed: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`   - ${error}`));
    }

    // Check final category count
    const { count: finalCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📂 Total categories in database: ${finalCount || 0}`);
    
  } catch (error) {
    console.error('❌ Categories sync error:', error);
  }
}

runDirectCategoriesSync();
