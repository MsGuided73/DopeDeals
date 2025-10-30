-- Migration: Update existing carts/cart_items tables with session-based RLS
-- Implements PostgreSQL GUC for session-based row level security on existing tables

-- Add additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_product ON cart_items(cart_id, product_id);

-- Function to sync cart metadata (item_count and total_value)
CREATE OR REPLACE FUNCTION sync_cart_metadata(cart_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  item_count_val INTEGER;
  total_value_val DECIMAL(10,2);
BEGIN
  -- Calculate item count and total value
  SELECT
    COALESCE(SUM(quantity), 0),
    COALESCE(SUM(price_at_time * quantity), 0)
  INTO item_count_val, total_value_val
  FROM cart_items
  WHERE cart_id = cart_uuid;

  -- Update cart metadata - using UPSERT approach since cart might already exist
  INSERT INTO cart_metadata (cart_id, item_count, total_value, updated_at)
  VALUES (cart_uuid, item_count_val, total_value_val, NOW())
  ON CONFLICT (cart_id) DO UPDATE SET
    item_count = EXCLUDED.item_count,
    total_value = EXCLUDED.total_value,
    updated_at = NOW();
END;
$$;

-- Function to get current session ID from GUC
CREATE OR REPLACE FUNCTION get_current_session_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  RETURN current_setting('app.current_session_id', true);
END;
$$;

-- Function to get current user ID from GUC
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true)::UUID;
END;
$$;

-- Ensure RLS is enabled on both tables
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Drop existing cart RLS policies to replace with session-aware ones
DROP POLICY IF EXISTS "Users can access own carts" ON carts;
DROP POLICY IF EXISTS "carts_select_policy" ON carts;
DROP POLICY IF EXISTS "carts_insert_policy" ON carts;
DROP POLICY IF EXISTS "carts_update_policy" ON carts;
DROP POLICY IF EXISTS "carts_delete_policy" ON carts;

-- Drop existing cart_items RLS policies
DROP POLICY IF EXISTS "Users can access own cart items" ON cart_items;
DROP POLICY IF EXISTS "cart_items_select_policy" ON cart_items;
DROP POLICY IF EXISTS "cart_items_insert_policy" ON cart_items;
DROP POLICY IF EXISTS "cart_items_update_policy" ON cart_items;
DROP POLICY IF EXISTS "cart_items_delete_policy" ON cart_items;

-- RLS Policies for carts table
-- Users can access carts they own OR carts with their current session
CREATE POLICY "Users can access own carts" ON carts
  FOR ALL USING (
    -- Authenticated user accessing their cart
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    -- Session-based access via GUC
    (session_id IS NOT NULL AND session_id = get_current_session_id()) OR
    -- Service role bypass
    (auth.jwt() ->> 'role' = 'service_role')
  );

-- RLS Policies for cart_items table
-- Users can access cart items where they can access the parent cart
CREATE POLICY "Cart items access via parent cart" ON cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM carts c
      WHERE c.id = cart_items.cart_id
      AND (
        -- Authenticated user owns the cart
        (auth.uid() IS NOT NULL AND c.user_id = auth.uid()) OR
        -- Session-based access
        (c.session_id IS NOT NULL AND c.session_id = get_current_session_id()) OR
        -- Service role
        (auth.jwt() ->> 'role' = 'service_role')
      )
    )
  );

-- Create cart_metadata table to track aggregated data
CREATE TABLE IF NOT EXISTS cart_metadata (
  cart_id UUID PRIMARY KEY REFERENCES carts(id) ON DELETE CASCADE,
  item_count INTEGER DEFAULT 0,
  total_value DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create or replace the update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to keep cart metadata in sync
CREATE OR REPLACE FUNCTION cart_items_change_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Sync metadata for affected cart
  IF TG_OP = 'DELETE' THEN
    PERFORM sync_cart_metadata(OLD.cart_id);
    RETURN OLD;
  ELSE
    PERFORM sync_cart_metadata(NEW.cart_id);
    RETURN NEW;
  END IF;
END;
$$;

-- Apply triggers
DROP TRIGGER IF EXISTS cart_items_change ON cart_items;
CREATE TRIGGER cart_items_change
  AFTER INSERT OR UPDATE OR DELETE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION cart_items_change_trigger();

DROP TRIGGER IF EXISTS cart_metadata_updated_at ON cart_metadata;
CREATE TRIGGER cart_metadata_updated_at
  BEFORE UPDATE ON cart_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Add comment for documentation
COMMENT ON TABLE carts IS 'Stores cart metadata (user/session tracking)';
COMMENT ON TABLE cart_items IS 'Stores individual items within carts';
COMMENT ON FUNCTION get_current_session_id() IS 'Gets session ID from GUC (set via set_config)';
COMMENT ON FUNCTION get_current_user_id() IS 'Gets user ID from GUC';
COMMENT ON FUNCTION sync_cart_metadata(UUID) IS 'Keeps cart item_count and total_value in sync';
