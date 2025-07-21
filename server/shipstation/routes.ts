import { Router } from 'express';
import { z } from 'zod';
import { ShipstationService } from './service';
import { storage } from '../storage';
import { insertShipstationOrderSchema, insertShipstationWebhookSchema } from '@shared/shipstation-schema';

export function createShipstationRoutes(shipstationService: ShipstationService | null): Router {
  const router = Router();

  // Health check
  router.get('/health', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.json({
          success: false,
          status: 'disabled',
          message: 'ShipStation integration is not configured',
          timestamp: new Date().toISOString()
        });
      }

      const health = await shipstationService.getServiceHealth();
      
      res.json({
        success: health.status === 'healthy',
        status: health.status,
        lastSync: health.lastSync,
        errors: health.errors,
        apiStatus: health.apiStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed'
      });
    }
  });

  // Configuration validation
  router.get('/config/validate', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.json({
          success: false,
          valid: false,
          error: 'ShipStation service not initialized'
        });
      }

      const validation = await shipstationService.validateConfiguration();
      
      res.json({
        success: true,
        valid: validation.valid,
        error: validation.error
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        valid: false,
        error: error instanceof Error ? error.message : 'Configuration validation failed'
      });
    }
  });

  // Order management
  router.post('/orders', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const orderData = insertShipstationOrderSchema.parse(req.body);
      const result = await shipstationService.createShipstationOrder(orderData);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order'
      });
    }
  });

  router.get('/orders', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const {
        startDate,
        endDate,
        orderStatus,
        storeId,
        fullSync
      } = req.query;

      const options = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        orderStatus: orderStatus as string,
        storeId: storeId ? parseInt(storeId as string) : undefined,
        fullSync: fullSync === 'true'
      };

      const result = await shipstationService.getShipstationOrders(options);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      });
    }
  });

  router.get('/orders/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getShipstationOrderByOrderId(orderId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order'
      });
    }
  });

  // Shipping and labels
  router.post('/orders/:orderId/label', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const { orderId } = req.params;
      const shippingOptions = z.object({
        carrierCode: z.string(),
        serviceCode: z.string(),
        packageCode: z.string().optional(),
        confirmation: z.string().optional(),
        testLabel: z.boolean().optional()
      }).parse(req.body);

      const result = await shipstationService.createShippingLabel(orderId, shippingOptions);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create shipping label'
      });
    }
  });

  router.post('/labels/:shipmentId/void', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const { shipmentId } = req.params;
      const result = await shipstationService.voidShippingLabel(shipmentId);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to void shipping label'
      });
    }
  });

  router.post('/rates', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const rateRequest = z.object({
        carrierCode: z.string().optional(),
        packageCode: z.string(),
        fromPostalCode: z.string(),
        toState: z.string().optional(),
        toCountry: z.string(),
        toPostalCode: z.string(),
        weight: z.object({
          value: z.number(),
          units: z.string()
        }),
        dimensions: z.object({
          units: z.string(),
          length: z.number(),
          width: z.number(),
          height: z.number()
        }).optional(),
        confirmation: z.string().optional(),
        residential: z.boolean().optional()
      }).parse(req.body);

      const result = await shipstationService.getShippingRates(rateRequest);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get shipping rates'
      });
    }
  });

  // Synchronization
  router.post('/sync/orders', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const options = z.object({
        startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
        endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
        orderStatus: z.string().optional(),
        storeId: z.number().optional(),
        fullSync: z.boolean().optional()
      }).parse(req.body);

      const result = await shipstationService.syncOrders(options);
      
      res.json({
        success: result.success,
        data: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Order sync failed'
      });
    }
  });

  router.post('/sync/products', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const result = await shipstationService.syncProducts();
      
      res.json({
        success: result.success,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Product sync failed'
      });
    }
  });

  router.get('/sync/status', async (req, res) => {
    try {
      const { syncType } = req.query;
      const status = await storage.getLatestShipstationSyncStatus(syncType as string);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get sync status'
      });
    }
  });

  // Carriers and services
  router.get('/carriers', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const result = await shipstationService.getCarriers();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get carriers'
      });
    }
  });

  router.get('/warehouses', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const result = await shipstationService.getWarehouses();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get warehouses'
      });
    }
  });

  // Webhooks
  router.post('/webhooks/setup', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const result = await shipstationService.setupWebhooks();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to setup webhooks'
      });
    }
  });

  router.post('/webhooks/process', async (req, res) => {
    try {
      if (!shipstationService) {
        return res.status(503).json({
          success: false,
          error: 'ShipStation service not available'
        });
      }

      const webhookData = z.object({
        resourceUrl: z.string(),
        resourceType: z.string()
      }).parse(req.body);

      const result = await shipstationService.processWebhook(webhookData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process webhook'
      });
    }
  });

  // Analytics and monitoring
  router.get('/analytics/shipments', async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        carrierCode,
        serviceCode
      } = req.query;

      // This would be implemented with actual analytics queries
      // For now, return a basic structure
      
      res.json({
        success: true,
        data: {
          totalShipments: 0,
          averageShippingCost: 0,
          carrierBreakdown: [],
          serviceBreakdown: [],
          dateRange: {
            start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: endDate || new Date().toISOString()
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get shipment analytics'
      });
    }
  });

  // Error handling for disabled service
  router.use((req, res) => {
    if (!shipstationService) {
      return res.status(503).json({
        success: false,
        error: 'ShipStation integration is not configured. Please set SHIPSTATION_API_KEY and SHIPSTATION_API_SECRET environment variables.'
      });
    }

    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  });

  return router;
}