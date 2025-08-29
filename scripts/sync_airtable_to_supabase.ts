/*
  Sync Airtable -> Supabase (products + product_media + Storage uploads)
  Usage (PowerShell):
    $env:SUPABASE_URL = "https://<project>.supabase.co"
    $env:SUPABASE_SERVICE_ROLE_KEY = "<service>"
    $env:AIRTABLE_TOKEN = "pat..."
    $env:AIRTABLE_BASE = "appXXXXXXXXXXXXXX"
    $env:AIRTABLE_TABLE = "Products"
    pnpm tsx scripts/sync_airtable_to_supabase.ts --limit 50 --since "2024-01-01"
*/

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE!;
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || 'Products';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !AIRTABLE_TOKEN || !AIRTABLE_BASE) {
  console.error('Missing env. Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AIRTABLE_TOKEN, AIRTABLE_BASE');
  process.exit(1);
}

const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Lightweight Airtable fetcher (no SDK to avoid extra deps)
async function* fetchAirtableRecords(params: { limit?: number; since?: string }) {
  const pageSize = 100;
  let offset: string | undefined;
  const until = params.limit ?? Infinity;
  let count = 0;
  const urlBase = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`;

  do {
    const u = new URL(urlBase);
    u.searchParams.set('pageSize', String(pageSize));
    if (offset) u.searchParams.set('offset', offset);
    if (params.since) u.searchParams.set('filterByFormula', `LAST_MODIFIED_TIME()>='${params.since}'`);

    const res = await fetch(u, { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } });
    if (!res.ok) throw new Error(`Airtable HTTP ${res.status}`);
    const json = await res.json();

    for (const rec of json.records as any[]) {
      yield rec;
      count++;
      if (count >= until) return;
    }

    offset = json.offset;
  } while (offset);
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

async function ensureProductBySku(fields: any) {
  const sku = String(fields.SKU || fields.sku || '').trim();
  if (!sku) throw new Error('Missing SKU');

  const name = fields.Name || fields.name || 'Product';
  const shortDesc = fields['Short Description'] || fields.short_description || null;
  const desc = fields.Description || fields.description || null;

  const { data: found, error: findErr } = await supa.from('products').select('id, slug').eq('sku', sku).limit(1).maybeSingle();
  if (findErr) throw findErr;

  const payload: any = {
    sku,
    name,
    short_description: shortDesc,
    description_md: desc,
    slug: toSlug(name),
    airtable_record_id: fields.id || fields.recordId || undefined,
  };

  if (found?.id) {
    const { error } = await supa.from('products').update(payload).eq('id', found.id);
    if (error) throw error;
    return found.id as string;
  } else {
    const { data, error } = await supa.from('products').insert(payload).select('id').single();
    if (error) throw error;
    return data!.id as string;
  }
}

async function uploadAttachment(productId: string, sku: string, att: any, index: number) {
  const filename = att.filename || `image_${index}.jpg`;
  const key = `products/${encodeURIComponent(sku)}/${filename}`;

  // Download file
  const res = await fetch(att.url);
  if (!res.ok) throw new Error(`Download failed: ${att.url}`);
  const buf = Buffer.from(await res.arrayBuffer());

  // Upload to Storage with aggressive caching
  const { error: upErr } = await supa.storage.from('products').upload(key, buf, {
    upsert: true,
    contentType: att.type || 'image/jpeg',
    cacheControl: 'public, max-age=31536000, immutable'
  });
  if (upErr) throw upErr;

  // Insert product_media row
  const media = {
    product_id: productId,
    type: 'image',
    path: key.replace(/^products\//, ''), // store relative to bucket for loader convenience
    alt: att.alt || att.filename || null,
    role: index === 0 ? 'hero' : 'gallery',
    sort: index,
    width: att.width || null,
    height: att.height || null,
  } as any;

  const { error: insErr } = await supa.from('product_media').upsert(media, {
    onConflict: 'product_id, path'
  });
  if (insErr) throw insErr;
}

async function run() {
  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith('--limit'));
  const sinceArg = args.find(a => a.startsWith('--since'));
  const limit = limitArg ? parseInt(limitArg.split('=')[1] || '0', 10) : undefined;
  const since = sinceArg ? sinceArg.split('=')[1] : undefined;

  let processed = 0; let created = 0; let updated = 0; let mediaCount = 0; let errors = 0;

  for await (const rec of fetchAirtableRecords({ limit, since })) {
    try {
      const fields = rec.fields || {};
      const sku = fields.SKU || fields.sku;
      if (!sku) { console.warn('Skipping record without SKU', rec.id); continue; }

      const productId = await ensureProductBySku({ ...fields, id: rec.id });

      const attachments = (fields.Images || fields.images || []) as any[];
      let i = 0;
      for (const att of attachments) {
        await uploadAttachment(productId, String(sku), att, i++);
        mediaCount++;
        // Small throttle to respect Airtable rate limits
        await new Promise(r => setTimeout(r, 200));
      }

      processed++;
    } catch (e) {
      errors++;
      console.error('Sync error for record', rec.id, e);
    }
  }

  console.log(JSON.stringify({ processed, mediaCount, errors }, null, 2));
}

run().catch(err => { console.error(err); process.exit(1); });

