import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const zohoClientId = process.env.ZOHO_CLIENT_ID!;
const zohoClientSecret = process.env.ZOHO_CLIENT_SECRET!;
const zohoRefreshToken = process.env.ZOHO_REFRESH_TOKEN!;
const zohoOrgId = process.env.ZOHO_ORGANIZATION_ID!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface ZohoEnhancedProduct {
  // Basic Info
  item_id: string;
  name: string;
  sku: string;
  
  // Shipping & Logistics (using existing Supabase columns)
  weight_g?: number; // weight in grams (existing column)
  dim_mm?: {
    length?: number;
    width?: number;
    height?: number;
  }; // dimensions in mm (existing JSONB column)

  // Business Intelligence (stored in specs JSONB)
  specs?: {
    sales_velocity?: number; // units sold per month
    profit_margin?: number; // percentage
    supplier_lead_time?: number; // days
    return_rate?: number; // percentage
    estimated_delivery_days?: number;
    warranty_period?: number; // months
    manufacturer_part_number?: string;
    country_of_origin?: string;
  };

  // Customer Experience (stored in attributes JSONB)
  attributes?: {
    package_type?: string; // 'fragile', 'hazardous', 'standard'
    shipping_restrictions?: string[]; // ['CA', 'NY'] for state restrictions
    frequently_bought_with?: string[]; // Bundle opportunities
    restock_date?: string;
  };

  // Pricing (using existing column)
  compare_at_price?: number; // wholesale/MSRP price (existing column)
}

// Get Zoho access token
async function getZohoAccessToken(): Promise<string> {
  const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
  const params = new URLSearchParams({
    refresh_token: zohoRefreshToken,
    client_id: zohoClientId,
    client_secret: zohoClientSecret,
    grant_type: 'refresh_token'
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });

  if (!response.ok) {
    throw new Error(`Failed to get Zoho access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Fetch enhanced product data from Zoho
async function fetchZohoEnhancedData(accessToken: string): Promise<ZohoEnhancedProduct[]> {
  const products: ZohoEnhancedProduct[] = [];
  let page = 1;
  const perPage = 200;
  let hasMore = true;

  console.log('📥 Fetching enhanced product data from Zoho Inventory...');

  while (hasMore) {
    const url = `https://www.zohoapis.com/inventory/v1/items?organization_id=${zohoOrgId}&page=${page}&per_page=${perPage}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const items = data.items || [];

    for (const item of items) {
      // Convert weight to grams
      const weightValue = item.weight || item.custom_fields?.find((f: any) => f.label === 'Weight')?.value;
      const weightUnit = item.weight_unit || 'lbs';
      let weightInGrams: number | undefined;

      if (weightValue) {
        switch (weightUnit.toLowerCase()) {
          case 'lbs':
          case 'lb':
            weightInGrams = Math.round(weightValue * 453.592);
            break;
          case 'oz':
            weightInGrams = Math.round(weightValue * 28.3495);
            break;
          case 'kg':
            weightInGrams = Math.round(weightValue * 1000);
            break;
          case 'g':
          case 'grams':
            weightInGrams = Math.round(weightValue);
            break;
        }
      }

      // Convert dimensions to millimeters
      const length = item.length || item.custom_fields?.find((f: any) => f.label === 'Length')?.value;
      const width = item.width || item.custom_fields?.find((f: any) => f.label === 'Width')?.value;
      const height = item.height || item.custom_fields?.find((f: any) => f.label === 'Height')?.value;
      const dimensionUnit = item.dimension_unit || 'inches';

      let dimInMm: { length?: number; width?: number; height?: number } | undefined;

      if (length || width || height) {
        const conversionFactor = dimensionUnit.toLowerCase() === 'inches' ? 25.4 :
                                dimensionUnit.toLowerCase() === 'cm' ? 10 : 1;

        dimInMm = {
          length: length ? Math.round(length * conversionFactor) : undefined,
          width: width ? Math.round(width * conversionFactor) : undefined,
          height: height ? Math.round(height * conversionFactor) : undefined
        };
      }

      // Extract enhanced product information
      const enhancedProduct: ZohoEnhancedProduct = {
        item_id: item.item_id,
        name: item.name,
        sku: item.sku,

        // Shipping & Logistics (using existing Supabase columns)
        weight_g: weightInGrams,
        dim_mm: dimInMm,

        // Business Intelligence (stored in specs JSONB)
        specs: {
          sales_velocity: item.sales_velocity || calculateSalesVelocity(item),
          profit_margin: calculateProfitMargin(item),
          supplier_lead_time: item.lead_time_days || item.custom_fields?.find((f: any) => f.label === 'Lead Time')?.value,
          estimated_delivery_days: calculateEstimatedDelivery(item),
          warranty_period: item.warranty_period || item.custom_fields?.find((f: any) => f.label === 'Warranty')?.value,
          manufacturer_part_number: item.manufacturer_part_number || item.custom_fields?.find((f: any) => f.label === 'MPN')?.value,
          country_of_origin: item.country_of_origin || item.custom_fields?.find((f: any) => f.label === 'Country of Origin')?.value,
        },

        // Customer Experience (stored in attributes JSONB)
        attributes: {
          package_type: item.package_type || item.custom_fields?.find((f: any) => f.label === 'Package Type')?.value,
          restock_date: item.reorder_level ? calculateRestockDate(item) : undefined
        },

        // Pricing (using existing column)
        compare_at_price: item.wholesale_rate
      };

      // Only include products with meaningful enhanced data
      if (hasEnhancedData(enhancedProduct)) {
        products.push(enhancedProduct);
      }
    }

    console.log(`✅ Processed page ${page} - ${items.length} items`);
    
    hasMore = data.page_context?.has_more_page || false;
    page++;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return products;
}

// Helper functions
function calculateSalesVelocity(item: any): number | undefined {
  // Calculate based on sales history if available
  if (item.sales_history && item.sales_history.length > 0) {
    const totalSold = item.sales_history.reduce((sum: number, sale: any) => sum + (sale.quantity || 0), 0);
    const monthsOfData = item.sales_history.length;
    return monthsOfData > 0 ? totalSold / monthsOfData : undefined;
  }
  return undefined;
}

function calculateProfitMargin(item: any): number | undefined {
  if (item.rate && item.purchase_rate) {
    return ((item.rate - item.purchase_rate) / item.rate) * 100;
  }
  return undefined;
}

function calculateEstimatedDelivery(item: any): number | undefined {
  // Base delivery time + processing time + lead time if out of stock
  let deliveryDays = 3; // Base shipping time

  if (item.available_stock <= 0 && item.lead_time_days) {
    deliveryDays += item.lead_time_days; // Add lead time if out of stock
  }

  // Add processing time based on item complexity
  if (item.item_type === 'inventory_item') {
    deliveryDays += 1; // Standard processing
  }

  return deliveryDays;
}

function calculateRestockDate(item: any): string | undefined {
  if (item.available_stock <= item.reorder_level && item.lead_time_days) {
    const restockDate = new Date();
    restockDate.setDate(restockDate.getDate() + item.lead_time_days);
    return restockDate.toISOString().split('T')[0];
  }
  return undefined;
}

function hasEnhancedData(product: ZohoEnhancedProduct): boolean {
  return !!(
    product.weight_g ||
    product.dim_mm?.length ||
    product.dim_mm?.width ||
    product.dim_mm?.height ||
    product.specs?.sales_velocity ||
    product.specs?.profit_margin ||
    product.specs?.supplier_lead_time ||
    product.specs?.manufacturer_part_number ||
    product.specs?.country_of_origin ||
    product.specs?.warranty_period ||
    product.attributes?.package_type ||
    product.attributes?.restock_date ||
    product.compare_at_price
  );
}

// Sync enhanced data to Supabase
async function syncEnhancedDataToSupabase(products: ZohoEnhancedProduct[], dryRun: boolean = true) {
  console.log(`\n🔄 ${dryRun ? 'ANALYZING' : 'SYNCING'} ENHANCED DATA TO SUPABASE...`);
  
  let updated = 0;
  let failed = 0;
  let noMatch = 0;

  for (const product of products) {
    try {
      // Find matching Supabase product by SKU
      const { data: supabaseProducts, error: findError } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('sku', product.sku)
        .limit(1);

      if (findError) {
        console.error(`❌ Error finding product ${product.sku}:`, findError.message);
        failed++;
        continue;
      }

      if (!supabaseProducts || supabaseProducts.length === 0) {
        noMatch++;
        continue;
      }

      const supabaseProduct = supabaseProducts[0];

      // Prepare update data using existing Supabase columns
      const updateData: any = {
        // Shipping data (existing columns)
        weight_g: product.weight_g,
        dim_mm: product.dim_mm,

        // Business intelligence (stored in specs JSONB)
        specs: product.specs,

        // Customer experience (stored in attributes JSONB)
        attributes: product.attributes,

        // Pricing (existing column)
        compare_at_price: product.compare_at_price,

        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      if (Object.keys(updateData).length <= 1) { // Only updated_at
        continue; // Skip if no meaningful data to update
      }

      console.log(`${dryRun ? '📋' : '✅'} ${supabaseProduct.name} (${product.sku})`);
      if (dryRun) {
        console.log(`   Would update: ${Object.keys(updateData).filter(k => k !== 'updated_at').join(', ')}`);
      }

      if (!dryRun) {
        const { error: updateError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', supabaseProduct.id);

        if (updateError) {
          console.error(`❌ Failed to update ${product.sku}:`, updateError.message);
          failed++;
        } else {
          updated++;
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));

    } catch (error) {
      console.error(`❌ Error processing ${product.sku}:`, error);
      failed++;
    }
  }

  console.log(`\n📊 SYNC RESULTS:`);
  console.log(`   ✅ Products with enhanced data: ${products.length}`);
  console.log(`   🔄 ${dryRun ? 'Would update' : 'Updated'}: ${dryRun ? products.length - noMatch : updated}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   ⚠️  No match in Supabase: ${noMatch}`);
}

async function main() {
  const dryRun = !process.argv.includes('--apply');
  
  console.log('🚀 ZOHO ENHANCED DATA SYNC');
  console.log('=' .repeat(50));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}`);
  
  try {
    // Get access token
    const accessToken = await getZohoAccessToken();
    console.log('✅ Zoho access token obtained');

    // Fetch enhanced data
    const enhancedProducts = await fetchZohoEnhancedData(accessToken);
    console.log(`✅ Found ${enhancedProducts.length} products with enhanced data`);

    // Show sample of enhanced data
    console.log('\n📋 SAMPLE ENHANCED DATA:');
    enhancedProducts.slice(0, 3).forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name} (${product.sku})`);
      if (product.dimensions?.length) console.log(`   📏 Dimensions: ${product.dimensions.length}×${product.dimensions.width}×${product.dimensions.height} ${product.dimensions.unit}`);
      if (product.weight?.value) console.log(`   ⚖️  Weight: ${product.weight.value} ${product.weight.unit}`);
      if (product.sales_velocity) console.log(`   📈 Sales Velocity: ${product.sales_velocity} units/month`);
      if (product.profit_margin) console.log(`   💰 Profit Margin: ${product.profit_margin.toFixed(1)}%`);
      if (product.supplier_lead_time) console.log(`   🚚 Lead Time: ${product.supplier_lead_time} days`);
      if (product.warranty_period) console.log(`   🛡️  Warranty: ${product.warranty_period} months`);
    });

    // Sync to Supabase
    await syncEnhancedDataToSupabase(enhancedProducts, dryRun);

    console.log('\n✅ Enhanced data sync complete!');
    if (dryRun) {
      console.log('\n💡 To apply these updates, run with --apply flag');
    }

  } catch (error) {
    console.error('❌ Enhanced data sync failed:', error);
    process.exit(1);
  }
}

main();
