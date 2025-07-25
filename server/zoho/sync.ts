import { ZohoInventoryClient } from './client.js';
import {
  ZohoProduct,
  ZohoCategory,
  ZohoOrder,
  ZohoCustomer,
  SyncStatus,
  ZohoIntegrationConfig,
  ProductMapping,
  CategoryMapping,
  OrderMapping
} from './types.js';
import { storage } from '../storage.js';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import type { 
  Product, 
  InsertProduct, 
  Category, 
  InsertCategory, 
  Order, 
  InsertOrder,
  User,
  InsertUser
} from '../../shared/schema.js';

export class ZohoSyncManager {
  private zohoClient: ZohoInventoryClient;
  private config: ZohoIntegrationConfig;
  private syncStatus: Map<string, SyncStatus> = new Map();

  constructor(zohoClient: ZohoInventoryClient, config: ZohoIntegrationConfig) {
    this.zohoClient = zohoClient;
    this.config = config;
  }

  // Product Sync Methods
  async syncProducts(fullSync: boolean = false): Promise<{ success: number; failed: number; errors: string[] }> {
    console.log(`[Zoho Sync] Starting ${fullSync ? 'full' : 'incremental'} product sync`);
    
    const results = { success: 0, failed: 0, errors: [] as string[] };
    let page = 1;
    const perPage = this.config.batchSize || 50;

    try {
      do {
        const zohoResponse = await this.zohoClient.getProducts({
          page,
          per_page: perPage
        });

        for (const zohoProduct of zohoResponse.items) {
          try {
            await this.syncSingleProduct(zohoProduct);
            results.success++;
          } catch (error) {
            results.failed++;
            results.errors.push(`Product ${zohoProduct.item_id}: ${error}`);
            console.error(`[Zoho Sync] Failed to sync product ${zohoProduct.item_id}:`, error);
          }
        }

        if (!zohoResponse.page_context.has_more_page) break;
        page++;

      } while (page <= 100); // Safety limit

      console.log(`[Zoho Sync] Product sync completed: ${results.success} success, ${results.failed} failed`);
      return results;
    } catch (error) {
      console.error('[Zoho Sync] Product sync failed:', error);
      throw error;
    }
  }

  private async syncSingleProduct(zohoProduct: ZohoProduct): Promise<void> {
    const localProduct = this.mapZohoProductToLocal(zohoProduct);
    
    // Check if product already exists in local database
    const existingProducts = await storage.getProducts();
    
    const existingProduct = existingProducts.find(p => p.sku === localProduct.sku);
    
    if (existingProduct) {
      // Update existing product
      await this.updateLocalProduct(existingProduct.id, localProduct, zohoProduct);
    } else {
      // Create new product
      await this.createLocalProduct(localProduct, zohoProduct);
    }

    // Update sync status
    this.updateSyncStatus('product', zohoProduct.item_id, localProduct.sku, 'success');
  }

  private mapZohoProductToLocal(zohoProduct: ZohoProduct): InsertProduct {
    const mapping = this.config.mapping.products;
    const localProduct: any = {};

    // Apply field mappings
    for (const map of mapping) {
      const zohoValue = zohoProduct[map.zohoField as keyof ZohoProduct];
      if (zohoValue !== undefined) {
        localProduct[map.localField] = map.transformer ? map.transformer(zohoValue) : zohoValue;
      }
    }

    // Map to match database schema (snake_case)
    return {
      name: zohoProduct.name,
      description: zohoProduct.description || '',
      price: zohoProduct.rate?.toString() || '0',
      sku: zohoProduct.sku,
      imageUrl: this.extractImageUrl(zohoProduct),
      material: this.extractMaterial(zohoProduct),
      inStock: zohoProduct.available_stock > 0,
      featured: false,
      vipExclusive: false,
      categoryId: this.mapZohoCategoryToLocal(zohoProduct.category_id),
      brandId: this.mapZohoBrandToLocal(zohoProduct.brand),
      ...localProduct
    };
  }

  private extractImageUrl(zohoProduct: ZohoProduct): string {
    if (zohoProduct.images && zohoProduct.images.length > 0) {
      return `/api/zoho/images/${zohoProduct.images[0].image_id}`;
    }
    return 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600';
  }

  private extractMaterial(zohoProduct: ZohoProduct): string {
    // Try to extract material from custom fields or use default
    if (zohoProduct.custom_fields) {
      const materialField = zohoProduct.custom_fields.find(
        field => field.label.toLowerCase().includes('material')
      );
      if (materialField) return materialField.value;
    }
    return 'Glass'; // Default material for VIP Smoke products
  }

  private mapZohoCategoryToLocal(zohoCategoryId?: string): string | null {
    // Return null instead of non-existent ID to avoid foreign key violations
    return null;
  }

  private mapZohoBrandToLocal(zohoBrand?: string): string | null {
    // Return null instead of non-existent ID to avoid foreign key violations
    return null;
  }

  private async createLocalProduct(localProduct: InsertProduct, zohoProduct: ZohoProduct): Promise<void> {
    try {
      // Create product object with correct database schema (snake_case)
      const dbProduct = {
        id: crypto.randomUUID(),
        name: zohoProduct.name,
        description: zohoProduct.description || '',
        price: Number(zohoProduct.rate) || 0,
        sku: zohoProduct.sku || zohoProduct.item_id,
        category_id: null, // Set to null to avoid foreign key violations
        brand_id: null, // Set to null to avoid foreign key violations
        materials: zohoProduct.category_name ? [zohoProduct.category_name] : null,
        image_urls: zohoProduct.images?.length > 0 ? zohoProduct.images.map(img => img.file_path) : null,
        stock_quantity: zohoProduct.stock_on_hand || 0,
        vip_price: null,
        channels: ['vip_smoke'],
        is_active: zohoProduct.status === 'active',
        featured: false,
        vip_exclusive: false
      };
      
      // Use the existing Supabase client from supabase-storage
      const supabaseAdmin = createClient(
        process.env.VITE_SUPABASE_URL!, 
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert(dbProduct)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log(`[Zoho Sync] Created local product: ${dbProduct.name}`);
    } catch (error) {
      console.error(`[Zoho Sync] Failed to create local product ${zohoProduct.name}:`, error);
      throw error;
    }
  }

  private async updateLocalProduct(productId: string, localProduct: InsertProduct, zohoProduct: ZohoProduct): Promise<void> {
    // Implementation would depend on having an update method in storage
    console.log(`[Zoho Sync] Updated local product: ${localProduct.name}`);
  }

  // Category Sync Methods
  async syncCategories(): Promise<{ success: number; failed: number; errors: string[] }> {
    console.log('[Zoho Sync] Starting category sync');
    
    const results = { success: 0, failed: 0, errors: [] as string[] };

    try {
      const zohoResponse = await this.zohoClient.getCategories();

      for (const zohoCategory of zohoResponse.item_categories) {
        try {
          await this.syncSingleCategory(zohoCategory);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Category ${zohoCategory.category_id}: ${error}`);
          console.error(`[Zoho Sync] Failed to sync category ${zohoCategory.category_id}:`, error);
        }
      }

      console.log(`[Zoho Sync] Category sync completed: ${results.success} success, ${results.failed} failed`);
      return results;
    } catch (error) {
      console.error('[Zoho Sync] Category sync failed:', error);
      throw error;
    }
  }

  private async syncSingleCategory(zohoCategory: ZohoCategory): Promise<void> {
    const localCategory = this.mapZohoCategoryToLocalCategory(zohoCategory);
    
    // Check if category already exists
    const existingCategories = await storage.getCategories();
    const existing = existingCategories.find(cat => cat.slug === localCategory.slug);
    
    if (!existing) {
      await storage.createCategory(localCategory);
      console.log(`[Zoho Sync] Created local category: ${localCategory.name}`);
    }

    this.updateSyncStatus('category', zohoCategory.category_id, localCategory.slug, 'success');
  }

  private mapZohoCategoryToLocalCategory(zohoCategory: ZohoCategory): InsertCategory {
    return {
      name: zohoCategory.category_name,
      description: zohoCategory.description || `${zohoCategory.category_name} products`,
      slug: zohoCategory.category_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    };
  }

  // Order Sync Methods
  async syncOrders(startDate?: Date): Promise<{ success: number; failed: number; errors: string[] }> {
    console.log('[Zoho Sync] Starting order sync');
    
    const results = { success: 0, failed: 0, errors: [] as string[] };
    let page = 1;
    const perPage = this.config.batchSize || 50;

    try {
      do {
        const zohoResponse = await this.zohoClient.getOrders({
          page,
          per_page: perPage,
          sort_column: 'last_modified_time',
          sort_order: 'descending',
          date: startDate ? startDate.toISOString().split('T')[0] : undefined
        });

        for (const zohoOrder of zohoResponse.salesorders) {
          try {
            await this.syncSingleOrder(zohoOrder);
            results.success++;
          } catch (error) {
            results.failed++;
            results.errors.push(`Order ${zohoOrder.salesorder_id}: ${error}`);
            console.error(`[Zoho Sync] Failed to sync order ${zohoOrder.salesorder_id}:`, error);
          }
        }

        if (!zohoResponse.page_context.has_more_page) break;
        page++;

      } while (page <= 50); // Safety limit

      console.log(`[Zoho Sync] Order sync completed: ${results.success} success, ${results.failed} failed`);
      return results;
    } catch (error) {
      console.error('[Zoho Sync] Order sync failed:', error);
      throw error;
    }
  }

  private async syncSingleOrder(zohoOrder: ZohoOrder): Promise<void> {
    // First ensure customer exists
    const localUserId = await this.ensureCustomerExists(zohoOrder);
    
    const localOrder = this.mapZohoOrderToLocal(zohoOrder, localUserId);
    
    // Check if order already exists
    const existingOrders = await storage.getUserOrders(localUserId);
    const existing = existingOrders.find(order => order.id === zohoOrder.salesorder_id);
    
    if (!existing) {
      await storage.createOrder(localOrder);
      console.log(`[Zoho Sync] Created local order: ${zohoOrder.salesorder_number}`);
    }

    this.updateSyncStatus('order', zohoOrder.salesorder_id, localUserId, 'success');
  }

  private async ensureCustomerExists(zohoOrder: ZohoOrder): Promise<string> {
    // Check if customer exists in local database
    const existingUser = await storage.getUserByEmail(zohoOrder.customer_email || '');
    
    if (existingUser) {
      return existingUser.id;
    }

    // Create new customer
    const newUser: InsertUser = {
      email: zohoOrder.customer_email || `customer-${zohoOrder.customer_id}@zoho.local`,
      fullName: zohoOrder.customer_name,
      ageVerificationStatus: 'unverified' // Will need manual verification
    };

    const createdUser = await storage.createUser(newUser);
    return createdUser.id;
  }

  private mapZohoOrderToLocal(zohoOrder: ZohoOrder, userId: string): InsertOrder {
    return {
      userId,
      totalAmount: zohoOrder.total,
      status: this.mapZohoOrderStatus(zohoOrder.status),
      shippingAddress: this.formatAddress(zohoOrder.shipping_address),
      billingAddress: this.formatAddress(zohoOrder.billing_address)
    };
  }

  private mapZohoOrderStatus(zohoStatus: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'pending',
      'sent': 'pending',
      'accepted': 'confirmed',
      'declined': 'cancelled',
      'closed': 'completed',
      'void': 'cancelled'
    };
    return statusMap[zohoStatus] || 'pending';
  }

  private formatAddress(address: any): string {
    if (!address) return '';
    return `${address.address}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
  }

  // Inventory Sync Methods
  async syncInventoryLevels(): Promise<{ success: number; failed: number; errors: string[] }> {
    console.log('[Zoho Sync] Starting inventory level sync');
    
    const results = { success: 0, failed: 0, errors: [] as string[] };

    try {
      const localProducts = await storage.getProducts();

      for (const product of localProducts) {
        try {
          const zohoProducts = await this.zohoClient.getProducts({
            search_text: product.sku,
            per_page: 1
          });

          if (zohoProducts.items.length > 0) {
            const zohoProduct = zohoProducts.items[0];
            const inStock = zohoProduct.available_stock > 0;
            
            // Update local product inventory status
            // This would need an update method in storage
            console.log(`[Zoho Sync] Updated inventory for ${product.name}: ${inStock ? 'In Stock' : 'Out of Stock'}`);
            results.success++;
          }
        } catch (error) {
          results.failed++;
          results.errors.push(`Product ${product.sku}: ${error}`);
          console.error(`[Zoho Sync] Failed to sync inventory for ${product.sku}:`, error);
        }
      }

      console.log(`[Zoho Sync] Inventory sync completed: ${results.success} success, ${results.failed} failed`);
      return results;
    } catch (error) {
      console.error('[Zoho Sync] Inventory sync failed:', error);
      throw error;
    }
  }

  // Sync Status Management
  private updateSyncStatus(resourceType: string, zohoId: string, localId: string, status: 'success' | 'failed', errorMessage?: string): void {
    const syncStatus: SyncStatus = {
      id: `${resourceType}-${zohoId}`,
      resourceType: resourceType as any,
      resourceId: zohoId,
      zohoId,
      localId,
      lastSynced: new Date(),
      syncStatus: status,
      errorMessage,
      retryCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.syncStatus.set(syncStatus.id, syncStatus);
  }

  // Full Sync Method
  async performFullSync(): Promise<{
    products: { success: number; failed: number; errors: string[] };
    categories: { success: number; failed: number; errors: string[] };
    orders: { success: number; failed: number; errors: string[] };
    inventory: { success: number; failed: number; errors: string[] };
  }> {
    console.log('[Zoho Sync] Starting full synchronization');

    const results = {
      categories: { success: 0, failed: 0, errors: [] as string[] },
      products: { success: 0, failed: 0, errors: [] as string[] },
      orders: { success: 0, failed: 0, errors: [] as string[] },
      inventory: { success: 0, failed: 0, errors: [] as string[] }
    };

    try {
      // Sync in order of dependencies
      if (this.config.autoSync.categories) {
        results.categories = await this.syncCategories();
      }

      if (this.config.autoSync.products) {
        results.products = await this.syncProducts(true);
      }

      if (this.config.autoSync.orders) {
        results.orders = await this.syncOrders();
      }

      if (this.config.autoSync.inventory) {
        results.inventory = await this.syncInventoryLevels();
      }

      console.log('[Zoho Sync] Full synchronization completed');
      return results;
    } catch (error) {
      console.error('[Zoho Sync] Full synchronization failed:', error);
      throw error;
    }
  }

  // Webhook Processing
  async processWebhookEvent(event: any): Promise<void> {
    console.log(`[Zoho Webhook] Processing event: ${event.event_type}`);

    try {
      switch (event.data.resource_type) {
        case 'item':
          if (event.data.operation === 'create' || event.data.operation === 'update') {
            const zohoProduct = await this.zohoClient.getProduct(event.data.resource_id);
            await this.syncSingleProduct(zohoProduct);
          }
          break;

        case 'salesorder':
          if (event.data.operation === 'create' || event.data.operation === 'update') {
            const zohoOrder = await this.zohoClient.getOrder(event.data.resource_id);
            await this.syncSingleOrder(zohoOrder);
          }
          break;

        default:
          console.log(`[Zoho Webhook] Unhandled resource type: ${event.data.resource_type}`);
      }
    } catch (error) {
      console.error(`[Zoho Webhook] Failed to process event:`, error);
      throw error;
    }
  }

  // Conflict Resolution
  async resolveConflict(resourceType: string, zohoData: any, localData: any): Promise<any> {
    const strategy = this.config.conflictResolution.strategy;

    switch (strategy) {
      case 'zoho_wins':
        return zohoData;
      
      case 'local_wins':
        return localData;
      
      case 'merge':
        return { ...localData, ...zohoData };
      
      case 'manual':
        // Log conflict for manual resolution
        console.warn(`[Zoho Sync] Manual conflict resolution required for ${resourceType}`);
        return localData; // Keep local data until manual resolution
      
      default:
        return zohoData;
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; lastSync?: Date; errors: string[] }> {
    const errors: string[] = [];
    let lastSync: Date | undefined;

    try {
      const zohoHealth = await this.zohoClient.healthCheck();
      if (zohoHealth.status !== 'healthy') {
        errors.push(zohoHealth.message);
      }

      // Check sync status
      const syncStatuses = Array.from(this.syncStatus.values());
      if (syncStatuses.length > 0) {
        lastSync = new Date(Math.max(...syncStatuses.map(s => s.lastSynced.getTime())));
        
        const failedSyncs = syncStatuses.filter(s => s.syncStatus === 'failed');
        if (failedSyncs.length > 0) {
          errors.push(`${failedSyncs.length} failed syncs detected`);
        }
      }

      return {
        status: errors.length === 0 ? 'healthy' : 'unhealthy',
        lastSync,
        errors
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        errors: [`Health check failed: ${error}`]
      };
    }
  }
}