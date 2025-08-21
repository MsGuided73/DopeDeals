import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '../../../server/supabase-storage';

export async function GET() {
  const checks = { prisma: false as boolean, supabase: false as boolean };
  const errors: string[] = [];

  // Prisma check when explicitly enabled
  if (process.env.PRISMA_ENABLED === 'true') {
    try {
      // Simple connectivity test
      await prisma.$queryRaw`SELECT 1`;
      checks.prisma = true;
    } catch (err: any) {
      errors.push(`prisma: ${err?.message || 'unknown error'}`);
    }
  }

  // Supabase server admin check (if configured)
  try {
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('products').select('id').limit(1);
      if (!error) checks.supabase = true; else errors.push(`supabase: ${error.message}`);
    }
  } catch (err: any) {
    errors.push(`supabase: ${err?.message || 'unknown error'}`);
  }

  return NextResponse.json({
    ok: checks.prisma || checks.supabase,
    service: 'next-app',
    checks,
    errors,
    timestamp: new Date().toISOString(),
  });
}
