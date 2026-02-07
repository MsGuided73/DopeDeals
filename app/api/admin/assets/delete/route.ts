import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/requireAdmin';
import { checkRateLimit, getRateLimitIdentifier, getRateLimitHeaders, RATE_LIMITS } from '../rate-limit';

export const dynamic = 'force-dynamic';

const BUCKETS = new Set(['products', 'website-images', 'ads']);

export async function POST(req: NextRequest) {
  // Admin authentication check
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  // Rate limiting
  const userId = auth.user.id;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  const identifier = getRateLimitIdentifier(userId, ip || undefined);
  const rateLimit = checkRateLimit(identifier, RATE_LIMITS.delete);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Delete rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimit, RATE_LIMITS.delete)
      }
    );
  }

  try {
    const body = await req.json();
    const { assetIds, bucket } = body;

    if (!bucket || !BUCKETS.has(bucket)) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
    }

    if (!Array.isArray(assetIds) || assetIds.length === 0) {
      return NextResponse.json(
        { error: 'Asset IDs must be a non-empty array' },
        { status: 400 }
      );
    }

    // Delete files from Supabase Storage
    const { data, error } = await supabaseServer.storage
      .from(bucket)
      .remove(assetIds);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        deleted: data?.length || 0,
      },
      { headers: getRateLimitHeaders(rateLimit, RATE_LIMITS.delete) }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete assets' },
      { status: 500 }
    );
  }
}

