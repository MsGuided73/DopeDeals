---
name: improvmx-email-forwarding
description: >
  ImprovMX email-forwarding and outbound email service — alias forwarding, domain
  verification, routing rules, SMTP credentials, transactional Send API, templates,
  and inbound webhooks. Use when someone needs to add or change an alias on
  highway420store.com (e.g. info@, support@, marketing@, social@), verify MX/SPF/DKIM
  for the domain, set up a webhook to receive forwarded mail as JSON, send
  transactional email via ImprovMX (alternative to the existing nodemailer/Gmail flow
  in lib/email-orders.ts), manage SMTP credentials, search delivery logs, or
  bulk-modify aliases/rules. ~35 endpoints across 8 categories.
version: 1.0.0
metadata:
  openclaw:
    requires:
      env: []
    primaryEnv: IMPROVMX_API_KEY
    emoji: "📬"
    homepage: https://improvmx.com/api
---

# ImprovMX Email Forwarding & Send API

ImprovMX is the email-forwarding service powering aliases on `highway420store.com`. The four canonical addresses — `info@`, `support@`, `marketing@`, `social@` — are routed through ImprovMX to one or more real inboxes (typically Gmail). The same platform also offers an authenticated SMTP service and a REST Send API for transactional email; both are paid features.

This skill covers programmatic management of all of it.

**API Reference Links:**
- **API Docs:** [Full reference](https://improvmx.com/api) | [Rate limits](https://improvmx.com/guides/api-rate-limits)
- **Account:** [GET /account](https://improvmx.com/api#get-account) | [GET /account/whitelabels](https://improvmx.com/api#get-account-whitelabels)
- **Domains:** [List](https://improvmx.com/api#get-domains) | [Add](https://improvmx.com/api#post-domains) | [Get](https://improvmx.com/api#get-domain) | [Update](https://improvmx.com/api#put-domain) | [Delete](https://improvmx.com/api#delete-domain) | [Check DNS](https://improvmx.com/api#get-domain-check)
- **Aliases:** [List](https://improvmx.com/api#get-aliases) | [Create](https://improvmx.com/api#post-alias) | [Get](https://improvmx.com/api#get-alias) | [Update](https://improvmx.com/api#put-alias) | [Delete](https://improvmx.com/api#delete-alias) | [Bulk](https://improvmx.com/api#bulk-aliases)
- **Rules:** [List](https://improvmx.com/api#get-rules) | [Create](https://improvmx.com/api#post-rule) | [Update](https://improvmx.com/api#put-rule) | [Delete](https://improvmx.com/api#delete-rule)
- **Logs:** [List](https://improvmx.com/api#get-logs) | [Search](https://improvmx.com/api#search-logs)
- **SMTP Credentials:** [List](https://improvmx.com/api#get-credentials) | [Create](https://improvmx.com/api#post-credential) | [Update](https://improvmx.com/api#put-credential) | [Delete](https://improvmx.com/api#delete-credential)
- **Send API:** [Send Email](https://improvmx.com/api#send-email) | [Get Status](https://improvmx.com/api#get-email-status)
- **Templates:** [List](https://improvmx.com/api#get-templates) | [Create](https://improvmx.com/api#post-template) | [Update](https://improvmx.com/api#put-template)
- **Webhooks:** [Inbound webhook guide](https://improvmx.com/guides/webhooks)

---

## Authentication

| What | Value |
|---|---|
| Base URL | `https://api.improvmx.com/v3` |
| Auth | HTTP Basic |
| Username | `api` (literal string) |
| Password | Your API key (env: `IMPROVMX_API_KEY`) |

```bash
curl -u "api:$IMPROVMX_API_KEY" https://api.improvmx.com/v3/account
```

```ts
const res = await fetch('https://api.improvmx.com/v3/account', {
  headers: {
    Authorization: 'Basic ' + Buffer.from(`api:${process.env.IMPROVMX_API_KEY}`).toString('base64'),
  },
});
```

API keys are issued from the [ImprovMX dashboard → API page](https://app.improvmx.com/api). Keys are account-scoped (no org/role granularity) — keep them server-side only.

---

## Rate Limits

Account-wide, per minute:

| Method | Limit / min |
|---|---|
| GET | 150 |
| POST | 60 |
| PUT | 60 |
| DELETE | 60 |

`429 Too Many Requests` on overage. The docs do not specify a `Retry-After` header — back off ≥ 60 s and retry.

The Send API has its **own** stricter rate limit: **10 outbound emails per minute** (per domain, premium plan).

---

## Quickstart — Set Up the Four Highway420 Aliases

Goal: route all four canonical addresses on `highway420store.com` to a real inbox (e.g. `team@gmail.com`).

```ts
const auth = 'Basic ' + Buffer.from(`api:${process.env.IMPROVMX_API_KEY}`).toString('base64');
const headers = { Authorization: auth, 'Content-Type': 'application/json' };
const DOMAIN = 'highway420store.com';
const FORWARD_TO = 'team@gmail.com';

// 1. Add the domain (skip if already added in dashboard)
await fetch('https://api.improvmx.com/v3/domains', {
  method: 'POST',
  headers,
  body: JSON.stringify({ domain: DOMAIN, notification_email: 'admin@highway420store.com' }),
});

// 2. Verify MX/SPF DNS (call until "valid": true on each record)
const check = await fetch(`https://api.improvmx.com/v3/domains/${DOMAIN}/check`, { headers })
  .then(r => r.json());
// → { valid: true, records: { mx: {...}, spf: {...}, dkim: {...}, dmarc: {...} } }

// 3. Bulk-create the four canonical aliases
await fetch(`https://api.improvmx.com/v3/domains/${DOMAIN}/aliases/bulk`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    behavior: 'add',
    aliases: [
      { alias: 'info', forward: FORWARD_TO },
      { alias: 'support', forward: FORWARD_TO },
      { alias: 'marketing', forward: FORWARD_TO },
      { alias: 'social', forward: FORWARD_TO },
    ],
  }),
});
```

After step 2 returns `valid: true`, mail starts forwarding immediately.

---

## Endpoint Reference

### Account

| Method | Path | Purpose |
|---|---|---|
| GET | `/account` | Account details, plan, limits |
| GET | `/account/whitelabels` | List whitelabel domains on the account |

### Domains

| Method | Path | Purpose |
|---|---|---|
| GET | `/domains` | List domains. Query: `q` (search), `is_active`, `limit` (5–100, default 50), `page` |
| POST | `/domains` | Add domain. Body: `domain` (required), `notification_email`, `whitelabel` |
| GET | `/domains/:domain` | Get domain (capped at 200 aliases inline) |
| PUT | `/domains/:domain` | Update `notification_email`, `webhook`, `whitelabel`. Domain itself is immutable |
| DELETE | `/domains/:domain` | Remove the domain and all aliases |
| GET | `/domains/:domain/check` | Check MX, SPF, DKIM, DMARC DNS records |

### Aliases

| Method | Path | Purpose |
|---|---|---|
| GET | `/domains/:domain/aliases` | List aliases. Query: `q`, `alias`, `page` |
| POST | `/domains/:domain/aliases` | Create. Body: `alias` (required), `forward` (required) |
| GET | `/domains/:domain/aliases/:alias` | Get one (`:alias` is the local part or numeric ID) |
| PUT | `/domains/:domain/aliases/:alias` | Update forwarding target |
| DELETE | `/domains/:domain/aliases/:alias` | Remove |
| DELETE | `/domains/:domain/aliases/aliases-all` | Remove **every** alias on the domain — destructive |
| POST | `/domains/:domain/aliases/bulk` | Up to 500 ops per call. Body: `behavior` ∈ `add\|update\|delete`, `aliases: [...]` |

`forward` accepts a comma-separated list of email addresses **and/or** an HTTPS webhook URL. Webhook delivery turns ImprovMX into an inbound-email-to-JSON pipeline.

### Rules (advanced routing)

Conditional routing on top of aliases — match by alias, regex, or CEL expression.

| Method | Path | Purpose |
|---|---|---|
| GET | `/domains/:domain/rules` | List. Query: `search`, `page` |
| POST | `/domains/:domain/rules` | Create. Body: `type` ∈ `alias\|regex\|cel`, `config` (JSON), `rank` (float, lower = higher priority), `active` (bool) |
| GET | `/domains/:domain/rules/:rule` | Get one |
| PUT | `/domains/:domain/rules/:rule` | Update `config`, `rank`, `active` |
| DELETE | `/domains/:domain/rules/:rule` | Remove |
| DELETE | `/domains/:domain/rules-all` | Wipe all rules — destructive |
| POST | `/domains/:domain/rules/bulk` | Bulk add/update/delete |

### Logs

| Method | Path | Purpose |
|---|---|---|
| GET | `/domains/:domain/logs` | All recent logs for the domain. Cursor pagination via `next_cursor` |
| GET | `/domains/:domain/logs/:alias` | Logs scoped to one alias |
| GET | `/domains/:domain/logs/search` | Search by time + text. Query: `after` (Unix s, **required**), `before` (Unix s, **required**), `filter`, `text`, `order` |

Logs include delivery attempts, bounces, and spam classification — useful when a customer claims they didn't receive an order email.

### SMTP Credentials *(premium)*

For sending mail via `smtp.improvmx.com` from a third-party client or library.

| Method | Path | Purpose |
|---|---|---|
| GET | `/domains/:domain/credentials` | List existing SMTP usernames |
| POST | `/domains/:domain/credentials` | Create. Body: `username` (required, ≥3 chars), `password` (required, ≥8 chars) |
| PUT | `/domains/:domain/credentials/:username` | Rotate password |
| DELETE | `/domains/:domain/credentials/:username` | Remove |

**SMTP server settings** (set in your client / `nodemailer` config):
- Host: `smtp.improvmx.com`
- Port `587` with STARTTLS, **or** Port `465` with SSL/TLS
- Username: full alias address (e.g. `support@highway420store.com`)
- Password: the credential password set above (not the API key)

### Send API *(premium)* — REST transactional email

| Method | Path | Purpose |
|---|---|---|
| POST | `/domains/:domain/emails/outbound` | Send. Body: `from` (required), `to` (required), `subject` (required), `text`, `html`, `template`, `variables`, `cc`, `bcc`, `reply_to`, `attachments` |
| GET | `/domains/:domain/emails/outbound/:message_id` | Delivery status of a sent message |

Rate-limited to **10 req/min per domain**. Either `text`, `html`, or `template` must be present.

### Email Templates *(premium)*

Up to 200 templates per domain. Mustache (`{{var}}`) variable substitution.

| Method | Path | Purpose |
|---|---|---|
| GET | `/domains/:domain/templates` | List |
| POST | `/domains/:domain/templates` | Create. Body: `name` (required), `description`, `subject`, `html_body`, `text_body` |
| GET | `/domains/:domain/templates/:name` | Get |
| PUT | `/domains/:domain/templates/:name` | Update |
| DELETE | `/domains/:domain/templates/:name` | Remove |

---

## Inbound Webhooks (forwarded mail → JSON)

Setting an alias's `forward` to an HTTPS URL (or setting the domain-level `webhook` field via `PUT /domains/:domain`) makes ImprovMX `POST` each incoming message as JSON.

**Payload shape** (abbreviated):

```json
{
  "headers": { "spf": "pass", "dkim": "pass", "authentication-results": "..." },
  "to": "support@highway420store.com",
  "from": "customer@gmail.com",
  "subject": "Where's my order?",
  "message-id": "<...>",
  "date": "2026-05-03T12:34:56Z",
  "return-path": "...",
  "timestamp": 1746273296,
  "text": "plain-text body",
  "html": "<html>...</html>",
  "attachments": [{ "name": "receipt.pdf", "type": "application/pdf", "encoding": "base64", "content": "..." }],
  "inlines": [{ "name": "logo.png", "content_id": "...", "content": "..." }]
}
```

**Retries:** ImprovMX retries `4xx`/`5xx` responses **two additional times**, then drops the delivery. Return `2xx` to acknowledge.

**No HMAC signature** is documented — protect the endpoint with a long random path segment (`/api/email/inbound/<random>`) **and** validate `headers.spf` / `headers.dkim` server-side. Treat anything failing both as suspicious.

Handler scaffold for this codebase:

```ts
// app/api/improvmx/inbound/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  if (payload.headers?.spf !== 'pass' && payload.headers?.dkim !== 'pass') {
    logger.warn('[ImprovMX] Inbound mail failed SPF+DKIM', { from: payload.from });
    return NextResponse.json({ ok: true }); // 2xx so they don't retry junk
  }
  // …route to support queue, ticketing, Slack, etc.
  return NextResponse.json({ ok: true });
}
```

---

## Common Errors

| Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad request (validation, malformed body) |
| 401 | Missing/invalid Basic auth — check the `api:KEY` username pair |
| 403 | Forbidden — premium-only endpoint on a free plan, or domain not on the account |
| 404 | Domain/alias/rule not found |
| 429 | Rate-limited — back off ≥ 60 s |
| 500 | Server error — safe to retry once |

---

## Use Cases for This Codebase

1. **Replace `lib/email-orders.ts` Gmail/nodemailer setup with ImprovMX SMTP or Send API**
   - Today: order/shipping emails go through `nodemailer` + Gmail (`EMAIL_USER` / `EMAIL_APP_PASSWORD`). Throughput is capped by Gmail and lacks deliverability tooling.
   - Option A: keep nodemailer, swap the transport to `smtp.improvmx.com` and add an SMTP credential per domain.
   - Option B: drop nodemailer entirely, `POST /domains/highway420store.com/emails/outbound`. Trade-off: 10 req/min ceiling.

2. **Provision the four canonical aliases programmatically** — see Quickstart above. Useful for new whitelabel domains or staging environments.

3. **DNS-verification status check in admin UI** — call `GET /domains/highway420store.com/check` from `app/admin/settings` to surface MX/SPF/DKIM/DMARC health alongside the email-template editor.

4. **Customer-support inbound mail → ticketing webhook** — forward `support@highway420store.com` to a webhook that creates a row in Supabase (e.g. a `support_tickets` table), then ack with 2xx.

5. **Bounce / spam diagnostics** — when a customer reports a missing order confirmation, query `GET /domains/.../logs/search?after=...&before=...&text=<order-number>` to see exactly what happened.

6. **Bulk alias migration** — when adding a second domain (e.g. `highway420.shop`), `POST /domains/.../aliases/bulk` with `behavior: "add"` mirrors the four canonicals in one call.

---

## Notes

- Free plan supports forwarding + rules + webhooks. SMTP credentials, Send API, and templates require a paid plan.
- A free account is capped at **5 domains** and **25 aliases per domain**; paid tiers raise both.
- The `forward` field on an alias is **comma-separated** for multi-recipient forwarding (e.g. `"team@gmail.com,manager@gmail.com"`).
- Domain ownership is verified by DNS (MX records to `mx1.improvmx.com` / `mx2.improvmx.com` + SPF). Until DNS propagates, `GET /domains/:domain/check` will return `valid: false` per record.
