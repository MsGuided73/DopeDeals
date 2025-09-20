import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Enhanced relevance scoring for comprehensive search
function calculateRelevanceScore(item: any, searchTerm: string): number {
  const term = searchTerm.toLowerCase();
  const name = (item.name || '').toLowerCase();
  const brand = (item.brand_name || '').toLowerCase();
  const sku = (item.sku || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const shortDescription = (item.short_description || '').toLowerCase();
  const manufacturer = (item.manufacturer || '').toLowerCase();
  const category = (item.zoho_category_name || '').toLowerCase();
  const dtcDescription = (item.dtc_description || '').toLowerCase();

  // Array fields
  const tags = (item.tags || []).map((tag: string) => tag.toLowerCase());
  const materials = (item.materials || []).map((material: string) => material.toLowerCase());

  let score = 0;

  // Exact matches get highest score
  if (name === term) score += 1000;
  if (brand === term) score += 900;
  if (sku === term) score += 800;
  if (manufacturer === term) score += 700;

  // Starts with matches
  if (name.startsWith(term)) score += 500;
  if (brand.startsWith(term)) score += 450;
  if (sku.startsWith(term)) score += 400;
  if (manufacturer.startsWith(term)) score += 350;

  // Word boundary matches (whole words)
  const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i');
  if (wordBoundaryRegex.test(name)) score += 300;
  if (wordBoundaryRegex.test(brand)) score += 250;
  if (wordBoundaryRegex.test(description)) score += 200;

  // Contains matches
  if (name.includes(term)) score += 150;
  if (brand.includes(term)) score += 120;
  if (sku.includes(term)) score += 100;
  if (description.includes(term)) score += 80;
  if (shortDescription.includes(term)) score += 70;
  if (manufacturer.includes(term)) score += 60;
  if (category.includes(term)) score += 50;
  if (dtcDescription.includes(term)) score += 40;

  // Array field matches
  tags.forEach(tag => {
    if (tag === term) score += 200;
    if (tag.includes(term)) score += 100;
  });

  materials.forEach(material => {
    if (material === term) score += 150;
    if (material.includes(term)) score += 75;
  });

  // Boost factors
  if (item.featured) score += 100;
  if (item.stock_quantity > 0) score += 50;
  if (item.image_url) score += 25;

  // Brand name prominence (for brand searches)
  if (term.length >= 3 && brand.includes(term)) {
    score += 150;
  }

  return Math.max(0, score);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const searchTerm = query.toLowerCase().trim();

    // Get product suggestions with comprehensive search across all relevant fields
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id, name, brand_name, price, image_url, featured, sku, description,
        short_description, manufacturer, zoho_category_name, tags, materials,
        stock_quantity, dtc_description
      `)
      .or(`
        name.ilike.%${searchTerm}%,
        brand_name.ilike.%${searchTerm}%,
        sku.ilike.%${searchTerm}%,
        description.ilike.%${searchTerm}%,
        short_description.ilike.%${searchTerm}%,
        manufacturer.ilike.%${searchTerm}%,
        zoho_category_name.ilike.%${searchTerm}%,
        dtc_description.ilike.%${searchTerm}%
      `)
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .limit(limit * 2); // Get more results for better ranking

    if (productsError) {
      console.error('Error fetching product suggestions:', productsError);
      return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }

    // Get brand suggestions
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, name, slug')
      .ilike('name', `%${searchTerm}%`)
      .limit(5);

    if (brandsError) {
      console.error('Error fetching brand suggestions:', brandsError);
    }

    // Format and rank product suggestions
    const productSuggestions = (products || [])
      .map(product => ({
        type: 'product',
        id: product.id,
        title: product.name,
        subtitle: product.brand_name || 'Unknown Brand',
        price: product.price,
        image: product.image_url,
        url: `/products/${product.id}`,
        relevanceScore: calculateRelevanceScore(product, searchTerm)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    const brandSuggestions = (brands || [])
      .map(brand => ({
        type: 'brand',
        id: brand.id,
        title: brand.name,
        subtitle: 'Brand',
        url: `/brands/${brand.slug || brand.id}`,
        relevanceScore: calculateRelevanceScore({ name: brand.name }, searchTerm)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Prioritize brand results for brand-like searches
    const isBrandSearch = brandSuggestions.some(brand =>
      brand.title.toLowerCase().includes(searchTerm) && brand.relevanceScore >= 60
    );

    let allSuggestions;
    if (isBrandSearch) {
      // For brand searches, show brand first, then related products
      const topBrands = brandSuggestions.slice(0, 2);
      const remainingSlots = limit - topBrands.length;
      const topProducts = productSuggestions.slice(0, remainingSlots);
      allSuggestions = [...topBrands, ...topProducts];
    } else {
      // For general searches, mix products and brands by relevance
      allSuggestions = [...productSuggestions, ...brandSuggestions]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    }

    // Record search analytics (fire and forget)
    try {
      fetch('/api/search/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm,
          resultCount: allSuggestions.length,
          userAgent: request.headers.get('user-agent')
        })
      }).catch(() => {}); // Ignore analytics errors
    } catch (error) {
      // Ignore analytics errors
    }

    return NextResponse.json({
      query: searchTerm,
      suggestions: allSuggestions
    });

  } catch (error) {
    console.error('Search suggestions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
