"use client";
import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client using NEXT_PUBLIC_ env vars
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

