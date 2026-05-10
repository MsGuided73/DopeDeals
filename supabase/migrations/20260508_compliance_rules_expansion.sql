-- 20260508_compliance_rules_expansion.sql
--
-- Expands the compliance schema to fully encode hemp-derived cannabinoid
-- shipping/restriction data: per-carrier policies, state-specific potency
-- limits, sub-state (city/county) jurisdictions, source-of-record reports,
-- and a review audit trail to support a weekly compliance-review cadence.
--
-- Major changes:
--   1. compliance_rules: add columns for synthetic flag, Nov 2026 federal
--      changes (Total THC standard, 0.4mg cap, intermediate-product rule),
--      effective windows, seizure risk, description, and review tracking.
--   2. carrier_policies: per-(rule, carrier) shipping policy with structured
--      requirements and prohibited-items arrays.
--   3. compliance_state_limits: state/city-level potency caps and outright
--      bans that don't fit a single column on compliance_rules.
--   4. compliance_review_log: append-only audit trail of every manual review
--      or update event across compliance tables.
--   5. compliance_reports: source documents of record (the underlying JSON
--      reports we ingest), keyed by report_date.
--   6. set_compliance_updated_at(): shared trigger function that maintains
--      last_updated_at on every row mutation.
--   7. next_review_due_at: STORED generated column = last_reviewed_at + 7d,
--      indexed for the "what's overdue?" admin view.
--
-- Backwards compatibility:
--   - Existing compliance_rules rows are NOT modified or deleted. New columns
--     default to NULL or sensible values. The companion data-load script
--     (scripts/ingest-compliance-report-2026-03-03.ts) is what marks legacy
--     rows as superseded by setting effective_until and inserting new rows.
--   - product_compliance FKs continue to point at compliance_rules.id; no
--     existing links break.
--
-- Rollback sketch (destructive — coordinate before running):
--   DROP TABLE IF EXISTS compliance_reports CASCADE;
--   DROP TABLE IF EXISTS compliance_review_log CASCADE;
--   DROP TABLE IF EXISTS compliance_state_limits CASCADE;
--   DROP TABLE IF EXISTS carrier_policies CASCADE;
--   ALTER TABLE compliance_rules DROP COLUMN IF EXISTS synthetic, ...;
--   DROP FUNCTION IF EXISTS set_compliance_updated_at();

BEGIN;

-- ============================================================================
-- 1. Shared trigger function: maintain last_updated_at on UPDATE.
--    Idempotent CREATE OR REPLACE — safe to re-run.
-- ============================================================================
CREATE OR REPLACE FUNCTION set_compliance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 2. Extend compliance_rules with new columns.
--    Each column added with IF NOT EXISTS so this migration is re-runnable
--    even if partially applied previously.
-- ============================================================================
ALTER TABLE compliance_rules
  ADD COLUMN IF NOT EXISTS synthetic                       boolean      DEFAULT false,
  ADD COLUMN IF NOT EXISTS excluded_from_hemp_at           date,
  ADD COLUMN IF NOT EXISTS effective_from                  date         DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS effective_until                 date,
  ADD COLUMN IF NOT EXISTS total_thc_limit_mg_per_container numeric(10,3),
  ADD COLUMN IF NOT EXISTS total_thc_formula               text,
  ADD COLUMN IF NOT EXISTS description                     text,
  ADD COLUMN IF NOT EXISTS seizure_risk_level              text,
  ADD COLUMN IF NOT EXISTS intermediate_product_restricted boolean      DEFAULT false,
  ADD COLUMN IF NOT EXISTS misc_restrictions               jsonb        DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS source_report_id                uuid,
  ADD COLUMN IF NOT EXISTS last_reviewed_at                timestamptz,
  ADD COLUMN IF NOT EXISTS last_updated_at                 timestamptz  DEFAULT now(),
  ADD COLUMN IF NOT EXISTS reviewed_by                     uuid;

-- Constrain seizure_risk_level to known values; drop-and-recreate so re-runs
-- don't accumulate duplicate constraints.
ALTER TABLE compliance_rules
  DROP CONSTRAINT IF EXISTS compliance_rules_seizure_risk_chk;
ALTER TABLE compliance_rules
  ADD CONSTRAINT compliance_rules_seizure_risk_chk
  CHECK (seizure_risk_level IS NULL OR seizure_risk_level IN ('low', 'medium', 'high', 'very_high'));

-- Generated column (STORED) for "next review due" — last_reviewed_at + 7 days.
-- Postgres requires generated-column expressions to be IMMUTABLE; an interval
-- add on a timestamptz column qualifies. We can't use IF NOT EXISTS on
-- generated columns, so guard it manually.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'compliance_rules'
      AND column_name = 'next_review_due_at'
  ) THEN
    ALTER TABLE compliance_rules
      ADD COLUMN next_review_due_at timestamptz
      GENERATED ALWAYS AS (last_reviewed_at + INTERVAL '7 days') STORED;
  END IF;
END $$;

-- Trigger: keep last_updated_at fresh on every UPDATE.
DROP TRIGGER IF EXISTS trg_compliance_rules_updated_at ON compliance_rules;
CREATE TRIGGER trg_compliance_rules_updated_at
  BEFORE UPDATE ON compliance_rules
  FOR EACH ROW
  EXECUTE FUNCTION set_compliance_updated_at();

CREATE INDEX IF NOT EXISTS idx_compliance_rules_category          ON compliance_rules (category);
CREATE INDEX IF NOT EXISTS idx_compliance_rules_effective_window  ON compliance_rules (effective_from, effective_until);
CREATE INDEX IF NOT EXISTS idx_compliance_rules_next_review_due   ON compliance_rules (next_review_due_at) WHERE effective_until IS NULL;


-- ============================================================================
-- 3. carrier_policies — per-(rule, carrier) shipping policy.
-- ============================================================================
CREATE TABLE IF NOT EXISTS carrier_policies (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id             uuid NOT NULL REFERENCES compliance_rules(id) ON DELETE CASCADE,
  carrier             text NOT NULL,
  status              text NOT NULL,
  requirements        text[]        DEFAULT '{}',
  prohibited_items    text[]        DEFAULT '{}',
  exceptions          text,
  notes               text,
  source_report_id    uuid,
  last_reviewed_at    timestamptz,
  last_updated_at     timestamptz   DEFAULT now(),
  reviewed_by         uuid,
  next_review_due_at  timestamptz   GENERATED ALWAYS AS (last_reviewed_at + INTERVAL '7 days') STORED,
  created_at          timestamptz   DEFAULT now()
);

ALTER TABLE carrier_policies
  DROP CONSTRAINT IF EXISTS carrier_policies_carrier_chk;
ALTER TABLE carrier_policies
  ADD CONSTRAINT carrier_policies_carrier_chk
  CHECK (carrier IN ('USPS', 'UPS', 'FedEx', 'DHL', 'OnTrac', 'Other'));

ALTER TABLE carrier_policies
  DROP CONSTRAINT IF EXISTS carrier_policies_status_chk;
ALTER TABLE carrier_policies
  ADD CONSTRAINT carrier_policies_status_chk
  CHECK (status IN ('permitted', 'gray_area', 'conditional', 'prohibited'));

-- One row per (rule, carrier) pair.
CREATE UNIQUE INDEX IF NOT EXISTS idx_carrier_policies_rule_carrier
  ON carrier_policies (rule_id, carrier);

CREATE INDEX IF NOT EXISTS idx_carrier_policies_status
  ON carrier_policies (status);
CREATE INDEX IF NOT EXISTS idx_carrier_policies_next_review_due
  ON carrier_policies (next_review_due_at);

DROP TRIGGER IF EXISTS trg_carrier_policies_updated_at ON carrier_policies;
CREATE TRIGGER trg_carrier_policies_updated_at
  BEFORE UPDATE ON carrier_policies
  FOR EACH ROW
  EXECUTE FUNCTION set_compliance_updated_at();


-- ============================================================================
-- 4. compliance_state_limits — state/city-level potency caps and outright bans.
--    Captures things like "CT: 3mg/container", "MN: 5mg/serving, 50mg/package",
--    "Chicago, IL: outright ban on hemp-derived edibles".
-- ============================================================================
CREATE TABLE IF NOT EXISTS compliance_state_limits (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id             uuid NOT NULL REFERENCES compliance_rules(id) ON DELETE CASCADE,
  jurisdiction_type   text NOT NULL,
  state_abbr          text NOT NULL,
  jurisdiction_name   text,
  limit_type          text NOT NULL,
  limit_value_mg      numeric(10,3),
  is_outright_ban     boolean      DEFAULT false,
  citation            text,
  notes               text,
  source_report_id    uuid,
  last_reviewed_at    timestamptz,
  last_updated_at     timestamptz  DEFAULT now(),
  reviewed_by         uuid,
  next_review_due_at  timestamptz  GENERATED ALWAYS AS (last_reviewed_at + INTERVAL '7 days') STORED,
  created_at          timestamptz  DEFAULT now()
);

ALTER TABLE compliance_state_limits
  DROP CONSTRAINT IF EXISTS compliance_state_limits_jurisdiction_chk;
ALTER TABLE compliance_state_limits
  ADD CONSTRAINT compliance_state_limits_jurisdiction_chk
  CHECK (jurisdiction_type IN ('state', 'city', 'county', 'territory'));

ALTER TABLE compliance_state_limits
  DROP CONSTRAINT IF EXISTS compliance_state_limits_limit_type_chk;
ALTER TABLE compliance_state_limits
  ADD CONSTRAINT compliance_state_limits_limit_type_chk
  CHECK (limit_type IN (
    'per_serving_mg',
    'per_container_mg',
    'per_package_mg',
    'total_thc_per_container_mg',
    'outright_ban',
    'licensed_only',
    'smokable_ban',
    'inhalable_ban',
    'consumable_only',
    'other'
  ));

CREATE INDEX IF NOT EXISTS idx_compliance_state_limits_rule_state
  ON compliance_state_limits (rule_id, state_abbr);
CREATE INDEX IF NOT EXISTS idx_compliance_state_limits_state
  ON compliance_state_limits (state_abbr);
CREATE INDEX IF NOT EXISTS idx_compliance_state_limits_next_review_due
  ON compliance_state_limits (next_review_due_at);

DROP TRIGGER IF EXISTS trg_compliance_state_limits_updated_at ON compliance_state_limits;
CREATE TRIGGER trg_compliance_state_limits_updated_at
  BEFORE UPDATE ON compliance_state_limits
  FOR EACH ROW
  EXECUTE FUNCTION set_compliance_updated_at();


-- ============================================================================
-- 5. compliance_review_log — append-only audit trail of review events.
--    One row per review event (manual or automated). NOT a per-read access log.
-- ============================================================================
CREATE TABLE IF NOT EXISTS compliance_review_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name    text NOT NULL,
  record_id     uuid NOT NULL,
  action        text NOT NULL,
  reviewed_by   uuid,
  reviewer_name text,
  diff          jsonb,
  source        text,
  notes         text,
  reviewed_at   timestamptz DEFAULT now()
);

ALTER TABLE compliance_review_log
  DROP CONSTRAINT IF EXISTS compliance_review_log_table_chk;
ALTER TABLE compliance_review_log
  ADD CONSTRAINT compliance_review_log_table_chk
  CHECK (table_name IN (
    'compliance_rules',
    'carrier_policies',
    'compliance_state_limits',
    'compliance_reports'
  ));

ALTER TABLE compliance_review_log
  DROP CONSTRAINT IF EXISTS compliance_review_log_action_chk;
ALTER TABLE compliance_review_log
  ADD CONSTRAINT compliance_review_log_action_chk
  CHECK (action IN (
    'created',
    'updated',
    'deactivated',
    'reactivated',
    'reviewed_no_change',
    'imported_from_report'
  ));

ALTER TABLE compliance_review_log
  DROP CONSTRAINT IF EXISTS compliance_review_log_source_chk;
ALTER TABLE compliance_review_log
  ADD CONSTRAINT compliance_review_log_source_chk
  CHECK (source IS NULL OR source IN (
    'manual_review',
    'admin_edit',
    'report_ingest',
    'automated_check'
  ));

CREATE INDEX IF NOT EXISTS idx_compliance_review_log_record
  ON compliance_review_log (table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_compliance_review_log_reviewed_at
  ON compliance_review_log (reviewed_at DESC);


-- ============================================================================
-- 6. compliance_reports — source documents of record.
--    The raw JSON reports we ingest, kept verbatim for audit traceability.
-- ============================================================================
CREATE TABLE IF NOT EXISTS compliance_reports (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text NOT NULL,
  report_date         date NOT NULL,
  effective_as_of     text,
  federal_changes     jsonb,
  raw_payload         jsonb NOT NULL,
  source_url          text,
  ingested_at         timestamptz DEFAULT now(),
  ingested_by         uuid,
  notes               text
);

CREATE INDEX IF NOT EXISTS idx_compliance_reports_report_date
  ON compliance_reports (report_date DESC);


-- ============================================================================
-- 7. Wire up the source_report_id FKs now that compliance_reports exists.
--    Done after the table is created so the references resolve.
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'compliance_rules_source_report_fk'
      AND table_name = 'compliance_rules'
  ) THEN
    ALTER TABLE compliance_rules
      ADD CONSTRAINT compliance_rules_source_report_fk
      FOREIGN KEY (source_report_id) REFERENCES compliance_reports(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'carrier_policies_source_report_fk'
      AND table_name = 'carrier_policies'
  ) THEN
    ALTER TABLE carrier_policies
      ADD CONSTRAINT carrier_policies_source_report_fk
      FOREIGN KEY (source_report_id) REFERENCES compliance_reports(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'compliance_state_limits_source_report_fk'
      AND table_name = 'compliance_state_limits'
  ) THEN
    ALTER TABLE compliance_state_limits
      ADD CONSTRAINT compliance_state_limits_source_report_fk
      FOREIGN KEY (source_report_id) REFERENCES compliance_reports(id) ON DELETE SET NULL;
  END IF;
END $$;


-- ============================================================================
-- 8. Admin convenience view: rules whose review window has lapsed.
--    Used by the admin UI to surface "what needs my attention this week."
-- ============================================================================
CREATE OR REPLACE VIEW compliance_review_overdue AS
SELECT
  'compliance_rules'::text  AS table_name,
  id                        AS record_id,
  category                  AS label,
  last_reviewed_at,
  next_review_due_at,
  EXTRACT(EPOCH FROM (now() - next_review_due_at)) / 86400 AS days_overdue
FROM compliance_rules
WHERE effective_until IS NULL
  AND (next_review_due_at IS NULL OR next_review_due_at < now())

UNION ALL

SELECT
  'carrier_policies'::text  AS table_name,
  cp.id                     AS record_id,
  cp.carrier || ' / ' || cr.category AS label,
  cp.last_reviewed_at,
  cp.next_review_due_at,
  EXTRACT(EPOCH FROM (now() - cp.next_review_due_at)) / 86400 AS days_overdue
FROM carrier_policies cp
JOIN compliance_rules cr ON cr.id = cp.rule_id
WHERE cr.effective_until IS NULL
  AND (cp.next_review_due_at IS NULL OR cp.next_review_due_at < now())

UNION ALL

SELECT
  'compliance_state_limits'::text AS table_name,
  csl.id                          AS record_id,
  csl.state_abbr || ' / ' || cr.category AS label,
  csl.last_reviewed_at,
  csl.next_review_due_at,
  EXTRACT(EPOCH FROM (now() - csl.next_review_due_at)) / 86400 AS days_overdue
FROM compliance_state_limits csl
JOIN compliance_rules cr ON cr.id = csl.rule_id
WHERE cr.effective_until IS NULL
  AND (csl.next_review_due_at IS NULL OR csl.next_review_due_at < now());


-- ============================================================================
-- 9. RLS: match the existing pattern from 20260302_compliance_tracking_fix.sql
--    where compliance_rules is admin-managed. Reads should remain accessible
--    server-side via the service-role key, so we keep policies tight.
-- ============================================================================
ALTER TABLE carrier_policies          ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_state_limits   ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_review_log     ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports        ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies idempotently.
DROP POLICY IF EXISTS "Admins can manage carrier_policies"        ON carrier_policies;
DROP POLICY IF EXISTS "Admins can manage compliance_state_limits" ON compliance_state_limits;
DROP POLICY IF EXISTS "Admins can manage compliance_review_log"   ON compliance_review_log;
DROP POLICY IF EXISTS "Admins can manage compliance_reports"      ON compliance_reports;

CREATE POLICY "Admins can manage carrier_policies"
  ON carrier_policies
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND (u.role = 'admin' OR u.is_admin = true)
    )
  );

CREATE POLICY "Admins can manage compliance_state_limits"
  ON compliance_state_limits
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND (u.role = 'admin' OR u.is_admin = true)
    )
  );

CREATE POLICY "Admins can manage compliance_review_log"
  ON compliance_review_log
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND (u.role = 'admin' OR u.is_admin = true)
    )
  );

CREATE POLICY "Admins can manage compliance_reports"
  ON compliance_reports
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
        AND (u.role = 'admin' OR u.is_admin = true)
    )
  );

COMMIT;
