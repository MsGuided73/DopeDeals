---
name: supabase_migration
description: How to run SQL migrations against the Supabase project for Highway420 / Highway 420. Covers the correct auth method, reliable execution order, and what to do when common failure modes occur.
---

# Supabase Migration Skill

## Project Reference

- **Project ID:** `qirbapivptotybspnbet`
- **Supabase URL:** `https://qirbapivptotybspnbet.supabase.co`
- **Credentials location:** `.env` in the project root

## ✅ Confirmed Working Method: Supabase Dashboard SQL Editor

> [!IMPORTANT]
> For this project, the **Supabase Dashboard SQL Editor is the only reliable way to run migrations**. All programmatic methods below have been tested and failed. Always direct the user to run SQL here:
> **https://supabase.com/dashboard/project/qirbapivptotybspnbet/sql/new**

**Best practice:** For large migrations, break into 2 runs:

1. Table `CREATE` statements
2. Indexes, triggers, RLS policies, views/grants

## ❌ Other Methods (All Fail on This Project)

| Method                                                        | Outcome                                     |
| ------------------------------------------------------------- | ------------------------------------------- |
| MCP `apply_migration`                                         | EOF / connection drop on any payload        |
| MCP `execute_sql`                                             | EOF / connection drop                       |
| `psql` CLI                                                    | Not installed on this Windows machine       |
| Node.js `pg` client                                           | SSL cert error; password auth fails         |
| Supabase Management API (`/v1/projects/{ref}/database/query`) | Returns 401 Unauthorized with sbp\_ token   |
| `/rest/v1/rpc/exec_sql`                                       | Function not found in Supabase schema cache |

## Migration File Conventions

- Store all SQL in `scripts/` as `migration_<description>.sql`
- Use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` for idempotency
- Always pair DDL with `ENABLE ROW LEVEL SECURITY` + policies
- Add `update_updated_at_column()` trigger for tables with `updated_at`
- After running, verify with:
  ```sql
  SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
  ```

## Failure Modes Reference

| Error                              | Meaning                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `relation "users" does not exist`  | Check that public.users (not auth.users) exists first                    |
| `already exists` on policy         | Policy was already created — use `DROP POLICY IF EXISTS` before `CREATE` |
| `function exec_sql does not exist` | This RPC is not enabled on this project — use Dashboard instead          |
| MCP connection EOF                 | Large SQL payload — split into smaller chunks or use Dashboard           |
