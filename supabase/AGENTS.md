# AGENTS — Supabase

_Last updated: 2025-01-30_

These rules apply to everything inside `/supabase`.

## Migration authoring
- Use `pnpm supabase migration new <slug>` to scaffold migrations. Name slugs in `YYYYMMDD_<short_description>` format to keep chronology clear.
- Wrap every DDL change in explicit transactions. Prefer `BEGIN; … COMMIT;` blocks so partial application cannot occur.
- Include `IF NOT EXISTS` / `DROP ... IF EXISTS` guards when backfilling objects referenced by application code.
- Keep migrations idempotent for local resets. Never rely on data from external services; seed fixtures via scripts instead.

## Review checklist
1. Verify the SQL matches the Drizzle models in `/shared/schema.ts` (or related files) within the same PR.
2. Ensure all foreign keys use `ON DELETE`/`ON UPDATE` clauses consistent with catalog rules (typically `RESTRICT` or `CASCADE` as documented in `docs/catalog-schema-foundation.md`).
3. Add indexes for any new lookup columns exposed to API filters.
4. Provide a brief summary of risky operations (large backfills, long locks) in the PR body.

## Testing expectations
- Run `pnpm supabase db reset` after adding a migration and resolve any failures.
- Execute the repository’s default test suite (`pnpm test`) to catch runtime regressions.
- If migrations alter materialized views, include a manual `REFRESH` in local testing notes.

## Rollback guidance
- For destructive changes, supply explicit rollback SQL in the migration comments.
- If a migration cannot be rolled back cleanly, highlight the reason in the PR and coordinate deploy windows accordingly.

Stay disciplined here: the storefront, ingestion jobs, and analytics stack all depend on these migrations behaving predictably.
