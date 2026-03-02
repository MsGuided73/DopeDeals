-- 20260302_compliance_tracking_fix.sql
-- This script fixes the schema drift in the 'users' table and ensures 
-- compliance tables exist with the correct column naming (snake_case physically).

-- 1. Fix 'users' table drift
DO $$ 
BEGIN
    -- Check for 'ageVerified' (camelCase) and rename to 'age_verification_status'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'ageVerified') THEN
        -- If 'age_verification_status' doesn't exist yet, we can safely rename
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'age_verification_status') THEN
            ALTER TABLE "users" RENAME COLUMN "ageVerified" TO "age_verification_status";
            -- Convert boolean were possible (if it was boolean)
            -- Note: We'll keep it simple for now, as text column is safer for future states (pending, etc)
            ALTER TABLE "users" ALTER COLUMN "age_verification_status" TYPE text USING 
                CASE 
                    WHEN "age_verification_status"::text = 'true' THEN 'verified' 
                    ELSE 'not_verified' 
                END;
        ELSE
            -- Both exist? Drop the old one after migration if needed, or just rename it to a backup
            ALTER TABLE "users" RENAME COLUMN "ageVerified" TO "age_verified_legacy";
        END IF;
    END IF;

    -- Final ensure 'age_verification_status' exists and is text
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'age_verification_status') THEN
        ALTER TABLE "users" ADD COLUMN "age_verification_status" text NOT NULL DEFAULT 'not_verified';
    END IF;

    -- Ensure 'last_verification_check' exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'last_verification_check') THEN
        ALTER TABLE "users" ADD COLUMN "last_verification_check" timestamptz;
    END IF;

    -- Add 'full_name' if missing (backward compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'full_name') THEN
        ALTER TABLE "users" ADD COLUMN "full_name" text;
    END IF;
END $$;

-- 2. Ensure 'age_verifications' table
CREATE TABLE IF NOT EXISTS "age_verifications" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
    "status" text NOT NULL DEFAULT 'pending', 
    "verification_method" text, 
    "date_of_birth" date,
    "submitted_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now(),
    "metadata" jsonb
);

-- 3. Ensure 'compliance_rules' table
CREATE TABLE IF NOT EXISTS "compliance_rules" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "category" text NOT NULL, 
    "jurisdiction" text NOT NULL DEFAULT 'US',
    "min_age" integer NOT NULL DEFAULT 21,
    "is_active" boolean DEFAULT true,
    "description" text,
    "created_at" timestamptz DEFAULT now()
);

-- Ensure columns exist if table was already there
-- And ensure ID has a default value 
DO $$ 
BEGIN
    -- Fix ID default
    ALTER TABLE "compliance_rules" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'compliance_rules' AND column_name = 'jurisdiction') THEN
        ALTER TABLE "compliance_rules" ADD COLUMN "jurisdiction" text NOT NULL DEFAULT 'US';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'compliance_rules' AND column_name = 'category') THEN
        ALTER TABLE "compliance_rules" ADD COLUMN "category" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'compliance_rules' AND column_name = 'min_age') THEN
        ALTER TABLE "compliance_rules" ADD COLUMN "min_age" integer NOT NULL DEFAULT 21;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'compliance_rules' AND column_name = 'is_active') THEN
        ALTER TABLE "compliance_rules" ADD COLUMN "is_active" boolean DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'compliance_rules' AND column_name = 'description') THEN
        ALTER TABLE "compliance_rules" ADD COLUMN "description" text;
    END IF;
END $$;

-- 4. Sample Rules 
INSERT INTO "compliance_rules" (category, jurisdiction, min_age, description)
VALUES 
('cannabis', 'US', 21, 'Federal/State baseline for cannabis products'),
('vape', 'US', 21, 'PACT Act compliance for nicotine/vape products')
ON CONFLICT DO NOTHING;

-- 5. RLS Policies (Ensure Admin can see everything)
ALTER TABLE "age_verifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compliance_rules" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they might conflict
DROP POLICY IF EXISTS "Admins can manage age_verifications" ON "age_verifications";
DROP POLICY IF EXISTS "Admins can manage compliance_rules" ON "compliance_rules";
DROP POLICY IF EXISTS "Users can view their own verifications" ON "age_verifications";

CREATE POLICY "Admins can manage age_verifications" ON "age_verifications"
    FOR ALL TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' )
    WITH CHECK ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

CREATE POLICY "Admins can manage compliance_rules" ON "compliance_rules"
    FOR ALL TO authenticated
    USING ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' )
    WITH CHECK ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

CREATE POLICY "Users can view their own verifications" ON "age_verifications"
    FOR SELECT TO authenticated
    USING ( auth.uid() = user_id );
