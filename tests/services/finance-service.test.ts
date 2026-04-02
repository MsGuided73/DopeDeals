import { describe, it, expect } from 'vitest';
import { FinanceService } from '../../lib/services/FinanceService';

describe('FinanceService', () => {
  // ─── Subtotal Calculations ──────────────────────────────────────

  describe('calculateSubtotal', () => {
    it('calculates subtotal from priceAtTime field', () => {
      const items = [
        { priceAtTime: 10.00, quantity: 2 },
        { priceAtTime: 5.50, quantity: 1 },
      ];
      expect(FinanceService.calculateSubtotal(items)).toBe(25.50);
    });

    it('calculates subtotal from price_at_time field', () => {
      const items = [{ price_at_time: 20.00, quantity: 3 }];
      expect(FinanceService.calculateSubtotal(items)).toBe(60.00);
    });

    it('falls back to product.currentPrice', () => {
      const items = [{ product: { currentPrice: 15.00 }, quantity: 2 }];
      expect(FinanceService.calculateSubtotal(items)).toBe(30.00);
    });

    it('falls back to product.our_price', () => {
      const items = [{ product: { our_price: 12.50 }, quantity: 4 }];
      expect(FinanceService.calculateSubtotal(items)).toBe(50.00);
    });

    it('defaults quantity to 1 when missing', () => {
      const items = [{ priceAtTime: 25.00 }];
      expect(FinanceService.calculateSubtotal(items)).toBe(25.00);
    });

    it('returns 0 for empty cart', () => {
      expect(FinanceService.calculateSubtotal([])).toBe(0);
    });

    it('returns 0 when no price fields exist', () => {
      const items = [{ quantity: 2 }];
      expect(FinanceService.calculateSubtotal(items)).toBe(0);
    });

    it('handles string prices by converting to number', () => {
      const items = [{ priceAtTime: '19.99', quantity: 1 }];
      expect(FinanceService.calculateSubtotal(items)).toBe(19.99);
    });
  });

  // ─── Tax Calculations ───────────────────────────────────────────

  describe('calculateTax', () => {
    it('uses California rate for CA', () => {
      const tax = FinanceService.calculateTax(100, 'CA');
      expect(tax).toBe(8.75);
    });

    it('uses New York rate for NY', () => {
      const tax = FinanceService.calculateTax(100, 'NY');
      expect(tax).toBe(8.88); // 8.875 rounded to 2 decimals
    });

    it('uses Texas rate for TX', () => {
      const tax = FinanceService.calculateTax(100, 'TX');
      expect(tax).toBe(6.25);
    });

    it('uses Florida rate for FL', () => {
      const tax = FinanceService.calculateTax(100, 'FL');
      expect(tax).toBe(6.00);
    });

    it('uses Washington rate for WA', () => {
      const tax = FinanceService.calculateTax(100, 'WA');
      expect(tax).toBe(6.50);
    });

    it('uses default 8% rate for unknown state', () => {
      const tax = FinanceService.calculateTax(100, 'ZZ');
      expect(tax).toBe(8.00);
    });

    it('uses default 8% rate when state is null', () => {
      const tax = FinanceService.calculateTax(100, null);
      expect(tax).toBe(8.00);
    });

    it('handles case-insensitive state codes', () => {
      const tax = FinanceService.calculateTax(100, 'ca');
      expect(tax).toBe(8.75);
    });

    it('returns 0 tax on $0 subtotal', () => {
      expect(FinanceService.calculateTax(0, 'CA')).toBe(0);
    });

    it('handles realistic order amounts without floating point errors', () => {
      // $47.97 * 0.08 = 3.8376 → should round to 3.84
      const tax = FinanceService.calculateTax(47.97, null);
      expect(tax).toBe(3.84);
    });
  });

  // ─── Shipping Calculations ──────────────────────────────────────

  describe('calculateShipping', () => {
    it('returns $9.99 standard shipping for orders under $75', () => {
      expect(FinanceService.calculateShipping(50)).toBe(9.99);
    });

    it('returns free shipping for orders at exactly $75', () => {
      expect(FinanceService.calculateShipping(75)).toBe(0);
    });

    it('returns free shipping for orders over $75', () => {
      expect(FinanceService.calculateShipping(100)).toBe(0);
    });

    it('returns $19.99 for express shipping regardless of subtotal', () => {
      expect(FinanceService.calculateShipping(100, 'express')).toBe(19.99);
      expect(FinanceService.calculateShipping(50, 'express')).toBe(19.99);
    });

    it('defaults to standard shipping when method not specified', () => {
      expect(FinanceService.calculateShipping(50)).toBe(9.99);
    });

    it('returns standard shipping for $0 orders', () => {
      expect(FinanceService.calculateShipping(0)).toBe(9.99);
    });
  });

  // ─── Format Amount ──────────────────────────────────────────────

  describe('formatAmount', () => {
    it('formats to 2 decimal places', () => {
      expect(FinanceService.formatAmount(10)).toBe('10.00');
      expect(FinanceService.formatAmount(10.5)).toBe('10.50');
      expect(FinanceService.formatAmount(10.999)).toBe('11.00');
    });

    it('returns string type', () => {
      expect(typeof FinanceService.formatAmount(10)).toBe('string');
    });
  });

  // ─── End-to-End Order Total ─────────────────────────────────────

  describe('full order calculation', () => {
    it('calculates a realistic order correctly', () => {
      const items = [
        { priceAtTime: 29.99, quantity: 2 }, // $59.98
        { priceAtTime: 14.99, quantity: 1 }, // $14.99
      ];

      const subtotal = FinanceService.calculateSubtotal(items); // $74.97
      const tax = FinanceService.calculateTax(subtotal, 'TX');   // $74.97 * 0.0625 = $4.69
      const shipping = FinanceService.calculateShipping(subtotal); // $9.99 (under $75)
      const total = subtotal + tax + shipping;

      expect(subtotal).toBe(74.97);
      expect(tax).toBe(4.69);
      expect(shipping).toBe(9.99);
      expect(FinanceService.formatAmount(total)).toBe('89.65');
    });

    it('calculates a free-shipping order correctly', () => {
      const items = [
        { priceAtTime: 49.99, quantity: 1 },
        { priceAtTime: 35.00, quantity: 1 },
      ];

      const subtotal = FinanceService.calculateSubtotal(items); // $84.99
      const tax = FinanceService.calculateTax(subtotal, 'CA');
      const shipping = FinanceService.calculateShipping(subtotal); // free

      expect(subtotal).toBeCloseTo(84.99, 2);
      expect(shipping).toBe(0);
      expect(tax).toBeCloseTo(7.44, 2); // 84.99 * 0.0875
    });
  });
});
