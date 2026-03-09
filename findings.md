# Compliance & High-Risk Products Review

## 1. Database Schema Review (Blueprint)

The database schema handles compliance fundamentally through a decoupled rules engine and specific product-level flags.

### Core Tables (`shared/schema.ts`, `server/supabase-storage.ts`)

- **`main_site_products` (alias `products`)**: Contains boolean flags for immediate checks:
  - `nicotine_product`, `tobacco_product`
  - `requires_age_verification`, `minimum_age`
  - `requires_lab_testing`
  - `restricted_states`, `restricted_zipcodes` (stored inside `compliance_info` JSONB).

- **`compliance_rules`**: A centralized rules engine.
  - Fields: `category` (e.g., THCA, Kratom), `restricted_states` (string array), `age_requirement` (int), `lab_testing_required` (boolean), `batch_tracking_required` (boolean).

- **`product_compliance`**: A junction table that maps individual products to particular compliance rules (`productId` <-> `complianceId`). It allows rules like "THCA Restrictions" to be applied to multiple products efficiently.

- **`compliance_audit_log`**: Tracks compliance violations (`productId`, `violation`, `severity`, `resolved_by`), providing a paper trail.

- **`lab_certificates`**: Stores parsed COAs (Certificate of Analysis) linked to a `productId` and `batch_number`, enforcing lab verification.

## 2. Logic Checkpoints (Where they live)

The application enforces compliance progressively throughout the customer journey.

### Checkpoint A: The Edge (Middleware)

**File**: `middleware.ts`

- **Logic**: Strictly blocks requests to prohibited URLs (e.g., paths containing `'kratom'`, `'7-oh'`, `'mitragynine'`).
- **Trigger**: Incoming request pathname matching. It redirects these immediately to `/`.
- **Age Verification**: Checks for the existence of an `age_verified=true` cookie before hitting restricted category/product pages. Server-side blocking isn't strictly enforced here; instead, it delegates to the component layer to render the Didit Age Verification gate (`app/age-verification/page.tsx`).

### Checkpoint B: Age Verification (Identity Provider)

**Files**: `app/api/age-verification/...`, `lib/services/age-verification/didit-adapter.ts`

- **Logic**: Leverages the **Didit API** as the third-party verification layer.
- **Trigger**: When the UI determines a user needs verification, it hits `/api/age-verification/create-session`, then redirects the user to the provided Didit flow.
- **Approval Checkpoint**: The `app/api/webhooks/didit/route.ts` webhook catches the "Approved" payload and stamps the `users` metadata (`age_verified: true`, `age_verification_status: 'verified'`).

### Checkpoint C: Pre-Transaction (Add to Cart)

**File**: `app/api/cart/route.ts`

- **Logic**: Hard-blocks specific product classifications.
- **Trigger**: When adding an item to the cart, the server queries the database. If `nicotine_product` or `tobacco_product` is true, the route explicitly denies the action (`403: This product is not available for purchase on this site.`).

### Checkpoint D: Transaction (Checkout)

**File**: `app/api/checkout/route.ts`

- **Logic**: Geofenced Compliance Checks.
- **Trigger**: Before finalizing the checkout session and sending the data to KajaPay.
- **Process**:
  1. Captures the `shippingAddress.postalCode` and `shippingAddress.state`.
  2. Resolves the zipcode to a state using the `us_zipcodes` table to catch fakes.
  3. **VULNERABILITY DISCOVERED & PATCHED:** Originally, if `us_zipcodes` returned no result (e.g., zip missing from DB), the state became `null` and the compliance check was completely bypassed. This explain why California users were able to checkout prohibited THCA items if their zip failed to resolve. **Fix Applied:** We updated the code to fall back to the provided `shippingAddress.state` directly if DB resolution fails.
  4. Queries `compliance_rules` to find any rules where `restricted_states` contains that state.
  5. Queries `product_compliance` mapping to see if _any_ rule matched in step 4 maps to an item in the user's cart.
  6. **Block**: If an overlap exists, returns a `403` error (`One or more items in your cart cannot be shipped to your location due to local regulations`) and halts payment processing.

### Delta-8 THC Compliance (Added 2026)

Following your request, we researched the 2026 legal landscape for Delta-8 THC and implemented a dedicated compliance rule.

- **Restricted States:** `AK`, `CO`, `DE`, `ID`, `IA`, `MN`, `MT`, `NV`, `NY`, `ND`, `RI`, `SC`, `UT`, `VT`, `WA`, `OH`. Note that many other states heavily regulate it (e.g., CA, MI, OR), but these 16 states represent explicit bans or restrictions tight enough to warrant a broad e-commerce block.
- **Implementation:** A new record was added to `compliance_rules` (`category: 'Delta-8'`) with the above `restricted_states`.
- **Product Mapping:** We queried `main_site_products` for any active product containing "Delta 8", "Delta-8", or "D8" in the name to automatically attach this rule. Currently, the database returned **0 active Delta-8 products**, so no mappings were created. However, the rule is ready to be attached to any future products.

---

### Conclusion & Recommendations

- **Robustness**: The 4-layer check (Edge -> Identity -> Cart -> Checkout) ensures prohibited sales are blocked even if a user bypasses the UI.
- **Strictness**: Add-to-cart actively rejects Nicotine/Tobacco items, enforcing single-site compliance constraints.
- **Vulnerability / Recommendation**: `middleware.ts` soft-delegates age checking to the frontend component (`// This is handled client-side in the components`). It is highly recommended to enforce a hard redirect in the `middleware.ts` if `age_verified` is false for sensitive routes, avoiding client-side bypass capabilities.
