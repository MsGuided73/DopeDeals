# Project Constitution: B.L.A.S.T. / A.N.T. Adapted for Next.js

## 1. Data Schemas

_Define the JSON Input/Output shapes here. These must closely mirror our Zod schemas and TypeScript interfaces._

```json
{
  "checkout_input": {
    "items": [{ "productId": "uuid", "quantity": 1 }],
    "shippingAddress": {},
    "billingAddress": {},
    "paymentMethod": {
      "type": "card",
      "cardNumber": "string",
      "expiryMonth": "string",
      "expiryYear": "string",
      "cvv": "string"
    }
  },
  "checkout_output": {
    "order": { "id": "uuid", "paymentStatus": "paid", "status": "processing" },
    "payment": { "success": true, "transactionId": "string" }
  },
  "output_transaction_table": {
    "orderId": "uuid",
    "kajaPayTransactionId": "integer",
    "kajaPayReferenceNumber": "integer",
    "transactionType": "charge | refund | void",
    "amount": "100.50",
    "status": "pending | approved | declined | refunded",
    "kajaPayStatusCode": "string",
    "authCode": "string"
  },
  "output_webhook_table": {
    "eventType": "string",
    "kajaPayTransactionId": "integer",
    "payload": "jsonb",
    "processed": "boolean"
  }
}
```

## 2. Behavioral Rules (B.L.A.S.T. / User Rules Adapted)

- **Rule 1: robust transaction tracking**: All errors (API failures, declines, invalid data) must be caught safely. The backend must log the transaction attempt as a "decline" or "failed" status in `shared/schema.ts` `paymentTransactions`.
- **Rule 2: TypeScript over Python (Layer 3 Tools):** Since this is a Next.js environment, "Tools" and testing scripts (Phase 2 Link Handshakes) will be written in **TypeScript** within the `scripts/` directory or as dedicated API routes, rather than isolated Python scripts.
- **Rule 3: Schema-First (Phase 1 Blueprint):** The Data-First rule applies, but the true sources of truth are the **Zod Schemas** (e.g., `CheckoutSchema`) and **TypeScript Interfaces** (e.g., `ChargeRequest`). The JSON in `gemini.md` serves as a quick-reference translation of these.

## 3. Architectural Invariants

- **Invariant 1 (A.N.T.):** If logic changes, update the relevant SOP (`.md` documentation) before updating the code.
- **Invariant 2:** The `lib/services/` directory acts as our Layer 3 API integration engines. They must remain atomic and modular inside the App Router syntax.

---

## Maintenance Log

- **[2026-02-27]:** Project Initialized. Reviewed and adapted BLAST protocol to fit the Next.js/TypeScript and Supabase tech stack.
- **[2026-02-27]:** Clarified architecture invariants to move services to `lib/services/`. Expanded tracking schemas for Kajapay.
