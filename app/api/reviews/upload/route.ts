/**
 * POST /api/reviews/upload
 *
 * Uploads a single review photo to the review-photos bucket under the
 * authenticated user's folder (auth.uid/...). Returns the public URL.
 *
 * Client should call this once per file before submitting the review,
 * collect the returned URLs, and POST them as `photoUrls`.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, getSessionClient } from '../_helpers';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const PUBLIC_URL_BASE = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')}/storage/v1/object/public/review-photos/`;

export async function POST(request: NextRequest) {
  // Auth
  const supabase = await getSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Parse multipart form data
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 413 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type (jpg/png/webp/gif only)' }, { status: 415 });
  }

  // Build a safe path: <user_id>/<timestamp>-<random>.<ext>
  // Random suffix prevents collisions when uploading multiple files in one batch.
  const ext = (file.type.split('/')[1] ?? 'jpg').replace(/[^a-z0-9]/g, '');
  const randomId = Math.random().toString(36).slice(2, 10);
  const filename = `${user.id}/${Date.now()}-${randomId}.${ext}`;

  const admin = getAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from('review-photos')
    .upload(filename, buffer, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) {
    console.error('Review photo upload failed:', uploadError);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  return NextResponse.json({ url: `${PUBLIC_URL_BASE}${filename}` }, { status: 201 });
}
