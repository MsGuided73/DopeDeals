import { IStorage } from '../storage';
import { VIPConciergeAI } from './ai-client';
import { 
  ConciergeConversation, 
  ConciergeMessage, 
  ConciergeRecommendation,
  ConciergeAnalytics,
  ConciergeContext,
  ConciergeResponse,
  CustomerProfile,
  InsertConciergeConversation,
  InsertConciergeMessage,
  InsertConciergeRecommendation,
  InsertConciergeAnalytics
} from '@shared/concierge-schema';

export function createConciergeService(storage: IStorage) {
  
  async function startConversation(
    sessionId: string, 
    userId?: string, 
    customerInfo?: Partial<CustomerProfile>
  ): Promise<{ conversationId: string; message: string }> {
    try {
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create conversation record
      const conversation: InsertConciergeConversation = {
        id: conversationId,
        sessionId,
        userId,
        status: 'active',
        priority: customerInfo?.membershipTier?.toLowerCase().includes('vip') ? 'vip' : 'normal',
        customerInfo: customerInfo ? JSON.stringify(customerInfo) : null,
        metadata: JSON.stringify({
          userAgent: 'web-browser',
          startTime: new Date().toISOString()
        })
      };

      await storage.createConciergeConversation(conversation);

      // Create welcome message
      const welcomeMessage = customerInfo?.membershipTier?.toLowerCase().includes('vip')
        ? `Welcome back to VIP Smoke! I'm your personal VIP Concierge assistant. As a valued VIP member, I have access to our exclusive collection and can provide personalized recommendations. How can I assist you today?`
        : `Welcome to VIP Smoke! I'm your personal concierge assistant. I can help you find the perfect smoking accessories, answer questions about our products, and provide expert recommendations. What are you looking for today?`;

      const message: InsertConciergeMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        role: 'assistant',
        content: welcomeMessage,
        messageType: 'text',
        metadata: JSON.stringify({ 
          isWelcome: true,
          vipGreeting: customerInfo?.membershipTier?.toLowerCase().includes('vip') || false
        }),
        aiProvider: 'system',
        confidence: 100
      };

      await storage.createConciergeMessage(message);

      // Track analytics
      await trackEvent(conversationId, 'conversation_start', {
        sessionId,
        userId,
        customerInfo,
        timestamp: new Date().toISOString()
      });

      return {
        conversationId,
        message: welcomeMessage
      };
    } catch (error) {
      console.error('[Concierge Service] Error starting conversation:', error);
      throw new Error('Failed to start conversation');
    }
  }

  async function processMessage(
    conversationId: string,
    userMessage: string,
    context?: Partial<ConciergeContext>
  ): Promise<ConciergeResponse> {
    try {
      const startTime = Date.now();

      // Get conversation details
      const conversation = await storage.getConciergeConversation(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Save user message
      const userMessageRecord: InsertConciergeMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        role: 'user',
        content: userMessage,
        messageType: 'text',
        metadata: JSON.stringify({
          currentPage: (context as any)?.currentPage,
          viewedProducts: (context as any)?.viewedProducts,
          cartItems: (context as any)?.cartItems,
          searchHistory: (context as any)?.searchHistory
        }),
        confidence: 100
      };

      await storage.createConciergeMessage(userMessageRecord);

      // Get products, categories, and brands for AI context
      const [products, categories, brands] = await Promise.all([
        storage.getProducts(),
        storage.getCategories(),
        storage.getBrands()
      ]);

      // Build customer profile
      const customerProfile = conversation.customerInfo 
        ? JSON.parse(conversation.customerInfo as string) as CustomerProfile
        : undefined;

      // Create AI context
      const aiContext: ConciergeContext = {
        sessionId: conversation.sessionId,
        conversationId,
        customerProfile,
        currentQuery: userMessage,
        context: context as any
      };

      // Initialize AI client with current product data
      const conciergeAI = new VIPConciergeAI(products, categories, brands);

      // Process query with AI
      const aiResponse = await conciergeAI.processCustomerQuery(aiContext);

      // Save assistant message
      const assistantMessage: InsertConciergeMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        role: 'assistant',
        content: aiResponse.message,
        messageType: aiResponse.messageType,
        metadata: JSON.stringify({
          recommendations: aiResponse.recommendations,
          suggestedQueries: aiResponse.suggestedQueries,
          originalQuery: userMessage
        }),
        aiProvider: aiResponse.metadata?.aiProvider || 'unknown',
        confidence: aiResponse.metadata?.confidence || 70
      };

      await storage.createConciergeMessage(assistantMessage);

      // Save recommendations
      if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
        for (const rec of aiResponse.recommendations) {
          const recommendation: InsertConciergeRecommendation = {
            id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId,
            messageId: assistantMessage.id,
            productId: rec.product.id,
            recommendationType: rec.type,
            confidence: rec.confidence,
            reason: rec.reason,
            metadata: JSON.stringify({
              features: rec.features,
              alternatives: rec.alternatives,
              productData: rec.product
            })
          };

          await storage.createConciergeRecommendation(recommendation);
        }
      }

      // Update conversation last active time
      await storage.updateConciergeConversation(conversationId, {
        lastActiveAt: new Date(),
        updatedAt: new Date()
      });

      // Track analytics
      const responseTime = Date.now() - startTime;
      await trackEvent(conversationId, 'message_sent', {
        userMessage,
        aiResponse: aiResponse.message,
        responseTime,
        aiProvider: aiResponse.metadata?.aiProvider,
        confidence: aiResponse.metadata?.confidence,
        recommendationCount: aiResponse.recommendations?.length || 0
      });

      return aiResponse;
    } catch (error) {
      console.error('[Concierge Service] Error processing message:', error);
      
      // Return fallback response
      return {
        message: "I apologize, but I'm experiencing some technical difficulties. Let me connect you with our customer service team for immediate assistance.",
        messageType: 'support',
        recommendations: [],
        suggestedQueries: ['Contact customer service', 'Try again later', 'Browse our catalog'],
        escalate: true,
        metadata: {
          aiProvider: 'fallback',
          confidence: 0,
          responseTime: Date.now()
        }
      };
    }
  }

  async function getConversationHistory(conversationId: string): Promise<ConciergeMessage[]> {
    try {
      return await storage.getConciergeMessages(conversationId);
    } catch (error) {
      console.error('[Concierge Service] Error getting conversation history:', error);
      return [];
    }
  }

  async function endConversation(
    conversationId: string, 
    feedback?: { rating: number; comment?: string }
  ): Promise<void> {
    try {
      await storage.updateConciergeConversation(conversationId, {
        status: 'completed',
        updatedAt: new Date()
      });

      // Track analytics
      await trackEvent(conversationId, 'conversation_end', {
        feedback,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Concierge Service] Error ending conversation:', error);
    }
  }

  async function trackRecommendationClick(
    recommendationId: string,
    conversationId: string
  ): Promise<void> {
    try {
      await storage.updateConciergeRecommendation(recommendationId, {
        clickedAt: new Date()
      });

      await trackEvent(conversationId, 'recommendation_clicked', {
        recommendationId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Concierge Service] Error tracking recommendation click:', error);
    }
  }

  async function trackRecommendationPurchase(
    recommendationId: string,
    conversationId: string,
    orderInfo?: any
  ): Promise<void> {
    try {
      await storage.updateConciergeRecommendation(recommendationId, {
        purchasedAt: new Date()
      });

      await trackEvent(conversationId, 'recommendation_purchased', {
        recommendationId,
        orderInfo,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Concierge Service] Error tracking recommendation purchase:', error);
    }
  }

  async function getAnalytics(conversationId?: string, dateRange?: { start: Date; end: Date }): Promise<any> {
    try {
      const analytics = await storage.getConciergeAnalytics(conversationId, dateRange);
      
      // Process analytics data
      const processed = {
        totalConversations: 0,
        totalMessages: 0,
        avgResponseTime: 0,
        avgConfidence: 0,
        recommendationClickRate: 0,
        recommendationPurchaseRate: 0,
        topQueries: [],
        customerSatisfaction: 0,
        escalationRate: 0
      };

      // Calculate metrics from raw analytics data
      if (analytics.length > 0) {
        const conversations = analytics.filter(a => a.eventType === 'conversation_start');
        const messages = analytics.filter(a => a.eventType === 'message_sent');
        const clicks = analytics.filter(a => a.eventType === 'recommendation_clicked');
        const purchases = analytics.filter(a => a.eventType === 'recommendation_purchased');

        processed.totalConversations = conversations.length;
        processed.totalMessages = messages.length;
        
        if (messages.length > 0) {
          const responseTimes = messages
            .map((m: any) => m.performanceMetrics?.responseTime)
            .filter(rt => rt !== undefined);
          processed.avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;

          const confidences = messages
            .map((m: any) => m.performanceMetrics?.confidence)
            .filter(c => c !== undefined);
          processed.avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length || 0;
        }

        // Calculate rates
        const totalRecommendations = messages.reduce((total, msg: any) => {
          return total + (msg.eventData?.recommendationCount || 0);
        }, 0);

        if (totalRecommendations > 0) {
          processed.recommendationClickRate = (clicks.length / totalRecommendations) * 100;
          processed.recommendationPurchaseRate = (purchases.length / totalRecommendations) * 100;
        }
      }

      return processed;
    } catch (error) {
      console.error('[Concierge Service] Error getting analytics:', error);
      return null;
    }
  }

  async function trackEvent(
    conversationId: string,
    eventType: string,
    eventData: any,
    performanceMetrics?: any
  ): Promise<void> {
    try {
      const analytics: InsertConciergeAnalytics = {
        id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        eventType,
        eventData: JSON.stringify(eventData),
        performanceMetrics: performanceMetrics ? JSON.stringify(performanceMetrics) : null
      };

      await storage.createConciergeAnalytics(analytics);
    } catch (error) {
      console.error('[Concierge Service] Error tracking event:', error);
    }
  }

  return {
    startConversation,
    processMessage,
    getConversationHistory,
    endConversation,
    trackRecommendationClick,
    trackRecommendationPurchase,
    getAnalytics,
    trackEvent
  };
}