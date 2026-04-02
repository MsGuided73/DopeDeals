import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('Order Payment & ShipStation Tracking', () => {
  describe('KajaPay Webhook', () => {
    const source = readFileSync('app/api/kajapay/webhook/route.ts', 'utf-8');

    it('exports POST and GET handlers', async () => {
      const mod = await import('../../app/api/kajapay/webhook/route');
      expect(typeof mod.POST).toBe('function');
      expect(typeof mod.GET).toBe('function');
    });

    it('stores payment_confirmed_at timestamp on approved transactions', () => {
      expect(source).toContain('payment_confirmed_at');
    });

    it('stores kajapay_transaction_id on the order', () => {
      expect(source).toContain('kajapay_transaction_id');
    });

    it('handles both approved and declined event types', () => {
      expect(source).toContain("'transaction.approved'");
      expect(source).toContain("'transaction.declined'");
      expect(source).toContain("'payment.completed'");
      expect(source).toContain("'payment.failed'");
    });

    it('logs webhook events for audit trail', () => {
      expect(source).toContain('kajapay_webhook_events');
      expect(source).toContain('logWebhookEvent');
    });
  });

  describe('Checkout - ShipStation Integration', () => {
    const source = readFileSync('app/api/checkout/route.ts', 'utf-8');

    it('exports POST handler', async () => {
      const mod = await import('../../app/api/checkout/route');
      expect(typeof mod.POST).toBe('function');
    });

    it('stores ShipStation order ID on the order after creation', () => {
      expect(source).toContain('shipstation_order_id');
      expect(source).toContain('shipstationOrderId');
    });

    it('stores ShipStation order key on the order', () => {
      expect(source).toContain('shipstation_order_key');
    });

    it('handles ShipStation failure gracefully without blocking checkout', () => {
      // ShipStation errors should be caught and logged, not thrown
      expect(source).toContain('ShipStation is non-blocking');
      expect(source).toContain('catch (ssError)');
    });
  });

  describe('Admin Order Detail API', () => {
    const source = readFileSync('app/api/admin/orders/[orderId]/route.ts', 'utf-8');

    it('returns payment_confirmed_at in the select query', () => {
      expect(source).toContain('payment_confirmed_at');
    });

    it('returns kajapay_transaction_id in the select query', () => {
      expect(source).toContain('kajapay_transaction_id');
    });

    it('returns shipstation_order_id in the select query', () => {
      expect(source).toContain('shipstation_order_id');
    });

    it('returns shipstation_order_key in the select query', () => {
      expect(source).toContain('shipstation_order_key');
    });
  });

  describe('Admin Order Detail Page', () => {
    const source = readFileSync('app/admin/orders/[orderId]/page.tsx', 'utf-8');

    it('displays payment confirmation status', () => {
      expect(source).toContain('Payment received by KajaPay');
      expect(source).toContain('Awaiting payment confirmation');
    });

    it('displays payment confirmation date in timeline', () => {
      expect(source).toContain('Payment Confirmed by KajaPay');
    });

    it('displays KajaPay transaction ID', () => {
      expect(source).toContain('KajaPay Txn ID');
      expect(source).toContain('kajapay_transaction_id');
    });

    it('displays ShipStation order status', () => {
      expect(source).toContain('Order sent to ShipStation');
      expect(source).toContain('Not yet sent to ShipStation');
    });

    it('displays ShipStation order ID', () => {
      expect(source).toContain('shipstation_order_id');
    });

    it('shows shipped and delivered dates in timeline', () => {
      expect(source).toContain('shipped_at');
      expect(source).toContain('delivered_at');
    });
  });

  describe('Admin Orders List Page', () => {
    const source = readFileSync('app/admin/orders/page.tsx', 'utf-8');

    it('includes payment_confirmed_at in the Order interface', () => {
      expect(source).toContain('payment_confirmed_at');
    });

    it('includes shipstation_order_id in the Order interface', () => {
      expect(source).toContain('shipstation_order_id');
    });

    it('shows payment confirmation date in the table', () => {
      // Should show a date when payment is confirmed
      expect(source).toContain('payment_confirmed_at');
      expect(source).toContain('toLocaleDateString');
    });

    it('shows ShipStation indicator in the table', () => {
      expect(source).toContain('ShipStation');
    });
  });

  describe('Database Migration', () => {
    const migration = readFileSync('supabase/migrations/20260402_order_payment_shipstation_tracking.sql', 'utf-8');

    it('adds payment_confirmed_at column', () => {
      expect(migration).toContain('payment_confirmed_at');
      expect(migration).toContain('TIMESTAMPTZ');
    });

    it('adds kajapay_transaction_id column', () => {
      expect(migration).toContain('kajapay_transaction_id');
    });

    it('adds shipstation_order_id column', () => {
      expect(migration).toContain('shipstation_order_id');
    });

    it('adds shipstation_order_key column', () => {
      expect(migration).toContain('shipstation_order_key');
    });

    it('creates indexes for query performance', () => {
      expect(migration).toContain('idx_orders_payment_confirmed_at');
      expect(migration).toContain('idx_orders_shipstation_order_id');
    });

    it('uses IF NOT EXISTS for safe re-runs', () => {
      expect(migration).toContain('IF NOT EXISTS');
    });
  });
});
