import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    console.log('[AI Migration Planner] Creating intelligent migration strategy');

    // Use the data analysis we already have
    const dataAnalysis = {
      supabase_critical_gaps: {
        image_url: "0.0% complete - CRITICAL",
        short_description: "0.0% complete - CRITICAL", 
        description_md: "0.0% complete - CRITICAL"
      },
      supabase_complete_fields: {
        name: "100% complete",
        sku: "100% complete", 
        price: "100% complete",
        description: "100% complete (but basic)"
      },
      airtable_available_data: {
        Images: "90% completion rate - Direct URLs",
        "Short description": "10% completion rate - HTML content",
        Description: "10% completion rate - Rich HTML content",
        SKU: "90% completion rate - Perfect match key",
        "Regular price": "100% completion rate - Validation field",
        Name: "100% completion rate - Validation field"
      },
      sample_airtable_data: {
        sku_example: "RG231-Purple",
        image_example: "https://sigdistro.com/wp-content/uploads/2024/01/Colored-Accents-Beaker-Water-Pipe-Ref-RG-231-1.png",
        short_desc_example: "Glass hand pipe with Petals patterned from mouthpiece and up the stem.\\n\\nPACK QTY: 2 PCS\\n\\nLength: 3.5\"",
        full_desc_example: "Embark on a journey of elevated smoking pleasure with our superior hand pipes..."
      },
      total_products: 4579
    };

    const aiPrompt = `
You are a senior data migration architect specializing in e-commerce product databases. 

CURRENT SITUATION:
- Supabase has 4,579 products with complete basic data (name, SKU, price) but missing critical fields
- Airtable SigDistro has rich product data including images and descriptions
- Need to migrate: image_url, short_description, description_md from Airtable to Supabase

DATA ANALYSIS:
${JSON.stringify(dataAnalysis, null, 2)}

REQUIREMENTS:
1. Create a safe, reliable migration strategy
2. Handle data quality issues (missing SKUs, HTML cleanup)
3. Provide rollback capability
4. Minimize risk with batch processing
5. Validate data integrity during migration

Please provide a detailed migration plan in JSON format:

{
  "migration_strategy": {
    "primary_matching": "field_name_and_confidence_level",
    "secondary_matching": "fallback_strategy",
    "data_validation": ["validation_checks"]
  },
  "field_mappings": {
    "image_url": {
      "source": "airtable_field_name",
      "transformation": "any_needed_processing",
      "validation": "validation_rule"
    },
    "short_description": {
      "source": "airtable_field_name", 
      "transformation": "html_cleanup_etc",
      "validation": "validation_rule"
    },
    "description_md": {
      "source": "airtable_field_name",
      "transformation": "html_to_markdown_etc", 
      "validation": "validation_rule"
    }
  },
  "risk_mitigation": {
    "batch_size": "recommended_number",
    "rollback_strategy": "how_to_undo_changes",
    "validation_checks": ["pre_migration_checks"],
    "error_handling": "strategy_for_failures"
  },
  "execution_plan": {
    "phase_1": "description_and_steps",
    "phase_2": "description_and_steps", 
    "phase_3": "description_and_steps"
  },
  "success_metrics": {
    "target_completion_rates": "expected_percentages",
    "quality_indicators": ["what_to_measure"],
    "rollback_triggers": ["when_to_stop_migration"]
  },
  "estimated_outcomes": {
    "expected_matches": "percentage",
    "data_quality_improvement": "description",
    "potential_issues": ["list_of_concerns"]
  }
}

Focus on practical, implementable solutions with specific technical details.
`;

    console.log('[AI Migration Planner] Consulting OpenAI for migration strategy...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior data migration architect with expertise in e-commerce product databases, data quality, and risk management. Provide detailed, actionable migration strategies in valid JSON format with specific technical implementation details."
        },
        {
          role: "user",
          content: aiPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2500
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    // Parse AI response
    let migrationPlan;
    try {
      migrationPlan = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('[AI Migration Planner] Failed to parse AI response:', aiResponse);
      // Return the raw response if JSON parsing fails
      return NextResponse.json({
        success: true,
        raw_ai_response: aiResponse,
        parsing_error: 'Could not parse as JSON, but AI provided detailed plan',
        timestamp: new Date().toISOString()
      });
    }

    console.log('[AI Migration Planner] AI migration plan created successfully');

    return NextResponse.json({
      success: true,
      ai_migration_plan: migrationPlan,
      data_context: dataAnalysis,
      implementation_ready: true,
      next_action: "Review the AI plan and create implementation endpoint",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[AI Migration Planner] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'AI Migration Planner',
    description: 'Uses OpenAI to create intelligent migration strategy based on data analysis',
    method: 'POST',
    features: [
      'Analyzes existing data gaps and opportunities',
      'Creates field mapping strategy',
      'Provides risk mitigation plan',
      'Recommends batch processing approach',
      'Includes rollback and validation strategies'
    ]
  });
}
