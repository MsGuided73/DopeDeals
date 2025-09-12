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
  private openai: OpenAI;
  private storage: any;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async initialize() {
    this.storage = await getStorage();
  }

  /**
   * Get personalized product recommendations for a user
   */
  async getPersonalizedRecommendations(context: RecommendationContext): Promise<ProductRecommendation[]> {
    await this.initialize();

    const { userId, currentProductId, limit = 8 } = context;

    // Get user's purchase history and behavior
    const [userOrders, userBehavior, userProfile] = await Promise.all([
      this.storage.getUserOrders(userId),
      this.storage.getUserBehavior(userId, 100),
      this.storage.getUser(userId)
    ]);

    // Extract user preferences from purchase history
    const userPreferences = this.analyzeUserPreferences(userOrders, userBehavior);

    // Get current product context if provided
    let currentProduct = null;
    if (currentProductId) {
      currentProduct = await this.storage.getProduct(currentProductId);
    }

    // Generate recommendations using multiple strategies
    const recommendations = await Promise.all([
      this.getSimilarFlavorRecommendations(userPreferences, currentProduct),
      this.getBrandLoyaltyRecommendations(userPreferences),
      this.getPriceMatchRecommendations(userPreferences),
      this.getTrendingRecommendations(userPreferences),
      this.getAIPersonalizedRecommendations(userProfile, userPreferences, currentProduct)
    ]);

    // Flatten and score all recommendations
    const allRecommendations = recommendations.flat();
    
    // Remove duplicates and current product
    const uniqueRecommendations = this.deduplicateRecommendations(
      allRecommendations, 
      currentProductId
    );

    // Sort by score and return top results
    return uniqueRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
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
    try {
      const prompt = this.buildAIRecommendationPrompt(userProfile, preferences, currentProduct);
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert product recommendation AI for a smoke shop. Analyze user preferences and suggest products they would love.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) return [];

      // Parse AI response and match to actual products
      return this.parseAIRecommendations(aiResponse);
    } catch (error) {
      console.error('AI recommendation error:', error);
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
    // This is a simplified parser - in production, you'd want more sophisticated parsing
    const recommendations: ProductRecommendation[] = [];
    
    // For now, return empty array - this would need product matching logic
    // based on the AI's text recommendations
    
    return recommendations;
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
