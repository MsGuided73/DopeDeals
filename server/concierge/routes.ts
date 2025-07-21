import express from 'express';
import { z } from 'zod';
import { createConciergeService } from './service';
import { IStorage } from '../storage';

const router = express.Router();

// Validation schemas
const startConversationSchema = z.object({
  sessionId: z.string().min(1),
  userId: z.string().optional(),
  customerInfo: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    membershipTier: z.string().optional(),
    preferences: z.object({
      categories: z.array(z.string()).optional(),
      brands: z.array(z.string()).optional(),
      priceRange: z.object({
        min: z.number(),
        max: z.number()
      }).optional(),
      materials: z.array(z.string()).optional()
    }).optional(),
    purchaseHistory: z.array(z.object({
      productId: z.string(),
      productName: z.string(),
      category: z.string(),
      purchaseDate: z.string()
    })).optional()
  }).optional()
});

const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  message: z.string().min(1),
  context: z.object({
    currentPage: z.string().optional(),
    viewedProducts: z.array(z.string()).optional(),
    cartItems: z.array(z.string()).optional(),
    searchHistory: z.array(z.string()).optional()
  }).optional()
});

const endConversationSchema = z.object({
  conversationId: z.string().min(1),
  feedback: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
  }).optional()
});

const trackClickSchema = z.object({
  recommendationId: z.string().min(1),
  conversationId: z.string().min(1)
});

const trackPurchaseSchema = z.object({
  recommendationId: z.string().min(1),
  conversationId: z.string().min(1),
  orderInfo: z.object({
    orderId: z.string(),
    amount: z.number(),
    productIds: z.array(z.string())
  }).optional()
});

// Initialize concierge service
let conciergeService: ReturnType<typeof createConciergeService>;

export function initializeConciergeRoutes(storage: IStorage) {
  conciergeService = createConciergeService(storage);
  return router;
}

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'VIP Concierge service operational',
    features: {
      aiRecommendations: !!process.env.OPENAI_API_KEY,
      marketInsights: !!process.env.PERPLEXITY_API_KEY,
      ruleBasedFallback: true,
      conversationTracking: true,
      analytics: true
    },
    timestamp: new Date().toISOString()
  });
});

// Start a new conversation
router.post('/conversation/start', async (req, res) => {
  try {
    const validatedData = startConversationSchema.parse(req.body);
    
    const result = await conciergeService.startConversation(
      validatedData.sessionId,
      validatedData.userId,
      validatedData.customerInfo
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('[Concierge Routes] Start conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start conversation',
      error: error.message
    });
  }
});

// Send a message in an existing conversation
router.post('/conversation/message', async (req, res) => {
  try {
    const validatedData = sendMessageSchema.parse(req.body);
    
    const response = await conciergeService.processMessage(
      validatedData.conversationId,
      validatedData.message,
      validatedData.context
    );

    res.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    console.error('[Concierge Routes] Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message
    });
  }
});

// Get conversation history
router.get('/conversation/:conversationId/history', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required'
      });
    }

    const history = await conciergeService.getConversationHistory(conversationId);

    res.json({
      success: true,
      data: {
        conversationId,
        messages: history,
        count: history.length
      }
    });
  } catch (error: any) {
    console.error('[Concierge Routes] Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation history',
      error: error.message
    });
  }
});

// End a conversation
router.post('/conversation/end', async (req, res) => {
  try {
    const validatedData = endConversationSchema.parse(req.body);
    
    await conciergeService.endConversation(
      validatedData.conversationId,
      validatedData.feedback
    );

    res.json({
      success: true,
      message: 'Conversation ended successfully'
    });
  } catch (error: any) {
    console.error('[Concierge Routes] End conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end conversation',
      error: error.message
    });
  }
});

// Track recommendation click
router.post('/recommendation/click', async (req, res) => {
  try {
    const validatedData = trackClickSchema.parse(req.body);
    
    await conciergeService.trackRecommendationClick(
      validatedData.recommendationId,
      validatedData.conversationId
    );

    res.json({
      success: true,
      message: 'Recommendation click tracked successfully'
    });
  } catch (error: any) {
    console.error('[Concierge Routes] Track click error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track recommendation click',
      error: error.message
    });
  }
});

// Track recommendation purchase
router.post('/recommendation/purchase', async (req, res) => {
  try {
    const validatedData = trackPurchaseSchema.parse(req.body);
    
    await conciergeService.trackRecommendationPurchase(
      validatedData.recommendationId,
      validatedData.conversationId,
      validatedData.orderInfo
    );

    res.json({
      success: true,
      message: 'Recommendation purchase tracked successfully'
    });
  } catch (error: any) {
    console.error('[Concierge Routes] Track purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track recommendation purchase',
      error: error.message
    });
  }
});

// Get analytics
router.get('/analytics/:conversationId?', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
    
    const analytics = await conciergeService.getAnalytics(conversationId, dateRange);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error: any) {
    console.error('[Concierge Routes] Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

// Get quick product suggestions based on query
router.post('/suggestions', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // This would use the same logic as the AI client for finding relevant products
    // For now, returning a simplified response
    res.json({
      success: true,
      data: {
        query,
        suggestions: [
          { text: `Show me ${query} products`, type: 'search' },
          { text: `Compare ${query} options`, type: 'comparison' },
          { text: `Recommend best ${query}`, type: 'recommendation' }
        ]
      }
    });
  } catch (error: any) {
    console.error('[Concierge Routes] Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: error.message
    });
  }
});

export default router;