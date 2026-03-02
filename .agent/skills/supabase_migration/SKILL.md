---
name: supabase_migration
description: How to run SQL migrations against the Supabase project for DopeDeals / Highway 420. Covers the correct auth method, reliable execution order, and what to do when common failure modes occur.
---

# Supabase Migration Skill

## Project Reference

- **Project ID:** `qirbapivptotybspnbet`
- **Supabase URL:** `https://qirbapivptotybspnbet.supabase.co`
- **Credentials location:** `.env` in the project root

## Credentials Available (from `.env`)

| Variable                            | Purpose                                             |
| ----------------------------------- | --------------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` (`sbp_...`) | Supabase Personal Access Token — for Management API |
| `SUPABASE_SERVICE_ROLE_KEY`         | JWT service-role key — for supabase-js client calls |
| `DATABASE_URL`                      | Direct Postgres connection string                   |

## Recommended Approach: Management API + sbp\_ Token

> [!IMPORTANT]
> The MCP `apply_migration` and `execute_sql` tools frequently drop their connection on larger SQL payloads. Always use the Management API as the primary method.

### Correct Endpoint

```
POST https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query
Authorization: Bearer {SUPABASE_ACCESS_TOKEN}
Content-Type: application/json

Body: { "query": "<SQL here>" }
```

### Node.js Runner Script Pattern

Create a one-shot runner in `/tmp/` (or use `scripts/run-migration.js`):

```js
const fs = require("fs");
const sql = fs.readFileSync("scripts/your_migration.sql", "utf8");

fetch(
  "https://api.supabase.com/v1/projects/qirbapivptotybspnbet/database/query",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  },
)
  .then((r) => r.json())
  .then((d) => {
    if (d.error) {
      console.error("Migration error:", d);
      process.exit(1);
    }
    console.log("Migration successful:", d);
  })
  .catch((e) => {
    console.error("Network error:", e.message);
    process.exit(1);
  });
```

Run with:

```powershell
$env:SUPABASE_ACCESS_TOKEN="sbp_61a3b71688cc4fe39e0f31fa2082848eba92156d"
node /tmp/run_migration.js
```

## Fallback: supabase-js Service Role Client

Use this to verify connectivity or run simple read checks (NOT for DDL):

```js
const { createClient } = require("@supabase/supabase-js");
const client = createClient(
  "https://qirbapivptotybspnbet.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const { data, error } = await client.from("orders").select("id").limit(1);
```

## Fallback: existing migration runner

The project has `scripts/run-migration.js` — check it first; it may already handle auth.

## Failure Modes & Fixes

| Error                                              | Fix                                                                                                                                                                                |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MCP `execute_sql` / `apply_migration` returns EOF  | Connection drop on large payload — use Management API instead                                                                                                                      |
| `psql: not recognized`                             | psql not installed locally — use API approach                                                                                                                                      |
| `self-signed certificate` SSL error with pg client | Add `ssl: { rejectUnauthorized: false }` to pg Client options                                                                                                                      |
| `{"message":"Unauthorized"}` from Management API   | Verify sbp\_ token is not expired; regenerate from Supabase Dashboard → Account → Access Tokens                                                                                    |
| `relation "users" does not exist`                  | The `users` table in this project is managed by Supabase Auth (`auth.users`). Our `public.users` table mirrors it. Check that the target table exists before adding FK references. |

## Migration File Conventions

- Store all migration SQL in `scripts/` as `migration_<description>.sql`
- Use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` for idempotency
- Always pair DDL with RLS policies and `ENABLE ROW LEVEL SECURITY`
- Add `update_updated_at_column()` trigger for any table with an `updated_at` column
- After running, verify with: `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;`
