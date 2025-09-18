import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting VIP Smoke migration...');

    // Step 1: Get all nicotine/tobacco products from main table
    const { data: productsToMigrate, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .or('nicotine_product.eq.true,tobacco_product.eq.true');

    if (fetchError) {
      console.error('Error fetching products to migrate:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch products for migration' },
        { status: 500 }
      );
    }

    console.log(`📦 Found ${productsToMigrate?.length || 0} products to migrate`);

    if (!productsToMigrate || productsToMigrate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products found to migrate',
        migrated: 0,
        skipped: 0,
        deleted: 0
      });
    }

    let migrated = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Step 2: Migrate each product to VIP Smoke table
    for (const product of productsToMigrate) {
      try {
        // Determine nicotine/tobacco type from product name
        const name = product.name.toLowerCase();
        let nicotineType = null;
        let tobaccoType = null;
        let nicotineContent = null;
        let ageRestriction = 21;
        let warningLabels = [];

        // Detect product type and set appropriate fields
        if (name.includes('zyn') || name.includes('nicotine pouch')) {
          nicotineType = 'synthetic';
          tobaccoType = null;
          nicotineContent = 6.0; // Default ZYN strength
          warningLabels = ['Contains nicotine', 'Addictive substance', '21+ only'];
        } else if (name.includes('vape') || name.includes('e-cig')) {
          nicotineType = 'freebase';
          tobaccoType = null;
          nicotineContent = 3.0; // Default vape strength
          warningLabels = ['Contains nicotine', 'Not for use by minors', 'May cause addiction'];
        } else if (name.includes('cigarette') || name.includes('tobacco')) {
          nicotineType = 'natural';
          tobaccoType = 'cigarette';
          warningLabels = ['Tobacco product', 'Causes cancer', 'Addictive', '21+ only'];
        } else {
          // Generic tobacco/nicotine product
          warningLabels = ['Age restricted product', '21+ only'];
        }

        // Insert into VIP Smoke table
        const { error: insertError } = await supabase
          .from('vip_smoke_products')
          .insert({
            id: product.id, // Keep same ID for reference
            name: product.name,
            description: product.description,
            short_description: product.short_description,
            sku: product.sku,
            price: product.price,
            vip_price: product.vip_price,
            compare_at_price: product.compare_at_price,
            brand_id: product.brand_id,
            category_id: product.category_id,
            stock_quantity: product.stock_quantity || 0,
            weight: product.weight,
            materials: product.materials,
            image_url: product.image_url,
            image_urls: product.image_urls,
            attributes: product.attributes,
            specs: product.specs,
            tags: product.tags,
            nicotine_content: nicotineContent,
            nicotine_type: nicotineType,
            tobacco_type: tobaccoType,
            age_restriction: ageRestriction,
            requires_id_verification: true,
            warning_labels: warningLabels,
            is_active: product.is_active,
            featured: product.featured,
            vip_exclusive: product.vip_exclusive,
            requires_membership: false,
            created_at: product.created_at,
            updated_at: product.updated_at,
            zoho_item_id: product.zoho_item_id
          });

        if (insertError) {
          if (insertError.code === '23505') {
            // Duplicate key - product already migrated
            console.log(`⚠️ Product ${product.sku} already exists in VIP Smoke table`);
            skipped++;
          } else {
            console.error(`❌ Error migrating product ${product.sku}:`, insertError);
            errors.push(`${product.sku}: ${insertError.message}`);
            skipped++;
          }
        } else {
          console.log(`✅ Migrated product: ${product.name} (${product.sku})`);
          migrated++;
        }

      } catch (error) {
        console.error(`❌ Error processing product ${product.sku}:`, error);
        errors.push(`${product.sku}: ${error}`);
        skipped++;
      }
    }

    // Step 3: Remove migrated products from main table (optional)
    let deleted = 0;
    const shouldDelete = request.url.includes('delete=true');
    
    if (shouldDelete && migrated > 0) {
      console.log('🗑️ Removing migrated products from main table...');
      
      const migratedIds = productsToMigrate
        .filter((_, index) => index < migrated)
        .map(p => p.id);

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', migratedIds);

      if (deleteError) {
        console.error('Error deleting migrated products:', deleteError);
        errors.push(`Delete error: ${deleteError.message}`);
      } else {
        deleted = migratedIds.length;
        console.log(`🗑️ Deleted ${deleted} products from main table`);
      }
    }

    console.log('✅ VIP Smoke migration completed!');
    console.log(`📊 Results: ${migrated} migrated, ${skipped} skipped, ${deleted} deleted`);

    return NextResponse.json({
      success: true,
      message: 'VIP Smoke migration completed',
      results: {
        migrated,
        skipped,
        deleted,
        errors: errors.length > 0 ? errors : undefined
      },
      summary: {
        totalProcessed: productsToMigrate.length,
        successRate: `${Math.round((migrated / productsToMigrate.length) * 100)}%`
      }
    });

  } catch (error) {
    console.error('VIP Smoke migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get migration status/preview
    const { data: mainProducts } = await supabase
      .from('products')
      .select('id, name, sku, nicotine_product, tobacco_product')
      .or('nicotine_product.eq.true,tobacco_product.eq.true');

    const { data: vipProducts } = await supabase
      .from('vip_smoke_products')
      .select('id, name, sku, nicotine_content, tobacco_type');

    const { count: mainCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .or('nicotine_product.eq.true,tobacco_product.eq.true');

    const { count: vipCount } = await supabase
      .from('vip_smoke_products')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      status: 'ready',
      mainTable: {
        nicotineTobaccoProducts: mainCount || 0,
        sampleProducts: mainProducts?.slice(0, 5) || []
      },
      vipSmokeTable: {
        totalProducts: vipCount || 0,
        sampleProducts: vipProducts?.slice(0, 5) || []
      },
      recommendation: mainCount && mainCount > 0 
        ? 'Migration recommended - nicotine/tobacco products found in main table'
        : 'No migration needed - main table is clean'
    });

  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json(
      { error: 'Failed to check migration status' },
      { status: 500 }
    );
  }
}
