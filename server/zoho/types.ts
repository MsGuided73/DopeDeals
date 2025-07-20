// Zoho Inventory API Types and Interfaces

export interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  organizationId: string;
  baseUrl: string;
  warehouse?: {
    defaultWarehouseId: string;
    warehouseName: string;
    isSharedWarehouse: boolean;
    parentEntity: string;
  };
}

export interface ZohoAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// Zoho Product Types
export interface ZohoProduct {
  item_id: string;
  name: string;
  sku: string;
  description: string;
  rate: number;
  unit: string;
  tax_id?: string;
  tax_name?: string;
  tax_percentage?: number;
  item_type: 'inventory' | 'non_inventory' | 'service';
  product_type: 'goods' | 'service';
  is_taxable: boolean;
  tax_exemption_id?: string;
  status: 'active' | 'inactive';
  source: 'user' | 'import';
  is_combo_product: boolean;
  is_linked_with_zohocrm: boolean;
  zcrm_product_id?: string;
  category_id?: string;
  category_name?: string;
  brand?: string;
  manufacturer?: string;
  weight?: number;
  weight_unit?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  custom_fields?: Array<{
    customfield_id: string;
    label: string;
    value: string;
  }>;
  tags?: string[];
  documents?: Array<{
    document_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
  }>;
  images?: Array<{
    image_id: string;
    image_name: string;
    image_type: string;
    image_document_id: string;
  }>;
  created_time: string;
  last_modified_time: string;
  package_details?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    dimension_unit: string;
    weight_unit: string;
  };
  warehouse_details?: Array<{
    warehouse_id: string;
    warehouse_name: string;
    warehouse_stock_on_hand: number;
    warehouse_available_stock: number;
    warehouse_actual_available_stock: number;
    warehouse_actual_available_stock_formatted: string;
    warehouse_stock_on_hand_formatted: string;
    warehouse_available_stock_formatted: string;
  }>;
  stock_on_hand: number;
  available_stock: number;
  actual_available_stock: number;
  committed_stock: number;
  available_for_sale_stock: number;
  stock_on_hand_formatted: string;
  available_stock_formatted: string;
  actual_available_stock_formatted: string;
  committed_stock_formatted: string;
  available_for_sale_stock_formatted: string;
}

export interface ZohoProductsResponse {
  code: number;
  message: string;
  items: ZohoProduct[];
  page_context: {
    page: number;
    per_page: number;
    has_more_page: boolean;
    report_name: string;
    sort_column: string;
    sort_order: string;
  };
}

// Zoho Category Types
export interface ZohoCategory {
  category_id: string;
  category_name: string;
  description?: string;
  parent_category_id?: string;
  parent_category_name?: string;
  has_child: boolean;
  is_sub_category: boolean;
  status: 'active' | 'inactive';
  created_time: string;
  last_modified_time: string;
}

export interface ZohoCategoriesResponse {
  code: number;
  message: string;
  item_categories: ZohoCategory[];
}

// Zoho Order Types
export interface ZohoOrder {
  salesorder_id: string;
  salesorder_number: string;
  reference_number?: string;
  date: string;
  shipment_date?: string;
  delivery_date?: string;
  due_date?: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'closed' | 'void';
  invoice_status: 'not_invoiced' | 'invoiced' | 'partially_invoiced';
  payment_status: 'unpaid' | 'paid' | 'partially_paid';
  shipping_charge: number;
  adjustment: number;
  sub_total: number;
  tax_total: number;
  total: number;
  currency_id: string;
  currency_code: string;
  exchange_rate: number;
  discount: number;
  is_discount_before_tax: boolean;
  discount_type: 'entity_level' | 'item_level';
  discount_percentage?: number;
  line_items: Array<{
    line_item_id: string;
    item_id: string;
    name: string;
    description?: string;
    rate: number;
    quantity: number;
    unit: string;
    discount?: number;
    tax_id?: string;
    tax_name?: string;
    tax_type?: string;
    tax_percentage?: number;
    item_total: number;
    item_custom_fields?: Array<{
      customfield_id: string;
      label: string;
      value: string;
    }>;
  }>;
  shipping_address?: ZohoAddress;
  billing_address?: ZohoAddress;
  notes?: string;
  terms?: string;
  custom_fields?: Array<{
    customfield_id: string;
    label: string;
    value: string;
  }>;
  template_id?: string;
  created_time: string;
  last_modified_time: string;
}

export interface ZohoAddress {
  address_id?: string;
  attention?: string;
  address: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  fax?: string;
}

export interface ZohoOrdersResponse {
  code: number;
  message: string;
  salesorders: ZohoOrder[];
  page_context: {
    page: number;
    per_page: number;
    has_more_page: boolean;
    report_name: string;
    sort_column: string;
    sort_order: string;
  };
}

// Zoho Customer Types
export interface ZohoCustomer {
  contact_id: string;
  contact_name: string;
  company_name?: string;
  contact_type: 'customer' | 'vendor' | 'employee';
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  designation?: string;
  department?: string;
  status: 'active' | 'inactive' | 'crm';
  payment_terms?: number;
  payment_terms_label?: string;
  currency_id: string;
  currency_code: string;
  outstanding_receivable_amount: number;
  unused_credits_receivable_amount: number;
  first_name_formatted?: string;
  last_name_formatted?: string;
  billing_address?: ZohoAddress;
  shipping_address?: ZohoAddress;
  contact_persons?: Array<{
    contact_person_id: string;
    salutation?: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    mobile?: string;
    designation?: string;
    department?: string;
    skype?: string;
    is_primary_contact: boolean;
  }>;
  custom_fields?: Array<{
    customfield_id: string;
    label: string;
    value: string;
  }>;
  notes?: string;
  created_time: string;
  last_modified_time: string;
}

// Webhook Types
export interface ZohoWebhookEvent {
  event_id: string;
  event_type: string;
  event_time: string;
  organization_id: string;
  data: {
    resource_type: string;
    resource_id: string;
    resource_url: string;
    operation: 'create' | 'update' | 'delete';
    data: any;
  };
}

// Sync Status Types
export interface SyncStatus {
  id: string;
  resourceType: 'product' | 'category' | 'order' | 'customer';
  resourceId: string;
  zohoId: string;
  localId: string;
  lastSynced: Date;
  syncStatus: 'success' | 'failed' | 'pending';
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Data Mapping Types
export interface ProductMapping {
  zohoField: keyof ZohoProduct;
  localField: string;
  transformer?: (value: any) => any;
  required: boolean;
}

export interface CategoryMapping {
  zohoField: keyof ZohoCategory;
  localField: string;
  transformer?: (value: any) => any;
  required: boolean;
}

export interface OrderMapping {
  zohoField: keyof ZohoOrder;
  localField: string;
  transformer?: (value: any) => any;
  required: boolean;
}

// API Response Types
export interface ZohoApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

// Configuration Types
export interface ZohoIntegrationConfig {
  enabled: boolean;
  syncInterval: number; // in minutes
  batchSize: number;
  retryAttempts: number;
  retryDelay: number; // in milliseconds
  webhookUrl: string;
  webhookSecret: string;
  autoSync: {
    products: boolean;
    categories: boolean;
    orders: boolean;
    customers: boolean;
    inventory: boolean;
  };
  mapping: {
    products: ProductMapping[];
    categories: CategoryMapping[];
    orders: OrderMapping[];
  };
  conflictResolution: {
    strategy: 'zoho_wins' | 'local_wins' | 'merge' | 'manual';
    fields: string[];
  };
}