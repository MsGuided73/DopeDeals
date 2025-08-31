import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/app/lib/supabase-server';

const BUCKETS = new Set(['products', 'website-images', 'ads']);

export async function POST(req: NextRequest) {
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

  return NextResponse.json({ path: data?.path, url: publicData.publicUrl });
}

