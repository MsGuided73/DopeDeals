import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { transformCSVProduct, findMatchingProduct, importProductsBatch } from '../../../lib/csv-import-engine';

/**
 * CSV PRODUCT IMPORT ENDPOINT
 * Imports products from sigdistro CSV with rich data including images, descriptions, pricing
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('csvFile') as File;

    if (!file) {
      return NextResponse.json({
        error: 'No CSV file provided',
        usage: 'Include a CSV file in the "csvFile" form field'
      }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({
        error: 'Invalid file type',
        message: 'Please upload a CSV file'
      }, { status: 400 });
    }

    console.log(`[CSV Import] Starting import of file: ${file.name} (${file.size} bytes)`);

    // Parse CSV file
    const csvText = await file.text();
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        return header.toLowerCase().replace(/[^a-z0-9]/g, '_');
      }
    });

    if (parseResult.errors.length > 0) {
      console.error('[CSV Import] CSV parsing errors:', parseResult.errors);
      return NextResponse.json({
        error: 'CSV parsing errors',
        details: parseResult.errors.slice(0, 10) // Limit error details
      }, { status: 400 });
    }

    const csvProducts = parseResult.data;
    console.log(`[CSV Import] Parsed ${csvProducts.length} products from CSV`);

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process and import products
    const importResults = await processAndImportProducts(csvProducts, supabase);

    return NextResponse.json({
      success: true,
      message: 'CSV import completed successfully',
      results: importResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[CSV Import] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Import failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Process CSV products and import them to Supabase
 */
async function processAndImportProducts(csvProducts: any[], supabase: any) {
  const results = {
    total: csvProducts.length,
    processed: 0,
    imported: 0,
    updated: 0,
    failed: 0,
    errors: [] as string[],
    batches: [] as any[]
  };

  // Filter out non-product rows (like headers or invalid data)
  const validProducts = csvProducts.filter(product =>
    product.name &&
    product.name.trim().length > 0 &&
    product.type // Must have a type field
  );

  console.log(`[CSV Import] Found ${validProducts.length} valid products out of ${csvProducts.length} total rows`);

  // Process in batches of 25 products
  const batchSize = 25;
  for (let i = 0; i < validProducts.length; i += batchSize) {
    const batch = validProducts.slice(i, i + batchSize);
    console.log(`[CSV Import] Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} products)`);

    try {
      const batchResults = await importProductsBatch(batch, supabase);
      results.batches.push(batchResults);

      results.processed += batchResults.processed;
      results.imported += batchResults.imported;
      results.updated += batchResults.updated;
      results.failed += batchResults.failed;
      results.errors.push(...batchResults.errors);

      // Small delay between batches to avoid overwhelming the database
      if (i + batchSize < validProducts.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (batchError) {
      console.error(`[CSV Import] Batch ${Math.floor(i / batchSize) + 1} failed:`, batchError);
      results.failed += batch.length;
      results.errors.push(`Batch ${Math.floor(i / batchSize) + 1} failed: ${batchError}`);
    }
  }

  console.log(`[CSV Import] Import completed:`, results);
  return results;
}

// GET endpoint for import status and testing
export async function GET() {
  return NextResponse.json({
    message: 'CSV Product Import API',
    usage: 'POST with CSV file in "csvFile" form field',
    features: [
      'Automatic product matching with Zoho data',
      'Image URL extraction and storage',
      'Rich description processing',
      'Category and tag mapping',
      'Attribute extraction',
      'SEO data generation',
      'Batch processing with progress tracking'
    ],
    expectedFormat: {
      columns: [
        'id', 'type', 'name', 'description', 'regular_price',
        'sale_price', 'categories', 'tags', 'images'
      ],
      example: {
        id: '14',
        type: 'variable',
        name: '-Limited Edition- Engraved Beaker |REF: SQ-01|',
        description: 'HTML description with specifications',
        regular_price: '35',
        categories: 'Smoking Pipes > Glass Water Pipes',
        tags: 'Beakers, Engraved, Water Pipes',
        images: 'https://sigdistro.com/wp-content/uploads/2021/12/SQ-1.png'
      }
    }
  });
}
