import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('[Airtable Test] Testing connection to SigDistro table');
    
    const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_ID || process.env.AIRTABLE_TABLE_NAME || 'SigDistro';

    if (!airtablePAT || !airtableBaseId) {
      return NextResponse.json({
        error: 'Missing Airtable configuration',
        required_env_vars: [
          'AIRTABLE_PERSONAL_ACCESS_TOKEN',
          'AIRTABLE_BASE_ID',
          'AIRTABLE_TABLE_NAME (optional, defaults to SigDistro)'
        ],
        current_config: {
          pat_set: !!airtablePAT,
          base_id_set: !!airtableBaseId,
          table_name: airtableTableName
        }
      }, { status: 400 });
    }

    // Test connection by fetching first 3 records
    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?maxRecords=3`;
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `Airtable API error: ${response.status}`,
        details: errorText,
        url: airtableUrl.replace(airtablePAT, '[REDACTED]')
      }, { status: response.status });
    }

    const data = await response.json();
    const records = data.records || [];

    // Analyze field structure
    const fieldAnalysis: any = {};
    const sampleData: any[] = [];

    records.forEach((record: any, index: number) => {
      const fields = record.fields || {};
      
      // Add to sample data (first 2 records only)
      if (index < 2) {
        sampleData.push({
          record_id: record.id,
          fields: fields
        });
      }

      // Analyze field types and presence
      Object.keys(fields).forEach(fieldName => {
        if (!fieldAnalysis[fieldName]) {
          fieldAnalysis[fieldName] = {
            present_in_records: 0,
            sample_values: [],
            data_types: new Set()
          };
        }
        
        fieldAnalysis[fieldName].present_in_records++;
        
        const value = fields[fieldName];
        const valueType = Array.isArray(value) ? 'array' : typeof value;
        fieldAnalysis[fieldName].data_types.add(valueType);
        
        // Add sample values (max 3 per field)
        if (fieldAnalysis[fieldName].sample_values.length < 3 && value !== null && value !== undefined) {
          fieldAnalysis[fieldName].sample_values.push(value);
        }
      });
    });

    // Convert Sets to Arrays for JSON serialization
    Object.keys(fieldAnalysis).forEach(fieldName => {
      fieldAnalysis[fieldName].data_types = Array.from(fieldAnalysis[fieldName].data_types);
    });

    // Identify potential matching fields
    const potentialMatchingFields = {
      sku_fields: Object.keys(fieldAnalysis).filter(field => 
        field.toLowerCase().includes('sku') || 
        field.toLowerCase().includes('code') ||
        field.toLowerCase().includes('id')
      ),
      name_fields: Object.keys(fieldAnalysis).filter(field => 
        field.toLowerCase().includes('name') || 
        field.toLowerCase().includes('title') ||
        field.toLowerCase().includes('product')
      ),
      image_fields: Object.keys(fieldAnalysis).filter(field => 
        field.toLowerCase().includes('image') || 
        field.toLowerCase().includes('photo') ||
        field.toLowerCase().includes('picture')
      ),
      description_fields: Object.keys(fieldAnalysis).filter(field => 
        field.toLowerCase().includes('description') || 
        field.toLowerCase().includes('detail') ||
        field.toLowerCase().includes('notes')
      )
    };

    return NextResponse.json({
      success: true,
      connection_status: 'Connected successfully',
      table_info: {
        base_id: airtableBaseId,
        table_name: airtableTableName,
        records_tested: records.length
      },
      field_analysis: fieldAnalysis,
      potential_matching_fields: potentialMatchingFields,
      sample_data: sampleData,
      recommendations: {
        next_steps: [
          'Review the field_analysis to identify the correct field names for your data',
          'Update the sync endpoint field mappings if needed',
          'Run the sync endpoint to match Airtable data with Supabase products'
        ],
        matching_strategy: 'The sync will try to match by SKU first, then by product name'
      }
    });

  } catch (error) {
    console.error('[Airtable Test] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
