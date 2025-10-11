-- Create site audit log table for AI monitoring system
-- This table tracks all site monitoring activities, errors, and fixes

CREATE TABLE IF NOT EXISTS site_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_type VARCHAR(50) NOT NULL, -- 'error', 'warning', 'info', 'fix', 'notification'
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  category VARCHAR(50) NOT NULL, -- 'api', 'performance', 'error', 'security', 'maintenance'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  details JSONB, -- Flexible field for additional data
  error_stack TEXT, -- For error stack traces
  user_agent TEXT,
  ip_address INET,
  url VARCHAR(500),
  user_id UUID, -- If user is authenticated
  resolved BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT,
  admin_notified BOOLEAN DEFAULT FALSE,
  auto_fix_attempted BOOLEAN DEFAULT FALSE,
  auto_fix_successful BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_site_audit_log_timestamp ON site_audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_site_audit_log_event_type ON site_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_site_audit_log_severity ON site_audit_log(severity);
CREATE INDEX IF NOT EXISTS idx_site_audit_log_category ON site_audit_log(category);
CREATE INDEX IF NOT EXISTS idx_site_audit_log_resolved ON site_audit_log(resolved);
CREATE INDEX IF NOT EXISTS idx_site_audit_log_user_id ON site_audit_log(user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_audit_log_updated_at
  BEFORE UPDATE ON site_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE site_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Admin access to audit log" ON site_audit_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert some initial monitoring events
INSERT INTO site_audit_log (event_type, severity, category, title, description) VALUES
('info', 'low', 'system', 'Site Monitor Initialized', 'AI-powered site monitoring system started'),
('info', 'low', 'maintenance', 'Stock Quantity Fix Available', 'Auto-fix endpoint created for stock quantity issues'),
('info', 'low', 'system', 'Error Boundary Active', 'React error boundary system activated'),
('info', 'low', 'system', 'Loading State Monitor Active', 'Enhanced loading state management activated');

COMMENT ON TABLE site_audit_log IS 'Comprehensive audit log for AI site monitoring system - tracks errors, fixes, and system health';
