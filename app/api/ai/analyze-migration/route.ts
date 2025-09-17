import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    console.log('[AI Migration Analyzer] Starting intelligent data analysis with live database access');

    // Get credentials from .env.local
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_ID;

    console.log('[AI Migration Analyzer] Credentials loaded:', {
      supabase_configured: !!supabaseUrl && !!supabaseKey,
      airtable_configured: !!airtablePAT && !!airtableBaseId && !!airtableTableName
    });

    if (!airtablePAT || !airtableBaseId || !airtableTableName) {
      return NextResponse.json({
        error: 'Missing Airtable configuration',
        missing: {
          pat: !airtablePAT,
          base_id: !airtableBaseId,
          table_id: !airtableTableName
        }
      }, { status: 400 });
    }

    // === COMPREHENSIVE SUPABASE ANALYSIS ===
    console.log('[AI Migration Analyzer] Performing comprehensive Supabase analysis...');

    // Get total product count
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Get sample products for structure analysis
    const { data: supabaseProducts } = await supabase
      .from('products')
      .select('*')
      .limit(5);

    // Analyze field completeness for all fields
    const supabaseSchema = supabaseProducts?.[0] ? Object.keys(supabaseProducts[0]) : [];
    const fieldCompleteness: any = {};

    for (const field of supabaseSchema) {
      const { count: nonNullCount } = await supabase
        .from('products')
        .select(field, { count: 'exact', head: true })
        .not(field, 'is', null)
        .neq(field, '');

      fieldCompleteness[field] = {
        total_records: totalProducts,
        populated_records: nonNullCount || 0,
        completion_rate: totalProducts ? ((nonNullCount || 0) / totalProducts * 100).toFixed(1) + '%' : '0%',
        data_type: typeof supabaseProducts?.[0]?.[field],
        sample_value: supabaseProducts?.[0]?.[field]
      };
    }

    // === COMPREHENSIVE AIRTABLE ANALYSIS ===
    console.log('[AI Migration Analyzer] Performing comprehensive Airtable analysis...');
    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?maxRecords=20`;

    const airtableResponse = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtablePAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text();
      throw new Error(`Airtable API error: ${airtableResponse.status} - ${errorText}`);
    }

    const airtableData = await airtableResponse.json();
    const airtableRecords = airtableData.records || [];

    console.log(`[AI Migration Analyzer] Retrieved ${airtableRecords.length} Airtable records for analysis`);

    // Step 4: Analyze field structures
    const airtableFieldAnalysis: any = {};
    airtableRecords.forEach((record: any) => {
      Object.keys(record.fields || {}).forEach(fieldName => {
        if (!airtableFieldAnalysis[fieldName]) {
          airtableFieldAnalysis[fieldName] = {
            sample_values: [],
            data_types: new Set(),
            record_count: 0
          };
        }
        
        const value = record.fields[fieldName];
        airtableFieldAnalysis[fieldName].record_count++;
        airtableFieldAnalysis[fieldName].data_types.add(typeof value);
        
        if (airtableFieldAnalysis[fieldName].sample_values.length < 3 && value) {
          airtableFieldAnalysis[fieldName].sample_values.push(value);
        }
      });
    });

    // Convert Sets to Arrays for JSON serialization
    Object.keys(airtableFieldAnalysis).forEach(field => {
      airtableFieldAnalysis[field].data_types = Array.from(airtableFieldAnalysis[field].data_types);
    });

    // Step 5: Create AI prompt for analysis
    const aiPrompt = `
You are a data migration expert. Analyze the following database structures and determine the optimal migration strategy.

SUPABASE PRODUCTS TABLE SCHEMA:
${JSON.stringify(supabaseSchema, null, 2)}

SAMPLE SUPABASE PRODUCTS:
${JSON.stringify(supabaseProducts, null, 2)}

AIRTABLE FIELD ANALYSIS:
${JSON.stringify(airtableFieldAnalysis, null, 2)}

SAMPLE AIRTABLE RECORDS:
${JSON.stringify(airtableRecords.slice(0, 3), null, 2)}

MIGRATION REQUIREMENTS:
1. Map image_url field correctly
2. Map detailed description field
3. Map short description field
4. Identify best matching strategy (SKU, name, etc.)
5. Handle data type conversions
6. Identify potential data quality issues

Please provide a detailed migration strategy in JSON format with:
{
  "field_mappings": {
    "image_url": "recommended_airtable_field",
    "description": "recommended_airtable_field", 
    "short_description": "recommended_airtable_field"
  },
  "matching_strategy": {
    "primary": "field_name",
    "secondary": "field_name",
    "confidence": "high/medium/low"
  },
  "data_transformations": [
    {
      "field": "field_name",
      "transformation": "description",
      "reason": "explanation"
    }
  ],
  "potential_issues": [
    {
      "issue": "description",
      "severity": "high/medium/low",
      "recommendation": "solution"
    }
  ],
  "migration_plan": {
    "steps": ["step1", "step2", "step3"],
    "estimated_success_rate": "percentage",
    "recommended_batch_size": number
  }
}
`;

    console.log('[AI Migration Analyzer] Consulting OpenAI for migration strategy...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a database migration expert specializing in e-commerce product data. Provide detailed, actionable migration strategies in valid JSON format."
        },
        {
          role: "user",
          content: aiPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    // Parse AI response
    let migrationStrategy;
    try {
      migrationStrategy = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('[AI Migration Analyzer] Failed to parse AI response:', aiResponse);
      throw new Error('Invalid JSON response from AI');
    }

    console.log('[AI Migration Analyzer] AI analysis completed successfully');

    return NextResponse.json({
      success: true,
      analysis: {
        supabase_schema: supabaseSchema,
        supabase_sample_count: supabaseProducts?.length || 0,
        airtable_field_count: Object.keys(airtableFieldAnalysis).length,
        airtable_record_count: airtableRecords.length,
        field_analysis: airtableFieldAnalysis
      },
      ai_migration_strategy: migrationStrategy,
      raw_ai_response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[AI Migration Analyzer] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'AI Migration Analyzer',
    description: 'Uses OpenAI to analyze Airtable and Supabase data structures and recommend optimal migration strategy',
    method: 'POST',
    features: [
      'Analyzes both database schemas',
      'Identifies optimal field mappings',
      'Recommends matching strategies',
      'Detects potential data issues',
      'Provides step-by-step migration plan'
    ]
  });
}
