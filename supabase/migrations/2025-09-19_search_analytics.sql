-- Create search analytics table for tracking search behavior
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  result_count INTEGER DEFAULT 0,
  selected_result JSONB, -- Store info about what result was clicked
  user_agent TEXT,
  hashed_ip TEXT, -- Privacy-respecting IP hash
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_timestamp ON search_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query_timestamp ON search_analytics(query, timestamp);

-- Enable RLS (Row Level Security)
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for recording analytics)
CREATE POLICY "Allow search analytics inserts" ON search_analytics
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads for admin users only
CREATE POLICY "Allow search analytics reads for service role" ON search_analytics
  FOR SELECT USING (auth.role() = 'service_role');

-- Add comment
COMMENT ON TABLE search_analytics IS 'Tracks search queries and user behavior for analytics and optimization';
