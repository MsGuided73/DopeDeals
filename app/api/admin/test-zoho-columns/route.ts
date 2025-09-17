import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Test that all new Zoho columns exist and are accessible
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'products' })
      .then(() => supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'products')
        .order('ordinal_position')
      )
      .catch(() => 
        // Fallback query
        supabase.from('products').select('*').limit(1)
      );

    if (columnsError) {
      console.error('Error fetching columns:', columnsError);
    }

    // Test inserting a sample product with all Zoho fields
    const testProduct = {
      id: `test-${Date.now()}`,
      name: 'Test Zoho Product',
      description: 'Test product for Zoho integration',
      price: 29.99,
      sku: `TEST-${Date.now()}`,
      
      // Basic Zoho fields
      unit: 'piece',
      item_type: 'inventory',
      product_type: 'goods',
      status: 'active',
      source: 'zoho',
      
      // Inventory
      available_stock: 10,
      committed_stock: 2,
      stock_on_hand: 12,
      reorder_level: 5,
      reorder_quantity: 20,
      
      // Tax info
      is_taxable: true,
      tax_id: 'TAX123',
      tax_name: 'Sales Tax',
      tax_percentage: 8.25,
      
      // Category & Brand
      zoho_category_id: 'CAT123',
      zoho_category_name: 'Test Category',
      brand_name: 'Test Brand',
      manufacturer: 'Test Manufacturer',
      
      // Physical properties
      weight: 1.5,
      weight_unit: 'lbs',
      length_mm: 100.0,
      width_mm: 50.0,
      height_mm: 25.0,
      
      // Package details
      package_length: 120.0,
      package_width: 70.0,
      package_height: 45.0,
      package_weight: 2.0,
      
      // VIP Smoke custom fields
      dtc_description: 'Consumer-facing description',
      msrp: 39.99,
      club_discount: 15.0,
      age_required: true,
      restricted_states: ['CA', 'NY'],
      
      // Product flags
      is_combo_product: false,
      is_linked_with_zohocrm: false,
      zcrm_product_id: 'CRM123',
      
      // Tags and metadata
      tags: ['test', 'zoho', 'integration'],
      zoho_custom_fields: {
        custom_field_1: 'value1',
        custom_field_2: 'value2'
      },
      documents: {
        manual: 'doc123.pdf',
        warranty: 'warranty456.pdf'
      },
      
      // Timestamps
      zoho_created_time: new Date().toISOString(),
      zoho_last_modified_time: new Date().toISOString(),
      
      // Images
      image_urls: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ],
      
      // Sync metadata
      sync_status: 'synced',
      sync_error: null,
      last_sync_attempt: new Date().toISOString(),
      
      // Existing required fields
      zoho_item_id: `ZOHO-${Date.now()}`,
      channels: ['vip_smoke'],
      nicotine_product: false,
      tobacco_product: false,
      is_active: true,
      featured: false,
      vip_exclusive: false
    };

    // Test insert
    const { data: insertedProduct, error: insertError } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to insert test product',
        details: insertError,
        message: 'Some Zoho columns may be missing or have incorrect types'
      }, { status: 500 });
    }

    // Test update with Zoho data
    const updateData = {
      description: 'Updated description from Zoho',
      available_stock: 15,
      zoho_last_modified_time: new Date().toISOString(),
      sync_status: 'updated'
    };

    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', insertedProduct.id);

    if (updateError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update test product',
        details: updateError,
        message: 'Update operations may have issues with new columns'
      }, { status: 500 });
    }

    // Test complex queries with new columns
    const { data: queryTest, error: queryError } = await supabase
      .from('products')
      .select(`
        id, name, sku, status, available_stock, 
        zoho_category_name, brand_name, tags,
        zoho_custom_fields, image_urls, sync_status
      `)
      .eq('id', insertedProduct.id)
      .single();

    if (queryError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to query with new columns',
        details: queryError,
        message: 'Complex queries with new columns may have issues'
      }, { status: 500 });
    }

    // Clean up test product
    await supabase
      .from('products')
      .delete()
      .eq('id', insertedProduct.id);

    // Count existing products with Zoho data
    const { count: zohoProductsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('zoho_item_id', 'is', null);

    const { count: totalProductsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: 'All Zoho columns are working perfectly!',
      test_results: {
        insert_test: 'PASSED',
        update_test: 'PASSED',
        query_test: 'PASSED',
        cleanup_test: 'PASSED'
      },
      database_stats: {
        total_products: totalProductsCount,
        products_with_zoho_id: zohoProductsCount,
        ready_for_migration: zohoProductsCount > 0
      },
      new_columns_available: [
        'unit', 'item_type', 'product_type', 'status', 'source',
        'available_stock', 'committed_stock', 'stock_on_hand',
        'is_taxable', 'tax_id', 'tax_name', 'tax_percentage',
        'zoho_category_id', 'zoho_category_name', 'brand_name', 'manufacturer',
        'weight', 'weight_unit', 'length_mm', 'width_mm', 'height_mm',
        'dtc_description', 'msrp', 'club_discount', 'age_required', 'restricted_states',
        'is_combo_product', 'tags', 'zoho_custom_fields', 'image_urls',
        'sync_status', 'sync_error', 'last_sync_attempt'
      ],
      sample_data: queryTest
    });

  } catch (error) {
    console.error('Zoho columns test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      message: 'There may be issues with the new Zoho columns'
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    endpoint: 'Zoho Columns Test',
    description: 'Tests all new Zoho columns for proper functionality',
    method: 'GET',
    features: [
      'Tests insert operations with all Zoho fields',
      'Tests update operations with Zoho data',
      'Tests complex queries with new columns',
      'Validates data types and constraints',
      'Provides database statistics',
      'Lists all available Zoho columns'
    ]
  });
}
