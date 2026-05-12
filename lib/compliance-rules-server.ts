import { createClient } from "@supabase/supabase-js";

/**
 * Server-side fetcher for the active rows of `compliance_rules`. Used by
 * customer-facing widgets (state legality picker on the FAQ / Help page) and
 * any other surface that needs the live restricted-state lists.
 *
 * Returns one row per cannabinoid / product category — the merchandiser
 * edits these directly in Supabase and the site picks up the new values on
 * next render.
 */

export interface ComplianceRule {
  /** e.g. "THCA", "Delta-8", "Delta-10", "HHC", "THC-V", "THC-p", "HTE", "CBN", "CBG", "cannabis", "vape" */
  category: string;
  /** Two-letter state codes where this category cannot ship. */
  restricted_states: string[];
  /** Age gate, default 21. */
  age_requirement: number;
  /** Free-text editor note shown to customers. */
  description: string | null;
  /** Federal vs state — current data is uniformly "US". */
  jurisdiction: string | null;
}

export async function fetchActiveComplianceRules(): Promise<ComplianceRule[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];

  const supabase = createClient(url, anon);
  const { data, error } = await supabase
    .from("compliance_rules")
    .select("category,restricted_states,age_requirement,description,jurisdiction")
    .eq("is_active", true)
    .order("category");

  if (error || !data) return [];

  return data.map((r: any) => ({
    category: r.category as string,
    restricted_states: Array.isArray(r.restricted_states) ? r.restricted_states : [],
    age_requirement: typeof r.age_requirement === "number" ? r.age_requirement : 21,
    description: r.description ?? null,
    jurisdiction: r.jurisdiction ?? null,
  }));
}
