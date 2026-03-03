-- Fix for checkout_atomic.sql to support the modern order_items schema
-- Run this in the Supabase Dashboard SQL Editor at:
-- https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

CREATE OR REPLACE FUNCTION checkout_atomic(
  p_user_id UUID,
  p_items JSONB,
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
  
  -- Extra fields to match the current order_items schema
  v_product_name TEXT;
  v_product_sku TEXT;
  v_product_image_url TEXT;
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
      -- If inventory tracking is missing for an item, you may comment out the exception later,
      -- but since we've passed this step already, your inventory is working.
      RAISE EXCEPTION 'Insufficient inventory for product %', v_product_id;
    END IF;
  END LOOP;

  -- Compute subtotal from current product prices
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'productId')::uuid;
    v_qty := (v_item->>'quantity')::int;
    
    -- Try main_site_products first (current primary table)
    SELECT our_price::numeric INTO v_price FROM main_site_products WHERE id = v_product_id;
    IF v_price IS NULL THEN
        -- Fallback to the old deprecated products table
        SELECT price::numeric INTO v_price FROM products WHERE id = v_product_id;
    END IF;
    
    IF v_price IS NULL THEN
      RAISE EXCEPTION 'Product % not found', v_product_id;
    END IF;
    v_subtotal := v_subtotal + (v_price * v_qty);
  END LOOP;

  -- Insert order
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
    
    -- Read product details for the order_items snapshot
    SELECT name, sku, image_url, our_price::numeric INTO v_product_name, v_product_sku, v_product_image_url, v_price 
    FROM main_site_products WHERE id = v_product_id;
    
    IF v_price IS NULL THEN
        SELECT name, sku, image_url, price::numeric INTO v_product_name, v_product_sku, v_product_image_url, v_price 
        FROM products WHERE id = v_product_id;
    END IF;

    -- Insert into order_items matching the new strict schema (includes total_price constraint)
    INSERT INTO order_items (
        order_id, 
        product_id, 
        quantity, 
        product_name,
        product_sku,
        product_image_url,
        unit_price, 
        total_price
    )
    VALUES (
        v_order_id, 
        v_product_id, 
        v_qty, 
        COALESCE(v_product_name, 'Unknown Product'),
        COALESCE(v_product_sku, 'SKU-000'),
        v_product_image_url,
        v_price,
        v_price * v_qty
    );

    -- Update inventory
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
