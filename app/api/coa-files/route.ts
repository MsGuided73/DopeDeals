import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { STATIC_COA_DATA } from '../../../lib/coa-data';
import { applyRestrictedProductFilter } from '../../../lib/compliance-filters';

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('search') || '';
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let allCoas: any[] = [...STATIC_COA_DATA];

    // 1. Try fetching from lab_certificates table (structured data)
    try {
      let query = supabase
        .from('lab_certificates')
        .select(`
          id,
          batch_number,
          lab_name,
          tested_at,
          url,
          product:product_id (
            name,
            sku,
            brand:brand_id (name),
            category:category_id (name)
          )
        `)
        .limit(limit);

      const { data: certs, error: certError } = await query;

      if (!certError && certs) {
        certs.forEach((cert: any) => {
          const product = Array.isArray(cert.product) ? cert.product[0] : cert.product;
          const brand = product && Array.isArray(product.brand) ? product.brand[0] : product?.brand;
          const category = product && Array.isArray(product.category) ? product.category[0] : product?.category;

          allCoas.push({
            id: cert.id,
            product_name: product?.name || 'Unknown Product',
            product_sku: cert.batch_number || product?.sku || 'N/A',
            brand_name: brand?.name || 'Highway 420',
            category_name: category?.name || 'General',
            lab_name: cert.lab_name || 'Third-Party Lab',
            test_date: cert.tested_at,
            file_url: cert.url,
            file_name: `COA-${cert.batch_number}.pdf`,
            created_at: cert.tested_at
          });
        });
      }
    } catch (e) {
      console.warn('Error fetching lab_certificates:', e);
    }

    // 2. Try fetching from main_site_products (compliance_info.lab_certificate_url)
    // Filter for active products and exclude prohibited substances
    try {
      let query = supabase
        .from('main_site_products')
        .select('id, name, sku, brand_name, categories, compliance_info, updated_at')
        .eq('is_active', true)
        .not('compliance_info->lab_certificate_url', 'is', null);

      // Apply centralized compliance filters
      query = applyRestrictedProductFilter(query);

      query = query.limit(500); // Increase limit to show all active COAs

      const { data: prods, error: prodError } = await query;

      if (!prodError && prods) {
        prods.forEach(p => {
          const info = p.compliance_info;
          if (info && info.lab_certificate_url) {
            // Ensure brand_name and category_name are strings for proper grouping
            const brandStr = Array.isArray(p.brand_name) ? p.brand_name[0] : (p.brand_name || 'Highway 420');
            const catStr = Array.isArray(p.categories) ? p.categories[0] : (p.categories || 'General');

            allCoas.push({
              id: `prod-${p.id}`,
              product_name: p.name,
              product_sku: p.sku,
              brand_name: String(brandStr),
              category_name: String(catStr),
              lab_name: info.lab_name || 'Third-Party Lab',
              test_date: info.coa_date || info.test_date || p.updated_at,
              file_url: info.lab_certificate_url,
              file_name: `${p.sku}-COA.pdf`,
              created_at: p.updated_at
            });
          }
        });
      }
    } catch (e) {
      console.warn('Error fetching products with COAs:', e);
    }

    // Filter by search query if provided
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      allCoas = allCoas.filter(coa => 
        coa.product_name.toLowerCase().includes(lowerQuery) ||
        (coa.product_sku && coa.product_sku.toLowerCase().includes(lowerQuery)) ||
        coa.brand_name.toLowerCase().includes(lowerQuery) ||
        coa.category_name.toLowerCase().includes(lowerQuery)
      );
    }

    // De-duplicate by URL
    const uniqueCoas = Array.from(new Map(allCoas.map(item => [item.file_url, item])).values());

    const response = NextResponse.json({
      coaFiles: uniqueCoas,
      total: uniqueCoas.length,
      message: uniqueCoas.length > 0 ? 'COA files loaded successfully' : 'No COA files found.'
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch COA files',
      details: String(error)
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
