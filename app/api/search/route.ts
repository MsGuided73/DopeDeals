import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { detectBrand, detectCategory, filterByBrand, filterByCategory } from '../../lib/product-categorization';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SearchResult {
  id: string;
  name: string;
  brand_name?: string;
  price: number;
  image_url?: string;
  description?: string;
  short_description?: string;
  sku: string;
  featured: boolean;
  stock_quantity?: number;
  tags?: string[];
  materials?: string[];
  zoho_category_name?: string;
  manufacturer?: string;
  relevanceScore: number;
  resultType: 'product' | 'brand' | 'category';
}

interface SearchFilters {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  stockStatus?: string; // 'all', 'in-stock', 'out-of-stock', 'low-stock', 'high-stock'
  featured?: boolean;
  materials?: string[];
  tags?: string[];
}

// Enhanced relevance scoring algorithm
function calculateRelevanceScore(item: any, searchTerm: string, searchType: 'product' | 'brand' | 'category'): number {
  const term = searchTerm.toLowerCase().trim();
  let score = 0;

  // Get searchable text fields
  const name = (item.name || '').toLowerCase();
  const brand = (item.brand_name || '').toLowerCase();
  const sku = (item.sku || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const shortDescription = (item.short_description || '').toLowerCase();
  const manufacturer = (item.manufacturer || '').toLowerCase();
  const category = (item.zoho_category_name || '').toLowerCase();
  
  // Array fields
  const tags = (item.tags || []).map((tag: string) => tag.toLowerCase());
  const materials = (item.materials || []).map((material: string) => material.toLowerCase());

  // JSON fields (specs, attributes)
  const specs = JSON.stringify(item.specs || {}).toLowerCase();
  const attributes = JSON.stringify(item.attributes || {}).toLowerCase();

  // Exact matches get highest priority
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
  if (wordBoundaryRegex.test(shortDescription)) score += 180;

  // Contains matches
  if (name.includes(term)) score += 150;
  if (brand.includes(term)) score += 120;
  if (sku.includes(term)) score += 100;
  if (description.includes(term)) score += 80;
  if (shortDescription.includes(term)) score += 70;
  if (manufacturer.includes(term)) score += 60;
  if (category.includes(term)) score += 50;

  // Array field matches
  tags.forEach(tag => {
    if (tag === term) score += 200;
    if (tag.includes(term)) score += 100;
  });

  materials.forEach(material => {
    if (material === term) score += 150;
    if (material.includes(term)) score += 75;
  });

  // JSON field matches (specs, attributes)
  if (specs.includes(term)) score += 40;
  if (attributes.includes(term)) score += 40;

  // Boost factors
  if (item.featured) score += 100;
  if (item.stock_quantity > 0) score += 50;
  if (item.image_url) score += 25;

  // Search type specific boosts
  if (searchType === 'product') {
    // Boost products that match search intent
    if (term.length >= 3 && brand.includes(term)) score += 150;
  }

  // Penalty for very long names (less relevant)
  if (name.length > 100) score -= 20;

  return Math.max(0, score);
}

// Apply search filters with enhanced categorization
function applyFilters(products: any[], filters: SearchFilters): any[] {
  let filteredProducts = [...products];

  // Category filter using name-based detection
  if (filters.category && filters.category !== 'all') {
    filteredProducts = filterByCategory(filteredProducts, filters.category);
  }

  // Brand filter using name-based detection
  if (filters.brand && filters.brand !== 'all') {
    filteredProducts = filterByBrand(filteredProducts, filters.brand);
  }

  // Apply remaining filters
  return filteredProducts.filter(product => {
    // Price range filter
    if (filters.priceMin !== undefined && product.price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax !== undefined && product.price > filters.priceMax) {
      return false;
    }

    // Stock status and featured filters are now handled at database level
    // Only client-side filters remain here

    // Materials filter
    if (filters.materials && filters.materials.length > 0) {
      const productMaterials = product.materials || [];
      const hasMatchingMaterial = filters.materials.some(filterMaterial =>
        productMaterials.some((productMaterial: string) =>
          productMaterial.toLowerCase().includes(filterMaterial.toLowerCase())
        )
      );
      if (!hasMatchingMaterial) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const productTags = product.tags || [];
      const hasMatchingTag = filters.tags.some(filterTag =>
        productTags.some((productTag: string) =>
          productTag.toLowerCase().includes(filterTag.toLowerCase())
        )
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeCategories = searchParams.get('includeCategories') === 'true';
    const includeBrands = searchParams.get('includeBrands') === 'true';

    // Parse filters
    const filters: SearchFilters = {
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
      stockStatus: searchParams.get('stockStatus') || 'all',
      featured: searchParams.get('featured') === 'true',
      materials: searchParams.get('materials')?.split(',').filter(Boolean) || [],
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    };

    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: query,
        filters: filters,
        message: 'Query must be at least 2 characters'
      });
    }

    const searchTerm = query.toLowerCase().trim();
    let allResults: SearchResult[] = [];

    // Build the base query
    let query = supabase
      .from('products')
      .select(`
        id, name, brand_name, price, image_url, description, short_description,
        sku, featured, stock_quantity, tags, materials, zoho_category_name,
        manufacturer, specs, attributes, dtc_description, vip_price
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
      .eq('tobacco_product', false);

    // Apply stock filtering at database level for better performance
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      switch (filters.stockStatus) {
        case 'in-stock':
          query = query.gt('stock_quantity', 0);
          break;
        case 'out-of-stock':
          query = query.eq('stock_quantity', 0);
          break;
        case 'low-stock':
          query = query.gt('stock_quantity', 0).lte('stock_quantity', 5);
          break;
        case 'high-stock':
          query = query.gte('stock_quantity', 20);
          break;
      }
    }

    // Apply featured filter at database level
    if (filters.featured) {
      query = query.eq('featured', true);
    }

    // Execute the query
    const { data: products, error: productsError } = await query.limit(limit * 3);

    if (productsError) {
      console.error('Error fetching products:', productsError);
    } else if (products) {
      // Apply filters
      const filteredProducts = applyFilters(products, filters);

      // Calculate relevance and format results
      const productResults: SearchResult[] = filteredProducts
        .map(product => ({
          ...product,
          relevanceScore: calculateRelevanceScore(product, searchTerm, 'product'),
          resultType: 'product' as const
        }))
        .filter(product => product.relevanceScore > 0);

      allResults.push(...productResults);
    }

    // Search brands if requested
    if (includeBrands) {
      const { data: brands, error: brandsError } = await supabase
        .from('brands')
        .select('id, name, description, logo_url, slug')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (!brandsError && brands) {
        const brandResults: SearchResult[] = brands.map(brand => ({
          id: brand.id,
          name: brand.name,
          brand_name: brand.name,
          price: 0,
          image_url: brand.logo_url,
          description: brand.description,
          short_description: brand.description,
          sku: '',
          featured: false,
          stock_quantity: 0,
          tags: [],
          materials: [],
          zoho_category_name: '',
          manufacturer: '',
          relevanceScore: calculateRelevanceScore(brand, searchTerm, 'brand'),
          resultType: 'brand' as const
        }));

        allResults.push(...brandResults);
      }
    }

    // Search categories if requested
    if (includeCategories) {
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, description, image_url')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (!categoriesError && categories) {
        const categoryResults: SearchResult[] = categories.map(category => ({
          id: category.id,
          name: category.name,
          brand_name: '',
          price: 0,
          image_url: category.image_url,
          description: category.description,
          short_description: category.description,
          sku: '',
          featured: false,
          stock_quantity: 0,
          tags: [],
          materials: [],
          zoho_category_name: category.name,
          manufacturer: '',
          relevanceScore: calculateRelevanceScore(category, searchTerm, 'category'),
          resultType: 'category' as const
        }));

        allResults.push(...categoryResults);
      }
    }

    // Sort by relevance score and apply pagination
    const sortedResults = allResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(offset, offset + limit);

    // Record search analytics
    try {
      await supabase
        .from('search_analytics')
        .insert({
          query: searchTerm,
          result_count: allResults.length,
          filters: filters,
          timestamp: new Date().toISOString()
        });
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError);
      // Don't fail the search if analytics fails
    }

    return NextResponse.json({
      results: sortedResults,
      total: allResults.length,
      query: searchTerm,
      filters: filters,
      pagination: {
        limit,
        offset,
        hasMore: allResults.length > offset + limit
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        results: [],
        total: 0
      },
      { status: 500 }
    );
  }
}
