-- Migration: Populate compliance rules for State Prohibitions
-- Description: Ensures the database correctly flags restricted states for high-risk categories like THCA and Delta-8.
-- Execution: Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new

-- 1. Insert Base Compliance Rules (Idempotent using ON CONFLICT logic assuming an index exists, or we simply INSERT and rely on the fact that these might be new)
-- Since we don't have a unique constraint specifically, we will use a safe DELETE then INSERT approach to ensure the rules are perfectly aligned with lib/compliance-data.ts

DELETE FROM public.compliance_rules WHERE category IN ('THCA', 'Delta-8', 'Nicotine', 'Kratom');

INSERT INTO public.compliance_rules (category, substance_type, restricted_states, age_requirement, warning_labels)
VALUES
  (
    'THCA', 
    'Intoxicating Hemp Derivative', 
    ARRAY['AK', 'AZ', 'AR', 'CO', 'DE', 'HI', 'ID', 'IA', 'KS', 'MI', 'MS', 'MT', 'NV', 'NY', 'ND', 'OR', 'RI', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'CA'], 
    21, 
    ARRAY['Not FDA approved', 'State restrictions apply']
  ),
  (
    'Delta-8', 
    'Intoxicating Hemp Derivative', 
    ARRAY['AK', 'AZ', 'AR', 'CO', 'DE', 'HI', 'ID', 'IA', 'KS', 'MI', 'MS', 'MT', 'NV', 'NY', 'ND', 'OR', 'RI', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'CA'], 
    21, 
    ARRAY['Not FDA approved', 'State restrictions apply']
  ),
  (
    'Nicotine', 
    'Tobacco Product', 
    ARRAY[]::text[], -- Nicotine is restricted by age/ID, not necessarily banned outright universally, but we flag it
    21, 
    ARRAY['WARNING: This product contains nicotine. Nicotine is an addictive chemical.']
  ),
  (
    'Kratom', 
    'Mitragyna speciosa', 
    ARRAY['AL', 'AR', 'IN', 'RI', 'VT', 'WI'], 
    21, 
    ARRAY['Not FDA approved for human consumption']
  );

-- 2. Link products to these new rules based on their category
-- This ensures the eligibility API actually catches the specific items in the cart.
-- We use main_site_products to match Highway 420's schema.

INSERT INTO public.product_compliance (product_id, compliance_id)
SELECT p.id, c.id
FROM public.main_site_products p
CROSS JOIN public.compliance_rules c
WHERE 
  (p.category ILIKE '%THCA%' AND c.category = 'THCA')
  OR (p.name ILIKE '%THCA%' AND c.category = 'THCA')
  OR (p.category ILIKE '%Delta-8%' AND c.category = 'Delta-8')
  OR (p.name ILIKE '%Delta-8%' AND c.category = 'Delta-8')
ON CONFLICT DO NOTHING;
