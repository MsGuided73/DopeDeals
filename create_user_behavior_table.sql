-- Create the user_behavior table for recommendation system data
-- Data types matched to existing database structure
CREATE TABLE user_behavior (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id), -- Match actual database type (TEXT/VARCHAR)
  product_id TEXT REFERENCES products(id), -- Match actual database type (TEXT/VARCHAR)
  action TEXT NOT NULL CHECK (action IN ('view', 'add_to_cart', 'purchase', 'wishlist', 'search')),
  session_id TEXT,
  metadata JSONB, -- Additional context like search terms, time spent, scroll depth, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_behavior_user_id ON user_behavior(user_id);
CREATE INDEX idx_user_behavior_product_id ON user_behavior(product_id);
CREATE INDEX idx_user_behavior_action ON user_behavior(action);
CREATE INDEX idx_user_behavior_created_at ON user_behavior(created_at DESC);
CREATE INDEX idx_user_behavior_session_id ON user_behavior(session_id) WHERE session_id IS NOT NULL;

-- Add RLS policies for privacy
ALTER TABLE user_behavior ENABLE ROW LEVEL SECURITY;

-- Users can only see their own behavior data
CREATE POLICY "user_behavior_privacy" ON user_behavior
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own behavior data
CREATE POLICY "user_behavior_insert_own" ON user_behavior
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE user_behavior IS 'Tracks user interactions with products for AI recommendation system';
COMMENT ON COLUMN user_behavior.action IS 'Action types: view, add_to_cart, purchase, wishlist, search';
COMMENT ON COLUMN user_behavior.metadata IS 'Additional context like search terms, time spent on page, scroll depth, etc.';
COMMENT ON COLUMN user_behavior.session_id IS 'Session identifier for grouping related actions';

-- Optional: Create a view for analytics (if needed)
-- CREATE VIEW user_behavior_analytics AS
-- SELECT
--   ub.user_id,
--   ub.action,
--   ub.product_id,
--   p.name as product_name,
--   p.category_id,
--   p.brand_id,
--   ub.created_at
-- FROM user_behavior ub
-- LEFT JOIN products p ON ub.product_id = p.id
-- WHERE ub.created_at > NOW() - INTERVAL '30 days'
-- ORDER BY ub.created_at DESC;
