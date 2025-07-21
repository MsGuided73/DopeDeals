import express from 'express';
import { z } from 'zod';
import { createEmojiService } from './emoji-service';
import { IStorage } from '../storage';
import { EmojiContext } from '@shared/emoji-schema';

const router = express.Router();

// Validation schemas
const getRecommendationsSchema = z.object({
  userId: z.string().min(1),
  context: z.object({
    type: z.enum(['product_review', 'comment', 'reaction', 'search', 'general']),
    productId: z.string().optional(),
    productName: z.string().optional(),
    productCategory: z.string().optional(),
    textContent: z.string().optional(),
    currentMood: z.enum(['happy', 'excited', 'satisfied', 'disappointed', 'neutral']).optional(),
    previousEmojis: z.array(z.string()).optional()
  })
});

const trackUsageSchema = z.object({
  userId: z.string().min(1),
  emoji: z.string(),
  emojiCode: z.string(),
  context: z.object({
    type: z.enum(['product_review', 'comment', 'reaction', 'search', 'general']),
    productId: z.string().optional(),
    productName: z.string().optional(),
    productCategory: z.string().optional(),
    textContent: z.string().optional()
  }),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional()
});

// Initialize emoji service
let emojiService: ReturnType<typeof createEmojiService>;

export function initializeEmojiRoutes(storage: IStorage) {
  emojiService = createEmojiService(storage);
  return router;
}

// Get personalized emoji recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const validatedData = getRecommendationsSchema.parse(req.body);
    
    const recommendations = await emojiService.getRecommendations(
      validatedData.userId,
      validatedData.context as EmojiContext
    );

    res.json({
      success: true,
      data: {
        recommendations,
        count: recommendations.length,
        context: validatedData.context
      }
    });
  } catch (error: any) {
    console.error('[EmojiAI] Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emoji recommendations',
      error: error.message
    });
  }
});

// Track emoji usage for learning
router.post('/track-usage', async (req, res) => {
  try {
    const validatedData = trackUsageSchema.parse(req.body);
    
    await emojiService.trackEmojiUsage(
      validatedData.userId,
      validatedData.emoji,
      validatedData.emojiCode,
      validatedData.context as EmojiContext,
      validatedData.sentiment
    );

    res.json({
      success: true,
      message: 'Emoji usage tracked successfully'
    });
  } catch (error: any) {
    console.error('[EmojiAI] Track usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track emoji usage',
      error: error.message
    });
  }
});

// Get user emoji analytics
router.get('/analytics/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const analytics = await emojiService.getUserEmojiAnalytics(userId);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error: any) {
    console.error('[EmojiAI] Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emoji analytics',
      error: error.message
    });
  }
});

// Get popular emojis for a product
router.get('/product-trends/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    
    const trends = await emojiService.getProductEmojiTrends(productId);
    
    res.json({
      success: true,
      data: {
        productId,
        trends,
        count: trends.length
      }
    });
  } catch (error: any) {
    console.error('[EmojiAI] Get product trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product emoji trends',
      error: error.message
    });
  }
});

// Quick emoji suggestions for text input
router.post('/quick-suggestions', async (req, res) => {
  try {
    const { text, userId, context } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Text content is required'
      });
    }

    const emojiContext: EmojiContext = {
      type: context?.type || 'general',
      textContent: text,
      productId: context?.productId,
      productName: context?.productName,
      productCategory: context?.productCategory
    };

    const recommendations = await emojiService.getRecommendations(
      userId || 'guest',
      emojiContext
    );

    // Return top 3 quick suggestions
    const quickSuggestions = recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3)
      .map(rec => ({
        emoji: rec.emoji,
        name: rec.name,
        confidence: rec.confidence
      }));

    res.json({
      success: true,
      data: {
        text,
        suggestions: quickSuggestions
      }
    });
  } catch (error: any) {
    console.error('[EmojiAI] Quick suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quick suggestions',
      error: error.message
    });
  }
});

// Health check for emoji AI system
router.get('/health', async (req, res) => {
  try {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    
    res.json({
      success: true,
      message: 'Emoji AI system operational',
      features: {
        aiRecommendations: hasOpenAI,
        ruleBasedFallback: true,
        userAnalytics: true,
        productTrends: true
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Emoji AI system error',
      error: error.message
    });
  }
});

export default router;