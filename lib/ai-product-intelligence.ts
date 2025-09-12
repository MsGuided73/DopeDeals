import OpenAI from 'openai';
import { getStorage } from './storage';
import { RecommendationAgent } from './recommendation-agent';

interface ProductKnowledge {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  features: string[];
  specifications: any;
  inventory: number;
  compliance: {
    ageRestricted: boolean;
    stateRestrictions: string[];
    nicotineProduct: boolean;
    tobaccoProduct: boolean;
  };
  embedding?: number[];
}

interface QueryContext {
  userId?: string;
  sessionId?: string;
  currentPage?: string;
  userPreferences?: any;
  conversationHistory?: any[];
}

interface AIResponse {
  answer: string;
  recommendations: any[];
  confidence: number;
  sources: string[];
  followUpQuestions: string[];
  actionSuggestions: string[];
}

export class AIProductIntelligence {
  private openai: OpenAI;
  private storage: any;
  private recommendationAgent: RecommendationAgent;
  private productKnowledge: Map<string, ProductKnowledge> = new Map();
  private lastSync: Date | null = null;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.recommendationAgent = new RecommendationAgent();
  }

  async initialize() {
    this.storage = await getStorage();
    await this.recommendationAgent.initialize();
    await this.syncProductKnowledge();
  }

  /**
   * Main query interface - combines RAG with personalized recommendations
   */
  async query(question: string, context: QueryContext = {}): Promise<AIResponse> {
    await this.ensureInitialized();

    // 1. Extract intent and entities from the question
    const intent = await this.analyzeIntent(question);
    
    // 2. Retrieve relevant product knowledge
    const relevantProducts = await this.retrieveRelevantProducts(question, intent);
    
    // 3. Get user context if available
    let userContext = null;
    if (context.userId) {
      userContext = await this.getUserContext(context.userId);
    }

    // 4. Generate AI response with product knowledge
    const aiResponse = await this.generateResponse(
      question, 
      intent, 
      relevantProducts, 
      userContext,
      context
    );

    // 5. Get personalized recommendations if user is authenticated
    let recommendations = [];
    if (context.userId && intent.needsRecommendations) {
      recommendations = await this.recommendationAgent.getPersonalizedRecommendations({
        userId: context.userId,
        limit: 4
      });
    }

    return {
      ...aiResponse,
      recommendations
    };
  }

  /**
   * Sync all product data into our knowledge base
   */
  private async syncProductKnowledge() {
    try {
      console.log('🧠 Syncing product knowledge base...');
      
      const [products, categories, brands] = await Promise.all([
        this.storage.getProducts(),
        this.storage.getCategories(),
        this.storage.getBrands()
      ]);

      // Create lookup maps
      const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]));
      const brandMap = new Map(brands.map((b: any) => [b.id, b.name]));

      // Process each product
      for (const product of products) {
        const knowledge: ProductKnowledge = {
          id: product.id,
          name: product.name,
          description: product.description || '',
          category: categoryMap.get(product.category_id) || 'Unknown',
          brand: brandMap.get(product.brand_id) || 'Unknown',
          price: parseFloat(product.price || 0),
          features: this.extractFeatures(product),
          specifications: this.extractSpecifications(product),
          inventory: product.stock_quantity || 0,
          compliance: {
            ageRestricted: product.age_restricted || false,
            stateRestrictions: product.state_restrictions || [],
            nicotineProduct: product.nicotine_product || false,
            tobaccoProduct: product.tobacco_product || false
          }
        };

        // Generate embedding for semantic search
        knowledge.embedding = await this.generateEmbedding(
          `${knowledge.name} ${knowledge.description} ${knowledge.category} ${knowledge.brand} ${knowledge.features.join(' ')}`
        );

        this.productKnowledge.set(product.id, knowledge);
      }

      this.lastSync = new Date();
      console.log(`✅ Synced ${products.length} products to knowledge base`);
    } catch (error) {
      console.error('❌ Error syncing product knowledge:', error);
    }
  }

  /**
   * Analyze user intent from their question
   */
  private async analyzeIntent(question: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Analyze the user's intent from their question about products in a smoke shop. 
          
          Return JSON with:
          - type: "product_search" | "comparison" | "recommendation" | "information" | "support"
          - entities: array of product names, categories, brands mentioned
          - filters: price range, features, etc.
          - needsRecommendations: boolean
          - urgency: "low" | "medium" | "high"`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    try {
      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch {
      return {
        type: 'information',
        entities: [],
        filters: {},
        needsRecommendations: true,
        urgency: 'low'
      };
    }
  }

  /**
   * Retrieve products relevant to the query using semantic search
   */
  private async retrieveRelevantProducts(question: string, intent: any): Promise<ProductKnowledge[]> {
    // Generate embedding for the question
    const questionEmbedding = await this.generateEmbedding(question);
    
    // Calculate similarity scores with all products
    const similarities: Array<{ product: ProductKnowledge, score: number }> = [];
    
    for (const product of this.productKnowledge.values()) {
      if (product.embedding) {
        const similarity = this.cosineSimilarity(questionEmbedding, product.embedding);
        similarities.push({ product, score: similarity });
      }
    }

    // Sort by similarity and apply filters from intent
    let relevant = similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => s.product);

    // Apply intent-based filters
    if (intent.entities?.length > 0) {
      relevant = relevant.filter(product => {
        const searchText = `${product.name} ${product.description} ${product.category} ${product.brand}`.toLowerCase();
        return intent.entities.some((entity: string) => 
          searchText.includes(entity.toLowerCase())
        );
      });
    }

    return relevant.slice(0, 5); // Top 5 most relevant
  }

  /**
   * Generate comprehensive AI response
   */
  private async generateResponse(
    question: string,
    intent: any,
    relevantProducts: ProductKnowledge[],
    userContext: any,
    context: QueryContext
  ): Promise<Omit<AIResponse, 'recommendations'>> {
    const productContext = relevantProducts.map(p => ({
      name: p.name,
      description: p.description,
      category: p.category,
      brand: p.brand,
      price: p.price,
      inStock: p.inventory > 0,
      features: p.features.slice(0, 3) // Top 3 features
    }));

    const systemPrompt = `You are DopeDeals' AI Product Expert. You have access to our complete product catalog and customer preferences.

CONTEXT:
- User Question: "${question}"
- Intent: ${intent.type}
- Available Products: ${JSON.stringify(productContext, null, 2)}
- User Context: ${userContext ? JSON.stringify(userContext, null, 2) : 'Anonymous user'}

GUIDELINES:
1. Be helpful, knowledgeable, and enthusiastic about our products
2. Always mention specific product names, prices, and key features
3. Consider compliance (age restrictions, state laws) in recommendations
4. If products are out of stock, mention alternatives
5. Use emojis appropriately to make responses engaging
6. Keep responses concise but informative (2-3 paragraphs max)
7. Always end with a helpful follow-up question or suggestion

COMPLIANCE NOTES:
- Age-restricted products require verification
- Some products may have state restrictions
- Always mention relevant warnings or requirements`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const answer = completion.choices[0]?.message?.content || 'I apologize, but I cannot provide an answer at this time.';

    // Generate follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(intent, relevantProducts);
    
    // Generate action suggestions
    const actionSuggestions = this.generateActionSuggestions(intent, relevantProducts);

    return {
      answer,
      confidence: this.calculateConfidence(relevantProducts, intent),
      sources: relevantProducts.map(p => p.name),
      followUpQuestions,
      actionSuggestions
    };
  }

  /**
   * Get user context for personalization
   */
  private async getUserContext(userId: string) {
    try {
      const [user, orders, behavior] = await Promise.all([
        this.storage.getUser(userId),
        this.storage.getUserOrders(userId),
        this.storage.getUserBehavior(userId, 20)
      ]);

      return {
        name: user?.firstName || 'Customer',
        totalOrders: orders?.length || 0,
        recentPurchases: orders?.slice(0, 3).map((o: any) => ({
          items: o.order_items?.map((item: any) => item.products?.name).filter(Boolean)
        })) || [],
        recentBehavior: behavior?.slice(0, 5).map((b: any) => ({
          action: b.action_type,
          product: b.product_id
        })) || []
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return null;
    }
  }

  // Helper methods
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      return [];
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private extractFeatures(product: any): string[] {
    const features = [];
    const text = `${product.name} ${product.description}`.toLowerCase();
    
    // Common product features to extract
    const featureKeywords = [
      'wireless', 'bluetooth', 'rechargeable', 'portable', 'glass', 'ceramic',
      'titanium', 'stainless steel', 'led', 'digital', 'temperature control',
      'variable voltage', 'sub-ohm', 'mesh coil', 'organic', 'natural',
      'premium', 'artisan', 'handcrafted', 'limited edition'
    ];

    featureKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        features.push(keyword);
      }
    });

    return features;
  }

  private extractSpecifications(product: any): any {
    return {
      material: product.material || null,
      dimensions: product.dimensions || null,
      weight: product.weight || null,
      capacity: product.capacity || null,
      power: product.power || null,
      compatibility: product.compatibility || null
    };
  }

  private generateFollowUpQuestions(intent: any, products: ProductKnowledge[]): string[] {
    const questions = [];
    
    if (intent.type === 'product_search' && products.length > 0) {
      questions.push(`Would you like to compare ${products[0].name} with similar products?`);
      questions.push(`Are you interested in accessories for ${products[0].category.toLowerCase()} products?`);
    }
    
    if (intent.type === 'recommendation') {
      questions.push('What\'s your experience level with these types of products?');
      questions.push('Do you have a preferred price range in mind?');
    }

    return questions.slice(0, 2);
  }

  private generateActionSuggestions(intent: any, products: ProductKnowledge[]): string[] {
    const suggestions = [];
    
    if (products.length > 0) {
      suggestions.push(`View ${products[0].name} details`);
      if (products[0].inventory > 0) {
        suggestions.push(`Add ${products[0].name} to cart`);
      }
    }
    
    if (intent.type === 'comparison' && products.length > 1) {
      suggestions.push('Compare selected products');
    }

    return suggestions;
  }

  private calculateConfidence(products: ProductKnowledge[], intent: any): number {
    let confidence = 0.5; // Base confidence
    
    if (products.length > 0) confidence += 0.3;
    if (products.length > 2) confidence += 0.1;
    if (intent.entities?.length > 0) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private async ensureInitialized() {
    if (!this.storage) {
      await this.initialize();
    }
    
    // Re-sync if data is older than 1 hour
    if (!this.lastSync || (Date.now() - this.lastSync.getTime()) > 3600000) {
      await this.syncProductKnowledge();
    }
  }
}
