/**
 * GET /api/reviews/eligibility/[productId]
 *
 * Returns the current user's eligibility to review the given product.
 * Used by the PDP "Write a review" button to render the right state.
 */
import { NextRequest, NextResponse } from 'next/server';
import { checkEligibility, getSessionClient } from '../../_helpers';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  if (!UUID_RE.test(productId)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
  }

  const supabase = await getSessionClient();
  const { data: { user } } = await supabase.auth.getUser();

  const result = await checkEligibility(user?.id ?? null, productId);
  return NextResponse.json(result);
}
