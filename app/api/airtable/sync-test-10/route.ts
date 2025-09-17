import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    console.log('[Airtable Test 10 Sync] Starting limited sync of first 10 records');
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_ID || process.env.AIRTABLE_TABLE_NAME || 'SigDistro';

    if (!airtablePAT || !airtableBaseId) {
      return NextResponse.json({ 
        error: 'Missing Airtable configuration. Please set AIRTABLE_PERSONAL_ACCESS_TOKEN and AIRTABLE_BASE_ID environment variables.' 
      }, { status: 400 });
    }

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
      matches: [] as any[],
      airtable_records: [] as any[],
      timestamp: new Date().toISOString()
    };

    // Get first 10 records from Airtable
    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?maxRecords=10`;
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const records = data.records || [];

    console.log(`[Airtable Test 10 Sync] Fetched ${records.length} records from Airtable`);

    // Process each Airtable record
    for (const record of records) {
      try {
        const fields = record.fields;
        
        // Store the raw Airtable record for debugging
        results.airtable_records.push({
          record_id: record.id,
          fields: fields
        });
        
        // Extract key fields for matching
        const sku = fields.SKU || fields.sku || fields['Product Code'] || fields.Code;
        const name = fields.Name || fields['Product Name'] || fields.Title;
        const description = fields.Description || fields.Details;
        const imageUrl = fields.Images || fields.Image || fields['Image URL'] || fields.Photo;
        const category = fields.Category || fields.Type;
        const brand = fields.Brand || fields.Manufacturer;
        const price = fields['Regular price'] || fields.Price || fields.Cost || fields.MSRP;

        console.log(`[Airtable Test 10 Sync] Processing: SKU=${sku}, Name=${name}`);

        if (!sku && !name) {
          results.skipped++;
          console.log(`[Airtable Test 10 Sync] Skipping record - no SKU or name`);
          continue;
        }

        // Try to find matching product in Supabase by SKU first, then by name
        let matchingProduct = null;
        
        if (sku) {
          const { data: skuMatch } = await supabase
            .from('products')
            .select('id, name, sku, image_url')
            .eq('sku', sku)
            .single();
          matchingProduct = skuMatch;
          console.log(`[Airtable Test 10 Sync] SKU match for ${sku}:`, !!matchingProduct);
        }

        if (!matchingProduct && name) {
          const { data: nameMatch } = await supabase
            .from('products')
            .select('id, name, sku, image_url')
            .ilike('name', `%${name}%`)
            .limit(1)
            .single();
          matchingProduct = nameMatch;
          console.log(`[Airtable Test 10 Sync] Name match for "${name}":`, !!matchingProduct);
        }

        if (!matchingProduct) {
          results.skipped++;
          console.log(`[Airtable Test 10 Sync] No match found for SKU: ${sku}, Name: ${name}`);
          continue;
        }

        // Prepare update data
        const updateData: any = {
          updated_at: new Date().toISOString()
        };

        // Only update fields that have values in Airtable
        if (description && description.trim()) {
          updateData.description = description.trim();
        }
        
        if (imageUrl && imageUrl.trim()) {
          updateData.image_url = imageUrl.trim();
          console.log(`[Airtable Test 10 Sync] Setting image_url: ${imageUrl.trim()}`);
        }
        
        if (category && category.trim()) {
          updateData.category = category.trim();
        }
        
        if (brand && brand.trim()) {
          updateData.brand = brand.trim();
        }
        
        if (price && !isNaN(parseFloat(price))) {
          updateData.price = parseFloat(price);
        }

        console.log(`[Airtable Test 10 Sync] Updating product ${matchingProduct.id} with:`, Object.keys(updateData));

        // Update the matching product in Supabase
        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', matchingProduct.id)
          .select('id, name, sku, image_url, category, brand, price')
          .single();

        if (error) {
          results.failed++;
          results.errors.push(`Failed to update product ${matchingProduct.id}: ${error.message}`);
          console.error(`[Airtable Test 10 Sync] Update error:`, error);
        } else {
          results.success++;
          results.matches.push({
            airtable_record_id: record.id,
            supabase_product_id: matchingProduct.id,
            matched_by: sku ? 'SKU' : 'Name',
            updated_fields: Object.keys(updateData).filter(key => key !== 'updated_at'),
            before: {
              name: matchingProduct.name,
              sku: matchingProduct.sku,
              image_url: matchingProduct.image_url
            },
            after: {
              name: updatedProduct.name,
              sku: updatedProduct.sku,
              image_url: updatedProduct.image_url
            }
          });
          console.log(`[Airtable Test 10 Sync] Successfully updated: ${updatedProduct.name}`);
        }

      } catch (recordError) {
        results.failed++;
        results.errors.push(`Record ${record.id}: ${recordError}`);
        console.error(`[Airtable Test 10 Sync] Failed to process record:`, recordError);
      }
    }

    console.log(`[Airtable Test 10 Sync] Completed: ${results.success} success, ${results.failed} failed, ${results.skipped} skipped`);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total_airtable_records: records.length,
        successful_matches: results.success,
        failed_updates: results.failed,
        skipped_records: results.skipped,
        match_rate: `${((results.success / records.length) * 100).toFixed(1)}%`
      }
    });

  } catch (error) {
    console.error('[Airtable Test 10 Sync] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Airtable Test 10 Sync',
    description: 'Syncs first 10 product records from Airtable SigDistro table to existing Supabase products',
    method: 'POST',
    features: [
      'Limited to 10 records for testing',
      'Detailed logging and debugging',
      'Shows before/after comparison',
      'Returns raw Airtable data for analysis'
    ]
  });
}
