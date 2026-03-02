-- ============================================================
-- Highway 420 — Payments & Verification Schema Migration
-- Aligns with shared/schema.ts paymentTransactions and
-- kajaPayWebhookEvents table definitions.
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. payment_methods  (saved cards / tokens)
--    Already defined in schema.ts — ensuring it exists
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_methods (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  kajapay_token       TEXT NOT NULL,                    -- KajaPay customerToken
  card_last4          TEXT,
  card_type           TEXT,                             -- Visa, MasterCard, Amex, etc.
  expiry_month        INTEGER,
  expiry_year         INTEGER,
  billing_name        TEXT,
  billing_address     JSONB,
  is_default          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. payment_transactions  (every KajaPay charge/refund/void)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_transactions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Links
  order_id                    UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id                     UUID REFERENCES users(id) ON DELETE SET NULL,   -- for analytics

  -- KajaPay identifiers (returned in response or redirect params)
  kajapay_transaction_id      BIGINT,                   -- KajaPay's numeric transactionId
  kajapay_reference_number    BIGINT,                   -- KajaPay's numeric referenceNumber
  kajapay_order_number        TEXT,                     -- mirrors orders.order_number

  -- Transaction classification
  transaction_type            TEXT NOT NULL             -- 'charge' | 'refund' | 'void'
    CHECK (transaction_type IN ('charge','refund','void')),

  -- Amounts (exact, no floating point)
  amount                      NUMERIC(10,2) NOT NULL,
  tax_amount                  NUMERIC(10,2) DEFAULT 0,
  shipping_amount             NUMERIC(10,2) DEFAULT 0,
  currency                    TEXT NOT NULL DEFAULT 'USD',

  -- Status lifecycle
  status                      TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','declined','failed','refunded','voided')),

  -- KajaPay gateway response fields
  kajapay_status_code         TEXT,                     -- responseCode from KajaPay ('00', '05', etc.)
  kajapay_response_text       TEXT,                     -- responseText ("APPROVED", "DECLINED")
  auth_code                   TEXT,                     -- authCode for approved charges
  avs_response_code           TEXT,
  cvv_response_code           TEXT,
  masked_card_number          TEXT,                     -- last 4 from KajaPay (e.g. "XXXX1234")
  card_type                   TEXT,

  -- Error tracking
  error_message               TEXT,

  -- Raw snapshots (full response stored for compliance / dispute resolution)
  payment_method_data         JSONB,                    -- masked card info snapshot
  gateway_response            JSONB,                    -- full KajaPay response payload
  redirect_params             JSONB,                    -- params KajaPay sent on redirect return

  -- Age verification linkage (compliance gate)
  age_verification_id         TEXT,                     -- AgeChecker transactionId
  age_verified                BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  settled_at                  TIMESTAMPTZ              -- set when status → 'approved'
);

-- ─────────────────────────────────────────────
-- 3. kajapay_webhook_events  (postback log, idempotent)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kajapay_webhook_events (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type              TEXT NOT NULL,               -- 'transaction.approved', 'transaction.declined', etc.
  kajapay_transaction_id  BIGINT,
  order_id                UUID REFERENCES orders(id) ON DELETE SET NULL,
  payload                 JSONB NOT NULL,              -- full raw webhook body
  processed               BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at            TIMESTAMPTZ,
  error_message           TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. Indexes for query performance
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id
  ON payment_transactions(order_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id
  ON payment_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_kajapay_id
  ON payment_transactions(kajapay_transaction_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_status
  ON payment_transactions(status);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at
  ON payment_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kajapay_webhook_events_kajapay_id
  ON kajapay_webhook_events(kajapay_transaction_id);

CREATE INDEX IF NOT EXISTS idx_kajapay_webhook_events_order_id
  ON kajapay_webhook_events(order_id);

CREATE INDEX IF NOT EXISTS idx_kajapay_webhook_events_processed
  ON kajapay_webhook_events(processed);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id
  ON payment_methods(user_id);

-- ─────────────────────────────────────────────
-- 5. Auto-update updated_at triggers
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER trg_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER trg_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- 6. Row Level Security
-- ─────────────────────────────────────────────
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods      ENABLE ROW LEVEL SECURITY;
ALTER TABLE kajapay_webhook_events ENABLE ROW LEVEL SECURITY;

-- Users can only read their own transactions
CREATE POLICY "user_read_own_transactions" ON payment_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only read their own saved methods
CREATE POLICY "user_read_own_methods" ON payment_methods
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role writes (inserts happen via API routes)
CREATE POLICY "service_role_all_transactions" ON payment_transactions
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_methods" ON payment_methods
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_webhooks" ON kajapay_webhook_events
  FOR ALL
  USING (auth.role() = 'service_role');

-- Admins can read everything
CREATE POLICY "admin_read_all_transactions" ON payment_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ─────────────────────────────────────────────
-- 7. Account Dashboard View
--    Surfaced to the user via /api/account/payments
-- ─────────────────────────────────────────────
CREATE OR REPLACE VIEW account_payment_history AS
SELECT
  pt.id,
  pt.user_id,
  pt.order_id,
  o.order_number,
  pt.transaction_type,
  pt.amount,
  pt.currency,
  pt.status,
  pt.kajapay_transaction_id,
  pt.auth_code,
  pt.masked_card_number,
  pt.card_type,
  pt.kajapay_response_text,
  pt.age_verified,
  pt.created_at,
  pt.settled_at
FROM payment_transactions pt
LEFT JOIN orders o ON o.id = pt.order_id
ORDER BY pt.created_at DESC;

-- Grant select on the view to authenticated users (filtered by RLS on base table)
GRANT SELECT ON account_payment_history TO authenticated;
