import OpenAI from 'openai';
import { getStorage } from './storage';

interface RecommendationContext {
  userId: string;
  currentProductId?: string;
  sessionBehavior?: any[];
  limit?: number;
}

interface ProductRecommendation {
  productId: string;
  product: any;
  score: number;
  reason: string;
  category: 'similar_flavor' | 'same_brand' | 'price_match' | 'trending' | 'personalized';
}

export class RecommendationAgent {
  private openai: OpenAI | null = null;
  private storage: any;
  private isAIEnabled: boolean = false;

  constructor() {
    // Only initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        this.isAIEnabled = true;
        console.log('✅ ChatGPT 4o Recommendation Agent initialized');
      } catch (error) {
        console.warn('⚠️ OpenAI initialization failed, using fallback recommendations:', error);
        this.isAIEnabled = false;
      }
    } else {
      console.warn('⚠️ OPENAI_API_KEY not found, using fallback recommendations');
      this.isAIEnabled = false;
    }
  }

  async initialize() {
    this.storage = await getStorage();
  }

  /**
   * Get personalized product recommendations for a user
   */
  async getPersonalizedRecommendations(context: RecommendationContext): Promise<ProductRecommendation[]> {
    try {
      await this.initialize();

      const { userId, currentProductId, limit = 8 } = context;

      // Get user's purchase history and behavior with error handling
      let userOrders = [];
      let userBehavior = [];
      let userProfile = null;

      try {
        [userOrders, userBehavior, userProfile] = await Promise.all([
          this.storage.getUserOrders(userId).catch(() => []),
          this.storage.getUserBehavior(userId, 100).catch(() => []),
          this.storage.getUser(userId).catch(() => null)
        ]);
      } catch (error) {
        console.warn('⚠️ Error fetching user data, using defaults:', error);
        userOrders = [];
        userBehavior = [];
        userProfile = null;
      }

      // Extract user preferences from purchase history
      const userPreferences = this.analyzeUserPreferences(userOrders, userBehavior);

      // Get current product context if provided
      let currentProduct = null;
      if (currentProductId) {
        try {
          currentProduct = await this.storage.getProduct(currentProductId);
        } catch (error) {
          console.warn('⚠️ Error fetching current product:', error);
        }
      }

      // Generate recommendations using multiple strategies with error handling
      const recommendationPromises = [
        this.getSimilarFlavorRecommendations(userPreferences, currentProduct).catch(() => []),
        this.getBrandLoyaltyRecommendations(userPreferences).catch(() => []),
        this.getPriceMatchRecommendations(userPreferences).catch(() => []),
        this.getTrendingRecommendations(userPreferences).catch(() => []),
        this.getAIPersonalizedRecommendations(userProfile, userPreferences, currentProduct).catch(() => [])
      ];

      const recommendations = await Promise.all(recommendationPromises);

      // Flatten and score all recommendations
      const allRecommendations = recommendations.flat();

      // If no recommendations found, return basic fallback
      if (allRecommendations.length === 0) {
        console.log('🔄 No recommendations found, using basic fallback');
        return this.getBasicFallbackRecommendations(limit);
      }

      // Remove duplicates and current product
      const uniqueRecommendations = this.deduplicateRecommendations(
        allRecommendations,
        currentProductId
      );

      // Sort by score and return top results
      return uniqueRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('❌ Recommendation system error:', error);
      // Return basic fallback recommendations
      return this.getBasicFallbackRecommendations(limit);
    }
  }

  /**
   * Basic fallback recommendations when everything else fails
   */
  private async getBasicFallbackRecommendations(limit: number): Promise<ProductRecommendation[]> {
    try {
      const allProducts = await this.storage.getAllProducts();
      if (!allProducts || allProducts.length === 0) {
        return [];
      }

      // Return random selection of available products
      const shuffled = allProducts.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit).map((product: any, index: number) => ({
        productId: product.id,
        product,
        score: 0.5 - (index * 0.1), // Decreasing scores
        reason: 'Popular product you might like',
        category: 'trending' as const
      }));
    } catch (error) {
      console.error('❌ Basic fallback recommendations error:', error);
      return [];
    }
  }

  /**
   * Analyze user preferences from purchase history
   */
  private analyzeUserPreferences(orders: any[], behavior: any[]) {
    const preferences = {
      favoriteCategories: new Map<string, number>(),
      favoriteBrands: new Map<string, number>(),
      flavorProfiles: new Map<string, number>(),
      priceRange: { min: 0, max: 0, avg: 0 },
      purchaseFrequency: new Map<string, number>(),
      totalSpent: 0,
      totalOrders: orders.length
    };

    let totalPrice = 0;
    let itemCount = 0;

    // Analyze purchase history
    orders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const product = item.products;
        if (!product) return;

        // Track categories
        if (product.category_id) {
          preferences.favoriteCategories.set(
            product.category_id,
            (preferences.favoriteCategories.get(product.category_id) || 0) + item.quantity
          );
        }

        // Track brands
        if (product.brand_id) {
          preferences.favoriteBrands.set(
            product.brand_id,
            (preferences.favoriteBrands.get(product.brand_id) || 0) + item.quantity
          );
        }

        // Track flavor profiles (extract from product name/description)
        this.extractFlavorProfiles(product).forEach(flavor => {
          preferences.flavorProfiles.set(
            flavor,
            (preferences.flavorProfiles.get(flavor) || 0) + 1
          );
        });

        // Track price data
        const price = parseFloat(product.price || 0);
        totalPrice += price * item.quantity;
        itemCount += item.quantity;

        preferences.totalSpent += price * item.quantity;
      });
    });

    // Calculate price preferences
    if (itemCount > 0) {
      preferences.priceRange.avg = totalPrice / itemCount;
      preferences.priceRange.min = preferences.priceRange.avg * 0.7;
      preferences.priceRange.max = preferences.priceRange.avg * 1.5;
    }

    return preferences;
  }

  /**
   * Extract flavor profiles from product name and description
   */
  private extractFlavorProfiles(product: any): string[] {
    const text = `${product.name || ''} ${product.description || ''}`.toLowerCase();
    
    const flavorKeywords = [
      // Fruit flavors
      'strawberry', 'blueberry', 'raspberry', 'cherry', 'apple', 'grape', 'orange', 'lemon', 'lime',
      'watermelon', 'mango', 'pineapple', 'peach', 'banana', 'kiwi', 'coconut',
      
      // Dessert flavors
      'vanilla', 'chocolate', 'caramel', 'cookies', 'cream', 'cake', 'pie', 'candy', 'mint',
      'menthol', 'ice', 'cool', 'fresh',
      
      // Tobacco flavors
      'tobacco', 'wood', 'oak', 'cedar', 'leather', 'earthy', 'nutty', 'spicy',
      
      // Cannabis flavors
      'diesel', 'kush', 'haze', 'skunk', 'pine', 'citrus', 'berry', 'cheese'
    ];

    return flavorKeywords.filter(flavor => text.includes(flavor));
  }

  /**
   * Get recommendations based on similar flavors
   */
  private async getSimilarFlavorRecommendations(
    preferences: any, 
    currentProduct: any
  ): Promise<ProductRecommendation[]> {
    const recommendations: ProductRecommendation[] = [];

    // Get top flavor preferences
    const topFlavors = Array.from(preferences.flavorProfiles.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([flavor]) => flavor);

    if (topFlavors.length === 0 && !currentProduct) return recommendations;

    // If we have a current product, use its flavors
    let searchFlavors = topFlavors;
    if (currentProduct) {
      searchFlavors = this.extractFlavorProfiles(currentProduct);
    }

    // Search for products with similar flavors
    const allProducts = await this.storage.getProducts();
    
    allProducts.forEach((product: any) => {
      const productFlavors = this.extractFlavorProfiles(product);
      const commonFlavors = searchFlavors.filter(flavor => 
        productFlavors.includes(flavor)
      );

      if (commonFlavors.length > 0) {
        const score = (commonFlavors.length / searchFlavors.length) * 0.8;
        recommendations.push({
          productId: product.id,
          product,
          score,
          reason: `Similar flavors: ${commonFlavors.join(', ')}`,
          category: 'similar_flavor'
        });
      }
    });

    return recommendations;
  }

  /**
   * Get recommendations based on brand loyalty
   */
  private async getBrandLoyaltyRecommendations(preferences: any): Promise<ProductRecommendation[]> {
    const recommendations: ProductRecommendation[] = [];

    // Get top brands
    const topBrands = Array.from(preferences.favoriteBrands.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([brandId]) => brandId);

    if (topBrands.length === 0) return recommendations;

    // Get products from favorite brands
    for (const brandId of topBrands) {
      const brandProducts = await this.storage.getProducts({ brandId });
      
      brandProducts.forEach((product: any) => {
        const brandPurchases = preferences.favoriteBrands.get(brandId) || 0;
        const score = Math.min(brandPurchases / 10, 0.7); // Cap at 0.7
        
        recommendations.push({
          productId: product.id,
          product,
          score,
          reason: `From your favorite brand`,
          category: 'same_brand'
        });
      });
    }

    return recommendations;
  }

  /**
   * Get recommendations based on price preferences
   */
  private async getPriceMatchRecommendations(preferences: any): Promise<ProductRecommendation[]> {
    const recommendations: ProductRecommendation[] = [];

    if (preferences.priceRange.avg === 0) return recommendations;

    const products = await this.storage.getProducts({
      priceMin: preferences.priceRange.min,
      priceMax: preferences.priceRange.max
    });

    products.forEach((product: any) => {
      const price = parseFloat(product.price || 0);
      const priceDiff = Math.abs(price - preferences.priceRange.avg);
      const score = Math.max(0, 0.6 - (priceDiff / preferences.priceRange.avg));

      if (score > 0.2) {
        recommendations.push({
          productId: product.id,
          product,
          score,
          reason: `In your preferred price range ($${price})`,
          category: 'price_match'
        });
      }
    });

    return recommendations;
  }

  /**
   * Get trending product recommendations
   */
  private async getTrendingRecommendations(preferences: any): Promise<ProductRecommendation[]> {
    const recommendations: ProductRecommendation[] = [];

    // Get featured/trending products
    const trendingProducts = await this.storage.getProducts({ featured: true });

    trendingProducts.forEach((product: any) => {
      recommendations.push({
        productId: product.id,
        product,
        score: 0.5, // Base trending score
        reason: 'Trending product',
        category: 'trending'
      });
    });

    return recommendations;
  }

  /**
   * Get AI-powered personalized recommendations
   */
  private async getAIPersonalizedRecommendations(
    userProfile: any,
    preferences: any,
    currentProduct: any
  ): Promise<ProductRecommendation[]> {
    // If AI is not available, return fallback recommendations
    if (!this.isAIEnabled || !this.openai) {
      console.log('🔄 Using fallback recommendations (AI unavailable)');
      return this.getFallbackPersonalizedRecommendations(preferences, currentProduct);
    }

    try {
      const prompt = this.buildAIRecommendationPrompt(userProfile, preferences, currentProduct);

      console.log('🤖 Requesting ChatGPT 4o recommendations...');
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o', // Updated to use GPT-4o
        messages: [
          {
            role: 'system',
            content: `You are an expert product recommendation AI for DOPE CITY, a premium smoke shop specializing in glass pieces, accessories, and CBD/hemp products.

Your expertise includes:
- Glass pipes, bongs, and water pipes (ROOR, etc.)
- Rolling papers and accessories (ZIG ZAG, etc.)
- Torches and lighters (ZENGAZ, etc.)
- CBD/hemp products (compliance-safe only)
- Premium smoking accessories

IMPORTANT: Never recommend nicotine or tobacco products - we only serve the main consumer site with CBD/hemp and glass accessories.

Analyze user preferences and suggest specific product types they would love based on their purchase history and current browsing context.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        console.warn('⚠️ Empty AI response, using fallback');
        return this.getFallbackPersonalizedRecommendations(preferences, currentProduct);
      }

      console.log('✅ ChatGPT 4o recommendations received');
      console.log('🤖 AI Response:', aiResponse.substring(0, 200) + '...');

      // Parse AI response and match to actual products
      const aiRecommendations = await this.parseAIRecommendations(aiResponse);

      // If AI parsing fails, use fallback
      if (aiRecommendations.length === 0) {
        console.warn('⚠️ AI parsing failed, using fallback');
        return this.getFallbackPersonalizedRecommendations(preferences, currentProduct);
      }

      return aiRecommendations;
    } catch (error) {
      console.error('❌ ChatGPT 4o recommendation error:', error);
      console.log('🔄 Falling back to rule-based recommendations');
      return this.getFallbackPersonalizedRecommendations(preferences, currentProduct);
    }
  }

  /**
   * Fallback personalized recommendations when AI is unavailable
   */
  private async getFallbackPersonalizedRecommendations(
    preferences: any,
    currentProduct: any
  ): Promise<ProductRecommendation[]> {
    try {
      const recommendations: ProductRecommendation[] = [];

      // Get all available products for fallback matching
      const allProducts = await this.storage.getAllProducts();
      if (!allProducts || allProducts.length === 0) return [];

      // Strategy 1: Recommend from favorite categories
      const topCategories = Array.from(preferences.favoriteCategories.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([cat]) => cat);

      for (const category of topCategories) {
        const categoryProducts = allProducts
          .filter((p: any) => p.category_id === category && p.id !== currentProduct?.id)
          .slice(0, 2);

        categoryProducts.forEach((product: any) => {
          recommendations.push({
            productId: product.id,
            product,
            score: 0.8,
            reason: `Popular in your favorite category: ${category}`,
            category: 'personalized'
          });
        });
      }

      // Strategy 2: Price-based recommendations
      if (preferences.priceRange.avg > 0) {
        const priceMatchProducts = allProducts
          .filter((p: any) => {
            const price = parseFloat(p.price || 0);
            return price >= preferences.priceRange.min &&
                   price <= preferences.priceRange.max &&
                   p.id !== currentProduct?.id;
          })
          .slice(0, 2);

        priceMatchProducts.forEach((product: any) => {
          recommendations.push({
            productId: product.id,
            product,
            score: 0.7,
            reason: `Matches your typical price range ($${preferences.priceRange.min.toFixed(0)}-$${preferences.priceRange.max.toFixed(0)})`,
            category: 'price_match'
          });
        });
      }

      // Strategy 3: Brand loyalty
      const topBrands = Array.from(preferences.favoriteBrands.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 1)
        .map(([brand]) => brand);

      for (const brand of topBrands) {
        const brandProducts = allProducts
          .filter((p: any) => p.brand_id === brand && p.id !== currentProduct?.id)
          .slice(0, 1);

        brandProducts.forEach((product: any) => {
          recommendations.push({
            productId: product.id,
            product,
            score: 0.9,
            reason: `From your favorite brand: ${brand}`,
            category: 'same_brand'
          });
        });
      }

      return recommendations.slice(0, 4); // Limit fallback recommendations
    } catch (error) {
      console.error('❌ Fallback recommendations error:', error);
      return [];
    }
  }

  private buildAIRecommendationPrompt(userProfile: any, preferences: any, currentProduct: any): string {
    const topCategories = Array.from(preferences.favoriteCategories.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat, count]) => `${cat} (${count} purchases)`);

    const topBrands = Array.from(preferences.favoriteBrands.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([brand, count]) => `${brand} (${count} purchases)`);

    const topFlavors = Array.from(preferences.flavorProfiles.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([flavor]) => flavor);

    return `
User Profile:
- Name: ${userProfile?.firstName || 'Customer'}
- Total Orders: ${preferences.totalOrders}
- Total Spent: $${preferences.totalSpent.toFixed(2)}
- Average Price Range: $${preferences.priceRange.min.toFixed(2)} - $${preferences.priceRange.max.toFixed(2)}

Purchase Preferences:
- Favorite Categories: ${topCategories.join(', ') || 'None yet'}
- Favorite Brands: ${topBrands.join(', ') || 'None yet'}
- Preferred Flavors: ${topFlavors.join(', ') || 'None identified'}

Current Context:
${currentProduct ? `Currently viewing: ${currentProduct.name} - ${currentProduct.description}` : 'Browsing products'}

Please suggest 3-5 product types or characteristics this customer would likely enjoy, focusing on:
1. Flavor profiles they haven't tried but would like
2. New products in their favorite categories
3. Premium versions of products they've purchased
4. Complementary products to their purchase history

Format as: "Product Type: Reason"
`;
  }

  private async parseAIRecommendations(aiResponse: string): Promise<ProductRecommendation[]> {
    try {
      const recommendations: ProductRecommendation[] = [];

      // Get all available products to match against
      const allProducts = await this.storage.getAllProducts();
      if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ No products available for AI matching');
        return [];
      }

      // Extract keywords from AI response for product matching
      const responseWords = aiResponse.toLowerCase().split(/\s+/);
      const keywords = [
        'glass', 'pipe', 'bong', 'water', 'roor', 'bowl', 'stem',
        'paper', 'rolling', 'zig', 'zag', 'hemp', 'organic',
        'torch', 'lighter', 'butane', 'zengaz', 'flame',
        'cbd', 'hemp', 'delta', 'thca', 'concentrate',
        'grinder', 'scale', 'storage', 'container',
        'premium', 'quality', 'artisan', 'handmade'
      ];

      // Find products that match AI-suggested categories
      const matchedProducts = allProducts.filter((product: any) => {
        const productText = `${product.name} ${product.description || ''}`.toLowerCase();

        // Check if product matches any keywords mentioned in AI response
        return keywords.some(keyword => {
          return responseWords.includes(keyword) && productText.includes(keyword);
        });
      });

      // If we found matches, create recommendations
      if (matchedProducts.length > 0) {
        matchedProducts.slice(0, 3).forEach((product: any, index: number) => {
          recommendations.push({
            productId: product.id,
            product,
            score: 0.9 - (index * 0.1), // High scores for AI matches
            reason: `AI-recommended based on your preferences`,
            category: 'personalized'
          });
        });

        console.log(`✅ AI matched ${recommendations.length} products`);
      } else {
        console.warn('⚠️ No product matches found for AI recommendations');
      }

      return recommendations;
    } catch (error) {
      console.error('❌ AI parsing error:', error);
      return [];
    }
  }

  /**
   * Remove duplicate recommendations and current product
   */
  private deduplicateRecommendations(
    recommendations: ProductRecommendation[], 
    currentProductId?: string
  ): ProductRecommendation[] {
    const seen = new Set<string>();
    const unique: ProductRecommendation[] = [];

    recommendations.forEach(rec => {
      if (rec.productId === currentProductId) return; // Skip current product
      if (seen.has(rec.productId)) return; // Skip duplicates
      
      seen.add(rec.productId);
      unique.push(rec);
    });

    return unique;
  }
}
