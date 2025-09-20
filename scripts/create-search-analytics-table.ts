#!/usr/bin/env node

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createSearchAnalyticsTable() {
  console.log('📊 Creating search analytics table...');

  try {
    // Check if table already exists
    const { data: existingTable } = await supabase
      .from('search_analytics')
      .select('id')
      .limit(1);

    if (existingTable) {
      console.log('✅ Search analytics table already exists!');
      return;
    }

    console.log('❌ Search analytics table does not exist. Please create it manually in Supabase dashboard.');
    console.log('SQL to create the table:');
    console.log(`
CREATE TABLE search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  result_count INTEGER DEFAULT 0,
  selected_result JSONB,
  user_agent TEXT,
  hashed_ip TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_search_analytics_query ON search_analytics(query);
CREATE INDEX idx_search_analytics_timestamp ON search_analytics(timestamp);

ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow search analytics inserts" ON search_analytics
  FOR INSERT WITH CHECK (true);
    `);

    console.log('✅ Please run the above SQL in your Supabase dashboard.');

    // Test the table by inserting a sample record
    const { error: insertError } = await supabase
      .from('search_analytics')
      .insert({
        query: 'test search',
        result_count: 5,
        selected_result: { type: 'product', title: 'Test Product' },
        user_agent: 'Test Script',
        hashed_ip: 'test123'
      });

    if (insertError) {
      console.error('❌ Error testing table insert:', insertError);
    } else {
      console.log('✅ Test record inserted successfully!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the migration
createSearchAnalyticsTable().catch(console.error);
