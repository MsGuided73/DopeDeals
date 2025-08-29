import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client. Prefer SUPABASE_URL; fall back to NEXT_PUBLIC_SUPABASE_URL for dev.
export const supabaseServer = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

