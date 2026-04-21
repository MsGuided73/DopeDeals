# KajaPay dashboard assistant — prompt for Claude Chrome Extension

Paste the block below into the Claude Chrome Extension once you have the
KajaPay merchant dashboard open in the active tab. Fill in the `[bracketed]`
slots before sending. The prompt is written so Claude has full context
without access to this repo.

---

## PASTE BELOW

You're helping me (the merchant) upload and configure a **custom Payment Page**
inside the KajaPay (Paya/PayaConnect) merchant dashboard. I have the dashboard
open in the active tab — please use page context to guide me step-by-step.

**Merchant:** Highway 420 (online headshop, e-commerce — cannabis accessories,
vapes, THCA, pre-rolls). Brand colors: dark forest green `#145C3C` header,
lime `#52C41A` accents, Fira Sans type, white card surfaces.

**What I'm doing:** I have a self-contained custom HTML Payment Page template
(single file, all CSS inline, inline SVG icons, one Google Fonts `<link>`,
one `<script>` block of cosmetic-only JS) that I need to upload via the
dashboard and configure so KajaPay renders it at pay-link time.

**Environment right now:** [sandbox / production — fill in]
**Payment Page slug I'm editing:** [slug, e.g. `HW420_PROD_01`]
**Approve / success redirect:** `https://highway420.com/order-confirmation/{{invoice}}`
**Decline / cancel redirect:** `https://highway420.com/checkout/error`
**Webhook already wired at:** `https://highway420.com/api/kajapay/webhook`

**Token placeholders I used in the HTML:**
`{{amount}}`, `{{amount_formatted}}`, `{{invoice}}`, `{{subtotal}}`,
`{{shipping}}`, `{{tax}}`, `{{description}}`, `{{customer_email}}`.

**Paya HPP field `name` attributes in my form (DO NOT rename):**
`account_holder_name`, `account_number`, `exp_date`, `cvv`, `email`,
`phone_number`, `street`, `street2`, `city`, `state`, `postal_code`,
`save_account`.

---

**Please help me with, in order:**

1. **Locate the upload point.** Tell me exactly which dashboard section /
   menu / button opens the custom Payment Page editor for the slug above.
   If the dashboard uses tabs (Settings → Payment Pages → Template, etc.),
   walk me through them.

2. **Confirm the token syntax KajaPay actually uses.** I wrote
   `{{amount}}` style placeholders. Verify from the dashboard UI / help
   text whether KajaPay uses `{{…}}`, `[[…]]`, `%name%`, `{{order.amount}}`,
   or something else. If different, give me the exact find/replace mapping
   so I can run it across my HTML once before pasting.

3. **Check CSP / script restrictions.** Tell me whether the editor
   strips `<script>` tags, blocks external `<link rel="stylesheet">` to
   `fonts.googleapis.com`, or limits `<img>` srcs. If external assets are
   blocked, tell me which specifically so I can:
   - Remove the Google Fonts link and rely on system fonts,
   - Base64-inline the shield logo (the Supabase URL I'm loading it from),
   - Strip the cosmetic JS block (labeled in the HTML).

4. **Form action / method.** Confirm whether I should leave my
   `<form>` without `action`/`method` (KajaPay injects) or whether I need
   to set `action="__KAJAPAY_ACTION__"` or similar. Same question for the
   submit button — do they want `<button type="submit">` or a specific
   class/id hook?

5. **Field name validation.** After I paste, check whether the dashboard
   warns about unknown fields. Paya's documented HPP shortnames are the
   ones I used (above). If any are rejected or renamed, tell me the
   accepted name so I can relabel.

6. **Redirect URLs + webhook.** Walk me through setting:
   - `redirect_url_on_approve` → the approve URL above,
   - `redirect_url_on_decline` → the decline URL above,
   - `parent_send_message` if I'm iframe-embedding (I am not — full page
     redirect),
   - Webhook endpoint + secret. The site already verifies signatures; I
     just need to make sure the secret matches.

7. **Test transaction.** Once uploaded, help me kick off a test pay-link
   ($0.50 test card) and interpret the response. Highway 420's site calls
   `POST payment-pages/generate-pay-link/{slug}` with a JSON payload shaped
   like:
   ```json
   {
     "one_time_use": true,
     "success_url": "...",
     "cancel_url": "...",
     "general_fields": {
       "invoice": { "value": "HW-YYYYMMDD-XXXX" },
       "amount":  { "value": 84.26, "currency": "USD" },
       "tax_amount":      { "value": 5.27,  "currency": "USD" },
       "shipping_amount": { "value": 0,     "currency": "USD" }
     }
   }
   ```
   Confirm the dashboard shows the same fields flowing into my template.

8. **Screenshot / confirm.** When the page looks right in KajaPay's
   "preview" pane, give me a thumbs-up before I flip the slug into my
   production env var (`KAJAPAY_PAYMENT_PAGE_SLUG`).

---

**Style for your replies:**
Short numbered steps, each with a specific button/link to click. Call out
anything destructive (e.g. "this publishes live"). If you can't see a
dashboard element I describe, say so and ask me to scroll/screenshot
rather than guess.

**Do not:**
- Upload, save, or publish anything automatically — I'll click the final
  button.
- Modify any setting unrelated to the Payment Page template.
- Suggest I email card data anywhere or paste real card numbers.

Ready when you are — the dashboard is the active tab.

## END PASTE
