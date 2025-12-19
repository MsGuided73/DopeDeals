# Payment Security Implementation Guide

**URGENT:** Implement these changes IMMEDIATELY to achieve payment processor compliance.

---

## 🚨 CRITICAL SECURITY ISSUES TO FIX

### Issue #1: Raw Card Data Collection (CRITICAL)

**Current Problem:** Your checkout form collects raw card data:
```typescript
// DANGEROUS - Current implementation
const [cardNumber, setCardNumber] = useState('');
const [cvv, setCvv] = useState('');
const [expiryMonth, setExpiryMonth] = useState('');
```

**Required Fix:** Implement tokenized payment processing:

```typescript
// SECURE - Tokenized implementation
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const handlePayment = async (paymentData) => {
  // Create payment method token (client-side)
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: {
      number: paymentData.cardNumber,
      exp_month: paymentData.expiryMonth,
      exp_year: paymentData.expiryYear,
      cvc: paymentData.cvv,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // Send ONLY token to server
  const response = await fetch('/api/process-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      paymentMethodId: paymentMethod.id,
      amount: orderTotal,
      orderId: orderId
    })
  });

  return response.json();
};
```

### Issue #2: No PCI DSS Compliance (CRITICAL)

**Required Implementation:**

1. **Install PCI Compliant Payment Gateway**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
# OR for KajaPay
npm install kajapay-js-sdk
```

2. **Create Secure Payment Component**
```typescript
// app/components/SecurePaymentForm.tsx
'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function SecurePaymentForm({ orderTotal, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      onError(error.message);
    } else {
      // Send payment method ID (not card details)
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: orderTotal,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        onSuccess(result);
      } else {
        onError(result.error);
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
        <button 
          type="submit" 
          disabled={processing || !stripe}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {processing ? 'Processing...' : `Pay $${orderTotal}`}
        </button>
      </div>
    </form>
  );
}
```

### Issue #3: Update Checkout API (HIGH PRIORITY)

**Current Vulnerable API:**
```typescript
// VULNERABLE - app/api/checkout/route.ts
const { cardNumber, cvv, expiryMonth, expiryYear } = paymentMethod;
```

**Secure API Implementation:**
```typescript
// SECURE - app/api/payments/process.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { paymentMethodId, amount, orderId } = await request.json();

    // Validate required fields
    if (!paymentMethodId || !amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process payment using token only
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      metadata: { orderId }
    });

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      await updateOrderPaymentStatus(orderId, {
        status: 'paid',
        transactionId: paymentIntent.id,
        paidAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        transactionId: paymentIntent.id,
        status: 'succeeded'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: paymentIntent.last_payment_error?.message || 'Payment failed'
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
```

---

## 🔧 IMPLEMENTATION STEPS (IMMEDIATE)

### Step 1: Install Payment Gateway SDK (TODAY)
```bash
# Choose ONE payment processor:

# Option A: Stripe (Recommended for immediate implementation)
npm install @stripe/stripe-js @stripe/react-stripe-js

# Option B: KajaPay (Cannabis-specific)
npm install kajapay-js-sdk

# Option C: Pinwheel (Modern payment infrastructure)
npm install @pinwheel/react
```

### Step 2: Update Environment Variables
```bash
# .env.local
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OR KajaPay Configuration
KAJA_PAY_API_KEY=...
KAJA_PAY_SECRET_KEY=...
KAJA_PAY_WEBHOOK_SECRET=...

# Security
NEXT_PUBLIC_PAYMENT_GATEWAY=stripe # or kajapay
ALLOWED_ORIGINS=https://highway420store.com
```

### Step 3: Replace Checkout Form (TODAY)
1. **Backup current checkout:**
   ```bash
   cp app/checkout/page.tsx app/checkout/page.tsx.backup
   ```

2. **Create secure payment component:**
   ```bash
   mkdir -p app/components/payment
   touch app/components/payment/SecurePaymentForm.tsx
   ```

3. **Implement tokenized form** (see code above)

### Step 4: Update Payment APIs (TODAY)
1. **Create secure payment API:**
   ```bash
   mkdir -p app/api/payments
   touch app/api/payments/process.ts
   ```

2. **Implement secure processing** (see code above)

3. **Update existing checkout API** to use tokens only

### Step 5: Add 3D Secure Support (THIS WEEK)
```typescript
// Add to payment processing
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100),
  currency: 'usd',
  payment_method: paymentMethodId,
  confirmation_method: 'manual',
  confirm: true,
  return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation`,
  metadata: { orderId }
});

// Handle 3D Secure if required
if (paymentIntent.status === 'requires_action') {
  const { error } = await stripe.confirmCardPayment(paymentIntent.client_secret);
  if (error) {
    throw new Error(error.message);
  }
}
```

---

## 🛡️ ADDITIONAL SECURITY MEASURES

### 1. API Rate Limiting
```typescript
// middleware.ts addition
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Apply to payment routes
if (pathname.startsWith('/api/payments/')) {
  return limiter(request, response);
}
```

### 2. Webhook Security
```typescript
// app/api/payments/webhook.ts
import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle webhook events
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}
```

### 3. PCI DSS Compliance Checklist
- [ ] Remove all raw card data from servers
- [ ] Implement tokenized payments
- [ ] Use HTTPS everywhere
- [ ] Implement strong encryption
- [ ] Regular vulnerability scanning
- [ ] Access control and logging
- [ ] Secure development practices
- [ ] Network segmentation

---

## 🚀 EMERGENCY DEPLOYMENT PLAN

### Phase 1: Immediate Security Fixes (24 Hours)
1. **Disable raw card collection** in checkout form
2. **Implement basic tokenization** with Stripe/KajaPay
3. **Add SSL verification** checks
4. **Update API endpoints** to reject raw card data

### Phase 2: Enhanced Security (48 Hours)
1. **Add 3D Secure support**
2. **Implement rate limiting**
3. **Add webhook security**
4. **Create monitoring dashboard**

### Phase 3: Full Compliance (1 Week)
1. **Complete PCI DSS implementation**
2. **Security audit and penetration testing**
3. **Document all security measures**
4. **Train staff on new procedures**

---

## 📋 TESTING CHECKLIST

### Security Testing
- [ ] Verify no raw card data in logs or database
- [ ] Test payment tokenization works correctly
- [ ] Verify SSL/TLS encryption is active
- [ ] Test webhook signature validation
- [ ] Verify rate limiting prevents abuse

### Functionality Testing
- [ ] Test successful payment flow
- [ ] Test failed payment handling
- [ ] Test 3D Secure authentication
- [ ] Test webhook event processing
- [ ] Test order status updates

### Compliance Testing
- [ ] Verify PCI DSS compliance
- [ ] Test age verification integration
- [ ] Verify fraud detection works
- [ ] Test audit logging
- [ ] Verify data encryption

---

## 🚨 IMMEDIATE ACTIONS REQUIRED

### TODAY (Priority 1)
1. **STOP** collecting raw card data immediately
2. **INSTALL** payment gateway SDK
3. **IMPLEMENT** tokenized payment form
4. **UPDATE** payment APIs

### THIS WEEK (Priority 2)
1. **ADD** 3D Secure support
2. **IMPLEMENT** rate limiting
3. **SECURE** webhooks
4. **TEST** all payment flows

### NEXT WEEK (Priority 3)
1. **COMPLETE** PCI DSS compliance
2. **CONDUCT** security audit
3. **DOCUMENT** all procedures
4. **TRAIN** staff on new systems

---

## 📞 EMERGENCY CONTACTS

If you need immediate assistance:

**Payment Security Consultant:** [Contact Info]
**PCI DSS Assessor:** [Contact Info]
**Legal Counsel:** [Contact Info]
**Payment Processor Support:** [Contact Info]

---

## ⚡ ROLLBACK PLAN

If new implementation causes issues:

1. **Immediate Rollback:** Revert to backup checkout form
2. **Manual Processing:** Process payments manually
3. **Customer Notification:** Inform customers of temporary issues
4. **Fix and Redeploy:** Resolve issues and redeploy

**ROLLBACK COMMAND:**
```bash
git checkout main
git revert HEAD~1
npm run build
npm run deploy
```

---

**STATUS:** CRITICAL - IMPLEMENT IMMEDIATELY
**TIMELINE:** 24-48 hours for basic security
**PRIORITY:** PREVENTS PAYMENT PROCESSOR REJECTION

*Implement these changes IMMEDIATELY to avoid payment processor rejection and potential security breaches.*
