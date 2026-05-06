"use client";

import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import ThcDisclaimer from './ThcDisclaimer';

/**
 * Renders <ThcDisclaimer /> when the current cart contains at least one
 * consumable product. Used in the CheckoutLayout footer so it shows on
 * shipping, review, processing, etc. without each page wiring it up.
 *
 * Cart items don't carry category_slug client-side, so we POST the
 * productIds to /api/cart/has-consumables which does the lookup.
 */
export default function CartConsumableDisclaimer() {
  const { cart } = useCart();
  const [hasConsumables, setHasConsumables] = useState(false);

  // Stringify the id list so the effect only re-runs when the set actually changes,
  // not on every cart mutation that leaves the productIds untouched.
  const productIdKey = (cart?.items ?? [])
    .map((i) => i.productId)
    .sort()
    .join(',');

  useEffect(() => {
    if (!productIdKey) {
      setHasConsumables(false);
      return;
    }

    let cancelled = false;
    const productIds = productIdKey.split(',');

    fetch('/api/cart/has-consumables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setHasConsumables(Boolean(data?.hasConsumables));
      })
      .catch(() => {
        // Fail-closed: show the disclaimer if we can't tell.
        if (!cancelled) setHasConsumables(true);
      });

    return () => {
      cancelled = true;
    };
  }, [productIdKey]);

  if (!hasConsumables) return null;

  return (
    <div className="mt-12">
      <ThcDisclaimer />
    </div>
  );
}
