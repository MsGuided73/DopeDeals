# Highway 420 — Restricted States by Cannabinoid (and by State)

**Source of truth:** `compliance_rules` table in Supabase (project `qirbapivptotybspnbet`)
**Snapshot taken:** 2026-05-06
**All categories require age 21+** (set on every row of the live table).

> Anything not listed below has `restricted_states = []` in the database, meaning the **2018 Farm Bill default** applies (federally legal hemp-derived product, age 21+, ships everywhere).

---

## ⏰ Two regulatory regimes — pre-Nov-2026 and post-Nov-2026

Section A documents what's restricted **today (pre-November 2026)**.

A federal regulatory change is anticipated to take effect **November 2026**, primarily affecting synthesized / intoxicating hemp-derived cannabinoids. After that date, the restricted-state lists below are expected to expand significantly — for several cannabinoids, the restriction becomes effectively nationwide regardless of state law.

**Section E** lays out the proposed post-Nov-2026 dataset and schema. Today's `compliance_rules` table only models a single regime; we need to upgrade the schema so the site automatically switches over on the effective date without a code deploy.

The data in Section E is currently **placeholder** — Dana to confirm scope of the federal ban + which state-level restrictions survive preemption.

---

## A. By Cannabinoid

### THCA — 8 restricted states
`CA, HI, ID, MN, OR, RI, UT, VT`

### Delta-8 — 16 restricted states
`AK, CO, DE, ID, IA, MN, MT, NV, NY, ND, OH, RI, SC, UT, VT, WA`

### Delta-10 — 25 restricted states
`AK, AZ, AR, CA, CO, CT, DE, ID, IL, IA, MD, MA, MI, MS, MT, NV, NY, ND, OR, RI, SD, UT, VT, WA, WY`
> ⚠️ Federally targeted for 2026 ban (per DB description). Re-check before launch.

### HHC — 25 restricted states *(same list as Delta-10)*
`AK, AZ, AR, CA, CO, CT, DE, ID, IL, IA, MD, MA, MI, MS, MT, NV, NY, ND, OR, RI, SD, UT, VT, WA, WY`

### THC-P — 25 restricted states *(same list as Delta-10)*
`AK, AZ, AR, CA, CO, CT, DE, ID, IL, IA, MD, MA, MI, MS, MT, NV, NY, ND, OR, RI, SD, UT, VT, WA, WY`

### THC-V — 25 restricted states *(same list as Delta-10)*
`AK, AZ, AR, CA, CO, CT, DE, ID, IL, IA, MD, MA, MI, MS, MT, NV, NY, ND, OR, RI, SD, UT, VT, WA, WY`

### HTE (High Terpene Extract) — 25 restricted states *(same list as Delta-10)*
`AK, AZ, AR, CA, CO, CT, DE, ID, IL, IA, MD, MA, MI, MS, MT, NV, NY, ND, OR, RI, SD, UT, VT, WA, WY`

### CBN — no restrictions
Federally legal everywhere; age 21+.

### CBG — no restrictions
Federally legal everywhere; age 21+.

### "Cannabis" baseline — no restrictions in DB
`restricted_states = []` — Farm Bill default (federally legal hemp products, < 0.3% Delta-9 THC by dry weight).
> See "Gaps" section below — this empty list is one of the discrepancies that needs review.

### Vape (PACT Act) — no restrictions in DB
`restricted_states = []` in DB.
> Code-side fallback in `lib/compliance-filters.ts` lists `UT, AL, AK, CT, HI, ME, NY, VT, WA` for PACT Act tobacco/nicotine. The DB row is currently unused — gap to resolve.

---

## B. By State

### Highest-restriction states (3+ cannabinoid restrictions)

| State | THCA | Delta-8 | Delta-10 / HHC / HTE / THC-P / THC-V |
|---|:---:|:---:|:---:|
| **ID** Idaho | ❌ | ❌ | ❌ |
| **RI** Rhode Island | ❌ | ❌ | ❌ |
| **UT** Utah | ❌ | ❌ | ❌ |
| **VT** Vermont | ❌ | ❌ | ❌ |

These four are restricted across **all three** category groups — effectively no intoxicating hemp-derived products ship there.

### Two-category restricted states

| State | What's restricted |
|---|---|
| **CA** California | THCA, Synth-group (D-10/HHC/HTE/THC-P/THC-V) |
| **CO** Colorado | Delta-8, Synth-group |
| **DE** Delaware | Delta-8, Synth-group |
| **IA** Iowa | Delta-8, Synth-group |
| **MN** Minnesota | THCA, Delta-8 |
| **MT** Montana | Delta-8, Synth-group |
| **NV** Nevada | Delta-8, Synth-group |
| **NY** New York | Delta-8, Synth-group |
| **ND** North Dakota | Delta-8, Synth-group |
| **OR** Oregon | THCA, Synth-group |
| **WA** Washington | Delta-8, Synth-group |

### Single-category restricted states

| State | Restriction |
|---|---|
| **AK** Alaska | Delta-8 + Synth-group (single decision: ban intoxicating hemp) |
| **AZ** Arizona | Synth-group |
| **AR** Arkansas | Synth-group |
| **CT** Connecticut | Synth-group |
| **HI** Hawaii | THCA |
| **IL** Illinois | Synth-group |
| **MD** Maryland | Synth-group |
| **MA** Massachusetts | Synth-group |
| **MI** Michigan | Synth-group |
| **MS** Mississippi | Synth-group |
| **OH** Ohio | Delta-8 only |
| **SC** South Carolina | Delta-8 only |
| **SD** South Dakota | Synth-group |
| **WY** Wyoming | Synth-group |

> Note: I split AK into "single category" because Delta-8 + Synth-group is one regulatory posture (intoxicating-hemp ban). It's effectively a 2-category state if you count groups as separate.

### States with NO restrictions in DB (Farm Bill default, all hemp-derived OK)

`AL, FL, GA, IN, KY, LA, ME, MO, NC, NE, NH, NJ, NM, OK, PA, TN, TX, VA, WI, WV, KS` plus DC and territories.

---

## C. Gaps & inconsistencies that need a policy decision

These are places where the live DB and the in-code research files (`lib/compliance-data.ts`) disagree, or where data is missing from the DB:

| Issue | Detail | Impact |
|---|---|---|
| **`compliance-data.ts` flags as restricted but DB doesn't:** AR, KS, LA, MS, MT, NV, NY, ND, VA, WA, WV, WI, WY for **THCA** | Hand-curated research includes these states for THCA; DB's THCA list has only 8 states | Customers in these 13 states could place THCA orders that compliance-data.ts says are illegal |
| **`compliance-filters.ts` fallback adds AR for THCA** | DB has 8 states for THCA; the code constant has 9 (adds AR). Inconsistent if DB unreachable | Belt-and-suspenders mismatch |
| **Cannabis baseline = empty `restricted_states`** | Federal Farm Bill is the implied default, but should the strictest states (ID, IA, MS) be listed as a safety net? | Currently no fallback if a product is tagged generic "cannabis" without a more specific cannabinoid match |
| **Vape PACT Act = empty `restricted_states` in DB** | `lib/compliance-filters.ts` lists 9 states; DB row says none. PACT Act is federal law, not optional | Risk of shipping nicotine/vape to states where it's illegal under PACT Act |
| **No Delta-9 row in DB** | Federally legal hemp-derived Delta-9 < 0.3% by dry weight is sold by many hemp shops; no row exists | If you sell any Delta-9 SKU, no state-level guard exists |
| **No "smokable hemp" row** | Hawaii bans smokable hemp specifically (per `compliance-data.ts`); IA bans inhalable hemp | Pre-rolls, flower, vape carts may bypass state-specific rules |
| **No row for "Total THC" states** | KS, MS, WY use a "Total THC" formula that effectively bans THCA even though THCA itself isn't named | THCA list of 8 may be too narrow |
| **No row for Kratom** | Banned in some states (AL, AR, IN, RI, VT, WI). Site-wide kratom block exists in `middleware.ts` but no per-state granularity | We hard-block kratom URLs entirely — currently fine, but if you ever stock kratom products, no state list exists |
| **KY status "in flux"** | `compliance-data.ts` notes courts have blocked bans; DB has no entry | Default = ship; comment says "proceed with caution" |

---

## D. Recommended next steps

1. **Decide on canonical THCA list.** The DB's 8-state list is the most permissive; `compliance-data.ts`'s ~25-state list is the most conservative. Pick one and align the other two sources to match.
2. **Populate cannabis baseline.** Either keep empty (Farm Bill default) and document the policy, or add a baseline restricted-states list as a safety net.
3. **Populate vape PACT Act states** in the DB row to match `lib/compliance-filters.ts` constants.
4. **Add a Delta-9 row** if any Delta-9-bearing SKU ships, with the appropriate restricted states.
5. **Reconcile `compliance-filters.ts` fallback constants** with whatever the DB ends up containing — they should be identical so the fallback path stays correct if Supabase is unreachable.

Once these are settled, the FAQ "Where can you ship?" / "Is X legal in my state?" answers can pull live data from `compliance_rules` and rendering will always match the actual shipping logic.
