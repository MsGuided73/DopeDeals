// Shims to allow app-only typecheck without pulling in server/* implementation types
// These prevent tsc from traversing server code during the scoped typecheck

declare module "../../../server/storage" {
  export const storage: any;
}

declare module "../../../server/supabase-storage" {
  export const supabaseAdmin: any;
}

