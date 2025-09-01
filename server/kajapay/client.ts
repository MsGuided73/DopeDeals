import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  KajaPayConfig,
  ChargeRequest,
  ChargeResponse,
  RefundRequest,
  RefundResponse,
  VoidRequest,
  VoidResponse,
  TransactionQueryRequest,
  TransactionQueryResponse,
  SaveCardRequest,
  SaveCardResponse,
  CustomerRequest,
  CustomerResponse,
  KajaPayError,
  ApiResponse,
  ProcessPaymentRequest,
  PaymentResult,
  RefundResult,
  TransactionStatus
} from './types';

export class KajaPayClient {
  private client: AxiosInstance;
  private config: KajaPayConfig;

  constructor() {
    // Use sandbox URL for development, production URL for production
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.kajapaygateway.com/api/v2/'
      : 'https://api.sandbox.kajapaygateway.com/api/v2/';

    this.config = {
      baseUrl,
      sourceKey: process.env.KAJAPAY_SOURCE_KEY!,
      username: process.env.KAJAPAY_USERNAME!,
      password: process.env.KAJAPAY_PASSWORD!
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      auth: {
        username: this.config.username,
        password: this.config.password
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[KajaPay] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[KajaPay] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[KajaPay] Response ${response.status} for ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[KajaPay] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Validate configuration
  public validateConfig(): string[] {
    const errors: string[] = [];
    
    if (!this.config.sourceKey) errors.push('KAJAPAY_SOURCE_KEY is required');
    if (!this.config.username) errors.push('KAJAPAY_USERNAME is required');
    if (!this.config.password) errors.push('KAJAPAY_PASSWORD is required');
    
    return errors;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get('health');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          responseCode: 'HEALTH_CHECK_FAILED',
          responseText: error.message,
          details: error.response?.data
        }
      };
    }
  }

  // Process charge transaction
  async processCharge(chargeData: ChargeRequest): Promise<ApiResponse<ChargeResponse>> {
    try {
      const response: AxiosResponse<ChargeResponse> = await this.client.post('charge', {
        ...chargeData,
        sourceKey: this.config.sourceKey
      });

      return {
        success: response.data.responseCode === '00' || response.data.responseCode === '000',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          responseCode: 'CHARGE_FAILED',
          responseText: error.message,
          details: error.response?.data
        }
      };
    }
  }

  // Process refund
  async processRefund(refundData: RefundRequest): Promise<ApiResponse<RefundResponse>> {
    try {
      const response: AxiosResponse<RefundResponse> = await this.client.post('refund', {
        ...refundData,
        sourceKey: this.config.sourceKey
      });

      return {
        success: response.data.responseCode === '00' || response.data.responseCode === '000',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          responseCode: 'REFUND_FAILED',
          responseText: error.message,
          details: error.response?.data
        }
      };
    }
  }

  // Void transaction
  async voidTransaction(transactionId: number): Promise<ApiResponse<VoidResponse>> {
    try {
      const response: AxiosResponse<VoidResponse> = await this.client.post('void', {
        transactionId,
        sourceKey: this.config.sourceKey
      });

      return {
        success: response.data.responseCode === '00' || response.data.responseCode === '000',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          responseCode: 'VOID_FAILED',
          responseText: error.message,
          details: error.response?.data
        }
      };
    }
  }

  // Query transaction status
  async getTransaction(transactionId: number): Promise<ApiResponse<TransactionQueryResponse>> {
    try {
      const response: AxiosResponse<TransactionQueryResponse> = await this.client.post('query', {
        transactionId,
        sourceKey: this.config.sourceKey
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          responseCode: 'QUERY_FAILED',
          responseText: error.message,
          details: error.response?.data
        }
      };
    }
  }

  // Save payment method (card tokenization)
  async saveCard(cardData: SaveCardRequest): Promise<ApiResponse<SaveCardResponse>> {
    try {
      const response: AxiosResponse<SaveCardResponse> = await this.client.post('customer/add-payment-method', {
        ...cardData,
        sourceKey: this.config.sourceKey
      });

      return {
        success: response.data.responseCode === '00' || response.data.responseCode === '000',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          responseCode: 'SAVE_CARD_FAILED',
          responseText: error.message,
          details: error.response?.data
        }
      };
    }
  }

  // Create customer
  async createCustomer(customerData: CustomerRequest): Promise<ApiResponse<CustomerResponse>> {
    try {
      const response: AxiosResponse<CustomerResponse> = await this.client.post('customer/add', {
        ...customerData,
        sourceKey: this.config.sourceKey
      });

      return {
        success: response.data.responseCode === '00' || response.data.responseCode === '000',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          responseCode: 'CREATE_CUSTOMER_FAILED',
          responseText: error.message,
          details: error.response?.data
        }
      };
    }
  }

  // High-level payment processing method
  async processPayment(paymentData: ProcessPaymentRequest): Promise<PaymentResult> {
    try {
      const chargeRequest: ChargeRequest = {
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        sourceKey: this.config.sourceKey,
        taxAmount: paymentData.taxAmount,
        tipAmount: paymentData.tipAmount,
        surchargeAmount: paymentData.surchargeAmount,
        orderNumber: paymentData.orderData.orderNumber,
        orderDescription: paymentData.orderData.orderDescription,
        
        // Billing address
        firstName: paymentData.billingAddress.firstName,
        lastName: paymentData.billingAddress.lastName,
        company: paymentData.billingAddress.company,
        address1: paymentData.billingAddress.address1,
        address2: paymentData.billingAddress.address2,
        city: paymentData.billingAddress.city,
        state: paymentData.billingAddress.state,
        zip: paymentData.billingAddress.zip,
        country: paymentData.billingAddress.country,
        phone: paymentData.billingAddress.phone,
        email: paymentData.billingAddress.email,
      };

      // Add payment method data
      if (paymentData.paymentMethod.type === 'card') {
        chargeRequest.cardNumber = paymentData.paymentMethod.cardNumber;
        chargeRequest.expiryMonth = paymentData.paymentMethod.expiryMonth;
        chargeRequest.expiryYear = paymentData.paymentMethod.expiryYear;
        chargeRequest.cvv = paymentData.paymentMethod.cvv;
      } else if (paymentData.paymentMethod.type === 'saved_card') {
        chargeRequest.customerToken = paymentData.paymentMethod.customerToken;
      }

      // Add Level 3 data if provided
      if (paymentData.level3Data) {
        chargeRequest.dutyAmount = paymentData.level3Data.dutyAmount;
        chargeRequest.destinationCountryCode = paymentData.level3Data.destinationCountryCode;
        chargeRequest.nationalTaxAmount = paymentData.level3Data.nationalTaxAmount;
        chargeRequest.vatTaxAmount = paymentData.level3Data.vatTaxAmount;
        chargeRequest.vatTaxRate = paymentData.level3Data.vatTaxRate;
      }

      const response = await this.processCharge(chargeRequest);

      if (response.success && response.data) {
        return {
          success: true,
          transactionId: response.data.transactionId,
          referenceNumber: response.data.referenceNumber,
          authCode: response.data.authCode,
          responseCode: response.data.responseCode,
          responseText: response.data.responseText,
          amount: response.data.amount,
          authorizedAmount: response.data.authorizedAmount,
          maskedCardNumber: response.data.maskedCardNumber,
          cardType: response.data.cardType,
          customerToken: response.data.customerToken,
          paymentAccountDataToken: response.data.paymentAccountDataToken,
          avsResponseCode: response.data.avsResponseCode,
          cvvResponseCode: response.data.cvvResponseCode
        };
      } else {
        return {
          success: false,
          responseCode: response.error?.responseCode || 'UNKNOWN_ERROR',
          responseText: response.error?.responseText || 'Payment processing failed',
          errorMessage: response.error?.details
        };
      }
    } catch (error: any) {
      return {
        success: false,
        responseCode: 'PAYMENT_ERROR',
        responseText: 'Payment processing error',
        errorMessage: error.message
      };
    }
  }

  // High-level refund processing method
  async processRefundById(transactionId: number, amount?: number): Promise<RefundResult> {
    try {
      const refundRequest: RefundRequest = {
        transactionId,
        sourceKey: this.config.sourceKey,
        amount
      };

      const response = await this.processRefund(refundRequest);

      if (response.success && response.data) {
        return {
          success: true,
          transactionId: response.data.transactionId,
          referenceNumber: response.data.referenceNumber,
          responseCode: response.data.responseCode,
          responseText: response.data.responseText,
          amount: response.data.amount
        };
      } else {
        return {
          success: false,
          responseCode: response.error?.responseCode || 'UNKNOWN_ERROR',
          responseText: response.error?.responseText || 'Refund processing failed',
          errorMessage: response.error?.details
        };
      }
    } catch (error: any) {
      return {
        success: false,
        responseCode: 'REFUND_ERROR',
        responseText: 'Refund processing error',
        errorMessage: error.message
      };
    }
  }

  // Get transaction status
  async getTransactionStatus(transactionId: number): Promise<TransactionStatus> {
    try {
      const response = await this.getTransaction(transactionId);
      
      if (response.success && response.data) {
        return {
          transactionId,
          status: response.data.transactionStatus || 'unknown',
          amount: response.data.amount,
          responseCode: response.data.responseCode,
          responseText: response.data.responseText,
          cardType: response.data.cardType,
          maskedCardNumber: response.data.maskedCardNumber
        };
      } else {
        return {
          transactionId,
          status: 'error',
          responseCode: response.error?.responseCode || 'QUERY_ERROR',
          responseText: response.error?.responseText || 'Failed to get transaction status'
        };
      }
    } catch (error: any) {
      return {
        transactionId,
        status: 'error',
        responseCode: 'QUERY_ERROR',
        responseText: error.message
      };
    }
  }

  // Verify webhook signature (if KajaPay provides this)
  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    // Implementation depends on KajaPay's webhook verification method
    // This is a placeholder - check KajaPay docs for actual implementation
    try {
      // For now, basic validation of payload structure
      return payload && typeof payload === 'object' && payload.transactionId;
    } catch (error) {
      console.error('[KajaPay] Webhook verification failed:', error);
      return false;
    }
  }
}

// Export singleton instance (mockable via env toggle)
import { mockKajaPayClient } from './mockClient';
const useMock = process.env.MOCK_KAJAPAY === 'true';
export const kajaPayClient = useMock ? (mockKajaPayClient as any) : new KajaPayClient();