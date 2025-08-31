import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/requireAdmin';

const BUCKETS = new Set(['products', 'website-images', 'ads']);

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const bucket = formData.get('bucket') as string | null;

  if (!file || !bucket || !BUCKETS.has(bucket)) {
    return NextResponse.json({ error: 'Invalid bucket or file missing' }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabaseServer.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicData } = supabaseServer.storage
    .from(bucket)
    .getPublicUrl(fileName);

  const { data: thumbData } = supabaseServer.storage
    .from(bucket)
    .getPublicUrl(fileName, { transform: { width: 200, height: 200, resize: 'contain' } });

  const { data: mediumData } = supabaseServer.storage
    .from(bucket)
    .getPublicUrl(fileName, { transform: { width: 800, height: 800, resize: 'contain' } });

  return NextResponse.json({
    path: data?.path,
    urls: {
      original: publicData.publicUrl,
      thumb: thumbData.publicUrl,
      medium: mediumData.publicUrl,
    },
  });
}

