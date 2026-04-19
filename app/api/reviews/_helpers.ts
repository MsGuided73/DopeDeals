/**
 * Shared helpers for the product review API.
 *
 * All review endpoints rely on these so the eligibility/verification logic
 * stays in one place and can't drift between routes.
 */
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Returns a session-scoped Supabase client backed by the request cookies.
 * Use this to identify the current user via auth.getUser().
 */
export async function getSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });
}

/**
 * Returns a service-role Supabase client that bypasses RLS.
 * Only use after the route has independently verified the caller's identity
 * and authorization to perform the action.
 */
export function getAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type EligibilityReason =
  | 'not_signed_in'
  | 'email_not_verified'
  | 'age_not_verified'
  | 'no_delivered_purchase'
  | 'already_reviewed';

export type EligibilityResult =
  | { canReview: true; orderItemId: string; existingReviewId: null }
  | {
      canReview: false;
      reason: EligibilityReason;
      orderItemId: string | null;
      existingReviewId: string | null;
    };

/**
 * Single source of truth for "can this user review this product?".
 *
 * Gates (in evaluation order):
 *   1. Signed in
 *   2. user_profiles.email_verified = true
 *   3. users.age_verification_status = 'verified'
 *   4. Has an order_item where the linked order belongs to the user, the
 *      linked order is status='delivered' with delivered_at set
 *   5. Hasn't already submitted a review for this product
 *
 * Returns the order_item.id that proves the purchase so the POST route can
 * persist it on the new review (provenance / audit trail).
 */
export async function checkEligibility(
  userId: string | null,
  productId: string,
): Promise<EligibilityResult> {
  if (!userId) {
    return { canReview: false, reason: 'not_signed_in', orderItemId: null, existingReviewId: null };
  }

  const admin = getAdminClient();

  // Verification: email
  const { data: profile } = await admin
    .from('user_profiles')
    .select('email_verified')
    .eq('user_id', userId)
    .maybeSingle();

  if (!profile?.email_verified) {
    return { canReview: false, reason: 'email_not_verified', orderItemId: null, existingReviewId: null };
  }

  // Verification: age
  const { data: userRow } = await admin
    .from('users')
    .select('age_verification_status')
    .eq('id', userId)
    .maybeSingle();

  if (userRow?.age_verification_status !== 'verified') {
    return { canReview: false, reason: 'age_not_verified', orderItemId: null, existingReviewId: null };
  }

  // Already reviewed?
  const { data: existing } = await admin
    .from('product_reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    return {
      canReview: false,
      reason: 'already_reviewed',
      orderItemId: null,
      existingReviewId: existing.id,
    };
  }

  // Delivered purchase containing this product.
  // Use an inner join so we only get rows where the order is delivered.
  const { data: orderItem } = await admin
    .from('order_items')
    .select('id, orders!inner(user_id, status, delivered_at)')
    .eq('product_id', productId)
    .eq('orders.user_id', userId)
    .eq('orders.status', 'delivered')
    .not('orders.delivered_at', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!orderItem) {
    return { canReview: false, reason: 'no_delivered_purchase', orderItemId: null, existingReviewId: null };
  }

  return { canReview: true, orderItemId: orderItem.id, existingReviewId: null };
}
