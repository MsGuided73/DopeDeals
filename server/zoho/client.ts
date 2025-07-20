import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ZohoConfig,
  ZohoAuthResponse,
  ZohoProduct,
  ZohoProductsResponse,
  ZohoCategory,
  ZohoCategoriesResponse,
  ZohoOrder,
  ZohoOrdersResponse,
  ZohoCustomer,
  ZohoApiResponse
} from './types.js';

export class ZohoInventoryClient {
  private config: ZohoConfig;
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: ZohoConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(async (config) => {
      await this.ensureValidToken();
      if (this.accessToken) {
        config.headers.Authorization = `Zoho-oauthtoken ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, refresh and retry
          this.accessToken = null;
          this.tokenExpiry = null;
          await this.ensureValidToken();
          
          // Retry the original request
          const originalRequest = error.config;
          if (this.accessToken && !originalRequest._retry) {
            originalRequest._retry = true;
            originalRequest.headers.Authorization = `Zoho-oauthtoken ${this.accessToken}`;
            return this.client.request(originalRequest);
          }
        }
        throw error;
      }
    );
  }

  private async ensureValidToken(): Promise<void> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return; // Token is still valid
    }

    await this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const response = await axios.post(
        'https://accounts.zoho.com/oauth/v2/token',
        null,
        {
          params: {
            refresh_token: this.config.refreshToken,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            grant_type: 'refresh_token',
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const authData: ZohoAuthResponse = response.data;
      this.accessToken = authData.access_token;
      this.tokenExpiry = new Date(Date.now() + (authData.expires_in * 1000) - 60000); // 1 minute buffer
      
      console.log('[Zoho] Access token refreshed successfully');
    } catch (error) {
      console.error('[Zoho] Failed to refresh access token:', error);
      throw new Error('Failed to authenticate with Zoho Inventory');
    }
  }

  // Product Operations
  async getProducts(params?: {
    page?: number;
    per_page?: number;
    search_text?: string;
    filter_by?: string;
    sort_column?: string;
    sort_order?: 'ascending' | 'descending';
  }): Promise<ZohoProductsResponse> {
    try {
      const response: AxiosResponse<ZohoProductsResponse> = await this.client.get('/items', {
        params: {
          organization_id: this.config.organizationId,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[Zoho] Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(itemId: string): Promise<ZohoProduct> {
    try {
      const response: AxiosResponse<{ code: number; message: string; item: ZohoProduct }> = 
        await this.client.get(`/items/${itemId}`, {
          params: {
            organization_id: this.config.organizationId,
          },
        });
      return response.data.item;
    } catch (error) {
      console.error(`[Zoho] Error fetching product ${itemId}:`, error);
      throw error;
    }
  }

  async createProduct(product: Partial<ZohoProduct>): Promise<ZohoProduct> {
    try {
      const response: AxiosResponse<{ code: number; message: string; item: ZohoProduct }> = 
        await this.client.post('/items', 
          { 
            ...product,
            organization_id: this.config.organizationId 
          }
        );
      return response.data.item;
    } catch (error) {
      console.error('[Zoho] Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(itemId: string, updates: Partial<ZohoProduct>): Promise<ZohoProduct> {
    try {
      const response: AxiosResponse<{ code: number; message: string; item: ZohoProduct }> = 
        await this.client.put(`/items/${itemId}`, 
          {
            ...updates,
            organization_id: this.config.organizationId
          }
        );
      return response.data.item;
    } catch (error) {
      console.error(`[Zoho] Error updating product ${itemId}:`, error);
      throw error;
    }
  }

  // Category Operations
  async getCategories(): Promise<ZohoCategoriesResponse> {
    try {
      const response: AxiosResponse<ZohoCategoriesResponse> = await this.client.get('/settings/categories', {
        params: {
          organization_id: this.config.organizationId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[Zoho] Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(category: Partial<ZohoCategory>): Promise<ZohoCategory> {
    try {
      const response: AxiosResponse<{ code: number; message: string; item_category: ZohoCategory }> = 
        await this.client.post('/settings/categories', 
          {
            ...category,
            organization_id: this.config.organizationId
          }
        );
      return response.data.item_category;
    } catch (error) {
      console.error('[Zoho] Error creating category:', error);
      throw error;
    }
  }

  // Order Operations
  async getOrders(params?: {
    page?: number;
    per_page?: number;
    customer_id?: string;
    status?: string;
    date?: string;
    filter_by?: string;
    sort_column?: string;
    sort_order?: 'ascending' | 'descending';
  }): Promise<ZohoOrdersResponse> {
    try {
      const response: AxiosResponse<ZohoOrdersResponse> = await this.client.get('/salesorders', {
        params: {
          organization_id: this.config.organizationId,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error('[Zoho] Error fetching orders:', error);
      throw error;
    }
  }

  async getOrder(salesorderId: string): Promise<ZohoOrder> {
    try {
      const response: AxiosResponse<{ code: number; message: string; salesorder: ZohoOrder }> = 
        await this.client.get(`/salesorders/${salesorderId}`, {
          params: {
            organization_id: this.config.organizationId,
          },
        });
      return response.data.salesorder;
    } catch (error) {
      console.error(`[Zoho] Error fetching order ${salesorderId}:`, error);
      throw error;
    }
  }

  async createOrder(order: Partial<ZohoOrder>): Promise<ZohoOrder> {
    try {
      const response: AxiosResponse<{ code: number; message: string; salesorder: ZohoOrder }> = 
        await this.client.post('/salesorders', 
          {
            ...order,
            organization_id: this.config.organizationId
          }
        );
      return response.data.salesorder;
    } catch (error) {
      console.error('[Zoho] Error creating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(salesorderId: string, status: string): Promise<ZohoOrder> {
    try {
      const response: AxiosResponse<{ code: number; message: string; salesorder: ZohoOrder }> = 
        await this.client.post(`/salesorders/${salesorderId}/status/${status}`, {
          organization_id: this.config.organizationId,
        });
      return response.data.salesorder;
    } catch (error) {
      console.error(`[Zoho] Error updating order status ${salesorderId}:`, error);
      throw error;
    }
  }

  // Customer Operations
  async getCustomers(params?: {
    page?: number;
    per_page?: number;
    search_text?: string;
    filter_by?: string;
    sort_column?: string;
    sort_order?: 'ascending' | 'descending';
  }): Promise<{ contacts: ZohoCustomer[] }> {
    try {
      const response: AxiosResponse<{ code: number; message: string; contacts: ZohoCustomer[] }> = 
        await this.client.get('/contacts', {
          params: {
            organization_id: this.config.organizationId,
            contact_type: 'customer',
            ...params,
          },
        });
      return { contacts: response.data.contacts };
    } catch (error) {
      console.error('[Zoho] Error fetching customers:', error);
      throw error;
    }
  }

  async createCustomer(customer: Partial<ZohoCustomer>): Promise<ZohoCustomer> {
    try {
      const response: AxiosResponse<{ code: number; message: string; contact: ZohoCustomer }> = 
        await this.client.post('/contacts', 
          {
            ...customer,
            contact_type: 'customer',
            organization_id: this.config.organizationId
          }
        );
      return response.data.contact;
    } catch (error) {
      console.error('[Zoho] Error creating customer:', error);
      throw error;
    }
  }

  // Inventory Operations
  async getInventoryLevel(itemId: string, warehouseId?: string): Promise<{
    stock_on_hand: number;
    available_stock: number;
    actual_available_stock: number;
  }> {
    try {
      const response = await this.client.get(`/items/${itemId}`, {
        params: {
          organization_id: this.config.organizationId,
        },
      });
      
      const item = response.data.item;
      if (warehouseId && item.warehouse_details) {
        const warehouse = item.warehouse_details.find((w: any) => w.warehouse_id === warehouseId);
        if (warehouse) {
          return {
            stock_on_hand: warehouse.warehouse_stock_on_hand,
            available_stock: warehouse.warehouse_available_stock,
            actual_available_stock: warehouse.warehouse_actual_available_stock,
          };
        }
      }

      return {
        stock_on_hand: item.stock_on_hand,
        available_stock: item.available_stock,
        actual_available_stock: item.actual_available_stock,
      };
    } catch (error) {
      console.error(`[Zoho] Error fetching inventory for item ${itemId}:`, error);
      throw error;
    }
  }

  // Webhook Operations
  async createWebhook(webhookUrl: string, events: string[]): Promise<any> {
    try {
      const response = await this.client.post('/settings/webhooks', {
        organization_id: this.config.organizationId,
        webhook_url: webhookUrl,
        events: events,
      });
      return response.data;
    } catch (error) {
      console.error('[Zoho] Error creating webhook:', error);
      throw error;
    }
  }

  // Utility method to test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/organizations', {
        params: {
          organization_id: this.config.organizationId,
        },
      });
      return true;
    } catch (error) {
      console.error('[Zoho] Connection test failed:', error);
      return false;
    }
  }

  // Health check method
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    try {
      const isConnected = await this.testConnection();
      return {
        status: isConnected ? 'healthy' : 'unhealthy',
        message: isConnected ? 'Zoho Inventory connection is healthy' : 'Failed to connect to Zoho Inventory'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Zoho Inventory health check failed: ${error}`
      };
    }
  }
}

// Factory function to create Zoho client
export function createZohoClient(config: ZohoConfig): ZohoInventoryClient {
  return new ZohoInventoryClient(config);
}