import { ShipstationClient, ShipstationConfig, ShipstationApiResponse } from './client';
import { IStorage } from '../storage';
import {
  ShipstationOrder,
  InsertShipstationOrder,
  ShipstationShipment,
  InsertShipstationShipment,
  ShipstationWebhook,
  InsertShipstationWebhook,
  ShipstationProduct,
  InsertShipstationProduct,
  ShipstationWarehouse,
  InsertShipstationWarehouse,
  ShipstationSyncStatus,
  InsertShipstationSyncStatus,
  ShipstationCreateOrderRequest,
  ShipstationShipmentResponse
} from '@shared/shipstation-schema';

export interface ShipstationServiceConfig {
  apiKey: string;
  apiSecret: string;
  webhookUrl?: string;
  defaultWarehouseId?: string;
  autoSyncInterval?: number;
  enableWebhooks?: boolean;
}

export interface ShipstationSyncResult {
  success: boolean;
  syncType: string;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsErrored: number;
  errors: string[];
  startTime: Date;
  endTime: Date;
  duration: number;
}

export interface ShipstationOrderSyncOptions {
  startDate?: Date;
  endDate?: Date;
  orderStatus?: string;
  storeId?: number;
  fullSync?: boolean;
}

export interface ShipstationRateQuote {
  carrierCode: string;
  serviceName: string;
  serviceCode: string;
  shipmentCost: number;
  otherCost: number;
  totalCost: number;
  estimatedDeliveryDate?: string;
  transitDays?: number;
}

export class ShipstationService {
  private client: ShipstationClient;
  private storage: IStorage;
  private config: ShipstationServiceConfig;
  private syncInProgress: Set<string> = new Set();

  constructor(config: ShipstationServiceConfig, storage: IStorage) {
    this.config = config;
    this.storage = storage;
    
    const clientConfig: ShipstationConfig = {
      apiKey: config.apiKey,
      apiSecret: config.apiSecret
    };
    
    this.client = new ShipstationClient(clientConfig);
  }

  // Configuration and Health
  async validateConfiguration(): Promise<{ valid: boolean; error?: string }> {
    try {
      const isConnected = await this.client.testConnection();
      if (!isConnected) {
        return { valid: false, error: 'Failed to connect to ShipStation API. Please check your credentials.' };
      }

      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Configuration validation failed' 
      };
    }
  }

  async getServiceHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastSync?: Date;
    errors: string[];
    apiStatus: any;
  }> {
    const errors: string[] = [];
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    try {
      // Test API connection
      const isConnected = await this.client.testConnection();
      if (!isConnected) {
        errors.push('ShipStation API connection failed');
        status = 'unhealthy';
      }

      // Check last sync status
      const lastSyncStatus = await this.getLastSyncStatus();
      if (lastSyncStatus && lastSyncStatus.status === 'error') {
        errors.push(`Last sync failed: ${lastSyncStatus.errorMessage}`);
        if (status === 'healthy') status = 'degraded';
      }

      const apiStatus = this.client.getApiStatus();

      return {
        status,
        lastSync: lastSyncStatus?.lastSuccessfulSyncAt || undefined,
        errors,
        apiStatus
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        errors: [error instanceof Error ? error.message : 'Health check failed'],
        apiStatus: this.client.getApiStatus()
      };
    }
  }

  // Order Management
  async createShipstationOrder(orderData: ShipstationCreateOrderRequest): Promise<{
    success: boolean;
    shipstationOrderId?: string;
    order?: any;
    error?: string;
  }> {
    try {
      console.log('[ShipStation] Creating order:', orderData.orderNumber);
      
      const response = await this.client.createOrder(orderData);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to create order in ShipStation'
        };
      }

      const shipstationOrder = response.data;
      
      // Save to local database
      const localOrderData: InsertShipstationOrder = {
        orderId: orderData.orderNumber, // Use order number as our internal order ID
        shipstationOrderId: shipstationOrder.orderId?.toString(),
        orderNumber: orderData.orderNumber,
        orderKey: orderData.orderKey,
        orderDate: new Date(orderData.orderDate),
        orderStatus: orderData.orderStatus,
        customerId: orderData.customerId?.toString() || 'unknown',
        billTo: orderData.billTo,
        shipTo: orderData.shipTo,
        items: orderData.items,
        orderTotal: orderData.orderTotal.toString(),
        amountPaid: orderData.amountPaid?.toString(),
        taxAmount: orderData.taxAmount?.toString(),
        shippingAmount: orderData.shippingAmount?.toString(),
        customerNotes: orderData.customerNotes,
        internalNotes: orderData.internalNotes,
        gift: orderData.gift,
        giftMessage: orderData.giftMessage,
        paymentMethod: orderData.paymentMethod,
        requestedShippingService: orderData.requestedShippingService,
        carrierCode: orderData.carrierCode,
        serviceCode: orderData.serviceCode,
        packageCode: orderData.packageCode,
        confirmation: orderData.confirmation,
        shipDate: orderData.shipDate ? new Date(orderData.shipDate) : null,
        holdUntilDate: orderData.holdUntilDate ? new Date(orderData.holdUntilDate) : null,
        weight: orderData.weight,
        dimensions: orderData.dimensions,
        insuranceOptions: orderData.insuranceOptions,
        internationalOptions: orderData.internationalOptions,
        advancedOptions: orderData.advancedOptions,
        tagIds: orderData.tagIds,
        userId: orderData.advancedOptions?.customField1, // Store user ID in custom field
        syncedAt: new Date()
      };

      await this.storage.insertShipstationOrder(localOrderData);

      console.log('[ShipStation] Order created successfully:', shipstationOrder.orderId);
      
      return {
        success: true,
        shipstationOrderId: shipstationOrder.orderId?.toString(),
        order: shipstationOrder
      };
    } catch (error) {
      console.error('[ShipStation] Failed to create order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order'
      };
    }
  }

  async syncOrderToShipstation(internalOrderId: string): Promise<{
    success: boolean;
    shipstationOrderId?: string;
    error?: string;
  }> {
    try {
      // Get internal order data (this would come from your orders table)
      // For now, we'll assume you pass the order data
      console.log('[ShipStation] Syncing order to ShipStation:', internalOrderId);
      
      // This is a placeholder - you'd implement the actual order retrieval logic
      throw new Error('Order sync not implemented - requires internal order structure');
      
    } catch (error) {
      console.error('[ShipStation] Failed to sync order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync order'
      };
    }
  }

  async getShipstationOrders(options: ShipstationOrderSyncOptions = {}): Promise<{
    success: boolean;
    orders?: any[];
    error?: string;
  }> {
    try {
      const params: any = {};
      
      if (options.startDate) {
        params.createDateStart = options.startDate.toISOString();
      }
      if (options.endDate) {
        params.createDateEnd = options.endDate.toISOString();
      }
      if (options.orderStatus) {
        params.orderStatus = options.orderStatus;
      }
      if (options.storeId) {
        params.storeId = options.storeId;
      }

      const response = await this.client.getOrders(params);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch orders from ShipStation'
        };
      }

      return {
        success: true,
        orders: response.data?.orders || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      };
    }
  }

  // Shipping and Labels
  async createShippingLabel(orderId: string, shippingOptions: {
    carrierCode: string;
    serviceCode: string;
    packageCode?: string;
    confirmation?: string;
    testLabel?: boolean;
  }): Promise<{
    success: boolean;
    shipment?: ShipstationShipmentResponse;
    labelData?: string;
    trackingNumber?: string;
    error?: string;
  }> {
    try {
      console.log('[ShipStation] Creating shipping label for order:', orderId);
      
      // Get the order from our database
      const localOrder = await this.storage.getShipstationOrderByOrderId(orderId);
      if (!localOrder) {
        return {
          success: false,
          error: 'Order not found in local database'
        };
      }

      if (!localOrder.shipstationOrderId) {
        return {
          success: false,
          error: 'Order not synced to ShipStation yet'
        };
      }

      const labelData = {
        orderId: parseInt(localOrder.shipstationOrderId),
        carrierCode: shippingOptions.carrierCode,
        serviceCode: shippingOptions.serviceCode,
        packageCode: shippingOptions.packageCode || 'package',
        confirmation: shippingOptions.confirmation || 'none',
        testLabel: shippingOptions.testLabel || false
      };

      const response = await this.client.createLabel(labelData);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to create shipping label'
        };
      }

      const shipment = response.data;
      
      // Save shipment to local database
      const shipmentData: InsertShipstationShipment = {
        orderId: orderId,
        shipstationOrderId: localOrder.shipstationOrderId,
        shipmentId: shipment.shipmentId?.toString(),
        userId: localOrder.userId,
        customerEmail: shipment.customerEmail,
        orderNumber: shipment.orderNumber,
        createDate: new Date(shipment.createDate),
        shipDate: new Date(shipment.shipDate),
        shipTo: shipment.shipTo,
        weight: shipment.weight,
        dimensions: shipment.dimensions,
        insuranceCost: shipment.insuranceCost?.toString(),
        shippingCost: shipment.shippingCost?.toString(),
        trackingNumber: shipment.trackingNumber,
        isReturnLabel: shipment.isReturnLabel,
        batchNumber: shipment.batchNumber,
        carrierCode: shipment.carrierCode,
        serviceCode: shipment.serviceCode,
        packageCode: shipment.packageCode,
        confirmation: shipment.confirmation,
        warehouseId: shipment.warehouseId?.toString(),
        voided: shipment.voided,
        voidDate: shipment.voidDate ? new Date(shipment.voidDate) : null,
        marketplaceNotified: shipment.marketplaceNotified,
        notifyErrorMessage: shipment.notifyErrorMessage,
        shipmentItems: shipment.shipmentItems,
        labelData: shipment.labelData,
        formData: shipment.formData
      };

      await this.storage.insertShipstationShipment(shipmentData);

      console.log('[ShipStation] Shipping label created successfully:', shipment.trackingNumber);
      
      return {
        success: true,
        shipment,
        labelData: shipment.labelData,
        trackingNumber: shipment.trackingNumber
      };
    } catch (error) {
      console.error('[ShipStation] Failed to create shipping label:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create shipping label'
      };
    }
  }

  async getShippingRates(rateRequest: {
    carrierCode?: string;
    packageCode: string;
    fromPostalCode: string;
    toState?: string;
    toCountry: string;
    toPostalCode: string;
    weight: { value: number; units: string };
    dimensions?: {
      units: string;
      length: number;
      width: number;
      height: number;
    };
    confirmation?: string;
    residential?: boolean;
  }): Promise<{
    success: boolean;
    rates?: ShipstationRateQuote[];
    error?: string;
  }> {
    try {
      console.log('[ShipStation] Getting shipping rates');
      
      const rateRequestWithCarrier = {
        ...rateRequest,
        carrierCode: rateRequest.carrierCode || 'fedex' // Default carrier if not provided
      };
      const response = await this.client.getRates(rateRequestWithCarrier);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to get shipping rates'
        };
      }

      const rates: ShipstationRateQuote[] = response.data.map((rate: any) => ({
        carrierCode: rateRequest.carrierCode || rate.carrierCode,
        serviceName: rate.serviceName,
        serviceCode: rate.serviceCode,
        shipmentCost: rate.shipmentCost,
        otherCost: rate.otherCost,
        totalCost: rate.shipmentCost + rate.otherCost
      }));

      return {
        success: true,
        rates
      };
    } catch (error) {
      console.error('[ShipStation] Failed to get shipping rates:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get shipping rates'
      };
    }
  }

  async voidShippingLabel(shipmentId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      console.log('[ShipStation] Voiding shipping label:', shipmentId);
      
      const response = await this.client.voidLabel(parseInt(shipmentId));
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to void shipping label'
        };
      }

      // Update local database
      await this.storage.updateShipstationShipment(shipmentId, {
        voided: true,
        voidDate: new Date()
      });

      console.log('[ShipStation] Shipping label voided successfully');
      
      return { success: true };
    } catch (error) {
      console.error('[ShipStation] Failed to void shipping label:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to void shipping label'
      };
    }
  }

  // Synchronization
  async syncOrders(options: ShipstationOrderSyncOptions = {}): Promise<ShipstationSyncResult> {
    const syncType = 'orders';
    const startTime = new Date();
    let recordsProcessed = 0;
    let recordsCreated = 0;
    let recordsUpdated = 0;
    let recordsErrored = 0;
    const errors: string[] = [];

    if (this.syncInProgress.has(syncType)) {
      throw new Error('Order sync already in progress');
    }

    try {
      this.syncInProgress.add(syncType);
      
      console.log('[ShipStation] Starting order sync');
      
      await this.createSyncStatus({
        syncType,
        status: 'in_progress',
        recordsProcessed: 0,
        recordsUpdated: 0,
        recordsCreated: 0,
        recordsErrored: 0
      });

      const ordersResult = await this.getShipstationOrders(options);
      
      if (!ordersResult.success || !ordersResult.orders) {
        throw new Error(ordersResult.error || 'Failed to fetch orders');
      }

      for (const order of ordersResult.orders) {
        try {
          recordsProcessed++;
          
          const existingOrder = await this.storage.getShipstationOrderByShipstationId(order.orderId?.toString());
          
          const orderData: InsertShipstationOrder = {
            orderId: order.orderNumber,
            shipstationOrderId: order.orderId?.toString(),
            orderNumber: order.orderNumber,
            orderKey: order.orderKey,
            orderDate: new Date(order.orderDate),
            orderStatus: order.orderStatus,
            customerId: order.customerId?.toString() || 'unknown',
            billTo: order.billTo,
            shipTo: order.shipTo,
            items: order.items,
            orderTotal: order.orderTotal?.toString() || '0',
            amountPaid: order.amountPaid?.toString(),
            taxAmount: order.taxAmount?.toString(),
            shippingAmount: order.shippingAmount?.toString(),
            customerNotes: order.customerNotes,
            internalNotes: order.internalNotes,
            gift: order.gift,
            giftMessage: order.giftMessage,
            paymentMethod: order.paymentMethod,
            requestedShippingService: order.requestedShippingService,
            carrierCode: order.carrierCode,
            serviceCode: order.serviceCode,
            packageCode: order.packageCode,
            confirmation: order.confirmation,
            shipDate: order.shipDate ? new Date(order.shipDate) : null,
            holdUntilDate: order.holdUntilDate ? new Date(order.holdUntilDate) : null,
            weight: order.weight,
            dimensions: order.dimensions,
            insuranceOptions: order.insuranceOptions,
            internationalOptions: order.internationalOptions,
            advancedOptions: order.advancedOptions,
            tagIds: order.tagIds,
            userId: order.userId,
            syncedAt: new Date()
          };

          if (existingOrder) {
            await this.storage.updateShipstationOrder(existingOrder.id, orderData);
            recordsUpdated++;
          } else {
            await this.storage.insertShipstationOrder(orderData);
            recordsCreated++;
          }
        } catch (error) {
          recordsErrored++;
          errors.push(`Order ${order.orderNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          console.error('[ShipStation] Failed to sync order:', order.orderNumber, error);
        }
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      await this.createSyncStatus({
        syncType,
        lastSyncAt: endTime,
        lastSuccessfulSyncAt: errors.length === 0 ? endTime : undefined,
        status: errors.length === 0 ? 'success' : 'error',
        errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
        recordsProcessed,
        recordsUpdated,
        recordsCreated,
        recordsErrored
      });

      console.log('[ShipStation] Order sync completed:', {
        recordsProcessed,
        recordsCreated,
        recordsUpdated,
        recordsErrored,
        duration: `${duration}ms`
      });

      return {
        success: errors.length === 0,
        syncType,
        recordsProcessed,
        recordsCreated,
        recordsUpdated,
        recordsErrored,
        errors,
        startTime,
        endTime,
        duration
      };
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      
      await this.createSyncStatus({
        syncType,
        lastSyncAt: endTime,
        status: 'error',
        errorMessage,
        recordsProcessed,
        recordsUpdated,
        recordsCreated,
        recordsErrored
      });

      return {
        success: false,
        syncType,
        recordsProcessed,
        recordsCreated,
        recordsUpdated,
        recordsErrored,
        errors: [errorMessage],
        startTime,
        endTime,
        duration
      };
    } finally {
      this.syncInProgress.delete(syncType);
    }
  }

  async syncProducts(): Promise<ShipstationSyncResult> {
    const syncType = 'products';
    const startTime = new Date();
    let recordsProcessed = 0;
    let recordsCreated = 0;
    let recordsUpdated = 0;
    let recordsErrored = 0;
    const errors: string[] = [];

    if (this.syncInProgress.has(syncType)) {
      throw new Error('Product sync already in progress');
    }

    try {
      this.syncInProgress.add(syncType);
      
      console.log('[ShipStation] Starting product sync');
      
      const response = await this.client.getProducts();
      
      if (!response.success || !response.data?.products) {
        throw new Error(response.error || 'Failed to fetch products');
      }

      for (const product of response.data.products) {
        try {
          recordsProcessed++;
          
          const existingProduct = await this.storage.getShipstationProductByProductId(product.productId.toString());
          
          const productData: InsertShipstationProduct = {
            productId: product.productId.toString(),
            sku: product.sku,
            name: product.name,
            price: product.price?.toString(),
            defaultCost: product.defaultCost?.toString(),
            length: product.length?.toString(),
            width: product.width?.toString(),
            height: product.height?.toString(),
            weightOz: product.weightOz?.toString(),
            internalNotes: product.internalNotes,
            fulfillmentSku: product.fulfillmentSku,
            createDate: product.createDate ? new Date(product.createDate) : undefined,
            modifyDate: product.modifyDate ? new Date(product.modifyDate) : undefined,
            active: product.active,
            productCategory: product.productCategory,
            productType: product.productType,
            warehouseLocation: product.warehouseLocation,
            defaultCarrierCode: product.defaultCarrierCode,
            defaultServiceCode: product.defaultServiceCode,
            defaultPackageCode: product.defaultPackageCode,
            defaultIntlCarrierCode: product.defaultCarrierCode, // Use defaultCarrierCode as fallback
            defaultIntlServiceCode: product.defaultServiceCode, // Use defaultServiceCode as fallback
            defaultIntlPackageCode: product.defaultPackageCode, // Use defaultPackageCode as fallback
            defaultConfirmation: product.defaultConfirmation,
            defaultIntlConfirmation: product.defaultConfirmation, // Use defaultConfirmation as fallback
            customsDescription: product.customsDescription,
            customsValue: product.customsValue?.toString(),
            customsTariffNo: product.customsTariffNo,
            customsCountryCode: product.customsCountryCode,
            noCustoms: product.noCustoms,
            tags: product.tags,
            syncedAt: new Date()
          };

          if (existingProduct) {
            await this.storage.updateShipstationProduct(existingProduct.id, productData);
            recordsUpdated++;
          } else {
            await this.storage.insertShipstationProduct(productData);
            recordsCreated++;
          }
        } catch (error) {
          recordsErrored++;
          errors.push(`Product ${product.sku}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          console.error('[ShipStation] Failed to sync product:', product.sku, error);
        }
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      console.log('[ShipStation] Product sync completed:', {
        recordsProcessed,
        recordsCreated,
        recordsUpdated,
        recordsErrored,
        duration: `${duration}ms`
      });

      return {
        success: errors.length === 0,
        syncType,
        recordsProcessed,
        recordsCreated,
        recordsUpdated,
        recordsErrored,
        errors,
        startTime,
        endTime,
        duration
      };
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      const errorMessage = error instanceof Error ? error.message : 'Product sync failed';
      
      return {
        success: false,
        syncType,
        recordsProcessed,
        recordsCreated,
        recordsUpdated,
        recordsErrored,
        errors: [errorMessage],
        startTime,
        endTime,
        duration
      };
    } finally {
      this.syncInProgress.delete(syncType);
    }
  }

  // Webhook Management
  async setupWebhooks(): Promise<{ success: boolean; error?: string }> {
    if (!this.config.webhookUrl) {
      return { success: false, error: 'Webhook URL not configured' };
    }

    try {
      console.log('[ShipStation] Setting up webhooks');
      
      const webhookEvents = ['ORDER_NOTIFY', 'SHIP_NOTIFY', 'ITEM_ORDER_NOTIFY'];
      
      for (const event of webhookEvents) {
        const response = await this.client.subscribeToWebhook({
          targetUrl: this.config.webhookUrl,
          event,
          friendlyName: `VIP Smoke ${event}`
        });
        
        if (!response.success) {
          console.error(`[ShipStation] Failed to setup webhook for ${event}:`, response.error);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('[ShipStation] Failed to setup webhooks:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to setup webhooks'
      };
    }
  }

  async processWebhook(webhookData: {
    resourceUrl: string;
    resourceType: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[ShipStation] Processing webhook:', webhookData.resourceType);
      
      // Save webhook event
      const webhookRecord: InsertShipstationWebhook = {
        resourceUrl: webhookData.resourceUrl,
        resourceType: webhookData.resourceType,
        eventType: webhookData.resourceType,
        data: webhookData
      };
      
      await this.storage.insertShipstationWebhook(webhookRecord);
      
      // Process based on webhook type
      switch (webhookData.resourceType) {
        case 'ORDER_NOTIFY':
          // Fetch and sync the updated order
          break;
        case 'SHIP_NOTIFY':
          // Fetch and sync the shipment info
          break;
        case 'ITEM_ORDER_NOTIFY':
          // Handle item-level notifications
          break;
      }
      
      return { success: true };
    } catch (error) {
      console.error('[ShipStation] Failed to process webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process webhook'
      };
    }
  }

  // Utility Methods
  private async createSyncStatus(statusData: InsertShipstationSyncStatus): Promise<void> {
    try {
      await this.storage.insertShipstationSyncStatus(statusData);
    } catch (error) {
      console.error('[ShipStation] Failed to create sync status:', error);
    }
  }

  private async getLastSyncStatus(syncType?: string): Promise<ShipstationSyncStatus | null> {
    try {
      return await this.storage.getLatestShipstationSyncStatus(syncType);
    } catch (error) {
      console.error('[ShipStation] Failed to get sync status:', error);
      return null;
    }
  }

  async getCarriers(): Promise<{ success: boolean; carriers?: any[]; error?: string }> {
    try {
      const response = await this.client.getCarriers();
      return {
        success: response.success,
        carriers: response.data,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get carriers'
      };
    }
  }

  async getWarehouses(): Promise<{ success: boolean; warehouses?: any[]; error?: string }> {
    try {
      const response = await this.client.getWarehouses();
      return {
        success: response.success,
        warehouses: response.data,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get warehouses'
      };
    }
  }
}