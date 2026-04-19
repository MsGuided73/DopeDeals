/**
 * POST /api/reviews
 *
 * Creates a new product review. Re-validates every gate server-side before
 * inserting (don't trust the client's eligibility-check result).
 *
 * Body:
 *   {
 *     productId: string (uuid),
 *     rating: 1..5,
 *     title?: string (<= 100 chars),
 *     body: string (20..1500 chars),
 *     wouldRecommend?: boolean,
 *     photoUrls?: string[] (<= 4)
 *   }
 */
import { NextRequest, NextResponse } from 'next/server';
import { checkEligibility, getAdminClient, getSessionClient } from './_helpers';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REVIEW_PHOTO_HOST = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')}/storage/v1/object/public/review-photos/`;

type Body = {
  productId?: unknown;
  rating?: unknown;
  title?: unknown;
  body?: unknown;
  wouldRecommend?: unknown;
  photoUrls?: unknown;
};

export async function POST(request: NextRequest) {
  let payload: Body;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // ── Input validation ─────────────────────────────────────
  const productId = typeof payload.productId === 'string' ? payload.productId : '';
  if (!UUID_RE.test(productId)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  const rating = typeof payload.rating === 'number' ? payload.rating : NaN;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be an integer 1-5' }, { status: 400 });
  }

  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  if (body.length < 20 || body.length > 1500) {
    return NextResponse.json({ error: 'Review body must be 20-1500 characters' }, { status: 400 });
  }

  const title = typeof payload.title === 'string' && payload.title.trim().length > 0
    ? payload.title.trim().slice(0, 100)
    : null;

  const wouldRecommend = typeof payload.wouldRecommend === 'boolean' ? payload.wouldRecommend : null;

  let photoUrls: string[] = [];
  if (Array.isArray(payload.photoUrls)) {
    photoUrls = payload.photoUrls
      .filter((u): u is string => typeof u === 'string')
      .slice(0, 4);
    // Defence in depth: ensure photo URLs all live in our bucket. Prevents the
    // client from injecting arbitrary external image URLs into a review.
    for (const url of photoUrls) {
      if (!url.startsWith(REVIEW_PHOTO_HOST)) {
        return NextResponse.json({ error: 'Photo URLs must be from review-photos bucket' }, { status: 400 });
      }
    }
  }

  // ── Auth + eligibility re-check ──────────────────────────
  const supabase = await getSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const eligibility = await checkEligibility(user.id, productId);
  if (!eligibility.canReview) {
    return NextResponse.json(
      { error: 'Not eligible to review', reason: eligibility.reason },
      { status: 403 },
    );
  }

  // ── Insert ───────────────────────────────────────────────
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('product_reviews')
    .insert({
      product_id: productId,
      user_id: user.id,
      order_item_id: eligibility.orderItemId,
      rating,
      title,
      body,
      would_recommend: wouldRecommend,
      photo_urls: photoUrls,
    })
    .select('id, created_at')
    .single();

  if (error) {
    console.error('Review insert failed:', error);
    // Race condition: someone may have just submitted a review for this product
    if (error.code === '23505') {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 });
}
