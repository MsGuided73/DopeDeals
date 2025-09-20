import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { detectBrand, detectCategory, PRODUCT_CATEGORIES, PRODUCT_BRANDS } from '../../../lib/product-categorization';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'all';

    // Get sample products for testing
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, brand_name, price, stock_quantity, featured, tags, materials')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .limit(100);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const results: any = {
      totalProducts: products?.length || 0,
      tests: {}
    };

    if (testType === 'all' || testType === 'categories') {
      // Test category detection
      const categoryStats: { [key: string]: number } = {};
      const categorySamples: { [key: string]: string[] } = {};

      products?.forEach(product => {
        const category = detectCategory(product.name);
        categoryStats[category] = (categoryStats[category] || 0) + 1;
        
        if (!categorySamples[category]) {
          categorySamples[category] = [];
        }
        if (categorySamples[category].length < 3) {
          categorySamples[category].push(product.name);
        }
      });

      results.tests.categories = {
        stats: categoryStats,
        samples: categorySamples,
        availableCategories: PRODUCT_CATEGORIES.map(cat => ({
          value: cat.value,
          label: cat.label,
          count: categoryStats[cat.value] || 0
        }))
      };
    }

    if (testType === 'all' || testType === 'brands') {
      // Test brand detection
      const brandStats: { [key: string]: number } = {};
      const brandSamples: { [key: string]: string[] } = {};

      products?.forEach(product => {
        const brand = detectBrand(product.name);
        brandStats[brand] = (brandStats[brand] || 0) + 1;
        
        if (!brandSamples[brand]) {
          brandSamples[brand] = [];
        }
        if (brandSamples[brand].length < 3) {
          brandSamples[brand].push(product.name);
        }
      });

      results.tests.brands = {
        stats: brandStats,
        samples: brandSamples,
        availableBrands: PRODUCT_BRANDS.map(brand => ({
          value: brand.value,
          label: brand.label,
          count: brandStats[brand.value] || 0
        }))
      };
    }

    if (testType === 'all' || testType === 'prices') {
      // Test price ranges
      const priceRanges = {
        'under-10': 0,
        '10-25': 0,
        '25-50': 0,
        '50-100': 0,
        '100-200': 0,
        'over-200': 0
      };

      const priceSamples: { [key: string]: Array<{name: string, price: number}> } = {};

      products?.forEach(product => {
        const price = parseFloat(product.price) || 0;
        let range = 'over-200';
        
        if (price < 10) range = 'under-10';
        else if (price < 25) range = '10-25';
        else if (price < 50) range = '25-50';
        else if (price < 100) range = '50-100';
        else if (price < 200) range = '100-200';

        priceRanges[range as keyof typeof priceRanges]++;
        
        if (!priceSamples[range]) {
          priceSamples[range] = [];
        }
        if (priceSamples[range].length < 3) {
          priceSamples[range].push({ name: product.name, price });
        }
      });

      results.tests.prices = {
        ranges: priceRanges,
        samples: priceSamples,
        minPrice: Math.min(...(products?.map(p => parseFloat(p.price) || 0) || [0])),
        maxPrice: Math.max(...(products?.map(p => parseFloat(p.price) || 0) || [0]))
      };
    }

    if (testType === 'all' || testType === 'stock') {
      // Test stock filtering
      const inStock = products?.filter(p => (p.stock_quantity || 0) > 0).length || 0;
      const outOfStock = products?.filter(p => (p.stock_quantity || 0) <= 0).length || 0;

      results.tests.stock = {
        inStock,
        outOfStock,
        total: inStock + outOfStock,
        samples: {
          inStock: products?.filter(p => (p.stock_quantity || 0) > 0).slice(0, 3).map(p => ({
            name: p.name,
            stock: p.stock_quantity
          })) || [],
          outOfStock: products?.filter(p => (p.stock_quantity || 0) <= 0).slice(0, 3).map(p => ({
            name: p.name,
            stock: p.stock_quantity
          })) || []
        }
      };
    }

    if (testType === 'all' || testType === 'featured') {
      // Test featured filtering
      const featured = products?.filter(p => p.featured).length || 0;
      const notFeatured = products?.filter(p => !p.featured).length || 0;

      results.tests.featured = {
        featured,
        notFeatured,
        total: featured + notFeatured,
        samples: {
          featured: products?.filter(p => p.featured).slice(0, 3).map(p => p.name) || [],
          notFeatured: products?.filter(p => !p.featured).slice(0, 3).map(p => p.name) || []
        }
      };
    }

    if (testType === 'all' || testType === 'tags') {
      // Test tags filtering
      const allTags = new Set<string>();
      const tagStats: { [key: string]: number } = {};

      products?.forEach(product => {
        if (product.tags && Array.isArray(product.tags)) {
          product.tags.forEach(tag => {
            if (typeof tag === 'string') {
              allTags.add(tag);
              tagStats[tag] = (tagStats[tag] || 0) + 1;
            }
          });
        }
      });

      const topTags = Object.entries(tagStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

      results.tests.tags = {
        totalUniqueTags: allTags.size,
        topTags,
        productsWithTags: products?.filter(p => p.tags && p.tags.length > 0).length || 0
      };
    }

    if (testType === 'all' || testType === 'materials') {
      // Test materials filtering
      const allMaterials = new Set<string>();
      const materialStats: { [key: string]: number } = {};

      products?.forEach(product => {
        if (product.materials && Array.isArray(product.materials)) {
          product.materials.forEach(material => {
            if (typeof material === 'string') {
              allMaterials.add(material);
              materialStats[material] = (materialStats[material] || 0) + 1;
            }
          });
        }
      });

      const topMaterials = Object.entries(materialStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([material, count]) => ({ material, count }));

      results.tests.materials = {
        totalUniqueMaterials: allMaterials.size,
        topMaterials,
        productsWithMaterials: products?.filter(p => p.materials && p.materials.length > 0).length || 0
      };
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Filter test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Test specific filter combinations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, query } = body;

    // Simulate the same filtering logic as the main search API
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, brand_name, price, stock_quantity, featured, tags, materials')
      .eq('is_active', true)
      .eq('nicotine_product', false)
      .eq('tobacco_product', false)
      .limit(1000);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    let filteredProducts = products || [];

    // Apply search query if provided
    if (query && query.length >= 2) {
      const searchTerm = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        const detectedCategory = detectCategory(product.name);
        return detectedCategory === filters.category;
      });
    }

    // Apply brand filter
    if (filters.brand && filters.brand !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        const detectedBrand = detectBrand(product.name);
        return detectedBrand === filters.brand;
      });
    }

    // Apply price filters
    if (filters.priceMin !== undefined && filters.priceMin !== '') {
      const minPrice = parseFloat(filters.priceMin);
      filteredProducts = filteredProducts.filter(product => 
        parseFloat(product.price) >= minPrice
      );
    }

    if (filters.priceMax !== undefined && filters.priceMax !== '') {
      const maxPrice = parseFloat(filters.priceMax);
      filteredProducts = filteredProducts.filter(product => 
        parseFloat(product.price) <= maxPrice
      );
    }

    // Apply stock status filter
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        const stockQty = product.stock_quantity || 0;

        switch (filters.stockStatus) {
          case 'in-stock':
            return stockQty > 0;
          case 'out-of-stock':
            return stockQty <= 0;
          case 'low-stock':
            return stockQty > 0 && stockQty <= 5;
          case 'high-stock':
            return stockQty >= 20;
          default:
            return true;
        }
      });
    }

    // Apply featured filter
    if (filters.featured) {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    return NextResponse.json({
      originalCount: products?.length || 0,
      filteredCount: filteredProducts.length,
      filters: filters,
      query: query,
      samples: filteredProducts.slice(0, 10).map(p => ({
        name: p.name,
        price: p.price,
        category: detectCategory(p.name),
        brand: detectBrand(p.name),
        featured: p.featured,
        stock: p.stock_quantity
      }))
    });

  } catch (error) {
    console.error('Filter combination test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
