// Minimal analytics dispatcher. Replace with real provider (Segment/GA) later.
export type AnalyticsEvent =
  | { type: 'cta_click'; id: string }
  | { type: 'vibe_submitted'; profile: Record<string, unknown> }
  | { type: 'email_subscribed'; vip?: boolean }
  | { type: 'product_clicked'; sku?: string; id?: string };

export function track(event: AnalyticsEvent) {
  try {
    // eslint-disable-next-line no-console
    console.log('[analytics]', event);
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push(event);
    }
  } catch {}
}

