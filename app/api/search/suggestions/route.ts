import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from '../../../../lib/compliance-filters';
import { applyImageRequiredFilter } from '../../../../lib/product-display-filters';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const hasValidImage = (image?: string | null) =>
  typeof image === 'string' && image.trim() !== '';

// Enhanced relevance scoring for comprehensive search
function calculateRelevanceScore(item: any, searchTerm: string): number {
  const term = searchTerm.toLowerCase();
  const name = (item.name || '').toLowerCase();
  const brand = (item.brand_name || '').toLowerCase();
  const sku = (item.sku || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const shortDescription = (item.short_description || '').toLowerCase();
  const manufacturer = (item.manufacturer || '').toLowerCase();
  const category = (item.category_slug || '').toLowerCase();
  const dtcDescription = (item.dtc_description || '').toLowerCase();

  const tagsArray: string[] = Array.isArray(item.tags) ? item.tags : [];
  const materialsArray: string[] = Array.isArray(item.materials) ? item.materials : [];
  const tags = tagsArray.map((tag) => tag.toLowerCase());
  const materials = materialsArray.map((material) => material.toLowerCase());

  let score = 0;

  if (name === term) score += 1000;
  if (brand === term) score += 900;
  if (sku === term) score += 800;
  if (manufacturer === term) score += 700;

  if (name.startsWith(term)) score += 500;
  if (brand.startsWith(term)) score += 450;
  if (sku.startsWith(term)) score += 400;
  if (manufacturer.startsWith(term)) score += 350;

  const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i');
  if (wordBoundaryRegex.test(name)) score += 300;
  if (wordBoundaryRegex.test(brand)) score += 250;
  if (wordBoundaryRegex.test(description)) score += 200;

  if (name.includes(term)) score += 150;
  if (brand.includes(term)) score += 120;
  if (sku.includes(term)) score += 100;
  if (description.includes(term)) score += 80;
  if (shortDescription.includes(term)) score += 70;
  if (manufacturer.includes(term)) score += 60;
  if (category.includes(term)) score += 50;
  if (dtcDescription.includes(term)) score += 40;

  tags.forEach((tag) => {
    if (tag === term) score += 200;
    if (tag.includes(term)) score += 100;
  });

  materials.forEach((material) => {
    if (material === term) score += 150;
    if (material.includes(term)) score += 75;
  });

  if (item.featured) score += 100;
  if (item.stock_quantity > 0) score += 50;
  if (item.image_url) score += 25;

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

    let suggestionsQuery = supabase
      .from('main_site_products')
      .select(`
        id, name, brand_name, our_price, image_url, featured, sku, description,
        short_description, manufacturer, category_slug, tags, materials,
        stock_quantity, dtc_description, is_active
      `)
      .or(`name.ilike.%${searchTerm}%,brand_name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%,category_slug.ilike.%${searchTerm}%,dtc_description.ilike.%${searchTerm}%`)
      .eq('is_active', true);

    // Apply centralized compliance filters
    suggestionsQuery = applyRestrictedProductFilter(suggestionsQuery);

    // Hide products without a usable image (mid-import state).
    suggestionsQuery = applyImageRequiredFilter(suggestionsQuery);

    const { data: products, error: productsError } = await suggestionsQuery
      .limit(limit * 2);

    if (productsError) {
      console.error('Error fetching product suggestions:', productsError);
      return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }

    const filteredProducts = (products || []).filter((product) => hasValidImage(product.image_url));

    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, name, slug')
      .ilike('name', `%${searchTerm}%`)
      .limit(5);

    if (brandsError) {
      console.error('Error fetching brand suggestions:', brandsError);
    }

    const productSuggestions = filteredProducts
      .map((product) => {
        // Helper to parse image URLs that might be comma-separated strings
        const parseImageUrls = (value?: string[] | string | null) => {
          if (!value) return [] as string[];
          if (Array.isArray(value)) {
            return value
              .flatMap((entry) => (typeof entry === 'string' ? entry.split(',') : [entry]))
              .map((entry) => (typeof entry === 'string' ? entry.trim() : entry))
              .filter(Boolean);
          }
          if (typeof value !== 'string') return [value].filter(Boolean);
          return value
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean);
        };

        const urls = parseImageUrls(product.image_url);

        return {
          type: 'product',
          id: product.id,
          title: product.name,
          subtitle: product.brand_name || 'Unknown Brand',
          price: product.our_price,
          image: urls[0] || product.image_url,
          url: `/product/${product.id}`,
          relevanceScore: calculateRelevanceScore(product, searchTerm),
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    const brandSuggestions = (brands || [])
      .map((brand) => ({
        type: 'brand',
        id: brand.id,
        title: brand.name,
        subtitle: 'Brand',
        url: `/brands/${brand.slug || brand.id}`,
        relevanceScore: calculateRelevanceScore({ name: brand.name }, searchTerm),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    const isBrandSearch = brandSuggestions.some(
      (brand) => brand.title.toLowerCase().includes(searchTerm) && brand.relevanceScore >= 60,
    );

    let allSuggestions;
    if (isBrandSearch) {
      const topBrands = brandSuggestions.slice(0, 2);
      const remainingSlots = limit - topBrands.length;
      const topProducts = productSuggestions.slice(0, remainingSlots);
      allSuggestions = [...topBrands, ...topProducts];
    } else {
      allSuggestions = [...productSuggestions, ...brandSuggestions]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    }

    try {
      fetch('/api/search/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm,
          resultCount: allSuggestions.length,
          userAgent: request.headers.get('user-agent'),
        }),
      }).catch(() => {});
    } catch (error) {
      // Ignore analytics errors
    }

    return NextResponse.json({
      query: searchTerm,
      suggestions: allSuggestions,
    });
  } catch (error) {
    console.error('Search suggestions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
