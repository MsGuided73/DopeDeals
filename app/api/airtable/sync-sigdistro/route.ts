import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    console.log('[Airtable SigDistro Sync] Starting sync from Airtable to Supabase');
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_ID || process.env.AIRTABLE_TABLE_NAME || 'SigDistro';

    if (!airtablePAT || !airtableBaseId) {
      return NextResponse.json({
        error: 'Missing Airtable configuration. Please set AIRTABLE_API_KEY (Personal Access Token) and AIRTABLE_BASE_ID environment variables.'
      }, { status: 400 });
    }

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
      matches: [] as any[],
      timestamp: new Date().toISOString()
    };

    // Get all records from Airtable SigDistro table
    let allRecords: any[] = [];
    let offset = '';
    
    do {
      const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}${offset ? `?offset=${offset}` : ''}`;
      
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
      allRecords = allRecords.concat(data.records || []);
      offset = data.offset || '';
      
      console.log(`[Airtable SigDistro Sync] Fetched ${data.records?.length || 0} records, total: ${allRecords.length}`);
      
    } while (offset);

    console.log(`[Airtable SigDistro Sync] Total Airtable records: ${allRecords.length}`);

    // Process each Airtable record
    for (const record of allRecords) {
      try {
        const fields = record.fields;
        
        // Extract key fields for matching (adjust field names based on your Airtable structure)
        const sku = fields.SKU || fields.sku || fields['Product Code'] || fields.Code;
        const name = fields.Name || fields['Product Name'] || fields.Title;
        const description = fields.Description || fields.Details;
        const imageUrl = fields.Image || fields['Image URL'] || fields.Photo;
        const category = fields.Category || fields.Type;
        const brand = fields.Brand || fields.Manufacturer;
        const price = fields.Price || fields.Cost || fields.MSRP;

        if (!sku && !name) {
          results.skipped++;
          continue; // Skip records without identifiable information
        }

        // Try to find matching product in Supabase by SKU first, then by name
        let matchingProduct = null;
        
        if (sku) {
          const { data: skuMatch } = await supabase
            .from('products')
            .select('id, name, sku')
            .eq('sku', sku)
            .single();
          matchingProduct = skuMatch;
        }

        if (!matchingProduct && name) {
          const { data: nameMatch } = await supabase
            .from('products')
            .select('id, name, sku')
            .ilike('name', `%${name}%`)
            .limit(1)
            .single();
          matchingProduct = nameMatch;
        }

        if (!matchingProduct) {
          results.skipped++;
          console.log(`[Airtable SigDistro Sync] No match found for SKU: ${sku}, Name: ${name}`);
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

        // Update the matching product in Supabase
        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', matchingProduct.id)
          .select('id, name, sku, image_url, category, brand')
          .single();

        if (error) {
          results.failed++;
          results.errors.push(`Failed to update product ${matchingProduct.id}: ${error.message}`);
          console.error(`[Airtable SigDistro Sync] Update error:`, error);
        } else {
          results.success++;
          results.matches.push({
            airtable_record_id: record.id,
            supabase_product_id: matchingProduct.id,
            matched_by: sku ? 'SKU' : 'Name',
            updated_fields: Object.keys(updateData).filter(key => key !== 'updated_at')
          });
          console.log(`[Airtable SigDistro Sync] Updated product: ${updatedProduct.name}`);
        }

      } catch (recordError) {
        results.failed++;
        results.errors.push(`Record ${record.id}: ${recordError}`);
        console.error(`[Airtable SigDistro Sync] Failed to process record:`, recordError);
      }
    }

    console.log(`[Airtable SigDistro Sync] Completed: ${results.success} success, ${results.failed} failed, ${results.skipped} skipped`);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total_airtable_records: allRecords.length,
        successful_matches: results.success,
        failed_updates: results.failed,
        skipped_records: results.skipped,
        match_rate: `${((results.success / allRecords.length) * 100).toFixed(1)}%`
      }
    });

  } catch (error) {
    console.error('[Airtable SigDistro Sync] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Airtable SigDistro Sync',
    description: 'Syncs product data from Airtable SigDistro table to existing Supabase products',
    method: 'POST',
    required_env_vars: [
      'AIRTABLE_API_KEY',
      'AIRTABLE_BASE_ID',
      'AIRTABLE_TABLE_NAME (optional, defaults to SigDistro)'
    ]
  });
}
