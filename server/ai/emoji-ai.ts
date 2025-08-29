import OpenAI from 'openai';
import { EmojiContext, EmojiRecommendation, EmojiPersonalityProfile } from '@shared/emoji-schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
}) : null;

// Comprehensive emoji database with categories and sentiments
const EMOJI_DATABASE = {
  smileys: {
    positive: [
      { emoji: '😊', code: ':blush:', name: 'Smiling Face', sentiment: 'positive', confidence: 90 },
      { emoji: '😄', code: ':smile:', name: 'Grinning Face', sentiment: 'positive', confidence: 95 },
      { emoji: '🤩', code: ':star_struck:', name: 'Star-Struck', sentiment: 'positive', confidence: 85 },
      { emoji: '😍', code: ':heart_eyes:', name: 'Heart Eyes', sentiment: 'positive', confidence: 88 },
      { emoji: '🥳', code: ':partying_face:', name: 'Partying Face', sentiment: 'positive', confidence: 92 }
    ],
    neutral: [
      { emoji: '😐', code: ':neutral_face:', name: 'Neutral Face', sentiment: 'neutral', confidence: 80 },
      { emoji: '🤔', code: ':thinking:', name: 'Thinking Face', sentiment: 'neutral', confidence: 75 },
      { emoji: '😶', code: ':no_mouth:', name: 'No Mouth', sentiment: 'neutral', confidence: 70 }
    ],
    negative: [
      { emoji: '😞', code: ':disappointed:', name: 'Disappointed', sentiment: 'negative', confidence: 85 },
      { emoji: '😔', code: ':pensive:', name: 'Pensive', sentiment: 'negative', confidence: 80 },
      { emoji: '😤', code: ':huffing:', name: 'Huffing', sentiment: 'negative', confidence: 90 }
    ]
  },
  objects: {
    smoking: [
      { emoji: '🚬', code: ':smoking:', name: 'Cigarette', sentiment: 'neutral', confidence: 95 },
      { emoji: '💨', code: ':dash:', name: 'Smoke/Vapor', sentiment: 'neutral', confidence: 88 },
      { emoji: '🔥', code: ':fire:', name: 'Fire', sentiment: 'positive', confidence: 92 }
    ],
    glass: [
      { emoji: '🥃', code: ':tumbler_glass:', name: 'Glass', sentiment: 'neutral', confidence: 85 },
      { emoji: '💎', code: ':gem:', name: 'Gem/Crystal', sentiment: 'positive', confidence: 90 },
      { emoji: '✨', code: ':sparkles:', name: 'Sparkles', sentiment: 'positive', confidence: 88 }
    ],
    premium: [
      { emoji: '👑', code: ':crown:', name: 'Crown', sentiment: 'positive', confidence: 95 },
      { emoji: '💰', code: ':money_bag:', name: 'Money Bag', sentiment: 'positive', confidence: 90 },
      { emoji: '🏆', code: ':trophy:', name: 'Trophy', sentiment: 'positive', confidence: 93 }
    ]
  },
  nature: [
    { emoji: '🌿', code: ':herb:', name: 'Herb', sentiment: 'positive', confidence: 90 },
    { emoji: '🍃', code: ':leaves:', name: 'Leaves', sentiment: 'positive', confidence: 85 },
    { emoji: '🌱', code: ':seedling:', name: 'Seedling', sentiment: 'positive', confidence: 88 }
  ],
  activities: [
    { emoji: '🎯', code: ':dart:', name: 'Direct Hit', sentiment: 'positive', confidence: 90 },
    { emoji: '🎪', code: ':circus_tent:', name: 'Entertainment', sentiment: 'positive', confidence: 85 },
    { emoji: '🎭', code: ':performing_arts:', name: 'Arts', sentiment: 'neutral', confidence: 80 }
  ]
};

export class EmojiAI {
  // Generate personalized emoji recommendations using AI
  async generateRecommendations(
    context: EmojiContext,
    userPersonality?: EmojiPersonalityProfile,
    userHistory?: string[]
  ): Promise<EmojiRecommendation[]> {
    try {
      // If OpenAI is not available, fall back to rule-based recommendations
      if (!openai) {
        return this.getRuleBasedRecommendations(context, userPersonality, userHistory);
      }

      const prompt = this.buildAIPrompt(context, userPersonality, userHistory);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert emoji recommendation AI for a premium smoking accessories e-commerce platform. Analyze user context and provide personalized emoji suggestions with confidence scores and reasoning."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return this.validateAndEnhanceAIRecommendations(result.recommendations || []);

    } catch (error) {
      console.error('[EmojiAI] AI recommendation error:', error);
      // Fallback to rule-based system
      return this.getRuleBasedRecommendations(context, userPersonality, userHistory);
    }
  }

  // Build AI prompt with context and user data
  private buildAIPrompt(
    context: EmojiContext,
    userPersonality?: EmojiPersonalityProfile,
    userHistory?: string[]
  ): string {
    let prompt = `Recommend 5-8 relevant emojis for this context:

Context Type: ${context.type}
${context.productName ? `Product: ${context.productName}` : ''}
${context.productCategory ? `Category: ${context.productCategory}` : ''}
${context.textContent ? `Text Content: "${context.textContent}"` : ''}
${context.currentMood ? `User Mood: ${context.currentMood}` : ''}

`;

    if (userPersonality) {
      prompt += `User Personality Profile:
- Expressiveness: ${userPersonality.expressiveness}/100
- Professionalism: ${userPersonality.professionalism}/100  
- Creativity: ${userPersonality.creativity}/100
- Sentiment Alignment: ${userPersonality.sentimentAlignment}/100

`;
    }

    if (userHistory && userHistory.length > 0) {
      prompt += `Recently Used Emojis: ${userHistory.slice(0, 10).join(', ')}

`;
    }

    prompt += `Consider this is for a premium smoking accessories platform (glass pipes, bongs, dab rigs, accessories).

Return JSON format:
{
  "recommendations": [
    {
      "emoji": "😊",
      "emojiCode": ":blush:",
      "name": "Smiling Face",
      "category": "smileys",
      "confidence": 85,
      "reason": "Perfect for positive product reviews",
      "sentiment": "positive"
    }
  ]
}`;

    return prompt;
  }

  // Rule-based fallback system when AI is unavailable
  private getRuleBasedRecommendations(
    context: EmojiContext,
    userPersonality?: EmojiPersonalityProfile,
    userHistory?: string[]
  ): EmojiRecommendation[] {
    const recommendations: EmojiRecommendation[] = [];
    
    // Context-based recommendations
    if (context.type === 'product_review') {
      recommendations.push(...this.getProductReviewEmojis(context));
    } else if (context.type === 'search') {
      recommendations.push(...this.getSearchEmojis(context));
    } else {
      recommendations.push(...this.getGeneralEmojis(context));
    }

    // Apply personality filters
    if (userPersonality) {
      return this.applyPersonalityFilter(recommendations, userPersonality);
    }

    // Filter out recently used emojis to encourage variety
    if (userHistory) {
      return recommendations.filter(rec => !userHistory.includes(rec.emoji));
    }

    return recommendations.slice(0, 6);
  }

  // Get emojis specific to product reviews
  private getProductReviewEmojis(context: EmojiContext): EmojiRecommendation[] {
    const recommendations: EmojiRecommendation[] = [];
    
    // Sentiment-based recommendations
    if (context.currentMood === 'happy' || context.currentMood === 'satisfied') {
      recommendations.push(...EMOJI_DATABASE.smileys.positive.map(e => ({
        ...e,
        emojiCode: e.code,
        category: 'smileys',
        reason: 'Perfect for expressing satisfaction with the product'
      })));
    }

    // Product category specific
    if (context.productCategory?.toLowerCase().includes('glass')) {
      recommendations.push(...EMOJI_DATABASE.objects.glass.map(e => ({
        emoji: e.emoji,
        emojiCode: e.code,
        name: e.name,
        category: 'objects',
        confidence: e.confidence,
        reason: 'Related to glass products',
        sentiment: e.sentiment
      })));
    }

    // VIP/Premium products
    if (context.productName?.toLowerCase().includes('vip') || 
        context.productName?.toLowerCase().includes('premium')) {
      recommendations.push(...EMOJI_DATABASE.objects.premium.map(e => ({
        emoji: e.emoji,
        emojiCode: e.code,
        name: e.name,
        category: 'objects',
        confidence: e.confidence,
        reason: 'Emphasizes premium quality',
        sentiment: e.sentiment
      })));
    }

    return recommendations;
  }

  // Get emojis for search context
  private getSearchEmojis(context: EmojiContext): EmojiRecommendation[] {
    return [
      {
        emoji: '🔍',
        emojiCode: ':mag:',
        name: 'Magnifying Glass',
        category: 'objects',
        confidence: 95,
        reason: 'Perfect for search activities',
        sentiment: 'neutral'
      },
      {
        emoji: '💭',
        emojiCode: ':thought_balloon:',
        name: 'Thought Balloon', 
        category: 'smileys',
        confidence: 80,
        reason: 'Represents thinking and searching',
        sentiment: 'neutral'
      }
    ];
  }

  // Get general-purpose emojis
  private getGeneralEmojis(context: EmojiContext): EmojiRecommendation[] {
    const general: EmojiRecommendation[] = [];
    
    // Add variety from different categories
    general.push(...EMOJI_DATABASE.smileys.positive.slice(0, 2).map(e => ({
      emoji: e.emoji,
      emojiCode: e.code,
      name: e.name,
      category: 'smileys',
      confidence: e.confidence,
      reason: 'General positive expression',
      sentiment: e.sentiment
    })));

    general.push(...EMOJI_DATABASE.objects.smoking.slice(0, 2).map(e => ({
      emoji: e.emoji,
      emojiCode: e.code,
      name: e.name,
      category: 'objects',
      confidence: e.confidence,
      reason: 'Related to smoking accessories',
      sentiment: e.sentiment
    })));

    return general;
  }

  // Apply user personality to filter and score recommendations
  private applyPersonalityFilter(
    recommendations: EmojiRecommendation[],
    personality: EmojiPersonalityProfile
  ): EmojiRecommendation[] {
    return recommendations.map(rec => {
      let adjustedConfidence = rec.confidence;
      
      // Expressiveness adjustment
      if (personality.expressiveness > 70 && rec.category === 'smileys') {
        adjustedConfidence += 10;
      } else if (personality.expressiveness < 30 && rec.category === 'smileys') {
        adjustedConfidence -= 15;
      }

      // Professionalism adjustment
      if (personality.professionalism > 70) {
        if (rec.emoji === '🔥' || rec.emoji === '💰') {
          adjustedConfidence -= 20; // Less professional emojis
        }
      }

      // Creativity adjustment
      if (personality.creativity > 70) {
        adjustedConfidence += 5; // Encourage variety
      }

      return {
        ...rec,
        confidence: Math.max(0, Math.min(100, adjustedConfidence))
      };
    })
    .filter(rec => rec.confidence > 40)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);
  }

  // Validate and enhance AI-generated recommendations
  private validateAndEnhanceAIRecommendations(aiRecs: any[]): EmojiRecommendation[] {
    return aiRecs
      .filter(rec => rec.emoji && rec.confidence && rec.reason)
      .map(rec => ({
        emoji: rec.emoji,
        emojiCode: rec.emojiCode || this.getEmojiCode(rec.emoji),
        name: rec.name || 'Unknown Emoji',
        category: rec.category || 'general',
        confidence: Math.min(100, Math.max(0, rec.confidence)),
        reason: rec.reason,
        sentiment: rec.sentiment || 'neutral'
      }))
      .slice(0, 8);
  }

  // Get emoji shortcode from emoji character (basic implementation)
  private getEmojiCode(emoji: string): string {
    const emojiMap: { [key: string]: string } = {
      '😊': ':blush:',
      '😄': ':smile:',
      '🔥': ':fire:',
      '💨': ':dash:',
      '💎': ':gem:',
      '👑': ':crown:',
      '🌿': ':herb:',
      '✨': ':sparkles:'
    };
    
    return emojiMap[emoji] || ':emoji:';
  }

  // Analyze user's emoji usage to build personality profile
  analyzeUserPersonality(emojiHistory: Array<{emoji: string, context: string, sentiment?: string}>): EmojiPersonalityProfile {
    const totalUsage = emojiHistory.length;
    if (totalUsage === 0) {
      // Default personality for new users
      return {
        expressiveness: 50,
        professionalism: 50,
        creativity: 50,
        sentimentAlignment: 50,
        contextualAdaptation: 50
      };
    }

    const expressiveEmojis = emojiHistory.filter(h => 
      ['😄', '🤩', '😍', '🥳', '😂', '😭'].includes(h.emoji)
    ).length;
    
    const professionalEmojis = emojiHistory.filter(h =>
      ['👍', '👌', '✅', '💼', '📊'].includes(h.emoji)
    ).length;

    const creativeEmojis = new Set(emojiHistory.map(h => h.emoji)).size;
    
    return {
      expressiveness: Math.round((expressiveEmojis / totalUsage) * 100),
      professionalism: Math.round((professionalEmojis / totalUsage) * 100),
      creativity: Math.round((creativeEmojis / totalUsage) * 100),
      sentimentAlignment: 70, // Would need sentiment analysis to calculate
      contextualAdaptation: 60 // Would need context analysis to calculate
    };
  }
}

export const emojiAI = new EmojiAI();