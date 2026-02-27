# Task Plan

## Goal

Build out the remainder of the checkout workflow utilizing the KajaPay credentials.

## Checklist

- [x] Investigate current checkout frontend and backend implementation.
- [x] Test the checkout workflow using sandbox KajaPay credentials.
- [x] Determine missing pieces in the checkout workflow.
- [x] Refactor monolithic `/checkout` into a multi-page sequence.
- [x] Implement `app/checkout/shipping/page.tsx` (Address, method).
- [x] Implement `app/checkout/review/page.tsx` (Order Summary, redirect to KajaPay).
- [x] Implement `app/checkout/confirmation/page.tsx` (Success message, Resend email).
- [x] Implement `app/checkout/success/page.tsx` (Payment Succeeded, Tracking Number).
- [x] Implement `app/checkout/failed/page.tsx` (Payment Failed, Retry options).
- [x] Verify KajaPay Webhook Endpoint (`app/api/kajapay/webhook/route.ts`).
