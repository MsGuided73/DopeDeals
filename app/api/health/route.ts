import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const checks = { supabase: false as boolean };
  const errors: string[] = [];

  // Supabase server admin check (if configured)
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log('[Health] Supabase URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.log('[Health] Service Key:', supabaseServiceKey ? 'SET' : 'MISSING');

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data, error } = await supabase.from('products').select('id').limit(1);
      console.log('[Health] Supabase query result:', { data: data?.length || 0, error: error?.message });
      if (!error) checks.supabase = true; else errors.push(`supabase: ${error.message}`);
    } else {
      errors.push('supabase: Missing URL or service key');
    }
  } catch (err: unknown) {
    console.error('[Health] Supabase error:', err);
    errors.push(`supabase: ${(err as Error)?.message || 'unknown error'}`);
  }

  // Migration readiness checks
  let packageManager: string | null = null;
  try {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkgRaw = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgRaw);
    packageManager = pkg.packageManager || null;
  } catch {}

  const root = process.cwd();
  const pnpmLock = fs.existsSync(path.join(root, 'pnpm-lock.yaml'));
  const npmLock = fs.existsSync(path.join(root, 'package-lock.json'));
  const legacy = {
    clientIndexHtml: fs.existsSync(path.join(root, 'client', 'index.html')),
    viteConfig: fs.existsSync(path.join(root, 'vite.config.ts')),
  };

  const envs = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  const migration = {
    packageManager,
    lockfiles: { pnpmLock, npmLock },
    legacy,
    envs,
    storageMode: envs.SUPABASE_SERVICE_ROLE_KEY ? 'supabase' : 'memory',
  } as const;

  return NextResponse.json({
    ok: checks.supabase,
    service: 'next-app',
    checks,
    migration,
    errors,
    timestamp: new Date().toISOString(),
  });
}
