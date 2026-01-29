import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/requireAdmin';
import { checkRateLimit, getRateLimitIdentifier, getRateLimitHeaders, RATE_LIMITS } from '../rate-limit';

const BUCKETS = new Set(['products', 'website-images', 'ads']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  // Admin authentication check
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  // Rate limiting
  const userId = auth.user.id;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
  const identifier = getRateLimitIdentifier(userId, ip || undefined);
  const rateLimit = checkRateLimit(identifier, RATE_LIMITS.upload);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Upload rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimit, RATE_LIMITS.upload)
      }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = formData.get('bucket') as string | null;
    const folder = formData.get('folder') as string | null;

    if (!file || !bucket || !BUCKETS.has(bucket)) {
      return NextResponse.json(
        { error: 'Invalid bucket or file missing' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${sanitizedName}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabaseServer.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URLs with different sizes
    const { data: publicData } = supabaseServer.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const { data: thumbData } = supabaseServer.storage
      .from(bucket)
      .getPublicUrl(filePath, {
        transform: { width: 200, height: 200, resize: 'contain' },
      });

    const { data: mediumData } = supabaseServer.storage
      .from(bucket)
      .getPublicUrl(filePath, {
        transform: { width: 800, height: 800, resize: 'contain' },
      });

    return NextResponse.json(
      {
        success: true,
        path: data?.path,
        urls: {
          original: publicData.publicUrl,
          thumb: thumbData.publicUrl,
          medium: mediumData.publicUrl,
        },
      },
      { headers: getRateLimitHeaders(rateLimit, RATE_LIMITS.upload) }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

