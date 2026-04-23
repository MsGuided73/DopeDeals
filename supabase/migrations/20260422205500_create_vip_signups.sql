CREATE TABLE IF NOT EXISTS public.vip_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.vip_signups ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (unauthenticated users signing up)
CREATE POLICY "Allow public insert to vip_signups" ON public.vip_signups
    FOR INSERT TO public
    WITH CHECK (true);

-- Only service role can select
CREATE POLICY "Allow service role to read vip_signups" ON public.vip_signups
    FOR SELECT TO service_role
    USING (true);
