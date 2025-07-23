import { 
  users, products, categories, brands, orders, orderItems, 
  memberships, loyaltyPoints, cartItems, userBehavior, userPreferences,
  productSimilarity, recommendationCache, paymentMethods, paymentTransactions, kajaPayWebhookEvents,
  emojiUsage, userEmojiPreferences, emojiRecommendations, productEmojiAssociations,
  conciergeConversations, conciergeMessages, conciergeRecommendations, conciergeAnalytics,
  type User, type InsertUser, type Product, type InsertProduct, 
  type Category, type InsertCategory, type Brand, type InsertBrand,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Membership, type InsertMembership, type LoyaltyPoint, type InsertLoyaltyPoint,
  type CartItem, type InsertCartItem, type UserBehavior, type InsertUserBehavior,
  type UserPreferences, type InsertUserPreferences, type ProductSimilarity, 
  type InsertProductSimilarity, type RecommendationCache, type InsertRecommendationCache,
  type PaymentMethod, type InsertPaymentMethod, type PaymentTransaction, type InsertPaymentTransaction,
  type KajaPayWebhookEvent, type InsertKajaPayWebhookEvent,
  type EmojiUsage, type InsertEmojiUsage, type UserEmojiPreferences, type InsertUserEmojiPreferences,
  type EmojiRecommendations, type InsertEmojiRecommendations, type ProductEmojiAssociations, type InsertProductEmojiAssociations,
  type ConciergeConversation, type InsertConciergeConversation, type ConciergeMessage, type InsertConciergeMessage,
  type ConciergeRecommendation, type InsertConciergeRecommendation, type ConciergeAnalytics, type InsertConciergeAnalytics
} from "@shared/schema";

import {
  shipstationOrders, shipstationShipments, shipstationWebhooks, shipstationProducts, 
  shipstationWarehouses, shipstationSyncStatus,
  type ShipstationOrder, type InsertShipstationOrder, type ShipstationShipment, type InsertShipstationShipment,
  type ShipstationWebhook, type InsertShipstationWebhook, type ShipstationProduct, type InsertShipstationProduct,
  type ShipstationWarehouse, type InsertShipstationWarehouse, type ShipstationSyncStatus, type InsertShipstationSyncStatus
} from "@shared/shipstation-schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(filters?: {
    categoryId?: string;
    brandId?: string;
    material?: string;
    priceMin?: number;
    priceMax?: number;
    featured?: boolean;
    vipExclusive?: boolean;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Brands
  getBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // Orders
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Cart
  getUserCartItems(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  
  // Memberships
  getMemberships(): Promise<Membership[]>;
  
  // User Behavior & Preferences
  trackUserBehavior(behavior: InsertUserBehavior): Promise<UserBehavior>;
  getUserBehavior(userId: string, limit?: number): Promise<UserBehavior[]>;
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;
  
  // Recommendations
  getRecommendations(userId: string, type: 'trending' | 'personalized' | 'similar' | 'category_based', limit?: number): Promise<Product[]>;
  getProductSimilarity(productId: string, limit?: number): Promise<ProductSimilarity[]>;
  updateRecommendationCache(userId: string, type: string, productIds: string[], score?: number): Promise<void>;
  
  // Payment Methods
  getUserPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  getPaymentMethod(id: string): Promise<PaymentMethod | undefined>;
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: string): Promise<boolean>;
  
  // Payment Transactions
  getTransaction(id: string): Promise<PaymentTransaction | undefined>;
  createTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction>;
  updateTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined>;
  getUserTransactions(userId: string): Promise<PaymentTransaction[]>;
  getOrderTransactions(orderId: string): Promise<PaymentTransaction[]>;
  
  // Webhook Events
  createWebhookEvent(event: InsertKajaPayWebhookEvent): Promise<KajaPayWebhookEvent>;
  getUnprocessedWebhookEvents(): Promise<KajaPayWebhookEvent[]>;
  markWebhookEventProcessed(id: string): Promise<boolean>;
  
  // Emoji System
  createEmojiUsage(usage: InsertEmojiUsage): Promise<EmojiUsage>;
  getRecentEmojiUsage(userId: string, limit: number): Promise<EmojiUsage[]>;
  getAllEmojiUsage(userId: string): Promise<EmojiUsage[]>;
  getUserEmojiPreferences(userId: string): Promise<UserEmojiPreferences | undefined>;
  createUserEmojiPreferences(preferences: InsertUserEmojiPreferences): Promise<UserEmojiPreferences>;
  updateUserEmojiPreferences(userId: string, updates: Partial<UserEmojiPreferences>): Promise<UserEmojiPreferences | undefined>;
  createEmojiRecommendations(recommendations: InsertEmojiRecommendations): Promise<EmojiRecommendations>;
  getCachedEmojiRecommendations(userId: string, context: string, contextData: string): Promise<EmojiRecommendations | undefined>;
  markEmojiRecommendationUsed(userId: string, context: string, usedEmoji: string): Promise<boolean>;
  getProductEmojiAssociations(productId: string): Promise<Array<{emoji: string; emojiCode: string; usageCount: number; sentiment: string; associationStrength: number}>>;
  upsertProductEmojiAssociation(association: InsertProductEmojiAssociations): Promise<ProductEmojiAssociations>;

  // VIP Concierge
  createConciergeConversation(conversation: InsertConciergeConversation): Promise<ConciergeConversation>;
  getConciergeConversation(conversationId: string): Promise<ConciergeConversation | undefined>;
  updateConciergeConversation(conversationId: string, updates: Partial<InsertConciergeConversation>): Promise<ConciergeConversation | undefined>;
  createConciergeMessage(message: InsertConciergeMessage): Promise<ConciergeMessage>;
  getConciergeMessages(conversationId: string): Promise<ConciergeMessage[]>;
  createConciergeRecommendation(recommendation: InsertConciergeRecommendation): Promise<ConciergeRecommendation>;
  updateConciergeRecommendation(recommendationId: string, updates: Partial<InsertConciergeRecommendation>): Promise<ConciergeRecommendation | undefined>;
  createConciergeAnalytics(analytics: InsertConciergeAnalytics): Promise<ConciergeAnalytics>;
  getConciergeAnalytics(conversationId?: string, dateRange?: { start: Date; end: Date }): Promise<ConciergeAnalytics[]>;

  // ShipStation Integration
  insertShipstationOrder(order: InsertShipstationOrder): Promise<ShipstationOrder>;
  getShipstationOrderByOrderId(orderId: string): Promise<ShipstationOrder | undefined>;
  getShipstationOrderByShipstationId(shipstationOrderId: string): Promise<ShipstationOrder | undefined>;
  updateShipstationOrder(id: string, updates: Partial<InsertShipstationOrder>): Promise<ShipstationOrder | undefined>;
  
  insertShipstationShipment(shipment: InsertShipstationShipment): Promise<ShipstationShipment>;
  getShipstationShipment(id: string): Promise<ShipstationShipment | undefined>;
  updateShipstationShipment(id: string, updates: Partial<InsertShipstationShipment>): Promise<ShipstationShipment | undefined>;
  
  insertShipstationWebhook(webhook: InsertShipstationWebhook): Promise<ShipstationWebhook>;
  getUnprocessedShipstationWebhooks(): Promise<ShipstationWebhook[]>;
  markShipstationWebhookProcessed(id: string): Promise<boolean>;
  
  insertShipstationProduct(product: InsertShipstationProduct): Promise<ShipstationProduct>;
  getShipstationProductByProductId(productId: string): Promise<ShipstationProduct | undefined>;
  getShipstationProductBySku(sku: string): Promise<ShipstationProduct | undefined>;
  updateShipstationProduct(id: string, updates: Partial<InsertShipstationProduct>): Promise<ShipstationProduct | undefined>;
  
  insertShipstationWarehouse(warehouse: InsertShipstationWarehouse): Promise<ShipstationWarehouse>;
  getShipstationWarehouses(): Promise<ShipstationWarehouse[]>;
  updateShipstationWarehouse(id: string, updates: Partial<InsertShipstationWarehouse>): Promise<ShipstationWarehouse | undefined>;
  
  insertShipstationSyncStatus(status: InsertShipstationSyncStatus): Promise<ShipstationSyncStatus>;
  getLatestShipstationSyncStatus(syncType?: string): Promise<ShipstationSyncStatus | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private categories: Map<string, Category> = new Map();
  private brands: Map<string, Brand> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();
  private memberships: Map<string, Membership> = new Map();
  private loyaltyPoints: Map<string, LoyaltyPoint> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private userBehaviors: Map<string, UserBehavior> = new Map();
  private userPreferences: Map<string, UserPreferences> = new Map();
  private productSimilarities: Map<string, ProductSimilarity> = new Map();
  private recommendationCaches: Map<string, RecommendationCache> = new Map();
  private paymentMethods: Map<string, PaymentMethod> = new Map();
  private paymentTransactions: Map<string, PaymentTransaction> = new Map();
  private webhookEvents: Map<string, KajaPayWebhookEvent> = new Map();
  private emojiUsages: Map<string, EmojiUsage> = new Map();
  private userEmojiPrefs: Map<string, UserEmojiPreferences> = new Map();
  private emojiRecs: Map<string, EmojiRecommendations> = new Map();
  private productEmojiAssocs: Map<string, ProductEmojiAssociations> = new Map();
  private conciergeConversations: Map<string, ConciergeConversation> = new Map();
  private conciergeMessages: Map<string, ConciergeMessage> = new Map();
  private conciergeRecommendations: Map<string, ConciergeRecommendation> = new Map();
  private conciergeAnalytics: Map<string, ConciergeAnalytics> = new Map();
  
  // ShipStation storage
  private shipstationOrders: Map<string, ShipstationOrder> = new Map();
  private shipstationShipments: Map<string, ShipstationShipment> = new Map();
  private shipstationWebhooks: Map<string, ShipstationWebhook> = new Map();
  private shipstationProducts: Map<string, ShipstationProduct> = new Map();
  private shipstationWarehouses: Map<string, ShipstationWarehouse> = new Map();
  private shipstationSyncStatuses: Map<string, ShipstationSyncStatus> = new Map();

  constructor() {
    this.initializeData();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private initializeData() {
    // Initialize categories
    const glassPipes: Category = {
      id: this.generateId(),
      name: "Glass Pipes",
      description: "Handcrafted artisan glass pipes",
      slug: "glass-pipes",
      createdAt: new Date(),
    };
    
    const dabRigs: Category = {
      id: this.generateId(),
      name: "Dab Rigs",
      description: "Premium concentrate devices",
      slug: "dab-rigs",
      createdAt: new Date(),
    };
    
    const glassBongs: Category = {
      id: this.generateId(),
      name: "Glass Bongs",
      description: "Premium glass water pipes",
      slug: "glass-bongs",
      createdAt: new Date(),
    };
    
    const accessories: Category = {
      id: this.generateId(),
      name: "Accessories",
      description: "Complete your collection",
      slug: "accessories",
      createdAt: new Date(),
    };

    this.categories.set(glassPipes.id, glassPipes);
    this.categories.set(dabRigs.id, dabRigs);
    this.categories.set(glassBongs.id, glassBongs);
    this.categories.set(accessories.id, accessories);

    // Initialize brands
    const vipSignature: Brand = {
      id: this.generateId(),
      name: "VIP Signature",
      description: "Premium VIP branded products",
      slug: "vip-signature",
      createdAt: new Date(),
    };
    
    const royalGlass: Brand = {
      id: this.generateId(),
      name: "Royal Glass",
      description: "Luxury glass craftsmanship",
      slug: "royal-glass",
      createdAt: new Date(),
    };
    
    const crownCollection: Brand = {
      id: this.generateId(),
      name: "Crown Collection",
      description: "Elite smoking accessories",
      slug: "crown-collection",
      createdAt: new Date(),
    };

    const platinumWorks: Brand = {
      id: this.generateId(),
      name: "Platinum Works",
      description: "High-end precision accessories",
      slug: "platinum-works",
      createdAt: new Date(),
    };

    const goldStandard: Brand = {
      id: this.generateId(),
      name: "Gold Standard",
      description: "Premium quality guarantee",
      slug: "gold-standard",
      createdAt: new Date(),
    };

    this.brands.set(vipSignature.id, vipSignature);
    this.brands.set(royalGlass.id, royalGlass);
    this.brands.set(crownCollection.id, crownCollection);
    this.brands.set(platinumWorks.id, platinumWorks);
    this.brands.set(goldStandard.id, goldStandard);

    // Initialize products with comprehensive mock data
    const products: InsertProduct[] = [
      // Glass Pipes
      {
        name: "Royal Crown Glass Pipe",
        description: "Premium borosilicate glass with gold accents. Features a deep bowl and comfortable grip for the ultimate smoking experience.",
        price: "89.99",
        sku: "RCG-001",
        categoryId: glassPipes.id,
        brandId: royalGlass.id,
        imageUrl: "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: true,
      },
      {
        name: "VIP Signature Spoon Pipe",
        description: "Classic spoon design with VIP branding. Handcrafted from premium glass with a smooth finish.",
        price: "45.99",
        sku: "VIP-101",
        categoryId: glassPipes.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "Crown Artisan Sherlock Pipe",
        description: "Elegant curved design inspired by classic sherlock pipes. Features intricate glass work and premium materials.",
        price: "125.99",
        sku: "CAS-201",
        categoryId: glassPipes.id,
        brandId: crownCollection.id,
        imageUrl: "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: false,
        vipExclusive: true,
      },
      {
        name: "Royal Fumed Glass Chillum",
        description: "Traditional chillum design with fumed glass coloring. Compact and portable for on-the-go use.",
        price: "29.99",
        sku: "RFG-301",
        categoryId: glassPipes.id,
        brandId: royalGlass.id,
        imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Fumed Glass",
        inStock: true,
        featured: false,
        vipExclusive: false,
      },
      
      // Dab Rigs
      {
        name: "VIP Imperial Dab Rig",
        description: "Professional grade with multi-chamber filtration system. Provides smooth, cool smoke with superior filtration.",
        price: "149.99",
        sku: "VIP-002",
        categoryId: dabRigs.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "Crown Beaker Base Dab Rig",
        description: "Classic beaker design with thick glass construction. Features ice catcher and removable downstem.",
        price: "89.99",
        sku: "CBB-401",
        categoryId: dabRigs.id,
        brandId: crownCollection.id,
        imageUrl: "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "Royal Percolator Dab Rig",
        description: "Advanced percolator system for maximum filtration. Tree perc design with 12 arms for smooth hits.",
        price: "199.99",
        sku: "RPW-501",
        categoryId: dabRigs.id,
        brandId: royalGlass.id,
        imageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: true,
      },
      {
        name: "VIP Recycler Dab Rig",
        description: "Scientific glass recycler design for concentrates. Features internal recycling chamber and quartz banger.",
        price: "249.99",
        sku: "VRD-601",
        categoryId: dabRigs.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Scientific Glass",
        inStock: false,
        featured: true,
        vipExclusive: true,
      },
      
      // Glass Bongs
      {
        name: "Crown Elite Glass Bong",
        description: "Premium thick glass construction with advanced filtration. Features ice catcher and smooth draws.",
        price: "249.99",
        sku: "CE-003",
        categoryId: glassBongs.id,
        brandId: crownCollection.id,
        imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "VIP Portable Glass Bong",
        description: "Compact design for travel use. High-quality glass with efficient water filtration system.",
        price: "129.99",
        sku: "VPV-701",
        categoryId: glassBongs.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "Royal Desktop Glass Bong",
        description: "Professional desktop bong with precision glass work. Includes multiple percolators and premium design.",
        price: "399.99",
        sku: "RDV-801",
        categoryId: glassBongs.id,
        brandId: royalGlass.id,
        imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Metal",
        inStock: true,
        featured: false,
        vipExclusive: true,
      },
      
      // Accessories
      {
        name: "VIP Platinum Accessory Set",
        description: "Complete luxury smoking kit with storage case. Includes grinder, papers, tips, and premium tools.",
        price: "129.99",
        sku: "VIP-004",
        categoryId: accessories.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Metal",
        inStock: true,
        featured: false,
        vipExclusive: false,
      },
      {
        name: "Crown Gold Luxury Lighter",
        description: "Premium metal construction with gold finish. Windproof flame with adjustable settings.",
        price: "79.99",
        sku: "CGL-006",
        categoryId: accessories.id,
        brandId: crownCollection.id,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Metal",
        inStock: true,
        featured: false,
        vipExclusive: true,
      },
      {
        name: "Royal Herb Grinder",
        description: "4-piece aluminum grinder with diamond teeth. Includes kief catcher and magnetic closure.",
        price: "39.99",
        sku: "RHG-901",
        categoryId: accessories.id,
        brandId: royalGlass.id,
        imageUrl: "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Aluminum",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "VIP Rolling Tray Set",
        description: "Premium rolling tray with magnetic storage compartments. Includes papers, tips, and cleaning tools.",
        price: "49.99",
        sku: "VRT-1001",
        categoryId: accessories.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Metal",
        inStock: true,
        featured: false,
        vipExclusive: false,
      },
      {
        name: "Crown Cleaning Kit",
        description: "Professional cleaning kit with brushes, solutions, and cotton swabs. Keep your pieces pristine.",
        price: "24.99",
        sku: "CCK-1101",
        categoryId: accessories.id,
        brandId: crownCollection.id,
        imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Plastic",
        inStock: true,
        featured: false,
        vipExclusive: false,
      },
      {
        name: "Royal Storage Box",
        description: "Luxury wooden storage box with velvet lining. Discrete design with lock and key security.",
        price: "89.99",
        sku: "RSB-1201",
        categoryId: accessories.id,
        brandId: royalGlass.id,
        imageUrl: "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Wood",
        inStock: true,
        featured: true,
        vipExclusive: true,
      },
    ];

    products.forEach(product => {
      const fullProduct: Product = {
        ...product,
        id: this.generateId(),
        createdAt: new Date(),
        categoryId: product.categoryId || null,
        brandId: product.brandId || null,
        description: product.description || null,
        imageUrl: product.imageUrl || null,
        material: product.material || null,
        inStock: product.inStock ?? true,
        featured: product.featured ?? false,
        vipExclusive: product.vipExclusive ?? false,
      };
      this.products.set(fullProduct.id, fullProduct);
    });

    // Initialize memberships
    const vipMembership: Membership = {
      id: this.generateId(),
      tierName: "VIP Club",
      monthlyPrice: "19.99",
      benefits: ["Early Access", "Exclusive Rewards", "Free Shipping", "Priority Support"],
      createdAt: new Date(),
    };

    this.memberships.set(vipMembership.id, vipMembership);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.generateId(),
      createdAt: new Date(),
      fullName: insertUser.fullName || null,
      membershipTierId: insertUser.membershipTierId || null,
      ageVerificationStatus: insertUser.ageVerificationStatus || "not_verified",
      lastVerificationCheck: insertUser.lastVerificationCheck || null,
    };
    this.users.set(user.id, user);
    return user;
  }

  async getProducts(filters?: {
    categoryId?: string;
    brandId?: string;
    material?: string;
    priceMin?: number;
    priceMax?: number;
    featured?: boolean;
    vipExclusive?: boolean;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.categoryId) {
        products = products.filter(p => p.categoryId === filters.categoryId);
      }
      if (filters.brandId) {
        products = products.filter(p => p.brandId === filters.brandId);
      }
      if (filters.material) {
        products = products.filter(p => p.material === filters.material);
      }
      if (filters.priceMin !== undefined) {
        products = products.filter(p => parseFloat(p.price) >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        products = products.filter(p => parseFloat(p.price) <= filters.priceMax!);
      }
      if (filters.featured !== undefined) {
        products = products.filter(p => p.featured === filters.featured);
      }
      if (filters.vipExclusive !== undefined) {
        products = products.filter(p => p.vipExclusive === filters.vipExclusive);
      }
    }

    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = {
      ...insertProduct,
      id: this.generateId(),
      createdAt: new Date(),
      description: insertProduct.description || null,
      categoryId: insertProduct.categoryId || null,
      brandId: insertProduct.brandId || null,
      imageUrl: insertProduct.imageUrl || null,
      material: insertProduct.material || null,
      inStock: insertProduct.inStock ?? true,
      featured: insertProduct.featured ?? false,
      vipExclusive: insertProduct.vipExclusive ?? false,
    };
    this.products.set(product.id, product);
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      ...insertCategory,
      id: this.generateId(),
      createdAt: new Date(),
      description: insertCategory.description || null,
    };
    this.categories.set(category.id, category);
    return category;
  }

  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const brand: Brand = {
      ...insertBrand,
      id: this.generateId(),
      createdAt: new Date(),
      description: insertBrand.description || null,
    };
    this.brands.set(brand.id, brand);
    return brand;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      id: this.generateId(),
      createdAt: new Date(),
      userId: insertOrder.userId || null,
      status: insertOrder.status || "processing",
      shippingAddress: insertOrder.shippingAddress || null,
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getUserCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const cartItem: CartItem = {
      ...insertCartItem,
      id: this.generateId(),
      createdAt: new Date(),
      userId: insertCartItem.userId || null,
      productId: insertCartItem.productId || null,
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      cartItem.quantity = quantity;
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const userItems = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    userItems.forEach(([id, _]) => this.cartItems.delete(id));
    return true;
  }

  async getMemberships(): Promise<Membership[]> {
    return Array.from(this.memberships.values());
  }

  // User Behavior & Preferences
  async trackUserBehavior(insertBehavior: InsertUserBehavior): Promise<UserBehavior> {
    const behavior: UserBehavior = {
      ...insertBehavior,
      id: this.generateId(),
      createdAt: new Date(),
      userId: insertBehavior.userId || null,
      productId: insertBehavior.productId || null,
      sessionId: insertBehavior.sessionId || null,
      metadata: insertBehavior.metadata || null,
    };
    this.userBehaviors.set(behavior.id, behavior);
    
    // Update user preferences based on behavior
    if (behavior.userId && behavior.productId) {
      await this.updateUserPreferencesFromBehavior(behavior);
    }
    
    return behavior;
  }

  async getUserBehavior(userId: string, limit: number = 50): Promise<UserBehavior[]> {
    const behaviors = Array.from(this.userBehaviors.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return behaviors;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(p => p.userId === userId);
  }

  async updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(userId);
    const userPrefs: UserPreferences = existing ? {
      ...existing,
      ...preferences,
      updatedAt: new Date(),
    } : {
      id: this.generateId(),
      userId,
      preferredCategories: preferences.preferredCategories || [],
      preferredBrands: preferences.preferredBrands || [],
      preferredMaterials: preferences.preferredMaterials || [],
      priceRangeMin: preferences.priceRangeMin || null,
      priceRangeMax: preferences.priceRangeMax || null,
      vipProductsOnly: preferences.vipProductsOnly || false,
      updatedAt: new Date(),
    };
    this.userPreferences.set(userPrefs.id, userPrefs);
    return userPrefs;
  }

  // Recommendations
  async getRecommendations(userId: string, type: 'trending' | 'personalized' | 'similar' | 'category_based', limit: number = 8): Promise<Product[]> {
    // Check cache first
    const cached = this.getFromRecommendationCache(userId, type);
    if (cached.length > 0) {
      return cached.slice(0, limit);
    }

    let recommendations: Product[] = [];
    
    switch (type) {
      case 'trending':
        recommendations = await this.getTrendingProducts(limit);
        break;
      case 'personalized':
        recommendations = await this.getPersonalizedRecommendations(userId, limit);
        break;
      case 'similar':
        recommendations = await this.getSimilarProducts(userId, limit);
        break;
      case 'category_based':
        recommendations = await this.getCategoryBasedRecommendations(userId, limit);
        break;
    }

    // Cache the results
    if (recommendations.length > 0) {
      await this.updateRecommendationCache(userId, type, recommendations.map(p => p.id));
    }

    return recommendations;
  }

  async getProductSimilarity(productId: string, limit: number = 10): Promise<ProductSimilarity[]> {
    return Array.from(this.productSimilarities.values())
      .filter(s => s.productId1 === productId || s.productId2 === productId)
      .sort((a, b) => Number(b.similarityScore) - Number(a.similarityScore))
      .slice(0, limit);
  }

  async updateRecommendationCache(userId: string, type: string, productIds: string[], score?: number): Promise<void> {
    const cache: RecommendationCache = {
      id: this.generateId(),
      userId,
      recommendationType: type,
      productIds,
      score: score ? score.toString() : null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
    };
    this.recommendationCaches.set(cache.id, cache);
  }

  // Helper methods for recommendation algorithms
  private async updateUserPreferencesFromBehavior(behavior: UserBehavior): Promise<void> {
    if (!behavior.productId) return;
    
    const product = await this.getProduct(behavior.productId);
    if (!product) return;

    const preferences = await this.getUserPreferences(behavior.userId!) || {
      userId: behavior.userId!,
      preferredCategories: [],
      preferredBrands: [],
      preferredMaterials: [],
      vipProductsOnly: false,
    };

    // Update preferences based on product interaction
    if (product.categoryId && !preferences.preferredCategories?.includes(product.categoryId)) {
      preferences.preferredCategories = [...(preferences.preferredCategories || []), product.categoryId];
    }
    if (product.brandId && !preferences.preferredBrands?.includes(product.brandId)) {
      preferences.preferredBrands = [...(preferences.preferredBrands || []), product.brandId];
    }
    if (product.material && !preferences.preferredMaterials?.includes(product.material)) {
      preferences.preferredMaterials = [...(preferences.preferredMaterials || []), product.material];
    }

    await this.updateUserPreferences(behavior.userId!, preferences);
  }

  private async getTrendingProducts(limit: number): Promise<Product[]> {
    // Get products with most recent interactions
    const recentBehaviors = Array.from(this.userBehaviors.values())
      .filter(b => b.createdAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      .filter(b => ['view', 'add_to_cart', 'purchase'].includes(b.action));

    const productCounts = new Map<string, number>();
    recentBehaviors.forEach(b => {
      if (b.productId) {
        productCounts.set(b.productId, (productCounts.get(b.productId) || 0) + 1);
      }
    });

    const trendingProductIds = Array.from(productCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    const products = await Promise.all(
      trendingProductIds.map(id => this.getProduct(id))
    );

    return products.filter(p => p !== undefined) as Product[];
  }

  private async getPersonalizedRecommendations(userId: string, limit: number): Promise<Product[]> {
    const preferences = await this.getUserPreferences(userId);
    const userBehavior = await this.getUserBehavior(userId, 100);
    
    const products = await this.getProducts();
    const scoredProducts = products.map(product => ({
      product,
      score: this.calculatePersonalizationScore(product, preferences, userBehavior)
    }));

    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(sp => sp.product);
  }

  private async getSimilarProducts(userId: string, limit: number): Promise<Product[]> {
    const userBehavior = await this.getUserBehavior(userId, 20);
    const viewedProducts = userBehavior
      .filter(b => b.action === 'view' && b.productId)
      .map(b => b.productId!);

    if (viewedProducts.length === 0) {
      return this.getTrendingProducts(limit);
    }

    const similarProducts = new Map<string, number>();
    
    for (const productId of viewedProducts) {
      const similarities = await this.getProductSimilarity(productId, 10);
      similarities.forEach(sim => {
        const relatedProductId = sim.productId1 === productId ? sim.productId2 : sim.productId1;
        if (relatedProductId && !viewedProducts.includes(relatedProductId)) {
          similarProducts.set(relatedProductId, 
            (similarProducts.get(relatedProductId) || 0) + Number(sim.similarityScore)
          );
        }
      });
    }

    const sortedSimilar = Array.from(similarProducts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    const products = await Promise.all(
      sortedSimilar.map(([id]) => this.getProduct(id))
    );

    return products.filter(p => p !== undefined) as Product[];
  }

  private async getCategoryBasedRecommendations(userId: string, limit: number): Promise<Product[]> {
    const preferences = await this.getUserPreferences(userId);
    const userBehavior = await this.getUserBehavior(userId, 50);
    
    // Get most interacted categories
    const categoryInteractions = new Map<string, number>();
    userBehavior.forEach(b => {
      if (b.productId) {
        const product = this.products.get(b.productId);
        if (product?.categoryId) {
          categoryInteractions.set(product.categoryId, 
            (categoryInteractions.get(product.categoryId) || 0) + 1
          );
        }
      }
    });

    const topCategories = Array.from(categoryInteractions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([categoryId]) => categoryId);

    // Add preferred categories
    if (preferences?.preferredCategories) {
      topCategories.push(...preferences.preferredCategories);
    }

    const products = await this.getProducts({
      categoryId: topCategories[0] // Focus on top category
    });

    return products.slice(0, limit);
  }

  private calculatePersonalizationScore(product: Product, preferences?: UserPreferences, userBehavior?: UserBehavior[]): number {
    let score = 0;

    // Category preference
    if (preferences?.preferredCategories?.includes(product.categoryId || '')) {
      score += 3;
    }

    // Brand preference
    if (preferences?.preferredBrands?.includes(product.brandId || '')) {
      score += 2;
    }

    // Material preference
    if (preferences?.preferredMaterials?.includes(product.material || '')) {
      score += 1;
    }

    // Price range preference
    if (preferences?.priceRangeMin && preferences?.priceRangeMax) {
      const price = Number(product.price);
      const minPrice = Number(preferences.priceRangeMin);
      const maxPrice = Number(preferences.priceRangeMax);
      if (price >= minPrice && price <= maxPrice) {
        score += 2;
      }
    }

    // VIP preference
    if (preferences?.vipProductsOnly && product.vipExclusive) {
      score += 1;
    }

    // Featured products bonus
    if (product.featured) {
      score += 1;
    }

    // Recency bonus for newer products
    const daysSinceCreated = (Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated < 30) {
      score += 0.5;
    }

    return score;
  }

  private getFromRecommendationCache(userId: string, type: string): Product[] {
    const cache = Array.from(this.recommendationCaches.values())
      .find(c => c.userId === userId && c.recommendationType === type && c.expiresAt > new Date());
    
    if (!cache) return [];

    const products = cache.productIds
      .map(id => this.products.get(id))
      .filter(p => p !== undefined) as Product[];

    return products;
  }

  // Payment Methods
  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values())
      .filter(pm => pm.userId === userId);
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod | undefined> {
    return this.paymentMethods.get(id);
  }

  async createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const pm: PaymentMethod = {
      id: this.generateId(),
      ...paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.paymentMethods.set(pm.id, pm);
    return pm;
  }

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | undefined> {
    const existing = this.paymentMethods.get(id);
    if (!existing) return undefined;

    const updated: PaymentMethod = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.paymentMethods.set(id, updated);
    return updated;
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    return this.paymentMethods.delete(id);
  }

  // Payment Transactions
  async getTransaction(id: string): Promise<PaymentTransaction | undefined> {
    return this.paymentTransactions.get(id);
  }

  async createTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const tx: PaymentTransaction = {
      id: this.generateId(),
      ...transaction,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.paymentTransactions.set(tx.id, tx);
    return tx;
  }

  async updateTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const existing = this.paymentTransactions.get(id);
    if (!existing) return undefined;

    const updated: PaymentTransaction = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.paymentTransactions.set(id, updated);
    return updated;
  }

  async getUserTransactions(userId: string): Promise<PaymentTransaction[]> {
    // Note: In a real implementation, you'd need to join with orders table to get userId
    // For now, this is a simplified implementation
    return Array.from(this.paymentTransactions.values());
  }

  async getOrderTransactions(orderId: string): Promise<PaymentTransaction[]> {
    return Array.from(this.paymentTransactions.values())
      .filter(tx => tx.orderId === orderId);
  }

  // Webhook Events
  async createWebhookEvent(event: InsertKajaPayWebhookEvent): Promise<KajaPayWebhookEvent> {
    const we: KajaPayWebhookEvent = {
      id: this.generateId(),
      ...event,
      createdAt: new Date(),
    };
    this.webhookEvents.set(we.id, we);
    return we;
  }

  async getUnprocessedWebhookEvents(): Promise<KajaPayWebhookEvent[]> {
    return Array.from(this.webhookEvents.values())
      .filter(we => !we.processed);
  }

  async markWebhookEventProcessed(id: string): Promise<boolean> {
    const event = this.webhookEvents.get(id);
    if (!event) return false;

    const updated: KajaPayWebhookEvent = {
      ...event,
      processed: true,
      processedAt: new Date(),
    };
    this.webhookEvents.set(id, updated);
    return true;
  }

  // Emoji System Implementation
  async createEmojiUsage(usage: InsertEmojiUsage): Promise<EmojiUsage> {
    const eu: EmojiUsage = {
      id: this.generateId(),
      ...usage,
      createdAt: new Date(),
    };
    this.emojiUsages.set(eu.id, eu);
    return eu;
  }

  async getRecentEmojiUsage(userId: string, limit: number): Promise<EmojiUsage[]> {
    return Array.from(this.emojiUsages.values())
      .filter(usage => usage.userId === userId)
      .sort((a, b) => b.lastUsed!.getTime() - a.lastUsed!.getTime())
      .slice(0, limit);
  }

  async getAllEmojiUsage(userId: string): Promise<EmojiUsage[]> {
    return Array.from(this.emojiUsages.values())
      .filter(usage => usage.userId === userId);
  }

  async getUserEmojiPreferences(userId: string): Promise<UserEmojiPreferences | undefined> {
    return Array.from(this.userEmojiPrefs.values())
      .find(prefs => prefs.userId === userId);
  }

  async createUserEmojiPreferences(preferences: InsertUserEmojiPreferences): Promise<UserEmojiPreferences> {
    const prefs: UserEmojiPreferences = {
      id: this.generateId(),
      ...preferences,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    this.userEmojiPrefs.set(prefs.id, prefs);
    return prefs;
  }

  async updateUserEmojiPreferences(userId: string, updates: Partial<UserEmojiPreferences>): Promise<UserEmojiPreferences | undefined> {
    const existing = Array.from(this.userEmojiPrefs.values())
      .find(prefs => prefs.userId === userId);
    
    if (!existing) return undefined;

    const updated: UserEmojiPreferences = {
      ...existing,
      ...updates,
      lastUpdated: new Date(),
    };
    this.userEmojiPrefs.set(existing.id, updated);
    return updated;
  }

  async createEmojiRecommendations(recommendations: InsertEmojiRecommendations): Promise<EmojiRecommendations> {
    const recs: EmojiRecommendations = {
      id: this.generateId(),
      ...recommendations,
      createdAt: new Date(),
    };
    this.emojiRecs.set(recs.id, recs);
    return recs;
  }

  async getCachedEmojiRecommendations(userId: string, context: string, contextData: string): Promise<EmojiRecommendations | undefined> {
    return Array.from(this.emojiRecs.values())
      .find(rec => rec.userId === userId && rec.context === context && rec.expiresAt > new Date());
  }

  async markEmojiRecommendationUsed(userId: string, context: string, usedEmoji: string): Promise<boolean> {
    const rec = Array.from(this.emojiRecs.values())
      .find(r => r.userId === userId && r.context === context);
    
    if (!rec) return false;

    const updated: EmojiRecommendations = {
      ...rec,
      used: true,
      usedEmojiId: usedEmoji,
    };
    this.emojiRecs.set(rec.id, updated);
    return true;
  }

  async getProductEmojiAssociations(productId: string): Promise<Array<{emoji: string; emojiCode: string; usageCount: number; sentiment: string; associationStrength: number}>> {
    return Array.from(this.productEmojiAssocs.values())
      .filter(assoc => assoc.productId === productId)
      .map(assoc => ({
        emoji: assoc.emoji,
        emojiCode: assoc.emojiCode,
        usageCount: assoc.usageCount,
        sentiment: assoc.sentiment || 'neutral',
        associationStrength: assoc.associationStrength
      }));
  }

  async upsertProductEmojiAssociation(association: InsertProductEmojiAssociations): Promise<ProductEmojiAssociations> {
    const existing = Array.from(this.productEmojiAssocs.values())
      .find(assoc => assoc.productId === association.productId && assoc.emoji === association.emoji);

    if (existing) {
      const updated: ProductEmojiAssociations = {
        ...existing,
        usageCount: existing.usageCount + 1,
        associationStrength: Math.min(100, existing.associationStrength + 1),
        lastUpdated: new Date(),
      };
      this.productEmojiAssocs.set(existing.id, updated);
      return updated;
    } else {
      const assoc: ProductEmojiAssociations = {
        id: this.generateId(),
        ...association,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
      this.productEmojiAssocs.set(assoc.id, assoc);
      return assoc;
    }
  }

  // VIP Concierge Methods
  async createConciergeConversation(conversation: InsertConciergeConversation): Promise<ConciergeConversation> {
    const newConversation: ConciergeConversation = {
      ...conversation,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActiveAt: new Date()
    };
    this.conciergeConversations.set(conversation.id, newConversation);
    return newConversation;
  }

  async getConciergeConversation(conversationId: string): Promise<ConciergeConversation | undefined> {
    return this.conciergeConversations.get(conversationId);
  }

  async updateConciergeConversation(conversationId: string, updates: Partial<InsertConciergeConversation>): Promise<ConciergeConversation | undefined> {
    const existing = this.conciergeConversations.get(conversationId);
    if (!existing) return undefined;

    const updated: ConciergeConversation = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.conciergeConversations.set(conversationId, updated);
    return updated;
  }

  async createConciergeMessage(message: InsertConciergeMessage): Promise<ConciergeMessage> {
    const newMessage: ConciergeMessage = {
      ...message,
      createdAt: new Date()
    };
    this.conciergeMessages.set(message.id, newMessage);
    return newMessage;
  }

  async getConciergeMessages(conversationId: string): Promise<ConciergeMessage[]> {
    return Array.from(this.conciergeMessages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createConciergeRecommendation(recommendation: InsertConciergeRecommendation): Promise<ConciergeRecommendation> {
    const newRecommendation: ConciergeRecommendation = {
      ...recommendation,
      createdAt: new Date()
    };
    this.conciergeRecommendations.set(recommendation.id, newRecommendation);
    return newRecommendation;
  }

  async updateConciergeRecommendation(recommendationId: string, updates: Partial<InsertConciergeRecommendation>): Promise<ConciergeRecommendation | undefined> {
    const existing = this.conciergeRecommendations.get(recommendationId);
    if (!existing) return undefined;

    const updated: ConciergeRecommendation = {
      ...existing,
      ...updates
    };
    this.conciergeRecommendations.set(recommendationId, updated);
    return updated;
  }

  async createConciergeAnalytics(analytics: InsertConciergeAnalytics): Promise<ConciergeAnalytics> {
    const newAnalytics: ConciergeAnalytics = {
      ...analytics,
      createdAt: new Date()
    };
    this.conciergeAnalytics.set(analytics.id, newAnalytics);
    return newAnalytics;
  }

  async getConciergeAnalytics(conversationId?: string, dateRange?: { start: Date; end: Date }): Promise<ConciergeAnalytics[]> {
    let analytics = Array.from(this.conciergeAnalytics.values());

    if (conversationId) {
      analytics = analytics.filter(a => a.conversationId === conversationId);
    }

    if (dateRange) {
      analytics = analytics.filter(a => 
        a.createdAt >= dateRange.start && a.createdAt <= dateRange.end
      );
    }

    return analytics.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  // ShipStation Integration Methods
  async insertShipstationOrder(order: InsertShipstationOrder): Promise<ShipstationOrder> {
    const id = this.generateId();
    const newOrder: ShipstationOrder = {
      id,
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncedAt: order.syncedAt || new Date()
    };
    this.shipstationOrders.set(id, newOrder);
    return newOrder;
  }

  async getShipstationOrderByOrderId(orderId: string): Promise<ShipstationOrder | undefined> {
    return Array.from(this.shipstationOrders.values()).find(order => order.orderId === orderId);
  }

  async getShipstationOrderByShipstationId(shipstationOrderId: string): Promise<ShipstationOrder | undefined> {
    return Array.from(this.shipstationOrders.values()).find(order => order.shipstationOrderId === shipstationOrderId);
  }

  async updateShipstationOrder(id: string, updates: Partial<InsertShipstationOrder>): Promise<ShipstationOrder | undefined> {
    const order = this.shipstationOrders.get(id);
    if (!order) return undefined;

    const updatedOrder: ShipstationOrder = {
      ...order,
      ...updates,
      id: order.id,
      updatedAt: new Date()
    };
    this.shipstationOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  async insertShipstationShipment(shipment: InsertShipstationShipment): Promise<ShipstationShipment> {
    const id = this.generateId();
    const newShipment: ShipstationShipment = {
      id,
      ...shipment,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.shipstationShipments.set(id, newShipment);
    return newShipment;
  }

  async getShipstationShipment(id: string): Promise<ShipstationShipment | undefined> {
    return this.shipstationShipments.get(id);
  }

  async updateShipstationShipment(id: string, updates: Partial<InsertShipstationShipment>): Promise<ShipstationShipment | undefined> {
    const shipment = this.shipstationShipments.get(id);
    if (!shipment) return undefined;

    const updatedShipment: ShipstationShipment = {
      ...shipment,
      ...updates,
      id: shipment.id,
      updatedAt: new Date()
    };
    this.shipstationShipments.set(id, updatedShipment);
    return updatedShipment;
  }

  async insertShipstationWebhook(webhook: InsertShipstationWebhook): Promise<ShipstationWebhook> {
    const id = this.generateId();
    const newWebhook: ShipstationWebhook = {
      id,
      ...webhook,
      createdAt: new Date()
    };
    this.shipstationWebhooks.set(id, newWebhook);
    return newWebhook;
  }

  async getUnprocessedShipstationWebhooks(): Promise<ShipstationWebhook[]> {
    return Array.from(this.shipstationWebhooks.values()).filter(webhook => !webhook.processed);
  }

  async markShipstationWebhookProcessed(id: string): Promise<boolean> {
    const webhook = this.shipstationWebhooks.get(id);
    if (!webhook) return false;

    const updatedWebhook: ShipstationWebhook = {
      ...webhook,
      processed: true,
      processedAt: new Date()
    };
    this.shipstationWebhooks.set(id, updatedWebhook);
    return true;
  }

  async insertShipstationProduct(product: InsertShipstationProduct): Promise<ShipstationProduct> {
    const id = this.generateId();
    const newProduct: ShipstationProduct = {
      id,
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncedAt: product.syncedAt || new Date()
    };
    this.shipstationProducts.set(id, newProduct);
    return newProduct;
  }

  async getShipstationProductByProductId(productId: string): Promise<ShipstationProduct | undefined> {
    return Array.from(this.shipstationProducts.values()).find(product => product.productId === productId);
  }

  async getShipstationProductBySku(sku: string): Promise<ShipstationProduct | undefined> {
    return Array.from(this.shipstationProducts.values()).find(product => product.sku === sku);
  }

  async updateShipstationProduct(id: string, updates: Partial<InsertShipstationProduct>): Promise<ShipstationProduct | undefined> {
    const product = this.shipstationProducts.get(id);
    if (!product) return undefined;

    const updatedProduct: ShipstationProduct = {
      ...product,
      ...updates,
      id: product.id,
      updatedAt: new Date()
    };
    this.shipstationProducts.set(id, updatedProduct);
    return updatedProduct;
  }

  async insertShipstationWarehouse(warehouse: InsertShipstationWarehouse): Promise<ShipstationWarehouse> {
    const id = this.generateId();
    const newWarehouse: ShipstationWarehouse = {
      id,
      ...warehouse,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncedAt: warehouse.syncedAt || new Date()
    };
    this.shipstationWarehouses.set(id, newWarehouse);
    return newWarehouse;
  }

  async getShipstationWarehouses(): Promise<ShipstationWarehouse[]> {
    return Array.from(this.shipstationWarehouses.values());
  }

  async updateShipstationWarehouse(id: string, updates: Partial<InsertShipstationWarehouse>): Promise<ShipstationWarehouse | undefined> {
    const warehouse = this.shipstationWarehouses.get(id);
    if (!warehouse) return undefined;

    const updatedWarehouse: ShipstationWarehouse = {
      ...warehouse,
      ...updates,
      id: warehouse.id,
      updatedAt: new Date()
    };
    this.shipstationWarehouses.set(id, updatedWarehouse);
    return updatedWarehouse;
  }

  async insertShipstationSyncStatus(status: InsertShipstationSyncStatus): Promise<ShipstationSyncStatus> {
    const id = this.generateId();
    const newStatus: ShipstationSyncStatus = {
      id,
      ...status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.shipstationSyncStatuses.set(id, newStatus);
    return newStatus;
  }

  async getLatestShipstationSyncStatus(syncType?: string): Promise<ShipstationSyncStatus | undefined> {
    const statuses = Array.from(this.shipstationSyncStatuses.values());
    
    let filtered = statuses;
    if (syncType) {
      filtered = statuses.filter(status => status.syncType === syncType);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }
}

// Revert to memory storage while troubleshooting database connection
export const storage = new MemStorage();
