import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/requireAdmin';
import { checkRateLimit, getRateLimitIdentifier, getRateLimitHeaders, RATE_LIMITS } from './rate-limit';

const BUCKETS = ['products', 'website-images', 'ads'] as const;

export async function GET(req: NextRequest) {
  // Admin authentication check
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  // Rate limiting
  const userId = auth.user.id;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  const identifier = getRateLimitIdentifier(userId, ip || undefined);
  const rateLimit = checkRateLimit(identifier, RATE_LIMITS.list);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimit, RATE_LIMITS.list)
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const bucket = searchParams.get('bucket') || 'website-images';
  const folder = searchParams.get('folder') || '';
  const limit = parseInt(searchParams.get('limit') || '1000');

  if (!BUCKETS.includes(bucket as any)) {
    return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
  }

  try {
    // List files from Supabase Storage
    const { data: files, error } = await supabaseServer.storage
      .from(bucket)
      .list(folder, {
        limit,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Error listing files:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform files into asset objects with full URLs
    const assets = files
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => {
        const path = folder ? `${folder}/${file.name}` : file.name;
        const { data: publicData } = supabaseServer.storage
          .from(bucket)
          .getPublicUrl(path);

        return {
          id: file.id || file.name,
          name: file.name,
          path,
          url: publicData.publicUrl,
          bucket,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || 'image/jpeg',
          created_at: file.created_at || new Date().toISOString(),
          metadata: {
            width: file.metadata?.width,
            height: file.metadata?.height,
          },
        };
      });

    // Calculate stats
    const stats = {
      totalCount: assets.length,
      totalSize: assets.reduce((sum, asset) => sum + asset.size, 0),
    };

    return NextResponse.json(
      { assets, stats },
      { headers: getRateLimitHeaders(rateLimit, RATE_LIMITS.list) }
    );
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

