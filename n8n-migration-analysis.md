# n8n DopeDeals Migration Analysis Workflow

This document provides step-by-step instructions for building an n8n workflow to analyze your Airtable and Supabase data structures and create an intelligent migration plan using OpenAI.

## Overview

The workflow will:
- Analyze your Supabase products table structure and data completeness
- Examine your Airtable SigDistro table fields and sample data
- Use OpenAI to create intelligent field mappings and migration strategy
- Generate a detailed migration plan with specific recommendations

## Prerequisites

- n8n instance running
- Access to your DopeDeals Supabase database
- Access to your Airtable SigDistro base
- OpenAI API key

## Step 1: Create the Workflow

1. Open n8n and create a new workflow
2. Name it: `DopeDeals-Migration-Analysis`

## Step 2: Set Up Credentials

### Supabase Credential
- Go to Settings > Credentials > Add Credential
- Choose "HTTP Request Auth"
- Name: `Supabase-DopeDeals`
- Authentication: `Header Auth`
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY`

### Airtable Credential
- Add Credential > "Airtable API"
- Name: `Airtable-SigDistro`
- API Key: `YOUR_AIRTABLE_PERSONAL_ACCESS_TOKEN`

### OpenAI Credential
- Add Credential > "HTTP Request Auth"
- Name: `OpenAI-API`
- Authentication: `Header Auth`
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_OPENAI_API_KEY`

## Step 3: Build the Workflow Nodes

### Node 1: Manual Trigger
- Add "Manual Trigger" node
- This starts the workflow when you want to run the analysis

### Node 2: Get Supabase Sample Data
- Add "HTTP Request" node
- Name: `Get Supabase Sample`
- Method: `GET`
- URL: `https://YOUR_SUPABASE_URL/rest/v1/products?select=*&limit=5`
- Authentication: Use Supabase credential
- Headers:
```json
{
  "apikey": "YOUR_SUPABASE_ANON_KEY",
  "Content-Type": "application/json"
}
```

### Node 3: Get Supabase Record Count
- Add "HTTP Request" node
- Name: `Get Supabase Count`
- Method: `GET`
- URL: `https://YOUR_SUPABASE_URL/rest/v1/products?select=count&head=true`
- Authentication: Use Supabase credential
- Headers: Same as Node 2

### Node 4: Get Airtable Sample Data
- Add "Airtable" node
- Name: `Get Airtable Sample`
- Credential: Use Airtable credential
- Operation: `List`
- Base ID: `appB3KkAcoKu2tv4P`
- Table: `tblAVv84OmqHj8ckr`
- Limit: `10`

### Node 5: Format Data for AI Analysis
- Add "Code" node
- Name: `Prepare AI Analysis`
- Mode: `Run Once for All Items`
- JavaScript code:

```javascript
// Get data from previous nodes
const supabaseSample = $input.first().json;
const airtableSample = $input.all()[1].json;

// Analyze Supabase fields
const supabaseFields = {};
if (supabaseSample && supabaseSample.length > 0) {
  Object.keys(supabaseSample[0]).forEach(field => {
    supabaseFields[field] = {
      data_type: typeof supabaseSample[0][field],
      sample_value: supabaseSample[0][field]
    };
  });
}

// Analyze Airtable fields
const airtableFields = {};
if (airtableSample && airtableSample.records) {
  airtableSample.records.forEach(record => {
    Object.keys(record.fields || {}).forEach(fieldName => {
      if (!airtableFields[fieldName]) {
        airtableFields[fieldName] = {
          sample_values: [],
          data_types: new Set()
        };
      }
      const value = record.fields[fieldName];
      airtableFields[fieldName].data_types.add(typeof value);
      if (airtableFields[fieldName].sample_values.length < 2) {
        airtableFields[fieldName].sample_values.push(value);
      }
    });
  });
}

// Convert Sets to Arrays for JSON serialization
Object.keys(airtableFields).forEach(field => {
  airtableFields[field].data_types = Array.from(airtableFields[field].data_types);
});

// Create comprehensive AI prompt
const aiPrompt = `You are a data migration expert specializing in e-commerce product databases. 

Analyze these database structures and create a detailed migration strategy:

SUPABASE PRODUCTS TABLE (${supabaseSample?.length || 0} sample records):
${JSON.stringify(supabaseFields, null, 2)}

AIRTABLE SIGDISTRO FIELDS ANALYSIS:
${JSON.stringify(airtableFields, null, 2)}

MIGRATION REQUIREMENTS:
1. Map Airtable "Images" field to Supabase "image_url" field
2. Map Airtable description fields to Supabase "description" and "short_description" fields  
3. Identify the best matching strategy (SKU-based matching preferred)
4. Handle any necessary data transformations (HTML cleanup, URL validation, etc.)
5. Provide risk mitigation strategies

Please provide a detailed migration strategy in this exact JSON format:

{
  "field_mappings": {
    "image_url": {
      "source_field": "airtable_field_name",
      "transformation": "description_of_any_needed_processing",
      "confidence": "high/medium/low"
    },
    "description": {
      "source_field": "airtable_field_name", 
      "transformation": "description_of_any_needed_processing",
      "confidence": "high/medium/low"
    },
    "short_description": {
      "source_field": "airtable_field_name",
      "transformation": "description_of_any_needed_processing", 
      "confidence": "high/medium/low"
    }
  },
  "matching_strategy": {
    "primary_key": "field_name_for_matching",
    "fallback_strategy": "alternative_matching_method",
    "expected_match_rate": "percentage_estimate"
  },
  "data_transformations": [
    {
      "field": "field_name",
      "transformation": "detailed_description",
      "reason": "why_this_transformation_is_needed"
    }
  ],
  "migration_plan": {
    "phase_1": "description_and_steps",
    "phase_2": "description_and_steps",
    "phase_3": "description_and_steps"
  },
  "risk_mitigation": {
    "batch_size": "recommended_records_per_batch",
    "validation_checks": ["list_of_checks_to_perform"],
    "rollback_strategy": "how_to_undo_if_needed"
  },
  "success_metrics": {
    "target_completion_rates": "expected_field_completion_percentages",
    "quality_indicators": ["what_to_measure_for_success"]
  }
}`;

return [{
  json: {
    prompt: aiPrompt,
    supabase_analysis: supabaseFields,
    airtable_analysis: airtableFields,
    record_counts: {
      supabase_sample: supabaseSample?.length || 0,
      airtable_sample: airtableSample?.records?.length || 0
    }
  }
}];
```

### Node 6: OpenAI Migration Analysis
- Add "HTTP Request" node
- Name: `OpenAI Migration Analysis`
- Method: `POST`
- URL: `https://api.openai.com/v1/chat/completions`
- Authentication: Use OpenAI credential
- Body (JSON):

```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a senior database migration expert with extensive experience in e-commerce product data migrations. Provide detailed, actionable migration strategies in valid JSON format with specific technical implementation details."
    },
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "temperature": 0.1,
  "max_tokens": 3000
}
```

### Node 7: Parse and Format AI Response
- Add "Code" node
- Name: `Parse Migration Plan`
- JavaScript code:

```javascript
const aiResponse = $json.choices[0].message.content;

try {
  const migrationPlan = JSON.parse(aiResponse);
  
  return [{
    json: {
      success: true,
      migration_plan: migrationPlan,
      analysis_summary: {
        supabase_fields_analyzed: Object.keys($input.first().json.supabase_analysis).length,
        airtable_fields_analyzed: Object.keys($input.first().json.airtable_analysis).length,
        recommended_mappings: Object.keys(migrationPlan.field_mappings || {}).length,
        primary_matching_strategy: migrationPlan.matching_strategy?.primary_key || 'unknown'
      },
      raw_ai_response: aiResponse,
      timestamp: new Date().toISOString(),
      next_steps: [
        "Review the field mappings and validate they make sense",
        "Test the matching strategy with a small sample",
        "Implement the data transformations identified",
        "Create the migration execution workflow",
        "Run pilot migration with 10-20 records"
      ]
    }
  }];
} catch (error) {
  return [{
    json: {
      success: false,
      error: "Failed to parse AI response as JSON",
      raw_response: aiResponse,
      parsing_error: error.message,
      timestamp: new Date().toISOString(),
      recommendation: "Review the raw AI response and manually extract the migration strategy"
    }
  }];
}
```

## Step 4: Connect the Nodes

Connect the nodes in this sequence:
1. Manual Trigger → Get Supabase Sample
2. Get Supabase Sample → Get Supabase Count  
3. Get Supabase Count → Get Airtable Sample
4. Get Airtable Sample → Prepare AI Analysis
5. Prepare AI Analysis → OpenAI Migration Analysis
6. OpenAI Migration Analysis → Parse Migration Plan

## Step 5: Configure Your Specific Values

Replace these placeholders with your actual values:
- `YOUR_SUPABASE_URL`: Your Supabase project URL
- `YOUR_SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `YOUR_SUPABASE_ANON_KEY`: Your Supabase anon public key
- `YOUR_AIRTABLE_PERSONAL_ACCESS_TOKEN`: Your Airtable PAT
- `YOUR_OPENAI_API_KEY`: Your OpenAI API key

## Step 6: Test the Workflow

1. Save the workflow
2. Click "Execute Workflow" on the Manual Trigger
3. Monitor each node's execution and output
4. Check the final node for your AI-generated migration plan

## Expected Output

The workflow will produce:
- Detailed field mapping recommendations
- Matching strategy (likely SKU-based)
- Data transformation requirements
- Step-by-step migration plan
- Risk mitigation strategies
- Success metrics to track

## Troubleshooting

**Common Issues:**
- **Authentication errors**: Double-check your API keys and credentials
- **Supabase connection**: Verify your URL and service role key
- **Airtable connection**: Confirm your base ID and table ID are correct
- **OpenAI parsing**: Check the raw AI response if JSON parsing fails

## Next Steps

After getting your migration analysis:
1. Review the AI recommendations
2. Test the matching strategy with sample data
3. Build the migration execution workflow
4. Run a pilot migration with 10-20 records
5. Scale up to full migration once validated

## Support

If you encounter issues:
1. Check each node's output for error messages
2. Verify all credentials are correctly configured
3. Test API connections individually
4. Review the AI prompt and response for clarity
