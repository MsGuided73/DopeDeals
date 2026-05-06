import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { COMPLIANCE_KEYWORDS, US_STATES } from '../lib/services/compliance/legiscan/config';
import { searchBills, extractHits, type LegiScanSearchHit } from '../lib/services/compliance/legiscan/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function ingestStateKeyword(state: string, keyword: string): Promise<{ inserted: number; updated: number; errors: number }> {
  const stats = { inserted: 0, updated: 0, errors: 0 };
  try {
    const response = await searchBills({ state, query: keyword, year: 2 });
    const hits = extractHits(response);
    if (hits.length === 0) return stats;

    for (const hit of hits) {
      const existing = await supabase
        .from('legiscan_bill_tracking')
        .select('bill_id, last_action_date, matched_keywords')
        .eq('bill_id', hit.bill_id)
        .maybeSingle();

      const payload = {
        bill_id: hit.bill_id,
        state: hit.state ?? state,
        bill_number: hit.bill_number,
        title: hit.title,
        status: String(hit.status ?? ''),
        status_date: hit.last_action_date || null,
        last_action: hit.last_action,
        last_action_date: hit.last_action_date || null,
        url: hit.url,
        raw_payload: hit as unknown as Record<string, unknown>,
        last_seen_at: new Date().toISOString(),
      };

      if (!existing.data) {
        const { error } = await supabase
          .from('legiscan_bill_tracking')
          .insert({ ...payload, matched_keywords: [keyword], first_seen_at: new Date().toISOString() });
        if (error) stats.errors++; else stats.inserted++;
      } else {
        const merged = Array.from(new Set([...(existing.data.matched_keywords ?? []), keyword]));
        const { error } = await supabase
          .from('legiscan_bill_tracking')
          .update({ ...payload, matched_keywords: merged })
          .eq('bill_id', hit.bill_id);
        if (error) stats.errors++; else stats.updated++;
      }
    }
  } catch (err) {
    console.error(`[LegiScan] ${state}/${keyword} failed:`, (err as Error).message);
    stats.errors++;
  }
  return stats;
}

async function main() {
  const totals = { inserted: 0, updated: 0, errors: 0, calls: 0 };
  const startedAt = new Date();
  for (const state of US_STATES) {
    for (const keyword of COMPLIANCE_KEYWORDS) {
      const r = await ingestStateKeyword(state, keyword);
      totals.inserted += r.inserted;
      totals.updated  += r.updated;
      totals.errors   += r.errors;
      totals.calls    += 1;
    }
  }
  const elapsedSec = Math.round((Date.now() - startedAt.getTime()) / 1000);
  console.log(`[LegiScan] Done in ${elapsedSec}s — ${totals.calls} API calls, ${totals.inserted} new bills, ${totals.updated} updated, ${totals.errors} errors`);
}

main().catch((err) => {
  console.error('[LegiScan] Fatal:', err);
  process.exit(1);
});
