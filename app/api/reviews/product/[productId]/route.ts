/**
 * GET /api/reviews/product/[productId]
 *
 * Returns paginated reviews for a product plus the aggregate summary
 * (count, average rating, star distribution, would-recommend rate).
 *
 * Query params:
 *   limit  (default 10, max 50)
 *   offset (default 0)
 *   sort   (newest | highest | lowest, default newest)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, getSessionClient } from '../../_helpers';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  newest:  { column: 'created_at', ascending: false },
  highest: { column: 'rating',     ascending: false },
  lowest:  { column: 'rating',     ascending: true  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  if (!UUID_RE.test(productId)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  const url = new URL(request.url);
  const limit = Math.min(50, Math.max(1, Number.parseInt(url.searchParams.get('limit') ?? '10', 10) || 10));
  const offset = Math.max(0, Number.parseInt(url.searchParams.get('offset') ?? '0', 10) || 0);
  const sortParam = url.searchParams.get('sort') ?? 'newest';
  const sort = SORT_MAP[sortParam] ?? SORT_MAP.newest;

  const admin = getAdminClient();

  // Identify the current user (if any) so we can mark which reviews they own,
  // without exposing user_id values publicly.
  const session = await getSessionClient();
  const { data: { user: currentUser } } = await session.auth.getUser();
  const currentUserId = currentUser?.id ?? null;

  // Pull the visible reviews (RLS allows this anonymously, but we use service
  // role here so a future "include hidden for admins" branch lives in one spot)
  const reviewsPromise = admin
    .from('product_reviews')
    .select('id, user_id, rating, title, body, would_recommend, photo_urls, created_at, edited_at')
    .eq('product_id', productId)
    .eq('is_hidden', false)
    .order(sort.column, { ascending: sort.ascending })
    .range(offset, offset + limit - 1);

  // Aggregate summary view
  const summaryPromise = admin
    .from('product_review_summary')
    .select('*')
    .eq('product_id', productId)
    .maybeSingle();

  const [reviewsRes, summaryRes] = await Promise.all([reviewsPromise, summaryPromise]);

  if (reviewsRes.error) {
    console.error('Reviews fetch failed:', reviewsRes.error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  // Resolve display names for each unique reviewer in one query
  const userIds = Array.from(new Set((reviewsRes.data ?? []).map(r => r.user_id)));
  let nameMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await admin
      .from('user_profiles')
      .select('user_id, first_name, last_name')
      .in('user_id', userIds);

    nameMap = Object.fromEntries(
      (profiles ?? []).map(p => {
        const initial = p.last_name ? ` ${String(p.last_name).charAt(0).toUpperCase()}.` : '';
        const display = `${p.first_name ?? 'Anonymous'}${initial}`.trim();
        return [p.user_id, display];
      }),
    );
  }

  const reviews = (reviewsRes.data ?? []).map(r => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    wouldRecommend: r.would_recommend,
    photoUrls: r.photo_urls ?? [],
    createdAt: r.created_at,
    editedAt: r.edited_at,
    reviewerName: nameMap[r.user_id] ?? 'Verified Rider',
    isVerifiedBuyer: true,
    // Server-computed ownership flag — never send raw user_id to the client.
    isOwner: currentUserId !== null && r.user_id === currentUserId,
  }));

  return NextResponse.json({
    reviews,
    summary: summaryRes.data ?? {
      product_id: productId,
      review_count: 0,
      average_rating: null,
      five_star_count: 0,
      four_star_count: 0,
      three_star_count: 0,
      two_star_count: 0,
      one_star_count: 0,
      recommend_count: 0,
      recommend_response_count: 0,
    },
    pagination: { limit, offset, sort: sortParam },
  });
}
