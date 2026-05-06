// One-shot diagnostic — reports which required env vars are SET (presence
// only, never values) so we can verify a deploy has its config right after
// rolling. Useful for any env-var-related production bug.
//
// Optionally gated by HEALTH_CHECK_KEY: if that env is set on the server,
// callers must pass `?key=<value>` to read. If HEALTH_CHECK_KEY is unset, the
// endpoint is open (it leaks no secrets — only presence — but consider gating
// in long-running production deploys).
//
//   curl https://highway420store.com/api/_health/env
//   curl https://highway420store.com/api/_health/env?key=<HEALTH_CHECK_KEY>

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type VarStatus = { name: string; set: boolean; value_length?: number };

function check(name: string): VarStatus {
  const v = process.env[name];
  const set = typeof v === 'string' && v.length > 0;
  return set ? { name, set, value_length: v!.length } : { name, set };
}

const SUPABASE_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const KAJAPAY_VARS = [
  'KAJAPAY_ENVIRONMENT',
  'KAJAPAY_SOURCE_KEY',
  'KAJAPAY_PAYMENT_PAGE_SLUG', // ← throws "Payment session creation failed" if missing
  'KAJAPAY_TOKENIZATION_KEY',
];

// KAJAPAY accepts either KAJAPAY_SOURCE_KEY_PIN or KAJAPAY_PASSWORD.
const KAJAPAY_AUTH_VARS = ['KAJAPAY_SOURCE_KEY_PIN', 'KAJAPAY_PASSWORD'];

const SHIPSTATION_VARS = [
  'SHIPSTATION_API_KEY',
  'SHIPSTATION_API_SECRET',
];

const SITE_VARS = [
  'NEXT_PUBLIC_SITE_URL',
];

export async function GET(req: NextRequest) {
  const required = process.env.HEALTH_CHECK_KEY;
  if (required) {
    const provided = req.nextUrl.searchParams.get('key');
    if (provided !== required) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const supabase = SUPABASE_VARS.map(check);
  const kajapay = KAJAPAY_VARS.map(check);
  const kajapayAuth = KAJAPAY_AUTH_VARS.map(check);
  const shipstation = SHIPSTATION_VARS.map(check);
  const site = SITE_VARS.map(check);

  const kajapayAuthOk = kajapayAuth.some((v) => v.set);
  const kajapayReady = kajapay.every((v) => v.set) && kajapayAuthOk;
  const supabaseReady = supabase.every((v) => v.set);
  const siteReady = site.every((v) => v.set);
  const shipstationReady = shipstation.every((v) => v.set);

  const missing = [
    ...supabase.filter((v) => !v.set).map((v) => v.name),
    ...kajapay.filter((v) => !v.set).map((v) => v.name),
    ...(kajapayAuthOk ? [] : ['KAJAPAY_SOURCE_KEY_PIN_or_KAJAPAY_PASSWORD']),
    ...site.filter((v) => !v.set).map((v) => v.name),
  ];

  return NextResponse.json({
    ready: supabaseReady && kajapayReady && siteReady,
    missing,
    groups: {
      site: { ready: siteReady, vars: site },
      supabase: { ready: supabaseReady, vars: supabase },
      kajapay: {
        ready: kajapayReady,
        vars: kajapay,
        auth: { ok: kajapayAuthOk, vars: kajapayAuth },
      },
      shipstation: { ready: shipstationReady, vars: shipstation, note: 'optional — orders still succeed without' },
    },
    runtime: {
      node: process.version,
      vercel_or_coolify: process.env.VERCEL ? 'vercel' : process.env.COOLIFY_URL ? 'coolify' : 'unknown',
      timestamp: new Date().toISOString(),
    },
  });
}
