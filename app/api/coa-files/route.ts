import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Direct Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get query parameters
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('search') || '';
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // List files from the COA storage bucket
    // Note: You'll need to create a dedicated bucket for COA files in Supabase Storage
    // Bucket name should be something like 'coa-files'
    const { data: files, error } = await supabase.storage
      .from('coa-files') // Replace with your actual bucket name
      .list('', {
        limit: limit,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error fetching COA files:', error);
      // Return empty array if bucket doesn't exist yet or has no files
      return NextResponse.json({
        coaFiles: [],
        message: 'COA files will be displayed here once uploaded to Supabase storage'
      });
    }

    // Filter files by search query if provided
    let filteredFiles = files || [];

    if (searchQuery) {
      filteredFiles = filteredFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Transform files to match the expected COA format
    const coaFiles = filteredFiles.map(file => {
      // Parse filename to extract product info
      // Expected format: PRODUCT-SKU-COA.pdf or similar
      const fileName = file.name.replace('.pdf', '').replace('.PDF', '');
      const parts = fileName.split('-');

      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('coa-files')
        .getPublicUrl(file.name);

      return {
        id: file.id || file.name,
        product_name: parts.slice(0, -2).join(' ') || 'Unknown Product',
        product_sku: parts[parts.length - 2] || file.name,
        brand_name: 'Highway 420', // Default brand, could be extracted from filename
        lab_name: parts[parts.length - 1] || 'Third-Party Lab',
        test_date: file.created_at ? new Date(file.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        file_url: publicUrl,
        file_name: file.name,
        created_at: file.created_at || new Date().toISOString()
      };
    });

    return NextResponse.json({
      coaFiles,
      total: coaFiles.length,
      message: coaFiles.length > 0 ? 'COA files loaded successfully' : 'No COA files found. Upload files to your Supabase storage bucket to display them here.'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch COA files',
      details: String(error)
    }, { status: 500 });
  }
}
