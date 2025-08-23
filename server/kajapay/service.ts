import { kajaPayClient } from './client';
import { IStorage } from '../storage';
import {
  PaymentResult,
  RefundResult,
  TransactionStatus,
  ProcessPaymentRequest,
  BillingAddress,
  PaymentMethodData
} from './types';
import { InsertPaymentMethod, InsertPaymentTransaction, PaymentMethod } from '@shared/schema';

export class PaymentService {
  constructor(private storage: IStorage) {}

  // Process a one-time payment
  async processPayment(orderData: {
    orderId: string;
    userId: string;
    amount: number;
    paymentMethod: PaymentMethodData;
    billingAddress: BillingAddress;
    orderNumber?: string;
    taxAmount?: number;
    shippingAmount?: number;
    lineItems?: any[];
  }): Promise<PaymentResult> {
    try {
      // Create payment transaction record
      const transactionData: InsertPaymentTransaction = {
        orderId: orderData.orderId,
        transactionType: 'charge',
        amount: orderData.amount.toString(),
        currency: 'USD',
        status: 'pending',
        paymentMethodData: orderData.paymentMethod,
        transactionDetails: {
          orderNumber: orderData.orderNumber,
          taxAmount: orderData.taxAmount,
          shippingAmount: orderData.shippingAmount,
          billingAddress: orderData.billingAddress
        }
      };

      const transaction = await this.storage.createTransaction(transactionData);

      // Prepare KajaPay request
      const paymentRequest: ProcessPaymentRequest = {
        amount: orderData.amount,
        paymentMethod: orderData.paymentMethod,
        billingAddress: orderData.billingAddress,
        orderData: {
          orderNumber: orderData.orderNumber,
          orderDescription: `VIP Smoke Order #${orderData.orderNumber}`,
          lineItems: orderData.lineItems
        },
        taxAmount: orderData.taxAmount,
      };

      // Process payment with KajaPay
      const result = await kajaPayClient.processPayment(paymentRequest);

      // Update transaction with results
      const updateData: Partial<InsertPaymentTransaction> = {
        status: result.success ? 'approved' : 'declined',
        kajaPayTransactionId: result.transactionId,
        kajaPayReferenceNumber: result.referenceNumber,
        kajaPayStatusCode: result.responseCode,
        authCode: result.authCode,
        errorMessage: result.errorMessage,
        transactionDetails: {
          ...(((transactionData as any).transactionDetails && typeof (transactionData as any).transactionDetails === 'object') ? (transactionData as any).transactionDetails : {}),
          maskedCardNumber: result.maskedCardNumber,
          cardType: result.cardType,
          avsResponseCode: result.avsResponseCode,
          cvvResponseCode: result.cvvResponseCode
        }
      };

      await this.storage.updateTransaction(transaction.id, updateData);

      // If successful and card should be saved, save payment method
      if (result.success && result.customerToken && orderData.paymentMethod.type === 'card') {
        await this.savePaymentMethodFromResult(orderData.userId, result, orderData.billingAddress);
      }

      return result;
    } catch (error: any) {
      console.error('[PaymentService] Payment processing error:', error);
      return {
        success: false,
        responseCode: 'PAYMENT_ERROR',
        responseText: 'Payment processing failed',
        errorMessage: error.message
      };
    }
  }

  // Save a payment method for future use
  async savePaymentMethod(userId: string, cardData: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv?: string;
    billingName: string;
    billingAddress: BillingAddress;
  }): Promise<PaymentMethod | null> {
    try {
      // Save card with KajaPay
      const saveCardResult = await kajaPayClient.saveCard({
        sourceKey: '', // Set by client
        cardNumber: cardData.cardNumber,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        firstName: cardData.billingAddress.firstName,
        lastName: cardData.billingAddress.lastName,
        company: cardData.billingAddress.company,
        address1: cardData.billingAddress.address1,
        address2: cardData.billingAddress.address2,
        city: cardData.billingAddress.city,
        state: cardData.billingAddress.state,
        zip: cardData.billingAddress.zip,
        country: cardData.billingAddress.country,
        phone: cardData.billingAddress.phone,
        email: cardData.billingAddress.email
      });

      if (!saveCardResult.success || !saveCardResult.data?.paymentAccountDataToken) {
        throw new Error('Failed to save card with KajaPay');
      }

      // Save to database
      const paymentMethodData: InsertPaymentMethod = {
        userId,
        kajaPayToken: saveCardResult.data.paymentAccountDataToken,
        cardLast4: saveCardResult.data.maskedCardNumber?.slice(-4),
        cardType: saveCardResult.data.cardType,
        expiryMonth: parseInt(cardData.expiryMonth),
        expiryYear: parseInt(cardData.expiryYear),
        billingName: cardData.billingName,
        billingAddress: cardData.billingAddress,
        isDefault: false
      };

      return await this.storage.createPaymentMethod(paymentMethodData);
    } catch (error: any) {
      console.error('[PaymentService] Save payment method error:', error);
      return null;
    }
  }

  // Process payment with saved method
  async chargeStoredPaymentMethod(
    paymentMethodId: string,
    orderData: {
      orderId: string;
      amount: number;
      orderNumber?: string;
      taxAmount?: number;
      shippingAmount?: number;
    }
  ): Promise<PaymentResult> {
    try {
      const paymentMethod = await this.storage.getPaymentMethod(paymentMethodId);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      const paymentRequest: ProcessPaymentRequest = {
        amount: orderData.amount,
        paymentMethod: {
          type: 'saved_card',
          customerToken: paymentMethod.kajaPayToken
        },
        billingAddress: paymentMethod.billingAddress as BillingAddress,
        orderData: {
          orderNumber: orderData.orderNumber,
          orderDescription: `VIP Smoke Order #${orderData.orderNumber}`
        },
        taxAmount: orderData.taxAmount
      };

      return await kajaPayClient.processPayment(paymentRequest);
    } catch (error: any) {
      console.error('[PaymentService] Stored payment method charge error:', error);
      return {
        success: false,
        responseCode: 'STORED_PAYMENT_ERROR',
        responseText: 'Failed to charge stored payment method',
        errorMessage: error.message
      };
    }
  }

  // Process refund
  async processRefund(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<RefundResult> {
    try {
      const transaction = await this.storage.getTransaction(transactionId);
      if (!transaction || !transaction.kajaPayTransactionId) {
        throw new Error('Transaction not found or invalid');
      }

      const result = await kajaPayClient.processRefundById(
        transaction.kajaPayTransactionId,
        amount
      );

      // Create refund transaction record
      if (result.success) {
        const refundData: InsertPaymentTransaction = {
          orderId: transaction.orderId!,
          transactionType: 'refund',
          amount: (amount || parseFloat(transaction.amount)).toString(),
          currency: transaction.currency,
          status: 'approved',
          kajaPayTransactionId: result.transactionId,
          kajaPayReferenceNumber: result.referenceNumber,
          kajaPayStatusCode: result.responseCode,
          transactionDetails: {
            originalTransactionId: transactionId,
            refundReason: reason
          }
        };

        await this.storage.createTransaction(refundData);

        // Update original transaction status
        await this.storage.updateTransaction(transactionId, {
          status: amount ? 'partially_refunded' : 'refunded'
        });
      }

      return result;
    } catch (error: any) {
      console.error('[PaymentService] Refund processing error:', error);
      return {
        success: false,
        responseCode: 'REFUND_ERROR',
        responseText: 'Refund processing failed',
        errorMessage: error.message
      };
    }
  }

  // Get transaction status
  async getTransactionStatus(transactionId: string): Promise<TransactionStatus | null> {
    try {
      const transaction = await this.storage.getTransaction(transactionId);
      if (!transaction || !transaction.kajaPayTransactionId) {
        return null;
      }

      return await kajaPayClient.getTransactionStatus(transaction.kajaPayTransactionId);
    } catch (error: any) {
      console.error('[PaymentService] Get transaction status error:', error);
      return null;
    }
  }

  // Get user payment methods
  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return await this.storage.getUserPaymentMethods(userId);
  }

  // Delete payment method
  async deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
    return await this.storage.deletePaymentMethod(paymentMethodId);
  }

  // Validate payment configuration
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors = kajaPayClient.validateConfig();
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Private helper to save payment method from successful transaction
  private async savePaymentMethodFromResult(
    userId: string,
    result: PaymentResult,
    billingAddress: BillingAddress
  ): Promise<PaymentMethod | null> {
    try {
      if (!result.customerToken || !result.maskedCardNumber) {
        return null;
      }

      const paymentMethodData: InsertPaymentMethod = {
        userId,
        kajaPayToken: result.customerToken,
        cardLast4: result.maskedCardNumber.slice(-4),
        cardType: result.cardType,
        billingName: `${billingAddress.firstName} ${billingAddress.lastName}`,
        billingAddress,
        isDefault: false
      };

      return await this.storage.createPaymentMethod(paymentMethodData);
    } catch (error: any) {
      console.error('[PaymentService] Auto-save payment method error:', error);
      return null;
    }
  }
}

// Export factory function - will be called with storage instance
export const createPaymentService = (storage: IStorage) => new PaymentService(storage);