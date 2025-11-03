-- Add unique partial index to prevent multiple active subscriptions for the same email
-- This ensures data integrity and prevents the .single() error scenario

CREATE UNIQUE INDEX IF NOT EXISTS idx_community_subscribers_unique_active_email
ON community_subscribers(email)
WHERE is_active = true;

-- Add comment for documentation
COMMENT ON INDEX idx_community_subscribers_unique_active_email IS 'Ensures only one active subscription per email address';
