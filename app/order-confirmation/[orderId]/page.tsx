'use client';
// app/order-confirmation/[orderId]/page.tsx
// Single destination for KajaPay post-payment redirect.
// Verifies payment, clears cart, then renders the branded confirmation UI.

import { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle, Package, Truck, Mail, ShieldCheck,
  ExternalLink, ChevronRight, FlaskConical, ArrowLeft,
  Loader2, AlertTriangle,
} from 'lucide-react';

/* ── Constants ───────────────────────────────────────────────── */
const SHIELD =
  'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/3dassets/Shield_Logo2.png';

/* ── Types ───────────────────────────────────────────────────── */
interface OrderItem {
  id: string;
  product_name: string;
  product_sku: string;
  product_image_url: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  status: string;
  payment_status: string;
  subtotal_amount?: number;
  shipping_amount?: number;
  tax_amount?: number;
  total_amount: number;
  shipping_address: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    zip?: string;
  };
  created_at: string;
  order_items: OrderItem[];
}

/* ── Helpers ─────────────────────────────────────────────────── */
const usd = (n: number) => `$${(n ?? 0).toFixed(2)}`;

/* ── Sub-components ──────────────────────────────────────────── */
function TimelineStep({
  icon: Icon, title, body, done,
}: { icon: React.ElementType; title: string; body: string; done?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: done ? '#5BAD52' : '#F0F0F0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={done ? '#fff' : '#9A9A9A'} />
      </div>
      <div style={{ paddingTop: 4 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#2A2B2A' }}>{title}</p>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6B6B6B', lineHeight: 1.5 }}>{body}</p>
      </div>
    </div>
  );
}

/* ── Verifying spinner (shown during payment confirm call) ────── */
function VerifyingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: '#fff', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 20, fontFamily: "'Fira Sans', sans-serif",
    }}>
      <Image src={SHIELD} alt="Highway 420" width={90} height={90}
        style={{ height: 80, width: 'auto', opacity: 0.9 }} />
      <Loader2 size={36} color="#5BAD52" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: 16, fontWeight: 600, color: '#2A2B2A', margin: 0 }}>
        Confirming your payment…
      </p>
      <p style={{ fontSize: 13, color: '#9A9A9A', margin: 0 }}>
        Please don't close this tab
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Error screen ────────────────────────────────────────────── */
function ErrorScreen({ message }: { message: string }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#fff', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, fontFamily: "'Fira Sans', sans-serif", textAlign: 'center',
    }}>
      <Image src={SHIELD} alt="Highway 420" width={80} height={80}
        style={{ height: 72, width: 'auto', marginBottom: 20 }} />
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <AlertTriangle size={26} color="#DC2626" />
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2A2B2A', margin: '0 0 8px' }}>
        Payment Could Not Be Verified
      </h1>
      <p style={{ fontSize: 14, color: '#6B6B6B', maxWidth: 380, marginBottom: 28, lineHeight: 1.6 }}>
        {message} If you believe this is an error, please contact our support team — your order may still have been placed.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/contact" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#5BAD52', color: '#fff', padding: '12px 24px',
          borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14,
        }}>
          Contact Support
        </Link>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          border: '2px solid #E8E8E8', color: '#2A2B2A', padding: '12px 24px',
          borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14,
        }}>
          <ArrowLeft size={15} /> Back to Shop
        </Link>
      </div>
    </div>
  );
}

/* ── Main confirmation UI ────────────────────────────────────── */
function ConfirmationUI({ order }: { order: Order }) {
  const addr = order.shipping_address ?? {};
  const zip = addr.zipcode ?? addr.zip ?? '';
  const subtotal = order.subtotal_amount
    ?? order.order_items.reduce((a, i) => a + i.total_price, 0);
  const shipping = order.shipping_amount ?? 0;
  const tax = order.tax_amount ?? 0;
  const hasFlower = order.order_items.some(i =>
    /flower|thca|preroll|pre-roll|concentrate|edible|gummy/i.test(i.product_name)
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F7', fontFamily: "'Fira Sans', sans-serif" }}>

      {/* Green accent bar */}
      <div style={{ height: 5, background: 'linear-gradient(90deg, #4C9141, #7CC96F)' }} />

      {/* Hero */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8E8E8', padding: '40px 24px 36px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Image src={SHIELD} alt="Highway 420" width={180} height={180}
            style={{ height: 'clamp(80px, 12vw, 110px)', width: 'auto', marginBottom: 20 }}
            priority
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <CheckCircle size={28} color="#5BAD52" strokeWidth={2.5} />
            <h1 style={{ margin: 0, fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#2A2B2A', letterSpacing: '-0.01em' }}>
              Order Confirmed!
            </h1>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: 16, color: '#6B6B6B', fontWeight: 500 }}>
            Thanks, <strong style={{ color: '#2A2B2A' }}>{order.customer_first_name}</strong> — your ride is on its way.
          </p>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#9A9A9A' }}>
            Order&nbsp;<strong>#{order.order_number}</strong>&nbsp;·&nbsp;
            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#EBF5E9', color: '#3A8B32', borderRadius: 999,
            padding: '4px 14px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
          }}>
            <ShieldCheck size={14} /> Payment Verified
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 13, color: '#9A9A9A' }}>
            📧 Receipt sent to <strong style={{ color: '#6B6B6B' }}>{order.customer_email}</strong>
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 820, margin: '32px auto', padding: '0 24px 64px' }}>

        {/* Order Summary */}
        <div className="conf-card">
          <p className="conf-card-title">📦 Order Summary</p>
          {order.order_items.map((item) => (
            <div key={item.id} className="conf-item-row">
              {item.product_image_url && (
                <img src={item.product_image_url} alt={item.product_name}
                  style={{ width: 58, height: 58, objectFit: 'cover', borderRadius: 8, border: '1px solid #F0F0F0', flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#2A2B2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.product_name}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9A9A9A' }}>
                  SKU: {item.product_sku} &nbsp;·&nbsp; Qty: {item.quantity}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#2A2B2A' }}>{usd(item.total_price)}</p>
                {item.quantity > 1 && <p style={{ margin: 0, fontSize: 11, color: '#9A9A9A' }}>{usd(item.unit_price)} each</p>}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <div className="conf-totals-row"><span>Subtotal</span><span>{usd(subtotal)}</span></div>
            <div className="conf-totals-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: '#5BAD52', fontWeight: 600 }}>FREE</span> : usd(shipping)}</span>
            </div>
            {tax > 0 && <div className="conf-totals-row"><span>Tax</span><span>{usd(tax)}</span></div>}
            <div className="conf-totals-row total"><span>Order Total</span><span style={{ color: '#5BAD52' }}>{usd(order.total_amount)}</span></div>
          </div>
        </div>

        {/* Shipping */}
        <div className="conf-card">
          <p className="conf-card-title">🚚 Shipping Details</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#9A9A9A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Deliver To</p>
              <p style={{ margin: 0, fontSize: 14, color: '#2A2B2A', lineHeight: 1.7 }}>
                {order.customer_first_name} {order.customer_last_name}<br />
                {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}<br />
                {addr.city}, {addr.state} {zip}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#9A9A9A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Estimated Arrival</p>
              <p style={{ margin: 0, fontSize: 14, color: '#2A2B2A', fontWeight: 600 }}>3 – 5 Business Days</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9A9A9A' }}>Tracking info emailed when shipped</p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            background: '#FFFBEB', border: '1px solid #F5E096', borderRadius: 10,
            padding: '16px 20px', marginTop: 16,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>📦</span>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#92710A' }}>Ships Discreetly</p>
              <p style={{ margin: 0, fontSize: 13, color: '#A07A18', lineHeight: 1.5 }}>
                Plain, unmarked packaging. No brand name or product details on the outside.
              </p>
            </div>
          </div>
        </div>

        {/* COA — only for hemp/flower products */}
        {hasFlower && (
          <div className="conf-card">
            <p className="conf-card-title">🔬 Lab Results & COAs</p>
            <p style={{ margin: '0 0 16px', fontSize: 14, color: '#6B6B6B', lineHeight: 1.6 }}>
              Every Highway 420 hemp product is third-party lab tested. Verify potency, purity, and safety.
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16, background: '#EBF5E9', border: '1px solid #B5DEB0',
              borderRadius: 10, padding: '16px 20px', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FlaskConical size={20} color="#3A8B32" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#2A2B2A' }}>View Lab Results for Your Products</span>
              </div>
              <Link href="/lab-results" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'transparent', color: '#5BAD52', border: '2px solid #5BAD52',
                borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
              }}>
                View COAs <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="conf-card">
          <p className="conf-card-title">📋 What Happens Next</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <TimelineStep icon={CheckCircle} title="Payment Verified" body="Your payment was processed and confirmed successfully." done />
            <TimelineStep icon={Package} title="Order Being Prepared" body="Our team is picking and packing your items for safe, discreet shipment." done />
            <TimelineStep icon={Mail} title="Shipping Confirmation Email" body={`We'll email ${order.customer_email} with your tracking number once it ships.`} />
            <TimelineStep icon={Truck} title="Out for Delivery" body="Estimated arrival: 3–5 business days from ship date." />
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginTop: 8 }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: '#5BAD52',
            color: '#fff', border: 'none', borderRadius: 8, padding: '14px 28px',
            fontSize: 15, fontWeight: 700, textDecoration: 'none',
          }}>
            Continue Shopping <ChevronRight size={16} />
          </Link>
          <Link href="/orders" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent',
            color: '#5BAD52', border: '2px solid #5BAD52', borderRadius: 8, padding: '12px 24px',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            View My Orders
          </Link>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#BCBCBC', marginTop: 28, lineHeight: 1.6 }}>
          Questions?&nbsp;
          <Link href="/contact" style={{ color: '#5BAD52', fontWeight: 600 }}>Contact us</Link>
          &nbsp;and we'll get back to you fast.
        </p>
      </div>

      {/* Bottom strip */}
      <div style={{ background: '#2A2B2A', padding: '20px 24px', textAlign: 'center' }}>
        <Image src={SHIELD} alt="Highway 420" width={48} height={48}
          style={{ height: 40, width: 'auto', opacity: 0.85, marginBottom: 6 }} />
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
          HIGHWAY420STORE.COM &nbsp;·&nbsp; PREMIUM HEMP &amp; GLASS
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800&display=swap');
        .conf-card { background:#fff; border:1px solid #E8E8E8; border-radius:12px; padding:28px 32px; margin-bottom:18px; }
        .conf-card-title { font-size:15px; font-weight:700; color:#2A2B2A; letter-spacing:0.02em; margin:0 0 20px; padding-bottom:14px; border-bottom:1px solid #F0F0F0; }
        .conf-item-row { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:1px solid #F7F7F7; }
        .conf-item-row:last-child { border-bottom:none; }
        .conf-totals-row { display:flex; justify-content:space-between; align-items:center; font-size:14px; color:#6B6B6B; padding:5px 0; }
        .conf-totals-row.total { font-size:16px; font-weight:800; color:#2A2B2A; padding-top:12px; margin-top:8px; border-top:2px solid #E8E8E8; }
        @media (max-width:600px) { .conf-card { padding:20px 16px; } }
      `}</style>
    </div>
  );
}

/* ── Inner page (needs useSearchParams — must be inside Suspense) */
function OrderConfirmationInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;

  // KajaPay appends these to the redirect URL
  const transactionId = searchParams.get('transactionId') || searchParams.get('transaction_id');
  const referenceNumber = searchParams.get('referenceNumber') || searchParams.get('reference_number');
  const responseCode = searchParams.get('responseCode') || searchParams.get('response_code');

  type Stage = 'verifying' | 'loading_order' | 'done' | 'error';
  const [stage, setStage] = useState<Stage>('verifying');
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (!orderId || ran.current) return;
    ran.current = true;

    async function run() {
      try {
        // ── Step 1: Verify payment with KajaPay confirm API ──────────
        // Only call confirm if returning from KajaPay (transactionId present).
        // If no transactionId (e.g. direct link / already-paid revisit), skip confirm.
        if (transactionId) {
          const confirmRes = await fetch('/api/checkout/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              transactionId,
              referenceNumber,
              responseCode,
              status: 'approved',
            }),
          });

          if (!confirmRes.ok) {
            const data = await confirmRes.json().catch(() => ({}));
            throw new Error(data.error || 'Payment verification failed');
          }

          // Clear cart after successful payment confirmation
          try {
            const { clearCart } = await import('../../lib/cart-utils');
            await clearCart();
          } catch {
            // Non-fatal
          }

          // Clean up sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('pendingOrderId');
          }
        }

        // ── Step 2: Fetch order details for display ──────────────────
        setStage('loading_order');
        const orderRes = await fetch(`/api/orders/${orderId}`);
        if (!orderRes.ok) throw new Error('Could not load your order details');
        const data = await orderRes.json();
        if (data.error) throw new Error(data.error);

        setOrder(data.order);
        setStage('done');
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
        setStage('error');
      }
    }

    run();
  }, [orderId, transactionId, referenceNumber, responseCode]);

  if (stage === 'verifying' || stage === 'loading_order') return <VerifyingScreen />;
  if (stage === 'error' || !order) return <ErrorScreen message={errorMsg || 'Order not found.'} />;
  return <ConfirmationUI order={order} />;
}

/* ── Exported page (Suspense required for useSearchParams) ────── */
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<VerifyingScreen />}>
      <OrderConfirmationInner />
    </Suspense>
  );
}
