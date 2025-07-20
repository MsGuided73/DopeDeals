# KajaPay Payment Gateway Integration Plan - VIP Smoke E-Commerce

## 🎯 **Integration Overview**

KajaPay provides a comprehensive payment processing API with support for credit cards, ACH/check payments, digital wallets, and recurring billing. This plan outlines the complete integration for VIP Smoke's e-commerce platform.

### **KajaPay API Capabilities**
- **Payment Methods**: Credit/Debit Cards, ACH/Check, Digital Wallets, Saved Cards
- **Features**: Real-time processing, tokenization, recurring billing, refunds, webhooks
- **Security**: PCI DSS compliant, 3D-Secure support, AVS verification
- **Environments**: Production and Sandbox for testing

---

## 🏗️ **Architecture & Implementation Strategy**

### **Integration Architecture**
```
VIP Smoke Frontend (React)
    ↓ (HTTPS/API)
VIP Smoke Backend (Express)
    ↓ (Secure API Calls)
KajaPay Gateway API
    ↓ (Real-time Processing)
Payment Networks (Visa/MC/etc.)
```

### **Security Model**
- **Frontend**: Never handles sensitive card data directly
- **Backend**: Secure API communication with KajaPay
- **Tokenization**: Card data stored as secure tokens only
- **PCI Compliance**: Maintained through proper data handling

---

## 📋 **Implementation Phases**

### **Phase 1: Core Payment Infrastructure (Week 1)**

#### **1.1 Environment Setup & Configuration**
```typescript
// Environment Variables Required
KAJAPAY_API_BASE_URL=https://api.kajapaygateway.com/api/v2/
KAJAPAY_SANDBOX_URL=https://api.sandbox.kajapaygateway.com/api/v2/
KAJAPAY_SOURCE_KEY=your_source_key
KAJAPAY_USERNAME=your_username
KAJAPAY_PASSWORD=your_password
```

#### **1.2 Database Schema Extensions**
```sql
-- Payment Methods Table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  kajapay_token TEXT NOT NULL,
  card_last4 TEXT,
  card_type TEXT,
  expiry_month INTEGER,
  expiry_year INTEGER,
  billing_name TEXT,
  billing_address JSONB,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment Transactions Table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  kajapay_transaction_id INTEGER,
  kajapay_reference_number INTEGER,
  transaction_type TEXT, -- 'charge', 'refund', 'void'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL, -- 'pending', 'approved', 'declined', 'refunded'
  kajapay_status_code TEXT,
  auth_code TEXT,
  error_message TEXT,
  payment_method_data JSONB,
  transaction_details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Events Table
CREATE TABLE kajapay_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  kajapay_transaction_id INTEGER,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **1.3 KajaPay API Client Implementation**
```typescript
// server/kajapay/client.ts
export class KajaPayClient {
  private baseUrl: string;
  private credentials: { username: string; password: string };

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.KAJAPAY_API_BASE_URL!
      : process.env.KAJAPAY_SANDBOX_URL!;
    this.credentials = {
      username: process.env.KAJAPAY_USERNAME!,
      password: process.env.KAJAPAY_PASSWORD!
    };
  }

  // Core payment processing methods
  async processCharge(chargeData: ChargeRequest): Promise<ChargeResponse>
  async processRefund(refundData: RefundRequest): Promise<RefundResponse>
  async voidTransaction(transactionId: number): Promise<VoidResponse>
  async getTransaction(transactionId: number): Promise<TransactionResponse>
  
  // Customer & card management
  async saveCard(cardData: SaveCardRequest): Promise<SaveCardResponse>
  async createCustomer(customerData: CustomerRequest): Promise<CustomerResponse>
  async getCustomerPaymentMethods(customerId: number): Promise<PaymentMethod[]>
  
  // Webhook verification
  async verifyWebhook(payload: any, signature: string): Promise<boolean>
}
```

### **Phase 2: Payment Processing Core (Week 1-2)**

#### **2.1 Payment Service Layer**
```typescript
// server/services/paymentService.ts
export class PaymentService {
  private kajaPayClient: KajaPayClient;
  
  // Process one-time payment
  async processPayment(orderData: ProcessPaymentRequest): Promise<PaymentResult>
  
  // Save payment method for future use
  async savePaymentMethod(userId: string, cardData: CardData): Promise<PaymentMethod>
  
  // Process payment with saved method
  async chargeStoredPaymentMethod(paymentMethodId: string, amount: number, orderData: any): Promise<PaymentResult>
  
  // Refund processing
  async processRefund(transactionId: string, amount?: number, reason?: string): Promise<RefundResult>
  
  // Transaction status checking
  async getTransactionStatus(transactionId: string): Promise<TransactionStatus>
}
```

#### **2.2 Enhanced Order Management**
```typescript
// Update existing order schema
interface Order {
  // Existing fields...
  payment_status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  payment_method: 'card' | 'ach' | 'digital_wallet';
  transaction_id?: string;
  billing_address: BillingAddress;
  shipping_address: ShippingAddress;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
}
```

### **Phase 3: Frontend Payment UI (Week 2)**

#### **3.1 Secure Payment Form Components**
```tsx
// client/src/components/payment/PaymentForm.tsx
interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (result: PaymentResult) => void;
  onPaymentError: (error: PaymentError) => void;
}

// Components to build:
- CreditCardForm: Secure card input with validation
- SavedPaymentMethods: Display and select stored cards
- BillingAddressForm: Billing information collection
- PaymentSummary: Order total with tax/shipping breakdown
- PaymentConfirmation: Success/failure handling
```

#### **3.2 Checkout Flow Enhancement**
```tsx
// client/src/pages/CheckoutPage.tsx
const CheckoutFlow = [
  'ShippingAddress',
  'PaymentMethod', 
  'OrderReview',
  'PaymentProcessing',
  'OrderConfirmation'
];

// Implement complete checkout with:
- Address validation
- Payment method selection
- Order summary with taxes
- Secure payment processing
- Order confirmation and receipt
```

### **Phase 4: Advanced Features (Week 3)**

#### **4.1 Subscription & Recurring Payments**
```typescript
// For VIP memberships and recurring orders
interface RecurringPayment {
  customer_id: string;
  payment_method_id: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  next_payment_date: Date;
  status: 'active' | 'paused' | 'cancelled';
}

// Implement:
- VIP membership auto-renewal
- Subscription product support
- Payment retry logic for failed payments
- Customer subscription management
```

#### **4.2 Advanced Payment Features**
```typescript
// Surcharge handling for high-risk transactions
async calculateSurcharge(paymentData: PaymentData): Promise<SurchargeDetails>

// Level 3 processing for better rates
interface Level3Data {
  line_items: LineItem[];
  tax_amount: number;
  shipping_amount: number;
  duty_amount?: number;
}

// 3D-Secure authentication for international cards
interface ThreeDSecureData {
  eci: string;
  cavv: string;
  ds_trans_id: string;
}
```

---

## 🔧 **Technical Implementation Details**

### **API Endpoints to Implement**

#### **Payment Processing**
```typescript
// POST /api/payment/process
{
  "amount": 99.99,
  "payment_method": {
    "type": "card",
    "card_number": "4111111111111111",
    "expiry_month": 12,
    "expiry_year": 2025,
    "cvv": "123"
  },
  "billing_address": {...},
  "order_details": {...}
}

// POST /api/payment/save-card
// GET /api/payment/methods
// POST /api/payment/refund/:transactionId
// GET /api/payment/status/:transactionId
```

#### **Customer Management**
```typescript
// POST /api/customers/create
// GET /api/customers/:id/payment-methods
// POST /api/customers/:id/payment-methods
// DELETE /api/payment-methods/:id
```

### **Webhook Implementation**
```typescript
// POST /api/webhooks/kajapay
// Handles real-time payment status updates:
- transaction.approved
- transaction.declined  
- transaction.refunded
- transaction.settled
- batch.closed
```

### **Security Implementation**

#### **Data Protection**
```typescript
// Never store sensitive card data
interface SecureCardData {
  token: string;        // KajaPay token only
  last4: string;        // Display purposes
  card_type: string;    // Visa, MC, etc.
  expiry_month: number; // For expiration warnings
  expiry_year: number;
}

// PCI Compliance measures:
- Use HTTPS for all payment communication
- Implement proper input validation
- Log payment events without sensitive data
- Use secure session management
```

#### **Fraud Prevention**
```typescript
interface FraudPreventionData {
  client_ip: string;
  user_agent: string;
  device_fingerprint?: string;
  billing_address_verification: boolean;
  cvv_verification: boolean;
  velocity_checks: boolean;
}
```

---

## 📊 **Testing Strategy**

### **Sandbox Testing Phase**
```typescript
// Test card numbers for different scenarios:
const TEST_CARDS = {
  VISA_APPROVED: '4111111111111111',
  VISA_DECLINED: '4000000000000002', 
  MASTERCARD_APPROVED: '5555555555554444',
  AMEX_APPROVED: '378282246310005',
  DISCOVER_APPROVED: '6011111111111117'
};

// Test scenarios:
- Successful payments
- Declined transactions
- Partial approvals
- Refund processing
- Webhook delivery
- Error handling
```

### **Integration Testing**
```typescript
// Comprehensive test suite:
describe('KajaPay Integration', () => {
  test('Process successful payment')
  test('Handle payment decline')
  test('Save payment method')
  test('Process refund')
  test('Handle webhook events')
  test('Validate billing address')
  test('Calculate taxes and shipping')
});
```

---

## 🔐 **Security & Compliance**

### **PCI DSS Compliance**
- **SAQ A-EP**: Applicable for e-commerce with 3rd party processing
- **Data Protection**: No storage of sensitive card data
- **Secure Transmission**: TLS 1.2+ for all API communication
- **Access Control**: Role-based access to payment functions

### **Data Security Measures**
```typescript
// Input validation and sanitization
const validateCardData = (cardData: any) => {
  // Validate card number format
  // Check expiry date validity
  // Validate CVV format
  // Sanitize all input data
};

// Secure logging (no sensitive data)
const logPaymentEvent = (event: PaymentEvent) => {
  console.log({
    transaction_id: event.transaction_id,
    amount: event.amount,
    status: event.status,
    timestamp: new Date().toISOString(),
    // NO card numbers, CVV, or personal data
  });
};
```

---

## 📈 **Performance Optimization**

### **Caching Strategy**
```typescript
// Cache payment methods for quick checkout
const paymentMethodCache = new Map<string, PaymentMethod[]>();

// Cache surcharge calculations
const surchargeCache = new Map<string, SurchargeData>();

// Token validation caching
const tokenValidationCache = new Map<string, boolean>();
```

### **Database Optimization**
```sql
-- Indexes for performance
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_kajapay_id ON payment_transactions(kajapay_transaction_id);
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_webhook_events_processed ON kajapay_webhook_events(processed, created_at);
```

---

## 🚀 **Deployment & Monitoring**

### **Environment Configuration**
```typescript
// Production deployment checklist:
const productionConfig = {
  kajapay_api_url: 'https://api.kajapaygateway.com/api/v2/',
  ssl_required: true,
  webhook_signature_verification: true,
  fraud_detection_enabled: true,
  pci_logging_compliant: true
};
```

### **Monitoring & Alerting**
```typescript
// Key metrics to monitor:
interface PaymentMetrics {
  successful_transactions: number;
  failed_transactions: number;
  refund_rate: number;
  average_transaction_time: number;
  webhook_processing_time: number;
  api_error_rate: number;
}

// Alerts for:
- High decline rates
- API connectivity issues
- Webhook processing failures
- Unusual transaction patterns
```

---

## 💰 **Cost Optimization**

### **Transaction Fee Management**
```typescript
// Implement surcharge handling for cost recovery
interface SurchargeCalculation {
  base_amount: number;
  surcharge_amount: number;
  total_amount: number;
  surcharge_percentage: number;
}

// Fee optimization strategies:
- Level 3 processing for lower rates
- AVS verification for better pricing
- Batch settlement optimization
- Recurring payment rate optimization
```

---

## 📋 **Implementation Checklist**

### **Phase 1: Core Setup (Week 1)**
- [ ] Set up KajaPay merchant account
- [ ] Configure API credentials (sandbox + production)
- [ ] Implement KajaPayClient class
- [ ] Create database schema for payments
- [ ] Set up basic API routes
- [ ] Implement webhook endpoint
- [ ] Test basic charge processing

### **Phase 2: Payment Processing (Week 1-2)**
- [ ] Build PaymentService layer
- [ ] Implement card tokenization
- [ ] Add billing address validation
- [ ] Create refund processing
- [ ] Build transaction status checking
- [ ] Implement error handling
- [ ] Add comprehensive logging

### **Phase 3: Frontend Integration (Week 2)**
- [ ] Build secure payment form
- [ ] Implement saved payment methods
- [ ] Create checkout flow UI
- [ ] Add payment confirmation page
- [ ] Implement order receipt generation
- [ ] Add payment method management
- [ ] Test complete user flow

### **Phase 4: Advanced Features (Week 3)**
- [ ] Implement subscription payments
- [ ] Add Level 3 processing
- [ ] Build admin payment dashboard
- [ ] Implement fraud detection
- [ ] Add comprehensive reporting
- [ ] Performance optimization
- [ ] Security audit and testing

---

## 🎯 **Success Metrics**

### **Technical KPIs**
- **Payment Success Rate**: >95%
- **API Response Time**: <2 seconds
- **Webhook Processing**: <5 seconds
- **Uptime**: 99.9%
- **PCI Compliance**: 100%

### **Business KPIs**
- **Checkout Conversion**: >75%
- **Payment Method Saves**: >40%
- **Customer Satisfaction**: >4.5/5
- **Transaction Cost**: Optimized rates
- **Fraud Rate**: <0.1%

---

## 🔄 **Maintenance & Updates**

### **Regular Maintenance Tasks**
- Monitor transaction success rates
- Update test card numbers as needed
- Review and update webhook handlers
- Audit payment logs for anomalies
- Update API client for new features
- Maintain PCI compliance documentation

### **Future Enhancements**
- Apple Pay/Google Pay integration
- Buy Now, Pay Later options
- International payment methods
- Advanced fraud detection
- Machine learning for approval optimization
- Real-time payment analytics dashboard

---

## 📞 **Support & Documentation**

### **KajaPay Resources**
- **API Documentation**: https://docs.kajapaygateway.com/api/v2
- **Developer Support**: Available through merchant portal
- **Sandbox Environment**: For comprehensive testing
- **Integration Examples**: Reference implementations

### **Internal Documentation**
- Payment flow diagrams
- API endpoint documentation
- Error handling procedures
- Webhook event handling
- Security protocols and procedures
- Troubleshooting guides

---

This comprehensive plan provides a complete roadmap for integrating KajaPay into VIP Smoke, ensuring secure, efficient, and scalable payment processing while maintaining PCI compliance and optimal user experience.