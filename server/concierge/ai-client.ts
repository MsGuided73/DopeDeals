import OpenAI from 'openai';
import { CustomerProfile, ProductRecommendation, ConciergeContext, ConciergeResponse } from '@shared/concierge-schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
}) : null;

// Perplexity client for web search capabilities
class PerplexityClient {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, searchDomainFilter?: string[]): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that provides accurate, up-to-date information about smoking accessories, glass pipes, vaporizers, and related products. Focus on product features, comparisons, and trends."
            },
            {
              role: "user",
              content: query
            }
          ],
          max_tokens: 500,
          temperature: 0.2,
          top_p: 0.9,
          search_domain_filter: searchDomainFilter,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: "month",
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[Perplexity] Search error:', error);
      throw error;
    }
  }
}

const perplexity = process.env.PERPLEXITY_API_KEY ? new PerplexityClient(process.env.PERPLEXITY_API_KEY) : null;

export class VIPConciergeAI {
  private products: any[] = [];
  private categories: any[] = [];
  private brands: any[] = [];

  constructor(products: any[], categories: any[], brands: any[]) {
    this.products = products;
    this.categories = categories;
    this.brands = brands;
  }

  async processCustomerQuery(context: ConciergeContext): Promise<ConciergeResponse> {
    try {
      // Analyze customer intent
      const intent = await this.analyzeIntent(context.currentQuery, context.customerProfile);
      
      // Get relevant products from database
      const relevantProducts = this.findRelevantProducts(context.currentQuery, context.customerProfile);
      
      // Get additional market insights if needed
      let marketInsights = null;
      if (perplexity && (intent === 'comparison' || intent === 'recommendation')) {
        try {
          marketInsights = await this.getMarketInsights(context.currentQuery);
        } catch (error) {
          console.warn('[VIP Concierge] Market insights unavailable:', error);
        }
      }

      // Generate AI response
      const response = await this.generateResponse(context, intent, relevantProducts, marketInsights);
      
      return response;
    } catch (error) {
      console.error('[VIP Concierge] Error processing query:', error);
      return this.getFallbackResponse(context);
    }
  }

  private async analyzeIntent(query: string, customerProfile?: CustomerProfile): Promise<string> {
    if (!openai) {
      return this.getRuleBasedIntent(query);
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant analyzing customer queries for a premium smoking accessories store. 
            Classify the intent into one of these categories:
            - product_search: Looking for specific products
            - comparison: Comparing different products
            - recommendation: Asking for recommendations
            - support: Need help or support
            - general: General questions or conversation
            
            Customer profile: ${customerProfile ? JSON.stringify(customerProfile) : 'Guest user'}
            
            Respond with just the intent category.`
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      });

      const intent = response.choices[0].message.content?.trim().toLowerCase();
      return ['product_search', 'comparison', 'recommendation', 'support', 'general'].includes(intent || '') 
        ? intent || 'general' 
        : 'general';
    } catch (error) {
      console.error('[VIP Concierge] Intent analysis error:', error);
      return this.getRuleBasedIntent(query);
    }
  }

  private getRuleBasedIntent(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('difference')) {
      return 'comparison';
    }
    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest') || lowerQuery.includes('best')) {
      return 'recommendation';
    }
    if (lowerQuery.includes('help') || lowerQuery.includes('support') || lowerQuery.includes('problem')) {
      return 'support';
    }
    if (lowerQuery.includes('glass') || lowerQuery.includes('pipe') || lowerQuery.includes('vaporizer') || 
        lowerQuery.includes('dab') || lowerQuery.includes('rig') || lowerQuery.includes('accessories')) {
      return 'product_search';
    }
    
    return 'general';
  }

  private findRelevantProducts(query: string, customerProfile?: CustomerProfile): any[] {
    const lowerQuery = query.toLowerCase();
    const searchTerms = lowerQuery.split(' ').filter(term => term.length > 2);
    
    let relevantProducts = this.products.filter(product => {
      const productText = `${product.name || ''} ${product.description || ''} ${product.category || ''} ${product.brand || ''}`.toLowerCase();
      return searchTerms.some(term => productText.includes(term));
    });

    // Apply customer preferences if available
    if (customerProfile?.preferences) {
      const prefs = customerProfile.preferences;
      
      if (prefs.categories?.length) {
        relevantProducts = relevantProducts.filter(p => 
          prefs.categories!.some(cat => p.category?.toLowerCase()?.includes(cat.toLowerCase()))
        );
      }
      
      if (prefs.brands?.length) {
        relevantProducts = relevantProducts.filter(p => 
          prefs.brands!.some(brand => p.brand?.toLowerCase()?.includes(brand.toLowerCase()))
        );
      }
      
      if (prefs.priceRange) {
        relevantProducts = relevantProducts.filter(p => 
          p.price >= prefs.priceRange!.min && p.price <= prefs.priceRange!.max
        );
      }
    }

    // Sort by relevance (basic scoring)
    relevantProducts.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, searchTerms);
      const bScore = this.calculateRelevanceScore(b, searchTerms);
      return bScore - aScore;
    });

    return relevantProducts.slice(0, 10); // Return top 10 most relevant
  }

  private calculateRelevanceScore(product: any, searchTerms: string[]): number {
    let score = 0;
    const productText = `${product.name || ''} ${product.description || ''} ${product.category || ''} ${product.brand || ''}`.toLowerCase();
    
    searchTerms.forEach(term => {
      if (product.name.toLowerCase().includes(term)) score += 10;
      if (product.category.toLowerCase().includes(term)) score += 8;
      if (product.brand.toLowerCase().includes(term)) score += 6;
      if (product.description.toLowerCase().includes(term)) score += 4;
    });
    
    // Boost VIP exclusive products
    if (product.vipExclusive) score += 5;
    
    // Boost in-stock products
    if (product.inStock) score += 3;
    
    return score;
  }

  private async getMarketInsights(query: string): Promise<any> {
    if (!perplexity) return null;

    try {
      const searchQuery = `Latest trends and information about ${query} in smoking accessories and glass pipes market 2024`;
      const response = await perplexity.search(searchQuery);
      
      return {
        content: response.choices[0]?.message?.content || '',
        citations: response.citations || []
      };
    } catch (error) {
      console.error('[VIP Concierge] Market insights error:', error);
      return null;
    }
  }

  private async generateResponse(
    context: ConciergeContext, 
    intent: string, 
    relevantProducts: any[], 
    marketInsights: any
  ): Promise<ConciergeResponse> {
    if (!openai) {
      return this.generateRuleBasedResponse(context, intent, relevantProducts, marketInsights);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(context.customerProfile, relevantProducts, marketInsights);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: context.currentQuery
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        message: aiResponse.message || "I'm here to help you find the perfect products!",
        messageType: aiResponse.messageType || 'text',
        recommendations: this.formatRecommendations(relevantProducts, aiResponse.recommendedProducts),
        suggestedQueries: aiResponse.suggestedQueries || [],
        escalate: aiResponse.escalate || false,
        metadata: {
          aiProvider: 'openai',
          confidence: 85,
          responseTime: Date.now(),
          searchResults: marketInsights ? [marketInsights] : []
        }
      };
    } catch (error) {
      console.error('[VIP Concierge] AI response generation error:', error);
      return this.generateRuleBasedResponse(context, intent, relevantProducts, marketInsights);
    }
  }

  private buildSystemPrompt(customerProfile?: CustomerProfile, products?: any[], marketInsights?: any): string {
    return `You are VIP Concierge, an expert AI assistant for VIP Smoke, a premium smoking accessories store. 

Your role:
- Provide personalized product recommendations
- Help customers find exactly what they need
- Offer alternatives and complementary products
- Share expert knowledge about smoking accessories
- Maintain a professional, knowledgeable, and helpful tone

Customer Profile: ${customerProfile ? JSON.stringify(customerProfile, null, 2) : 'Guest user'}

Available Products: ${products ? JSON.stringify(products.slice(0, 5), null, 2) : 'No products available'}

Market Insights: ${marketInsights ? marketInsights.content : 'No additional insights available'}

Respond in JSON format with:
{
  "message": "Your helpful response to the customer",
  "messageType": "text|product_recommendation|comparison|support",
  "recommendedProducts": ["product1_id", "product2_id"], // array of product IDs to recommend
  "suggestedQueries": ["query1", "query2"], // helpful follow-up questions
  "escalate": false // set to true only if you cannot help
}

Guidelines:
- Always be helpful and knowledgeable about smoking accessories
- Prioritize VIP exclusive products when appropriate
- Consider customer's membership tier and preferences
- Suggest complementary products (e.g., cleaning supplies with pipes)
- If you don't have specific product information, focus on general guidance
- Never make up product details or prices`;
  }

  private generateRuleBasedResponse(
    context: ConciergeContext, 
    intent: string, 
    relevantProducts: any[], 
    marketInsights: any
  ): ConciergeResponse {
    const isVIP = context.customerProfile?.membershipTier?.toLowerCase().includes('vip');
    
    let message = '';
    let messageType: 'text' | 'product_recommendation' | 'comparison' | 'support' = 'text';
    let recommendations: ProductRecommendation[] = [];

    switch (intent) {
      case 'product_search':
        if (relevantProducts.length > 0) {
          message = `I found ${relevantProducts.length} products that match your search. Here are my top recommendations:`;
          messageType = 'product_recommendation';
          recommendations = this.formatRecommendations(relevantProducts.slice(0, 3));
        } else {
          message = `I couldn't find exact matches for "${context.currentQuery}", but let me suggest some popular alternatives from our collection.`;
          recommendations = this.formatRecommendations(this.products.slice(0, 3));
        }
        break;

      case 'recommendation':
        message = isVIP 
          ? `As a VIP member, I have some exclusive recommendations for you:` 
          : `Here are my top recommendations based on your query:`;
        messageType = 'product_recommendation';
        recommendations = this.formatRecommendations(
          relevantProducts.length > 0 ? relevantProducts.slice(0, 3) : this.products.slice(0, 3)
        );
        break;

      case 'comparison':
        if (relevantProducts.length >= 2) {
          message = `I can help you compare these products. Here are the key differences:`;
          messageType = 'comparison';
          recommendations = this.formatRecommendations(relevantProducts.slice(0, 3));
        } else {
          message = `To provide a proper comparison, I need more specific product names. Could you tell me which products you'd like to compare?`;
        }
        break;

      case 'support':
        message = `I'm here to help! Based on your question, I'll do my best to assist you. If you need additional support, I can connect you with our customer service team.`;
        messageType = 'support';
        break;

      default:
        message = `Hello! I'm your VIP Concierge assistant. I can help you find products, make recommendations, or answer questions about our smoking accessories. What can I help you with today?`;
        break;
    }

    const suggestedQueries = this.generateSuggestedQueries(intent, relevantProducts);

    return {
      message,
      messageType,
      recommendations,
      suggestedQueries,
      escalate: false,
      metadata: {
        aiProvider: 'rule-based',
        confidence: 70,
        responseTime: Date.now(),
        searchResults: marketInsights ? [marketInsights] : []
      }
    };
  }

  private formatRecommendations(products: any[], recommendedIds?: string[]): ProductRecommendation[] {
    const productsToRecommend = recommendedIds 
      ? products.filter(p => recommendedIds.includes(p.id))
      : products;

    return productsToRecommend.map((product, index) => ({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        imageUrl: product.imageUrl,
        inStock: product.inStock,
        vipExclusive: product.vipExclusive
      },
      type: index === 0 ? 'primary' : (index === 1 ? 'alternative' : 'complementary'),
      confidence: Math.max(70, 95 - (index * 10)),
      reason: this.generateRecommendationReason(product, index),
      features: this.extractProductFeatures(product),
      alternatives: []
    }));
  }

  private generateRecommendationReason(product: any, index: number): string {
    const reasons = [
      `Top choice: ${product.name} is our most popular item in the ${product.category} category`,
      `Great alternative: ${product.name} offers excellent value with premium ${product.brand} quality`,
      `Perfect complement: ${product.name} pairs well with your other selections`
    ];
    
    if (product.vipExclusive) {
      return `VIP Exclusive: ${product.name} is available exclusively to our VIP members`;
    }
    
    return reasons[index] || `Recommended: ${product.name} is a quality choice from ${product.brand}`;
  }

  private extractProductFeatures(product: any): string[] {
    const features = [];
    
    if (product.vipExclusive) features.push('VIP Exclusive');
    if (product.inStock) features.push('In Stock');
    if (product.brand) features.push(`${product.brand} Brand`);
    if (product.category) features.push(product.category);
    
    // Extract features from description
    const description = product.description?.toLowerCase() || '';
    if (description.includes('handmade')) features.push('Handcrafted');
    if (description.includes('premium')) features.push('Premium Quality');
    if (description.includes('durable')) features.push('Durable');
    if (description.includes('glass')) features.push('Glass Construction');
    
    return features.slice(0, 5); // Limit to 5 features
  }

  private generateSuggestedQueries(intent: string, products: any[]): string[] {
    const queries = [];
    
    switch (intent) {
      case 'product_search':
        queries.push('Show me similar products', 'What accessories go with this?', 'Compare with other brands');
        break;
      case 'recommendation':
        queries.push('Show me VIP exclusive items', 'What\'s trending now?', 'Recommend cleaning supplies');
        break;
      case 'comparison':
        queries.push('What are the key differences?', 'Which has better value?', 'Show me customer reviews');
        break;
      default:
        queries.push('Show me new arrivals', 'What\'s popular this month?', 'Help me find accessories');
        break;
    }
    
    if (products.length > 0) {
      const category = products[0]?.category;
      if (category) {
        queries.push(`Show me more ${category} options`);
      }
    }
    
    return queries.slice(0, 3);
  }

  private getFallbackResponse(context: ConciergeContext): ConciergeResponse {
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