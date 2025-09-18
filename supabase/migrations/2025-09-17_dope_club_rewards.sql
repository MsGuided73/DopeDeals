-- DOPE CLUB Rewards System Migration
-- Creates tables for tracking members, points, and membership tiers

-- Create membership tiers enum
CREATE TYPE membership_tier AS ENUM ('bronze', 'silver', 'gold');

-- Create DOPE CLUB members table
CREATE TABLE IF NOT EXISTS dope_club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  
  -- Membership details
  membership_tier membership_tier DEFAULT 'bronze',
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  lifetime_spending DECIMAL(10,2) DEFAULT 0.00,
  
  -- Tier progression tracking
  tier_progress JSONB DEFAULT '{}', -- Stores progress toward next tier
  tier_benefits_unlocked JSONB DEFAULT '[]', -- Array of unlocked benefits
  
  -- Membership status
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Birthday rewards tracking
  birthday_reward_claimed_year INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Create points transactions table
CREATE TABLE IF NOT EXISTS dope_club_points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES dope_club_members(id) ON DELETE CASCADE,
  
  -- Transaction details
  transaction_type TEXT NOT NULL, -- 'earned', 'redeemed', 'expired', 'bonus', 'birthday'
  points_amount INTEGER NOT NULL, -- Positive for earned, negative for redeemed
  description TEXT NOT NULL,
  
  -- Related records
  order_id UUID, -- References orders table if applicable
  product_id UUID, -- References products table if applicable
  
  -- Transaction metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create membership tier benefits table
CREATE TABLE IF NOT EXISTS dope_club_tier_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier membership_tier NOT NULL,
  benefit_type TEXT NOT NULL, -- 'cashback_rate', 'free_shipping_threshold', 'early_access', 'birthday_gift', etc.
  benefit_value JSONB NOT NULL, -- Flexible storage for benefit details
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tier benefits
INSERT INTO dope_club_tier_benefits (tier, benefit_type, benefit_value, description) VALUES
-- Bronze tier benefits
('bronze', 'cashback_rate', '{"rate": 0.05}', '5% back in rewards on all purchases'),
('bronze', 'birthday_gift', '{"type": "standard", "value": 25}', 'Birthday gift worth $25'),
('bronze', 'member_deals', '{"access": true}', 'Access to member-only deals and promotions'),

-- Silver tier benefits  
('silver', 'cashback_rate', '{"rate": 0.08}', '8% back in rewards on all purchases'),
('silver', 'free_shipping_threshold', '{"amount": 75}', 'Free shipping on orders $75+'),
('silver', 'early_access', '{"hours": 24}', '24-hour early access to sales and new products'),
('silver', 'birthday_gift', '{"type": "premium", "value": 50}', 'Premium birthday gift worth $50'),
('silver', 'member_deals', '{"access": true}', 'Access to member-only deals and promotions'),

-- Gold tier benefits
('gold', 'cashback_rate', '{"rate": 0.10}', '10% back in rewards on all purchases'),
('gold', 'free_shipping', '{"threshold": 0}', 'Free shipping on all orders'),
('gold', 'exclusive_access', '{"products": true}', 'Exclusive access to limited edition products'),
('gold', 'early_access', '{"hours": 48}', '48-hour early access to sales and new products'),
('gold', 'birthday_gift', '{"type": "vip", "value": 100}', 'VIP birthday box worth $100'),
('gold', 'priority_support', '{"enabled": true}', 'Priority customer support'),
('gold', 'member_deals', '{"access": true}', 'Access to member-only deals and promotions');

-- Create spending thresholds for tier progression
CREATE TABLE IF NOT EXISTS dope_club_tier_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier membership_tier NOT NULL UNIQUE,
  minimum_spending DECIMAL(10,2) NOT NULL,
  points_multiplier DECIMAL(3,2) DEFAULT 1.00,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert tier thresholds
INSERT INTO dope_club_tier_thresholds (tier, minimum_spending, points_multiplier) VALUES
('bronze', 0.00, 1.00),
('silver', 500.00, 1.20),
('gold', 1500.00, 1.50);

-- Create indexes for performance
CREATE INDEX idx_dope_club_members_user_id ON dope_club_members(user_id);
CREATE INDEX idx_dope_club_members_email ON dope_club_members(email);
CREATE INDEX idx_dope_club_members_tier ON dope_club_members(membership_tier);
CREATE INDEX idx_dope_club_points_member_id ON dope_club_points_transactions(member_id);
CREATE INDEX idx_dope_club_points_type ON dope_club_points_transactions(transaction_type);
CREATE INDEX idx_dope_club_points_created ON dope_club_points_transactions(created_at);

-- Create RLS policies
ALTER TABLE dope_club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dope_club_points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dope_club_tier_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE dope_club_tier_thresholds ENABLE ROW LEVEL SECURITY;

-- Members can only see their own data
CREATE POLICY "Members can view own data" ON dope_club_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Members can update own data" ON dope_club_members
  FOR UPDATE USING (auth.uid() = user_id);

-- Members can only see their own transactions
CREATE POLICY "Members can view own transactions" ON dope_club_points_transactions
  FOR SELECT USING (
    member_id IN (
      SELECT id FROM dope_club_members WHERE user_id = auth.uid()
    )
  );

-- Everyone can read tier benefits and thresholds
CREATE POLICY "Anyone can view tier benefits" ON dope_club_tier_benefits
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view tier thresholds" ON dope_club_tier_thresholds
  FOR SELECT USING (true);

-- Create function to automatically update membership tier based on spending
CREATE OR REPLACE FUNCTION update_membership_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tier based on lifetime spending
  UPDATE dope_club_members 
  SET membership_tier = CASE
    WHEN NEW.lifetime_spending >= 1500.00 THEN 'gold'::membership_tier
    WHEN NEW.lifetime_spending >= 500.00 THEN 'silver'::membership_tier
    ELSE 'bronze'::membership_tier
  END,
  updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update tier on spending changes
CREATE TRIGGER trigger_update_membership_tier
  AFTER UPDATE OF lifetime_spending ON dope_club_members
  FOR EACH ROW
  EXECUTE FUNCTION update_membership_tier();

-- Create function to calculate points earned from purchase
CREATE OR REPLACE FUNCTION calculate_points_earned(
  member_id UUID,
  purchase_amount DECIMAL
) RETURNS INTEGER AS $$
DECLARE
  member_tier membership_tier;
  points_multiplier DECIMAL;
  base_points INTEGER;
BEGIN
  -- Get member's current tier
  SELECT membership_tier INTO member_tier
  FROM dope_club_members
  WHERE id = member_id;
  
  -- Get points multiplier for tier
  SELECT dct.points_multiplier INTO points_multiplier
  FROM dope_club_tier_thresholds dct
  WHERE dct.tier = member_tier;
  
  -- Calculate base points (1 point per dollar spent)
  base_points := FLOOR(purchase_amount);
  
  -- Apply tier multiplier
  RETURN FLOOR(base_points * points_multiplier);
END;
$$ LANGUAGE plpgsql;
