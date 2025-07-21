import { IStorage } from '../storage';
import { emojiAI } from './emoji-ai';
import {
  EmojiContext,
  EmojiRecommendation,
  EmojiPersonalityProfile,
  InsertEmojiUsage,
  InsertUserEmojiPreferences,
  InsertEmojiRecommendations,
  InsertProductEmojiAssociations,
  EmojiUsage,
  UserEmojiPreferences
} from '@shared/emoji-schema';

export class EmojiService {
  constructor(private storage: IStorage) {}

  // Get personalized emoji recommendations for user
  async getRecommendations(
    userId: string,
    context: EmojiContext
  ): Promise<EmojiRecommendation[]> {
    try {
      // Check cache first
      const cached = await this.getCachedRecommendations(userId, context);
      if (cached && cached.length > 0) {
        return cached;
      }

      // Get user personality and history
      const [userPreferences, recentUsage] = await Promise.all([
        this.storage.getUserEmojiPreferences(userId),
        this.storage.getRecentEmojiUsage(userId, 50)
      ]);

      const personality = this.buildPersonalityProfile(userPreferences, recentUsage);
      const recentEmojis = recentUsage.map(usage => usage.emoji);

      // Generate AI recommendations
      const recommendations = await emojiAI.generateRecommendations(
        context,
        personality,
        recentEmojis
      );

      // Cache recommendations
      await this.cacheRecommendations(userId, context, recommendations);

      // Update product-emoji associations
      if (context.productId) {
        await this.updateProductEmojiAssociations(context.productId, recommendations);
      }

      return recommendations;
    } catch (error) {
      console.error('[EmojiService] Get recommendations error:', error);
      return this.getFallbackRecommendations(context);
    }
  }

  // Track emoji usage for learning
  async trackEmojiUsage(
    userId: string,
    emoji: string,
    emojiCode: string,
    context: EmojiContext,
    sentiment?: string
  ): Promise<void> {
    try {
      // Record usage
      const usage: InsertEmojiUsage = {
        userId,
        emoji,
        emojiCode,
        context: context.type,
        contextId: context.productId || context.type,
        sentiment: sentiment || this.detectSentiment(emoji),
        frequency: 1,
        lastUsed: new Date()
      };

      await this.storage.createEmojiUsage(usage);

      // Update user preferences
      await this.updateUserPreferences(userId, emoji, context);

      // Mark cached recommendation as used
      await this.markRecommendationUsed(userId, context, emoji);

    } catch (error) {
      console.error('[EmojiService] Track usage error:', error);
    }
  }

  // Get user's emoji analytics
  async getUserEmojiAnalytics(userId: string): Promise<{
    totalUsage: number;
    favoriteEmojis: Array<{emoji: string; count: number}>;
    contextBreakdown: Array<{context: string; count: number}>;
    sentimentDistribution: Array<{sentiment: string; count: number}>;
    personalityProfile: EmojiPersonalityProfile;
  }> {
    try {
      const [allUsage, preferences] = await Promise.all([
        this.storage.getAllEmojiUsage(userId),
        this.storage.getUserEmojiPreferences(userId)
      ]);

      // Calculate favorite emojis
      const emojiCounts = allUsage.reduce((acc, usage) => {
        acc[usage.emoji] = (acc[usage.emoji] || 0) + usage.frequency;
        return acc;
      }, {} as Record<string, number>);

      const favoriteEmojis = Object.entries(emojiCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([emoji, count]) => ({ emoji, count }));

      // Context breakdown
      const contextCounts = allUsage.reduce((acc, usage) => {
        acc[usage.context] = (acc[usage.context] || 0) + usage.frequency;
        return acc;
      }, {} as Record<string, number>);

      const contextBreakdown = Object.entries(contextCounts)
        .map(([context, count]) => ({ context, count }));

      // Sentiment distribution
      const sentimentCounts = allUsage.reduce((acc, usage) => {
        const sentiment = usage.sentiment || 'neutral';
        acc[sentiment] = (acc[sentiment] || 0) + usage.frequency;
        return acc;
      }, {} as Record<string, number>);

      const sentimentDistribution = Object.entries(sentimentCounts)
        .map(([sentiment, count]) => ({ sentiment, count }));

      // Build personality profile
      const personalityProfile = this.buildPersonalityProfile(preferences, allUsage);

      return {
        totalUsage: allUsage.reduce((sum, usage) => sum + usage.frequency, 0),
        favoriteEmojis,
        contextBreakdown,
        sentimentDistribution,
        personalityProfile
      };
    } catch (error) {
      console.error('[EmojiService] Get analytics error:', error);
      return {
        totalUsage: 0,
        favoriteEmojis: [],
        contextBreakdown: [],
        sentimentDistribution: [],
        personalityProfile: {
          expressiveness: 50,
          professionalism: 50,
          creativity: 50,
          sentimentAlignment: 50,
          contextualAdaptation: 50
        }
      };
    }
  }

  // Get popular emojis for a product
  async getProductEmojiTrends(productId: string): Promise<Array<{
    emoji: string;
    emojiCode: string;
    usageCount: number;
    sentiment: string;
    associationStrength: number;
  }>> {
    try {
      return await this.storage.getProductEmojiAssociations(productId);
    } catch (error) {
      console.error('[EmojiService] Get product trends error:', error);
      return [];
    }
  }

  // Private helper methods
  private async getCachedRecommendations(
    userId: string,
    context: EmojiContext
  ): Promise<EmojiRecommendation[] | null> {
    try {
      const cached = await this.storage.getCachedEmojiRecommendations(
        userId,
        context.type,
        JSON.stringify(context)
      );

      if (cached && cached.expiresAt > new Date()) {
        return cached.recommendedEmojis as EmojiRecommendation[];
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  private async cacheRecommendations(
    userId: string,
    context: EmojiContext,
    recommendations: EmojiRecommendation[]
  ): Promise<void> {
    try {
      const cache: InsertEmojiRecommendations = {
        userId,
        context: context.type,
        contextData: context,
        recommendedEmojis: recommendations,
        confidence: Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

      await this.storage.createEmojiRecommendations(cache);
    } catch (error) {
      console.error('[EmojiService] Cache recommendations error:', error);
    }
  }

  private buildPersonalityProfile(
    preferences?: UserEmojiPreferences | null,
    usage?: EmojiUsage[]
  ): EmojiPersonalityProfile {
    if (!usage || usage.length === 0) {
      return {
        expressiveness: 50,
        professionalism: 50,
        creativity: 50,
        sentimentAlignment: 50,
        contextualAdaptation: 50
      };
    }

    return emojiAI.analyzeUserPersonality(
      usage.map(u => ({
        emoji: u.emoji,
        context: u.context,
        sentiment: u.sentiment || undefined
      }))
    );
  }

  private async updateUserPreferences(
    userId: string,
    emoji: string,
    context: EmojiContext
  ): Promise<void> {
    try {
      let preferences = await this.storage.getUserEmojiPreferences(userId);
      
      if (!preferences) {
        // Create new preferences
        const newPrefs: InsertUserEmojiPreferences = {
          userId,
          favoriteEmojis: [emoji],
          preferredCategories: [this.getEmojiCategory(emoji)],
          emojiPersonality: 'learning',
          contextualPreferences: { [context.type]: [emoji] }
        };
        await this.storage.createUserEmojiPreferences(newPrefs);
      } else {
        // Update existing preferences
        const updatedFavorites = [...(preferences.favoriteEmojis || [])];
        if (!updatedFavorites.includes(emoji)) {
          updatedFavorites.push(emoji);
          if (updatedFavorites.length > 20) {
            updatedFavorites.shift(); // Keep only recent favorites
          }
        }

        const updates = {
          favoriteEmojis: updatedFavorites,
          lastUpdated: new Date()
        };

        await this.storage.updateUserEmojiPreferences(userId, updates);
      }
    } catch (error) {
      console.error('[EmojiService] Update preferences error:', error);
    }
  }

  private async updateProductEmojiAssociations(
    productId: string,
    recommendations: EmojiRecommendation[]
  ): Promise<void> {
    try {
      for (const rec of recommendations) {
        const association: InsertProductEmojiAssociations = {
          productId,
          emoji: rec.emoji,
          emojiCode: rec.emojiCode,
          associationStrength: rec.confidence,
          sentiment: rec.sentiment
        };

        await this.storage.upsertProductEmojiAssociation(association);
      }
    } catch (error) {
      console.error('[EmojiService] Update associations error:', error);
    }
  }

  private async markRecommendationUsed(
    userId: string,
    context: EmojiContext,
    usedEmoji: string
  ): Promise<void> {
    try {
      await this.storage.markEmojiRecommendationUsed(
        userId,
        context.type,
        usedEmoji
      );
    } catch (error) {
      console.error('[EmojiService] Mark used error:', error);
    }
  }

  private detectSentiment(emoji: string): string {
    const positiveEmojis = ['😊', '😄', '🤩', '😍', '🥳', '👑', '✨', '🔥'];
    const negativeEmojis = ['😞', '😔', '😤', '😒', '🙄'];
    
    if (positiveEmojis.includes(emoji)) return 'positive';
    if (negativeEmojis.includes(emoji)) return 'negative';
    return 'neutral';
  }

  private getEmojiCategory(emoji: string): string {
    const categories: Record<string, string> = {
      '😊': 'smileys', '😄': 'smileys', '🤩': 'smileys', '😍': 'smileys',
      '🔥': 'objects', '💨': 'objects', '💎': 'objects', '👑': 'objects',
      '🌿': 'nature', '🍃': 'nature', '🌱': 'nature'
    };
    
    return categories[emoji] || 'general';
  }

  private getFallbackRecommendations(context: EmojiContext): EmojiRecommendation[] {
    // Simple fallback recommendations
    const fallback: EmojiRecommendation[] = [
      {
        emoji: '😊',
        emojiCode: ':blush:',
        name: 'Smiling Face',
        category: 'smileys',
        confidence: 80,
        reason: 'General positive reaction',
        sentiment: 'positive'
      },
      {
        emoji: '👍',
        emojiCode: ':thumbs_up:',
        name: 'Thumbs Up',
        category: 'gestures',
        confidence: 85,
        reason: 'Shows approval',
        sentiment: 'positive'
      }
    ];

    if (context.type === 'product_review') {
      fallback.push({
        emoji: '🔥',
        emojiCode: ':fire:',
        name: 'Fire',
        category: 'objects',
        confidence: 90,
        reason: 'Great for expressing excitement about products',
        sentiment: 'positive'
      });
    }

    return fallback;
  }
}

export const createEmojiService = (storage: IStorage) => new EmojiService(storage);