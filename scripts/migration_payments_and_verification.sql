-- ============================================================
-- Highway 420 — Payments Schema Migration (FINAL APPLIED VERSION)
-- Successfully applied: 2026-03-02
-- ============================================================
--
-- IMPORTANT LESSONS LEARNED:
--   1. payment_transactions, payment_methods, kajapay_webhook_events
--      all pre-existed with only an 'id' (UUID) column.
--      CREATE TABLE IF NOT EXISTS silently skipped them.
--      Always use ALTER TABLE ... ADD COLUMN IF NOT EXISTS here.
--
--   2. orders.id is VARCHAR (character varying), NOT UUID.
--      All order_id columns must be TEXT with NO FK constraint.
--      A UUID→VARCHAR FK will fail with error 42804.
--
--   3. users.id IS UUID — FK references to users(id) work fine.
--
--   4. The view joins were simplified — no orders JOIN
--      since order_id is TEXT and orders.order_number lookup
--      must be done at the application layer.
-- ============================================================

-- Step 1: Add all missing columns to pre-existing skeleton tables

ALTER TABLE payment_transactions
  ADD COLUMN IF NOT EXISTS order_id                 TEXT,
  ADD COLUMN IF NOT EXISTS user_id                  UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS kajapay_transaction_id   BIGINT,
  ADD COLUMN IF NOT EXISTS kajapay_reference_number BIGINT,
  ADD COLUMN IF NOT EXISTS kajapay_order_number     TEXT,
  ADD COLUMN IF NOT EXISTS transaction_type         TEXT,
  ADD COLUMN IF NOT EXISTS amount                   NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS tax_amount               NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_amount          NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency                 TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS status                   TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS kajapay_status_code      TEXT,
  ADD COLUMN IF NOT EXISTS kajapay_response_text    TEXT,
  ADD COLUMN IF NOT EXISTS auth_code                TEXT,
  ADD COLUMN IF NOT EXISTS avs_response_code        TEXT,
  ADD COLUMN IF NOT EXISTS cvv_response_code        TEXT,
  ADD COLUMN IF NOT EXISTS masked_card_number       TEXT,
  ADD COLUMN IF NOT EXISTS card_type                TEXT,
  ADD COLUMN IF NOT EXISTS error_message            TEXT,
  ADD COLUMN IF NOT EXISTS payment_method_data      JSONB,
  ADD COLUMN IF NOT EXISTS gateway_response         JSONB,
  ADD COLUMN IF NOT EXISTS redirect_params          JSONB,
  ADD COLUMN IF NOT EXISTS age_verification_id      TEXT,
  ADD COLUMN IF NOT EXISTS age_verified             BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS created_at               TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at               TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS settled_at               TIMESTAMPTZ;

ALTER TABLE payment_methods
  ADD COLUMN IF NOT EXISTS user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS kajapay_token   TEXT,
  ADD COLUMN IF NOT EXISTS card_last4      TEXT,
  ADD COLUMN IF NOT EXISTS card_type       TEXT,
  ADD COLUMN IF NOT EXISTS expiry_month    INTEGER,
  ADD COLUMN IF NOT EXISTS expiry_year     INTEGER,
  ADD COLUMN IF NOT EXISTS billing_name    TEXT,
  ADD COLUMN IF NOT EXISTS billing_address JSONB,
  ADD COLUMN IF NOT EXISTS is_default      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS created_at      TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE kajapay_webhook_events
  ADD COLUMN IF NOT EXISTS event_type              TEXT,
  ADD COLUMN IF NOT EXISTS kajapay_transaction_id  BIGINT,
  ADD COLUMN IF NOT EXISTS order_id                TEXT,
  ADD COLUMN IF NOT EXISTS payload                 JSONB,
  ADD COLUMN IF NOT EXISTS processed               BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS processed_at            TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS error_message           TEXT,
  ADD COLUMN IF NOT EXISTS created_at              TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Indexes
CREATE INDEX IF NOT EXISTS idx_pt_order_id  ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_pt_user_id   ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_pt_kp_id     ON payment_transactions(kajapay_transaction_id);
CREATE INDEX IF NOT EXISTS idx_pt_status    ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_kwe_kp_id    ON kajapay_webhook_events(kajapay_transaction_id);
CREATE INDEX IF NOT EXISTS idx_kwe_order_id ON kajapay_webhook_events(order_id);
CREATE INDEX IF NOT EXISTS idx_pm_user_id   ON payment_methods(user_id);

-- Step 3: Trigger function + triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pt_updated_at ON payment_transactions;
CREATE TRIGGER trg_pt_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_pm_updated_at ON payment_methods;
CREATE TRIGGER trg_pm_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 4: RLS
ALTER TABLE payment_transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods        ENABLE ROW LEVEL SECURITY;
ALTER TABLE kajapay_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_read_own_transactions" ON payment_transactions;
CREATE POLICY "user_read_own_transactions" ON payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_read_own_methods" ON payment_methods;
CREATE POLICY "user_read_own_methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "service_all_transactions" ON payment_transactions;
CREATE POLICY "service_all_transactions" ON payment_transactions
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_all_methods" ON payment_methods;
CREATE POLICY "service_all_methods" ON payment_methods
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_all_webhooks" ON kajapay_webhook_events;
CREATE POLICY "service_all_webhooks" ON kajapay_webhook_events
  FOR ALL USING (auth.role() = 'service_role');

-- Step 5: Account Dashboard view
CREATE OR REPLACE VIEW account_payment_history AS
SELECT pt.id, pt.user_id, pt.order_id,
  pt.transaction_type, pt.amount, pt.currency, pt.status,
  pt.kajapay_transaction_id, pt.auth_code,
  pt.masked_card_number, pt.card_type,
  pt.kajapay_response_text, pt.age_verified,
  pt.created_at, pt.settled_at
FROM payment_transactions pt
ORDER BY pt.created_at DESC;

GRANT SELECT ON account_payment_history TO authenticated;
