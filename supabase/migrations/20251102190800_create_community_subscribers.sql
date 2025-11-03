-- Create community subscribers table for newsletter signups
CREATE TABLE IF NOT EXISTS community_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_community_subscribers_email ON community_subscribers(email);

-- Create index on is_active for filtering active subscribers
CREATE INDEX IF NOT EXISTS idx_community_subscribers_active ON community_subscribers(is_active) WHERE is_active = true;

-- Add RLS (Row Level Security) policies
ALTER TABLE community_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy for service role (admin operations)
CREATE POLICY "Service role can manage all subscribers" ON community_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Policy for authenticated users to read their own data (if needed in future)
CREATE POLICY "Users can view their own subscription" ON community_subscribers
  FOR SELECT USING (auth.email() = email);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON community_subscribers TO authenticated;
GRANT ALL ON community_subscribers TO service_role;

-- Create PL/pgSQL function to set timestamp
CREATE OR REPLACE FUNCTION trg_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row modifications
CREATE TRIGGER set_timestamp_community_subscribers
    AFTER UPDATE ON community_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION trg_set_timestamp();

-- Add comments for documentation
COMMENT ON TABLE community_subscribers IS 'Newsletter subscribers for Highway 420 community updates and exclusive offers';
COMMENT ON COLUMN community_subscribers.full_name IS 'Subscriber full name';
COMMENT ON COLUMN community_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN community_subscribers.subscribed_at IS 'When the user subscribed to the newsletter';
COMMENT ON COLUMN community_subscribers.is_active IS 'Whether the subscription is active (true) or unsubscribed (false)';
COMMENT ON COLUMN community_subscribers.unsubscribed_at IS 'When the user unsubscribed (if applicable)';
