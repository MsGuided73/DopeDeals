import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    console.log('[Brand Sync] Starting brand extraction from Zoho products...');

    // Get all unique brands from zohoProducts table
    const { data: zohoProducts, error: fetchError } = await supabaseAdmin
      .from('zoho_products')
      .select('brand, manufacturer')
      .not('brand', 'is', null)
      .not('brand', 'eq', '');

    if (fetchError) {
      console.error('[Brand Sync] Error fetching Zoho products:', fetchError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch Zoho products',
        error: fetchError.message 
      }, { status: 500 });
    }

    if (!zohoProducts || zohoProducts.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No Zoho products found. Run enhanced sync first.',
        brandsFound: 0
      });
    }

    // Extract unique brands
    const brandSet = new Set<string>();
    
    zohoProducts.forEach(product => {
      if (product.brand && product.brand.trim()) {
        brandSet.add(product.brand.trim());
      }
      // Also check manufacturer field as backup
      if (product.manufacturer && product.manufacturer.trim()) {
        brandSet.add(product.manufacturer.trim());
      }
    });

    const uniqueBrands = Array.from(brandSet).sort();
    console.log(`[Brand Sync] Found ${uniqueBrands.length} unique brands:`, uniqueBrands.slice(0, 10));

    let createdCount = 0;
    let updatedCount = 0;
    const errors: string[] = [];

    // Process each brand
    for (const brandName of uniqueBrands) {
      try {
        const slug = brandName.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim();

        if (!slug) continue;

        // Check if brand already exists
        const { data: existingBrand } = await supabaseAdmin
          .from('brands')
          .select('id, name')
          .eq('slug', slug)
          .single();

        if (existingBrand) {
          // Update existing brand if name is different
          if (existingBrand.name !== brandName) {
            const { error: updateError } = await supabaseAdmin
              .from('brands')
              .update({ 
                name: brandName,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingBrand.id);

            if (updateError) {
              errors.push(`Failed to update brand ${brandName}: ${updateError.message}`);
            } else {
              updatedCount++;
            }
          }
        } else {
          // Create new brand
          const { error: insertError } = await supabaseAdmin
            .from('brands')
            .insert({
              name: brandName,
              slug: slug,
              description: `Premium ${brandName} products available at DOPE CITY`,
              created_at: new Date().toISOString()
            });

          if (insertError) {
            errors.push(`Failed to create brand ${brandName}: ${insertError.message}`);
          } else {
            createdCount++;
          }
        }
      } catch (error) {
        errors.push(`Error processing brand ${brandName}: ${error}`);
      }
    }

    // Now update products with brand_id references
    let productUpdates = 0;
    
    // Get all brands with their IDs
    const { data: allBrands } = await supabaseAdmin
      .from('brands')
      .select('id, name, slug');

    if (allBrands) {
      const brandMap = new Map();
      allBrands.forEach(brand => {
        brandMap.set(brand.name.toLowerCase(), brand.id);
        brandMap.set(brand.slug, brand.id);
      });

      // Update products table with brand_id
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('id, material') // material field contains manufacturer/brand info
        .not('material', 'is', null);

      if (products) {
        for (const product of products) {
          if (product.material) {
            const brandId = brandMap.get(product.material.toLowerCase());
            if (brandId) {
              const { error: updateError } = await supabaseAdmin
                .from('products')
                .update({ brand_id: brandId })
                .eq('id', product.id);

              if (!updateError) {
                productUpdates++;
              }
            }
          }
        }
      }
    }

    console.log(`[Brand Sync] Completed: ${createdCount} created, ${updatedCount} updated, ${productUpdates} products linked`);

    return NextResponse.json({
      success: true,
      message: 'Brand sync completed successfully',
      results: {
        brandsFound: uniqueBrands.length,
        created: createdCount,
        updated: updatedCount,
        productUpdates: productUpdates,
        errors: errors.length
      },
      brands: uniqueBrands.slice(0, 20), // Return first 20 brands as sample
      errors: errors.slice(0, 10) // Return first 10 errors if any
    });

  } catch (error) {
    console.error('[Brand Sync] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      message: 'Brand sync failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get current brand statistics
    const { data: brands, error: brandsError } = await supabaseAdmin
      .from('brands')
      .select('id, name, slug, created_at')
      .order('name');

    if (brandsError) {
      return NextResponse.json({ 
        success: false, 
        error: brandsError.message 
      }, { status: 500 });
    }

    // Get product counts per brand
    const brandStats = [];
    for (const brand of brands || []) {
      const { count } = await supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brand.id);

      brandStats.push({
        ...brand,
        product_count: count || 0
      });
    }

    return NextResponse.json({
      success: true,
      totalBrands: brands?.length || 0,
      brands: brandStats
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
