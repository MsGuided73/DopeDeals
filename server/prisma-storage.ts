import { PrismaClient } from '@prisma/client';
import type { User, Product, Category, Brand, Order, CartItem, InsertUser, InsertProduct, InsertCategory, InsertBrand, InsertOrder, InsertCartItem } from '@shared/schema';

class PrismaStorage {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  }

  async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('✅ Prisma connected to database');
    } catch (error) {
      console.error('❌ Prisma connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    return user as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    return user as User | undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData
    });
    return user as User;
  }

  // Products
  async getProducts(filters?: {
    categoryId?: string;
    brandId?: string;
    material?: string;
    priceMin?: number;
    priceMax?: number;
    featured?: boolean;
    vipExclusive?: boolean;
  }): Promise<Product[]> {
    const where: any = {};

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.brandId) where.brandId = filters.brandId;
    if (filters?.material) where.material = filters.material;
    if (filters?.featured !== undefined) where.featured = filters.featured;
    if (filters?.vipExclusive !== undefined) where.vipExclusive = filters.vipExclusive;
    
    if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
      where.price = {};
      if (filters.priceMin !== undefined) where.price.gte = filters.priceMin;
      if (filters.priceMax !== undefined) where.price.lte = filters.priceMax;
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        brand: true
      }
    });

    return products as Product[];
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true
      }
    });
    return product as Product | undefined;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const product = await this.prisma.product.create({
      data: productData,
      include: {
        category: true,
        brand: true
      }
    });
    return product as Product;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: productData,
      include: {
        category: true,
        brand: true
      }
    });
    return product as Product;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id }
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return categories as Category[];
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const category = await this.prisma.category.findUnique({
      where: { id }
    });
    return category as Category | undefined;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const category = await this.prisma.category.create({
      data: categoryData
    });
    return category as Category;
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany({
      orderBy: { name: 'asc' }
    });
    return brands as Brand[];
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    const brand = await this.prisma.brand.findUnique({
      where: { id }
    });
    return brand as Brand | undefined;
  }

  async createBrand(brandData: InsertBrand): Promise<Brand> {
    const brand = await this.prisma.brand.create({
      data: brandData
    });
    return brand as Brand;
  }

  // Cart Items
  async getCartItems(userId: string): Promise<CartItem[]> {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true
          }
        }
      }
    });
    return items as CartItem[];
  }

  async addToCart(cartData: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        userId: cartData.userId,
        productId: cartData.productId
      }
    });

    if (existingItem) {
      // Update quantity
      const updated = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + cartData.quantity,
          updatedAt: new Date()
        },
        include: {
          product: true
        }
      });
      return updated as CartItem;
    } else {
      // Create new cart item
      const item = await this.prisma.cartItem.create({
        data: cartData,
        include: {
          product: true
        }
      });
      return item as CartItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const item = await this.prisma.cartItem.update({
      where: { id },
      data: { 
        quantity,
        updatedAt: new Date()
      },
      include: {
        product: true
      }
    });
    return item as CartItem;
  }

  async removeFromCart(id: string): Promise<void> {
    await this.prisma.cartItem.delete({
      where: { id }
    });
  }

  async clearCart(userId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { userId }
    });
  }

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    const where = userId ? { userId } : {};
    const orders = await this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return orders as Order[];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: true
      }
    });
    return order as Order | undefined;
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const order = await this.prisma.order.create({
      data: orderData,
      include: {
        orderItems: true,
        user: true
      }
    });
    return order as Order;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Prisma health check failed:', error);
      return false;
    }
  }
}

export default PrismaStorage;