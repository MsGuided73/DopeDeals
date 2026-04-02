-- Adds payment confirmation timestamp and ShipStation reference tracking to orders.
-- These fields enable the admin dashboard to show:
--   1. When KajaPay confirmed payment (date/time)
--   2. The KajaPay transaction ID for cross-reference
--   3. The ShipStation order ID for fulfillment tracking

-- Payment confirmation fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS kajapay_transaction_id TEXT;

-- ShipStation reference fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipstation_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipstation_order_key TEXT;

-- Index for quick lookups by payment/shipstation status
CREATE INDEX IF NOT EXISTS idx_orders_payment_confirmed_at ON orders (payment_confirmed_at) WHERE payment_confirmed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_shipstation_order_id ON orders (shipstation_order_id) WHERE shipstation_order_id IS NOT NULL;
