import { 
  ProcessPaymentRequest,
  PaymentResult,
  RefundResult,
  TransactionStatus,
} from './types';

// Lightweight in-memory mock for KajaPay
export class MockKajaPayClient {
  validateConfig(): string[] {
    return [];
  }

  async healthCheck(): Promise<{ success: boolean; message?: string }> {
    return { success: true, message: 'Mock KajaPay healthy' };
  }

  async processPayment(req: ProcessPaymentRequest): Promise<PaymentResult> {
    const approved = (req.amount ?? 0) >= 0; // approve non-negative amounts
    return {
      success: approved,
      transactionId: 'mock-txn-' + Math.random().toString(36).slice(2, 10),
      referenceNumber: 'REF' + Date.now(),
      responseCode: approved ? 'APPROVED' : 'DECLINED',
      responseText: approved ? 'Approved' : 'Declined by mock gateway',
      authCode: approved ? 'MOCKAUTH' : undefined,
      maskedCardNumber: req.paymentMethod.type === 'card' ? '**** **** **** 1111' : undefined,
      cardType: req.paymentMethod.type === 'card' ? 'VISA' : undefined,
      avsResponseCode: 'Y',
      cvvResponseCode: 'M',
      customerToken: req.paymentMethod.type === 'card' ? 'mock-customer-token' : undefined,
    };
  }

  async saveCard(_: any): Promise<{ success: boolean; data?: any; error?: string }> {
    return {
      success: true,
      data: {
        paymentAccountDataToken: 'mock-token',
        maskedCardNumber: '**** **** **** 4242',
        cardType: 'VISA',
      },
    };
  }

  async processRefundById(_transactionId: string, _amount?: number): Promise<RefundResult> {
    return {
      success: true,
      transactionId: 'mock-refund-' + Math.random().toString(36).slice(2, 10),
      referenceNumber: 'REFUND' + Date.now(),
      responseCode: 'APPROVED',
      responseText: 'Refund approved (mock)',
    };
  }

  async getTransactionStatus(_transactionId: string): Promise<TransactionStatus> {
    return {
      transactionId: _transactionId,
      status: 'approved',
      responseCode: 'APPROVED',
      responseText: 'Approved (mock)'
    } as TransactionStatus;
  }

  async verifyWebhook(_payload: any, _signature: string): Promise<boolean> {
    return true;
  }
}

export const mockKajaPayClient = new MockKajaPayClient();

