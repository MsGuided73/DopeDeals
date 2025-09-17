import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('[Data Inventory] Starting comprehensive data analysis');
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_ID;

    const analysis = {
      timestamp: new Date().toISOString(),
      supabase_analysis: {},
      airtable_analysis: {},
      recommendations: [],
      next_steps: []
    };

    // === SUPABASE ANALYSIS ===
    console.log('[Data Inventory] Analyzing Supabase products table...');
    
    // Get total product count
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Get sample products to understand structure
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('*')
      .limit(5);

    // Analyze field completeness
    const fieldCompleteness: any = {};
    if (sampleProducts && sampleProducts.length > 0) {
      const fields = Object.keys(sampleProducts[0]);
      
      for (const field of fields) {
        const { count: nonNullCount } = await supabase
          .from('products')
          .select(field, { count: 'exact', head: true })
          .not(field, 'is', null);
        
        fieldCompleteness[field] = {
          total_records: totalProducts,
          populated_records: nonNullCount,
          completion_rate: totalProducts ? ((nonNullCount || 0) / totalProducts * 100).toFixed(1) + '%' : '0%',
          sample_values: sampleProducts.map(p => p[field]).filter(v => v !== null).slice(0, 3)
        };
      }
    }

    analysis.supabase_analysis = {
      total_products: totalProducts,
      sample_structure: sampleProducts?.[0] ? Object.keys(sampleProducts[0]) : [],
      field_completeness: fieldCompleteness,
      sample_products: sampleProducts?.slice(0, 2) || []
    };

    // === AIRTABLE ANALYSIS ===
    if (airtablePAT && airtableBaseId && airtableTableName) {
      console.log('[Data Inventory] Analyzing Airtable SigDistro table...');
      
      try {
        // Get total record count first
        const countUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?maxRecords=1`;
        const countResponse = await fetch(countUrl, {
          headers: { 'Authorization': `Bearer ${airtablePAT}` }
        });
        
        if (countResponse.ok) {
          // Get sample records for analysis
          const sampleUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?maxRecords=10`;
          const sampleResponse = await fetch(sampleUrl, {
            headers: { 'Authorization': `Bearer ${airtablePAT}` }
          });
          
          if (sampleResponse.ok) {
            const sampleData = await sampleResponse.json();
            const records = sampleData.records || [];
            
            // Analyze field structure
            const fieldAnalysis: any = {};
            records.forEach((record: any) => {
              Object.keys(record.fields || {}).forEach(fieldName => {
                if (!fieldAnalysis[fieldName]) {
                  fieldAnalysis[fieldName] = {
                    present_in_records: 0,
                    sample_values: [],
                    data_types: new Set()
                  };
                }
                
                const value = record.fields[fieldName];
                fieldAnalysis[fieldName].present_in_records++;
                fieldAnalysis[fieldName].data_types.add(Array.isArray(value) ? 'array' : typeof value);
                
                if (fieldAnalysis[fieldName].sample_values.length < 3 && value !== null && value !== undefined) {
                  fieldAnalysis[fieldName].sample_values.push(value);
                }
              });
            });

            // Convert Sets to Arrays
            Object.keys(fieldAnalysis).forEach(field => {
              fieldAnalysis[field].data_types = Array.from(fieldAnalysis[field].data_types);
              fieldAnalysis[field].completion_rate = `${((fieldAnalysis[field].present_in_records / records.length) * 100).toFixed(1)}%`;
            });

            analysis.airtable_analysis = {
              connection_status: 'Connected',
              sample_record_count: records.length,
              available_fields: Object.keys(fieldAnalysis),
              field_analysis: fieldAnalysis,
              sample_records: records.slice(0, 2).map(r => ({
                id: r.id,
                fields: r.fields
              }))
            };
          } else {
            analysis.airtable_analysis = {
              connection_status: 'Failed to fetch sample data',
              error: `HTTP ${sampleResponse.status}`
            };
          }
        } else {
          analysis.airtable_analysis = {
            connection_status: 'Failed to connect',
            error: `HTTP ${countResponse.status}`
          };
        }
      } catch (airtableError) {
        analysis.airtable_analysis = {
          connection_status: 'Error',
          error: airtableError instanceof Error ? airtableError.message : 'Unknown error'
        };
      }
    } else {
      analysis.airtable_analysis = {
        connection_status: 'Not configured',
        missing_env_vars: [
          !airtablePAT && 'AIRTABLE_PERSONAL_ACCESS_TOKEN',
          !airtableBaseId && 'AIRTABLE_BASE_ID',
          !airtableTableName && 'AIRTABLE_TABLE_ID'
        ].filter(Boolean)
      };
    }

    // === GENERATE RECOMMENDATIONS ===
    console.log('[Data Inventory] Generating recommendations...');
    
    // Check for critical missing fields in Supabase
    const criticalFields = ['image_url', 'description'];
    criticalFields.forEach(field => {
      const completion = fieldCompleteness[field];
      if (completion && parseFloat(completion.completion_rate) < 10) {
        analysis.recommendations.push({
          priority: 'HIGH',
          category: 'Data Quality',
          issue: `${field} field is ${completion.completion_rate} complete`,
          recommendation: `This field needs to be populated from Airtable data`
        });
      }
    });

    // Check Airtable connection
    if (analysis.airtable_analysis.connection_status !== 'Connected') {
      analysis.recommendations.push({
        priority: 'HIGH',
        category: 'Configuration',
        issue: 'Airtable connection not working',
        recommendation: 'Fix Airtable configuration before attempting migration'
      });
    }

    // Generate next steps
    analysis.next_steps = [
      '1. Review the field completeness analysis for Supabase',
      '2. Examine Airtable field structure and identify mapping candidates',
      '3. Create field mapping strategy (SKU matching, name matching, etc.)',
      '4. Design data transformation rules',
      '5. Plan migration in small batches with rollback capability',
      '6. Test migration with 10-20 records first'
    ];

    console.log('[Data Inventory] Analysis completed');

    return NextResponse.json({
      success: true,
      analysis,
      summary: {
        supabase_products: totalProducts,
        airtable_status: analysis.airtable_analysis.connection_status,
        critical_recommendations: analysis.recommendations.filter(r => r.priority === 'HIGH').length,
        ready_for_migration: analysis.airtable_analysis.connection_status === 'Connected' && analysis.recommendations.filter(r => r.priority === 'HIGH' && r.category === 'Configuration').length === 0
      }
    });

  } catch (error) {
    console.error('[Data Inventory] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
