# Task Tracker: Edge Runtime Compatibility & Cleanup

| Task | Status | Notes |
| :--- | :--- | :--- |
| Remove "Highway 420 Sign" from floating nav | [x] | Addressed branding issue in `FloatingNav.tsx`. |
| Remove `@supabase/ssr` from `middleware.ts` | [x] | Switched to cookie-based auth check to avoid Edge runtime errors. |
| Audit for abandoned variation/variable logic | [x] | Verified remnants are standard e-commerce variants. Edge warnings were solely due to Supabase pulling `process.version`. |
| Force `nodejs` runtime on server handlers | [x] | Added `export const runtime = 'nodejs';` to files importing `@supabase/ssr`. |
| Verify fix with `pnpm run build` | [x] | Build progresses past Edge warnings successfully. |
