-- Comprehensive Inventory Validation System
-- Creates inventory table, reservation system, and validation functions

-- Create inventory table if it doesn't exist
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id TEXT DEFAULT 'main',
  
  -- Stock levels
  available INTEGER NOT NULL DEFAULT 0,
  reserved INTEGER NOT NULL DEFAULT 0,
  committed INTEGER NOT NULL DEFAULT 0, -- For pending orders
  on_order INTEGER NOT NULL DEFAULT 0, -- Incoming stock
  
  -- Thresholds and alerts
  low_stock_threshold INTEGER DEFAULT 5,
  reorder_point INTEGER DEFAULT 10,
  max_stock_level INTEGER,
  
  -- Tracking and sync
  sku TEXT,
  name TEXT,
  description TEXT,
  short_description TEXT,
  categories TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_version TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(product_id, warehouse_id),
  CHECK (available >= 0),
  CHECK (reserved >= 0),
  CHECK (committed >= 0),
  CHECK (on_order >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_id ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_available ON inventory(available);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON inventory(available) WHERE available <= low_stock_threshold;
CREATE INDEX IF NOT EXISTS idx_inventory_last_synced ON inventory(last_synced_at);

-- Create inventory reservations table for payment holds
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id TEXT DEFAULT 'main',
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  
  -- Reservation details
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  reason TEXT NOT NULL DEFAULT 'checkout', -- checkout, admin_hold, etc.
  
  -- Timing
  reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  released_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'released', 'converted')),
  
  -- References
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for reservations
CREATE INDEX IF NOT EXISTS idx_reservations_product_id ON inventory_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON inventory_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_session_id ON inventory_reservations(session_id);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON inventory_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON inventory_reservations(status);

-- Function to get available stock (available - reserved - committed)
CREATE OR REPLACE FUNCTION get_available_stock(p_product_id UUID, p_warehouse_id TEXT DEFAULT 'main')
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_available INTEGER := 0;
  v_reserved INTEGER := 0;
  v_committed INTEGER := 0;
  v_active_reservations INTEGER := 0;
BEGIN
  -- Get inventory levels
  SELECT 
    COALESCE(available, 0),
    COALESCE(reserved, 0),
    COALESCE(committed, 0)
  INTO v_available, v_reserved, v_committed
  FROM inventory 
  WHERE product_id = p_product_id 
    AND warehouse_id = p_warehouse_id;
  
  -- Get active reservations
  SELECT COALESCE(SUM(quantity), 0)
  INTO v_active_reservations
  FROM inventory_reservations
  WHERE product_id = p_product_id
    AND warehouse_id = p_warehouse_id
    AND status = 'active'
    AND expires_at > NOW();
  
  -- Return truly available stock
  RETURN GREATEST(0, v_available - v_reserved - v_committed - v_active_reservations);
END;
$$;

-- Function to reserve inventory for checkout
CREATE OR REPLACE FUNCTION reserve_inventory(
  p_product_id UUID,
  p_quantity INTEGER,
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_warehouse_id TEXT DEFAULT 'main',
  p_hold_minutes INTEGER DEFAULT 15
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_reservation_id UUID;
  v_available_stock INTEGER;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if we have enough stock
  v_available_stock := get_available_stock(p_product_id, p_warehouse_id);
  
  IF v_available_stock < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_available_stock, p_quantity;
  END IF;
  
  -- Calculate expiration time
  v_expires_at := NOW() + (p_hold_minutes || ' minutes')::INTERVAL;
  
  -- Create reservation
  INSERT INTO inventory_reservations (
    product_id,
    warehouse_id,
    user_id,
    session_id,
    quantity,
    expires_at,
    status
  ) VALUES (
    p_product_id,
    p_warehouse_id,
    p_user_id,
    p_session_id,
    p_quantity,
    v_expires_at,
    'active'
  ) RETURNING id INTO v_reservation_id;
  
  RETURN v_reservation_id;
END;
$$;

-- Function to release inventory reservation
CREATE OR REPLACE FUNCTION release_inventory_reservation(p_reservation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE inventory_reservations
  SET 
    status = 'released',
    released_at = NOW(),
    updated_at = NOW()
  WHERE id = p_reservation_id
    AND status = 'active';
  
  RETURN FOUND;
END;
$$;

-- Function to convert reservation to committed stock (when order is placed)
CREATE OR REPLACE FUNCTION convert_reservation_to_committed(
  p_reservation_id UUID,
  p_order_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_product_id UUID;
  v_warehouse_id TEXT;
  v_quantity INTEGER;
BEGIN
  -- Get reservation details
  SELECT product_id, warehouse_id, quantity
  INTO v_product_id, v_warehouse_id, v_quantity
  FROM inventory_reservations
  WHERE id = p_reservation_id
    AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found or not active: %', p_reservation_id;
  END IF;
  
  -- Update inventory committed stock
  UPDATE inventory
  SET 
    committed = committed + v_quantity,
    updated_at = NOW()
  WHERE product_id = v_product_id
    AND warehouse_id = v_warehouse_id;
  
  -- Mark reservation as converted
  UPDATE inventory_reservations
  SET 
    status = 'converted',
    order_id = p_order_id,
    updated_at = NOW()
  WHERE id = p_reservation_id;
  
  RETURN TRUE;
END;
$$;

-- Function to fulfill committed stock (when order ships)
CREATE OR REPLACE FUNCTION fulfill_committed_stock(
  p_order_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_reservation RECORD;
BEGIN
  -- Process all reservations for this order
  FOR v_reservation IN 
    SELECT product_id, warehouse_id, quantity
    FROM inventory_reservations
    WHERE order_id = p_order_id
      AND status = 'converted'
  LOOP
    -- Decrement available and committed stock
    UPDATE inventory
    SET 
      available = GREATEST(0, available - v_reservation.quantity),
      committed = GREATEST(0, committed - v_reservation.quantity),
      updated_at = NOW()
    WHERE product_id = v_reservation.product_id
      AND warehouse_id = v_reservation.warehouse_id;
  END LOOP;
  
  RETURN TRUE;
END;
$$;

-- Function to clean up expired reservations
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE inventory_reservations
  SET 
    status = 'expired',
    updated_at = NOW()
  WHERE status = 'active'
    AND expires_at <= NOW();
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_updated_at 
    BEFORE UPDATE ON inventory 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_reservations_updated_at 
    BEFORE UPDATE ON inventory_reservations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for inventory status with reservations
CREATE OR REPLACE VIEW inventory_status AS
SELECT 
  i.product_id,
  i.warehouse_id,
  p.name as product_name,
  p.sku,
  i.available,
  i.reserved,
  i.committed,
  COALESCE(ar.active_reservations, 0) as active_reservations,
  get_available_stock(i.product_id, i.warehouse_id) as truly_available,
  i.low_stock_threshold,
  i.reorder_point,
  CASE 
    WHEN get_available_stock(i.product_id, i.warehouse_id) <= 0 THEN 'out_of_stock'
    WHEN get_available_stock(i.product_id, i.warehouse_id) <= i.low_stock_threshold THEN 'low_stock'
    WHEN get_available_stock(i.product_id, i.warehouse_id) <= i.reorder_point THEN 'reorder_needed'
    ELSE 'in_stock'
  END as stock_status,
  i.last_synced_at,
  i.updated_at
FROM inventory i
LEFT JOIN products p ON i.product_id = p.id
LEFT JOIN (
  SELECT 
    product_id,
    warehouse_id,
    SUM(quantity) as active_reservations
  FROM inventory_reservations
  WHERE status = 'active' AND expires_at > NOW()
  GROUP BY product_id, warehouse_id
) ar ON i.product_id = ar.product_id AND i.warehouse_id = ar.warehouse_id;

-- Add RLS policies
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;

-- Inventory policies (admin access)
CREATE POLICY "Admin can manage inventory" ON inventory
    FOR ALL USING (auth.role() = 'authenticated');

-- Users can view inventory for products
CREATE POLICY "Users can view inventory" ON inventory
    FOR SELECT USING (true);

-- Reservation policies
CREATE POLICY "Users can manage their own reservations" ON inventory_reservations
    FOR ALL USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- Comments for documentation
COMMENT ON TABLE inventory IS 'Real-time inventory tracking with multi-warehouse support';
COMMENT ON TABLE inventory_reservations IS 'Temporary inventory holds during checkout process';
COMMENT ON FUNCTION get_available_stock IS 'Calculate truly available stock considering all reservations';
COMMENT ON FUNCTION reserve_inventory IS 'Reserve inventory for checkout with automatic expiration';
COMMENT ON FUNCTION cleanup_expired_reservations IS 'Clean up expired inventory reservations (run via cron)';
COMMENT ON VIEW inventory_status IS 'Comprehensive inventory status view with stock levels and alerts';
