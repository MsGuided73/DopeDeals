import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');

    // Build query
    let query = supabase
      .from('vip_smoke_products')
      .select(`
        id,
        name,
        description,
        short_description,
        sku,
        price,
        vip_price,
        compare_at_price,
        brand_id,
        category_id,
        stock_quantity,
        materials,
        image_url,
        image_urls,
        attributes,
        specs,
        tags,
        nicotine_content,
        nicotine_type,
        tobacco_type,
        is_active,
        featured,
        vip_exclusive,
        requires_membership,
        age_restriction,
        warning_labels,
        created_at
      `)
      .eq('is_active', true);

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (brand) {
      query = query.eq('brand_id', brand);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (inStock === 'true') {
      query = query.gt('stock_quantity', 0);
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('vip_smoke_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Execute query with pagination
    const { data: products, error } = await query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching VIP Smoke products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Transform products for frontend
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.short_description,
      sku: product.sku,
      price: parseFloat(product.price),
      vipPrice: product.vip_price ? parseFloat(product.vip_price) : null,
      compareAtPrice: product.compare_at_price ? parseFloat(product.compare_at_price) : null,
      brandId: product.brand_id,
      categoryId: product.category_id,
      stockQuantity: product.stock_quantity || 0,
      materials: product.materials || [],
      imageUrl: product.image_url,
      imageUrls: product.image_urls || [],
      attributes: product.attributes || {},
      specs: product.specs || {},
      tags: product.tags || [],
      nicotineContent: product.nicotine_content,
      nicotineType: product.nicotine_type,
      tobaccoType: product.tobacco_type,
      isActive: product.is_active,
      featured: product.featured,
      vipExclusive: product.vip_exclusive,
      requiresMembership: product.requires_membership,
      ageRestriction: product.age_restriction,
      warningLabels: product.warning_labels || [],
      inStock: (product.stock_quantity || 0) > 0,
      isNew: new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
      isSale: product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price),
      createdAt: product.created_at
    })) || [];

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      },
      filters: {
        category,
        brand,
        search,
        featured,
        minPrice,
        maxPrice,
        inStock
      }
    });

  } catch (error) {
    console.error('VIP Smoke products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, sku, price, categoryId } = body;
    if (!name || !sku || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, SKU, price, and category are required' },
        { status: 400 }
      );
    }

    // Create new VIP Smoke product
    const { data: product, error } = await supabase
      .from('vip_smoke_products')
      .insert({
        name: body.name,
        description: body.description,
        short_description: body.shortDescription,
        sku: body.sku,
        price: parseFloat(body.price),
        vip_price: body.vipPrice ? parseFloat(body.vipPrice) : null,
        compare_at_price: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
        brand_id: body.brandId,
        category_id: body.categoryId,
        stock_quantity: body.stockQuantity || 0,
        materials: body.materials || [],
        image_url: body.imageUrl,
        image_urls: body.imageUrls || [],
        attributes: body.attributes || {},
        specs: body.specs || {},
        tags: body.tags || [],
        nicotine_content: body.nicotineContent,
        nicotine_type: body.nicotineType,
        tobacco_type: body.tobaccoType,
        age_restriction: body.ageRestriction || 21,
        requires_id_verification: body.requiresIdVerification !== false,
        restricted_states: body.restrictedStates || [],
        restricted_zipcodes: body.restrictedZipcodes || [],
        compliance_notes: body.complianceNotes,
        warning_labels: body.warningLabels || [],
        is_active: body.isActive !== false,
        featured: body.featured || false,
        vip_exclusive: body.vipExclusive || false,
        requires_membership: body.requiresMembership || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating VIP Smoke product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: parseFloat(product.price),
        createdAt: product.created_at
      }
    });

  } catch (error) {
    console.error('Error creating VIP Smoke product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
