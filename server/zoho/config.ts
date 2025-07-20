import { ZohoConfig, ZohoIntegrationConfig, ProductMapping, CategoryMapping, OrderMapping } from './types.js';

// Zoho API Configuration
export function getZohoConfig(): ZohoConfig {
  return {
    clientId: process.env.ZOHO_CLIENT_ID || '',
    clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
    refreshToken: process.env.ZOHO_REFRESH_TOKEN || '',
    organizationId: process.env.ZOHO_ORGANIZATION_ID || '',
    baseUrl: process.env.ZOHO_BASE_URL || 'https://www.zohoapis.com/inventory/v1',
    warehouse: {
      defaultWarehouseId: process.env.ZOHO_WAREHOUSE_ID || '',
      warehouseName: process.env.ZOHO_WAREHOUSE_NAME || 'Cash & Carry Default',
      isSharedWarehouse: true,
      parentEntity: 'BMB Wholesale INC. Cash & Carry'
    }
  };
}

// Default Product Field Mappings
export const defaultProductMappings: ProductMapping[] = [
  {
    zohoField: 'name',
    localField: 'name',
    required: true
  },
  {
    zohoField: 'description',
    localField: 'description',
    required: false
  },
  {
    zohoField: 'rate',
    localField: 'price',
    transformer: (value: number) => value.toString(),
    required: true
  },
  {
    zohoField: 'sku',
    localField: 'sku',
    required: true
  },
  {
    zohoField: 'available_stock',
    localField: 'inStock',
    transformer: (value: number) => value > 0,
    required: false
  },
  {
    zohoField: 'brand',
    localField: 'brandId',
    transformer: (value: string) => mapBrandNameToId(value),
    required: false
  },
  {
    zohoField: 'category_name',
    localField: 'categoryId',
    transformer: (value: string) => mapCategoryNameToId(value),
    required: false
  }
];

// Default Category Field Mappings
export const defaultCategoryMappings: CategoryMapping[] = [
  {
    zohoField: 'category_name',
    localField: 'name',
    required: true
  },
  {
    zohoField: 'description',
    localField: 'description',
    required: false
  },
  {
    zohoField: 'category_name',
    localField: 'slug',
    transformer: (value: string) => value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    required: true
  }
];

// Default Order Field Mappings
export const defaultOrderMappings: OrderMapping[] = [
  {
    zohoField: 'total',
    localField: 'totalAmount',
    required: true
  },
  {
    zohoField: 'status',
    localField: 'status',
    transformer: (value: string) => mapZohoOrderStatus(value),
    required: true
  },
  {
    zohoField: 'customer_id',
    localField: 'userId',
    transformer: (value: string) => mapZohoCustomerToUserId(value),
    required: true
  }
];

// Default Integration Configuration
export function getDefaultZohoIntegrationConfig(): ZohoIntegrationConfig {
  return {
    enabled: process.env.ZOHO_INTEGRATION_ENABLED === 'true',
    syncInterval: parseInt(process.env.ZOHO_SYNC_INTERVAL || '30'), // 30 minutes
    batchSize: parseInt(process.env.ZOHO_BATCH_SIZE || '50'),
    retryAttempts: parseInt(process.env.ZOHO_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.ZOHO_RETRY_DELAY || '5000'), // 5 seconds
    webhookUrl: process.env.ZOHO_WEBHOOK_URL || `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/zoho/webhook`,
    webhookSecret: process.env.ZOHO_WEBHOOK_SECRET || '',
    autoSync: {
      products: process.env.ZOHO_AUTO_SYNC_PRODUCTS !== 'false',
      categories: process.env.ZOHO_AUTO_SYNC_CATEGORIES !== 'false',
      orders: process.env.ZOHO_AUTO_SYNC_ORDERS !== 'false',
      customers: process.env.ZOHO_AUTO_SYNC_CUSTOMERS !== 'false',
      inventory: process.env.ZOHO_AUTO_SYNC_INVENTORY !== 'false'
    },
    mapping: {
      products: defaultProductMappings,
      categories: defaultCategoryMappings,
      orders: defaultOrderMappings
    },
    conflictResolution: {
      strategy: (process.env.ZOHO_CONFLICT_STRATEGY as any) || 'zoho_wins',
      fields: process.env.ZOHO_CONFLICT_FIELDS?.split(',') || ['price', 'description', 'stock']
    }
  };
}

// Helper Functions for Mapping
function mapBrandNameToId(brandName: string): string {
  // This should map Zoho brand names to local brand IDs
  // For now, return a default or create mapping logic
  const brandMapping: Record<string, string> = {
    'VIP Signature': 'vip-signature-id',
    'Royal Glass': 'royal-glass-id',
    'Crown Collection': 'crown-collection-id',
    'Platinum Works': 'platinum-works-id',
    'Gold Standard': 'gold-standard-id'
  };
  
  return brandMapping[brandName] || 'default-brand-id';
}

function mapCategoryNameToId(categoryName: string): string {
  // This should map Zoho category names to local category IDs
  const categoryMapping: Record<string, string> = {
    'Glass Pipes': 'glass-pipes-id',
    'Dab Rigs': 'dab-rigs-id',
    'Glass Bongs': 'glass-bongs-id',
    'Accessories': 'accessories-id',
    'Water Pipes': 'dab-rigs-id', // Map old water pipes to dab rigs
    'Vaporizers': 'glass-bongs-id' // Map vaporizers to glass bongs
  };
  
  return categoryMapping[categoryName] || 'default-category-id';
}

function mapZohoOrderStatus(zohoStatus: string): string {
  const statusMapping: Record<string, string> = {
    'draft': 'pending',
    'sent': 'pending',
    'accepted': 'confirmed',
    'declined': 'cancelled',
    'closed': 'completed',
    'void': 'cancelled'
  };
  
  return statusMapping[zohoStatus] || 'pending';
}

function mapZohoCustomerToUserId(zohoCustomerId: string): string {
  // This would need to be implemented based on your customer mapping strategy
  // For now, return the zoho ID as placeholder
  return zohoCustomerId;
}

// Validation Functions
export function validateZohoConfig(config: ZohoConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.clientId) errors.push('ZOHO_CLIENT_ID is required');
  if (!config.clientSecret) errors.push('ZOHO_CLIENT_SECRET is required');
  if (!config.refreshToken) errors.push('ZOHO_REFRESH_TOKEN is required');
  if (!config.organizationId) errors.push('ZOHO_ORGANIZATION_ID is required');
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateIntegrationConfig(config: ZohoIntegrationConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.syncInterval < 5) errors.push('Sync interval must be at least 5 minutes');
  if (config.batchSize < 1 || config.batchSize > 200) errors.push('Batch size must be between 1 and 200');
  if (config.retryAttempts < 0 || config.retryAttempts > 10) errors.push('Retry attempts must be between 0 and 10');
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Environment Variables Documentation
export const requiredEnvironmentVariables = [
  {
    name: 'ZOHO_CLIENT_ID',
    description: 'Zoho OAuth Client ID',
    required: true
  },
  {
    name: 'ZOHO_CLIENT_SECRET',
    description: 'Zoho OAuth Client Secret',
    required: true
  },
  {
    name: 'ZOHO_REFRESH_TOKEN',
    description: 'Zoho OAuth Refresh Token',
    required: true
  },
  {
    name: 'ZOHO_ORGANIZATION_ID',
    description: 'Zoho Organization ID',
    required: true
  },
  {
    name: 'ZOHO_INTEGRATION_ENABLED',
    description: 'Enable/disable Zoho integration (true/false)',
    required: false,
    default: 'false'
  },
  {
    name: 'ZOHO_SYNC_INTERVAL',
    description: 'Sync interval in minutes',
    required: false,
    default: '30'
  },
  {
    name: 'ZOHO_BATCH_SIZE',
    description: 'Number of records to process in each batch',
    required: false,
    default: '50'
  },
  {
    name: 'ZOHO_WEBHOOK_SECRET',
    description: 'Secret for webhook verification',
    required: false
  },
  {
    name: 'ZOHO_CONFLICT_STRATEGY',
    description: 'Conflict resolution strategy (zoho_wins|local_wins|merge|manual)',
    required: false,
    default: 'zoho_wins'
  }
];