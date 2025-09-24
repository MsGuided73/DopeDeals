-- Add missing order management fields
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'unfulfilled',
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS carrier TEXT,
ADD COLUMN IF NOT EXISTS customer_notes TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS gift_message TEXT,
ADD COLUMN IF NOT EXISTS is_gift BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index on order_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Create index on fulfillment_status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);

-- Create order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  notes TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on order_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- Update existing orders to have order numbers if they don't have them
UPDATE orders 
SET order_number = 'DC-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::TEXT, 4, '0')
WHERE order_number IS NULL;

-- Add updated_at trigger for orders table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for order_status_history
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Users can view status history for their own orders
CREATE POLICY "Users can view their order status history" ON order_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_status_history.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Only authenticated users can create status history (typically admins)
CREATE POLICY "Authenticated users can create order status history" ON order_status_history
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add some useful views for order management
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.user_id,
    u.email as customer_email,
    u.full_name as customer_name,
    o.status,
    o.payment_status,
    o.fulfillment_status,
    o.total_amount,
    o.created_at,
    o.updated_at,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.email, u.full_name;

-- View for orders needing fulfillment
CREATE OR REPLACE VIEW orders_to_fulfill AS
SELECT 
    o.id,
    o.order_number,
    o.user_id,
    u.email as customer_email,
    u.full_name as customer_name,
    o.status,
    o.payment_status,
    o.fulfillment_status,
    o.total_amount,
    o.shipping_address,
    o.created_at,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.payment_status = 'paid' 
    AND o.fulfillment_status IN ('unfulfilled', 'partial')
    AND o.status NOT IN ('cancelled', 'refunded')
GROUP BY o.id, u.email, u.full_name;

-- Add comments for documentation
COMMENT ON COLUMN orders.order_number IS 'Human-readable order number in format DC-YYYYMMDD-XXXX';
COMMENT ON COLUMN orders.fulfillment_status IS 'Order fulfillment status: unfulfilled, partial, fulfilled, shipped, delivered, returned';
COMMENT ON COLUMN orders.tracking_number IS 'Shipping tracking number from carrier';
COMMENT ON COLUMN orders.carrier IS 'Shipping carrier (UPS, FedEx, USPS, etc.)';
COMMENT ON COLUMN orders.customer_notes IS 'Notes from customer during checkout';
COMMENT ON COLUMN orders.admin_notes IS 'Internal notes for order management';
COMMENT ON COLUMN orders.gift_message IS 'Gift message if order is a gift';
COMMENT ON COLUMN orders.is_gift IS 'Whether this order is a gift';

COMMENT ON TABLE order_status_history IS 'Audit trail of order status changes';
COMMENT ON VIEW order_summary IS 'Summary view of orders with customer info and item counts';
COMMENT ON VIEW orders_to_fulfill IS 'Orders that are paid but not yet fulfilled';
