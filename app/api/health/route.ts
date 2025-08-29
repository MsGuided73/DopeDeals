import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const checks = { prisma: false as boolean, supabase: false as boolean };
  const errors: string[] = [];

  // Prisma check when explicitly enabled
  if (process.env.PRISMA_ENABLED === 'true') {
    try {
      // Simple connectivity test
      await prisma.$queryRaw`SELECT 1`;
      checks.prisma = true;
    } catch (err: unknown) {
      errors.push(`prisma: ${(err as Error)?.message || 'unknown error'}`);
    }
  }

  // Supabase server admin check (if configured)
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { error } = await supabase.from('products').select('id').limit(1);
      if (!error) checks.supabase = true; else errors.push(`supabase: ${error.message}`);
    }
  } catch (err: unknown) {
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
    ok: checks.prisma || checks.supabase,
    service: 'next-app',
    checks,
    migration,
    errors,
    timestamp: new Date().toISOString(),
  });
}
