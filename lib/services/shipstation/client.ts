import { 
  ShipstationCreateOrderRequest, 
  ShipstationShipmentResponse, 
  ShipstationRateRequest, 
  ShipstationRate,
  ShipstationAddress,
  ShipstationOrderItem 
} from '@shared/shipstation-schema';

export interface ShipstationConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface ShipstationApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  headers?: Record<string, string>;
}

export interface ShipstationOrdersResponse {
  orders: any[];
  total: number;
  page: number;
  pages: number;
}

export interface ShipstationShipmentsResponse {
  shipments: ShipstationShipmentResponse[];
  total: number;
  page: number;
  pages: number;
}

export interface ShipstationCarrier {
  name: string;
  code: string;
  accountNumber?: string;
  requiresFundingSource: boolean;
  balance: number;
  nickname?: string;
  shippingProviderId: number;
  primary: boolean;
}

export interface ShipstationWarehouse {
  warehouseId: number;
  warehouseName: string;
  originAddress: ShipstationAddress;
  returnAddress?: ShipstationAddress;
  createDate: string;
  isDefault: boolean;
}

export interface ShipstationProduct {
  productId: number;
  sku: string;
  name: string;
  price?: number;
  defaultCost?: number;
  length?: number;
  width?: number;
  height?: number;
  weightOz?: number;
  internalNotes?: string;
  fulfillmentSku?: string;
  createDate: string;
  modifyDate: string;
  active: boolean;
  productCategory?: {
    categoryId: number;
    name: string;
  };
  productType?: string;
  warehouseLocation?: string;
  defaultCarrierCode?: string;
  defaultServiceCode?: string;
  defaultPackageCode?: string;
  defaultConfirmation?: string;
  customsDescription?: string;
  customsValue?: number;
  customsTariffNo?: string;
  customsCountryCode?: string;
  noCustoms?: boolean;
  tags?: Array<{
    tagId: number;
    name: string;
    color: string;
  }>;
}

export class ShipstationApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ShipstationApiError';
  }
}

export class ShipstationClient {
  private config: Required<ShipstationConfig>;

  constructor(config: ShipstationConfig) {
    this.config = {
      // V2 base URL — all endpoints are relative paths under /v2
      baseUrl: 'https://api.shipstation.com/v2',
      timeout: 30000,
      ...config
    };
  }

  private async makeRequest<T = any>(
    endpoint: string,
    options: {
      method?: string;
      data?: any;
      params?: Record<string, any>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ShipstationApiResponse<T>> {
    try {
      const {
        method = 'GET',
        data,
        params,
        headers: customHeaders = {}
      } = options;

      const url = new URL(endpoint, this.config.baseUrl);
      
      // Add query parameters
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const headers: Record<string, string> = {
        // V2 authentication: single API-Key header
        'API-Key': this.config.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'Highway420-ShipStation-V2/1.0',
        ...customHeaders
      };

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: AbortSignal.timeout(this.config.timeout)
      };

      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        fetchOptions.body = JSON.stringify(data);
      }

      console.log(`[ShipStation] ${method} ${url.toString()}`);
      
      const response = await fetch(url.toString(), fetchOptions);
      
      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        const errorMessage = typeof responseData === 'object' 
          ? responseData.message || responseData.error || `HTTP ${response.status}`
          : responseData || `HTTP ${response.status}`;
        
        throw new ShipstationApiError(
          `ShipStation API Error: ${errorMessage}`,
          response.status,
          responseData
        );
      }

      return {
        success: true,
        data: responseData,
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };

    } catch (error) {
      console.error('[ShipStation] API request failed:', error);
      
      if (error instanceof ShipstationApiError) {
        return {
          success: false,
          error: error.message,
          statusCode: error.statusCode
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Authentication & Health Check — V2 uses /v2/carriers
  async validateCredentials(): Promise<ShipstationApiResponse<boolean>> {
    try {
      const response = await this.makeRequest('/carriers');
      return {
        success: response.success,
        data: response.success,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : 'Credential validation failed'
      };
    }
  }

  // Orders
  async getOrders(params?: {
    orderStatus?: string;
    orderNumber?: string;
    customerName?: string;
    itemKeyword?: string;
    createDateStart?: string;
    createDateEnd?: string;
    modifyDateStart?: string;
    modifyDateEnd?: string;
    orderDateStart?: string;
    orderDateEnd?: string;
    storeId?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    pageSize?: number;
  }): Promise<ShipstationApiResponse<ShipstationOrdersResponse>> {
    return this.makeRequest('/orders', { params });
  }

  async getOrder(orderId: number): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest(`/orders/${orderId}`);
  }

  async createOrder(orderData: ShipstationCreateOrderRequest): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest('/orders/createorder', {
      method: 'POST',
      data: orderData
    });
  }

  async updateOrder(orderId: number, orderData: Partial<ShipstationCreateOrderRequest>): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest(`/orders/createorder`, {
      method: 'POST',
      data: { orderId, ...orderData }
    });
  }

  async deleteOrder(orderId: number): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest(`/orders/${orderId}`, {
      method: 'DELETE'
    });
  }

  async markOrderAsShipped(orderId: number, shipmentData: {
    carrierCode: string;
    serviceCode?: string;
    trackingNumber: string;
    shipDate?: string;
    notifyCustomer?: boolean;
    notifySalesChannel?: boolean;
  }): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest('/orders/markasshipped', {
      method: 'POST',
      data: { orderId, ...shipmentData }
    });
  }

  // Shipments
  async getShipments(params?: {
    recipientName?: string;
    recipientCountryCode?: string;
    orderNumber?: string;
    orderId?: number;
    carrierCode?: string;
    serviceCode?: string;
    trackingNumber?: string;
    createDateStart?: string;
    createDateEnd?: string;
    shipDateStart?: string;
    shipDateEnd?: string;
    voidDateStart?: string;
    voidDateEnd?: string;
    storeId?: number;
    includeShipmentItems?: boolean;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    pageSize?: number;
  }): Promise<ShipstationApiResponse<ShipstationShipmentsResponse>> {
    return this.makeRequest('/shipments', { params });
  }

  async createLabel(labelData: {
    orderId: number;
    carrierCode: string;
    serviceCode: string;
    packageCode: string;
    confirmation?: string;
    shipDate?: string;
    weight?: {
      value: number;
      units: string;
    };
    dimensions?: {
      units: string;
      length: number;
      width: number;
      height: number;
    };
    insuranceOptions?: {
      provider: string;
      insureShipment: boolean;
      insuredValue: number;
    };
    internationalOptions?: any;
    advancedOptions?: any;
    testLabel?: boolean;
  }): Promise<ShipstationApiResponse<ShipstationShipmentResponse>> {
    return this.makeRequest('/orders/createlabelfororder', {
      method: 'POST',
      data: labelData
    });
  }

  async voidLabel(shipmentId: number): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest('/shipments/voidlabel', {
      method: 'POST',
      data: { shipmentId }
    });
  }

  // Rates — V2 endpoint: POST /v2/rates
  async getRates(rateData: ShipstationRateRequest): Promise<ShipstationApiResponse<ShipstationRate[]>> {
    return this.makeRequest('/rates', {
      method: 'POST',
      data: rateData
    });
  }

  // Multi-carrier rate shopping — returns all available rates for a shipment
  async getShippingRates(params: {
    shipTo: { postalCode: string; countryCode: string; cityLocality?: string; stateProvince?: string };
    weight: { value: number; unit: 'ounce' | 'pound' | 'gram' | 'kilogram' };
    dimensions?: { length: number; width: number; height: number; unit: 'inch' | 'centimeter' };
    shipFrom?: { postalCode?: string; countryCode?: string };
  }): Promise<ShipstationApiResponse<any[]>> {
    const shipFromPostalCode = params.shipFrom?.postalCode || process.env.SHIPSTATION_FROM_POSTAL_CODE;
    if (!shipFromPostalCode) {
      throw new Error('SHIPSTATION_FROM_POSTAL_CODE is not set and no shipFrom.postalCode was provided');
    }
    const payload = {
      rate_options: {
        carrier_ids: [], // empty = all connected carriers
      },
      shipment: {
        validate_address: 'no_validation',
        ship_to: {
          postal_code: params.shipTo.postalCode,
          country_code: params.shipTo.countryCode,
          city_locality: params.shipTo.cityLocality,
          state_province: params.shipTo.stateProvince,
          address_line1: '',
          city: '',
          name: 'Ship To'
        },
        ship_from: {
          postal_code: shipFromPostalCode,
          country_code: params.shipFrom?.countryCode || 'US',
          address_line1: '',
          city_locality: '',
          state_province: '',
          name: 'Highway420 Warehouse'
        },
        packages: [{
          weight: {
            value: params.weight.value,
            unit: params.weight.unit
          },
          ...(params.dimensions ? { dimensions: {
            length: params.dimensions.length,
            width: params.dimensions.width,
            height: params.dimensions.height,
            unit: params.dimensions.unit
          } } : {})
        }]
      }
    };
    return this.makeRequest('/rates', { method: 'POST', data: payload });
  }

  // Carriers — V2 endpoints
  async getCarriers(): Promise<ShipstationApiResponse<ShipstationCarrier[]>> {
    return this.makeRequest('/carriers');
  }

  async getServices(carrierCode: string): Promise<ShipstationApiResponse<any[]>> {
    return this.makeRequest(`/carriers/${carrierCode}/services`);
  }

  async getPackages(carrierCode: string): Promise<ShipstationApiResponse<any[]>> {
    return this.makeRequest(`/carriers/${carrierCode}/packages`);
  }

  // Products
  async getProducts(params?: {
    sku?: string;
    name?: string;
    productCategoryId?: number;
    productTypeId?: number;
    tagId?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    pageSize?: number;
    showInactive?: boolean;
  }): Promise<ShipstationApiResponse<{ products: ShipstationProduct[]; total: number; page: number; pages: number }>> {
    return this.makeRequest('/products', { params });
  }

  async getProduct(productId: number): Promise<ShipstationApiResponse<ShipstationProduct>> {
    return this.makeRequest(`/products/${productId}`);
  }

  async createProduct(productData: {
    sku: string;
    name: string;
    price?: number;
    defaultCost?: number;
    length?: number;
    width?: number;
    height?: number;
    weightOz?: number;
    internalNotes?: string;
    fulfillmentSku?: string;
    active?: boolean;
    productCategory?: { categoryId: number };
    productType?: string;
    warehouseLocation?: string;
    defaultCarrierCode?: string;
    defaultServiceCode?: string;
    defaultPackageCode?: string;
    defaultConfirmation?: string;
    customsDescription?: string;
    customsValue?: number;
    customsTariffNo?: string;
    customsCountryCode?: string;
    noCustoms?: boolean;
  }): Promise<ShipstationApiResponse<ShipstationProduct>> {
    return this.makeRequest('/products', {
      method: 'POST',
      data: productData
    });
  }

  async updateProduct(productId: number, productData: Partial<ShipstationProduct>): Promise<ShipstationApiResponse<ShipstationProduct>> {
    return this.makeRequest(`/products/${productId}`, {
      method: 'PUT',
      data: productData
    });
  }

  // Warehouses
  async getWarehouses(): Promise<ShipstationApiResponse<ShipstationWarehouse[]>> {
    return this.makeRequest('/accounts/listwarehouses');
  }

  async getWarehouse(warehouseId: number): Promise<ShipstationApiResponse<ShipstationWarehouse>> {
    return this.makeRequest(`/accounts/getwarehouse?warehouseId=${warehouseId}`);
  }

  async createWarehouse(warehouseData: {
    warehouseName: string;
    originAddress: ShipstationAddress;
    returnAddress?: ShipstationAddress;
    isDefault?: boolean;
  }): Promise<ShipstationApiResponse<ShipstationWarehouse>> {
    return this.makeRequest('/accounts/createwarehouse', {
      method: 'POST',
      data: warehouseData
    });
  }

  async updateWarehouse(warehouseId: number, warehouseData: Partial<ShipstationWarehouse>): Promise<ShipstationApiResponse<ShipstationWarehouse>> {
    return this.makeRequest(`/accounts/updatewarehouse`, {
      method: 'PUT',
      data: { warehouseId, ...warehouseData }
    });
  }

  // Webhooks
  async getWebhooks(): Promise<ShipstationApiResponse<any[]>> {
    return this.makeRequest('/webhooks');
  }

  async subscribeToWebhook(webhookData: {
    targetUrl: string;
    event: string;
    storeId?: number;
    friendlyName?: string;
  }): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest('/webhooks/subscribe', {
      method: 'POST',
      data: webhookData
    });
  }

  async unsubscribeFromWebhook(webhookId: number): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest(`/webhooks/${webhookId}`, {
      method: 'DELETE'
    });
  }

  // Stores
  async getStores(): Promise<ShipstationApiResponse<any[]>> {
    return this.makeRequest('/accounts/liststores');
  }

  async getStore(storeId: number): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest(`/accounts/getstore?storeId=${storeId}`);
  }

  // Customers
  async getCustomers(params?: {
    stateCode?: string;
    countryCode?: string;
    marketplaceId?: number;
    tagId?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    pageSize?: number;
  }): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest('/customers', { params });
  }

  async getCustomer(customerId: number): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest(`/customers/${customerId}`);
  }

  // Tags
  async getTags(): Promise<ShipstationApiResponse<any[]>> {
    return this.makeRequest('/accounts/listtags');
  }

  async createTag(tagData: {
    name: string;
    color: string;
  }): Promise<ShipstationApiResponse<any>> {
    return this.makeRequest('/accounts/createtag', {
      method: 'POST',
      data: tagData
    });
  }

  // Utility Methods
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.validateCredentials();
      return result.success && result.data === true;
    } catch (error) {
      console.error('[ShipStation] Connection test failed:', error);
      return false;
    }
  }

  getApiStatus(): {
    baseUrl: string;
    version: string;
    authenticated: boolean;
  } {
    return {
      baseUrl: this.config.baseUrl,
      version: 'v2',
      authenticated: !!this.config.apiKey
    };
  }
}