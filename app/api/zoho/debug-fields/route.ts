import { NextRequest, NextResponse } from 'next/server';

/**
 * DEBUG ENDPOINT: Inspect what fields Zoho actually returns
 * This will help us understand what data is available vs what we're currently using
 */

export async function GET(request: NextRequest) {
  try {
    // Get Zoho access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      throw new Error('Failed to get Zoho access token');
    }

    const dc = process.env.ZOHO_DC || 'us';
    const orgId = process.env.ZOHO_ORGANIZATION_ID;

    // 1. Fetch custom fields configuration
    const customFieldsUrl = `https://www.zohoapis.com/inventory/v1/settings/customfields?organization_id=${orgId}`;
    const customFieldsResponse = await fetch(customFieldsUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    let customFields = [];
    if (customFieldsResponse.ok) {
      const customFieldsData = await customFieldsResponse.json();
      customFields = customFieldsData.customfields || [];
    }

    // 2. Fetch a sample item with basic fields
    const itemsUrl = `https://www.zohoapis.com/inventory/v1/items?organization_id=${orgId}&per_page=1`;
    const response = await fetch(itemsUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status}`);
    }

    const data = await response.json();
    const firstItem = data.items?.[0];

    if (!firstItem) {
      return NextResponse.json({
        error: 'No items found in Zoho',
        data: data
      });
    }

    // 3. Get detailed item info with ALL fields
    const detailUrl = `https://www.zohoapis.com/inventory/v1/items/${firstItem.item_id}?organization_id=${orgId}`;
    const detailResponse = await fetch(detailUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    let detailedItem = null;
    if (detailResponse.ok) {
      const detailData = await detailResponse.json();
      detailedItem = detailData.item;
    }

    // 4. Get categories for context
    const categoriesUrl = `https://www.zohoapis.com/inventory/v1/categories?organization_id=${orgId}&per_page=200`;
    const categoriesResponse = await fetch(categoriesUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    let categories = [];
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      categories = categoriesData.categories || [];
    }

    // 5. Comprehensive analysis
    const analysis = analyzeAllAvailableData(firstItem, detailedItem, customFields, categories);

    return NextResponse.json({
      success: true,
      zohoDataInventory: {
        customFields: {
          total: Array.isArray(customFields) ? customFields.length : 0,
          fields: Array.isArray(customFields) ? customFields.map((field: any) => ({
            id: field.customfield_id,
            name: field.field_name_formatted,
            label: field.label,
            type: field.data_type,
            module: field.module,
            isActive: field.is_active
          })) : []
        },
        sampleProduct: {
          basic: firstItem,
          detailed: detailedItem,
          availableFields: {
            basic: Object.keys(firstItem || {}),
            detailed: detailedItem ? Object.keys(detailedItem) : [],
            customFieldsInProduct: extractCustomFieldsFromProduct(detailedItem || firstItem)
          }
        },
        categories: {
          total: categories.length,
          sample: categories.slice(0, 5).map((cat: any) => ({
            id: cat.category_id,
            name: cat.category_name,
            parentId: cat.parent_category_id
          }))
        },
        fieldAnalysis: analysis,
        syncRecommendations: generateSyncRecommendations(analysis)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Zoho Debug] Error:', error);
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

function extractCustomFieldsFromProduct(item: any): any[] {
  if (!item) return [];

  const customFields = [];

  // Look for custom_fields array
  if (item.custom_fields && Array.isArray(item.custom_fields)) {
    customFields.push(...item.custom_fields);
  }

  // Look for cf_ prefixed fields
  for (const [key, value] of Object.entries(item)) {
    if (key.startsWith('cf_')) {
      customFields.push({ field_name: key, value });
    }
  }

  return customFields;
}

function analyzeAllAvailableData(basicItem: any, detailedItem: any, customFields: any[], categories: any[]) {
  const currentlyUsedFields = [
    'item_id', 'name', 'sku', 'description', 'rate',
    'category_id', 'stock_on_hand', 'available_stock'
  ];

  const allProductFields = new Set([
    ...Object.keys(basicItem || {}),
    ...Object.keys(detailedItem || {})
  ]);

  const analysis = {
    totalAvailableFields: allProductFields.size,
    currentlyUsedFields: currentlyUsedFields.length,
    unusedFields: Array.from(allProductFields).filter(field => !currentlyUsedFields.includes(field)),

    fieldCategories: {
      images: [] as string[],
      customFields: [] as string[],
      compliance: [] as string[],
      inventory: [] as string[],
      pricing: [] as string[],
      metadata: [] as string[],
      relationships: [] as string[]
    },

    customFieldsAnalysis: {
      totalConfigured: Array.isArray(customFields) ? customFields.length : 0,
      activeFields: Array.isArray(customFields) ? customFields.filter((f: any) => f.is_active).length : 0,
      fieldsByType: {} as Record<string, number>,
      potentialNicotineFields: [] as any[]
    },

    categoriesAnalysis: {
      totalCategories: categories.length,
      categoryNames: categories.map((c: any) => c.category_name),
      potentialTobaccoCategories: categories.filter((c: any) =>
        c.category_name?.toLowerCase().includes('tobacco') ||
        c.category_name?.toLowerCase().includes('nicotine') ||
        c.category_name?.toLowerCase().includes('vape')
      )
    }
  };

  // Categorize all available fields
  for (const field of allProductFields) {
    const fieldLower = field.toLowerCase();

    if (fieldLower.includes('image') || fieldLower.includes('photo') || fieldLower.includes('picture')) {
      analysis.fieldCategories.images.push(field);
    } else if (field.startsWith('cf_') || fieldLower.includes('custom')) {
      analysis.fieldCategories.customFields.push(field);
    } else if (fieldLower.includes('age') || fieldLower.includes('restrict') || fieldLower.includes('compliance') || fieldLower.includes('tobacco') || fieldLower.includes('nicotine')) {
      analysis.fieldCategories.compliance.push(field);
    } else if (fieldLower.includes('stock') || fieldLower.includes('inventory') || fieldLower.includes('quantity')) {
      analysis.fieldCategories.inventory.push(field);
    } else if (fieldLower.includes('price') || fieldLower.includes('rate') || fieldLower.includes('cost') || fieldLower.includes('msrp')) {
      analysis.fieldCategories.pricing.push(field);
    } else if (fieldLower.includes('category') || fieldLower.includes('brand') || fieldLower.includes('tag')) {
      analysis.fieldCategories.relationships.push(field);
    } else {
      analysis.fieldCategories.metadata.push(field);
    }
  }

  // Analyze custom fields for potential nicotine indicators
  if (Array.isArray(customFields)) {
    for (const customField of customFields) {
      const fieldName = customField.field_name_formatted?.toLowerCase() || customField.label?.toLowerCase() || '';

      if (fieldName.includes('age') || fieldName.includes('tobacco') || fieldName.includes('nicotine') ||
          fieldName.includes('restrict') || fieldName.includes('compliance') || fieldName.includes('adult')) {
        analysis.customFieldsAnalysis.potentialNicotineFields.push(customField);
      }

      // Count by data type
      const dataType = customField.data_type || 'unknown';
      analysis.customFieldsAnalysis.fieldsByType[dataType] = (analysis.customFieldsAnalysis.fieldsByType[dataType] || 0) + 1;
    }
  }

  return analysis;
}

function generateSyncRecommendations(analysis: any) {
  const recommendations = [];

  // High priority recommendations
  if (analysis.fieldCategories.images.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      type: 'IMAGES',
      message: `${analysis.fieldCategories.images.length} image fields available - critical for product display`,
      fields: analysis.fieldCategories.images,
      action: 'Add image sync to product sync process'
    });
  }

  if (analysis.customFieldsAnalysis.potentialNicotineFields.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      type: 'COMPLIANCE',
      message: `${analysis.customFieldsAnalysis.potentialNicotineFields.length} potential nicotine/compliance fields found`,
      fields: analysis.customFieldsAnalysis.potentialNicotineFields.map((f: any) => f.field_name_formatted || f.label),
      action: 'Map these fields to nicotine_product and compliance columns'
    });
  }

  // Medium priority recommendations
  if (analysis.fieldCategories.pricing.length > 1) {
    recommendations.push({
      priority: 'MEDIUM',
      type: 'PRICING',
      message: `${analysis.fieldCategories.pricing.length} pricing fields available - may include MSRP, wholesale prices`,
      fields: analysis.fieldCategories.pricing,
      action: 'Consider syncing additional pricing data for B2C vs B2B'
    });
  }

  if (analysis.categoriesAnalysis.potentialTobaccoCategories.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      type: 'CATEGORIES',
      message: `${analysis.categoriesAnalysis.potentialTobaccoCategories.length} tobacco/nicotine categories found`,
      fields: analysis.categoriesAnalysis.potentialTobaccoCategories.map((c: any) => c.category_name),
      action: 'Use category-based classification for nicotine products'
    });
  }

  // Low priority recommendations
  if (analysis.fieldCategories.metadata.length > 5) {
    recommendations.push({
      priority: 'LOW',
      type: 'METADATA',
      message: `${analysis.fieldCategories.metadata.length} additional metadata fields available`,
      fields: analysis.fieldCategories.metadata.slice(0, 10), // Show first 10
      action: 'Review for SEO, specifications, or product enhancement data'
    });
  }

  return recommendations;
}
