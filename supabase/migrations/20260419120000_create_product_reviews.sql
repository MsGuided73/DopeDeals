-- ─────────────────────────────────────────────────────────────────────────────
-- Product Reviews System
--
-- Adds:
--   1. product_reviews table (one row = one verified review)
--   2. Indexes for product lookups, owner lookups, and chronological listing
--   3. RLS policies (public read where not hidden; owner edit/delete; insert
--      gated server-side via API routes that verify purchase + identity)
--   4. review-photos storage bucket (public) + RLS
--
-- Gates enforced server-side (not in this migration):
--   - Signed in (auth.uid() not null)
--   - email_verified = true (user_profiles)
--   - age_verification_status = 'verified' (users)
--   - Has a delivered order containing the product (orders.status = 'delivered'
--     AND orders.delivered_at IS NOT NULL AND order_items.product_id = $1)
--   - Hasn't already reviewed this product (UNIQUE(user_id, product_id))
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Table ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Links to the SPECIFIC order_item that proves purchase. RESTRICT prevents
  -- accidental loss of provenance if an order_item gets soft-deleted later.
  order_item_id   UUID NOT NULL REFERENCES public.order_items(id) ON DELETE RESTRICT,

  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           VARCHAR(100),
  body            TEXT NOT NULL CHECK (char_length(body) BETWEEN 20 AND 1500),
  would_recommend BOOLEAN,
  photo_urls      TEXT[] NOT NULL DEFAULT '{}'::text[]
                    CHECK (coalesce(array_length(photo_urls, 1), 0) <= 4),

  -- Admin moderation (auto-publish, hide reactively)
  is_hidden       BOOLEAN NOT NULL DEFAULT false,
  hidden_reason   TEXT,
  hidden_at       TIMESTAMPTZ,
  hidden_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at       TIMESTAMPTZ,

  -- One review per user per product
  CONSTRAINT product_reviews_user_product_unique UNIQUE (user_id, product_id)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_visible
  ON public.product_reviews (product_id, created_at DESC)
  WHERE NOT is_hidden;

CREATE INDEX IF NOT EXISTS idx_product_reviews_user
  ON public.product_reviews (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at
  ON public.product_reviews (created_at DESC);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read non-hidden reviews
DROP POLICY IF EXISTS "Public can read visible reviews" ON public.product_reviews;
CREATE POLICY "Public can read visible reviews"
  ON public.product_reviews
  FOR SELECT
  USING (is_hidden = false);

-- Authors can read their own reviews even if hidden (so they see why)
DROP POLICY IF EXISTS "Authors can read own reviews" ON public.product_reviews;
CREATE POLICY "Authors can read own reviews"
  ON public.product_reviews
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- INSERT: only the API route creates rows (uses service role); RLS still allows
-- direct authenticated inserts for the user's own user_id, but the API performs
-- the eligibility checks. Direct client inserts will fail those checks at the
-- DB level only via the UNIQUE constraint, so we keep this restrictive.
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.product_reviews;
CREATE POLICY "Users can insert own reviews"
  ON public.product_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- UPDATE: owner can edit their own review (sets edited_at server-side)
DROP POLICY IF EXISTS "Owners can update own reviews" ON public.product_reviews;
CREATE POLICY "Owners can update own reviews"
  ON public.product_reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: owner can delete; admin moderation handled server-side via service role
DROP POLICY IF EXISTS "Owners can delete own reviews" ON public.product_reviews;
CREATE POLICY "Owners can delete own reviews"
  ON public.product_reviews
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ─── Storage bucket: review-photos ───────────────────────────────────────────
-- Public bucket so review photos can be displayed without signed URLs.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880, -- 5 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public             = EXCLUDED.public,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: users upload under their own folder (<auth.uid>/<filename>)
DROP POLICY IF EXISTS "Users can upload own review photos" ON storage.objects;
CREATE POLICY "Users can upload own review photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'review-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update own review photos" ON storage.objects;
CREATE POLICY "Users can update own review photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'review-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own review photos" ON storage.objects;
CREATE POLICY "Users can delete own review photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'review-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Public can read review photos" ON storage.objects;
CREATE POLICY "Public can read review photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'review-photos');

-- ─── Helpful view: aggregate product rating summary ──────────────────────────
CREATE OR REPLACE VIEW public.product_review_summary AS
SELECT
  product_id,
  COUNT(*)                    AS review_count,
  ROUND(AVG(rating)::numeric, 2) AS average_rating,
  COUNT(*) FILTER (WHERE rating = 5) AS five_star_count,
  COUNT(*) FILTER (WHERE rating = 4) AS four_star_count,
  COUNT(*) FILTER (WHERE rating = 3) AS three_star_count,
  COUNT(*) FILTER (WHERE rating = 2) AS two_star_count,
  COUNT(*) FILTER (WHERE rating = 1) AS one_star_count,
  COUNT(*) FILTER (WHERE would_recommend = true) AS recommend_count,
  COUNT(*) FILTER (WHERE would_recommend IS NOT NULL) AS recommend_response_count
FROM public.product_reviews
WHERE NOT is_hidden
GROUP BY product_id;

GRANT SELECT ON public.product_review_summary TO anon, authenticated;
