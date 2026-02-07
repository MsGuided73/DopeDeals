"use client";
import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client using NEXT_PUBLIC_ env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables! Check .env.local');
}

export const supabaseBrowser = createBrowserClient(
  supabaseUrl!,
  supabaseAnonKey!
);

