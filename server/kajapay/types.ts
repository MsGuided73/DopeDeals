// KajaPay API Types and Interfaces

export interface KajaPayConfig {
  baseUrl: string;
  sourceKey: string;
  username: string;
  password: string;
}

export interface KajaPayCredentials {
  username: string;
  password: string;
}

// Base API Response
export interface KajaPayBaseResponse {
  responseCode: string;
  responseText: string;
  authCode?: string;
  transactionId?: number;
  referenceNumber?: number;
}

// Charge Request
export interface ChargeRequest {
  amount: number;
  currency?: string;
  sourceKey: string;
  pinPadAmount?: number;
  taxExempt?: boolean;
  taxAmount?: number;
  tipAmount?: number;
  orderNumber?: string;
  PONumber?: string;
  orderDescription?: string;
  // Payment method data
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  // Customer info
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  // Saved card
  customerToken?: string;
  // Level 3 processing
  dutyAmount?: number;
  destinationCountryCode?: string;
  nationalTaxAmount?: number;
  vatTaxAmount?: number;
  vatTaxRate?: number;
  vatInvoiceReferenceNumber?: string;
  customerVatRegistration?: string;
  merchantVatRegistration?: string;
  orderDate?: string;
  summaryCommodityCode?: string;
  merchantContactName?: string;
  merchantContactPhone?: string;
  merchantName?: string;
  merchantAddress?: string;
  merchantCity?: string;
  merchantState?: string;
  merchantZip?: string;
  merchantCountryCode?: string;
  // 3D-Secure
  eci?: string;
  cavv?: string;
  dsTransId?: string;
  // Surcharge
  surchargeAmount?: number;
}

// Charge Response
export interface ChargeResponse extends KajaPayBaseResponse {
  avsResponseCode?: string;
  cvvResponseCode?: string;
  maskedCardNumber?: string;
  cardType?: string;
  entryMethod?: string;
  amount?: number;
  authorizedAmount?: number;
  balanceAmount?: number;
  remainingBalance?: number;
  tipAmount?: number;
  surchargeAmount?: number;
  cashDiscountAmount?: number;
  feeAmount?: number;
  paymentAccountDataToken?: string;
  customerToken?: string;
}

// Refund Request
export interface RefundRequest {
  transactionId: number;
  amount?: number;
  sourceKey: string;
}

// Refund Response
export interface RefundResponse extends KajaPayBaseResponse {
  amount?: number;
}

// Void Request
export interface VoidRequest {
  transactionId: number;
  sourceKey: string;
}

// Void Response
export interface VoidResponse extends KajaPayBaseResponse {}

// Transaction Query Request
export interface TransactionQueryRequest {
  transactionId: number;
  sourceKey: string;
}

// Transaction Query Response
export interface TransactionQueryResponse extends KajaPayBaseResponse {
  amount?: number;
  tipAmount?: number;
  taxAmount?: number;
  surchargeAmount?: number;
  transactionStatus?: string;
  cardType?: string;
  maskedCardNumber?: string;
  entryMethod?: string;
  customerToken?: string;
}

// Save Card Request
export interface SaveCardRequest {
  sourceKey: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  customerId?: string;
}

// Save Card Response
export interface SaveCardResponse extends KajaPayBaseResponse {
  paymentAccountDataToken?: string;
  customerToken?: string;
  maskedCardNumber?: string;
  cardType?: string;
}

// Customer Request
export interface CustomerRequest {
  sourceKey: string;
  customerId: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
}

// Customer Response
export interface CustomerResponse extends KajaPayBaseResponse {
  customerToken?: string;
}

// Line Item for Level 3 Processing
export interface LineItem {
  productCode?: string;
  productDescription?: string;
  commodityCode?: string;
  unitCost?: number;
  unitMeasure?: string;
  quantity?: number;
  totalAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  discountAmount?: number;
  discountRate?: number;
}

// Billing Address
export interface BillingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

// Payment Method Data
export interface PaymentMethodData {
  type: 'card' | 'ach' | 'saved_card';
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  customerToken?: string;
  paymentAccountDataToken?: string;
  // ACH fields
  routingNumber?: string;
  accountNumber?: string;
  accountType?: 'checking' | 'savings';
  secCode?: string;
}

// Process Payment Request
export interface ProcessPaymentRequest {
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethodData;
  billingAddress: BillingAddress;
  orderData: {
    orderNumber?: string;
    orderDescription?: string;
    lineItems?: LineItem[];
  };
  taxAmount?: number;
  tipAmount?: number;
  surchargeAmount?: number;
  level3Data?: {
    lineItems: LineItem[];
    dutyAmount?: number;
    destinationCountryCode?: string;
    nationalTaxAmount?: number;
    vatTaxAmount?: number;
    vatTaxRate?: number;
  };
}

// Payment Result
export interface PaymentResult {
  success: boolean;
  transactionId?: number;
  referenceNumber?: number;
  authCode?: string;
  responseCode: string;
  responseText: string;
  amount?: number;
  authorizedAmount?: number;
  maskedCardNumber?: string;
  cardType?: string;
  customerToken?: string;
  paymentAccountDataToken?: string;
  avsResponseCode?: string;
  cvvResponseCode?: string;
  errorMessage?: string;
}

// Refund Result
export interface RefundResult {
  success: boolean;
  transactionId?: number;
  referenceNumber?: number;
  responseCode: string;
  responseText: string;
  amount?: number;
  errorMessage?: string;
}

// Transaction Status
export interface TransactionStatus {
  transactionId: number;
  status: string;
  amount?: number;
  responseCode: string;
  responseText: string;
  cardType?: string;
  maskedCardNumber?: string;
}

// Webhook Event Types
export type WebhookEventType = 
  | 'transaction.approved'
  | 'transaction.declined'
  | 'transaction.refunded'
  | 'transaction.voided'
  | 'transaction.settled'
  | 'batch.closed';

// Webhook Event Data
export interface WebhookEventData {
  eventType: WebhookEventType;
  transactionId: number;
  referenceNumber?: number;
  amount?: number;
  responseCode?: string;
  responseText?: string;
  timestamp: string;
  merchantId?: string;
  sourceKey?: string;
}

// Error Response
export interface KajaPayError {
  responseCode: string;
  responseText: string;
  details?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: KajaPayError;
}