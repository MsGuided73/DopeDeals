import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRestrictedProductFilter } from '../../../../lib/compliance-filters';
import { applyImageRequiredFilter } from '../../../../lib/product-display-filters';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Popular search terms and categories for fallback suggestions
const POPULAR_SEARCHES = [
  'bongs', 'pipes', 'dab rigs', 'vaporizers', 'grinders', 'papers',
  'roor', 'puffco', 'grav', 'cookies', 'raw papers', 'storz & bickel'
];

const CATEGORY_SUGGESTIONS = [
  'Bongs & Water Pipes',
  'Hand Pipes',
  'Dab Rigs & Tools',
  'Vaporizers',
  'Smoking Accessories',
  'THCA Flower',
  'Pre-Rolls & Vapes'
];

interface AutosuggestResult {
  text: string;
  type: 'product' | 'brand' | 'category' | 'popular';
  count?: number;
  image_url?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!query || query.length < 1) {
      // Return popular searches when no query
      const popularResults: AutosuggestResult[] = POPULAR_SEARCHES.slice(0, limit).map(term => ({
        text: term,
        type: 'popular' as const
      }));

      return NextResponse.json({
        suggestions: popularResults,
        query: query
      });
    }

    if (query.length < 2) {
      // For single characters, return basic category matches
      const categoryMatches = CATEGORY_SUGGESTIONS
        .filter(cat => cat.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, limit)
        .map(cat => ({
          text: cat,
          type: 'category' as const
        }));

      return NextResponse.json({
        suggestions: categoryMatches,
        query: query
      });
    }

    const searchTerm = query.toLowerCase().trim();
    let suggestions: AutosuggestResult[] = [];

    // Search products for autosuggest
    let autosuggestQuery = supabase
      .from('main_site_products')
      .select('name, brand_name, category_slug, image_url')
      .or(`name.ilike.%${searchTerm}%,brand_name.ilike.%${searchTerm}%`)
      .not('image_url', 'is', null)
      .neq('image_url', '')
      .eq('is_active', true);

    // Apply centralized compliance filters
    autosuggestQuery = applyRestrictedProductFilter(autosuggestQuery);

    // Hide products without a usable image (mid-import state).
    autosuggestQuery = applyImageRequiredFilter(autosuggestQuery);

    const { data: products, error: productsError } = await autosuggestQuery
      .limit(50);

    if (!productsError && products) {
      // Extract unique product names
      const productNames = new Map<string, number>();
      const brandNames = new Map<string, number>();
      const categories = new Map<string, number>();

      products.forEach(product => {
        // Count product name matches
        if (product.name && product.name.toLowerCase().includes(searchTerm)) {
          productNames.set(product.name, (productNames.get(product.name) || 0) + 1);
        }

        // Count brand matches
        if (product.brand_name && product.brand_name.toLowerCase().includes(searchTerm)) {
          brandNames.set(product.brand_name, (brandNames.get(product.brand_name) || 0) + 1);
        }

        // Count category matches
        const categoryName = product.category_slug;
        if (categoryName && categoryName.toLowerCase().includes(searchTerm)) {
          categories.set(categoryName, (categories.get(categoryName) || 0) + 1);
        }
      });

      // Convert to suggestions with priority ordering
      const productSuggestions: AutosuggestResult[] = Array.from(productNames.entries())
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 3) // Take top 3
        .map(([name, count]) => ({
          text: name,
          type: 'product' as const,
          count
        }));

      const brandSuggestions: AutosuggestResult[] = Array.from(brandNames.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([name, count]) => ({
          text: name,
          type: 'brand' as const,
          count
        }));

      const categorySuggestions: AutosuggestResult[] = Array.from(categories.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([name, count]) => ({
          text: name,
          type: 'category' as const,
          count
        }));

      suggestions.push(...productSuggestions, ...brandSuggestions, ...categorySuggestions);
    }

    // If we don't have enough suggestions, add popular searches that match
    if (suggestions.length < limit) {
      const matchingPopular = POPULAR_SEARCHES
        .filter(term => term.toLowerCase().includes(searchTerm) && !suggestions.some(s => s.text.toLowerCase() === term.toLowerCase()))
        .slice(0, limit - suggestions.length)
        .map(term => ({
          text: term,
          type: 'popular' as const
        }));

      suggestions.push(...matchingPopular);
    }

    // If still not enough, add category suggestions that match
    if (suggestions.length < limit) {
      const matchingCategories = CATEGORY_SUGGESTIONS
        .filter(cat => cat.toLowerCase().includes(searchTerm) && !suggestions.some(s => s.text.toLowerCase() === cat.toLowerCase()))
        .slice(0, limit - suggestions.length)
        .map(cat => ({
          text: cat,
          type: 'category' as const
        }));

      suggestions.push(...matchingCategories);
    }

    // Limit final results
    suggestions = suggestions.slice(0, limit);

    return NextResponse.json({
      suggestions: suggestions,
      query: searchTerm,
      total: suggestions.length
    });

  } catch (error) {
    console.error('Autosuggest API error:', error);
    return NextResponse.json(
      {
        suggestions: [],
        query: '',
        error: 'Autosuggest temporarily unavailable'
      },
      { status: 500 }
    );
  }
}
