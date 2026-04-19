/**
 * PATCH  /api/reviews/[id]   — owner edits their own review
 * DELETE /api/reviews/[id]   — owner deletes their own review
 *
 * Both endpoints verify ownership server-side. Admin moderation is handled
 * via the service role from a separate admin endpoint (not exposed here).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, getSessionClient } from '../_helpers';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REVIEW_PHOTO_HOST = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')}/storage/v1/object/public/review-photos/`;

async function getOwnerOrError(reviewId: string) {
  const supabase = await getSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  }

  const admin = getAdminClient();
  const { data: review } = await admin
    .from('product_reviews')
    .select('id, user_id, photo_urls')
    .eq('id', reviewId)
    .maybeSingle();

  if (!review) {
    return { error: NextResponse.json({ error: 'Review not found' }, { status: 404 }) };
  }
  if (review.user_id !== user.id) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { user, admin, review };
}

// ─── PATCH (edit) ────────────────────────────────────────────────────────────
type EditBody = {
  rating?: unknown;
  title?: unknown;
  body?: unknown;
  wouldRecommend?: unknown;
  photoUrls?: unknown;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid review id' }, { status: 400 });
  }

  let payload: EditBody;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const ownerCheck = await getOwnerOrError(id);
  if (ownerCheck.error) return ownerCheck.error;
  const { admin } = ownerCheck;

  // Build the update object from only the fields the client provided.
  // Using `Record<string, unknown>` keeps us typesafe at the boundary.
  const updates: Record<string, unknown> = { edited_at: new Date().toISOString() };

  if (payload.rating !== undefined) {
    const r = payload.rating;
    if (typeof r !== 'number' || !Number.isInteger(r) || r < 1 || r > 5) {
      return NextResponse.json({ error: 'Rating must be an integer 1-5' }, { status: 400 });
    }
    updates.rating = r;
  }

  if (payload.title !== undefined) {
    if (payload.title === null || payload.title === '') {
      updates.title = null;
    } else if (typeof payload.title === 'string') {
      updates.title = payload.title.trim().slice(0, 100);
    } else {
      return NextResponse.json({ error: 'Title must be a string or null' }, { status: 400 });
    }
  }

  if (payload.body !== undefined) {
    if (typeof payload.body !== 'string') {
      return NextResponse.json({ error: 'Body must be a string' }, { status: 400 });
    }
    const trimmed = payload.body.trim();
    if (trimmed.length < 20 || trimmed.length > 1500) {
      return NextResponse.json({ error: 'Review body must be 20-1500 characters' }, { status: 400 });
    }
    updates.body = trimmed;
  }

  if (payload.wouldRecommend !== undefined) {
    if (payload.wouldRecommend !== null && typeof payload.wouldRecommend !== 'boolean') {
      return NextResponse.json({ error: 'wouldRecommend must be boolean or null' }, { status: 400 });
    }
    updates.would_recommend = payload.wouldRecommend;
  }

  if (payload.photoUrls !== undefined) {
    if (!Array.isArray(payload.photoUrls)) {
      return NextResponse.json({ error: 'photoUrls must be an array' }, { status: 400 });
    }
    const urls = payload.photoUrls.filter((u): u is string => typeof u === 'string').slice(0, 4);
    for (const url of urls) {
      if (!url.startsWith(REVIEW_PHOTO_HOST)) {
        return NextResponse.json({ error: 'Photo URLs must be from review-photos bucket' }, { status: 400 });
      }
    }
    updates.photo_urls = urls;
  }

  const { error } = await admin
    .from('product_reviews')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Review update failed:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid review id' }, { status: 400 });
  }

  const ownerCheck = await getOwnerOrError(id);
  if (ownerCheck.error) return ownerCheck.error;
  const { admin, review } = ownerCheck;

  // Best-effort: remove the photos from storage too. Don't fail the delete if
  // storage cleanup hits an error — the review row going away is what matters.
  if (review.photo_urls && review.photo_urls.length > 0) {
    const paths = review.photo_urls
      .map((url: string) => url.replace(REVIEW_PHOTO_HOST, ''))
      .filter((p: string) => p.length > 0);
    if (paths.length > 0) {
      const { error: storageError } = await admin.storage
        .from('review-photos')
        .remove(paths);
      if (storageError) {
        console.warn('Review photo cleanup failed (continuing):', storageError);
      }
    }
  }

  const { error } = await admin
    .from('product_reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Review delete failed:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
