import { 
  users, products, categories, brands, orders, orderItems, 
  memberships, loyaltyPoints, cartItems,
  type User, type InsertUser, type Product, type InsertProduct, 
  type Category, type InsertCategory, type Brand, type InsertBrand,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Membership, type InsertMembership, type LoyaltyPoint, type InsertLoyaltyPoint,
  type CartItem, type InsertCartItem
} from "@shared/schema";

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
    
    const waterPipes: Category = {
      id: this.generateId(),
      name: "Water Pipes",
      description: "Premium filtration systems",
      slug: "water-pipes",
      createdAt: new Date(),
    };
    
    const vaporizers: Category = {
      id: this.generateId(),
      name: "Vaporizers",
      description: "Advanced technology devices",
      slug: "vaporizers",
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
    this.categories.set(waterPipes.id, waterPipes);
    this.categories.set(vaporizers.id, vaporizers);
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
      
      // Water Pipes
      {
        name: "VIP Imperial Water Pipe",
        description: "Professional grade with multi-chamber filtration system. Provides smooth, cool smoke with superior filtration.",
        price: "149.99",
        sku: "VIP-002",
        categoryId: waterPipes.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "Crown Beaker Base Bong",
        description: "Classic beaker design with thick glass construction. Features ice catcher and removable downstem.",
        price: "89.99",
        sku: "CBB-401",
        categoryId: waterPipes.id,
        brandId: crownCollection.id,
        imageUrl: "https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Borosilicate Glass",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "Royal Percolator Water Pipe",
        description: "Advanced percolator system for maximum filtration. Tree perc design with 12 arms for smooth hits.",
        price: "199.99",
        sku: "RPW-501",
        categoryId: waterPipes.id,
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
        categoryId: waterPipes.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Scientific Glass",
        inStock: false,
        featured: true,
        vipExclusive: true,
      },
      
      // Vaporizers
      {
        name: "Crown Elite Vaporizer",
        description: "Advanced temperature control with premium build quality. Features digital display and precise heating.",
        price: "249.99",
        sku: "CE-003",
        categoryId: vaporizers.id,
        brandId: crownCollection.id,
        imageUrl: "https://images.unsplash.com/photo-1580407196238-dac33f57c410?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Metal",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "VIP Portable Vaporizer",
        description: "Compact design for on-the-go use. Long battery life and quick heat-up time with multiple temperature settings.",
        price: "129.99",
        sku: "VPV-701",
        categoryId: vaporizers.id,
        brandId: vipSignature.id,
        imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        material: "Metal",
        inStock: true,
        featured: true,
        vipExclusive: false,
      },
      {
        name: "Royal Desktop Vaporizer",
        description: "Professional desktop unit with precise temperature control. Includes whip and balloon attachment options.",
        price: "399.99",
        sku: "RDV-801",
        categoryId: vaporizers.id,
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
}

export const storage = new MemStorage();
