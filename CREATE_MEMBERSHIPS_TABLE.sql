-- Create missing memberships table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS memberships (
    id VARCHAR(255) PRIMARY KEY,
    tier_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    benefits TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample membership data
INSERT INTO memberships (id, tier_name, description, price, benefits) VALUES
('vip-premium', 'VIP Premium', 'Premium membership with exclusive benefits', 99.99, 
 ARRAY['Exclusive product access', 'Priority customer support', 'Free shipping on all orders', 'Early access to new products'])
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Memberships table created successfully!' as result;