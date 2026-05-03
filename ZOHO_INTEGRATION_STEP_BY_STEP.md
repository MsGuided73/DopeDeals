# Zoho Integration — Finishing the OAuth Flow

You already have the env variables (Client ID, Client Secret, Org ID, DC, Warehouse ID, Redirect URI). What you need now is the **Refresh Token** — a long-lived credential that lets the app re-authenticate against Zoho automatically.

This guide gets you from "env vars set" to "tokens stored, app can talk to Zoho."

There are 5 phases. Each builds on the previous. Don't skip.

---

## Phase 1 — Sanity check your env vars

Open `.env.local` and confirm these are filled in:

```env
ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ZOHO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_ORGANIZATION_ID=850205569
ZOHO_DC=us
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho/oauth/callback
ZOHO_BASE_URL=https://www.zohoapis.com/inventory/v1
ZOHO_WAREHOUSE_ID=...
ZOHO_WAREHOUSE_NAME=East Coast
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> **Important — `ZOHO_REDIRECT_URI` must EXACTLY match** one of the redirect URIs registered in BMB's Zoho API Console. If the value here is `http://localhost:3000/api/zoho/oauth/callback`, that exact string must appear in their app config. Trailing slashes, http vs https, port numbers — all must match.

If you're going to do this on production instead of locally, set `ZOHO_REDIRECT_URI=https://your-domain.com/api/zoho/oauth/callback` and make sure that URL is also registered in Zoho.

---

## Phase 2 — Create the `zoho_tokens` table in Supabase

The OAuth callback writes the tokens into a Supabase table called `zoho_tokens`. **This table doesn't exist yet** — no migration creates it. You'll get a "relation does not exist" error in the callback if you skip this.

### Do this once:

1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste and run:

```sql
create table if not exists public.zoho_tokens (
  org_id text primary key,
  refresh_token text not null,
  access_token text,
  expires_at timestamptz,
  dc text default 'us'
);

-- Lock it down — only the service role should ever touch this
alter table public.zoho_tokens enable row level security;
```

3. Confirm it exists: **Table Editor** → you should see `zoho_tokens` with 0 rows.

That's it. The app will fill it in during Phase 3.

---

## Phase 3 — Run the OAuth flow (browser)

This is the actual token-getting step. You log into Zoho once, and the app captures the refresh token in your DB.

### Steps:

1. **Start the dev server** (or have your production deploy live):
   ```bash
   npm run dev
   ```
   Wait for `Ready on http://localhost:3000`.

2. **In a browser, visit:**
   ```
   http://localhost:3000/api/zoho/oauth/start
   ```
   *(or `https://your-domain.com/api/zoho/oauth/start` for production)*

   This route ([app/api/zoho/oauth/start/route.ts](app/api/zoho/oauth/start/route.ts)) immediately redirects you to Zoho's consent screen.

3. **Sign in to Zoho** — use a BMB account that has access to the Inventory organization you're integrating with.

4. **Approve the requested scopes.** You'll see a screen asking permission for `ZohoInventory.fullaccess.all`. Click **Accept**.

5. **Zoho redirects back** to `/api/zoho/oauth/callback?code=...`. The callback route ([app/api/zoho/oauth/callback/route.ts](app/api/zoho/oauth/callback/route.ts)) does this automatically:
   - Exchanges the one-time code for a `refresh_token` + `access_token`
   - Upserts both into the `zoho_tokens` table you created in Phase 2
   - Redirects you to `/api/zoho/health`

6. **You'll land on `/api/zoho/health`.** If it returns JSON with auth info and product counts, **you're done with OAuth**. If it returns an error, see "Troubleshooting" at the bottom.

### What if Phase 3 fails?

Common failures and fixes:

| Error | Cause | Fix |
|---|---|---|
| `Missing code` | You hit the callback URL directly, not via Zoho | Start over from `/api/zoho/oauth/start` |
| `Token exchange failed` + `invalid_redirect_uri` | `ZOHO_REDIRECT_URI` doesn't match what's registered in Zoho | Fix the env var OR have BMB add the exact URL to the app's redirect list |
| `Token exchange failed` + `invalid_client` | Client ID/Secret wrong | Double-check the values BMB sent |
| `Failed to persist token` + `relation "zoho_tokens" does not exist` | You skipped Phase 2 | Run the SQL in Phase 2, then redo Phase 3 |
| Stuck at consent screen, no redirect | The Zoho user doesn't have access to the inventory org | Use a different BMB account |

---

## Phase 4 — Mirror the refresh token into env (legacy compat)

Some older routes in this codebase still read the refresh token from env, not from the `zoho_tokens` table. You need the value in **both places** until those routes get refactored.

The two paths:

| Path | Reads from | Used by |
|---|---|---|
| **New** (preferred) | `zoho_tokens` table | `/api/zoho/sync`, `/api/zoho/health`, `/api/zoho/items`, `/api/admin/refresh-zoho-token` |
| **Legacy** | `process.env.ZOHO_REFRESH_TOKEN` | [app/api/zoho/sync-inventory/route.ts:46](app/api/zoho/sync-inventory/route.ts#L46), [app/api/zoho/sync-enhanced/route.ts:59](app/api/zoho/sync-enhanced/route.ts#L59) |

### Steps:

1. **Pull the refresh token out of Supabase.** In SQL Editor:

   ```sql
   select refresh_token
   from public.zoho_tokens
   where org_id = '850205569';   -- replace with your ZOHO_ORGANIZATION_ID
   ```

   You'll get a long string starting with `1000....`. Copy it.

2. **Paste it into your `.env.local`:**

   ```env
   ZOHO_REFRESH_TOKEN=1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Also set it in Coolify** (or whatever production host you use) before deploying.

4. **Restart the dev server** so it picks up the new var.

> **About refresh tokens:** They don't expire under normal use (Zoho refresh tokens are long-lived). The short-lived **access token** rotates every hour and gets refreshed automatically by the app — you don't need to manage it.

---

## Phase 5 — Verify everything works

Hit these endpoints in order. All should return `200`. Use your browser or curl.

### Test 1: Status

```
GET http://localhost:3000/api/zoho/status
```

Expected: JSON showing `connected: true` and your org ID.

### Test 2: Health (live ping to Zoho)

```
GET http://localhost:3000/api/zoho/health
```

This actually calls Zoho's `/items` endpoint with your access token. If it returns 200, your OAuth + token storage are fully working.

### Test 3: Pull real items

```
GET http://localhost:3000/api/zoho/items
```

Expected: a JSON list of items from Zoho Inventory.

### Test 4: Test connection (legacy route — confirms env var path also works)

```
GET http://localhost:3000/api/zoho/test-connection
```

If this passes, both the new (DB-backed) and legacy (env-backed) token paths are working.

### Test 5: Run a real sync (optional — pulls products into Supabase)

```
POST http://localhost:3000/api/zoho/sync
```

> **Heads up:** this is currently capped at 3 pages of products in [app/api/zoho/sync/route.ts:192-193](app/api/zoho/sync/route.ts#L192-L193). For full-catalog sync, that cap needs to be removed. Don't worry about it for verification — 3 pages is enough to confirm the pipeline works.

If all five tests pass, **OAuth integration is complete.** You can stop here. The remaining work (scheduling cron jobs, building the webhook receiver, pushing sales orders back to Zoho) is feature work — not credential setup.

---

## What's NOT covered by this guide (separate work)

Once OAuth is done, these are the remaining Zoho-related TODOs to make inventory truly "live." None of them require new credentials — just code changes:

1. **Schedule the sync jobs** — nothing runs them automatically today. Add Coolify cron entries for:
   - `POST /api/zoho/sync-inventory` every 15 min (stock levels)
   - `POST /api/zoho/sync` hourly (product catalog)
   - `POST /api/admin/refresh-zoho-token` every 50 min (access token rotation safety net)
2. **Remove the 3-page cap** at [app/api/zoho/sync/route.ts:192-193](app/api/zoho/sync/route.ts#L192-L193).
3. **Push sales orders back to Zoho** when checkout completes — wire `client.ts:243 createOrder` into [app/api/orders/create/route.ts](app/api/orders/create/route.ts).
4. **Build the webhook receiver** at `app/api/zoho/webhook/route.ts` so Zoho can push inventory changes in real time instead of you polling.
5. **Decide stock-decrement contract** — is Zoho the source of truth, or Supabase? Affects checkout reservation logic.

These are each their own task. Tackle them after you confirm OAuth works.

---

## TL;DR — the 5-minute version

```
1. Confirm env vars are set (Phase 1)
2. Run the SQL in Phase 2 to create zoho_tokens table
3. Visit /api/zoho/oauth/start, sign in, approve
4. SELECT refresh_token from zoho_tokens, paste into ZOHO_REFRESH_TOKEN env var
5. Visit /api/zoho/health → should return 200
```

If step 5 returns 200, you're done.

---

## Troubleshooting

**"I keep getting redirected to consent and it loops"**
The redirect URI in your env doesn't match what's registered in Zoho's app config. They have to be byte-identical.

**"Token exchange failed: invalid_code"**
Zoho's grant codes are valid for ~10 minutes and are single-use. If you're testing manually with curl, generate a fresh one. For the browser flow this won't happen — just retry from `/api/zoho/oauth/start`.

**"`/api/zoho/health` returns 401 even though OAuth succeeded"**
Refresh token is in `zoho_tokens` but not in `ZOHO_REFRESH_TOKEN` env var, AND you're hitting an endpoint that uses the legacy path. Do Phase 4.

**"My DC isn't `us`"**
Set `ZOHO_DC` to your DC code (`eu`, `in`, `au`, `jp`) AND update `ZOHO_BASE_URL` to the matching domain (e.g. `https://www.zohoapis.eu/inventory/v1`). The OAuth start route already swaps `accounts.{dc}.zoho.com` based on `ZOHO_DC`, so consent will go to the right place.

**"I want to do this without a browser (e.g. on a headless server)"**
Use the Self-Client flow:
1. In Zoho API Console, switch your app type to "Self Client" (or register a new one).
2. Generate a 10-minute grant code with scope `ZohoInventory.fullaccess.all`.
3. Within 10 minutes, exchange it via curl:
   ```bash
   curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
     -d "grant_type=authorization_code" \
     -d "client_id=$ZOHO_CLIENT_ID" \
     -d "client_secret=$ZOHO_CLIENT_SECRET" \
     -d "code=<grant code>" \
     -d "redirect_uri=$ZOHO_REDIRECT_URI"
   ```
4. The response JSON has `refresh_token`. Insert it into `zoho_tokens` manually:
   ```sql
   insert into public.zoho_tokens (org_id, refresh_token, dc)
   values ('850205569', '<refresh_token>', 'us')
   on conflict (org_id) do update
   set refresh_token = excluded.refresh_token;
   ```
5. Also paste it into `ZOHO_REFRESH_TOKEN` env var.
6. Resume from Phase 5.
