import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { detectBrand, detectCategory, filterByBrand, filterByCategory } from '../../lib/product-categorization';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Natural Language Search Enhancement
const BRAND_SYNONYMS: Record<string, string[]> = {
  'roor': ['roor', 'ror', 'roar', 'german glass', 'premium glass'],
  'puffco': ['puffco', 'puff co', 'peak', 'proxy', 'e-rig'],
  'cookies': ['cookies', 'berner', 'berners cookies'],
  'raw': ['raw', 'raw papers', 'rolling papers'],
  'storz': ['storz', 'bickel', 'storz & bickel', 'volcano', 'mighty'],
  'grav': ['grav', 'grav labs', 'gravitron'],
  'empire': ['empire', 'empire glassworks'],
  'pulsar': ['pulsar', 'pulsar vapes']
};

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  'bongs': ['bong', 'bongs', 'water pipe', 'water pipes', 'bubbler', 'bubblers', 'glass pipe', 'smoking device'],
  'pipes': ['pipe', 'pipes', 'hand pipe', 'hand pipes', 'bowl', 'bowls', 'spoon pipe'],
  'dab-rigs': ['dab rig', 'dab rigs', 'oil rig', 'oil rigs', 'concentrate rig', 'wax rig', 'shatter rig'],
  'e-rigs': ['e-rig', 'e-rigs', 'electric rig', 'electric rigs', 'electronic rig', 'enail', 'e-nail'],
  'vaporizers': ['vaporizer', 'vaporizers', 'vape', 'vapes', 'dry herb vape', 'portable vape'],
  'accessories': ['accessory', 'accessories', 'tool', 'tools', 'grinder', 'grinders', 'lighter', 'lighters'],
  'flower': ['flower', 'bud', 'nugs', 'thca flower', 'hemp flower', 'cannabis flower'],
  'pre-rolls': ['pre-roll', 'pre-rolls', 'joint', 'joints', 'preroll', 'prerolls']
};

const MATERIAL_SYNONYMS: Record<string, string[]> = {
  'glass': ['glass', 'borosilicate', 'pyrex', 'scientific glass', 'thick glass'],
  'silicone': ['silicone', 'rubber', 'flexible'],
  'ceramic': ['ceramic', 'clay', 'porcelain'],
  'metal': ['metal', 'aluminum', 'steel', 'titanium'],
  'wood': ['wood', 'wooden', 'bamboo']
};

// Fuzzy matching function
function fuzzyMatch(search: string, target: string, threshold: number = 0.6): boolean {
  if (!search || !target) return false;

  const searchLower = search.toLowerCase();
  const targetLower = target.toLowerCase();

  // Exact match
  if (targetLower.includes(searchLower)) return true;

  // Calculate similarity using Levenshtein distance
  const distance = levenshteinDistance(searchLower, targetLower);
  const maxLength = Math.max(searchLower.length, targetLower.length);
  const similarity = 1 - (distance / maxLength);

  return similarity >= threshold;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// Enhanced search term expansion
function expandSearchTerms(query: string): string[] {
  const terms = [query.toLowerCase().trim()];
  const words = query.toLowerCase().split(/\s+/);

  // Add individual words
  terms.push(...words);

  // Add brand synonyms
  for (const [brand, synonyms] of Object.entries(BRAND_SYNONYMS)) {
    if (synonyms.some(synonym => query.toLowerCase().includes(synonym))) {
      terms.push(brand, ...synonyms);
    }
  }

  // Add category synonyms
  for (const [category, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (synonyms.some(synonym => query.toLowerCase().includes(synonym))) {
      terms.push(category, ...synonyms);
    }
  }

  // Add material synonyms
  for (const [material, synonyms] of Object.entries(MATERIAL_SYNONYMS)) {
    if (synonyms.some(synonym => query.toLowerCase().includes(synonym))) {
      terms.push(material, ...synonyms);
    }
  }

  // Remove duplicates and empty terms
  return [...new Set(terms.filter(term => term.length > 0))];
}

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
  category_slug?: string;
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
  const category = (item.category_slug || '').toLowerCase();
  
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
  tags.forEach((tag: string) => {
    if (tag === term) score += 200;
    if (tag.includes(term)) score += 100;
  });

  materials.forEach((material: string) => {
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
    const expandedTerms = expandSearchTerms(query);
    let allResults: SearchResult[] = [];

    console.log(`🔍 Natural Language Search: "${query}"`);
    console.log(`📝 Expanded terms: ${expandedTerms.join(', ')}`);

    // Simplified search approach - just search by name and brand_name
    console.log(`🔍 Executing simplified search for: "${searchTerm}"`);

    try {
      let supabaseQuery = supabase
        .from('main_site_products')
        .select(`
          id, name, brand_name, our_price, image_url, description, short_description,
          sku, featured, stock_quantity, tags, materials,
          specs, attributes, category_slug
        `)
        .ilike('name', `%${searchTerm}%`);
      // #### END CATEGORY-BASED SEARCH ENHANCEMENT ####

      // Apply filters with error handling
      try {
        supabaseQuery = supabaseQuery
          // Note: Removed .eq('is_active', true) filter for current manual inventory phase
          // Add back when connecting to Zoho Inventory for automated product management
          .eq('nicotine_product', false)
          .eq('tobacco_product', false);
      } catch (error) {
        console.warn('⚠️ Compliance filter columns may not exist, using basic filtering');
        // Note: Removed .eq('is_active', true) filter for current manual inventory phase
        // Add back when connecting to Zoho Inventory for automated product management
      }

      const { data: allProductResults, error: productsError } = await supabaseQuery.limit(100);

      if (productsError) {
        console.error('❌ Search query failed:', productsError);
        // Fallback to basic search
        console.log('🔄 Falling back to basic search...');
        const { data: fallbackResults, error: fallbackError } = await supabase
          .from('main_site_products')
          .select(`
            id, name, brand_name, our_price, image_url, description, short_description,
            sku, featured, stock_quantity, tags, materials,
            specs, attributes, category_slug
          `)
          .or(`name.ilike.%${searchTerm}%,brand_name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
          // Note: Removed .eq('is_active', true) filter for current manual inventory phase
          // Add back when connecting to Zoho Inventory for automated product management
          .limit(50);

        if (fallbackError) {
          console.error('❌ Fallback search also failed:', fallbackError);
          return NextResponse.json({
            results: [],
            total: 0,
            query: query,
            filters: filters,
            message: 'Search temporarily unavailable'
          });
        }

        console.log(`🔄 Fallback search found ${fallbackResults?.length || 0} products`);
        var finalResults = fallbackResults || [];
      } else {
        console.log(`✅ Main search found ${allProductResults?.length || 0} products`);
        var finalResults = allProductResults || [];
      }
    } catch (error) {
      console.error('💥 Search execution error:', error);
      return NextResponse.json({
        results: [],
        total: 0,
        query: query,
        filters: filters,
        message: 'Search error occurred'
      });
    }

    // Remove duplicates and process results
    const uniqueProducts = Array.from(
      new Map(finalResults.map(product => [product.id, product])).values()
    );

    console.log(`📊 Found ${finalResults.length} total results, ${uniqueProducts.length} unique products`);
    if (finalResults.length > 0) {
      console.log(`🔍 Sample product:`, finalResults[0]);
    }

    if (uniqueProducts.length > 0) {
      // Apply filters
      const filteredProducts = applyFilters(uniqueProducts, filters);

      // Enhanced relevance scoring with natural language matching
      const productResults: SearchResult[] = filteredProducts
        .map(product => {
          let relevanceScore = calculateRelevanceScore(product, searchTerm, 'product');

          // Boost score for fuzzy matches
          const productText = `${product.name} ${product.brand_name || ''} ${product.description || ''} ${product.sku || ''}`.toLowerCase();

          for (const expandedTerm of expandedTerms) {
            if (fuzzyMatch(expandedTerm, productText, 0.7)) {
              relevanceScore += 50;
            }
          }

          // Boost for exact brand matches
          if (product.brand_name && expandedTerms.some(term =>
            product.brand_name.toLowerCase().includes(term.toLowerCase())
          )) {
            relevanceScore += 100;
          }

          // Boost for category matches
          if (product.category_slug && expandedTerms.some(term =>
            product.category_slug.toLowerCase().includes(term.toLowerCase())
          )) {
            relevanceScore += 75;
          }

          return {
            ...product,
            price: product.our_price, // Map our_price to price for interface compatibility
            relevanceScore,
            resultType: 'product' as const
          };
        })
        .filter(product => product.relevanceScore > 0);

      allResults.push(...productResults);
      console.log(`✅ Processed ${productResults.length} relevant product results`);
    }

    // Enhanced brand search with natural language matching
    if (includeBrands) {
      console.log('🏷️ Searching brands with expanded terms...');

      // Build brand search queries
      const brandSearchQueries = expandedTerms.map(term => `name.ilike.%${term}%`);

      const { data: brands, error: brandsError } = await supabase
        .from('brands')
        .select('id, name, description, logo_url, slug')
        .or(brandSearchQueries.join(','))
        .limit(20);

      if (!brandsError && brands) {
        console.log(`🏷️ Found ${brands.length} matching brands`);

        const brandResults: SearchResult[] = brands
          .map(brand => {
            let relevanceScore = calculateRelevanceScore(brand, searchTerm, 'brand');

            // Boost for fuzzy brand name matches
            for (const expandedTerm of expandedTerms) {
              if (fuzzyMatch(expandedTerm, brand.name, 0.8)) {
                relevanceScore += 100;
              }
            }

            return {
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
              category_slug: '',
              manufacturer: '',
              relevanceScore,
              resultType: 'brand' as const
            };
          })
          .filter(brand => brand.relevanceScore > 0);

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
          category_slug: category.name,
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
