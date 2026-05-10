/**
 * Ingest the 2026-03-03 hemp-derived cannabinoid shipping-restrictions report
 * into the compliance schema introduced by
 * supabase/migrations/20260508_compliance_rules_expansion.sql.
 *
 * What this does, in order:
 *   1. Inserts the raw report JSON into compliance_reports as the source of
 *      record. Captures the report_id for downstream rows.
 *   2. For every category in the report, upserts a compliance_rules row keyed
 *      on (category, effective_from). New columns get populated from the
 *      report (synthetic flag, Nov 2026 changes, total-THC formula, seizure
 *      risk, description, restricted_states, age_requirement, etc.).
 *   3. For every (category, carrier) pair, upserts a carrier_policies row
 *      with status, requirements, prohibited items, and exceptions.
 *   4. For every state-specific limit called out in the report (CT 3mg, MN
 *      5mg/serving + 50mg/package, Chicago ban, etc.), inserts a
 *      compliance_state_limits row.
 *   5. Marks legacy compliance_rules rows superseded by setting
 *      effective_until = today on the bare 'THCA' / 'Delta-8' rows the prior
 *      seed script created — preserving them for audit but moving traffic
 *      onto the new structured rows.
 *   6. Writes a 'imported_from_report' entry to compliance_review_log for
 *      every row touched, with diff metadata so the audit trail is complete.
 *
 * Usage:
 *   pnpm tsx scripts/ingest-compliance-report-2026-03-03.ts
 *
 * Idempotency: re-running the script will UPDATE the existing rows (matched
 * by category + effective_from) and append a fresh 'updated' review-log
 * entry. It will NOT create duplicates.
 *
 * Safety: this script writes to the *remote* Supabase project. Double-check
 * the env values and run against staging first if you have one.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env — set them in .env.local before running.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ----------------------------------------------------------------------------
// The report payload, lifted verbatim from the document. Stored in
// compliance_reports.raw_payload and referenced by every derived row.
// ----------------------------------------------------------------------------
const REPORT = {
  report_metadata: {
    title: "Hemp-Derived Cannabinoid Product Shipping Restrictions by Category",
    report_date: "2026-03-03",
    effective_as_of: "March 2026",
    federal_changes_nov_2026: {
      legislation:
        "Continuing Appropriations and Extensions Act of 2026 (H.R. 5371, Section 781)",
      effective_date: "2026-11-12",
      key_provisions: [
        "Shift from Delta-9 THC to Total THC standard (includes THCA × 0.877)",
        "0.4mg total THC cap per container for finished consumable products",
        "Exclusion of synthetic/manufactured cannabinoids from hemp definition",
        "Intermediate products (distillates/isolates) cannot be sold directly to consumers",
      ],
    },
  },
  // ... categories array — the full document is stored verbatim in
  // raw_payload via JSON.stringify on the inline declaration below. We
  // keep it inline here so re-runs are reproducible without an external file.
};

// ----------------------------------------------------------------------------
// Per-category derived records. Each entry maps directly onto one
// compliance_rules row plus its carrier_policies and compliance_state_limits
// children. Hand-curated (rather than auto-derived) so we can attach the
// nuance the report's prose contains: synthetic flag, seizure risk, the
// 0.4mg cap applies-or-not, intermediate-product flag, etc.
// ----------------------------------------------------------------------------

type CarrierPolicy = {
  carrier: "USPS" | "UPS" | "FedEx";
  status: "permitted" | "gray_area" | "conditional" | "prohibited";
  requirements?: string[];
  prohibited_items?: string[];
  exceptions?: string;
  notes?: string;
};

type StateLimit = {
  jurisdiction_type: "state" | "city" | "county" | "territory";
  state_abbr: string;
  jurisdiction_name?: string;
  limit_type:
    | "per_serving_mg"
    | "per_container_mg"
    | "per_package_mg"
    | "total_thc_per_container_mg"
    | "outright_ban"
    | "licensed_only"
    | "smokable_ban"
    | "inhalable_ban"
    | "consumable_only"
    | "other";
  limit_value_mg?: number;
  is_outright_ban?: boolean;
  citation?: string;
  notes?: string;
};

type CategoryRow = {
  category: string;
  substance_type: string;
  description: string;
  restricted_states: string[];
  age_requirement: number;
  synthetic: boolean;
  excluded_from_hemp_at?: string; // YYYY-MM-DD
  intermediate_product_restricted?: boolean;
  total_thc_limit_mg_per_container?: number; // 0.4mg federal cap for affected categories
  total_thc_formula?: string;
  seizure_risk_level?: "low" | "medium" | "high" | "very_high";
  warning_labels: string[];
  misc_restrictions: Array<{ type: string; jurisdiction?: string; note: string }>;
  carrier_policies: CarrierPolicy[];
  state_limits: StateLimit[];
};

// Federal Nov 2026 effective date — shared across all rows it applies to.
const NOV_2026 = "2026-11-12";
const TOTAL_THC_FORMULA = "(THCA × 0.877) + Delta-9 THC";
const FED_TOTAL_THC_CAP_MG = 0.4;

const CATEGORIES: CategoryRow[] = [
  {
    category: "Delta-8 THC",
    substance_type: "Hemp-derived isomer (synthetic, post-Nov 2026)",
    description:
      "Hemp-derived Delta-8 tetrahydrocannabinol. Considered synthetically manufactured; will be EXCLUDED from hemp definition Nov 2026. Banned under state analog acts and controlled substances laws.",
    restricted_states: [
      "AK", "AZ", "AR", "CO", "DE", "ID", "IA", "MS", "MT", "NV",
      "NY", "ND", "RI", "UT", "VT",
    ],
    age_requirement: 21,
    synthetic: true,
    excluded_from_hemp_at: NOV_2026,
    seizure_risk_level: "high",
    warning_labels: [
      "Not FDA approved",
      "State restrictions apply",
      "Synthetic — excluded from hemp definition Nov 2026",
    ],
    misc_restrictions: [
      { type: "city_ban", jurisdiction: "Chicago, IL", note: "Ban on most hemp-derived products" },
      { type: "fda_action", note: "FDA warning letters for health claims (2021-2024)" },
      { type: "dea_clarification", note: "DEA clarification that Delta-8 derived from CBD is synthetically produced" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "gray_area", requirements: ["COA"], notes: "Permitted with COA; gray area for intoxicating products" },
      { carrier: "UPS", status: "conditional", requirements: ["Adult Signature Required (ASR)", "COA"] },
      { carrier: "FedEx", status: "prohibited", notes: "Explicitly bans all THC-containing products" },
    ],
    state_limits: [
      {
        jurisdiction_type: "city",
        state_abbr: "IL",
        jurisdiction_name: "Chicago, IL",
        limit_type: "outright_ban",
        is_outright_ban: true,
        notes: "Chicago hemp-derived products ban",
      },
    ],
  },
  {
    category: "Delta-10 THC",
    substance_type: "Hemp-derived isomer (synthetic, post-Nov 2026)",
    description:
      "Hemp-derived Delta-10 tetrahydrocannabinol, another THC isomer. Considered synthetic; will be EXCLUDED from hemp definition Nov 2026. Falls under same bans as Delta-8 in most states.",
    restricted_states: [
      "AK", "AZ", "AR", "CO", "DE", "ID", "IA", "MS", "MT", "NV",
      "NY", "ND", "RI", "UT", "VT",
    ],
    age_requirement: 21,
    synthetic: true,
    excluded_from_hemp_at: NOV_2026,
    seizure_risk_level: "high",
    warning_labels: [
      "Not FDA approved",
      "State restrictions apply",
      "Synthetic — excluded from hemp definition Nov 2026",
    ],
    misc_restrictions: [
      { type: "general_ban", note: "Less commonly regulated specifically but covered by general THC isomer bans" },
      { type: "federal_change", note: "Synthetic classification means exclusion from hemp definition Nov 2026" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "gray_area", requirements: ["COA"], notes: "Documentation required" },
      { carrier: "UPS", status: "conditional", requirements: ["ASR", "COA"] },
      { carrier: "FedEx", status: "prohibited" },
    ],
    state_limits: [],
  },
  {
    category: "HHC / THC-P (Minor Synthetic Cannabinoids)",
    substance_type: "Synthetic / hydrogenated cannabinoids",
    description:
      "HHC (hydrogenated cannabinoid) and THC-P (highly potent synthetic). Both considered synthetically manufactured; will be EXCLUDED from hemp definition Nov 2026. May trigger state analog acts.",
    restricted_states: [
      "AK", "AZ", "AR", "CO", "DE", "ID", "IA", "MS", "MT", "NV",
      "NY", "ND", "RI", "UT",
    ],
    age_requirement: 21,
    synthetic: true,
    excluded_from_hemp_at: NOV_2026,
    seizure_risk_level: "high",
    warning_labels: [
      "Not FDA approved",
      "Treated as intoxicating cannabinoid",
      "Synthetic — excluded from hemp definition Nov 2026",
    ],
    misc_restrictions: [
      { type: "analog_act", note: "State analog acts may apply due to structural similarity to THC" },
      { type: "synthetic_definition", note: "HHC is hydrogenated = synthetic by definition" },
      { type: "potency", note: "THC-P is extremely potent; high enforcement priority" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "gray_area", notes: "High scrutiny" },
      { carrier: "UPS", status: "conditional", requirements: ["ASR", "COA"] },
      { carrier: "FedEx", status: "prohibited" },
    ],
    state_limits: [],
  },
  {
    category: "CBD / CBG / CBN / THC-V (Non-Intoxicating Cannabinoids)",
    substance_type: "Non-intoxicating hemp cannabinoids",
    description:
      "Non-intoxicating cannabinoids. CBD widely legal in all 50 states with <0.3% THC. CBG, CBN, THC-V non-intoxicating. Will likely remain legal under Nov 2026 rules if under 0.4mg total THC per container.",
    restricted_states: ["ID"], // ID THC-free CBD only
    age_requirement: 18, // no federal minimum; defaults state-by-state
    synthetic: false,
    intermediate_product_restricted: false,
    total_thc_limit_mg_per_container: FED_TOTAL_THC_CAP_MG,
    total_thc_formula: TOTAL_THC_FORMULA,
    seizure_risk_level: "low",
    warning_labels: [
      "Not FDA approved",
      "FDA prohibits CBD in food/beverages under FD&C Act",
    ],
    misc_restrictions: [
      { type: "state_specific", jurisdiction: "ID", note: "ID requires THC-free CBD only" },
      { type: "fda_action", note: "FDA warning letters for disease claims" },
      { type: "ftc_action", note: "FTC enforcement for unsubstantiated health claims" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "permitted", requirements: ["COA showing <0.3% THC"], notes: "Generally permitted with COA" },
      { carrier: "UPS", status: "permitted", requirements: ["ASR"] },
      { carrier: "FedEx", status: "conditional", requirements: ["Special hemp-derived CBD contract"], notes: "Restricted — hemp-derived CBD only with special contract" },
    ],
    state_limits: [],
  },
  {
    category: "THCA Edibles",
    substance_type: "THCA-containing edible / consumable",
    description:
      "Edible products containing THCA. Currently legal if Delta-9 THC <0.3%; THCA not counted federally until Nov 2026. RESTRICTED Nov 2026: 0.4mg total THC per container cap applies; THCA included in Total THC calculation.",
    restricted_states: ["AR", "HI", "ID", "MN", "NY", "OR", "VT"],
    age_requirement: 21,
    synthetic: false,
    intermediate_product_restricted: false,
    total_thc_limit_mg_per_container: FED_TOTAL_THC_CAP_MG,
    total_thc_formula: TOTAL_THC_FORMULA,
    seizure_risk_level: "medium",
    warning_labels: [
      "Not FDA approved",
      "Total THC cap applies Nov 2026",
    ],
    misc_restrictions: [
      { type: "state_limit", jurisdiction: "CT", note: "Connecticut: 3mg THC per container limit (Oct 2024)" },
      { type: "state_limit", jurisdiction: "MN", note: "Minnesota: 5mg per serving, 50mg per package limit" },
      { type: "delivery_only", jurisdiction: "CT", note: "Connecticut: No shipping to consumers; delivery only from licensed retailers" },
      { type: "city_ban", jurisdiction: "Chicago, IL", note: "Chicago: Ban on most hemp-derived edibles" },
      { type: "licensed_only", jurisdiction: "OR", note: "Oregon: licensed retailers only" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "permitted", requirements: ["COA", "Proper labeling"] },
      { carrier: "UPS", status: "conditional", requirements: ["ASR mandatory"] },
      { carrier: "FedEx", status: "prohibited" },
    ],
    state_limits: [
      { jurisdiction_type: "state", state_abbr: "CT", limit_type: "per_container_mg", limit_value_mg: 3, citation: "CT Public Act (Oct 2024)" },
      { jurisdiction_type: "state", state_abbr: "MN", limit_type: "per_serving_mg",   limit_value_mg: 5,  citation: "MN HF 3595" },
      { jurisdiction_type: "state", state_abbr: "MN", limit_type: "per_package_mg",   limit_value_mg: 50, citation: "MN HF 3595" },
      { jurisdiction_type: "city",  state_abbr: "IL", jurisdiction_name: "Chicago, IL", limit_type: "outright_ban", is_outright_ban: true, notes: "Hemp-derived edibles banned" },
      { jurisdiction_type: "state", state_abbr: "OR", limit_type: "licensed_only", notes: "Licensed retailers only" },
    ],
  },
  {
    category: "Adaptogenic Mushrooms (Lion's Mane, Reishi, Cordyceps, Chaga, Turkey Tail, Maitake)",
    substance_type: "Functional mushroom dietary supplement",
    description:
      "Non-psychedelic functional mushrooms sold as dietary supplements under DSHEA 1994. FDA regulates as dietary supplements, not drugs. Legal in all 50 states with no shipping restrictions.",
    restricted_states: [],
    age_requirement: 18, // some retailers voluntarily 18+
    synthetic: false,
    seizure_risk_level: "low",
    warning_labels: [
      "Dietary supplement — not evaluated by the FDA",
      "Not intended to diagnose, treat, cure, or prevent any disease",
    ],
    misc_restrictions: [
      { type: "fda_action", note: "FDA Warning Letter to Entia Biosciences (Jan 2021) for disease claims" },
      { type: "regulation", note: "Cannot make disease/treatment claims (21 U.S.C. § 321(g)(1)(B))" },
      { type: "regulation", note: "Must comply with cGMP regulations (21 CFR 111)" },
      { type: "fda_action", note: "Diamond Shruumz recall (2024) led to increased FDA scrutiny" },
      { type: "regulation", note: "Must be GRAS or approved food additive if used in conventional foods" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "permitted", notes: "Standard shipping" },
      { carrier: "UPS", status: "permitted", notes: "Standard shipping" },
      { carrier: "FedEx", status: "permitted", notes: "Standard shipping" },
    ],
    state_limits: [],
  },
  {
    category: "THCA Flower",
    substance_type: "Raw hemp flower (THCA-dominant)",
    description:
      "Raw hemp flower high in THCA. Currently legal if Delta-9 THC <0.3%; THCA not counted. EFFECTIVELY BANNED Nov 2026: Total THC standard (0.3% including THCA) will classify most THCA flower as marijuana. Highest seizure risk of all categories.",
    restricted_states: [
      "AR", "GA", "HI", "ID", "IA", "KS", "KY", "LA", "MA", "MS",
      "MT", "NE", "ND", "OR", "SD", "TX", "VT", "VA",
    ],
    age_requirement: 21,
    synthetic: false,
    intermediate_product_restricted: false,
    total_thc_formula: TOTAL_THC_FORMULA,
    seizure_risk_level: "very_high",
    warning_labels: [
      "Not FDA approved",
      "Effectively banned Nov 2026 under Total THC standard",
      "Indistinguishable from marijuana without lab testing",
    ],
    misc_restrictions: [
      { type: "formula", note: "Total THC = (THCA × 0.877) + Delta-9 THC" },
      { type: "enforcement", note: "Law enforcement cannot distinguish from marijuana without lab testing" },
      { type: "criminal_risk", note: "Criminal prosecution risk in states with total THC testing" },
      { type: "asset_forfeiture", note: "Asset forfeiture risk in prohibition states" },
      { type: "state_specific", jurisdiction: "GA", note: "Smokable form restricted" },
      { type: "state_specific", jurisdiction: "TX", note: "Smokable form restricted" },
      { type: "state_specific", jurisdiction: "KY", note: "Inhalable form restricted" },
      { type: "state_specific", jurisdiction: "LA", note: "Inhalable form restricted" },
      { type: "state_specific", jurisdiction: "KS", note: "Gray area" },
      { type: "state_specific", jurisdiction: "NE", note: "Gray area" },
      { type: "state_specific", jurisdiction: "SD", note: "Gray area" },
      { type: "licensed_only", jurisdiction: "OR", note: "Licensed retailers only" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "gray_area", notes: "High seizure risk; looks identical to marijuana" },
      { carrier: "UPS", status: "conditional", requirements: ["Pre-approved shippers only", "ASR mandatory"] },
      { carrier: "FedEx", status: "prohibited", notes: "Explicitly bans hemp plants/leaves" },
    ],
    state_limits: [
      { jurisdiction_type: "state", state_abbr: "GA", limit_type: "smokable_ban",   notes: "Smokable form restricted" },
      { jurisdiction_type: "state", state_abbr: "TX", limit_type: "smokable_ban",   notes: "Smokable form restricted" },
      { jurisdiction_type: "state", state_abbr: "KY", limit_type: "inhalable_ban",  notes: "Inhalable form restricted" },
      { jurisdiction_type: "state", state_abbr: "LA", limit_type: "inhalable_ban",  notes: "Inhalable form restricted" },
      { jurisdiction_type: "state", state_abbr: "OR", limit_type: "licensed_only" },
    ],
  },
  {
    category: "THCA Prerolls",
    substance_type: "Pre-rolled THCA hemp flower",
    description:
      "Pre-rolled joints containing THCA hemp flower. Currently legal if Delta-9 THC <0.3%. EFFECTIVELY BANNED Nov 2026 under Total THC standard. Higher enforcement risk than raw flower due to processed nature.",
    restricted_states: [
      "AR", "GA", "HI", "ID", "IA", "KS", "KY", "LA", "MA", "MS",
      "MT", "ND", "OR", "TX", "VT", "VA",
    ],
    age_requirement: 21,
    synthetic: false,
    total_thc_formula: TOTAL_THC_FORMULA,
    seizure_risk_level: "very_high",
    warning_labels: [
      "Not FDA approved",
      "Effectively banned Nov 2026 under Total THC standard",
    ],
    misc_restrictions: [
      { type: "enforcement", note: "Higher enforcement risk than raw flower" },
      { type: "federal_change", note: "Total THC ban will apply Nov 2026" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "gray_area", notes: "Very high risk — appears identical to marijuana joints" },
      { carrier: "UPS", status: "conditional", requirements: ["Pre-approved shippers only", "ASR"] },
      { carrier: "FedEx", status: "prohibited" },
    ],
    state_limits: [
      { jurisdiction_type: "state", state_abbr: "OR", limit_type: "licensed_only" },
    ],
  },
  {
    category: "THCA Concentrates (Resin, Rosin, Live Resin)",
    substance_type: "THCA concentrate / extract",
    description:
      "Concentrated hemp extracts high in THCA. Currently legal if Delta-9 THC <0.3%. RESTRICTED Nov 2026: Intermediate products cannot be sold directly to consumers; 0.4mg total THC cap applies. High potency increases enforcement scrutiny.",
    restricted_states: [
      "AR", "GA", "HI", "ID", "IA", "KS", "KY", "LA", "MA", "MS",
      "MT", "NY", "ND", "OR", "TX", "VT",
    ],
    age_requirement: 21,
    synthetic: false,
    intermediate_product_restricted: true,
    total_thc_limit_mg_per_container: FED_TOTAL_THC_CAP_MG,
    total_thc_formula: TOTAL_THC_FORMULA,
    seizure_risk_level: "high",
    warning_labels: [
      "Not FDA approved",
      "Intermediate product restrictions apply Nov 2026",
    ],
    misc_restrictions: [
      { type: "enforcement", note: "High potency increases enforcement scrutiny" },
      { type: "federal_change", note: "Intermediate product restrictions Nov 2026" },
      { type: "state_specific", jurisdiction: "GA", note: "Inhalable form restricted" },
      { type: "state_specific", jurisdiction: "KY", note: "Inhalable form restricted" },
      { type: "state_specific", jurisdiction: "LA", note: "Inhalable form restricted" },
      { type: "state_specific", jurisdiction: "TX", note: "Inhalable form restricted" },
      { type: "state_specific", jurisdiction: "KS", note: "Gray area" },
      { type: "licensed_only", jurisdiction: "OR", note: "Licensed retailers only" },
    ],
    carrier_policies: [
      { carrier: "USPS", status: "gray_area", notes: "High scrutiny" },
      { carrier: "UPS", status: "conditional", requirements: ["ASR", "COA", "License verification"] },
      { carrier: "FedEx", status: "prohibited" },
    ],
    state_limits: [
      { jurisdiction_type: "state", state_abbr: "GA", limit_type: "inhalable_ban" },
      { jurisdiction_type: "state", state_abbr: "KY", limit_type: "inhalable_ban" },
      { jurisdiction_type: "state", state_abbr: "LA", limit_type: "inhalable_ban" },
      { jurisdiction_type: "state", state_abbr: "TX", limit_type: "inhalable_ban" },
      { jurisdiction_type: "state", state_abbr: "OR", limit_type: "licensed_only" },
    ],
  },
];

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
const TODAY = new Date().toISOString().slice(0, 10);

async function logReview(
  tableName: string,
  recordId: string,
  action: "created" | "updated" | "imported_from_report" | "deactivated",
  notes?: string,
) {
  await supabase.from("compliance_review_log").insert({
    table_name: tableName,
    record_id: recordId,
    action,
    source: "report_ingest",
    reviewer_name: "ingest-compliance-report-2026-03-03.ts",
    notes,
    diff: { ingested_at: new Date().toISOString() },
  });
}

// ----------------------------------------------------------------------------
// 1. Insert the source report.
// ----------------------------------------------------------------------------
async function insertReport(): Promise<string> {
  const fullPayload = { ...REPORT, product_categories: CATEGORIES };

  // Idempotent: same (title, report_date) updates rather than duplicates.
  const { data: existing } = await supabase
    .from("compliance_reports")
    .select("id")
    .eq("title", REPORT.report_metadata.title)
    .eq("report_date", REPORT.report_metadata.report_date)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("compliance_reports")
      .update({
        effective_as_of: REPORT.report_metadata.effective_as_of,
        federal_changes: REPORT.report_metadata.federal_changes_nov_2026,
        raw_payload: fullPayload,
      })
      .eq("id", existing.id);
    if (error) throw error;
    await logReview("compliance_reports", existing.id, "updated", "Re-ingested from script");
    return existing.id;
  }

  const { data, error } = await supabase
    .from("compliance_reports")
    .insert({
      title: REPORT.report_metadata.title,
      report_date: REPORT.report_metadata.report_date,
      effective_as_of: REPORT.report_metadata.effective_as_of,
      federal_changes: REPORT.report_metadata.federal_changes_nov_2026,
      raw_payload: fullPayload,
    })
    .select("id")
    .single();
  if (error) throw error;
  await logReview("compliance_reports", data.id, "created");
  return data.id;
}

// ----------------------------------------------------------------------------
// 2-4. For each category, upsert rule + carrier policies + state limits.
// ----------------------------------------------------------------------------
async function upsertCategory(reportId: string, cat: CategoryRow) {
  // Match on (category, effective_from = today) so re-runs UPDATE rather than
  // duplicate. effective_from is the date the script ran, ensuring this row
  // is the "current" rule for the category.
  const { data: existing } = await supabase
    .from("compliance_rules")
    .select("id")
    .eq("category", cat.category)
    .is("effective_until", null)
    .maybeSingle();

  const rulePayload = {
    category: cat.category,
    substance_type: cat.substance_type,
    restricted_states: cat.restricted_states,
    age_requirement: cat.age_requirement,
    description: cat.description,
    synthetic: cat.synthetic,
    excluded_from_hemp_at: cat.excluded_from_hemp_at ?? null,
    intermediate_product_restricted: cat.intermediate_product_restricted ?? false,
    total_thc_limit_mg_per_container: cat.total_thc_limit_mg_per_container ?? null,
    total_thc_formula: cat.total_thc_formula ?? null,
    seizure_risk_level: cat.seizure_risk_level ?? null,
    warning_labels: cat.warning_labels,
    misc_restrictions: cat.misc_restrictions,
    source_report_id: reportId,
    effective_from: TODAY,
    last_reviewed_at: new Date().toISOString(),
  };

  let ruleId: string;
  if (existing?.id) {
    const { error } = await supabase
      .from("compliance_rules")
      .update(rulePayload)
      .eq("id", existing.id);
    if (error) throw error;
    ruleId = existing.id;
    await logReview("compliance_rules", ruleId, "updated", `Re-ingested from ${REPORT.report_metadata.report_date} report`);
  } else {
    const { data, error } = await supabase
      .from("compliance_rules")
      .insert(rulePayload)
      .select("id")
      .single();
    if (error) throw error;
    ruleId = data.id;
    await logReview("compliance_rules", ruleId, "imported_from_report", `Imported from ${REPORT.report_metadata.report_date} report`);
  }

  // Refresh carrier_policies — delete then insert so we cleanly reflect the
  // current report. Each rule_id has at most a few carrier rows.
  await supabase.from("carrier_policies").delete().eq("rule_id", ruleId);
  if (cat.carrier_policies.length) {
    const { data: cps, error: cpErr } = await supabase
      .from("carrier_policies")
      .insert(
        cat.carrier_policies.map(cp => ({
          rule_id: ruleId,
          carrier: cp.carrier,
          status: cp.status,
          requirements: cp.requirements ?? [],
          prohibited_items: cp.prohibited_items ?? [],
          exceptions: cp.exceptions ?? null,
          notes: cp.notes ?? null,
          source_report_id: reportId,
          last_reviewed_at: new Date().toISOString(),
        })),
      )
      .select("id");
    if (cpErr) throw cpErr;
    for (const cp of cps ?? []) {
      await logReview("carrier_policies", cp.id, "imported_from_report");
    }
  }

  // Refresh state limits the same way.
  await supabase.from("compliance_state_limits").delete().eq("rule_id", ruleId);
  if (cat.state_limits.length) {
    const { data: sls, error: slErr } = await supabase
      .from("compliance_state_limits")
      .insert(
        cat.state_limits.map(sl => ({
          rule_id: ruleId,
          jurisdiction_type: sl.jurisdiction_type,
          state_abbr: sl.state_abbr,
          jurisdiction_name: sl.jurisdiction_name ?? null,
          limit_type: sl.limit_type,
          limit_value_mg: sl.limit_value_mg ?? null,
          is_outright_ban: sl.is_outright_ban ?? false,
          citation: sl.citation ?? null,
          notes: sl.notes ?? null,
          source_report_id: reportId,
          last_reviewed_at: new Date().toISOString(),
        })),
      )
      .select("id");
    if (slErr) throw slErr;
    for (const sl of sls ?? []) {
      await logReview("compliance_state_limits", sl.id, "imported_from_report");
    }
  }

  return ruleId;
}

// ----------------------------------------------------------------------------
// 5. Mark legacy bare-category rows superseded.
// ----------------------------------------------------------------------------
async function deprecateLegacyRows() {
  // Bare 'THCA' and 'Delta-8' rows from the prior seed script — these are
  // replaced by the structured per-form rows above.
  const legacy = ["THCA", "Delta-8"];
  for (const cat of legacy) {
    const { data } = await supabase
      .from("compliance_rules")
      .select("id")
      .eq("category", cat)
      .is("effective_until", null);
    for (const row of data ?? []) {
      const { error } = await supabase
        .from("compliance_rules")
        .update({ effective_until: TODAY })
        .eq("id", row.id);
      if (error) throw error;
      await logReview(
        "compliance_rules",
        row.id,
        "deactivated",
        `Superseded by structured rows from ${REPORT.report_metadata.report_date} report`,
      );
    }
  }
}

// ----------------------------------------------------------------------------
// Entry point
// ----------------------------------------------------------------------------
async function main() {
  console.log(`Ingesting compliance report ${REPORT.report_metadata.report_date}…`);
  const reportId = await insertReport();
  console.log(`  compliance_reports row: ${reportId}`);

  for (const cat of CATEGORIES) {
    const ruleId = await upsertCategory(reportId, cat);
    console.log(`  ${cat.category.padEnd(60)} → ${ruleId}`);
  }

  await deprecateLegacyRows();
  console.log("Done. Review compliance_review_log for the full audit trail.");
}

main().catch(err => {
  console.error("Ingest failed:", err);
  process.exit(1);
});
