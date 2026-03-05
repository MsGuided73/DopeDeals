-- Migration: Add User Addresses Table
-- Description: Creates the user_addresses table to store shipping and billing addresses for users.

CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('shipping', 'billing')),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.user_addresses;
CREATE POLICY "Users can view their own addresses" 
    ON public.user_addresses FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.user_addresses;
CREATE POLICY "Users can insert their own addresses" 
    ON public.user_addresses FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own addresses" ON public.user_addresses;
CREATE POLICY "Users can update their own addresses" 
    ON public.user_addresses FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.user_addresses;
CREATE POLICY "Users can delete their own addresses" 
    ON public.user_addresses FOR DELETE 
    USING (auth.uid() = user_id);

-- Add trigger for updated_at
-- Depends on update_updated_at_column() existing from previous migrations
DROP TRIGGER IF EXISTS set_updated_at ON public.user_addresses;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
