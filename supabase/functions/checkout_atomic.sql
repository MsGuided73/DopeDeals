-- Atomic checkout RPC for Supabase
-- Creates order + order_items and decrements inventory in a single transaction
-- Assumptions:
--  - inventory table exists with columns: product_id UUID (or TEXT castable to UUID), warehouse_id nullable, available INT, reserved INT
--  - products table has columns: id UUID, price NUMERIC(10,2)
--  - orders, order_items tables match shared/schema.ts
--  - Single-warehouse for now (warehouse_id IS NULL). Extend later for multi-warehouse.
--
-- Security: SECURITY DEFINER so it can run with elevated perms via service role.
-- Return shape: JSONB { order, items }

CREATE OR REPLACE FUNCTION checkout_atomic(
  p_user_id UUID,
  p_items JSONB, -- [{"productId":"uuid","quantity":1}, ...]
  p_billing JSONB DEFAULT NULL,
  p_shipping JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_product_id UUID;
  v_qty INT;
  v_price NUMERIC(10,2);
  v_subtotal NUMERIC(10,2) := 0;
BEGIN
  -- Validate and lock inventory rows to prevent race conditions
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'productId')::uuid;
    v_qty := COALESCE((v_item->>'quantity')::int, 0);
    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', v_product_id;
    END IF;

    -- Lock the row; ensure enough stock (available - reserved >= qty)
    PERFORM 1
    FROM inventory i
    WHERE i.product_id = v_product_id
      AND COALESCE(i.available,0) - COALESCE(i.reserved,0) >= v_qty
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient inventory for product %', v_product_id;
    END IF;
  END LOOP;

  -- Compute subtotal from current product prices
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'productId')::uuid;
    v_qty := (v_item->>'quantity')::int;
    SELECT price::numeric INTO v_price FROM products WHERE id = v_product_id;
    IF v_price IS NULL THEN
      RAISE EXCEPTION 'Product % not found', v_product_id;
    END IF;
    v_subtotal := v_subtotal + (v_price * v_qty);
  END LOOP;

  -- Insert order (tax/shipping placeholders at 0 for now)
  INSERT INTO orders (
    user_id,
    status,
    payment_status,
    payment_method,
    transaction_id,
    subtotal_amount,
    tax_amount,
    shipping_amount,
    total_amount,
    billing_address,
    shipping_address
  ) VALUES (
    p_user_id,
    'processing',
    'pending',
    'card',
    NULL,
    v_subtotal,
    0,
    0,
    v_subtotal,
    p_billing,
    p_shipping
  ) RETURNING id INTO v_order_id;

  -- Insert order items and decrement inventory.available
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'productId')::uuid;
    v_qty := (v_item->>'quantity')::int;
    SELECT price::numeric INTO v_price FROM products WHERE id = v_product_id;

    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
    VALUES (v_order_id, v_product_id, v_qty, v_price);

    UPDATE inventory
      SET available = GREATEST(0, available - v_qty)
      WHERE product_id = v_product_id;
  END LOOP;

  RETURN jsonb_build_object(
    'order', (SELECT to_jsonb(o) FROM orders o WHERE o.id = v_order_id),
    'items', (SELECT COALESCE(jsonb_agg(to_jsonb(oi)), '[]'::jsonb) FROM order_items oi WHERE oi.order_id = v_order_id)
  );
END;
$$;

-- Helpful: revoke public execute and grant to authenticated/roles as needed externally.

