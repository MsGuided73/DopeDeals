# Highway 420 — Launch Punch List

Items deferred from the contact-info / legacy-brand scrub on **2026-05-06**. Come back to each before public launch.

---

## 1. Contact info — items waiting on real values

### 1a. Phone number (sitewide)
The (626) 656-6287 number was Adam's mobile and has been removed everywhere it appeared. We need a **real customer-facing number** before any of these pages can show one again.

Pages that previously had it (now phone-free) — re-add a phone here when a number is provisioned:
- `app/privacy/page.tsx` — Section 9 "Contact Us" (currently email-only)
- `app/terms-and-conditions/page.tsx` — Section 17 "Contact Information" (currently email-only)
- `app/returns/page.tsx` — return-policy contact block (currently email-only)
- `app/compliance/page.tsx` — compliance team contact block (currently email-only)
- `app/contact/page.tsx` — Phone block was removed entirely; restore when number is real
- `components/Highway420Footer.tsx` — checkout-flow "Help" box was removed; restore when number is real (or repurpose box to "Email Us")

### 1b. Mailing address (Terms of Service)
- `app/terms/page.tsx` Section 12 still shows `[Address to be added]` for the legal mail address. Replace once registered business address is confirmed.

### 1c. Phone number on the same ToS page
- `app/terms/page.tsx` Section 12 — phone removed; can add back once 1b is addressed.

---

## 2. Legacy "DOPE CITY" / `@dopecity.com` references still in user-facing pages

Discovered during the BMB scrub. None of these are the BMB number or BMB email — they're a *different* set of stale-brand artifacts (the prior "Dope City" branding). Each is on a customer-facing page or in a customer email. Triage before launch.

| File:line | What's there | User-visible? |
|---|---|---|
| `app/privacy/page.tsx:126` | "contact us at **privacy@dopecity.com**" in body text | Yes — Privacy Policy body |
| `app/affiliate/page.tsx:298` | "Email us at **affiliates@dopecity.com**" | Yes — Affiliate page footer |
| `app/press/page.tsx:301` | "**press@dopecity.com**" | Yes — Press page contact box |
| `app/press/page.tsx:309` | "**partnerships@dopecity.com**" | Yes — Press page contact box |
| `app/help/page.tsx:122` | "**1-800-DOPE-CITY**" phone | Yes — Help page contact card |
| `app/shipping/page.tsx:175` | "Contact us at **support@dopecity.com or 1-800-DOPE-CITY**" | Yes — Shipping page body |
| `app/api/email/order-confirmation/route.ts:163` | "Contact us at **support@dopecity.com**" in email body | Yes — every order-confirmation email |
| `app/api/email/order-confirmation/route.ts:261` | `from: 'orders@dopecity.com'` (FROM address) | Yes — every order-confirmation email |

**Order-confirmation FROM address (line 261) is the most urgent of the bunch** — every customer who places an order receives email FROM `orders@dopecity.com`, which looks like a phishing attempt or a wrong-store email and damages brand trust.

### Suggested email aliases on `highway420store.com`
| Old | Replacement |
|---|---|
| `legal@dopecity.com` | `legal@highway420store.com` ✅ already swapped on `/terms` |
| `privacy@dopecity.com` | `privacy@highway420store.com` (or `info@`) |
| `support@dopecity.com` | `support@highway420store.com` |
| `orders@dopecity.com` | `orders@highway420store.com` |
| `press@dopecity.com` | `press@highway420store.com` |
| `partnerships@dopecity.com` | `partnerships@highway420store.com` |
| `affiliates@dopecity.com` | `affiliates@highway420store.com` |

All can be aliases forwarding to one inbox if you don't want multiple mailboxes.

---

## 3. Legacy CSS class `dope-city-title`
Used as a styling hook on h1/h2 elements across ~12 pages (defined in `app/globals.css`). Not user-visible (just a class name) but stale. Renaming to `h420-title` or `brand-title` would touch all 12 files + the CSS rule. Cosmetic — defer unless we're cleaning house.

Files using it: `(public)/auth`, `affiliate`, `brands/puffco`, `brands/urth-farmacy`, `contact`, `gift-cards`, `help`, `payment-methods`, `returns`, `shipping`, `terms`, `terms-and-conditions`, `wishlist`.

---

## 4. Legacy localStorage key `dope-city-age-verified`
Used by `app/components/AgeGateModal.tsx` and `app/checkout/shipping/page.tsx`. Renaming this key would invalidate every existing visitor's age verification, forcing them to re-verify. **Keep the key as-is** for user continuity — only revisit if/when we do a full data migration.

---

## 5. Open product / data items (carried from prior turns)
- **Effective price column** — `main_site_products` lacks a `COALESCE(sale_price, our_price)` generated column. Search currently sorts/filters on `our_price` only, ignoring sale prices. Add `effective_price` generated column + Drizzle update before launch if any sale prices are populated.
- **Article-rail slug values** — `main_site_products.slug` exists and is populated for all 4,133 rows (earlier "missing column" intel was wrong). The silent failure is from **fabricated slug strings** in the article files (`puffco-peak-pro` vs DB's `puffco-peak-pro-v2`, etc.). Two fix paths on the table: (A) backfill the 12 fallback slugs in the article files with real DB values, (B) add a name-token ILIKE fallback in `lib/article-recommendations.ts`. Awaiting Dana's pick.

---

## 6. Imageless active products — data-quality task (2026-05-11)

The sitemap's `image_url IS NOT NULL AND <> ''` filter ([app/sitemap.ts](app/sitemap.ts)) excludes products that have no image. As of today the gap is **601 active products** that should be in the sitemap but aren't:

- **Live sitemap product URLs:** 258 (active + non-kratom + has image)
- **All active non-kratom products:** 859
- **Imageless but active:** **601** ← these are missing from the sitemap

This is intentional — Google deprioritizes thin/imageless PDPs and we don't want to surface them — but the underlying data needs cleanup.

### Concentration (highly skewed, very tractable)

**By category:**
| Category | Imageless | % of gap |
|---|---|---|
| `bongs` | 553 | 92% |
| `dab-rig` | 36 | 6% |
| `pipes` | 12 | 2% |

**By brand:**
| Brand | Imageless | % of gap |
|---|---|---|
| House Brand | 342 | 57% |
| CRAVE | 124 | 21% |
| Diamond Glass | 75 | 12% |
| APO | 50 | 8% |
| Limited Edition | 5 | <1% |
| GORILLA | 5 | <1% |

**Pareto:** 92% of the gap is bongs. 78% of the gap is House Brand + CRAVE. Sourcing images for those two brand catalogs would close the bulk of the deficit.

### Action
- Decision needed: prioritize image sourcing for House Brand + CRAVE bong catalog, or accept reduced indexing footprint at launch
- As products gain images, the sitemap auto-includes them on next render — no code change needed
- Service-role key in prod **is verified working** ✅ (859 product URLs proved end-to-end DB enumeration). The `ci-placeholder` fallback in `next.config.js` is a build-time-only safety net and does NOT affect runtime sitemap generation — leave as-is.
