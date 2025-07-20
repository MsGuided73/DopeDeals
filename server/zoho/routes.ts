import { Express, Request, Response } from 'express';
import crypto from 'crypto';
import { ZohoInventoryClient, createZohoClient } from './client.js';
import { ZohoSyncManager } from './sync.js';
import { getZohoConfig, getDefaultZohoIntegrationConfig, validateZohoConfig, validateIntegrationConfig } from './config.js';
import { ZohoWebhookEvent } from './types.js';

let zohoClient: ZohoInventoryClient | null = null;
let syncManager: ZohoSyncManager | null = null;

// Initialize Zoho services
export function initializeZohoServices(): { success: boolean; error?: string } {
  try {
    const config = getZohoConfig();
    const validation = validateZohoConfig(config);
    
    if (!validation.valid) {
      console.warn('[Zoho] Configuration validation failed:', validation.errors);
      return { success: false, error: validation.errors.join(', ') };
    }

    zohoClient = createZohoClient(config);
    const integrationConfig = getDefaultZohoIntegrationConfig();
    syncManager = new ZohoSyncManager(zohoClient, integrationConfig);
    
    console.log('[Zoho] Services initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('[Zoho] Failed to initialize services:', error);
    return { success: false, error: String(error) };
  }
}

// Register Zoho API routes
export function registerZohoRoutes(app: Express): void {
  // Health check endpoint
  app.get('/api/zoho/health', async (req: Request, res: Response) => {
    try {
      if (!zohoClient || !syncManager) {
        return res.status(503).json({
          status: 'unhealthy',
          message: 'Zoho services not initialized'
        });
      }

      const clientHealth = await zohoClient.healthCheck();
      const syncHealth = await syncManager.healthCheck();

      res.json({
        status: clientHealth.status === 'healthy' && syncHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
        zoho: clientHealth,
        sync: syncHealth
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: String(error)
      });
    }
  });

  // Configuration endpoint
  app.get('/api/zoho/config', (req: Request, res: Response) => {
    const config = getDefaultZohoIntegrationConfig();
    
    // Remove sensitive information
    const sanitizedConfig = {
      enabled: config.enabled,
      syncInterval: config.syncInterval,
      batchSize: config.batchSize,
      autoSync: config.autoSync,
      conflictResolution: config.conflictResolution
    };

    res.json(sanitizedConfig);
  });

  // Test connection endpoint
  app.post('/api/zoho/test-connection', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({
          success: false,
          message: 'Zoho client not initialized'
        });
      }

      const isConnected = await zohoClient.testConnection();
      res.json({
        success: isConnected,
        message: isConnected ? 'Connection successful' : 'Connection failed'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  // Sync endpoints
  app.post('/api/zoho/sync/products', async (req: Request, res: Response) => {
    try {
      if (!syncManager) {
        return res.status(503).json({ error: 'Sync manager not initialized' });
      }

      const { fullSync = false } = req.body;
      const result = await syncManager.syncProducts(fullSync);
      
      res.json({
        success: true,
        message: `Product sync completed: ${result.success} success, ${result.failed} failed`,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  app.post('/api/zoho/sync/categories', async (req: Request, res: Response) => {
    try {
      if (!syncManager) {
        return res.status(503).json({ error: 'Sync manager not initialized' });
      }

      const result = await syncManager.syncCategories();
      
      res.json({
        success: true,
        message: `Category sync completed: ${result.success} success, ${result.failed} failed`,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  app.post('/api/zoho/sync/orders', async (req: Request, res: Response) => {
    try {
      if (!syncManager) {
        return res.status(503).json({ error: 'Sync manager not initialized' });
      }

      const { startDate } = req.body;
      const result = await syncManager.syncOrders(startDate ? new Date(startDate) : undefined);
      
      res.json({
        success: true,
        message: `Order sync completed: ${result.success} success, ${result.failed} failed`,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  app.post('/api/zoho/sync/inventory', async (req: Request, res: Response) => {
    try {
      if (!syncManager) {
        return res.status(503).json({ error: 'Sync manager not initialized' });
      }

      const result = await syncManager.syncInventoryLevels();
      
      res.json({
        success: true,
        message: `Inventory sync completed: ${result.success} success, ${result.failed} failed`,
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  app.post('/api/zoho/sync/full', async (req: Request, res: Response) => {
    try {
      if (!syncManager) {
        return res.status(503).json({ error: 'Sync manager not initialized' });
      }

      const result = await syncManager.performFullSync();
      
      res.json({
        success: true,
        message: 'Full sync completed',
        result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  // Webhook endpoint
  app.post('/api/zoho/webhook', async (req: Request, res: Response) => {
    try {
      if (!syncManager) {
        return res.status(503).json({ error: 'Sync manager not initialized' });
      }

      // Verify webhook signature if secret is configured
      const webhookSecret = process.env.ZOHO_WEBHOOK_SECRET;
      if (webhookSecret) {
        const signature = req.headers['x-zoho-webhook-signature'] as string;
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(body)
          .digest('hex');

        if (signature !== expectedSignature) {
          return res.status(401).json({ error: 'Invalid webhook signature' });
        }
      }

      const event: ZohoWebhookEvent = req.body;
      await syncManager.processWebhookEvent(event);

      res.json({
        success: true,
        message: 'Webhook processed successfully'
      });
    } catch (error) {
      console.error('[Zoho Webhook] Processing failed:', error);
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  // Product operations
  app.get('/api/zoho/products', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const { page = 1, per_page = 50, search_text, filter_by } = req.query;
      
      const result = await zohoClient.getProducts({
        page: Number(page),
        per_page: Number(per_page),
        search_text: search_text as string,
        filter_by: filter_by as string
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.get('/api/zoho/products/:itemId', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const { itemId } = req.params;
      const product = await zohoClient.getProduct(itemId);

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.post('/api/zoho/products', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const product = await zohoClient.createProduct(req.body);
      res.json({
        success: true,
        product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  app.put('/api/zoho/products/:itemId', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const { itemId } = req.params;
      const product = await zohoClient.updateProduct(itemId, req.body);

      res.json({
        success: true,
        product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  // Category operations
  app.get('/api/zoho/categories', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const result = await zohoClient.getCategories();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.post('/api/zoho/categories', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const category = await zohoClient.createCategory(req.body);
      res.json({
        success: true,
        category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  // Order operations
  app.get('/api/zoho/orders', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const { page = 1, per_page = 50, customer_id, status, date } = req.query;
      
      const result = await zohoClient.getOrders({
        page: Number(page),
        per_page: Number(per_page),
        customer_id: customer_id as string,
        status: status as string,
        date: date as string
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.get('/api/zoho/orders/:orderId', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const { orderId } = req.params;
      const order = await zohoClient.getOrder(orderId);

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.post('/api/zoho/orders', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const order = await zohoClient.createOrder(req.body);
      res.json({
        success: true,
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  app.patch('/api/zoho/orders/:orderId/status', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const { orderId } = req.params;
      const { status } = req.body;
      
      const order = await zohoClient.updateOrderStatus(orderId, status);
      res.json({
        success: true,
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  // Inventory operations
  app.get('/api/zoho/inventory/:itemId', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const { itemId } = req.params;
      const { warehouseId } = req.query;
      
      const inventory = await zohoClient.getInventoryLevel(itemId, warehouseId as string);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Customer operations
  app.get('/api/zoho/customers', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const { page = 1, per_page = 50, search_text } = req.query;
      
      const result = await zohoClient.getCustomers({
        page: Number(page),
        per_page: Number(per_page),
        search_text: search_text as string
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.post('/api/zoho/customers', async (req: Request, res: Response) => {
    try {
      if (!zohoClient) {
        return res.status(503).json({ error: 'Zoho client not initialized' });
      }

      const customer = await zohoClient.createCustomer(req.body);
      res.json({
        success: true,
        customer
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  console.log('[Zoho] API routes registered');
}

// Scheduled sync job (if enabled)
export function startScheduledSync(): void {
  const config = getDefaultZohoIntegrationConfig();
  
  if (!config.enabled || !syncManager) {
    console.log('[Zoho] Scheduled sync disabled');
    return;
  }

  const intervalMs = config.syncInterval * 60 * 1000; // Convert minutes to milliseconds
  
  setInterval(async () => {
    try {
      console.log('[Zoho] Starting scheduled sync');
      
      // Perform incremental sync for products and inventory
      if (config.autoSync.products) {
        await syncManager!.syncProducts(false);
      }
      
      if (config.autoSync.inventory) {
        await syncManager!.syncInventoryLevels();
      }
      
      console.log('[Zoho] Scheduled sync completed');
    } catch (error) {
      console.error('[Zoho] Scheduled sync failed:', error);
    }
  }, intervalMs);

  console.log(`[Zoho] Scheduled sync started with ${config.syncInterval} minute interval`);
}