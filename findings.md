# Findings

- KajaPay API docs URL is a single page application; direct HTML fetching returns empty app div.
- Backend `server/kajapay/client.ts` is mostly implemented, including `processCharge`, `processRefund`, `voidTransaction`.
- Backend route `app/api/checkout/route.ts` includes a section to handle `processPayment` using `kajaPayClient`.
- There is a frontend cart or checkout somewhere that needs to be tied fully into the KajaPay processing.
- Webhook endpoint (`app/api/kajapay/webhook/route.ts`) is structurally complete and handles `payment.completed` and `payment.failed`.
- The current `app/checkout/page.tsx` is monolithic and needs to be fragmented into `/shipping`, `/confirmation`, `/success`, and `/failed` as requested.
- User requested "redirect to KajaPay" from the shipping page, which implies a hosted checkout flow or an intermediate processing page before success/fail.
