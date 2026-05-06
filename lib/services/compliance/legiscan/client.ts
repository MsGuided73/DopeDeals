import { getLegiScanConfig } from './config';

export interface LegiScanSearchHit {
  bill_id: number;
  bill_number: string;
  title: string;
  state: string;
  status: number;
  status_desc?: string;
  last_action: string;
  last_action_date: string;
  url: string;
  text_url?: string;
  research_url?: string;
  relevance: number;
}

export interface LegiScanSearchResponse {
  status: 'OK' | 'ERROR';
  searchresult?: Record<string, LegiScanSearchHit | { page: number; range: string; relevancy: number; count: number }>;
  alert?: { message: string };
}

export interface LegiScanBillResponse {
  status: 'OK' | 'ERROR';
  bill?: {
    bill_id: number;
    state: string;
    bill_number: string;
    title: string;
    description: string;
    status: number;
    status_date: string;
    history: Array<{ date: string; action: string; chamber: string }>;
    sponsors: Array<{ name: string; party: string }>;
    texts: Array<{ doc_id: number; date: string; type: string; mime: string; url: string }>;
    state_link: string;
  };
  alert?: { message: string };
}

const FREE_TIER_DAILY_QUERY_BUDGET = 30000; // LegiScan free tier limit; client does not enforce, just documents.

async function legiscanFetch<T>(op: string, params: Record<string, string | number>): Promise<T> {
  const cfg = getLegiScanConfig();
  const qs = new URLSearchParams({ key: cfg.apiKey, op, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const url = `${cfg.baseUrl}?${qs.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`LegiScan ${op} failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as T & { status?: string; alert?: { message: string } };
  if (data.status === 'ERROR') {
    throw new Error(`LegiScan ${op} error: ${data.alert?.message ?? 'unknown'}`);
  }
  return data;
}

export async function searchBills(args: { state: string; query: string; year?: number; page?: number }): Promise<LegiScanSearchResponse> {
  const params: Record<string, string | number> = {
    state: args.state,
    query: args.query,
    year: args.year ?? 2,
    page: args.page ?? 1,
  };
  return legiscanFetch<LegiScanSearchResponse>('getSearch', params);
}

export async function getBill(billId: number): Promise<LegiScanBillResponse> {
  return legiscanFetch<LegiScanBillResponse>('getBill', { id: billId });
}

export function extractHits(response: LegiScanSearchResponse): LegiScanSearchHit[] {
  if (!response.searchresult) return [];
  return Object.entries(response.searchresult)
    .filter(([k]) => k !== 'summary')
    .map(([, v]) => v as LegiScanSearchHit)
    .filter((h) => typeof h.bill_id === 'number');
}

export const LEGISCAN_BUDGET_NOTE = `LegiScan free tier: ${FREE_TIER_DAILY_QUERY_BUDGET} queries/month. ` +
  `Daily ingest @ 50 states × ~10 keywords = ~500 queries/day = ~15k/month. Stays under cap with margin.`;
