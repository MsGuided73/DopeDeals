import express from 'express';
import { z } from 'zod';
import { kajaPayClient } from './client';
import { createPaymentService } from './service';
import { IStorage } from '../storage';

const router = express.Router();

// Validation schemas
const processPaymentSchema = z.object({
  amount: z.number().min(0.01).max(20000000),
  orderId: z.string().uuid(),
  userId: z.string().uuid(),
  orderNumber: z.string().optional(),
  paymentMethod: z.object({
    type: z.enum(['card', 'ach', 'saved_card']),
    cardNumber: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    cvv: z.string().optional(),
    customerToken: z.string().optional(),
    paymentAccountDataToken: z.string().optional()
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional()
  }),
  taxAmount: z.number().optional(),
  shippingAmount: z.number().optional(),
  saveCard: z.boolean().optional().default(false)
});

const saveCardSchema = z.object({
  userId: z.string().uuid(),
  cardNumber: z.string().min(14).max(16),
  expiryMonth: z.string().length(2),
  expiryYear: z.string().length(4),
  cvv: z.string().min(3).max(4).optional(),
  billingName: z.string(),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional()
  })
});

const refundSchema = z.object({
  transactionId: z.string().uuid(),
  amount: z.number().min(0.01).optional(),
  reason: z.string().optional()
});

// Initialize payment service
let paymentService: PaymentService;

export function initializeKajaPayRoutes(storage: IStorage) {
  paymentService = createPaymentService(storage);
  return router;
}

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const validation = kajaPayClient.validateConfig();
    
    if (validation.length > 0) {
      return res.status(503).json({
        success: false,
        message: 'KajaPay configuration invalid',
        errors: validation
      });
    }

    // Test API connectivity
    const healthCheck = await kajaPayClient.healthCheck();
    
    res.json({
      success: healthCheck.success,
      message: healthCheck.success ? 'KajaPay service healthy' : 'KajaPay service unavailable',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'KajaPay health check failed',
      error: error.message
    });
  }
});

// Process payment
router.post('/process-payment', async (req, res) => {
  try {
    const validatedData = processPaymentSchema.parse(req.body);
    
    const result = await paymentService.processPayment({
      orderId: validatedData.orderId,
      userId: validatedData.userId,
      amount: validatedData.amount,
      paymentMethod: validatedData.paymentMethod,
      billingAddress: validatedData.billingAddress,
      orderNumber: validatedData.orderNumber,
      taxAmount: validatedData.taxAmount,
      shippingAmount: validatedData.shippingAmount
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          transactionId: result.transactionId,
          referenceNumber: result.referenceNumber,
          authCode: result.authCode,
          amount: result.amount,
          maskedCardNumber: result.maskedCardNumber,
          cardType: result.cardType
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment processing failed',
        error: result.responseText,
        details: result.errorMessage
      });
    }
  } catch (error: any) {
    console.error('[KajaPay] Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing error',
      error: error.message
    });
  }
});

// Save payment method
router.post('/save-card', async (req, res) => {
  try {
    const validatedData = saveCardSchema.parse(req.body);
    
    const paymentMethod = await paymentService.savePaymentMethod(
      validatedData.userId,
      {
        cardNumber: validatedData.cardNumber,
        expiryMonth: validatedData.expiryMonth,
        expiryYear: validatedData.expiryYear,
        cvv: validatedData.cvv,
        billingName: validatedData.billingName,
        billingAddress: validatedData.billingAddress
      }
    );

    if (paymentMethod) {
      res.json({
        success: true,
        message: 'Payment method saved successfully',
        data: {
          id: paymentMethod.id,
          cardLast4: paymentMethod.cardLast4,
          cardType: paymentMethod.cardType,
          expiryMonth: paymentMethod.expiryMonth,
          expiryYear: paymentMethod.expiryYear
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to save payment method'
      });
    }
  } catch (error: any) {
    console.error('[KajaPay] Save card error:', error);
    res.status(500).json({
      success: false,
      message: 'Save payment method error',
      error: error.message
    });
  }
});

// Get user payment methods
router.get('/payment-methods/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const paymentMethods = await paymentService.getUserPaymentMethods(userId);
    
    // Return safe data (no tokens)
    const safePaymentMethods = paymentMethods.map(pm => ({
      id: pm.id,
      cardLast4: pm.cardLast4,
      cardType: pm.cardType,
      expiryMonth: pm.expiryMonth,
      expiryYear: pm.expiryYear,
      billingName: pm.billingName,
      isDefault: pm.isDefault,
      createdAt: pm.createdAt
    }));

    res.json({
      success: true,
      data: safePaymentMethods
    });
  } catch (error: any) {
    console.error('[KajaPay] Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment methods',
      error: error.message
    });
  }
});

// Delete payment method
router.delete('/payment-methods/:id', async (req, res) => {
  try {
    const paymentMethodId = req.params.id;
    
    const deleted = await paymentService.deletePaymentMethod(paymentMethodId);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Payment method deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Payment method not found'
      });
    }
  } catch (error: any) {
    console.error('[KajaPay] Delete payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment method',
      error: error.message
    });
  }
});

// Process refund
router.post('/refund', async (req, res) => {
  try {
    const validatedData = refundSchema.parse(req.body);
    
    const result = await paymentService.processRefund(
      validatedData.transactionId,
      validatedData.amount,
      validatedData.reason
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          transactionId: result.transactionId,
          referenceNumber: result.referenceNumber,
          amount: result.amount
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Refund processing failed',
        error: result.responseText,
        details: result.errorMessage
      });
    }
  } catch (error: any) {
    console.error('[KajaPay] Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund processing error',
      error: error.message
    });
  }
});

// Get transaction status
router.get('/transaction/:id/status', async (req, res) => {
  try {
    const transactionId = req.params.id;
    
    const status = await paymentService.getTransactionStatus(transactionId);
    
    if (status) {
      res.json({
        success: true,
        data: status
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
  } catch (error: any) {
    console.error('[KajaPay] Get transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction status',
      error: error.message
    });
  }
});

// Webhook endpoint for KajaPay
router.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    const signature = req.headers['x-kajapay-signature'] as string;

    // Verify webhook signature
    const isValid = await kajaPayClient.verifyWebhook(payload, signature);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    // Store webhook event for processing
    await paymentService.storage.createWebhookEvent({
      eventType: payload.eventType,
      kajaPayTransactionId: payload.transactionId,
      payload: payload,
      processed: false
    });

    // TODO: Process webhook event based on type
    // - transaction.approved: Update order status
    // - transaction.declined: Handle failed payment
    // - transaction.refunded: Update refund status
    // - transaction.settled: Confirm settlement

    res.json({
      success: true,
      message: 'Webhook received'
    });
  } catch (error: any) {
    console.error('[KajaPay] Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error',
      error: error.message
    });
  }
});

export default router;